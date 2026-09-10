// miniprogram/data/mock/notebook_mock.js
/**
 * 生词本与复习流 Mock 数据
 * 严格契合 docs/mockups/notebook.svg 视觉稿
 */

const mockNotebookData = {
  stats: {
    totalWords: 24,
    needReviewCount: 8,
    masteredCount: 16,
    reviewBreakdown: "包含 5 个阅读收藏生词 + 3 个背词遗忘生词"
  },
  filterTabs: [
    { key: "all", label: "全部", count: 24 },
    { key: "need_review", label: "待复习", count: 8 },
    { key: "mastered", label: "已掌握", count: 16 }
  ],
  words: [
    {
      id: "nb_01",
      word: "idempotent",
      phonetic: "/ˌaɪ.dəmˈpoʊ.tənt/",
      techDefinition: "【计】幂等的：多次执行产生相同影响",
      source: "文档阅读",
      status: "need_review",
      statusLabel: "待复习",
      statusColor: "warning", // 'warning' | 'danger' | 'success'
      reviewTimes: 1
    },
    {
      id: "nb_02",
      word: "deadlock",
      phonetic: "/ˈded.lɑːk/",
      techDefinition: "【计】死锁：多进程相互等待锁释放导致停滞",
      source: "Level 2 操作系统",
      status: "need_review",
      statusLabel: "遗忘 2 次",
      statusColor: "danger",
      reviewTimes: 2
    },
    {
      id: "nb_03",
      word: "traversal",
      phonetic: "/trəˈvɜːr.səl/",
      techDefinition: "【计】遍历：按确定规则访问树或图的所有节点",
      source: "Level 2 核心算法",
      status: "mastered",
      statusLabel: "已掌握 ✓",
      statusColor: "success",
      reviewTimes: 3
    },
    {
      id: "nb_04",
      word: "concurrency",
      phonetic: "/kənˈkɝː.ən.si/",
      techDefinition: "【计】并发：系统结构上支持同时处理多任务",
      source: "文档阅读",
      status: "need_review",
      statusLabel: "待复习",
      statusColor: "warning",
      reviewTimes: 1
    },
    {
      id: "nb_05",
      word: "asynchronous",
      phonetic: "/eɪˈsɪŋ.krə.nəs/",
      techDefinition: "【计】异步的：操作调用立即返回无需阻塞等待结果",
      source: "Level 2 计算机网络",
      status: "mastered",
      statusLabel: "已掌握 ✓",
      statusColor: "success",
      reviewTimes: 4
    }
  ]
};

module.exports = mockNotebookData;
