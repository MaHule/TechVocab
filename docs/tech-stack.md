# 技术选型与架构设计说明书 (Tech Stack)

> **文档版本**：v1.0  
> **设计基调**：轻量敏捷 · 零运维成本 · Local-First · 渐进扩展  
> **更新日期**：2026-09-08  

---

## 1. 核心设计哲学与约束指标

针对本项目“个人独立开发、2~3 周内交付上线 MVP、零或极低运维预算、主打流畅学习体验”的诉求，技术架构遵循以下四个第一原则：

1. **Local-First（本地优先）**：背单词与文章阅读是高频、碎片化场景，所有交互必须做到 **0 延迟响应**，离线完全可用，绝不因网络等待菊花圈打断心流；
2. **Serverless & 零运维**：坚决不买云服务器、不配置 Nginx、不搞 HTTPS 域名备案与自建鉴权体系；
3. **技术专属精准度优先**：点词查义不能直接丢给通用翻译 API（避免把 `thread` 查成“线头”），建立计算机专属本地词库；
4. **代码精炼可控**：避免因过度工程引入复杂的重度框架，保持原生代码纯粹度，便于后期灵活重构。

---

## 2. 关键技术选型与论证

### 2.1 前端开发框架：原生微信小程序 (WXML / WXSS / JavaScript)

* **选型结论**：采用**微信小程序原生开发**（搭配原生轻量组件规范）。
* **对比与论证**：
  * **vs. Uni-app (Vue 3) / Taro (React)**：
    * 跨端框架带来额外的编译配置（Vite/Webpack）、打包耗时与版本升级兼容性隐患；
    * 原生小程序在**包体积控制（主包 < 2MB）**和**首屏冷启动渲染速度**上具备绝对优势；
    * 原生对手势滑动（如卡片左右滑卡标记“已掌握/没记住”）的事件监听与渲染层性能损耗最小；
    * 微信官方开发者工具开箱即用，零构建链故障风险，极大缩短 MVP 上线周期。

---

### 2.2 数据存储与账号方案：Local-First + 微信云开发 (CloudBase) 静默同步

* **选型结论**：**`wx.setStorage` 本地存储为主 + 微信云开发数据库 (CloudBase JSON Document) 异步增量同步**。
* **对比与论证**：
  * **零登录摩擦**：直接通过小程序环境获取用户 `openid`，天然具备唯一用户标识，完全免除手机号验证码、密码找回、JWT 鉴权等复杂逻辑；
  * **零服务器运维成本**：云开发提供免费基础配额，无需购买 CVM/ECS 服务器，免除工信部/公安域名 ICP 备案与 SSL 证书配置；
  * **Local-First 机制保障**：
    * 用户所有的刷词进度、生词本增删均**同步写入本地 Storage**，即便在地铁弱网或断网环境下依然畅通无阻；
    * 在小程序生命周期 `onShow`、退出或完成单元学习时，由后台异步调用云函数，以增量方式（Timestamp Diff）将数据同步至云端数据库，换机数据不丢失。

#### 核心数据模型 (Data Schema)

```typescript
// 1. 用户生词本单条记录 (Notebook Item)
interface WordRecord {
  word: string;             // 单词原型，如 "idempotent"
  phonetic: string;         // 音标，如 "/ˌaɪ.dəmˈpoʊ.tənt/"
  pos: string;              // 词性，如 "adj."
  techDefinition: string;   // 计算机专属释义
  contextExample: string;   // 代码或文档例句
  source: 'reader' | 'flashcard'; // 生词来源
  addedAt: number;          // 收藏时间戳
  repetition: number;       // 连续复习成功次数 (用于算法)
  interval: number;         // 下次复习间隔天数
  easeFactor: number;       // 难度因子 (默认 2.5)
  nextReviewAt: number;     // 下次到期复习时间戳
  status: 'need_review' | 'mastered'; // 掌握状态
}

// 2. 模块进度记录 (Module Progress)
interface UserProgress {
  currentModuleId: string;  // 如 "level2_net"
  currentUnitIndex: number; // 当前单元编号
  finishedWords: string[];  // 已掌握词表集合
  consecutiveDays: number;  // 连续打卡天数
  lastStudiedDate: string;  // 最近打卡日期 (YYYY-MM-DD)
}
```

---

### 2.3 记忆曲线算法：精简版 SM-2 算法 (SuperMemo-2)

* **选型结论**：采用 **客户端纯 JavaScript 实现的精简版 SM-2 间隔重复算法（SRS）**。
* **对比与论证**：
  * **为什么不用固定天数阶梯法？**：固定 1/2/4/7 天忽略了生词本身的难度与用户记忆反馈的差异，容易造成“难词过早遗忘、简单词无谓重复”；
  * **为什么自研轻量实现？**：标准 SM-2 算法的核心数学模型仅 30 行纯代码，零外部 NPM 依赖，运行开销为 0；
  * **核心算法逻辑**：
    * 用户在卡片操作反馈时传入评分 `grade`（1: 没记住, 2: 模糊, 3: 已掌握）；
    * 每次反馈根据公式微调 `Ease Factor (EF)` 与 `Interval`：
      $$\text{EF}' = \text{EF} + (0.1 - (3 - \text{grade}) \times (0.08 + (3 - \text{grade}) \times 0.02))$$
    * 若评分 $\ge 2$（模糊/掌握），间隔天数依次递增为 1天 $\to$ 3天 $\to$ $I \times \text{EF}$；若评分为 1（没记住），复习次数重置为 0，间隔重置为次日回炉。

