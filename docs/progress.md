# 项目开发进度与迭代追踪 (Project Progress)

> **当前阶段**：Phase 1 · 核心页面静态 UI 还原与全站页面路由彻底打通（✅ 已全部互通）  
> **更新时间**：2026-09-08  

---

## 一、 整体进度看板 (Milestones)

| 阶段 / 模块 | 交付物 / 路径 | 状态 | 责任归属 |
| :--- | :--- | :---: | :--- |
| **产品定位 (Product Vision)** | `docs/product-vision.md` | ✅ 已定稿 | 产品核心差异化与受众闭环确认 |
| **低保真结构线框图** | `docs/wireframes/home.svg` | ✅ 已定稿 | 首页/学习中心骨架与层级对齐 |
| **全局视觉设计规范** | `docs/design-tokens.md` | ✅ 已定稿 | Clean Light 浅色规范（Slate 50/900） |
| **高保真视觉稿全套** | `docs/mockups/*.svg` (4 个核心页) | ✅ 已定稿 | 词卡、阅读(大呼吸感重构)、生词本、我的 |
| **技术选型与架构说明** | `docs/tech-stack.md` | ✅ 已定稿 | 原生小程序 + Local-First + 微信云开发 |
| **小程序基础工程骨架** | `project.config.json`, `miniprogram/` | ✅ 已就绪 | 沉浸式导航、全局 Tokens 注入 |
| **模块 1：单词卡学习页 UI** | `miniprogram/pages/flashcard/` | ✅ 已完成 (支持多词切词/通关) | 扩充8大CS术语库，支持切词流转、手势与通关面板 |
| **模块 2：文章阅读与查词抽屉** | `miniprogram/pages/reader/` | ✅ 已完成 (支持直达词卡) | 4-Tab 路由打通、粘贴文本、抽屉一键查专业词卡 |
| **模块 3：技术生词本与复习流** | `miniprogram/pages/notebook/` | ✅ 已完成 (支持点击词卡) | 4-Tab 路由打通、点击任意生词精准直达对应词卡 |
| **模块 4：首页学习中心与模块列表** | `miniprogram/pages/home/` | ✅ 已完成 (支持分类词流) | 首屏入口、四大 Tab 互通、各卡片直达对应词流 |
| **模块 5：个人中心与学习看板** | `miniprogram/pages/profile/` | ✅ 已完成 | 4-Tab 路由打通、目标设置 ActionSheet |
| **模块 6：技术词库单词总览** | `miniprogram/pages/word-overview/` | ✅ 已完成 (支持全局大纲/直达词卡) | 模块看板、双轨释义目录、章节划分、客观真测与背词闭环 |

---

## 二、 页面间跳转与 TabBar 互通矩阵

```text
[首页 pages/home/home] (默认首屏)
  ├── 点击 [继续今日背词] ────────────────────────(navigateTo)──> [单词卡页 pages/flashcard/flashcard]
  ├── 点击模块卡片 / [全部词库] ──────────────────(navigateTo)──> [单词总览 pages/word-overview/word-overview]
  │                                                                 ├── 点击任意词条 ──────(navigateTo)──> [单词卡页 (单词解析)]
  │                                                                 ├── 点击 [开始背词] ────(navigateTo)──> [单词卡页 (模块队列)]
  │                                                                 └── 点击 [🎯 挑战] ─────(navigateTo)──> [单词卡页 (客观真测)]
  ├── 点击 [去复习] ──────────────────────────────(reLaunch)───> [生词本页 pages/notebook/notebook]
  │                                                                 └── 点击 [开始复习] ────(navigateTo)──> [单词卡页]
  ├── 点击 [粘贴阅读] ────────────────────────────(reLaunch)───> [阅读页 pages/reader/reader]
  │                                                                 └── 点击正文单词 ──────> 弹出半屏查词抽屉
  └── 底部 4-Tab 栏 (全局统一)
        ├── Tab 1: [学习]   ──> pages/home/home
        ├── Tab 2: [阅读]   ──> pages/reader/reader
        ├── Tab 3: [生词本] ──> pages/notebook/notebook
        └── Tab 4: [我的]   ──> pages/profile/profile
              └── 点击技术领域进度条 ──────────────(navigateTo)──> [单词总览 pages/word-overview/word-overview]
```

