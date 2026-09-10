// miniprogram/pages/article-list/article-list.js
// 分类文章列表页面逻辑
const store = require('../../data/store.js');

Page({
  data: {
    statusBarHeight: 44,
    navBarHeight: 44,
    categoryId: 'cat_net',
    category: {},
    filterTabs: [],
    activeFilter: 'all',
    articles: []
  },

  onLoad(options) {
    const app = (typeof getApp === 'function' && getApp()) || {};
    const globalData = app.globalData || {};
    const catId = (options && options.categoryId) || 'cat_net';

    this.setData({
      statusBarHeight: globalData.statusBarHeight || 44,
      navBarHeight: globalData.navBarHeight || 44,
      categoryId: catId
    });

    this.loadCategoryData(catId, 'all');
  },

  onShow() {
    // 切回或返回本页时同步最新阅读状态（例如从已读文章返回时，状态实时刷新）
    if (this.data.categoryId) {
      this.loadCategoryData(this.data.categoryId, this.data.activeFilter);
    }
  },

  // 加载数据
  loadCategoryData(catId, filterKey) {
    const data = store.getCategoryArticlesData(catId, filterKey);
    this.setData({
      category: data.category,
      filterTabs: data.filterTabs,
      activeFilter: data.activeFilter,
      articles: data.articles
    });
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

  // 切换筛选标签 Pills
  onTapFilterTab(e) {
    const key = e.currentTarget.dataset.key;
    if (!key || key === this.data.activeFilter) return;

    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'light' });
    }

    this.loadCategoryData(this.data.categoryId, key);
  },

  // 点击文章卡片，直达沉浸精读与查词页
  onTapArticle(e) {
    const articleId = e.currentTarget.dataset.id;
    if (!articleId) return;

    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'light' });
    }

    wx.navigateTo({
      url: `/pages/article-detail/article-detail?id=${articleId}`
    });
  }
});
