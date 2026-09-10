// miniprogram/data/mock/word_mock.js
/**
 * 单词卡学习页 Mock 数据
 * 严格契合计算机专业语境与 docs/mockups/flashcard.svg 视觉稿
 */

const wordLibrary = [
  {
    id: "net_007",
    word: "idempotent",
    phonetic: "/ˌaɪ.dəmˈpoʊ.tənt/",
    pos: "adj.",
    specTag: "RFC 7231 · SPEC",
    level: "Level 2",
    categoryName: "计算机网络",
    techDefinition: "幂等的",
    techDetail: "（操作执行多次与一次影响相同）",
    typicalContext: "HTTP PUT/DELETE · 消息重试 · 接口防重",
    codeSnippet: {
      fileName: "EXAMPLE.http_handler.go",
      lines: [
        { lineNum: "01", isComment: true, code: "// RFC 7231: Safe & Idempotent Methods" },
        { lineNum: "02", isComment: false, code: "func HandleRequest(req *Request) {" },
        { lineNum: "03", isComment: false, code: "  if req.", highlight: "IsIdempotent", suffix: "() {" },
        { lineNum: "04", isComment: false, code: "    retryPolicy.", highlightGreen: "EnableSafeRetry", suffix: "()" },
        { lineNum: "05", isComment: false, code: "  }" },
        { lineNum: "06", isComment: false, code: "}" }
      ]
    }
  },
  {
    id: "nb_02",
    word: "deadlock",
    phonetic: "/ˈded.lɑːk/",
    pos: "n.",
    specTag: "POSIX · THREAD",
    level: "Level 2",
    categoryName: "操作系统与并发",
    techDefinition: "死锁",
    techDetail: "（多进程相互持有资源并循环等待对方释放）",
    typicalContext: "互斥锁竞争顺序 · 银行家算法 · 资源抢占",
    codeSnippet: {
      fileName: "EXAMPLE.mutex_deadlock.rs",
      lines: [
        { lineNum: "01", isComment: true, code: "// Rust: Potential circular lock acquisition" },
        { lineNum: "02", isComment: false, code: "fn transfer(acc_a: &Mutex<u32>, acc_b: &Mutex<u32>) {" },
        { lineNum: "03", isComment: false, code: "  let _lock_a = acc_a.", highlight: "lock", suffix: "().unwrap();" },
        { lineNum: "04", isComment: false, code: "  let _lock_b = acc_b.", highlight: "lock", suffix: "().unwrap(); // Deadlock risk" },
        { lineNum: "05", isComment: false, code: "}" }
      ]
    }
  },
  {
    id: "net_008",
    word: "synchronize",
    phonetic: "/ˈsɪŋ.krə.naɪz/",
    pos: "v.",
    specTag: "RFC 793 · TCP",
    level: "Level 2",
    categoryName: "计算机网络",
    techDefinition: "同步",
    techDetail: "（协调两端状态一致，初始序号配对）",
    typicalContext: "TCP 三次握手 SYN 序号同步 · 双向状态对齐",
    codeSnippet: {
      fileName: "EXAMPLE.tcp_conn.c",
      lines: [
        { lineNum: "01", isComment: true, code: "/* RFC 793: Sequence Number Synchronization */" },
        { lineNum: "02", isComment: false, code: "tcph->syn = 1;" },
        { lineNum: "03", isComment: false, code: "tcph->seq = htonl(", highlight: "initial_seq_num", suffix: ");" },
        { lineNum: "04", isComment: false, code: "send_packet(tcph);" }
      ]
    }
  },
  {
    id: "nb_03",
    word: "traversal",
    phonetic: "/trəˈvɜːr.səl/",
    pos: "n.",
    specTag: "ALGO · GRAPH/TREE",
    level: "Level 2",
    categoryName: "数据结构与算法",
    techDefinition: "遍历",
    techDetail: "（按确定规则无重复访问树或图的所有节点）",
    typicalContext: "二叉树层序遍历 · 深度优先 DFS · 广度优先 BFS",
    codeSnippet: {
      fileName: "EXAMPLE.tree_traversal.ts",
      lines: [
        { lineNum: "01", isComment: true, code: "// Pre-order Depth First Traversal" },
        { lineNum: "02", isComment: false, code: "function dfsTraversal(root: TreeNode | null) {" },
        { lineNum: "03", isComment: false, code: "  if (!root) return;" },
        { lineNum: "04", isComment: false, code: "  visit(root.val);" },
        { lineNum: "05", isComment: false, code: "  dfsTraversal(root.left);" },
        { lineNum: "06", isComment: false, code: "}" }
      ]
    }
  },
  {
    id: "nb_04",
    word: "concurrency",
    phonetic: "/kənˈkɝː.ən.si/",
    pos: "n.",
    specTag: "CS ARCH · MULTI-CORE",
    level: "Level 2",
    categoryName: "操作系统与并发",
    techDefinition: "并发",
    techDetail: "（系统在逻辑上具有同时处理多个任务的能力）",
    typicalContext: "Go Goroutines · 线程池调度 · 非阻塞异步 I/O",
    codeSnippet: {
      fileName: "EXAMPLE.worker_pool.go",
      lines: [
        { lineNum: "01", isComment: true, code: "// Spawn concurrent worker pool" },
        { lineNum: "02", isComment: false, code: "for w := 1; w <= numWorkers; w++ {" },
        { lineNum: "03", isComment: false, code: "  go worker(w, jobs, results) // ", highlightGreen: "concurrent execution", suffix: "" },
        { lineNum: "04", isComment: false, code: "}" }
      ]
    }
  },
  {
    id: "net_009",
    word: "latency",
    phonetic: "/ˈleɪ.tən.si/",
    pos: "n.",
    specTag: "NET PERF · METRIC",
    level: "Level 2",
    categoryName: "计算机网络",
    techDefinition: "时延 / 延迟",
    techDetail: "（数据包从发送端传输到目的地所需的时间）",
    typicalContext: "RTT 往返时延 · 99分位延迟 (p99) · 边缘计算加速",
    codeSnippet: {
      fileName: "EXAMPLE.telemetry.go",
      lines: [
        { lineNum: "01", isComment: true, code: "// Monitor request round-trip latency" },
        { lineNum: "02", isComment: false, code: "start := time.Now()" },
        { lineNum: "03", isComment: false, code: "resp, err := client.Do(req)" },
        { lineNum: "04", isComment: false, code: "latency := time.Since(start)" },
        { lineNum: "05", isComment: false, code: "metrics.Record(", highlight: "latency", suffix: ")" }
      ]
    }
  },
  {
    id: "nb_05",
    word: "asynchronous",
    phonetic: "/eɪˈsɪŋ.krə.nəs/",
    pos: "adj.",
    specTag: "EVENT LOOP · I/O",
    level: "Level 2",
    categoryName: "计算机网络",
    techDefinition: "异步的",
    techDetail: "（操作调用立即返回，结果通过回调或 Promise 处理）",
    typicalContext: "async/await · 事件循环 Event Loop · 消息总线",
    codeSnippet: {
      fileName: "EXAMPLE.async_fetch.ts",
      lines: [
        { lineNum: "01", isComment: true, code: "// Non-blocking asynchronous network request" },
        { lineNum: "02", isComment: false, code: "async function fetchMetrics(url: string) {" },
        { lineNum: "03", isComment: false, code: "  const resp = ", highlight: "await", suffix: " fetch(url);" },
        { lineNum: "04", isComment: false, code: "  return ", highlightGreen: "await", suffix: " resp.json();" },
        { lineNum: "05", isComment: false, code: "}" }
      ]
    }
  },
  {
    id: "basic_001",
    word: "instantiate",
    phonetic: "/ɪnˈstæn.ʃi.eɪt/",
    pos: "v.",
    specTag: "OOP · DESIGN PATTERN",
    level: "Level 1",
    categoryName: "编程基础 & 高频报错",
    techDefinition: "实例化",
    techDetail: "（根据类模板在堆内存中分配空间并创建具体对象）",
    typicalContext: "工厂模式 · 构造函数 new · 依赖注入",
    codeSnippet: {
      fileName: "EXAMPLE.factory.java",
      lines: [
        { lineNum: "01", isComment: true, code: "// Java: Instantiate service instance via factory" },
        { lineNum: "02", isComment: false, code: "public Connection create() {" },
        { lineNum: "03", isComment: false, code: "  return new ", highlight: "DatabaseConnection", suffix: "(config);" },
        { lineNum: "04", isComment: false, code: "}" }
      ]
    }
  }
];

