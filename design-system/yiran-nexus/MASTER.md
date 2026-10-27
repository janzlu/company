# Design System Master File — Yiran Nexus (AI Tech Industrial Magazine)

> **LOGIC:** When building or refactoring any page in this workspace (`nexus-ai-website` or `nexus-ai-services-website`), strictly follow the rules below.

---

**Project:** Yiran Nexus (依然智枢 · 宁波依然网络科技)  
**Updated:** 2026-10-27  
**Style Direction:** AI Tech Industrial Editorial Magazine (AI 科技工业杂志风格)  
**References:**
- `myhomepage/docs/index.html` (1:3 Sticky Editorial Grid, Hairline Rows, Dark Atmospheric Photo Band)
- `pweb/landing.html` (Subtle Engineering Grid, Obsidian Terminal Card, SVG Topology Diagrams, Pre/Post Metric Ledger, Subtle Warm Cursor Glow)
- `untitled folder/index.html` (Obsidian & Warm Bone Ink Palette, Four-Corner Registration Frame, `+` Registration Marks, Orbital SVG Chart, 5:7 Editorial Split)

---

## Global Rules

### 1. Color Palette (Obsidian & Warm Bone Industrial)

| Role | Hex / Value | CSS Variable | Usage |
|------|-------------|--------------|-------|
| Primary Ground | `#0a0c0f` | `--bg` | Main page background |
| Elevated Ground | `#0e1116` | `--bg-2` | Terminal interior, alternate bands |
| Dossier Drawer Ground | `#11151c` | `--bg-drawer` | Slide-over technical dossier drawer |
| Primary Ink | `#eae6dc` | `--ink` | Headlines, primary body text, numbers |
| Secondary Ink | `#b6b0a1` | `--ink-2` | Lead paragraphs, descriptions |
| Muted Ink | `#8a8473` | `--ink-3` | Monospace eyebrows, metadata, coordinates |
| Industrial Bronze | `#b08c5c` | `--bronze` | Section indices, registration marks, historical badges |
| Champagne Accent | `#e8e0cc` | `--accent` | Primary CTA fill, active borders, focal nodes |
| Cold Steel Blue | `#9fd8ff` | `--steel` | AI status indicators, terminal highlights |
| Status Green | `#7ec699` | `--ok` | Live system status dot, terminal success |
| Hairline Border | `rgba(234, 230, 220, 0.14)` | `--hairline` | Primary 1px structural dividers |
| Soft Hairline | `rgba(234, 230, 220, 0.07)` | `--hairline-soft` | Row dividers, frame borders |

### 2. Typography

- **Chinese Display Serif (`--serif`):** `"Noto Serif SC", "Songti SC", "STSong", serif` (Weights: 500, 600, 700; tight tracking `-0.015em`).
- **Latin Editorial Serif (`--latin`):** `"Bodoni Moda", "Instrument Serif", Georgia, serif` (Weights: 400, 500, italic; used for English section subtitles, large tabular metrics, and italic emphasis).
- **Body Sans (`--sans`):** `"Inter Tight", "Archivo", "PingFang SC", "Noto Sans SC", sans-serif` (Weights: 300, 400, 500; line-height `1.75`).
- **Technical Monospace (`--mono`):** `"JetBrains Mono", "SF Mono", ui-monospace, monospace` (Sizes: `11px–12.5px`, letter-spacing `0.08em–0.18em`, uppercase for eyebrows, coordinates, tags, and terminal prompts).

**Google Fonts Import:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400&family=Inter+Tight:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&family=Noto+Serif+SC:wght@500;600;700&display=swap" rel="stylesheet">
```

---

## Structural & Interactive Primitives

### 1. Progressive Disclosure (L1 Spine vs. L2/L3 Slide-over Dossier)
- **L1 Main Spine:** Keep the vertical scroll spine ultra-restrained. Each item shows at most: Index/Year + Serif Title + 1-sentence thesis + 2–3 key metrics/tags + `[+ 调取档案]` trigger.
- **L2/L3 Slide-over Dossier Drawer (`.dossier-drawer`):** All multi-paragraph explanations, comparison tables, 5-step deliverables, interactive ROI sliders, case study before/after breakdowns, and contact/consultation forms live inside the right-side slide-over industrial dossier drawer (`width: min(680px, 92vw)`).
- **Exception on Services Issue (`nexus-ai-services-website`):** The Dual-Engine Interactive Sandbox remains directly playable on the L1 spine, restyled as a restrained obsidian command-line terminal (`.terminal-card`).

### 2. Industrial Registration Marks & Geometry
- **Crosshair Mark (`.mark`):** `12px × 12px` CSS pseudo-element crosshair (`+`) placed beside capability rows and case titles.
- **Corner Frame (`.hero-frame`):** 1px hairline frame around the Hero viewport with `14px × 14px` corner brackets.
- **Atmospheric Photo Band (`.band`):** Full-bleed dark/desaturated real industrial photography (`nexus-ai-website/assets/*.jpg`) with top/bottom gradient fade into `--bg`.
- **Cursor Glow (`.cursor-glow`):** Native system cursor preserved; accompanied by a subtle `360px` radial warm-bronze ambient glow (`rgba(176, 140, 92, 0.08)`).

---

## Anti-Patterns (Strictly Forbidden)

- ❌ **Cyberpunk Neon Gradients:** No `#00F0FF` cyan or `#7000FF` violet glowing text/box-shadows.
- ❌ **SaaS Rounded Glass Cards:** No `rounded-2xl` / `rounded-3xl` floating cards with heavy drop shadows or multi-card bento grids on the main spine.
- ❌ **Custom Laser Cursor:** Do not hide the native OS cursor (`cursor: none` is forbidden).
- ❌ **FontAwesome / Emoji Clutter:** Use geometric CSS registration marks (`.mark`), hairline arrows (`→` / `↗`), and precision SVG technical diagrams instead of generic icon fonts.
- ❌ **Wall of Text on Main Spine:** Never render multi-paragraph descriptions or full forms directly on the L1 page flow.

---

## Pre-Delivery Checklist

- [ ] 100% of original business copy, client names, credentials, phone/email/ICP, and interactive logic (ERP/Solo sandboxes, ROI calculator, forms) preserved across L1 + L2/L3 Dossier Drawer
- [ ] Unified `#0a0c0f` obsidian + `#eae6dc` warm bone ink palette on both pages
- [ ] Slide-over Dossier Drawer supports `Esc` key, backdrop click, focus management, and `aria-expanded` / `aria-modal`
- [ ] Native cursor active with subtle `.cursor-glow`
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive verified at 375px, 768px, 1024px, 1440px with zero horizontal overflow
