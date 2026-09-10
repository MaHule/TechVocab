// scripts/ingest_pipeline.js
/**
 * TechVocab 内容生产与半自动化合流流水线 CLI
 * 
 * 常用指令:
 *   node scripts/ingest_pipeline.js analyze <input_file>
 *   node scripts/ingest_pipeline.js prompt <input_file> [--output <output_path>]
 *   node scripts/ingest_pipeline.js validate <json_file>
 *   node scripts/ingest_pipeline.js merge <json_file> [--dry-run]
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const { analyzeArticleFile, formatAuditReport } = require('./article_analyzer.js');
const { buildPrompt } = require('./prompt_engine.js');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const STORE_PATH = path.resolve(PROJECT_ROOT, 'miniprogram/data/store.js');
const TECH_DICT_PATH = path.resolve(PROJECT_ROOT, 'miniprogram/data/tech_dict.js');
const COMMON_DICT_PATH = path.resolve(PROJECT_ROOT, 'miniprogram/data/common_dict.js');

/**
 * 校验音标格式 (如 /ˌaɪ.dəmˈpoʊ.tənt/)
 */
function isValidPhonetic(phonetic) {
  return typeof phonetic === 'string' && phonetic.startsWith('/') && phonetic.endsWith('/') && phonetic.length > 2;
}

/**
 * 在线测试音频 CDN 连通性
 */