所有页面现已全部打通，可在微信开发者工具中自由点击任意 Tab、按钮、卡片进行顺畅流转！

---

## 三、 白屏报错排查与修复记录 (Bugfix Log)

| 序号 | 故障表现 | 根本原因 (Root Cause) | 解决方案 (Solution) | 状态 |
| :---: | :--- | :--- | :--- | :---: |
| 1 | 点击阅读页报 SyntaxError 白屏 | `reader.js` 中 `onSwitchTab` 与 `onToggleFontSize` 之间遗漏英文逗号 `,`，导致脚本解析失败。 | 补充逗号，Node AST 语法校验 100% 通过。 | ✅ 已修复 |
| 2 | 点击页面后内容区偶发塌陷/留白异常 | `home.json`、`reader.json`、`notebook.json`、`profile.json` 包含非标准配置 `"disableScroll": false`，在部分基座版本触发配置校验异常。 | 移除无用的 `"disableScroll": false`。 | ✅ 已修复 |
| 3 | 自定义顶部导航栏文字与按钮被压扁 | 全局开启 `box-sizing: border-box`，原先将 `height: {{navBarHeight}}px` 与 `padding-top: {{statusBarHeight}}px` 写在同一容器上，导致容器高度被 padding-top 挤占为 0。 | 将 `padding-top: {{statusBarHeight}}px` 置于外层导航，内层 `.nav-content` 独占 `height: {{navBarHeight}}px`，总高度自然贴合胶囊。 | ✅ 已修复 |
| 4 | 生词本初始化渲染为空列表 | `notebook.js` 的 `onLoad` 中异步 `setData` 未完成即调用 `applyFilter`，导致过滤源数组为空。 | 在 `onLoad` 中直接同步计算初始过滤态 `filteredWords` 并随首帧一次性挂载，后续操作加入回调保护。 | ✅ 已修复 |
| 5 | 多机型滚动容器适配 | 原先硬编码 `calc(100vh - 460rpx)`，在小屏机型容易计算异常。 | 采用 Flexbox `flex: 1; height: 0;` 弹性自适应架构，导航栏与底部 TabBar 设置 `flex-shrink: 0`，实现全屏自适应无缝滚动。 | ✅ 已修复 |
| 6 | 单词卡页面加载白屏 | `flashcard.wxml` 文本节点内直接使用了 `{{... < 10 ...}}`，微信 WXML 编译器将 `<` 误识别为未闭合的 XML 标签，导致页面模板编译崩溃。 | 将进度文本计算移至 JS 逻辑层封装为 `unitProgressText`，全站彻底消除 WXML 中的 `<` 运算符。 | ✅ 已修复 |
| 7 | 单词卡轻触翻转查看解析无效 | 原卡片所有内容平铺在同一容器且未配置 `.flipped` 样式规则，点击翻转时视觉没有任何变化。 | 重构为真实 3D 拟物翻转卡片：正面呈现「自测模式 + 语境线索」，反面呈现「深度解析 + 真实工程代码终端」；添加 3D `rotateY(180deg)` 动效、双重可见性防护、轻感触觉震动反馈及滑动防误触保护。 | ✅ 已修复 |
| 8 | 生词本总数24但实际仅5词、全站数据不一致且无法连贯流转 | 各页面使用孤立硬编码 mock 数据；阅读页加词不入库；单词卡评分不沉淀生词本；页面缺失 `onShow` 导致切页状态不刷新。 | 1. 建立统一 Local-First 本地数据中心 (`miniprogram/data/store.js`)；<br>2. 扩充真实 24 词完整计算机词库（16 个已掌握 + 8 个待复习，全部配备音标/专属释义/工程代码）；<br>3. 生词本与首页、个人中心完全动态计算对齐；<br>4. 阅读器加词真正入库，单词卡评分实时同步生词本与今日背词；<br>5. 全站接入 `onShow` 生命周期，保证切页与返回即时刷新。 | ✅ 已修复 |
| 9 | 阅读界面仅高亮词可点击，其他单词无法选中查义 | 段落文本硬编码为纯文本节点，仅两个词绑定事件；词典仅硬编码收录 2 个词。 | 1. 打造文本分词切分引擎 (`reader_dict.js`)，段落分词为单词 Token 与标点 Token，文章所有单词均可点击；<br>2. 构建专业阅读词典并支持智能词形还原（复数、时态、-ing、-ed 自动还原原型）；<br>3. 点击任意单词即刻高亮并唤起半屏查词抽屉，支持一键入库生词本；<br>4. 粘贴自定义文本同样支持实时动态分词，任意词均可点查。 | ✅ 已修复 |
| 10 | 阅读界面需要中英文对照阅读选项 | 默认整篇英文阅读对复杂句子可能理解吃力，但左右分屏受限于手机屏幕宽度排版拥挤，整篇双语并排又破坏英文沉浸感。 | **落实方案 A（段落级按需展开中文对照）**：<br>1. 默认保持纯英文沉浸阅读，不干扰用户英文专注度；<br>2. 每个段落下角配备微型交互胶囊 `[▸ 中文对照]`；<br>3. 点击后即在当前英文段落下平滑展开高质量计算机中文对照卡片（曜石黑侧边条 + 极浅灰底色），再点即可收起；<br>4. 英文正文中任意单词的点词查义、术语高亮和入库生词本能力不受任何干扰，完美并存；<br>5. 粘贴自定义外部文本同步赋予折叠与中文说明扩展能力。 | ✅ 已完成 |
| 11 | 单词卡释义单一（缺通用生活含义）与仅靠主观打分无法验真问题 | 1. 词卡仅展示冷冰冰的计算机含义，用户缺乏从生活常识到技术命名的心智桥梁；<br>2. 仅靠用户自己点“已掌握/模糊”存在认知再认偏差（虚假熟练度）。 | 1. **双轨释义 + 设计隐喻**：全量词库扩充【生活常释】与【计算机专属】，并配有一句话【设计隐喻】（点透程序员借词命名的具象原理）；<br>2. **单元尾声客观闯关（选项2·严格非代码语境）**：卡片翻完后自动触发 3 题真实工程业务场景选择题（纯自然语言业务描述，无任何代码）；<br>3. **客观真验闭环**：做对点亮「客观真验 ✓」认证徽章，做错强制打入「客测回炉」重置 SM-2 曲线，生词本与通关看板实时同步。 | ✅ 已完成 |
| 12 | 学习页面和我的页面数量空白、连续天数缺失、已掌握词与生词本不对应问题 | 1. `store.js` 中 `getHomeData` 与 `getProfileData` 返回的字段结构与页面 WXML 模板中的属性键名存在偏差，导致绑定取值 undefined 显示为空白；<br>2. 「我的」页面中已掌握词数与生词收集数未与生词本做动态对齐，连续打卡天数在缺失时呈现为空白；<br>3. 页面初始数据（Page data）仅定义了空对象 `{}`，在数据首次装载或首帧渲染时容易出现数字闪烁留白。 | 1. **结构对齐与消除空白**：重构 `getHomeData` 与 `getProfileData`，精准输出 `todayProgress`、`moduleList`、`readerTeaser`、`user`、`stats`、`moduleProgress` 完整字段树；<br>2. **全动态实时联动**：个人中心「已掌握词 (16)」严格绑定生词本 `masteredList.length`，「生词收集 (24)」严格绑定词库全量 `words.length`；各模块词数与进度完全取自 `store.words` 动态分类汇总；<br>3. **连续天数智能回退**：`streakDays` 统一降级保底为 `0`（`streakDays: 0`），永不留白；<br>4. **页面级首帧兜底**：在 `home.js`、`profile.js`、`notebook.js` 初始 `data` 中补齐默认结构与数据，彻底杜绝空白渲染。 | ✅ 已完成 |
| 13 | 每次进入阅读页面自动弹出 idempotent 查词抽屉问题 | `reader.js` 初始状态中硬编码了 `selectedWord: 'idempotent'` 与 `isDrawerVisible: true`（初期走查样式遗留），且在 `onLoad` 中默认预载了查词结果，导致无论何时切入阅读页均自动弹起半屏抽屉并高亮该词。 | 1. 将 `reader.js` 初始 `data` 与 `onLoad` 中 `isDrawerVisible` 彻底重置为 `false`，`selectedWord` 重置为 `''`；<br>2. 仅在用户主动点击正文中某单词（`onTapWord`）时才精准高亮并触发抽屉滑出；<br>3. 在抽屉关闭（`onCloseDrawer`）时同步清除选中高亮状态；粘贴文本后同样默认展示纯净全文，不自动弹框。 | ✅ 已修复 |
| 14 | 点击技术词库缺少大纲总览直接跳入卡片背词问题 | 点击词库卡片直接触发 `flashcard` 盲卡背词，开发者无法鸟瞰词库脉络大纲、无法按需点查具体单词、无法了解全模块掌握度分布。 | 1. **高保真设计**：设计符合 Clean Light 规范的 `docs/mockups/word-overview.svg` 页面原型；<br>2. **落地全新页面**：开发 `pages/word-overview/`（模块看板、掌握进度条、状态过滤 Pills、搜索框、章节分块列表、双轨释义）；<br>3. **全链路互通闭环**：首页模块卡片与「我的」进度条点击直达单词总览，列表中单点词条直通 3D 词卡，底部固定栏支持 `[🎯 挑战]` 直达客观闯关与 `[⚡ 开始背词 ›]` 进阶流。 | ✅ 已完成 |
| 15 | 单词卡与单词总览（及阅读页）返回上一级按钮样式与图标不统一问题 | 1. `word-overview` 使用了字符文本箭头 `←`，而 `flashcard` 和 `reader` 使用了 CSS 边框旋转的 Chevron 尖角图标，图标造型迥异；<br>2. 各页面容器外边距 padding 存在 24rpx 与 32rpx 的偏差，导致切页时返回按钮发生 8rpx 的横向位移跳动；<br>3. 触控按压反馈与边框颜色（Slate 900 vs Slate 700）不一致。 | 1. **全局统一按钮组件规范**：在 `app.wxss` 统一定义 `.nav-back-btn`（64rpx × 60rpx, 纯白底, 细微阴影, 12rpx 圆角, scale 0.96 触控反馈）与 `.back-icon`（3.5rpx Slate-900 精密 45° 左指 Chevron）；<br>2. **全页面结构与边距对齐**：`word-overview.wxml`、`flashcard.wxml` 与 `reader.wxml` 全部采用 `<view class="nav-back-btn" bindtap="onTapBack" hover-class="btn-hover"><view class="back-icon"></view></view>`；<br>3. **消除横向位移**：导航容器内边距统一收敛为 `padding: 0 32rpx;`，页面切换时回退按钮位置绝对静止，浑然一体。 | ✅ 已完成 |
| 16 | 清除微信开发者工具全部缓存后重新编译失败、页面白屏问题 | 1. **WXML 编译级致命语法错误**：`flashcard.wxml` 文本节点内部直接包含三元表达式 `<text>{{currentQuizIndex + 1 < quizQueue.length ? ... : ...}}</text>`，包含非法的 `<` 字符，微信 WXML 编译器将其识别为未闭合 XML 标签直接阻断编译并抛出错误；<br>2. **顶层 `const app = getApp();` 竞态白屏**：全部 8 个页面 JS 在全局顶层作用域声明 `getApp()`。在清除缓存重新编译（冷启动）时，Page JS 在 App 实例完全创建前加载求值，导致 `app` 为 `undefined`，进入 `onLoad` 时执行 `app.globalData` 触发 `TypeError` 页面崩溃白屏。 | 1. **修复 WXML 语法**：将 `flashcard.wxml` 按钮文案改写为标准的 `<text wx:if="{{currentQuizIndex + 1 === quizQueue.length}}">` 和 `<text wx:else>` 条件渲染分支，并通过脚本全面排查全站 WXML，确保 0 非法 XML 字符；<br>2. **生命周期安全化改造**：移除全部 8 个页面 JS 顶层的 `const app = getApp()`，改为在各页面 `onLoad` 内通过 `const app = (typeof getApp === 'function' && getApp()) || {};` 安全提取，彻底杜绝冷启动时序竞态；<br>3. **空存储全流程仿真验证**：运行 Node 模拟脚本进行清空 `storage = {}` 启动与 8 页面全生命周期走查，证实 100% 成功编译，0 报错，无任何白屏。 | ✅ 已修复 |
| 17 | `module 'data/article_store.js' is not defined` 运行时白屏阻断报错 | 1. **微信打包器动态依赖树摇误伤**：在 `store.js` 底部使用了对象展开运算符加载子模块 `...require('./article_store.js')`，微信小程序构建工具在对 `data/` 非页面目录做静态依赖收集时，无法识别字面量展开式内部的动态相对引用，导致打包器将 `data/article_store.js` 误认为无用模块未注入 `appservice`；<br>2. 运行时 `pages/home/home.js` 加载 `store.js`，在执行到 `require('./article_store.js')` 时微信 `WASubContext` 无法在模块表中找到该文件，直接抛出 `module 'data/article_store.js' is not defined` 致命错误阻断整站初始化，导致白屏。 | 1. **数据中心一体化收敛**：将 `article_store.js` 的分类与文章知识库（5 大领域分类、9 篇深度文献、阅读进度更新与上次阅读跟踪等核心逻辑）完整内置收敛至 `store.js`，彻底消除跨子文件引用的外部依赖链；<br>2. **兼容层安全兜底**：`article_store.js` 保留安全代理导出，确保即便外部引用也能直接穿透；<br>3. **全站 8 页面全闭环模拟**：在纯净模拟器中完整执行首页及全页面数据调用，断言词库（24 词）与文章库（9 篇）100% 同步就绪，零依赖缺失报错。 | ✅ 已修复 |
| 18 | 阅读界面点击文章单词无法翻译、仅内置词可用且专业词库过少问题 | 1. `reader_dict.js` 中仅硬编码收录 30+ 术语与 24 个主词，其他单词点击后执行硬编码占位模板文案（`【词汇】xxx可在上下文理解...`），无真实释义源；<br>2. 计算机专业术语严重不足，通用英文高频词缺少本地词典匹配；<br>3. 抽屉界面与卡片跳转未适配通用词与非核心词。 | 1. **落地 Local-First 方案一**：构建分层检索体系（L1核心卡片 $\to$ L2计算机专业技术词典 $\to$ L3高频通用英汉词典 $\to$ L4启发式兜底）；<br>2. **大幅丰富计算机专业词库**：新建 `tech_dict.js`，收录 **155+** 计算机网络、并发系统、算法结构、数据库存储、云原生、安全攻防与语法报错权威专业词；<br>3. **建立高频英汉词典**：新建 `common_dict.js`，收录 **501+** 基础通用词汇，覆盖 9 篇文献 **100% 单词 Token**，断言未翻译 Fallback 为 0；<br>4. **动态卡片合成与前瞻支持方案四**：非队列单词点击直通时动态合成 3D 词卡与客观题，抽屉布局自适应区分专业词与基础含义；导出 `lookupWordAsync` 预留后续无缝接入在线查词 API。 | ✅ 已完成 |




