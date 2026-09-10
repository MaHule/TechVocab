// miniprogram/pages/article-detail/article-detail.js
const store = require('../../data/store.js');
const readerDict = require('../../data/reader_dict.js');
const audioPlayer = require('../../utils/audio_player.js');

Page({
  data: {
    statusBarHeight: 44,
    navBarHeight: 44,
    article: {},
    tokenizedParagraphs: [],
    selectedWord: '',
    activeLookup: {},
    isDrawerVisible: false,
    isCollected: false,
    fontSizeLevel: 'normal', // 'normal' | 'large'
    playingParaId: '', // 当前正在朗读的段落 ID
    isPlayingDrawerAudio: false // 抽屉中单词是否正在发音
  },

  onLoad(options) {
    const app = (typeof getApp === 'function' && getApp()) || {};
    const globalData = app.globalData || {};
    const articleId = (options && (options.id || options.articleId)) || 'art_net_01';

    // 从数据中心加载文章
    const article = store.getArticleById(articleId);
    const tokenized = readerDict.tokenizeArticle(article);

    this.setData({
      statusBarHeight: globalData.statusBarHeight || 44,
      navBarHeight: globalData.navBarHeight || 44,
      article: article,
      tokenizedParagraphs: tokenized,
      selectedWord: '',
      activeLookup: {},
      isDrawerVisible: false,
      isCollected: false
    });

    // 记录为最新上次阅读文章
    store.updateArticleReadingProgress(article.id, article.readPercent || 20);
  },

  onShow() {
    if (this.data.activeLookup && this.data.activeLookup.word) {
      this.setData({
        isCollected: store.isWordCollected(this.data.activeLookup.word)
      });
    }
  },

  // 监听文章滚动，动态计算并沉淀阅读进度
  onScrollArticle(e) {
    const { scrollTop, scrollHeight } = e.detail;
    if (scrollHeight > 0) {
      const percent = Math.min(100, Math.max(10, Math.round((scrollTop / (scrollHeight - 400)) * 100)));
      if (this.data.article && this.data.article.id && Math.abs((this.data.article.readPercent || 0) - percent) > 5) {
        this.setData({ 'article.readPercent': percent });
        store.updateArticleReadingProgress(this.data.article.id, percent);
      }
    }
  },

  // 规范化返回按钮
  onTapBack() {
    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'light' });
    }
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack();
    } else {
      wx.reLaunch({
        url: '/pages/reader/reader'
      });
    }
  },

  // 粘贴外部文本动态分词
  onTapPasteText() {
    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'light' });
    }
    wx.showModal({
      title: '粘贴外部英文技术文本',
      editable: true,
      placeholderText: '粘贴一段英文文档片段、Issue 或报错日志...',
      success: (res) => {
        if (res.confirm && res.content && res.content.trim()) {
          const userText = res.content.trim();
          const rawParas = userText.split(/\n+/).map(p => p.trim()).filter(Boolean);
          const tokenized = rawParas.map((text, idx) => ({
            id: `user_p_${idx + 1}`,
            rawText: text,
            zhText: "💡 提示：该段为外部导入文本，已开启全量单词点词查义。点击上方任意单词即可查看详细专业释义并加入生词本。",
            isZhOpen: false,
            tokens: readerDict.tokenizeParagraph(text, idx + 1)
          }));

          this.setData({
            'article.title': '自定义阅读片段 (User Snippet)',
            'article.sourceName': '外部导入 · 自定义',
            'article.readTime': '1 分钟速览',
            'article.wordCount': `${userText.split(/\s+/).length} 词`,
            'article.categoryName': '开发者自定义语境',
            tokenizedParagraphs: tokenized,
            selectedWord: '',
            activeLookup: {},
            isCollected: false,
            isDrawerVisible: false
          });
          wx.showToast({
            title: '已分词并载入文本',
            icon: 'success'
          });
        }
      }
    });
  },

  // 段落级中文对照展开/折叠 (方案 A)
  onToggleSingleZh(e) {
    const paraId = e.currentTarget.dataset.id;
    if (!paraId) return;

    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'light' });
    }

    const updated = (this.data.tokenizedParagraphs || []).map(p => {
      if (p.id === paraId) {
        return { ...p, isZhOpen: !p.isZhOpen };
      }
      return p;
    });

    this.setData({
      tokenizedParagraphs: updated
    });
  },

  // 切换字号 (A- / A+)
  onToggleFontSize() {
    const nextLevel = this.data.fontSizeLevel === 'normal' ? 'large' : 'normal';
    this.setData({
      fontSizeLevel: nextLevel
    });
    wx.showToast({
      title: nextLevel === 'large' ? '已放大字号' : '已恢复默认字号',
      icon: 'none',
      duration: 600
    });
  },

  // 点击正文中任意词触发查词
  onTapWord(e) {
    const wordKey = e.currentTarget.dataset.word;
    if (!wordKey) return;

    // 如果当前正在朗读段落，点击查词时停止段落朗读避免杂音
    if (this.data.playingParaId) {
      audioPlayer.stop();
      this.setData({ playingParaId: '' });
    }

    const termInfo = readerDict.lookupWord(wordKey);

    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'light' });
    }

    const collected = store.isWordCollected(termInfo.word || wordKey);

    this.setData({
      selectedWord: wordKey.toLowerCase(),
      activeLookup: termInfo,
      isDrawerVisible: true,
      isCollected: collected,
      isPlayingDrawerAudio: false
    });
  },

  // 关闭底部查词抽屉
  onCloseDrawer() {
    if (this.data.isPlayingDrawerAudio) {
      audioPlayer.stop();
    }
    this.setData({
      isDrawerVisible: false,
      selectedWord: '',
      isPlayingDrawerAudio: false
    });
  },

  // 加入生词本 (主行动)
  onAddToNotebook() {
    if (!this.data.activeLookup || !this.data.activeLookup.word) return;
    if (this.data.isCollected) return;

    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'medium' });
    }

    const currentWord = this.data.activeLookup || {};
    store.addWordToNotebook({
      word: currentWord.word,
      phonetic: currentWord.phonetic,
      pos: currentWord.pos,
      specTag: currentWord.specTag,
      categoryName: currentWord.categoryName,
      generalDefinition: currentWord.generalDefinition,
      techDefinition: currentWord.techDefinition,
      techDetail: currentWord.techDetail,
      designMetaphor: currentWord.designMetaphor,
      typicalContext: currentWord.typicalContext,
      source: "文档阅读"
    });

    this.setData({
      isCollected: true
    });

    wx.showToast({
      title: '已入库，今晚回炉复习',
      icon: 'success',
      duration: 1200
    });
  },

  // 播放抽屉中单词标准发音 (集成权威真人发音流)
  onPlayAudio() {
    const currentWord = this.data.activeLookup && this.data.activeLookup.word;
    if (!currentWord) return;

    if (this.data.isPlayingDrawerAudio) {
      audioPlayer.stop();
      this.setData({ isPlayingDrawerAudio: false });
      return;
    }

    this.setData({ isPlayingDrawerAudio: true });

    audioPlayer.playWord(currentWord, {
      accent: 'us',
      onPlay: () => {
        this.setData({ isPlayingDrawerAudio: true });
      },
      onEnded: () => {
        this.setData({ isPlayingDrawerAudio: false });
      },
      onStop: () => {
        this.setData({ isPlayingDrawerAudio: false });
      },
      onError: () => {
        this.setData({ isPlayingDrawerAudio: false });
      }
    });
  },

  // 切换段落英文原声朗读 (伴读)
  onTogglePlayParagraph(e) {
    const { id, text } = e.currentTarget.dataset;
    if (!id || !text) return;

    // 若当前正是该段落正在播放，则暂停/停止
    if (this.data.playingParaId === id) {
      audioPlayer.stop();
      this.setData({ playingParaId: '' });
      return;
    }

    // 切换到当前段落朗读
    this.setData({ playingParaId: id });

    audioPlayer.playParagraph(text, {
      id: id,
      onPlay: () => {
        this.setData({ playingParaId: id });
      },
      onEnded: () => {
        if (this.data.playingParaId === id) {
          this.setData({ playingParaId: '' });
        }
      },
      onStop: () => {
        if (this.data.playingParaId === id) {
          this.setData({ playingParaId: '' });
        }
      },
      onError: () => {
        if (this.data.playingParaId === id) {
          this.setData({ playingParaId: '' });
        }
      }
    });
  },

  // 直通完整专业词卡
  onViewFullCard() {
    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'light' });
    }
    const wordKey = this.data.activeLookup && this.data.activeLookup.word;
    if (!wordKey) return;
    wx.navigateTo({
      url: `/pages/flashcard/flashcard?word=${wordKey}`
    });
  },

  // 页面离开时终止所有音频
  onHide() {
    audioPlayer.stop();
    this.setData({
      playingParaId: '',
      isPlayingDrawerAudio: false
    });
  },

  onUnload() {
    audioPlayer.stop();
  }
});
