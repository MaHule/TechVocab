// miniprogram/pages/home/home.js
const store = require('../../data/store.js');

Page({
  data: {
    statusBarHeight: 44,
    navBarHeight: 44,
    todayProgress: {
      current: 5,
      goal: 20,
      remain: 15,
      percent: 25,
      streakDays: 0
    },
    reviewAlert: {
      count: 8,
      label: "生词本有 8 个技术生词待回炉巩固"
    },
    moduleList: [],
    readerTeaser: {
      title: "技术长文精读 · TCP 协议与幂等性",
      desc: "RFC 7231 / 793 原文精读 · 全量单词查义与双语对照",
      btnText: "开始阅读 ›"
    }
  },

  onLoad() {
    const app = (typeof getApp === 'function' && getApp()) || {};
    const globalData = app.globalData || {};
    this.setData({
      statusBarHeight: globalData.statusBarHeight || 44,
      navBarHeight: globalData.navBarHeight || 44
    });
    this.loadHomeData();
  },

  onShow() {
    // 页面展示时刷新最新学习进度与生词本待回炉数量
    this.loadHomeData();
  },

  loadHomeData() {
    const homeData = store.getHomeData();
    this.setData({
      todayProgress: homeData.todayProgress,
      reviewAlert: homeData.reviewAlert,
      moduleList: homeData.moduleList,
      readerTeaser: homeData.readerTeaser
    });
  },

  // 主行动：继续今日背词
  onContinueStudy() {
    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'medium' });
    }
    wx.navigateTo({
      url: '/pages/flashcard/flashcard?mode=today'
    });
  },

  // 待复习轻提示：去复习
  onGoReview() {
    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'light' });
    }
    wx.reLaunch({
      url: '/pages/notebook/notebook'
    });
  },

  // 模块点击：直达该技术词库的单词总览页面
  onSelectModule(e) {
    const item = e.currentTarget.dataset.item;
    if (!item) return;

    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'light' });
    }

    wx.navigateTo({
      url: `/pages/word-overview/word-overview?moduleId=${item.id}`
    });
  },

  // 查看全部词库：进入主攻词库总览
  onTapAllModules() {
    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'light' });
    }
    wx.navigateTo({
      url: '/pages/word-overview/word-overview?moduleId=mod_net_01'
    });
  },

  // 快捷进入阅读器
  onGoReader() {
    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'light' });
    }
    wx.reLaunch({
      url: '/pages/reader/reader'
    });
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
    if (targetUrl && targetUrl !== '/pages/home/home') {
      wx.reLaunch({
        url: targetUrl
      });
    }
  }
});
