<div align="center">

<img src="docs/assets/app-icon.svg" width="100" height="100" alt="TechVocab Logo" />

# TechVocab 码词

> **专为计算机与软件工程学习者打造的“专业技术词库 + 真实文档阅读”双闭环轻量英语学习小程序**

[![Platform](https://img.shields.io/badge/Platform-WeChat%20MiniProgram-07C160?logo=wechat&logoColor=white)](https://mp.weixin.qq.com/)
[![Architecture](https://img.shields.io/badge/Architecture-Local--First-0F172A)](#-架构设计与页面流转)
[![Tech Stack](https://img.shields.io/badge/Stack-Native%20WXML%20%7C%20WXSS%20%7C%20JS-F7DF1E?logo=javascript&logoColor=black)](#%EF%B8%8F-技术选型)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/MaHule/TechVocab/pulls)

</div>

---

## 💡 为什么需要 TechVocab？

程序员和计算机专业学习者在阅读一手英文官方文档、开源项目规范、源码注释或技术报错信息时，常常面临核心痛点：

> **“背了四六级、考研或托福数万单词，翻开技术文档依然满屏生词；拿通用词典一查，释义完全对不上代码语境！”**

传统通用背单词软件专注于日常生活或应试考试，而 **TechVocab 码词** 剔除了无关语境，专注于**计算机软硬件、底层系统、网络架构、分布式系统与真实工程代码**中的术语，提供精准的技术释义与沉浸式阅读实战。

### 🥊 传统背单词 App vs. TechVocab 码词

| 核心维度 | 传统通用背单词 App / 词典 | TechVocab 码词 🚀 |
| :--- | :--- | :--- |
| **专业术语释义** | 泛日常义（如将 `thread` 译为“线头”、`socket` 译为“插座”） | **计算机专属精准释义**（精确解析为“线程 / 套接字”，附真实代码语境） |
| **生词例句来源** | 生活散文、日常对话或考试题 | **一线技术文档/开源项目实战**（如 Linux Kernel、MDN、RFC、K8s） |
| **阅读支撑能力** | 脱离真实阅读，孤立死记单词 | **内置专业长文阅读器**，支持长文即点即查与一键加入生词本 |
| **响应速度** | 强依赖网络，请求频繁转圈打断背词心流 | **Local-First 本地优先架构**，毫秒级响应，离线完全可用 |
| **视觉与交互** | 商业化广告多，社交打卡元素复杂 | **Clean Minimalist 极简极客风**，无干扰纯粹学习体验 |

---

## ✨ 核心功能模块

### 1. 📚 计算机技术专属词库 (Tech Dictionaries)
- **知识域系统覆盖**：涵盖操作系统、体系结构、网络通信、网络安全、云计算、前端与现代工程架构等八大计算机核心领域。
- **真实工程场景例句**：配备真实技术场景用法、语法成分与技术考点。
- **易混淆术语辨析**：针对容易混淆的技术概念进行深入对比（如 `Authentication` vs `Authorization`、`Concurrency` vs `Parallelism`）。

### 2. 🔍 真实技术文档精读器 (Smart Reader)
- **内置精选技术长文**：精选 Cloudflare 架构解析、权威安全白皮书等高质量一手材料。
- **即点即查 (Instant Lookup)**：轻点文章中的任意单词，即可在半屏抽屉中弹出专业计算机释义与发音。
- **自由粘贴文本**：支持粘贴外部英文技术文档或控制台报错日志，自动进行技术生词标记与精读。
- **一键生词入库**：遇到陌生术语，点击书签图标直接存入专属生词本。

### 3. ⚡ 艾宾浩斯极客闪卡 (Flashcard Mastery)
- **手势交互卡片**：左右滑动切换，支持“已掌握”与“待巩固”状态标记。
- **科学记忆曲线**：基于遗忘曲线智能调度，优先推送高频与薄弱词汇。
- **通关挑战模式**：支持按知识域进行单元挑战与通关成就激励。

### 4. 📝 智能生词本与针对性复习 (Tech Notebook)
- **熟练度梯度管理**：生词自动按“陌生”、“模糊”、“已牢记”进行归档与过滤。
- **深度穿透直达**：生词本中点击任意词条，可无缝直达词卡详情进行深度学习。

### 5. 🎯 极客视觉与 Local-First 架构
- **Clean Light 浅色高质感规范**：基于 Slate 50/900 调色体系打造，高对比度极客排版。
- **秒开 0 延迟**：基于本地数据存储与缓存设计，无需等待网络请求，首屏秒开。

---

## 🏗️ 架构设计与页面流转

### 页面路由矩阵 (Route Matrix)

```text
[首页 学习中心 (pages/home/home)]
  ├── 点击 [继续今日背词] ────────────────────────(navigateTo)──> [单词卡学习页 (pages/flashcard/flashcard)]
  ├── 点击模块卡片 / [全部词库] ──────────────────(navigateTo)──> [单词总览大纲 (pages/word-overview/word-overview)]
  │                                                                 ├── 点击任意词条 ──────(navigateTo)──> [单词卡详情]
  │                                                                 ├── 点击 [开始背词] ────(navigateTo)──> [模块卡片流]
  │                                                                 └── 点击 [🎯 挑战] ─────(navigateTo)──> [客观真测]
  ├── 点击 [去复习] ──────────────────────────────(reLaunch)───> [生词本 (pages/notebook/notebook)]
  │                                                                 └── 点击 [开始复习] ────(navigateTo)──> [复习卡片流]
  ├── 点击 [粘贴阅读] ────────────────────────────(reLaunch)───> [阅读器 (pages/reader/reader)]
  │                                                                 └── 点击正文单词 ──────> 弹出半屏专业查词抽屉
  └── 全局底部 4-Tab 导航
        ├── Tab 1: [学习] ──> pages/home/home
        ├── Tab 2: [阅读] ──> pages/reader/reader
        ├── Tab 3: [生词本] ──> pages/notebook/notebook
        └── Tab 4: [我的] ──> pages/profile/profile
```

---

## 📂 项目结构说明

```text
TechVocab/
├── docs/                             # 产品定义、视觉设计与架构文档
│   ├── assets/                       # 项目图标与矢量设计资产
│   ├── mockups/                      # 核心页面高保真原型设计 (SVG)
│   ├── wireframes/                   # 骨架与线框图设计
│   ├── design-tokens.md              # Clean Light 全局视觉设计规范
│   ├── product-vision.md             # 产品定位、目标受众与功能边界说明
│   ├── progress.md                   # 迭代进展、缺陷排查与上线看板
│   └── tech-stack.md                 # 技术选型与架构决策论证
├── miniprogram/                      # 微信小程序源码根目录
│   ├── assets/                       # 图标与静态图片资源
│   ├── data/                         # Local-First 词库与状态数据层
│   │   ├── common_dict.js            # 基础计算机高频词库
│   │   ├── tech_dict.js              # 深度专业工程术语库
│   │   ├── reader_dict.js            # 精读阅读专属技术词库
│   │   ├── article_store.js          # 文章数据存储与加载管理
│   │   ├── store.js                  # 用户学习进度、打卡与生词本管理
│   │   └── mock/                     # 本地测试与预置 Mock 数据
│   ├── pages/                        # 小程序视图页面
│   │   ├── home/                     # 首页：学习中心、模块入口与进度速览
│   │   ├── flashcard/                # 闪卡：极客背词卡片、手势交互与通关卡
│   │   ├── reader/                   # 阅读：技术长文阅读、即点即查抽屉
│   │   ├── article-list/             # 文章列表：分类精选技术外文
│   │   ├── article-detail/           # 文章详情：深入阅读与生词标记
│   │   ├── notebook/                 # 生词本：熟练度分类与复习入口
│   │   ├── word-overview/            # 单词总览：模块大纲、双轨释义与真测挑战
│   │   └── profile/                  # 个人中心：学习数据统计、目标设置
│   ├── utils/                        # 工具函数库 (音频播放器、格式化工具)
│   ├── app.js                        # 小程序入口逻辑与全局初始化
│   ├── app.json                      # 全局路由、窗口外观配置
│   ├── app.wxss                      # 全局样式与 CSS Variables
│   └── project.config.json           # 小程序本地配置
├── scripts/                          # 自动化词库构建与文章分析流水线
│   ├── article_analyzer.js           # 技术文章分析与生词抽取器
│   ├── ingest_pipeline.js            # 端到端文章语料导入处理管线
│   ├── prompt_engine.js              # 词条深度释义生成 Prompt 引擎
│   └── input/                        # 待处理的技术文章原始输入语料
├── cloudfunctions/                   # 微信云开发扩展目录
├── project.config.json               # 微信开发者工具项目配置
└── README.md                         # 项目说明文档
```

---

## 🛠️ 数据流水线脚本 (Scripts Pipeline)

在 `scripts/` 目录下内置了专业的技术语料分析与词库构建流水线，可用于自动化处理英文技术文章并提取高质量词库：

```bash
# 1. 运行技术文章分析脚本（生词提取与词频统计）
node scripts/article_analyzer.js

# 2. 运行端到端语料导入管线
node scripts/ingest_pipeline.js
```

---

## 🚀 快速开始与本地开发 (Getting Started)

### 前置环境
- 下载并安装最新稳定版 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- Node.js (推荐 v18+，用于运行数据流水线脚本)

### 运行步骤
1. **克隆项目到本地**：
   ```bash
   git clone https://github.com/MaHule/TechVocab.git
   cd TechVocab
   ```
2. **导入微信开发者工具**：
   - 打开 **微信开发者工具**，点击 **导入**。
   - **项目名称**：填写 `TechVocab`。
   - **项目目录**：选择本项目根目录（包含 `project.config.json` 的目录）。
   - **AppID**：可使用你自己的小程序 AppID 或选择 **测试号**。
3. **开始调试**：
   - 导入后开发者工具将自动编译。
   - 在左侧模拟器中即可即时体验首页、背词卡、长文精读和生词本等全量功能！

---

## 🗺️ 迭代路线图 (Roadmap)

- [x] **Phase 1: 核心产品原型与设计落地**
  - [x] 确立产品定位与核心差异化价值主张 (`product-vision.md`)
  - [x] 制定 Clean Light 全局视觉设计规范 (`design-tokens.md`)
  - [x] 完成首页、闪卡、阅读器、生词本全套高保真视觉稿 (`mockups/*.svg`)
- [x] **Phase 2: 原生小程序工程骨架与全路由贯通**
  - [x] 搭建 Local-First 本地优先数据层架构
  - [x] 录入计算机 8 大核心领域高频专业词库
  - [x] 4 大主 Tab 与二级页面无缝流畅流转
  - [x] 阅读器长文即点即查与生词一键归档
- [ ] **Phase 3: 词库智能化扩展与动态复习算法**
  - [ ] 接入多源技术官方文档自动更新抓取管线
  - [ ] 艾宾浩斯复习算法根据做题准确率动态调权
  - [ ] 增加 RFC 规范常用技术缩写专属检索模块
- [ ] **Phase 4: 微信云开发多端同步 (选配)**
  - [ ] 支持微信登录与跨设备生词本云端同步

---

## 🤝 参与贡献 (Contributing)

非常欢迎社区开发者共同完善 **TechVocab 码词**！你可以通过以下方式参与贡献：
- 提交更多的计算机专业术语、精准代码例句或易混淆概念辨析；
- 推荐优质一手英文技术长文或开源项目 RFC；
- 提交 Bug 报告或提出产品优化建议。

欢迎随时提交 [Issues](https://github.com/MaHule/TechVocab/issues) 或发起 [Pull Requests](https://github.com/MaHule/TechVocab/pulls)！

---

## 📄 开源许可证 (License)

本项目基于 [MIT License](LICENSE) 开源。