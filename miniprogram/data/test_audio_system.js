// miniprogram/data/test_audio_system.js
/**
 * 单词发音与原声朗读系统自动化校验套件
 */

const https = require('https');
const store = require('./store.js');
const audioPlayer = require('../utils/audio_player.js');

function fetchStatus(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let size = 0;
      res.on('data', chunk => size += chunk.length);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          contentType: res.headers['content-type'],
          size: size
        });
      });
    }).on('error', (err) => {
      resolve({ statusCode: 500, error: err.message, size: 0 });
    });
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('🚀 开始执行单词发音与文章原声朗读系统自动化测试');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, desc) {
    total++;
    if (condition) {
      console.log(`  ✅ [PASS] ${desc}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${desc}`);
    }
  }

  // 1. 基础逻辑与清洗功能单元测试
  console.log('--- 1. 文本清洗与 URL 生成器测试 ---');
  assert(audioPlayer.sanitizeWord('  "idempotent"!  ') === 'idempotent', '单词首尾特殊标点过滤正确');
  assert(audioPlayer.sanitizeWord('SYN-ACK') === 'SYN-ACK', '连字符术语保留正确');
  
  const usUrl = audioPlayer.getWordAudioUrl('idempotent', 'us');
  assert(usUrl.includes('type=2') && usUrl.includes('audio=idempotent'), '美音 URL 生成格式规范');

  const ukUrl = audioPlayer.getWordAudioUrl('synchronize', 'uk');
  assert(ukUrl.includes('type=1') && ukUrl.includes('audio=synchronize'), '英音 URL 生成格式规范');

  const sentUrl = audioPlayer.getSentenceAudioUrl('TCP handshake establishes a session.', 3);
  assert(sentUrl.includes('fanyi.baidu.com') && sentUrl.includes('lan=en'), '句子朗读 TTS URL 生成正确');

  // 2. 长段落智能断句算法测试
  console.log('\n--- 2. 长段落智能断句测试 ---');
  const samplePara = 'Zero Trust Architecture is an enterprise security model. It requires strict authentication! Does it work everywhere? Yes, absolutely.';
  const sentences = audioPlayer._splitIntoSentences(samplePara);
  assert(sentences.length === 4, `长段落断句正确拆分为 4 个分句 (当前拆分: ${sentences.length})`);
  assert(sentences[0] === 'Zero Trust Architecture is an enterprise security model.', '首句断句内容完全精准');

  // 3. 词库全量词汇发音 URL 完整性测试
  console.log('\n--- 3. 核心词库单词发音合规性校验 ---');
  const words = store.initialWordLibrary || [];
  let allWordsValid = true;
  for (const w of words) {
    const url = audioPlayer.getWordAudioUrl(w.word);
    if (!url || !url.startsWith('https://dict.youdao.com')) {
      allWordsValid = false;
      break;
    }
  }
  assert(allWordsValid, `词库全部 ${words.length} 个单词均成功映射合规真人发音 CDN`);

  // 4. 真实音频网络连通性与流有效性在线验证 (网络层抽样测试)
  console.log('\n--- 4. 在线真实音频流连通性测试 (网络抽样) ---');
  const testSampleWords = ['idempotent', 'synchronize', 'throughput', 'payload'];
  for (const word of testSampleWords) {
    const wordUrl = audioPlayer.getWordAudioUrl(word, 'us');
    const res = await fetchStatus(wordUrl);
    assert(res.statusCode === 200 && res.size > 1000, `单词 [${word}] 真人美音流获取成功 (Status: ${res.statusCode}, 字节: ${res.size})`);
  }

  // 5. 段落 TTS 网络流连通性测试
  const paraUrl = audioPlayer.getSentenceAudioUrl('In modern computer networking, reliable communication begins with establishing a stable session.', 3);
  const paraRes = await fetchStatus(paraUrl);
  assert(paraRes.statusCode === 200 && paraRes.size > 5000, `文章段落原声朗读 TTS 音频流获取成功 (Status: ${paraRes.statusCode}, 字节: ${paraRes.size})`);

  console.log('\n====================================================');
  console.log(`🏁 自动化测试完成: 通过 ${passed} / ${total} (${Math.round((passed / total) * 100)}%)`);
  console.log('====================================================');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('测试异常:', err);
  process.exit(1);
});
