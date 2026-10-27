# YIRAN NEXUS · 依然智枢 — 品牌宣言刊

宁波依然网络科技有限公司（旗下产业 AI 品牌：依然智枢 · YIRAN NEXUS）的企业数字名片。设计语言为 **AI 科技工业杂志**：黑曜石底色、暖骨白正文、青铜索引、发丝线分隔与全屏 AI 基建光流/穿梭视频首屏（含 4 幕电影级叙事运镜与低频工业音效切换）。主刊（L1）只保留 8 字主张、3 项关键产出指标、业务前后收益对账与真实一天叙事；全部长文、纪元细节、客户名录与联络指令台收纳在同区块下方的原位 Toggle 隐现面板（L2/L3），由 `shared/dossier-drawer.js` 统一驱动，不锁死页面滚动。

## 文件结构

```
nexus-ai-website/
├── index.html      品牌主刊 L1：00 首屏 / 01 使命 / 02 基石 / 02.5 真实一天 / 03 纪元 / 04 生态 / 05 连接
├── styles.css      本刊专属样式：全屏 Hero 合成、双物种配图、真实一天时间轴与响应式
├── dossiers.js     DOC-00 → DOC-05 + DOC-STORY 原位面板库（完整保留原站全部企业文案与联络表单）
├── app.js          真实一天视角切换、意向路由、联络表单、复制交互
├── en/             英文精简版（Executive Summary 单页）
│   ├── index.html  英文版：00 首屏 / 01 使命 / 02 指标 / 03 双引擎 / 04 商务直联名片
│   └── app.js      音频控制、全屏光流与移动端导航交互
├── README.md       本文件
└── assets/         工业摄影图版（FIG.01）、新纪元 AI 基建大图（静态海报图）与首屏 14s 沉浸式视频背景板（hero-ai-drone-cluster.mp4）以及两份引擎配图
```

共享层位于同级目录：

- `../shared/industrial-magazine.css`：设计令牌、全屏 Hero、3 项指标条、前后收益对账、24h 时间轴、原位 Toggle 面板、表单与 ROI 组件。
- `../shared/dossier-drawer.js`：`window.NexusUI` 原位 Toggle 状态机（`toggleDossier` / `openDossier` / `closeDossier` / `stepDossier`）、全屏光流 Canvas（`initHeroCanvas`）、Esc 收起、`#dossier=xxx` 深链、HTML 转义与剪贴板工具。
- `../shared/mobile-nav.js`：`window.NexusMobileNav` 移动端全站通用导航抽屉控制器（双向互斥、多语言自适应、ESC/外部空白收起与生命周期管理）。

无构建步骤、无框架运行时依赖。字体通过 Google Fonts 加载，其余均为原生 HTML/CSS/JS。

## 本地运行

```bash
# 在仓库根目录
python3 -m http.server 4321
# 打开 http://localhost:4321/nexus-ai-website/
```

也可直接双击 `index.html`；建议使用本地服务器以获得稳定的字体与相对路径行为。

## 原位面板索引（L2/L3）

| 编号 | DOM ID | 内容 |
| --- | --- | --- |
| DOC-00 | `doc-overview` | 企业总览、品牌主体、双引擎结构与使命 |
| DOC-01 | `doc-manifesto` | 使命宣言、POLE A/B 拓扑、三大企业信仰全文 |
| DOC-02A | `doc-pillar-erp` | 企业级 AI+ERP 智能中枢物种规格 |
| DOC-02B | `doc-pillar-opc` | 一人公司 AI 数字硅基团队物种规格 |
| DOC-STORY | `doc-story` | 老张与小李的 24 小时全流程对比实录 |
| DOC-03A | `doc-chronicle` | 2015–2027+ 五阶段演进纪元全文 |
| DOC-03B | `doc-clients` | 10 家实业与科研院所客户背景 |
| DOC-04 | `doc-alliance` | 投资、渠道与算力生态合作备忘录 |
| DOC-05 | `doc-contact` | 直联通道与五字段加密联络表单 |

任意元素加上 `data-toggle="<DOM ID>"`（或兼容的 `data-dossier="<DOM ID>"`）即可在原位展开对应面板；同一 ID 再次触发则收起。面板容器为 `.toggle-panel`，带 `id="panel-<DOM ID>"`、`data-toggle-panel`、`role="region"` 与 `hidden`。深链格式：`index.html#dossier=doc-manifesto`。

## 维护指南

1. **公司信息**：在 `index.html` 与 `dossiers.js` 中搜索 `宁波依然网络`、`浙ICP备15016619号-10`、`29.8892`。
2. **联络信息**：`159-6841-4820`（林经理，微信同号）、`bd@nbyiran.com`、`ir@nbyiran.com`，分布于首屏页脚、05 章节与 `doc-contact` 面板。
3. **面板文案**：`dossiers.js` 内每个条目的 `render()` 返回 HTML 字符串；修改时保持原文案不丢失。
4. **表单接入**：`app.js` 的 `handleFormSubmit` 目前为前端回执演示。接入飞书 / 企业微信 Webhook 或后端 API 时，在展示成功回执前发送 `fetch` 请求，并保留现有的 `escapeHtml` 转义。
5. **图片**：`assets/` 内摄影作品版权说明见 `assets/credits.json`。

## 设计约束

- 禁止霓虹渐变、圆角玻璃卡片堆叠、自定义激光光标与图标字体。
- 色彩与字体令牌统一定义在 `shared/industrial-magazine.css`，本刊不重复定义。
- 原位面板不锁 `body` 滚动、不渲染遮罩层；`Esc` 收起当前面板并归还焦点。
- 所有动效均响应 `prefers-reduced-motion`；Canvas 在减弱动效时仅绘制静态首帧。

## 姊妹刊

业务落地与交互沙盒站：`../nexus-ai-services-website/index.html`（企业 AI+ERP / 一人公司 AI 双核沙盒、ROI 测算与案例档案）。
