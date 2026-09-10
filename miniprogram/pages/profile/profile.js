// miniprogram/pages/profile/profile.js
const store = require('../../data/store.js');

Page({
  data: {
    statusBarHeight: 44,
    navBarHeight: 44,
    user: {
      nickname: "VibeCoder",
      targetDomain: "后端研发 / 云原生架构师",
      syncStatus: "已同步云端"
    },
    stats: {
      masteredWords: 16,
      streakDays: 0,
      collectedWords: 24,
      readArticles: 12
    },
    moduleProgress: [],
    settings: []
  },

  onLoad() {
    const app = (typeof getApp === 'function' && getApp()) || {};
    const globalData = app.globalData || {};
    this.setData({
      statusBarHeight: globalData.statusBarHeight || 44,
      navBarHeight: globalData.navBarHeight || 44
    });
    this.loadProfileData();
  },

  onShow() {
    // 页面展示时刷新最新掌握词数与生词本词数
    this.loadProfileData();
  },

  loadProfileData() {
    const profileData = store.getProfileData();
    this.setData({
      user: profileData.user,
      stats: profileData.stats,
      moduleProgress: profileData.moduleProgress,
      settings: profileData.settings
    });
  },

  // 点击技术词库模块卡片 -> 直达该模块的单词总览
  onTapModule(e) {
    const moduleId = e.currentTarget.dataset.id;
    if (!moduleId) return;

    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'light' });
    }

    wx.navigateTo({
      url: `/pages/word-overview/word-overview?moduleId=${moduleId}`
    });
  },

  // 点击设置项交互
  onTapSetting(e) {
    const settingId = e.currentTarget.dataset.id;
    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'light' });
    }

    switch (settingId) {
      case 'daily_goal':
        wx.showActionSheet({
          itemList: ['10 词 / 天 (轻松筑基)', '20 词 / 天 (推荐进阶)', '30 词 / 天 (高强度冲刺)'],
          success: (res) => {
            const goalValues = [10, 20, 30];
            const selectedGoal = goalValues[res.tapIndex];
            store.updateDailyGoal(selectedGoal);
            this.loadProfileData();
            wx.showToast({ title: '目标已更新', icon: 'success' });
          }
        });
        break;

      case 'review_alarm':
        wx.showToast({
          title: '已设置每日 21:00 复习通知',
          icon: 'none'
        });
        break;

      case 'custom_import':
        wx.showModal({
          title: '自定义词单导入 (Beta)',
          content: '支持导入 Markdown、JSON 或纯文本代码报错日志，自动提取专业词汇并生成卡片。当前内测中，即将开放。',
          showCancel: false,
          confirmText: '期待上线'
        });
        break;

      case 'about':
        wx.showModal({
          title: 'TechVocab 码词',
          content: '专为计算机与软件工程学习者打造的双闭环技术英语学习小程序。\n版本：v1.0.0 (MVP)\n致敬所有手敲代码、探索技术的开发者。',
          showCancel: false,
          confirmText: '确认'
        });
        break;

      default:
        break;
    }
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
    if (targetUrl && targetUrl !== '/pages/profile/profile') {
      wx.reLaunch({
        url: targetUrl
      });
    }
  }
});
