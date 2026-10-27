# YIRAN NEXUS · 依然智枢 — 品牌宣言刊

宁波依然网络科技有限公司（旗下产业 AI 品牌：依然智枢 · YIRAN NEXUS）的企业数字名片。设计语言为 **AI 科技工业杂志**：黑曜石底色、暖骨白正文、青铜索引、发丝线分隔与工业套准标记。主刊（L1）只保留章节索引、一句话主张与关键指标；全部长文、纪元细节、客户名录与联络指令台收纳在右侧滑出的工业档案（L2/L3），由 `shared/dossier-drawer.js` 统一驱动。

## 文件结构

```
nexus-ai-website/
├── index.html      品牌主刊 L1：00 首屏 / 01 使命 / 02 基石 / 03 纪元 / 04 生态 / 05 连接
├── styles.css      本刊专属样式：SVG 星盘动画、图版、响应式与减弱动效降级
├── dossiers.js     DOC-00 → DOC-05 档案库（完整保留原站全部企业文案与联络表单）
├── app.js          UTC+8 时钟、意向路由、联络表单、复制交互
├── README.md       本文件
└── assets/         工业摄影图版（FIG.01 / FIG.02）与图片版权说明
```

共享层位于同级目录：

- `../shared/industrial-magazine.css`：设计令牌、杂志排版原语、档案抽屉、表单与 ROI 组件。
- `../shared/dossier-drawer.js`：档案抽屉引擎（Esc 关闭、遮罩点击、焦点陷阱与还原、滚动锁定、`#dossier=xxx` 深链、上一份/下一份）。

无构建步骤、无框架运行时依赖。字体通过 Google Fonts 加载，其余均为原生 HTML/CSS/JS。

## 本地运行

```bash
# 在仓库根目录
python3 -m http.server 4321
# 打开 http://localhost:4321/nexus-ai-website/
```

也可直接双击 `index.html`；建议使用本地服务器以获得稳定的字体与相对路径行为。

## 档案索引（L2/L3）

| 编号 | DOM ID | 内容 |
| --- | --- | --- |
| DOC-00 | `doc-overview` | 企业总览、品牌主体、双引擎结构与使命 |
| DOC-01 | `doc-manifesto` | 使命宣言、POLE A/B 拓扑、三大企业信仰全文 |
| DOC-02A | `doc-pillar-erp` | 企业级 AI+ERP 智能中枢物种规格 |
| DOC-02B | `doc-pillar-opc` | 一人公司 AI 数字硅基团队物种规格 |
| DOC-03A | `doc-chronicle` | 2015–2027+ 五阶段演进纪元全文 |
| DOC-03B | `doc-clients` | 10 家实业与科研院所客户背景 |
| DOC-04 | `doc-alliance` | 投资、渠道与算力生态合作备忘录 |
| DOC-05 | `doc-contact` | 直联通道与五字段加密联络表单 |

任意元素加上 `data-dossier="<DOM ID>"` 即可打开对应档案；加 `aria-haspopup="dialog"` 以声明交互语义。深链格式：`index.html#dossier=doc-manifesto`。

## 维护指南

1. **公司信息**：在 `index.html` 与 `dossiers.js` 中搜索 `宁波依然网络`、`浙ICP备15016619号-10`、`29.8892`。
2. **联络信息**：`159-6841-4820`（林经理，微信同号）、`bd@nbyiran.com`、`ir@nbyiran.com`，分布于首屏页脚、05 章节与 `doc-contact` 档案。
3. **档案文案**：`dossiers.js` 内每个条目的 `render()` 返回 HTML 字符串；修改时保持原文案不丢失。
4. **表单接入**：`app.js` 的 `handleFormSubmit` 目前为前端回执演示。接入飞书 / 企业微信 Webhook 或后端 API 时，在展示成功回执前发送 `fetch` 请求，并保留现有的 `escapeHtml` 转义。
5. **图片**：`assets/` 内摄影作品版权说明见 `assets/credits.json`。

## 设计约束

- 禁止霓虹渐变、圆角玻璃卡片堆叠、自定义激光光标与图标字体。
- 色彩与字体令牌统一定义在 `shared/industrial-magazine.css`，本刊不重复定义。
- 所有动效均响应 `prefers-reduced-motion`；移动端隐藏星盘，保留文字与档案交互。

## 姊妹刊

业务落地与交互沙盒站：`../nexus-ai-services-website/index.html`（企业 AI+ERP / 一人公司 AI 双核沙盒、ROI 测算与案例档案）。
