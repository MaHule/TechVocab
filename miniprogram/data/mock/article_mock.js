// miniprogram/data/mock/article_mock.js
/**
 * 文章阅读与点词查义 Mock 数据
 * 严格契合 docs/mockups/reader.svg 视觉稿
 */

const mockArticleData = {
  article: {
    id: "art_001",
    title: "Understanding TCP Handshake",
    sourceName: "MDN · 官方文档",
    readTime: "3 分钟精读",
    wordCount: "185 词",
    category: "计算机网络核心通识",
    paragraphs: [
      {
        id: "p1",
        lines: [
          "In modern computer networking, reliable",
          "communication begins with establishing",
          "a stable session between two endpoints."
        ]
      },
      {
        id: "p2",
        // 富文本分词数据，便于点词交互与状态渲染
        tokens: [
          { text: "The client first transmits a SYN packet to " },
          { text: "synchronize", isTerm: true, termId: "term_sync" },
          { text: " the sequence numbers. To prevent duplicate connections, the handshake requires " },
          { text: "idempotent", isTerm: true, isSelected: true, termId: "term_idem" },
          { text: " packet handling on the server side." }
        ]
      }
    ]
  },
  // 选中的点词查义详情 (默认展示 idempotent)
  activeLookup: {
    word: "idempotent",
    phonetic: "/ˌaɪ.dəmˈpoʊ.tənt/",
    techDefinition: "【计】幂等的",
    techDetail: "操作执行多次与执行一次结果完全相同",
    typicalContext: "💡 典型工程语境：HTTP PUT/DELETE · 接口防重 · 消息队列重试",
    isCollected: false
  },
  // 可点查词词典索引 (用于点击不同技术词时的动态切换)
  termDict: {
    "idempotent": {
      word: "idempotent",
      phonetic: "/ˌaɪ.dəmˈpoʊ.tənt/",
      techDefinition: "【计】幂等的",
      techDetail: "操作执行多次与执行一次结果完全相同",
      typicalContext: "💡 典型工程语境：HTTP PUT/DELETE · 接口防重 · 消息队列重试"
    },
    "synchronize": {
      word: "synchronize",
      phonetic: "/ˈsɪŋ.krə.naɪz/",
      techDefinition: "【计】同步",
      techDetail: "协调不同组件或线程的事件发生顺序与状态一致性",
      typicalContext: "💡 典型工程语境：TCP Seq 同步 · 线程锁 Synchronization · 数据双向同步"
    }
  }
};

module.exports = mockArticleData;