function checkAudioConnectivity(word) {
  return new Promise((resolve) => {
    const clean = word.toLowerCase().trim();
    const url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(clean)}&type=2`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 5000 }, (res) => {
      let size = 0;
      res.on('data', chunk => size += chunk.length);
      res.on('end', () => {
        resolve(res.statusCode === 200 && size > 500);
      });
    }).on('error', () => {
      resolve(false);
    });
  });
}

/**
 * 严格校验待合流 JSON 数据合规性
 */
function validateIngestData(data) {
  const errors = [];

  if (!data || typeof data !== 'object') {
    return ['输入 JSON 必须为有效对象。'];
  }

  // 1. 校验 article
  if (!data.article || typeof data.article !== 'object') {
    errors.push('缺少根节点 "article"。');
  } else {
    const a = data.article;
    if (!a.title || typeof a.title !== 'string') errors.push('article.title 必须为非空字符串。');
    if (!a.categoryId || typeof a.categoryId !== 'string') errors.push('article.categoryId 必须为有效字符串分类。');
    if (!a.categoryName || typeof a.categoryName !== 'string') errors.push('article.categoryName 必须为有效中文分类名。');
    if (!a.summary || typeof a.summary !== 'string') errors.push('article.summary 必须为摘要说明。');
    if (!Array.isArray(a.keyTerms) || a.keyTerms.length < 2) errors.push('article.keyTerms 必须包含至少 2 个核心关键词数组。');
    if (!Array.isArray(a.paragraphs) || a.paragraphs.length === 0) {
      errors.push('article.paragraphs 必须为非空段落数组。');
    } else {
      a.paragraphs.forEach((p, idx) => {
        if (!Array.isArray(p.lines) || p.lines.length === 0) {
          errors.push(`段落 ${idx + 1} 缺少 lines 英文行数组。`);
        }
        if (!p.zhText || typeof p.zhText !== 'string') {
          errors.push(`段落 ${idx + 1} 缺少 zhText 权威中文精翻。`);
        }
      });
    }
  }

  // 2. 校验 coreWords
  if (!Array.isArray(data.coreWords)) {
    errors.push('缺少 "coreWords" 数组。');
  } else {
    data.coreWords.forEach((cw, idx) => {
      const tag = `coreWords[${idx}] (${cw.word || '未命名'})`;
      if (!cw.word || typeof cw.word !== 'string') errors.push(`${tag}: 缺少 word 属性。`);
      if (!isValidPhonetic(cw.phonetic)) errors.push(`${tag}: phonetic 音标格式不合规 (需 /.../ 包裹，当前: "${cw.phonetic}")。`);
      if (!cw.pos) errors.push(`${tag}: 缺少 pos 词性。`);
      if (!cw.generalDefinition) errors.push(`${tag}: 缺少 generalDefinition 通用生活常释。`);
      if (!cw.techDefinition) errors.push(`${tag}: 缺少 techDefinition 计算机第一释义。`);
      if (!cw.techDetail) errors.push(`${tag}: 缺少 techDetail 技术细节解析。`);
      if (!cw.designMetaphor || (!cw.designMetaphor.startsWith('如同') && !cw.designMetaphor.startsWith('像'))) {
        errors.push(`${tag}: designMetaphor 认知隐喻建议以 "如同..." 或 "像..." 开头，生动打通心智模型。`);
      }

      // 校验真实代码
      if (!cw.codeSnippet || !Array.isArray(cw.codeSnippet.lines) || cw.codeSnippet.lines.length < 4) {
        errors.push(`${tag}: codeSnippet 必须包含至少 4 行工程代码。`);
      }

      // 校验客观实战自测题
      if (!cw.objectiveQuiz || typeof cw.objectiveQuiz !== 'object') {
        errors.push(`${tag}: 缺少 objectiveQuiz 实战场景题。`);
      } else {
        const q = cw.objectiveQuiz;
        if (!q.scenario || q.scenario.length < 15) errors.push(`${tag}: 客观题题干 scenario 过短或为空。`);
        if (!Array.isArray(q.options) || q.options.length !== 4) {
          errors.push(`${tag}: 客观题选项 options 必须严格为 4 项。`);
        } else {
          const correctCount = q.options.filter(o => o.isCorrect === true).length;
          if (correctCount !== 1) {
            errors.push(`${tag}: 客观题 options 中必须且只能有 1 个正确选项 (当前正确项数量: ${correctCount})。`);
          }
        }
        if (!q.explanation || q.explanation.length < 10) errors.push(`${tag}: 客观题解析 explanation 过短或为空。`);
      }
    });
  }

  // 3. 校验 supplementaryDict
  if (data.supplementaryDict && typeof data.supplementaryDict === 'object') {
    Object.entries(data.supplementaryDict).forEach(([word, info]) => {
      if (!info.pos) errors.push(`supplementaryDict.${word}: 缺少 pos 词性。`);
      if (info.isTechTerm) {
        if (!info.techDefinition) errors.push(`supplementaryDict.${word}: 作为专业词缺少 techDefinition。`);
      } else {
        if (!info.definition && !info.techDefinition) errors.push(`supplementaryDict.${word}: 缺少 definition 释义。`);
      }
    });
  }

  return errors;
}

/**
 * 模拟查词覆盖率验证
 */
function verifySimulatedCoverage(data) {
  // 临时组装词库
  const readerDict = require('../miniprogram/data/reader_dict.js');
  const tempTech = { ...readerDict.techDictionary };
  const tempCommon = { ...readerDict.commonDictionary };

  // 预装 coreWords
  (data.coreWords || []).forEach(cw => {
    tempTech[cw.word.toLowerCase()] = {
      word: cw.word,
      isTechTerm: true
    };
  });

  // 预装 supplementaryDict
  if (data.supplementaryDict) {
    Object.entries(data.supplementaryDict).forEach(([k, v]) => {
      const lower = k.toLowerCase();
      if (v.isTechTerm) {
        tempTech[lower] = v;
      } else {
        tempCommon[lower] = v;
      }
    });
  }

  let unhandled = [];
  (data.article.paragraphs || []).forEach((p) => {
    const text = p.lines.join(' ');
    const tokens = readerDict.tokenizeParagraph(text);
    tokens.forEach(tok => {
      if (tok.isWord) {
        const w = tok.cleanWord;
        const norm = readerDict.normalizeWord(w);
        const hit = tempTech[w] || tempTech[norm] || tempCommon[w] || tempCommon[norm] || /^\d+$/.test(w);
        if (!hit) {
          unhandled.push(w);
        }
      }
    });
  });

  return Array.from(new Set(unhandled));
}

/**
 * 核心合流逻辑
 */
async function mergeIngestData(data, dryRun = false) {
  console.log('\n==================================================');
  console.log(`🚀 开始执行数据合流流程 ${dryRun ? '【预演模式 DRY-RUN】' : '【写入模式】'}`);
  console.log('==================================================\n');

  // 1. 结构格式校验
  const errors = validateIngestData(data);
  if (errors.length > 0) {
    console.error('❌ 数据结构合规性校验未通过:');
    errors.forEach(err => console.error(`  • ${err}`));
    throw new Error('合规校验失败，已终止合流。');
  }
  console.log('✅ [1/5] 数据结构与题型合规性校验通过！');

  // 2. 查词覆盖率预先模拟
  const missingTokens = verifySimulatedCoverage(data);
  if (missingTokens.length > 0) {
    console.warn(`⚠️ [2/5] 警告：合流后文章中尚有 ${missingTokens.length} 个单词未被词典覆盖: ${missingTokens.join(', ')}`);
    console.warn('建议在 supplementaryDict 中补全这些词条，以确保 100% 查词无 fallback。');
  } else {
    console.log('✅ [2/5] 查词覆盖率模拟验证完成：新增文章词汇 100% 达成无缝全覆盖！');
  }

  // 3. 音频 CDN 连通性测试
  console.log('⏳ [3/5] 正在校验核心词汇真人发音流连通性...');
  for (const cw of data.coreWords) {
    const ok = await checkAudioConnectivity(cw.word);
    if (ok) {
      console.log(`  ✓ 单词 [${cw.word}] 真人发音 CDN 连通正常 (200 OK)`);
    } else {
      console.warn(`  ⚠️ 单词 [${cw.word}] 发音请求响应异常，请检查网络`);
    }
  }
  console.log('✅ 音频 CDN 连通性校验完成！\n');

  if (dryRun) {
    console.log('🎉 【预演完成】数据格式完备，随时可移除 --dry-run 标签执行持久化写入！\n');
    return;
  }

  // 4. 执行文件持久化安全写入
  console.log('💾 [4/5] 正在安全注入系统数据源 (备份恢复保护机制已就绪)...');

  const storeRaw = fs.readFileSync(STORE_PATH, 'utf-8');
  const techDictRaw = fs.readFileSync(TECH_DICT_PATH, 'utf-8');
  const commonDictRaw = fs.readFileSync(COMMON_DICT_PATH, 'utf-8');

  // 创建内存备份
  const backup = {
    store: storeRaw,
    techDict: techDictRaw,
    commonDict: commonDictRaw
  };

  try {
    // 4.1 注入 tech_dict.js
    let newTechDict = techDictRaw;
    const techEntriesToAppend = [];

    // coreWords 也自动注入 techDict
    (data.coreWords || []).forEach(cw => {
      techEntriesToAppend.push({
        key: cw.word.toLowerCase(),
        entry: {
          word: cw.word,
          phonetic: cw.phonetic,
          pos: cw.pos,
          categoryName: cw.categoryName,
          specTag: cw.specTag,
          generalDefinition: cw.generalDefinition,
          techDefinition: cw.techDefinition,
          techDetail: cw.techDetail,
          designMetaphor: cw.designMetaphor,
          typicalContext: cw.typicalContext,
          isTechTerm: true
        }
      });
    });

    if (data.supplementaryDict) {
      Object.entries(data.supplementaryDict).forEach(([k, v]) => {
        if (v.isTechTerm) {
          techEntriesToAppend.push({ key: k.toLowerCase(), entry: v });
        }
      });
    }

    const techDictExports = '\nmodule.exports = techDictionary;';
    const techDictCloseIdx = newTechDict.lastIndexOf('};');
    if (techDictCloseIdx !== -1) {
      const serializedTech = techEntriesToAppend.map(({ key, entry }) => {
        return `  ${JSON.stringify(key)}: ${JSON.stringify(entry, null, 2).replace(/\n/g, '\n  ')}`;
      }).join(',\n');

      if (serializedTech.trim().length > 0) {
        newTechDict = newTechDict.slice(0, techDictCloseIdx) + ',\n' + serializedTech + '\n' + newTechDict.slice(techDictCloseIdx);
        fs.writeFileSync(TECH_DICT_PATH, newTechDict, 'utf-8');
        console.log(`  ✓ 已向 tech_dict.js 注入 ${techEntriesToAppend.length} 个计算机专业词汇条目`);
      }
    }

    // 4.2 注入 common_dict.js
    let newCommonDict = commonDictRaw;
    const commonEntriesToAppend = [];
    if (data.supplementaryDict) {
      Object.entries(data.supplementaryDict).forEach(([k, v]) => {
        if (!v.isTechTerm) {
          commonEntriesToAppend.push({
            key: k.toLowerCase(),
            entry: {
              word: v.word || k.toLowerCase(),
              phonetic: v.phonetic,
              pos: v.pos,
              definition: v.definition || v.techDefinition || '常用词汇'
            }
          });
        }
      });
    }

    const commonDictCloseIdx = newCommonDict.lastIndexOf('};');
    if (commonDictCloseIdx !== -1 && commonEntriesToAppend.length > 0) {
      const serializedCommon = commonEntriesToAppend.map(({ key, entry }) => {
        return `  ${JSON.stringify(key)}: ${JSON.stringify(entry, null, 2).replace(/\n/g, '\n  ')}`;
      }).join(',\n');

      newCommonDict = newCommonDict.slice(0, commonDictCloseIdx) + ',\n' + serializedCommon + '\n' + newCommonDict.slice(commonDictCloseIdx);
      fs.writeFileSync(COMMON_DICT_PATH, newCommonDict, 'utf-8');
      console.log(`  ✓ 已向 common_dict.js 注入 ${commonEntriesToAppend.length} 个通用词汇条目`);
    }

    // 4.3 注入 store.js (initialWordLibrary & initialArticles)
    let newStore = storeRaw;
    const storeModule = require('../miniprogram/data/store.js');
    const existingWords = storeModule.initialWordLibrary || [];
    const maxWordIdNum = existingWords.reduce((max, w) => {
      const num = parseInt((w.id || '').replace('nb_', ''), 10);
      return !isNaN(num) && num > max ? num : max;
    }, 24);

    let currentWordNum = maxWordIdNum;
    const formattedCoreWords = (data.coreWords || []).map(cw => {
      currentWordNum++;
      return {
        id: `nb_${String(currentWordNum).padStart(2, '0')}`,
        word: cw.word,
        phonetic: cw.phonetic,
        pos: cw.pos,
        specTag: cw.specTag,
        level: cw.level || 'Level 2',
        categoryName: cw.categoryName,
        techDefinition: cw.techDefinition,
        techDetail: cw.techDetail,
        typicalContext: cw.typicalContext,
        source: cw.source || data.article.title,
        status: 'need_review',
        statusLabel: '待复习',
        statusColor: 'warning',
        reviewTimes: 1,
        codeSnippet: cw.codeSnippet,
        generalDefinition: cw.generalDefinition,
        designMetaphor: cw.designMetaphor,
        objectiveQuiz: cw.objectiveQuiz,
        isVerified: false
      };
    });

    // 插入 initialWordLibrary
    const wordLibMarker = '\n// 默认用户学习档案与偏好';
    const wordLibMarkerIdx = newStore.indexOf(wordLibMarker);
    if (wordLibMarkerIdx !== -1 && formattedCoreWords.length > 0) {
      const prevBracketIdx = newStore.lastIndexOf('];', wordLibMarkerIdx);
      const serializedWords = formattedCoreWords.map(w => {
        return '  ' + JSON.stringify(w, null, 2).replace(/\n/g, '\n  ');
      }).join(',\n');

      newStore = newStore.slice(0, prevBracketIdx) + ',\n' + serializedWords + '\n' + newStore.slice(prevBracketIdx);
      console.log(`  ✓ 已向 store.js initialWordLibrary 注入 ${formattedCoreWords.length} 张全新 3D 终端核心词卡`);
    }

    // 格式化 article
    const existingArticles = storeModule.initialArticles || [];
    const catShort = (data.article.categoryId || 'cat_cloud').replace('cat_', '');
    const artId = `art_${catShort}_${String(existingArticles.length + 1).padStart(2, '0')}`;

    const formattedArticle = {
      id: artId,
      categoryId: data.article.categoryId,
      categoryName: data.article.categoryName,
      title: data.article.title,
      sourceName: data.article.sourceName,
      specTag: data.article.specTag,
      readTime: data.article.readTime,
      wordCount: data.article.wordCount,
      readPercent: 0,
      status: 'unread',
      statusLabel: '未精读',
      statusType: 'info',
      summary: data.article.summary,
      keyTerms: data.article.keyTerms,
      paragraphs: (data.article.paragraphs || []).map((p, idx) => ({
        id: `p${idx + 1}`,
        lines: p.lines,
        zhText: p.zhText
      }))
    };

    // 插入 initialArticles
    const artMarker = '\n// 默认上次阅读文章';
    const artMarkerIdx = newStore.indexOf(artMarker);
    if (artMarkerIdx !== -1) {
      const prevBracketIdx = newStore.lastIndexOf('];', artMarkerIdx);
      const serializedArt = '  ' + JSON.stringify(formattedArticle, null, 2).replace(/\n/g, '\n  ');
      newStore = newStore.slice(0, prevBracketIdx) + ',\n' + serializedArt + '\n' + newStore.slice(prevBracketIdx);
      console.log(`  ✓ 已向 store.js initialArticles 注入 1 篇全新技术文献: "${data.article.title}"`);
    }

    // 写回 store.js
    fs.writeFileSync(STORE_PATH, newStore, 'utf-8');

    // 5. 自动执行回归测试套件验证
    console.log('\n🧪 [5/5] 正在运行全局自动化回归测试套件...');
    try {
      execSync('node miniprogram/data/test_dict_system.js', { stdio: 'inherit', cwd: PROJECT_ROOT });
      execSync('node miniprogram/data/test_audio_system.js', { stdio: 'inherit', cwd: PROJECT_ROOT });
    } catch (testErr) {
      console.error('\n❌ 回归测试未通过！正在执行自动回滚...');
      fs.writeFileSync(STORE_PATH, backup.store, 'utf-8');
      fs.writeFileSync(TECH_DICT_PATH, backup.techDict, 'utf-8');
      fs.writeFileSync(COMMON_DICT_PATH, backup.commonDict, 'utf-8');
      console.log('🔄 数据源已完美回滚至合流前初始安全状态！');
      throw testErr;
    }

    console.log('\n==================================================');
    console.log('🎉🎉 恭喜！技术文章与专业词库合流完成！100% 测试通过！');
    console.log(`  • 新增文献: 1 篇 (${formattedArticle.title})`);
    console.log(`  • 新增核心 3D 终端词卡: ${formattedCoreWords.length} 个`);
    console.log(`  • 新增专业词库条目: ${techEntriesToAppend.length} 个`);
    console.log(`  • 新增通用词汇条目: ${commonEntriesToAppend.length} 个`);
    console.log('==================================================\n');

  } catch (err) {
    // 兜底回滚
    fs.writeFileSync(STORE_PATH, backup.store, 'utf-8');
    fs.writeFileSync(TECH_DICT_PATH, backup.techDict, 'utf-8');
    fs.writeFileSync(COMMON_DICT_PATH, backup.commonDict, 'utf-8');
    throw err;
  }
}

// =========================================================================
// CLI 主入口
// =========================================================================
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h') {
    console.log(`
TechVocab 计算机英语内容扩充流水线 CLI

用法:
  node scripts/ingest_pipeline.js analyze <input_path>
      审计文本/文献，输出词频、阅读时间与词库覆盖率分析报告

  node scripts/ingest_pipeline.js prompt <input_path> [--output <output_path>]
      根据文献内容生成结构化 AI 提示词 (可直接发送给大模型获取标准 JSON)

  node scripts/ingest_pipeline.js validate <json_path>
      校验大模型生成的 JSON 数据结构、音标、代码、4选1客观题合规性

  node scripts/ingest_pipeline.js merge <json_path> [--dry-run]
      一键将合规数据安全合流进 store.js, tech_dict.js 与 common_dict.js，
      并自动触发 100% 词库与音频测试验证 (带自动回滚保护)
    `);
    process.exit(0);
  }

  const filePath = args[1];

  switch (command) {
    case 'analyze': {
      if (!filePath) {
        console.error('错误: 请指定待分析的文本文件路径。例如: node scripts/ingest_pipeline.js analyze scripts/input/sample.txt');
        process.exit(1);
      }
      const report = analyzeArticleFile(filePath);
      console.log(formatAuditReport(report));
      break;
    }

    case 'prompt': {
      if (!filePath) {
        console.error('错误: 请指定输入文件路径。');
        process.exit(1);
      }
      const report = analyzeArticleFile(filePath);
      const prompt = buildPrompt(report);
      const outIdx = args.indexOf('--output');
      if (outIdx !== -1 && args[outIdx + 1]) {
        const outPath = path.resolve(process.cwd(), args[outIdx + 1]);
        fs.writeFileSync(outPath, prompt, 'utf-8');
        console.log(`✅ 提示词已成功生成并保存至: ${outPath}`);
      } else {
        console.log(prompt);
      }
      break;
    }

    case 'validate': {
      if (!filePath) {
        console.error('错误: 请指定待校验的 JSON 文件路径。');
        process.exit(1);
      }
      const jsonContent = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf-8'));
      const errs = validateIngestData(jsonContent);
      if (errs.length > 0) {
        console.error('❌ 校验失败:');
        errs.forEach(e => console.error(`  • ${e}`));
        process.exit(1);
      } else {
        console.log('✅ 数据格式校验 100% 合规！');
      }
      break;
    }

    case 'merge': {
      if (!filePath) {
        console.error('错误: 请指定待合流的 JSON 文件路径。');
        process.exit(1);
      }
      const dryRun = args.includes('--dry-run');
      const jsonContent = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf-8'));
      await mergeIngestData(jsonContent, dryRun);
      break;
    }

    default:
      console.error(`未知命令: ${command}。输入 --help 查看使用说明。`);
      process.exit(1);
  }
}

if (require.main === module) {
  main().catch(err => {
    console.error('流水线执行异常:', err.message);
    process.exit(1);
  });
}

module.exports = {
  validateIngestData,
  mergeIngestData,
  checkAudioConnectivity
};
