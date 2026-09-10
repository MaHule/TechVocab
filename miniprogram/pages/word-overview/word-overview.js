// miniprogram/pages/word-overview/word-overview.js
const store = require('../../data/store.js');
const audioPlayer = require('../../utils/audio_player.js');

Page({
  data: {
    statusBarHeight: 44,
    navBarHeight: 44,
    moduleId: 'mod_net_01',
    module: {},
    filterTabs: [],
    currentFilter: 'all', // 'all' | 'need_review' | 'mastered'
    searchKeyword: '',
    sortMode: 'default', // 'default' | 'asc'
    allWords: [],
    filteredWords: [],
    displaySections: [],
    playingWord: '' // 当前发音的单词
  },

  onLoad(options = {}) {
    const app = (typeof getApp === 'function' && getApp()) || {};
    const globalData = app.globalData || {};
    const targetModuleId = options.moduleId || 'mod_net_01';

    this.setData({
      statusBarHeight: globalData.statusBarHeight || 44,
      navBarHeight: globalData.navBarHeight || 44,
      moduleId: targetModuleId
    });

    this.loadModuleData();
  },

  onShow() {
    // 页面唤起或从单词卡返回时，刷新掌握状态与最新进度
    this.loadModuleData();
  },

  loadModuleData() {
    const data = store.getModuleOverviewData(this.data.moduleId);
    this.setData({
      module: data.module,
      filterTabs: data.filterTabs,
      allWords: data.allWords
    }, () => {
      this.applyFilter(this.data.currentFilter, this.data.searchKeyword, this.data.sortMode);
    });
  },

  // 综合过滤与搜索计算
  applyFilter(filterKey, keyword, sortMode) {
    const words = this.data.allWords || [];
    let list = [...words];

    // 1. 状态筛选 (全部 / 待学习 / 已掌握)
    if (filterKey === 'need_review') {
      list = list.filter(w => w.status !== 'mastered');
    } else if (filterKey === 'mastered') {
      list = list.filter(w => w.status === 'mastered');
    }

    // 2. 关键字搜索 (英文词名、生活常释、技术释义、场景)
    if (keyword) {
      const q = keyword.toLowerCase();
      list = list.filter(w => {
        const matchWord = (w.word || '').toLowerCase().includes(q);
        const matchLife = (w.generalDefinition || '').toLowerCase().includes(q);
        const matchTech = (w.techDefinition || '').toLowerCase().includes(q) || (w.techDetail || '').toLowerCase().includes(q);
        const matchContext = (w.typicalContext || '').toLowerCase().includes(q);
        return matchWord || matchLife || matchTech || matchContext;
      });
    }

    // 3. 排序 (默认顺序 或 字母顺序)
    if (sortMode === 'asc') {
      list.sort((a, b) => a.word.localeCompare(b.word));
    }

    // 4. 重构章节分组展示
    const displaySections = [];
    const chunkSize = 6;
    for (let i = 0; i < list.length; i += chunkSize) {
      const chunk = list.slice(i, i + chunkSize);
      const secIdx = Math.floor(i / chunkSize);
      const secTitle = `SECTION 0${secIdx + 1} · ${secIdx === 0 ? '核心协议与传输控制' : '进阶处理与架构抽象'}`;
      displaySections.push({
        id: `sec_${secIdx + 1}`,
        title: secTitle,
        words: chunk
      });
    }

    this.setData({
      filteredWords: list,
      displaySections: displaySections
    });
  },

  // 返回上一级
  onTapBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack();
    } else {
      wx.reLaunch({
        url: '/pages/home/home'
      });
    }
  },

  // 状态筛选切换
  onSelectFilter(e) {
    const filterKey = e.currentTarget.dataset.key;
    if (filterKey === this.data.currentFilter) return;

    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'light' });
    }

    this.setData({
      currentFilter: filterKey
    });

    this.applyFilter(filterKey, this.data.searchKeyword, this.data.sortMode);
  },

  // 搜索输入
  onSearchInput(e) {
    const val = (e.detail.value || '').trim();
    this.setData({
      searchKeyword: val
    });
    this.applyFilter(this.data.currentFilter, val, this.data.sortMode);
  },

  // 清空搜索
  onClearSearch() {
    this.setData({
      searchKeyword: ''
    });
    this.applyFilter(this.data.currentFilter, '', this.data.sortMode);
  },

  // 切换排序方式
  onToggleSort() {
    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'light' });
    }
    const nextSort = this.data.sortMode === 'default' ? 'asc' : 'default';
    this.setData({
      sortMode: nextSort
    });
    this.applyFilter(this.data.currentFilter, this.data.searchKeyword, nextSort);
  },

  // 点击单个单词卡 -> 直达该单词的 3D 卡片深度学习
  onTapWordCard(e) {
    const word = e.currentTarget.dataset.word;
    if (!word) return;

    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'light' });
    }

    wx.navigateTo({
      url: `/pages/flashcard/flashcard?word=${word}&moduleId=${this.data.moduleId}`
    });
  },

  // 底部行动：开始本模块背词流
  onStartStudy() {
    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'medium' });
    }
    wx.navigateTo({
      url: `/pages/flashcard/flashcard?moduleId=${this.data.moduleId}&mode=module`
    });
  },

  // 底部行动：直接发起客观真验闯关
  onStartQuiz() {
    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'medium' });
    }
    wx.navigateTo({
      url: `/pages/flashcard/flashcard?moduleId=${this.data.moduleId}&startQuiz=true`
    });
  },

  // 快捷播放单词发音
  onPlayWordAudio(e) {
    const word = e.currentTarget.dataset.word;
    if (!word) return;

    if (this.data.playingWord === word) {
      audioPlayer.stop();
      this.setData({ playingWord: '' });
      return;
    }

    this.setData({ playingWord: word });

    audioPlayer.playWord(word, {
      accent: 'us',
      onPlay: () => this.setData({ playingWord: word }),
      onEnded: () => {
        if (this.data.playingWord === word) {
          this.setData({ playingWord: '' });
        }
      },
      onStop: () => {
        if (this.data.playingWord === word) {
          this.setData({ playingWord: '' });
        }
      },
      onError: () => {
        if (this.data.playingWord === word) {
          this.setData({ playingWord: '' });
        }
      }
    });
  },

  onHide() {
    audioPlayer.stop();
    this.setData({ playingWord: '' });
  },

  onUnload() {
    audioPlayer.stop();
  }
});
