// miniprogram/data/reader_dict.js
/**
 * 计算机技术阅读点词查义词典与文本分词引擎
 * 采用 4 级分层检索架构 (L1 深度卡片词库 -> L2 计算机技术词典 -> L3 高频英汉词典 -> L4 智能启发兜底)
 * 支持 0 毫秒离线查词、智能词形还原，并预留异步在线查词插槽 (方案四)
 */

const techDictionary = require('./tech_dict.js');
const commonDictionary = require('./common_dict.js');

/**
 * 单词形态智能还原 (处理复数、时态、进行时、副词后缀、词根派生)
 */
function normalizeWord(rawWord) {
  if (!rawWord) return '';
  const w = rawWord.toLowerCase().trim().replace(/^['_-]+|['_-]+$/g, '');
  if (!w) return '';

  // 1. 直接命中
  if (techDictionary[w] || commonDictionary[w]) return w;

  // 2. 规则 1: 复数 -ies -> -y (如 retries -> retry, proxies -> proxy, categories -> category)
  if (w.endsWith('ies') && w.length > 4) {
    const stem = w.slice(0, -3) + 'y';
    if (techDictionary[stem] || commonDictionary[stem]) return stem;
  }

  // 3. 规则 2: 复数 -es (如 processes -> process, boxes -> box, updates -> update)
  if (w.endsWith('es') && w.length > 3) {
    const stem1 = w.slice(0, -2);
    if (techDictionary[stem1] || commonDictionary[stem1]) return stem1;
    const stem2 = w.slice(0, -1);
    if (techDictionary[stem2] || commonDictionary[stem2]) return stem2;
  }

  // 4. 规则 3: 普通复数或第三人称单数 -s
  if (w.endsWith('s') && !w.endsWith('ss') && w.length > 2) {
    const stem = w.slice(0, -1);
    if (techDictionary[stem] || commonDictionary[stem]) return stem;
  }

  // 5. 规则 4: 进行时 -ing (如 allocating -> allocate, reserving -> reserve, stalling -> stall)
  if (w.endsWith('ing') && w.length > 4) {
    const stem1 = w.slice(0, -3); // stall, stream
    if (techDictionary[stem1] || commonDictionary[stem1]) return stem1;
    const stem2 = stem1 + 'e'; // allocate, reserve
    if (techDictionary[stem2] || commonDictionary[stem2]) return stem2;
    // 双写辅音还原 (如 dropping -> drop, stopping -> stop, running -> run)
    if (stem1.length > 2 && stem1[stem1.length - 1] === stem1[stem1.length - 2]) {
      const stem3 = stem1.slice(0, -1);
      if (techDictionary[stem3] || commonDictionary[stem3]) return stem3;
    }
  }

  // 6. 规则 5: 过去式/过去分词 -ed (如 allocated -> allocate, transmitted -> transmit)
  if (w.endsWith('ed') && w.length > 3) {
    const stem1 = w.slice(0, -2); // transmit
    if (techDictionary[stem1] || commonDictionary[stem1]) return stem1;
    const stem2 = w.slice(0, -1); // allocate
    if (techDictionary[stem2] || commonDictionary[stem2]) return stem2;
    // 双写辅音还原 (如 stopped -> stop)
    if (stem1.length > 2 && stem1[stem1.length - 1] === stem1[stem1.length - 2]) {
      const stem3 = stem1.slice(0, -1);
      if (techDictionary[stem3] || commonDictionary[stem3]) return stem3;
    }
  }

  // 7. 规则 6: 副词 -ly -> 形容词 (如 inherently -> inherent, independently -> independent)
  if (w.endsWith('ly') && w.length > 4) {
    const stem1 = w.slice(0, -2);
    if (techDictionary[stem1] || commonDictionary[stem1]) return stem1;
  }

  // 8. 规则 7: -ency -> -ent (如 idempotency -> idempotent, consistency -> consistent)
  if (w.endsWith('ency') && w.length > 5) {
    const stem = w.slice(0, -4) + 'ent';
    if (techDictionary[stem] || commonDictionary[stem]) return stem;
  }

  return w;
}

/**
 * 核心查词接口 (同步分层检索)
 * @param {string} rawWord 点击的原始单词字符串
 * @returns {object} 结构化词条卡片数据
 */
