// scripts/article_analyzer.js
/**
 * 技术文章解析与词库审计引擎
 * 负责对输入的任意英文技术文章、架构复盘、RFC 文档进行：
 * 1. 结构化段落分词与行切分 (适配手机端阅读排版)
 * 2. 词频统计与技术精读时间估算 (基于 60 词/分钟工程精读模型)
 * 3. 全库覆盖审计 (全站核心词库 L1 + 计算机专词 L2 + 通用词库 L3)
 * 4. 识别缺失生词清单，按词频降序输出候选扩充词表
 */

const fs = require('fs');
const path = require('path');

// 引用现有小程序底层分词引擎与词典库
const readerDict = require('../miniprogram/data/reader_dict.js');
const store = require('../miniprogram/data/store.js');

/**
 * 将长段落自然切分为适合移动端阅读的短行 (约 35~48 字符)
 */
function wrapLines(paragraphText, maxLineLen = 45) {
  const words = paragraphText.trim().split(/\s+/);
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if (!currentLine) {
      currentLine = word;
    } else if ((currentLine + ' ' + word).length <= maxLineLen) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

/**
 * 核心分析函数
 * @param {string} rawText 原始英文文章全文
 * @param {object} options 选项 { title, sourceName, specTag, categoryId }
 * @returns {object} 审计分析报告
 */
function analyzeArticleText(rawText, options = {}) {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('请输入有效的文章文本内容。');
  }

  // 1. 段落提取与清洗
  const rawParagraphs = rawText
    .split(/\n\s*\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  if (rawParagraphs.length === 0) {
    throw new Error('未检测到有效段落，请检查输入格式。');
  }

  // 2. 分词与各级词库覆盖匹配
  let totalWords = 0;
  const wordFreqMap = new Map();
  const missingFreqMap = new Map();
  const techTermMap = new Map();
  const coreTermMap = new Map();
  const commonTermMap = new Map();

  const formattedParagraphs = [];

  rawParagraphs.forEach((paraText, pIdx) => {
    const lines = wrapLines(paraText);
    const tokens = readerDict.tokenizeParagraph(paraText, pIdx + 1);

    tokens.forEach(tok => {
      if (tok.isWord) {
        totalWords++;
        const wordKey = tok.cleanWord;
        wordFreqMap.set(wordKey, (wordFreqMap.get(wordKey) || 0) + 1);

        const wordInfo = readerDict.lookupWord(wordKey);

        if (wordInfo.source === 'tech_core') {
          coreTermMap.set(wordKey, (coreTermMap.get(wordKey) || 0) + 1);
        } else if (wordInfo.source === 'tech_dict') {
          techTermMap.set(wordKey, (techTermMap.get(wordKey) || 0) + 1);
        } else if (wordInfo.source === 'common_dict') {
          commonTermMap.set(wordKey, (commonTermMap.get(wordKey) || 0) + 1);
        } else if (wordInfo.source === 'number') {
          // 数字常量
        } else {
          // fallback：当前词库未收录生词
          missingFreqMap.set(wordKey, (missingFreqMap.get(wordKey) || 0) + 1);
        }
      }
    });

    formattedParagraphs.push({
      id: `p${pIdx + 1}`,
      rawText: paraText,
      lines: lines,
      tokensCount: tokens.filter(t => t.isWord).length
    });
  });

  // 3. 统计指标计算
  const coveredWords = totalWords - Array.from(missingFreqMap.values()).reduce((a, b) => a + b, 0);
  const coverageRate = totalWords > 0 ? ((coveredWords / totalWords) * 100).toFixed(1) : '100.0';
  const readMinutes = Math.max(1, Math.ceil(totalWords / 65)); // 65 词/分钟工程精读模型

  // 4. 排序生成缺失词推荐榜单
  const missingWordsSorted = Array.from(missingFreqMap.entries())
    .map(([word, freq]) => ({ word, freq }))
    .sort((a, b) => b.freq - a.freq);

  // 5. 组装结果报告
  return {
    meta: {
      title: options.title || 'Untitled Technical Article',
      sourceName: options.sourceName || 'Tech Whitepaper',
      specTag: options.specTag || 'RFC / ARCH',
      categoryId: options.categoryId || 'cat_cloud',
      wordCount: `${totalWords} 词`,
      rawWordCount: totalWords,
      readTime: `${readMinutes} 分钟精读`,
      paragraphCount: formattedParagraphs.length
    },
    coverage: {
      totalTokens: totalWords,
      coveredTokens: coveredWords,
      missingTokens: totalWords - coveredWords,
      coverageRate: `${coverageRate}%`,
      coreWordsFound: Array.from(coreTermMap.keys()),
      techWordsFound: Array.from(techTermMap.keys()),
      commonWordsFound: Array.from(commonTermMap.keys()),
      missingWords: missingWordsSorted
    },
    paragraphs: formattedParagraphs
  };
}

/**
 * 从文件读取并分析
 */
function analyzeArticleFile(filePath, options = {}) {
  const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`文件不存在: ${absolutePath}`);
  }
  const content = fs.readFileSync(absolutePath, 'utf-8');
  return analyzeArticleText(content, options);
}

/**
 * 格式化终端控制台可读审计报告
 */
function formatAuditReport(analysisResult) {
  const { meta, coverage, paragraphs } = analysisResult;
  const divider = '─'.repeat(60);

  let report = '\n' + '═'.repeat(60) + '\n';
  report += `📊 技术文章与计算机词库审计报告: ${meta.title}\n`;
  report += '═'.repeat(60) + '\n\n';

  report += `【文章概览】\n`;
  report += `  • 归属分类: ${meta.categoryId}\n`;
  report += `  • 文档来源: ${meta.sourceName} (${meta.specTag})\n`;
  report += `  • 单词体量: ${meta.wordCount} (${paragraphs.length} 个段落)\n`;
  report += `  • 推荐精读: ${meta.readTime} (65 词/分精读模型)\n\n`;

  report += `【全库覆盖率审计】\n`;
  report += `  • 总单词数:   ${coverage.totalTokens}\n`;
  report += `  • 已收录词数: ${coverage.coveredTokens}\n`;
  report += `  • 缺失生词数: ${coverage.missingTokens} 个 Token (${coverage.missingWords.length} 个不同词条)\n`;
  report += `  • 当前覆盖率: ${coverage.coverageRate} ${parseFloat(coverage.coverageRate) === 100 ? '✅ 完美覆盖' : '⚠️ 需补充词条'}\n\n`;

  report += `【命中已收录专业词】(${coverage.coreWordsFound.length + coverage.techWordsFound.length} 个):\n`;
  const allKnownTech = [...coverage.coreWordsFound, ...coverage.techWordsFound];
  report += `  ${allKnownTech.length > 0 ? allKnownTech.join(', ') : '(无)'}\n\n`;

  report += `【待补充生词候选排行】(按出现频次排序):\n`;
  if (coverage.missingWords.length === 0) {
    report += `  🎉 全库已 100% 覆盖该文章全部单词，无需补充词条即可无缝入库！\n`;
  } else {
    coverage.missingWords.slice(0, 20).forEach((item, idx) => {
      report += `  ${(idx + 1).toString().padStart(2, ' ')}. ${item.word.padEnd(18, ' ')} (出现 ${item.freq} 次)\n`;
    });
    if (coverage.missingWords.length > 20) {
      report += `  ... 还有 ${coverage.missingWords.length - 20} 个低频词\n`;
    }
  }

  report += '\n' + divider + '\n';
  return report;
}

module.exports = {
  wrapLines,
  analyzeArticleText,
  analyzeArticleFile,
  formatAuditReport
};
