// scripts/prompt_engine.js
/**
 * 工业级 AI 提示词组装引擎
 * 针对待收录的英文技术文章和词库审计结果，自动组装严格规范的 LLM 结构化生成 Prompt。
 * 指引大模型生成：
 * 1. 行业权威逐段计算机中文精翻
 * 2. 核心专词的“生活常释 vs 计算机专属第一释义” + “认知设计隐喻”
 * 3. 5 行规范工程代码例句 (Go / Rust / Python / C++)
 * 4. 纯自然语言业务客观场景题 (4选1 实战题)
 * 5. 文章中其他生词的词典补全条目 (保证全站查词 100% 覆盖)
 */

const { analyzeArticleText } = require('./article_analyzer.js');

/**
 * 构造面向 LLM 的提示词
 * @param {object} analysisResult analyzeArticleText 或 analyzeArticleFile 返回的结果
 * @param {object} options 额外配置
 * @returns {string} 结构化 Prompt
 */
function buildPrompt(analysisResult, options = {}) {
  const { meta, coverage, paragraphs } = analysisResult;

  const missingList = coverage.missingWords.slice(0, 35).map(w => w.word);

  const prompt = `你是一名具有 15 年大厂底层系统架构经验的资深工程师兼资深双语技术专家。
现在正在为面向程序员的高质量计算机技术英语学习微信小程序【TechVocab】扩充技术文献与专业词库。

我们正在收录一篇技术文献，并需要为小程序生成【100% 严格符合系统标准】的 JSON 数据。

==================================================
【待收录文章元数据与英文原文】
==================================================
文章标题: ${meta.title}
分类标识: ${meta.categoryId} (例如: cat_net, cat_os, cat_ds, cat_db, cat_cloud, cat_sec)
参考来源: ${meta.sourceName} (${meta.specTag})
总单词量: ${meta.wordCount}
段落数量: ${paragraphs.length} 个段落

【段落英文原文】:
${paragraphs.map((p, idx) => `[段落 ${idx + 1}]:\n${p.rawText}`).join('\n\n')}

==================================================
【当前词库审计报告】:
全库已识别已知词: ${coverage.coveredTokens} 词
未录入生词列表 (按词频优先排序):
${missingList.join(', ') || '(无未录入词汇)'}

==================================================
【任务要求与生成规范】
==================================================
请根据原文深层技术语义，输出一段纯 JSON（不要附加任何 Markdown 格式包裹外的多余寒暄，直接提供合规 JSON 字符串）。
JSON 必须包含且仅包含以下三大根节点：
1. "article": 包含文章的元数据、权威中文精翻（逐段对应）及 3~5 个核心技术关键词。
2. "coreWords": 从文章中挑选 2~4 个最具深度和代表性的计算机核心技术术语（若原文已有核心专词或生词，优先选取），为它们构建【深度 3D 终端词卡】数据。
   - 必须包含：音标 phonetic、词性 pos、分类名 categoryName、规范标签 specTag
   - 双轨释义：生活常释 generalDefinition、计算机第一释义 techDefinition、技术细节 techDetail
   - 核心心智模型：一句话打通理解的“设计隐喻” designMetaphor（以“如同...”开头，生动精准通俗）
   - 5 行真实工程代码：codeSnippet（语言可选 Go/Rust/Python/C++，第 1 行为规范注释，第 4 行为 highlight 高亮调用）
   - 客观实战题：objectiveQuiz（纯自然语言业务场景题，4选1，带详细 explanation）
3. "supplementaryDict": 为保证文章中所有单词在小程序内点击均能 100% 弹出释义，请将该文章中出现、但当前系统未收录的所有生词补充为键值对词条：
   - 若属于计算机专词，格式为:
     "word": {
       "phonetic": "/.../",
       "pos": "n./v./adj.",
       "categoryName": "技术分类名",
       "specTag": "领域标签",
       "generalDefinition": "生活常释",
       "techDefinition": "【计】计算机第一释义",
       "techDetail": "工程细节说明",
       "designMetaphor": "如同...",
       "typicalContext": "💡 典型工程语境：...",
       "isTechTerm": true
     }
   - 若属于通用词汇，格式为:
     "word": {
       "phonetic": "/.../",
       "pos": "n./v./adj./adv.",
       "definition": "简洁准确的中文释义"
     }

==================================================
【JSON 样例结构模板】 (请严格依此格式输出):
==================================================
{
  "article": {
    "title": "${meta.title}",
    "categoryId": "${meta.categoryId}",
    "categoryName": "云原生与微服务通信",
    "sourceName": "${meta.sourceName}",
    "specTag": "${meta.specTag}",
    "readTime": "${meta.readTime}",
    "wordCount": "${meta.wordCount}",
    "summary": "一句话精炼的文章中文主旨摘要（30~50字）",
    "keyTerms": ["term1", "term2", "term3"],
    "paragraphs": [
      {
        "lines": [
          "段落切分后适合手机排版的英文行1",
          "英文行2"
        ],
        "zhText": "信达雅、符合程序员专业语感的高质量中文翻译（绝非生硬机翻）"
      }
    ]
  },
  "coreWords": [
    {
      "word": "术语小写",
      "phonetic": "/音标/",
      "pos": "n.",
      "specTag": "RFC/SPEC 标签",
      "level": "Level 2",
      "categoryName": "技术分类名",
      "generalDefinition": "生活通用常释",
      "techDefinition": "计算机第一释义",
      "techDetail": "深入的工程机制解析",
      "typicalContext": "典型工业场景应用",
      "source": "${meta.title}",
      "designMetaphor": "如同...",
      "codeSnippet": {
        "fileName": "EXAMPLE.service.go",
        "lines": [
          { "lineNum": "01", "isComment": true, "code": "// 代码注释" },
          { "lineNum": "02", "isComment": false, "code": "代码行2" },
          { "lineNum": "03", "isComment": false, "code": "代码行3" },
          { "lineNum": "04", "isComment": false, "code": "代码行4", "highlight": "核心函数调用" },
          { "lineNum": "05", "isComment": false, "code": "代码行5" }
        ]
      },
      "objectiveQuiz": {
        "scenario": "生产环境下的架构设计实战场景题干...",
        "options": [
          { "label": "A", "text": "干扰项A", "isCorrect": false },
          { "label": "B", "text": "正确项B", "isCorrect": true },
          { "label": "C", "text": "干扰项C", "isCorrect": false },
          { "label": "D", "text": "干扰项D", "isCorrect": false }
        ],
        "explanation": "深入浅出的原理解释，阐明为什么选该选项..."
      }
    }
  ],
  "supplementaryDict": {
    "生词1": {
      "phonetic": "/音标/",
      "pos": "n.",
      "categoryName": "分类",
      "specTag": "标签",
      "generalDefinition": "常释",
      "techDefinition": "【计】专释",
      "techDetail": "细节",
      "designMetaphor": "如同...",
      "typicalContext": "语境",
      "isTechTerm": true
    },
    "生词2": {
      "phonetic": "/音标/",
      "pos": "adj.",
      "definition": "常用释义"
    }
  }
}
`;

  return prompt;
}

module.exports = {
  buildPrompt
};
