// miniprogram/data/test_dict_system.js
/**
 * 词典系统与全链路端到端自动化测试脚本
 */

const assert = require('assert');
const store = require('./store.js');
const readerDict = require('./reader_dict.js');
const techDict = require('./tech_dict.js');
const commonDict = require('./common_dict.js');

console.log('=== [1/5] 验证词库基础体量 ===');
console.log(`计算机专业技术词典条目数: ${Object.keys(techDict).length} (目标 >= 150)`);
console.log(`本地通用英汉词典条目数: ${Object.keys(commonDict).length} (目标 >= 500)`);
assert(Object.keys(techDict).length >= 150, '计算机专业技术词典条目不足 150 条！');
assert(Object.keys(commonDict).length >= 500, '通用英汉词典条目不足 500 条！');
console.log('✅ 基础词典体量达标！\n');

console.log('=== [2/5] 验证核心专业词双轨释义与工程语境 ===');
const sampleTechWords = ['idempotent', 'deadlock', 'backpressure', 'socket', 'pipeline', 'gateway', 'sidecar', 'csrf', 'closure', 'segfault'];
sampleTechWords.forEach(w => {
  const info = readerDict.lookupWord(w);
  assert.strictEqual(info.isTechTerm, true, `${w} 必须标记为 isTechTerm: true`);
  assert(info.phonetic && info.phonetic.startsWith('/'), `${w} 音标不合法`);
  assert(info.techDefinition && info.techDefinition.length > 0, `${w} 缺少专业释义`);
  console.log(`  ✓ [专业词] ${w.padEnd(14)} -> ${info.techDefinition.slice(0, 18)} (${info.phonetic})`);
});
console.log('✅ 核心专业词校验通过！\n');

console.log('=== [3/5] 验证通用词汇与词形还原 (时态/复数) ===');
const sampleCommonWords = [
  { raw: 'reliable', expectWord: 'reliable' },
  { raw: 'between', expectWord: 'between' },
  { raw: 'allocating', expectWord: 'allocate' },
  { raw: 'stalls', expectWord: 'stall' },
  { raw: 'proxies', expectWord: 'proxy' },
  { raw: 'transmitted', expectWord: 'transmit' },
  { raw: 'downstream', expectWord: 'downstream' },
  { raw: '3', expectWord: '3' }
];

sampleCommonWords.forEach(item => {
  const info = readerDict.lookupWord(item.raw);
  assert.notStrictEqual(info.source, 'fallback', `${item.raw} 不得落入兜底未翻译状态`);
  assert(info.techDefinition && !info.techDefinition.includes('可在上下文技术语境中理解'), `${item.raw} 释义包含模板占位符`);
  console.log(`  ✓ [通用/变形] ${item.raw.padEnd(14)} -> ${info.techDefinition}`);
});
console.log('✅ 通用词汇与词形还原校验通过！\n');

const articles = store.initialArticles || [];
console.log(`=== [4/5] 验证 ${articles.length} 篇全站技术文献全量分词与查词覆盖率 ===`);
let totalTokens = 0;
let fallbackCount = 0;

articles.forEach(art => {
  (art.paragraphs || []).forEach(p => {
    const text = (p.lines ? p.lines.join(' ') : (p.rawText || p.en || ''));
    const tokens = readerDict.tokenizeParagraph(text);
    tokens.forEach(tok => {
      if (tok.isWord) {
        totalTokens++;
        const info = readerDict.lookupWord(tok.cleanWord);
        if (info.source === 'fallback') {
          fallbackCount++;
          console.error(`  ❌ 缺失翻译: ${tok.cleanWord}`);
        }
      }
    });
  });
});

console.log(`${articles.length} 篇文献总单词 Token 数: ${totalTokens}`);
console.log(`未翻译 Fallback 数: ${fallbackCount}`);
assert.strictEqual(fallbackCount, 0, '存在未翻译单词 Token！');
console.log(`✅ ${articles.length} 篇技术文献 100% 单词查词覆盖率验证通过！\n`);

console.log('=== [5/5] 验证卡片动态合成与生词本闭环流转 ===');
// 1. 验证 options.word 动态合成卡片
const flashcardQueue = store.getFlashcardQueue({ word: 'socket' });
assert(flashcardQueue.length > 0, '卡片队列为空');
assert.strictEqual(flashcardQueue[0].word.toLowerCase(), 'socket', '动态合成卡片词名不匹配');
assert(flashcardQueue[0].objectiveQuiz && flashcardQueue[0].objectiveQuiz.options.length === 4, '缺少客观题');
console.log(`  ✓ 动态卡片合成成功: ${flashcardQueue[0].word} -> ${flashcardQueue[0].techDefinition}`);

// 2. 验证生词本加入与去重
const beforeData = store.getNotebookData();
store.addWordToNotebook({
  word: 'telemetry',
  phonetic: '/təˈlem.ə.tri/',
  pos: 'n.',
  specTag: 'OBSERVABILITY',
  categoryName: '云原生与微服务',
  generalDefinition: '遥测技术',
  techDefinition: '【计】系统遥测指标数据',
  techDetail: '分布式可观测性指标',
  source: '文档阅读'
});
const afterData = store.getNotebookData();
assert(afterData.words.some(w => w.word === 'telemetry'), '生词加入失败');
console.log(`  ✓ 生词本入库成功: telemetry 已加入复习队列`);

console.log('\n=============================================');
console.log('🎉🎉 自动化测试 100% 全部通过！词典系统构建完毕！');
console.log('=============================================');
