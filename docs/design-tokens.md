# TechVocab 全局视觉设计规范 (Design Tokens)

> **设计理念**：Clean Minimalist · High-Contrast Engineering  
> **设计基调**：沿用用户确定的 `wireframes/home.svg` 浅色高质感风格，黑白灰极简底色搭配高对比度冷色点缀  
> **文档版本**：v2.0 (Clean Light Standard)  
> **更新日期**：2026-09-08  

---

## 1. 调色板 (Color Palette)

以清爽耐看的冷灰白为基底，以深曜石黑作为核心主交互色，辅以浅灰结构层次与精准的语义点缀。

### 1.1 中性底色 (Neutral Colors - Clean Light)

| Token 名称 | 色值 HEX | 用途说明 |
| :--- | :--- | :--- |
| `--bg-canvas` | `#F8FAFC` | 全局页面背景底色 (Slate 50 冷白) |
| `--bg-surface` | `#FFFFFF` | 卡片容器、弹窗面板、TabBar 背景 (纯白) |
| `--bg-surface-subtle` | `#F1F5F9` | 次级区块、标签底色、进度底槽 (Slate 100) |
| `--bg-code-block` | `#0F172A` | 代码与终端预览区块 (极高对比度冷黑) |
| `--border-default` | `#E2E8F0` | 标准容器边框、细分割线 (Slate 200) |
| `--border-subtle` | `#CBD5E1` | 次级边框、虚线提示条边框 (Slate 300) |
| `--border-active` | `#0F172A` | 当前选中项、激活状态强边框 (Slate 900) |

### 1.2 核心主色与交互色 (Primary & Action)

| Token 名称 | 色值 HEX | 用途说明 |
| :--- | :--- | :--- |
| `--color-primary` | `#0F172A` | 核心主行动按钮 (CTA)、激活 Tab、主要标题 |
| `--color-primary-text`| `#FFFFFF` | 主按钮文字、高对比度白色文字 |
| `--color-secondary-btn`| `#FFFFFF` | 次级按钮底色 (配合 `#CBD5E1` 边框与 `#0F172A` 文字) |

### 1.3 语义与反馈色 (Semantic Accents)

| Token 名称 | 色值 HEX | 用途说明 |
| :--- | :--- | :--- |
| `--color-success` | `#059669` | 已掌握、已通关、成功打卡 (Emerald 600) |
| `--color-success-bg`| `#ECFDF5` | 成功标签浅绿底 (Emerald 50) |
| `--color-warning` | `#D97706` | 模糊、待巩固、连击打卡火苗 (Amber 600) |
| `--color-warning-bg`| `#FFFBEB` | 警告/模糊标签浅黄底 (Amber 50) |
| `--color-danger` | `#E11D48` | 没记住、生词收集标记、红点 (Rose 600) |
| `--color-danger-bg` | `#FFF1F2` | 没记住标签浅粉底 (Rose 50) |
| `--color-highlight` | `#2563EB` | 阅读中技术术语高亮、链接文字 (Blue 600) |
| `--color-highlight-bg`| `#EFF6FF` | 技术术语选中底衬 (Blue 50) |

### 1.4 文字色彩梯度 (Typography Colors)

| Token 名称 | 色值 HEX | 用途说明 |
| :--- | :--- | :--- |
| `--text-primary` | `#0F172A` | 核心标题、主生词、重点数值 (Slate 900) |
| `--text-body` | `#334155` | 正文释义、文章正文、主要文案 (Slate 700) |
| `--text-secondary` | `#475569` | 模块子标题、次级正文 (Slate 600) |
| `--text-muted` | `#64748B` | 辅助说明、音标、进度百分比 (Slate 500) |
| `--text-subtle` | `#94A3B8` | 占位文字、未开始状态、失效信息 (Slate 400) |

---

## 2. 字体与排版系统 (Typography)

* **UI 界面字体**：`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif`
* **代码与技术术语**：`"JetBrains Mono", "Fira Code", "SF Mono", Menlo, Consolas, monospace`

### 字号与行高层级
* `title-hero`: `24px` / Bold 800 (核心数字、主打卡)
* `title-section`: `18px` / Bold 700 (页面大标题、弹窗主词)
* `title-card`: `14~15px` / Bold 700 (卡片标题、功能名)
* `body-regular`: `13~14px` / Regular 400 (核心释义、文章段落)
* `body-secondary`: `12px` / Regular 400 (音标、辅助说明)
* `caption-tag`: `10~11px` / Semibold 600 (Badge 标签、Level 标注)

---

## 3. 容器与圆角规范 (Radius & Shadows)

* **圆角**：
  * `radius-tag`: `4px` (技术标签、行号)
  * `radius-btn`: `6~8px` (操作按钮、快捷键)
  * `radius-card`: `10~12px` (标准功能卡片、模块条目)
  * `radius-modal`: `16px` (底部半屏弹窗顶部圆角)
  * `radius-pill`: `9999px` (胶囊小标)
* **阴影**：
  * `card-shadow`: `0 2px 6px rgba(15, 23, 42, 0.04)` (极轻微柔和浮层感)
  * `modal-shadow`: `0 -4px 20px rgba(15, 23, 42, 0.08)` (底部抽屉弹窗阴影)