/**
 * 根据选项获取切词队列
 * @param {Object} options 页面入参
 * @returns {Array} 单词卡队列
 */
function getWordQueue(options = {}) {
  let queue = [...wordLibrary];

  // 1. 如果指定了特定单词 (通过 id 或 word 字符串)
  if (options.wordId || options.word) {
    const targetKey = (options.wordId || options.word).toLowerCase();
    const targetIndex = queue.findIndex(w => 
      w.id.toLowerCase() === targetKey || w.word.toLowerCase() === targetKey
    );
    if (targetIndex >= 0) {
      // 将目标单词移至第一位优先展示，后续保留其他单词继续背词
      const [targetWord] = queue.splice(targetIndex, 1);
      queue.unshift(targetWord);
    }
  } else if (options.mode === 'review') {
    // 复习模式：优先排布生词本中的重点待复习词汇
    const reviewIds = ['nb_02', 'net_007', 'nb_04'];
    queue.sort((a, b) => {
      const aIn = reviewIds.includes(a.id) ? -1 : 1;
      const bIn = reviewIds.includes(b.id) ? -1 : 1;
      return aIn - bIn;
    });
  } else if (options.moduleId) {
    // 模块模式：过滤对应等级与分类的词汇
    const filtered = queue.filter(w => {
      if (options.moduleId.includes('net')) return w.categoryName.includes('网络');
      if (options.moduleId.includes('os')) return w.categoryName.includes('并发') || w.categoryName.includes('操作系统');
      if (options.moduleId.includes('algo')) return w.categoryName.includes('算法');
      if (options.moduleId.includes('basic')) return w.level.includes('Level 1');
      return true;
    });
    if (filtered.length > 0) {
      queue = filtered;
    }
  }

  return queue;
}

/**
 * 默认向后兼容的单卡对象
 */
const mockWordData = {
  moduleInfo: {
    level: "Level 2",
    categoryName: "计算机网络",
    currentUnitIndex: 1,
    totalUnits: wordLibrary.length,
    progressPercent: Math.round((1 / wordLibrary.length) * 100)
  },
  word: wordLibrary[0],
  wordLibrary,
  getWordQueue
};

module.exports = mockWordData;
