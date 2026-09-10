// miniprogram/data/article_store.js
// 兼容性导出，直接代理到统一数据中心 store.js
const store = require('./store.js');

module.exports = {
  getArticleStore: store.getArticleStore,
  getCategoriesPageData: store.getCategoriesPageData,
  getCategoryArticlesData: store.getCategoryArticlesData,
  getArticleById: store.getArticleById,
  updateArticleReadingProgress: store.updateArticleReadingProgress,
  initialCategories: store.initialCategories,
  initialArticles: store.initialArticles
};
