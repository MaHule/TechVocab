// miniprogram/pages/notebook/notebook.js
const store = require('../../data/store.js');
const audioPlayer = require('../../utils/audio_player.js');

Page({
  data: {
    statusBarHeight: 44,
    navBarHeight: 44,
    stats: {
      totalWords: 24,
      needReviewCount: 8,
      masteredCount: 16,
      reviewBreakdown: "包含 8 个待回炉巩固生词"
    },
    filterTabs: [
      { key: "all", label: "全部", count: 24 },
      { key: "need_review", label: "待复习", count: 8 },
      { key: "mastered", label: "已掌握", count: 16 }
    ],
    currentFilter: 'all', // 默认展示全部，与真实 24 词完整对齐
    allWords: [],
    filteredWords: [],
    searchKeyword: '',
    playingWord: '' // 当前正在发音的生词
  },

  onLoad() {
    const app = (typeof getApp === 'function' && getApp()) || {};
    const globalData = app.globalData || {};
    this.setData({
      statusBarHeight: globalData.statusBarHeight || 44,
      navBarHeight: globalData.navBarHeight || 44
    });
    this.loadNotebookData();
  },

  onShow() {
    // 页面唤起或切回时同步最新数据中心状态
    this.loadNotebookData();
  },

  loadNotebookData() {
    const nbData = store.getNotebookData();
    this.setData({
      stats: nbData.stats,
      filterTabs: nbData.filterTabs,
      allWords: nbData.words
    }, () => {
      this.applyFilter(this.data.currentFilter, this.data.searchKeyword);
    });
  },

  // 切换筛选分类 (全部 / 待复习 / 已掌握)
  onSelectFilter(e) {
    const filterKey = e.currentTarget.dataset.key;
    if (filterKey === this.data.currentFilter) return;

    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'light' });
    }

    this.setData({
      currentFilter: filterKey
    });

    this.applyFilter(filterKey, this.data.searchKeyword);
  },

  // 搜索框输入过滤
  onSearchInput(e) {
    const keyword = (e.detail.value || '').trim().toLowerCase();
    this.setData({
      searchKeyword: keyword
    });
    this.applyFilter(this.data.currentFilter, keyword);
  },

  // 综合过滤逻辑
  applyFilter(filterKey, keyword) {
    let list = this.data.allWords || [];

    // 1. 分类筛选
    if (filterKey === 'need_review') {
      list = list.filter(item => item.status === 'need_review');
    } else if (filterKey === 'mastered') {
      list = list.filter(item => item.status === 'mastered');
    }

    // 2. 关键词过滤
    if (keyword) {
      list = list.filter(item => {
        return (item.word && item.word.toLowerCase().includes(keyword)) ||
               (item.techDefinition && item.techDefinition.toLowerCase().includes(keyword)) ||
               (item.source && item.source.toLowerCase().includes(keyword));
      });
    }

    this.setData({
      filteredWords: list
    });
  },

  // 快捷标记为已掌握
  onMarkMastered(e) {
    const id = e.currentTarget.dataset.id;
    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'medium' });
    }

    const nbData = store.markWordMastered(id);
    this.setData({
      stats: nbData.stats,
      filterTabs: nbData.filterTabs,
      allWords: nbData.words
    }, () => {
      this.applyFilter(this.data.currentFilter, this.data.searchKeyword);
    });

    wx.showToast({
      title: '已标记为掌握 ✓',
      icon: 'success',
      duration: 800
    });
  },

  // 移出生词本
  onRemoveWord(e) {
    const id = e.currentTarget.dataset.id;
    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'light' });
    }

    const nbData = store.removeWordFromNotebook(id);
    this.setData({
      stats: nbData.stats,
      filterTabs: nbData.filterTabs,
      allWords: nbData.words
    }, () => {
      this.applyFilter(this.data.currentFilter, this.data.searchKeyword);
    });

    wx.showToast({
      title: '已移出生词本',
      icon: 'none',
      duration: 800
    });
  },

  // 点击词卡进入对应单词的专属卡片学习
  onTapWordCard(e) {
    const item = e.currentTarget.dataset.item;
    if (!item) return;

    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'light' });
    }

    wx.navigateTo({
      url: `/pages/flashcard/flashcard?wordId=${item.id}&word=${item.word}`
    });
  },

  // 开始复习 (CTA)
  onStartReview() {
    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'medium' });
    }

    wx.showToast({
      title: '拉取复习队列...',
      icon: 'loading',
      duration: 500
    });

    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/flashcard/flashcard?mode=review'
      });
    }, 400);
  },

  // 底部 Tab 切换
  onSwitchTab(e) {
    const targetTab = e.currentTarget.dataset.tab;
    const urlMap = {
      'home': '/pages/home/home',
      'reader': '/pages/reader/reader',
      'notebook': '/pages/notebook/notebook',
      'profile': '/pages/profile/profile'
    };

    const targetUrl = urlMap[targetTab];
    if (targetUrl && targetUrl !== '/pages/notebook/notebook') {
      wx.reLaunch({
        url: targetUrl
      });
    }
  },

  // 播放生词发音
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