---

### 2.4 文章阅读“点词查义”架构：双层检索机制

* **选型结论**：**L1 本地核心计算机专属词库 + L2 通用词典轻量 API 兜底**。
* **架构设计**：
  1. **L1 本地核心词典 (Local Tech Dict - 优先级最高)**：
     * 打包一个预置好的 `tech_words.json`（涵盖 500+ 个计算机核心通识与专业术语，压缩后仅约 150KB）；
     * 数据结构为 `Hash Map (Key-Value)`，点击单词时执行去除标点与词根预处理后，进行 $O(1)$ 毫秒级命中；
     * 命中后直接弹出规范的**计算机专属释义**与**真实工程语境/代码例句**。
  2. **L2 通用词典兜底 (Fallback Engine)**：
     * 若用户点击的是常规连接词、介词或日常非技术单词（L1 未命中），则异步请求轻量在线查词接口（或调用云函数转发公共翻译 API）获取通用简明英汉释义，保证“点任何词都有反馈”，不破坏阅读沉浸感。

---

## 3. 项目目录结构建议 (Recommended Project Structure)

```text
SecurityEnglish/
├── docs/                             # 产品与设计规范文档
│   ├── product-vision.md             # 产品定位愿景
│   ├── requirements.md               # 完整 PRD 文档
│   ├── design-tokens.md              # 视觉设计规范 (Clean Light)
│   ├── tech-stack.md                 # 技术选型说明书 (本文档)
│   ├── wireframes/                   # 低保真结构图
│   │   └── home.svg
│   └── mockups/                      # 高保真视觉设计稿
│       ├── flashcard.svg             # 单词卡学习页 (浅色规范)
│       ├── reader.svg                # 文章阅读与查词抽屉
│       ├── notebook.svg              # 技术生词本
│       └── profile.svg               # 个人进度页
│
├── miniprogram/                      # 小程序前端代码根目录
│   ├── app.js                        # 全局生命周期与云开发初始化
│   ├── app.json                      # 页面路由与 4-Tab 导航配置
│   ├── app.wxss                      # 全局样式与 Token 变量定义
│   │
│   ├── assets/                       # 静态资源 (图标、音频)
│   │   └── icons/
│   │
│   ├── data/                         # 本地核心词库与精选文章数据
│   │   ├── dict/                     # L1 本地技术词库 (Hash Map)
│   │   │   ├── tech_words.json       # 500+ 专业技术词精准释义
│   │   │   └── words_l1_basic.json   # Level 1 入门语法与报错词库
│   │   └── articles/                 # 官方精选示范技术短文 (3-5篇)
│   │       └── tcp_handshake.json
│   │
│   ├── pages/                        # 业务页面 (4 大核心 Tab + 刷词页)
│   │   ├── home/                     # 1. 首页/学习中心 (Hero卡、模块列表)
│   │   ├── flashcard/                # 2. 单词卡学习页 (卡片翻转、三态反馈)
│   │   ├── reader/                   # 3. 技术文章阅读页 (点词查义抽屉)
│   │   ├── notebook/                 # 4. 技术生词本 (复习CTA、生词管理)
│   │   └── profile/                  # 5. 个人中心 (数据看板、进度矩阵)
│   │
│   ├── services/                     # 核心业务逻辑层
│   │   ├── storage.js                # 本地 Local Storage 封装 (CRUD)
│   │   ├── sync.js                   # 云开发数据库静默同步服务
│   │   ├── sm2.js                    # SM-2 记忆算法核心计算
│   │   └── lookup.js                 # 点词查义调度器 (L1本地 -> L2兜底)
│   │
│   └── utils/                        # 通用辅助工具
│       ├── text_parser.js            # 文本单词切分与标点清洗
│       └── date_helper.js            # 日期与连续打卡计算
│
├── cloudfunctions/                   # 微信云开发服务端目录
│   ├── syncUserData/                 # 用户数据增量同步云函数
│   └── fallbackDictLookup/           # 常规单词在线查词兜底云函数
│
└── project.config.json               # 微信开发者工具项目配置
```

---

## 4. 实施阶段与开发排期建议 (2~3 周迭代计划)

* **第一周 (核心基石与词卡闭环)**：
  * 初始化小程序工程，配置 4-Tab 路由与全局 Design Token 样式；
  * 构建 L1 编程基础与 L2 网络核心通识 JSON 词库；
  * 完成 `flashcard` 页面交互与基于本地 Storage 的 SM-2 算法调度。
* **第二周 (阅读器与生词本闭环)**：
  * 实现 `reader` 文本排版与点词命中机制（BottomSheet 抽屉弹窗）；
  * 打通“文章查词 $\to$ 一键加入生词本 $\to$ 生词本一键复习”闭环链路；
  * 完成 `notebook` 列表管理与标记状态。
* **第三周 (数据看板、云端同步与提审优化)**：
  * 接入微信云开发（CloudBase），实现 openid 免登与生词本数据静默同步；
  * 完善 `profile` 统计看板与连续打卡日历；
  * 真机调试性能与体验调优，提交微信代码审核。