function lookupWord(rawWord) {
  if (!rawWord) {
    return {
      word: "term",
      phonetic: "/tɝːm/",
      pos: "n.",
      categoryName: "计算机专业术语",
      specTag: "TERM",
      techDefinition: "【计】术语",
      techDetail: "技术文档专业词汇",
      generalDefinition: "术语，期限",
      typicalContext: "💡 计算机技术文档语境",
      designMetaphor: "",
      isTechTerm: true,
      source: "fallback"
    };
  }

  const clean = rawWord.toLowerCase().trim().replace(/^['_-]+|['_-]+$/g, '');
  const normalizedKey = normalizeWord(clean);

  // =========================================================================
  // Level 1: 优先检查全站核心词库 (包含代码终端、客观实战题、设计隐喻与RFC)
  // =========================================================================
  try {
    const store = require('./store.js');
    const allWords = store.initialWordLibrary || [];
    const matched = allWords.find(w => 
      w.word.toLowerCase() === clean || 
      w.word.toLowerCase() === normalizedKey
    );
    if (matched) {
      return {
        word: clean,
        phonetic: matched.phonetic || `/${clean}/`,
        pos: matched.pos || "n.",
        categoryName: matched.categoryName || "计算机核心术语",
        specTag: matched.specTag || "SPEC",
        generalDefinition: matched.generalDefinition || "",
        techDefinition: matched.techDefinition || `【计】${clean}`,
        techDetail: matched.techDetail || "",
        designMetaphor: matched.designMetaphor || "",
        typicalContext: matched.typicalContext || `💡 典型工程语境：${clean}`,
        isTechTerm: true,
        source: "tech_core"
      };
    }
  } catch (e) {
    // 兼容存储加载
  }

  // =========================================================================
  // Level 2: 匹配计算机专业技术专属词典 (150+ 权威工程词库)
  // =========================================================================
  const techEntry = techDictionary[clean] || techDictionary[normalizedKey];
  if (techEntry) {
    return {
      word: clean,
      phonetic: techEntry.phonetic || `/${clean}/`,
      pos: techEntry.pos || "n.",
      categoryName: techEntry.categoryName || "计算机专业术语",
      specTag: techEntry.specTag || "TECH",
      generalDefinition: techEntry.generalDefinition || "",
      techDefinition: techEntry.techDefinition || `【计】${clean}`,
      techDetail: techEntry.techDetail || "",
      designMetaphor: techEntry.designMetaphor || "",
      typicalContext: techEntry.typicalContext || `💡 典型工程语境：${clean}`,
      isTechTerm: true,
      source: "tech_dict"
    };
  }

  // =========================================================================
  // Level 3: 匹配本地高频英汉通用词典 (覆盖动词/连词/介词/常见名词)
  // =========================================================================
  const commonEntry = commonDictionary[clean] || commonDictionary[normalizedKey];
  if (commonEntry) {
    return {
      word: clean,
      phonetic: commonEntry.phonetic || `/${clean}/`,
      pos: commonEntry.pos || "word",
      categoryName: "通用词汇",
      specTag: commonEntry.pos ? `通用 · ${commonEntry.pos}` : "通用词汇",
      generalDefinition: commonEntry.definition || commonEntry.techDefinition || "",
      techDefinition: `【${commonEntry.pos || '常用释义'}】${commonEntry.definition || clean}`,
      techDetail: `标准释义：${commonEntry.definition || clean}`,
      designMetaphor: "",
      typicalContext: `💡 正在阅读的上下文例句 · ${clean}`,
      isTechTerm: false,
      source: "common_dict"
    };
  }

  // =========================================================================
  // 数字常量处理 (如 1, 2, 3, 200, 404 等)
  // =========================================================================
  if (/^\d+$/.test(clean)) {
    return {
      word: clean,
      phonetic: `/${clean}/`,
      pos: "num.",
      categoryName: "常量与数值",
      specTag: "数值常量",
      generalDefinition: `基数词 / 编号 ${clean}`,
      techDefinition: `【数】常量数值 ${clean}`,
      techDetail: `代码或技术文档中的常量/状态码/参数数值 ${clean}`,
      designMetaphor: "",
      typicalContext: `💡 参数与配置常量 · ${clean}`,
      isTechTerm: false,
      source: "number"
    };
  }

  // =========================================================================
  // Level 4: 智能启发式兜底 (为方案四预留在线查词插槽)
  // =========================================================================
  return {
    word: clean,
    phonetic: `/${clean}/`,
    pos: "word",
    categoryName: "上下文解析",
    specTag: "生词待巩固",
    generalDefinition: "可在上下文技术语境中理解该词义",
    techDefinition: `【词汇】${clean}`,
    techDetail: "点击下方按钮可直接加入生词本，纳入今晚艾宾浩斯复习队列巩固。",
    designMetaphor: "",
    typicalContext: `💡 正在阅读的句子语境 · ${clean}`,
    isTechTerm: false,
    source: "fallback"
  };
}

