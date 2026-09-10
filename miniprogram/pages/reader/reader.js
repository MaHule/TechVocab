// miniprogram/pages/reader/reader.js
// 文章分类页面逻辑（阅读 Tab 首页）
const store = require('../../data/store.js');

Page({
  data: {
    statusBarHeight: 44,
    navBarHeight: 44,
    lastRead: {},
    categories: [],
    filteredCategories: [],
    categoriesCount: 5,
    totalArticlesCount: 36,
    searchKeyword: ''
  },

  onLoad() {
    const app = (typeof getApp === 'function' && getApp()) || {};
    const globalData = app.globalData || {};
    this.setData({
      statusBarHeight: globalData.statusBarHeight || 44,
      navBarHeight: globalData.navBarHeight || 44
    });
    this.refreshPageData();
  },

  onShow() {
    // 每次进入/返回时重新拉取最新数据（确保上次阅读状态与各领域已读进度动态对齐）
    this.refreshPageData();
  },

  // 刷新页面核心数据
  refreshPageData() {
    const pageData = store.getCategoriesPageData();
    const kw = (this.data.searchKeyword || '').trim().toLowerCase();

    let filtered = pageData.categories || [];
    if (kw) {
      filtered = filtered.filter(cat => 
        (cat.name || '').toLowerCase().includes(kw) ||
        (cat.desc || '').toLowerCase().includes(kw) ||
        (cat.specTag || '').toLowerCase().includes(kw)
      );
    }

    this.setData({
      lastRead: pageData.lastRead,
      categories: pageData.categories,
      filteredCategories: filtered,
      categoriesCount: pageData.categoriesCount,
      totalArticlesCount: pageData.totalArticlesCount
    });
  },

  // 「继续上次阅读」快速直达
  onTapContinueRead() {
    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'light' });
    }
    const lastArticleId = this.data.lastRead && this.data.lastRead.id;
    wx.navigateTo({
      url: `/pages/article-detail/article-detail?id=${lastArticleId || 'art_net_01'}`
    });
  },

  // 点击领域分类，进入文章列表页面
  onSelectCategory(e) {
    const catId = e.currentTarget.dataset.id;
    if (!catId) return;

    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'light' });
    }

    wx.navigateTo({
      url: `/pages/article-list/article-list?categoryId=${catId}`
    });
  },

  // 搜索输入过滤
  onSearchInput(e) {
    const kw = (e.detail.value || '').trim().toLowerCase();
    const all = this.data.categories || [];
    const filtered = kw 
      ? all.filter(cat => 
          (cat.name || '').toLowerCase().includes(kw) ||
          (cat.desc || '').toLowerCase().includes(kw) ||
          (cat.specTag || '').toLowerCase().includes(kw)
        )
      : all;

    this.setData({
      searchKeyword: e.detail.value,
      filteredCategories: filtered
    });
  },

  // 清空搜索
  onClearSearch() {
    this.setData({
      searchKeyword: '',
      filteredCategories: this.data.categories
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
    if (targetUrl && targetUrl !== '/pages/reader/reader') {
      wx.reLaunch({
        url: targetUrl
      });
    }
  }
});