/**
 * 异步查词接口 (方案四扩展插槽)
 * 目前直接包裹同步 lookupWord，未来可在此无缝挂接在线查词 API 或微信云开发云函数
 */
function lookupWordAsync(rawWord) {
  return new Promise((resolve) => {
    const result = lookupWord(rawWord);
    resolve(result);
  });
}

/**
 * 段落文本分词切分器 (将段落切分为连续的单词 Token 与标点符号 Token)
 */
function tokenizeParagraph(paragraphText, paraId = 0) {
  if (!paragraphText) return [];
  const regex = /([a-zA-Z0-9_'-]+)|([^a-zA-Z0-9_'-]+)/g;
  const tokens = [];
  let match;
  let idx = 0;

  while ((match = regex.exec(paragraphText)) !== null) {
    if (match[1]) {
      const raw = match[1];
      const clean = raw.toLowerCase().replace(/^['_-]+|['_-]+$/g, '');
      const normalizedKey = normalizeWord(clean);
      const isTech = Boolean(
        (techDictionary[clean] && techDictionary[clean].isTechTerm) ||
        (techDictionary[normalizedKey] && techDictionary[normalizedKey].isTechTerm)
      );

      tokens.push({
        tokId: `p${paraId}_t${idx++}`,
        text: raw,
        cleanWord: clean,
        isWord: true,
        isTechTerm: isTech
      });
    } else if (match[2]) {
      tokens.push({
        tokId: `p${paraId}_t${idx++}`,
        text: match[2],
        isWord: false
      });
    }
  }

  return tokens;
}

/**
 * 完整文章解析与分词 (配备高质量权威计算机中文译文)
 */
function tokenizeArticle(articleData = {}) {
  let paragraphs = [];
  if (articleData && Array.isArray(articleData.paragraphs) && articleData.paragraphs.length > 0) {
    paragraphs = articleData.paragraphs.map(p => ({
      en: Array.isArray(p.lines) ? p.lines.join(' ') : (p.rawText || p.en || ''),
      zh: p.zhText || p.zh || '💡 权威专业译文：点击段落内任意英文单词查看详细专业释义与工程例句。'
    }));
  } else {
    paragraphs = [
      {
        en: "In modern computer networking, reliable communication begins with establishing a stable session between two endpoints.",
        zh: "在现代计算机网络中，可靠的通信始于在两个通信端点之间建立一个稳定的会话。"
      },
      {
        en: "The client first transmits a SYN packet to synchronize the sequence numbers. To prevent duplicate connections, the handshake requires idempotent packet handling on the server side.",
        zh: "客户端首先发送一个 SYN 数据包以同步初始序列号。为了防止重复连接，该握手过程要求服务端具备幂等的数据包处理能力。"
      },
      {
        en: "When a node receives redundant handshake requests due to network latency, idempotency guarantees that the protocol state remains consistent without allocating redundant memory buffers.",
        zh: "当某个计算节点由于网络时延接收到冗余的握手请求时，幂等性可以确保协议状态保持全局一致，而无需在内存中重复分配多余的缓冲区。"
      }
    ];
  }

  return paragraphs.map((item, idx) => {
    return {
      id: `p_${idx + 1}`,
      rawText: item.en,
      zhText: item.zh,
      isZhOpen: false,
      tokens: tokenizeParagraph(item.en, idx + 1)
    };
  });
}

module.exports = {
  techDictionary,
  commonDictionary,
  lookupWord,
  lookupWordAsync,
  normalizeWord,
  tokenizeParagraph,
  tokenizeArticle
};
