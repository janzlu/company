#!/usr/bin/env node
/* =========================================================================
   YIRAN NEXUS · END-TO-END SITE VERIFICATION
   Line gates · five upgrade points · inline toggles · content retention · jsdom
   Run: node tests/verify-sites.mjs
   ========================================================================= */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { JSDOM, VirtualConsole } from 'jsdom';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let passed = 0;
const failures = [];

function check(name, condition, detail = '') {
  if (condition) {
    passed += 1;
    console.log(`  PASS  ${name}`);
  } else {
    failures.push(detail ? `${name} — ${detail}` : name);
    console.error(`  FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

function section(title) {
  console.log(`\n${title}`);
}

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function lineCount(text) {
  if (!text) return 0;
  const count = text.split(/\r?\n/).length;
  return text.endsWith('\n') ? count - 1 : count;
}

function listSourceFiles(dir, acc = []) {
  const abs = path.join(ROOT, dir);
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    if (entry.name === 'assets' || entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const child = path.join(abs, entry.name);
    if (entry.isDirectory()) listSourceFiles(path.relative(ROOT, child), acc);
    else if (/\.(html|css|js)$/i.test(entry.name)) acc.push(path.relative(ROOT, child).split(path.sep).join('/'));
  }
  return acc;
}

function normalizeText(value) {
  return String(value == null ? '' : value).replace(/\s+/g, '');
}

function parseDoc(rel) {
  return new JSDOM(read(rel)).window.document;
}

const REQUIRED_FILES = [
  'shared/industrial-magazine.css',
  'shared/dossier-drawer.js',
  'nexus-ai-website/index.html',
  'nexus-ai-website/styles.css',
  'nexus-ai-website/dossiers.js',
  'nexus-ai-website/app.js',
  'nexus-ai-website/README.md',
  'nexus-ai-services-website/index.html',
  'nexus-ai-services-website/styles.css',
  'nexus-ai-services-website/dossiers.js',
  'nexus-ai-services-website/app.js'
];

const LINE_GATES = {
  'shared/industrial-magazine.css': 500,
  'shared/dossier-drawer.js': 500,
  'nexus-ai-website/index.html': 500,
  'nexus-ai-website/styles.css': 400,
  'nexus-ai-website/dossiers.js': 500,
  'nexus-ai-website/app.js': 350,
  'nexus-ai-services-website/index.html': 600,
  'nexus-ai-services-website/styles.css': 450,
  'nexus-ai-services-website/dossiers.js': 600,
  'nexus-ai-services-website/app.js': 600
};

const BRAND_PANEL_IDS = [
  'doc-overview', 'doc-manifesto', 'doc-pillar-erp', 'doc-pillar-opc', 'doc-story',
  'doc-chronicle', 'doc-clients', 'doc-alliance', 'doc-contact'
];

const SERVICE_PANEL_IDS = [
  'srv-bottleneck', 'srv-erp-spec', 'srv-solo-spec', 'srv-process',
  'srv-roi', 'srv-cases', 'srv-consult'
];

/* ------------------------------------------------------------- static info */
section('1. 代码规模与整洁度');

for (const rel of REQUIRED_FILES) {
  check(`交付文件存在 · ${rel}`, fs.existsSync(path.join(ROOT, rel)));
}

const sourceFiles = [];
for (const dir of ['shared', 'nexus-ai-website', 'nexus-ai-services-website']) {
  for (const rel of listSourceFiles(dir)) {
    const text = read(rel);
    sourceFiles.push({ rel, text, lines: lineCount(text) });
  }
}

for (const file of sourceFiles) {
  check(`单文件 < 1000 行 · ${file.rel} (${file.lines})`, file.lines < 1000, `实际 ${file.lines} 行`);
  const gate = LINE_GATES[file.rel];
  if (gate) {
    check(`文件行数红线 < ${gate} 行 · ${file.rel} (${file.lines})`, file.lines < gate, `实际 ${file.lines} 行`);
  }
}

const placeholderPattern = /TODO|FIXME|\.\.\.省略|\bpass\b|lorem ipsum/i;
const placeholderOffenders = sourceFiles
  .filter((file) => placeholderPattern.test(file.text))
  .map((file) => file.rel);
check('全站无 TODO / FIXME / pass / ...省略 占位实现', placeholderOffenders.length === 0, placeholderOffenders.join(', '));

const jsFiles = sourceFiles.filter((file) => file.rel.endsWith('.js'));
const syntaxOffenders = [];
for (const file of jsFiles) {
  try {
    execFileSync(process.execPath, ['--check', path.join(ROOT, file.rel)], { stdio: 'pipe' });
  } catch (err) {
    syntaxOffenders.push(`${file.rel}: ${String(err.stderr || err.message).trim().split('\n')[0]}`);
  }
}
check(`node --check 全部 JS (${jsFiles.length} 个)`, syntaxOffenders.length === 0, syntaxOffenders.join('; '));

const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
  'meta', 'param', 'source', 'track', 'wbr'
]);

function findTagIssues(html) {
  const issues = [];
  const stripped = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  const stack = [];
  let index = 0;

  while ((index = stripped.indexOf('<', index)) !== -1) {
    let cursor = index + 1;
    let quote = null;
    while (cursor < stripped.length) {
      const char = stripped[cursor];
      if (quote) {
        if (char === quote) quote = null;
      } else if (char === '"' || char === "'") {
        quote = char;
      } else if (char === '>') {
        break;
      }
      cursor += 1;
    }
    if (cursor >= stripped.length) {
      issues.push('存在未结束的标签');
      break;
    }
    const raw = stripped.slice(index, cursor + 1);
    const line = stripped.slice(0, index).split('\n').length;
    index = cursor + 1;

    if (/^<[!?]/.test(raw)) continue;
    const closing = raw.match(/^<\s*\/\s*([a-zA-Z][\w:-]*)/);
    if (closing) {
      const name = closing[1].toLowerCase();
      if (!stack.length) issues.push(`第 ${line} 行多余的 </${name}>`);
      else {
        const top = stack.pop();
        if (top.name !== name) issues.push(`第 ${line} 行 </${name}> 与 <${top.name}> 不匹配`);
      }
      continue;
    }
    const opening = raw.match(/^<\s*([a-zA-Z][\w:-]*)/);
    if (!opening) continue;
    const name = opening[1].toLowerCase();
    if (VOID_TAGS.has(name) || /\/\s*>$/.test(raw)) continue;
    stack.push({ name, line });
  }

  if (stack.length) issues.push('未闭合: ' + stack.map((tag) => `<${tag.name}>@${tag.line}`).join(', '));
  return issues;
}

for (const rel of ['nexus-ai-website/index.html', 'nexus-ai-services-website/index.html']) {
  const issues = findTagIssues(read(rel));
  check(`HTML 标签闭合 · ${rel}`, issues.length === 0, issues.slice(0, 4).join('; '));
}

/* ---------------------------------------------------- assets & anti-pattern */
section('2. 全屏光流、配图资产与反模式清零');

const NEW_ASSETS = [
  'nexus-ai-website/assets/hero-ai-infrastructure.jpg',
  'nexus-ai-website/assets/engine-enterprise-erp.jpg',
  'nexus-ai-website/assets/engine-solopreneur-matrix.jpg'
];
for (const rel of NEW_ASSETS) {
  const abs = path.join(ROOT, rel);
  const size = fs.existsSync(abs) ? fs.statSync(abs).size : 0;
  check(`纪元主题大图存在且 > 30KB · ${rel} (${Math.round(size / 1024)}KB)`, size > 30 * 1024);
}

const brandHtml = read('nexus-ai-website/index.html');
const servicesHtml = read('nexus-ai-services-website/index.html');
const brandCss = read('nexus-ai-website/styles.css');
const servicesCss = read('nexus-ai-services-website/styles.css');
const sharedCss = read('shared/industrial-magazine.css');
const sharedJs = read('shared/dossier-drawer.js');
const brandDossiers = read('nexus-ai-website/dossiers.js');
const brandApp = read('nexus-ai-website/app.js');
const serviceDossiers = read('nexus-ai-services-website/dossiers.js');
const serviceApp = read('nexus-ai-services-website/app.js');

check('主刊引用三张新纪元大图',
  NEW_ASSETS.every((rel) => brandHtml.includes(path.basename(rel))));
check('副刊引用全屏 AI 基建首图', servicesHtml.includes('hero-ai-infrastructure.jpg'));

for (const [label, html] of [['主刊', brandHtml], ['副刊', servicesHtml]]) {
  check(`${label}全屏首屏 · hero-fullbleed / hero-bg-img / hero-field / hero-vignette`,
    html.includes('hero-fullbleed') && html.includes('hero-bg-img') &&
    html.includes('class="hero-field"') && html.includes('hero-vignette'));
  check(`${label}全屏 Canvas 唯一实例`, (html.match(/class="hero-field"/g) || []).length === 1);
}

check('共享层光流 Canvas 渲染器 · 2D / 椭圆轨道 / rAF / 降级',
  sharedJs.includes('getContext') && sharedJs.includes('ellipse') &&
  sharedJs.includes('requestAnimationFrame') && sharedJs.includes('prefersReduced'));

const ANTI_PATTERNS = [
  ['Tailwind CDN', /cdn\.tailwindcss\.com/i],
  ['Three.js CDN', /three\.min\.js/i],
  ['FontAwesome', /font-?awesome/i],
  ['cursor: none', /cursor\s*:\s*none/i],
  ['赛博青 #00F0FF', /#00f0ff/i],
  ['霓虹紫 #7000FF', /#7000ff/i],
  ['旧光标点 #cursor-dot', /#cursor-dot/i],
  ['旧光标环 #cursor-ring', /#cursor-ring/i],
  ['WebGL 画布 #webgl-canvas', /webgl-canvas/i]
];

const antiOffenders = [];
for (const file of sourceFiles) {
  for (const [label, pattern] of ANTI_PATTERNS) {
    if (pattern.test(file.text)) antiOffenders.push(`${file.rel} → ${label}`);
  }
}
check('全站已移除 Tailwind / Three.js / FontAwesome / 旧光标与霓虹反模式',
  antiOffenders.length === 0, antiOffenders.join('; '));

const drawerRemnants = [];
for (const file of sourceFiles) {
  if (file.rel.endsWith('.css') && /\.dossier-drawer\b|\.dossier-backdrop\b|body\.dossier-open\b/.test(file.text)) {
    drawerRemnants.push(`${file.rel} 含旧抽屉选择器`);
  }
  if (file.rel.endsWith('.js') && /dossier-open|dossier-backdrop|getElementById\(['"]dossier-drawer/.test(file.text)) {
    drawerRemnants.push(`${file.rel} 含旧抽屉逻辑`);
  }
  if (file.rel.endsWith('.html') && /id=["']dossier-(drawer|backdrop)["']|class=["'][^"']*dossier-open/.test(file.text)) {
    drawerRemnants.push(`${file.rel} 含旧抽屉节点`);
  }
}
check('旧右侧抽屉 / 遮罩 / 页面滚动锁已完全移除', drawerRemnants.length === 0, drawerRemnants.join('; '));

const toggleBlocks = Array.from(sharedCss.matchAll(/\.toggle-panel[^{}]*\{([^{}]*)\}/g)).map((match) => match[1]);
check('原位 Toggle 面板 · 文档流内展开，非 fixed 抽屉',
  toggleBlocks.length >= 3 && toggleBlocks.every((block) => !/position\s*:\s*fixed/.test(block)),
  `blocks=${toggleBlocks.length}`);
check('原位 Toggle 面板 · [hidden] 不占位',
  /\.toggle-panel\[hidden\]\s*\{[^}]*display\s*:\s*none/.test(sharedCss));

check('两刊 reduced-motion 静态降级覆盖共享层与分刊 CSS',
  sharedCss.includes('prefers-reduced-motion') && brandCss.includes('prefers-reduced-motion') &&
  servicesCss.includes('prefers-reduced-motion'));

/* ---------------------------------------------------------- upgrade points */
section('3. 五大升级要点');

const brandStatic = parseDoc('nexus-ai-website/index.html');
const servicesStatic = parseDoc('nexus-ai-services-website/index.html');

const brandH1 = normalizeText(brandStatic.querySelector('.hero-title') && brandStatic.querySelector('.hero-title').textContent);
const servicesH1 = normalizeText(servicesStatic.querySelector('.hero-title') && servicesStatic.querySelector('.hero-title').textContent);
check('主刊精简大标题 · 让智能，真正成为生产力。', brandH1 === '让智能，真正成为生产力。', brandH1);
check('副刊精简大标题 · 让智能，真正落地每一笔订单。', servicesH1 === '让智能，真正落地每一笔订单。', servicesH1);

function metricPairs(doc) {
  return Array.from(doc.querySelectorAll('.key-metrics-strip .key-metric')).map((item) => ({
    num: (item.querySelector('.num') && item.querySelector('.num').textContent || '').trim(),
    k: (item.querySelector('.k') && item.querySelector('.k').textContent || '').trim(),
    v: (item.querySelector('.v') && item.querySelector('.v').textContent || '').trim()
  }));
}

const EXPECTED_METRICS = [
  ['5s', '秒级排产'],
  ['7×24h', '24h 自动成单'],
  ['0中断', '旧系统零推倒']
];
for (const [label, doc] of [['主刊', brandStatic], ['副刊', servicesStatic]]) {
  const metrics = metricPairs(doc);
  check(`${label}三项关键产出指标 · 5s / 7×24h / 0中断`,
    metrics.length === 3 && EXPECTED_METRICS.every((pair, index) =>
      metrics[index].num === pair[0] && metrics[index].k === pair[1]));
  check(`${label}指标收益佐证 · +28% / +300% / 100%`,
    metrics.length === 3 && metrics[0].v.includes('+28%') &&
    metrics[1].v.includes('+300%') && metrics[2].v.includes('100%'));
}

const ledgers = brandStatic.querySelectorAll('.benefit-ledger');
const benefitRows = brandStatic.querySelectorAll('.benefit-row');
check('主刊业务场景前 / 后收益对账 · 2 张账本 / 7 行对比',
  ledgers.length === 2 && benefitRows.length === 7,
  `ledgers=${ledgers.length} rows=${benefitRows.length}`);
check('收益对账每行均含场景 / Before / After / 箭头',
  Array.from(benefitRows).every((row) =>
    (row.querySelector('.benefit-scenario') && row.querySelector('.benefit-scenario').textContent.trim()) &&
    (row.querySelector('.benefit-before') && row.querySelector('.benefit-before').textContent.trim()) &&
    (row.querySelector('.benefit-after') && row.querySelector('.benefit-after').textContent.trim()) &&
    (row.querySelector('.benefit-arrow') && row.querySelector('.benefit-arrow').textContent.trim()) === '→'));
const benefitText = Array.from(benefitRows).map((row) => row.textContent).join(' ');
check('收益对账覆盖排产 / 销冠 / 旧系统零推倒',
  ['5 秒全局智能排产', '24h 多语种销冠客服', '旧系统零推倒无损接入'].every((needle) => benefitText.includes(needle)));

const dayStory = brandStatic.getElementById('day-story');
const storyTabs = brandStatic.querySelectorAll('.day-tab[data-story-role]');
const storyErp = brandStatic.getElementById('story-erp');
const storySolo = brandStatic.getElementById('story-solo');
check('主刊独立补充叙事「真实一天」 · 双视角 Toggle 时间轴',
  Boolean(dayStory) && storyTabs.length === 2 &&
  storyTabs[0].getAttribute('data-story-role') === 'erp' &&
  storyTabs[1].getAttribute('data-story-role') === 'solo' &&
  storyErp && storySolo && storySolo.hidden === true);
check('真实一天 · 老张 / 小李各 3 个黄金节点',
  storyErp.querySelectorAll('.day-step').length === 3 &&
  storySolo.querySelectorAll('.day-step').length === 3 &&
  ['06:30', '10:00', '16:30'].every((time) => storyErp.textContent.includes(time)) &&
  ['00:40', '08:30', '16:00'].every((time) => storySolo.textContent.includes(time)));
check('真实一天 · 全量 24h 对比收纳于 DOC-STORY 原位面板',
  brandApp.includes('window.switchStoryRole = switchStoryRole') &&
  Boolean(brandStatic.querySelector('[data-toggle="doc-story"][aria-controls="panel-doc-story"]')));

function panelAudit(doc, ids, label) {
  const panels = Array.from(doc.querySelectorAll('.toggle-panel'));
  check(`${label}原位 Toggle 面板数量 · ${ids.length}`, panels.length === ids.length, `实际 ${panels.length}`);
  for (const id of ids) {
    const panel = doc.getElementById('panel-' + id);
    const triggers = Array.from(doc.querySelectorAll(`[data-toggle="${id}"]`));
    check(`${label}面板 ${id} · 初始收起 / role=region / 触发器 aria 契约`,
      Boolean(panel) && panel.getAttribute('data-toggle-panel') === id &&
      panel.getAttribute('role') === 'region' && panel.hidden === true &&
      panel.getAttribute('aria-hidden') === 'true' &&
      triggers.length > 0 &&
      triggers.every((trigger) => trigger.getAttribute('aria-expanded') === 'false' &&
        trigger.getAttribute('aria-controls') === 'panel-' + id));
  }
}

panelAudit(brandStatic, BRAND_PANEL_IDS, '主刊');
panelAudit(servicesStatic, SERVICE_PANEL_IDS, '副刊');

check('共享 Toggle 状态机导出 · open / close / toggle / step / current / isOpen',
  ['toggleDossier', 'openDossier', 'closeDossier', 'stepDossier', 'getCurrent', 'isOpen']
    .every((name) => new RegExp(name + '\\s*:').test(sharedJs)));
check('主刊面板注册顺序 · 9 个原位面板全量挂载',
  BRAND_PANEL_IDS.every((id) => brandDossiers.includes(`'${id}'`)) &&
  brandDossiers.indexOf("'doc-story'") > brandDossiers.indexOf("'doc-pillar-opc'"));
check('副刊面板注册顺序 · 7 个原位面板全量挂载',
  SERVICE_PANEL_IDS.every((id) => serviceDossiers.includes(`'${id}'`)));

/* ------------------------------------------------------- content retention */
section('4. 原始业务内容 100% 零丢失');

const brandCorpus = brandHtml + brandDossiers + brandApp;
const servicesCorpus = servicesHtml + serviceDossiers + serviceApp;
const allCorpus = brandCorpus + servicesCorpus;

function assertContent(label, corpus, needles) {
  const missing = needles.filter((needle) => !corpus.includes(needle));
  check(`${label} (${needles.length})`, missing.length === 0, missing.length ? `缺少: ${missing.join(' / ')}` : '');
}

const CLIENTS = [
  '佳乐股份', '凯孚新材料', '楚鑫材料', '宁波艾升纸制', '天坤建筑',
  'Floravase', '日合柑桔', '食全食美',
  '中国—中东欧国家创新合作研究中心', '宁波海上丝绸之路研究院'
];
assertContent('主刊 10 家实业与科研院所名录', brandCorpus, CLIENTS);
assertContent('副刊 10 家实业与科研院所名录', servicesCorpus, CLIENTS);

const SHARED_CONTACT = ['159-6841-4820', '15968414820', 'bd@nbyiran.com', '浙ICP备15016619号-10'];
assertContent('两刊共享直联实体 · 林经理专线 / 商务邮箱 / 备案号', allCorpus, SHARED_CONTACT);
assertContent('主刊联络实体', brandCorpus, SHARED_CONTACT.concat('ir@nbyiran.com'));
assertContent('副刊联络实体', servicesCorpus, SHARED_CONTACT);

assertContent('主刊三大信仰', brandCorpus, [
  'BELIEF 01', 'BELIEF 02', 'BELIEF 03', '科技平权', '拒绝标准品桎梏', '结果导向'
]);
assertContent('主刊两大物种', brandCorpus, [
  '企业级 AI+ERP 智能中枢', '一人公司 AI 数字硅基团队', 'SPECIES 01', 'SPECIES 02'
]);
assertContent('主刊 2015—2027+ 五个纪元', brandCorpus, [
  '2015-22 · PHASE 0 · 实业信息化筑基期',
  '2023 · PHASE I · AI 原型破壁期',
  '2024 · PHASE II · 商业深潜期',
  '2025-26 · PHASE III · 规模化普惠期',
  '2027+ · PHASE IV · 远景奇点'
]);
assertContent('主刊品牌宣言与总览文案', brandCorpus, [
  '让大模型能力普惠百业，打通 AI 与实体生产的最后一公里。',
  '跨越“硅基智能”与“碳基实业”的鸿沟',
  '国家级科技型中小企业',
  '29.8892°N'
]);

assertContent('副刊定制五步法', servicesCorpus, [
  '深度业务诊断与卡点梳理',
  '专属知识库构建与模型微调',
  '旧系统无损改造与AI工作流定制',
  '私有化安全部署与1对1驻场辅导',
  '包教包会赋能与周度安全巡检'
]);
assertContent('副刊包教包会培养管理员承诺', servicesCorpus, [
  '免费为企业定向培养 1 名内部 AI 系统管理员',
  '定向培养1名管理员',
  '1对1 包教包会'
]);
assertContent('副刊 4 大案例痛点与方案', servicesCorpus, [
  '非标BOM核价与AI智能排产系统定制',
  '非标定制与新材料配方核价需工程师耗时2天',
  'AI 自动拆解 BOM 核价引擎',
  '微信群语音/手写单自动开单与库存预测',
  '每天数百张餐饮与生鲜客户手写菜单',
  '企微群AI接单Agent直连进销存ERP',
  '1人操盘年销千万的全自动出海矩阵',
  '主理人独自兼顾选品、海外社媒内容',
  '定制AI多语种海外获客与导购销冠Agent',
  '工程标书/合同AI自动审拟与项目协同',
  '大量时间消耗在工程合同审查',
  '注入10年历史工程规范与私有档案库'
]);
assertContent('副刊 4 大案例指标', servicesCorpus, [
  '3分钟', '+32%', '省 6 人', '99.8%', '1人=8人', '3.4倍', '+210%', '85%'
]);
assertContent('副刊 ROI 与终端核心数据', servicesCorpus, [
  '892,500', '18,375', '8.5 倍', '98.6%', '1人 = 6人',
  '3000套智能阀门', 'M8高强螺栓', '¥ 346,000 (4家客户)'
]);
assertContent('副刊免费诊断三项承诺', servicesCorpus, [
  '1对1 业务卡点梳理', '定制原型演示', '透明周期与报价清单'
]);
assertContent('副刊旧系统无损与私有化交付承诺', servicesCorpus, [
  '旧系统无损升级', '私有化部署', '国家级科技型中小企业'
]);

/* ------------------------------------------------------------- jsdom boot */
function makeCanvasContext(stats) {
  return {
    strokeStyle: '', fillStyle: '', lineWidth: 1,
    clearRect() { stats.frames += 1; },
    save() {}, restore() {}, translate() {}, rotate() {}, setTransform() {},
    beginPath() {}, ellipse() {}, arc() {},
    stroke() { stats.stroke += 1; },
    fill() { stats.fill += 1; }
  };
}

function boot(relHtml, scriptFiles, options = {}) {
  const html = read(relHtml)
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<link\b[^>]*>/gi, '');
  const errors = [];
  const canvasStats = { frames: 0, stroke: 0, fill: 0 };
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', (error) => errors.push(String((error && (error.detail || error.message)) || error)));
  virtualConsole.on('error', (...args) => errors.push(args.map(String).join(' ')));
  virtualConsole.on('warn', () => {});

  const url = 'http://localhost/' + relHtml.split('/').pop() + (options.hash || '');
  const dom = new JSDOM(html, {
    url,
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    virtualConsole
  });
  const win = dom.window;

  win.addEventListener('error', (event) => errors.push(String(event.message || event.error || 'window error')));
  win.matchMedia = (query) => ({
    matches: Boolean(options.reduced && /prefers-reduced-motion/.test(query)),
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() { return false; }
  });
  win.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  win.Element.prototype.scrollIntoView = function () {};
  win.scrollTo = function () {};
  win.HTMLCanvasElement.prototype.getContext = function () { return makeCanvasContext(canvasStats); };

  try {
    for (const rel of scriptFiles) win.eval(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
    win.document.dispatchEvent(new win.Event('DOMContentLoaded'));
  } catch (error) {
    errors.push('load: ' + String((error && error.message) || error));
  }

  return { dom, win, errors, canvasStats };
}

function panelSnapshot(win, id) {
  const doc = win.document;
  const panel = doc.getElementById('panel-' + id);
  const triggers = Array.from(doc.querySelectorAll(`[data-toggle="${id}"]`));
  return {
    panel,
    triggers,
    hidden: panel ? panel.hidden : null,
    aria: panel ? panel.getAttribute('aria-hidden') : null,
    openClass: panel ? panel.classList.contains('is-open') : false,
    expanded: triggers.map((trigger) => trigger.getAttribute('aria-expanded')),
    controls: triggers.map((trigger) => trigger.getAttribute('aria-controls')),
    rendered: panel ? Boolean(panel.querySelector('.toggle-inner') && panel.querySelector('.dossier-content')) : false,
    textLength: panel ? panel.textContent.trim().length : 0,
    innerLength: panel ? panel.innerHTML.trim().length : 0,
    current: win.NexusUI.getCurrent(),
    isOpen: win.NexusUI.isOpen(id),
    bodyOverflow: doc.body.style.overflow,
    bodyLocked: doc.body.classList.contains('dossier-open')
  };
}

function checkMountedPanels(win, ids, label) {
  for (const id of ids) {
    const state = panelSnapshot(win, id);
    check(`${label}运行时面板 ${id} · 已渲染 / 初始收起 / 触发器同步`,
      state.rendered && state.hidden === true && state.aria === 'true' &&
      state.innerLength > 300 && state.textLength > 80 &&
      state.triggers.length > 0 &&
      state.expanded.every((value) => value === 'false') &&
      state.controls.every((value) => value === 'panel-' + id),
      `rendered=${state.rendered} hidden=${state.hidden} aria=${state.aria} len=${state.innerLength} text=${state.textLength}`);
  }
}

function checkToggleRoundTrip(win, ids, label) {
  for (const id of ids) {
    const initial = panelSnapshot(win, id);
    const opened = win.NexusUI.openDossier(id, initial.triggers[0]);
    const openState = panelSnapshot(win, id);
    check(`${label}面板 ${id} · 原位展开状态机`,
      Boolean(opened) && openState.hidden === false && openState.aria === 'false' &&
      openState.openClass && openState.current === id && openState.isOpen &&
      openState.expanded.every((value) => value === 'true') &&
      openState.bodyOverflow === '' && !openState.bodyLocked,
      `opened=${opened} hidden=${openState.hidden} aria=${openState.aria} current=${openState.current}`);
    const closed = win.NexusUI.toggleDossier(id, initial.triggers[0]);
    const closeState = panelSnapshot(win, id);
    check(`${label}面板 ${id} · 原位收起状态机`,
      closed === false && closeState.hidden === true && closeState.aria === 'true' &&
      !closeState.openClass && !closeState.isOpen &&
      closeState.expanded.every((value) => value === 'false') &&
      closeState.bodyOverflow === '' && !closeState.bodyLocked,
      `closed=${closed} hidden=${closeState.hidden} aria=${closeState.aria}`);
  }
}

const BRAND_SCRIPTS = ['shared/dossier-drawer.js', 'nexus-ai-website/dossiers.js', 'nexus-ai-website/app.js'];
const SERVICE_SCRIPTS = ['shared/dossier-drawer.js', 'nexus-ai-services-website/dossiers.js', 'nexus-ai-services-website/app.js'];

/* -------------------------------------------------------------- brand run */
section('5. 主刊运行时 DOM 与交互');

const brand = boot('nexus-ai-website/index.html', BRAND_SCRIPTS);
const bw = brand.win;
const brandReady = brand.errors.length === 0 && Boolean(bw.NexusUI && bw.switchStoryRole &&
  bw.selectIntent && bw.handleFormSubmit && bw.resetContactForm);
check('主刊脚本加载无异常', brandReady, brand.errors.join('; '));

if (brandReady) {
  checkMountedPanels(bw, BRAND_PANEL_IDS, '主刊');
  const brandCanvas = bw.document.querySelector('.hero-field');
  check('主刊全屏光流 Canvas 已实际绘制',
    Boolean(brandCanvas) && brandCanvas.getAttribute('data-canvas-ready') === 'true' &&
    brand.canvasStats.frames > 0 && brand.canvasStats.stroke > 0 && brand.canvasStats.fill > 0,
    `ready=${brandCanvas && brandCanvas.getAttribute('data-canvas-ready')} frames=${brand.canvasStats.frames}`);

  bw.NexusUI.openDossier('doc-alliance');
  bw.document.dispatchEvent(new bw.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  const allianceTrigger = Array.from(bw.document.querySelectorAll('[data-toggle="doc-alliance"]'))
    .find((el) => !el.closest('[data-toggle-panel]'));
  check('主刊程序化打开 · ESC 回退首个触发器焦点',
    panelSnapshot(bw, 'doc-alliance').hidden === true &&
    bw.document.activeElement === allianceTrigger);

  checkToggleRoundTrip(bw, BRAND_PANEL_IDS, '主刊');

  const overviewTrigger = bw.document.querySelector('[data-toggle="doc-overview"]');
  overviewTrigger.click();
  const clickedOpen = panelSnapshot(bw, 'doc-overview');
  check('主刊触发器点击 · 展开原位面板',
    clickedOpen.hidden === false && clickedOpen.aria === 'false' && clickedOpen.openClass &&
    clickedOpen.expanded.every((value) => value === 'true'));
  check('主刊触发器展开态 · 图标与文案同步为收起',
    overviewTrigger.querySelector('.toggle-icon').textContent === '−' &&
    overviewTrigger.querySelector('.toggle-label').textContent.startsWith('收起'),
    overviewTrigger.querySelector('.toggle-label').textContent);
  overviewTrigger.click();
  const clickedClosed = panelSnapshot(bw, 'doc-overview');
  check('主刊触发器二次点击 · 收起原位面板',
    clickedClosed.hidden === true && clickedClosed.aria === 'true' && !clickedClosed.openClass &&
    clickedClosed.expanded.every((value) => value === 'false'));
  check('主刊触发器收起态 · 恢复 + 与展开文案',
    overviewTrigger.querySelector('.toggle-icon').textContent === '+' &&
    overviewTrigger.querySelector('.toggle-label').textContent.startsWith('展开'),
    overviewTrigger.querySelector('.toggle-label').textContent);

  const chronicleTrigger = bw.document.querySelector('.chronicle-row[data-toggle="doc-chronicle"]');
  const chronicleCue = chronicleTrigger.querySelector('.chronicle-go');
  chronicleTrigger.click();
  check('主刊纪元行展开态 · 档案文案同步为收起',
    chronicleTrigger.getAttribute('aria-expanded') === 'true' &&
    chronicleCue.textContent.startsWith('− 收起纪元档案'), chronicleCue.textContent);
  chronicleTrigger.click();
  check('主刊纪元行收起态 · 档案文案恢复',
    chronicleTrigger.getAttribute('aria-expanded') === 'false' &&
    chronicleCue.textContent.startsWith('+ 纪元档案'), chronicleCue.textContent);

  overviewTrigger.focus();
  bw.NexusUI.openDossier('doc-overview', overviewTrigger);
  bw.NexusUI.closeDossier('doc-overview');
  check('主刊面板关闭 · 焦点归还触发器', bw.document.activeElement === overviewTrigger);

  bw.NexusUI.openDossier('doc-manifesto');
  bw.document.dispatchEvent(new bw.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  check('主刊面板 · ESC 原位收起',
    panelSnapshot(bw, 'doc-manifesto').hidden === true &&
    panelSnapshot(bw, 'doc-manifesto').aria === 'true');

  bw.NexusUI.openDossier('doc-overview', overviewTrigger);
  const stepped = bw.NexusUI.stepDossier(1);
  check('主刊面板 · 步进至下一份档案',
    Boolean(stepped) && bw.NexusUI.getCurrent() === 'doc-manifesto' &&
    panelSnapshot(bw, 'doc-overview').hidden === true &&
    panelSnapshot(bw, 'doc-manifesto').hidden === false);
  const steppedBack = bw.NexusUI.stepDossier(-1);
  check('主刊面板 · 步进回上一份档案',
    Boolean(steppedBack) && bw.NexusUI.getCurrent() === 'doc-overview' &&
    panelSnapshot(bw, 'doc-manifesto').hidden === true &&
    panelSnapshot(bw, 'doc-overview').hidden === false);
  bw.NexusUI.closeDossier('doc-overview');

  bw.NexusUI.openDossier('doc-story');
  const archiveText = bw.document.getElementById('panel-doc-story').textContent;
  const STORY_TIMES = [
    '00:30', '06:30', '08:10', '10:00', '12:30', '15:00', '18:00', '22:00', '23:30',
    '00:40', '07:00', '08:30', '10:30', '12:00', '14:00', '16:00', '21:00', '01:30'
  ];
  check('主刊 DOC-STORY · 老张 / 小李完整 24h 对比实录',
    archiveText.includes('老张') && archiveText.includes('小李') &&
    STORY_TIMES.every((time) => archiveText.includes(time)) &&
    archiveText.includes('Editorial Note'));
  bw.NexusUI.closeDossier('doc-story');

  check('主刊真实一天 · 切换至小李视角',
    bw.switchStoryRole('solo') === true &&
    bw.document.getElementById('story-solo').hidden === false &&
    bw.document.getElementById('story-erp').hidden === true &&
    bw.document.getElementById('story-tab-solo').getAttribute('aria-selected') === 'true' &&
    bw.document.getElementById('story-tab-solo').getAttribute('tabindex') === '0' &&
    bw.document.getElementById('story-tab-erp').getAttribute('aria-selected') === 'false');
  check('主刊真实一天 · 切回老张视角',
    bw.switchStoryRole('erp') === true &&
    bw.document.getElementById('story-erp').hidden === false &&
    bw.document.getElementById('story-solo').hidden === true &&
    bw.document.getElementById('story-tab-erp').getAttribute('aria-selected') === 'true');

  const intentOk = bw.selectIntent('战略投资洽谈 (IR)');
  const intentSelect = bw.document.getElementById('intent-select');
  check('主刊 selectIntent · 打开 DOC-05 并回填意图',
    Boolean(intentOk) && bw.NexusUI.getCurrent() === 'doc-contact' &&
    panelSnapshot(bw, 'doc-contact').hidden === false &&
    intentSelect && intentSelect.value === '战略投资洽谈 (IR)');

  const nameEl = bw.document.getElementById('contact-name');
  const orgEl = bw.document.getElementById('contact-org');
  const methodEl = bw.document.getElementById('contact-method');
  const briefEl = bw.document.getElementById('contact-brief');
  nameEl.value = '<img src=x onerror=alert(1)>';
  orgEl.value = '测试 <b>机构</b>';
  methodEl.value = '13800000000';
  briefEl.value = '<script>alert(2)</script>；';
  const submitted = bw.handleFormSubmit({ preventDefault() {} });
  const feedback = bw.document.getElementById('contact-success-detail');
  const contactSuccess = bw.document.getElementById('contact-success');
  const contactForm = bw.document.getElementById('contact-form');
  check('主刊联络表单 · 成功回执',
    Boolean(submitted) && contactSuccess.hidden === false && contactForm.hidden === true &&
    feedback.textContent.includes('159-6841-4820'));
  check('主刊联络表单 · XSS 输入已转义',
    feedback.innerHTML.includes('&lt;img') && !feedback.innerHTML.includes('<img') &&
    feedback.innerHTML.includes('&lt;b&gt;机构') && !feedback.innerHTML.includes('<b>机构') &&
    feedback.innerHTML.includes('&lt;script&gt;') && !feedback.innerHTML.includes('<script>'));
  check('主刊联络表单 · 简述结尾标点不重复',
    !feedback.textContent.includes('；。') && !feedback.textContent.includes('。。'));
  bw.resetContactForm();
  check('主刊联络表单 · 重置恢复', contactForm.hidden === false && contactSuccess.hidden === true);
  bw.NexusUI.closeDossier('doc-contact');

  const testFig = bw.document.querySelector('.engine-figure');
  const testImg = testFig ? testFig.querySelector('img') : null;
  check('主刊大图挂载无障碍与交互属性', Boolean(testFig && testFig.getAttribute('tabindex') === '0' && testFig.getAttribute('role') === 'button'));
  if (testFig) {
    testFig.click();
    const ov = bw.document.querySelector('.image-zoom-overlay');
    const zoomImg = ov ? ov.querySelector('.image-zoom-img') : null;
    const zoomCap = ov ? ov.querySelector('.image-zoom-caption') : null;
    check('主刊点击大图 · 展开全屏预览与图注',
      Boolean(ov && ov.classList.contains('is-active') && testFig.classList.contains('is-zoomed-origin') &&
        zoomImg && (zoomImg.src || zoomImg.getAttribute('src') || '').includes('engine-enterprise-erp') &&
        zoomCap && zoomCap.textContent.includes('FIG.02')));

    ov.click();
    check('主刊再次点击 · 全屏缩回并恢复原图',
      Boolean(ov && !ov.classList.contains('is-active') && !testFig.classList.contains('is-zoomed-origin')));

    testFig.click();
    bw.document.dispatchEvent(new bw.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    check('主刊全屏大图 · ESC 键缩回',
      Boolean(ov && !ov.classList.contains('is-active') && !testFig.classList.contains('is-zoomed-origin')));
  }

  check('主刊运行时无异常', brand.errors.length === 0, brand.errors.join('; '));
}

bw.close();

const deepBrand = boot('nexus-ai-website/index.html', BRAND_SCRIPTS, { hash: '#dossier=doc-manifesto' });
check('主刊 #dossier 深链自动展开 DOC-01',
  deepBrand.errors.length === 0 && deepBrand.win.NexusUI.getCurrent() === 'doc-manifesto' &&
  panelSnapshot(deepBrand.win, 'doc-manifesto').hidden === false &&
  panelSnapshot(deepBrand.win, 'doc-manifesto').aria === 'false',
  deepBrand.errors.join('; '));
deepBrand.win.document.dispatchEvent(new deepBrand.win.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
const deepBrandTrigger = Array.from(deepBrand.win.document.querySelectorAll('[data-toggle="doc-manifesto"]'))
  .find((el) => !el.closest('[data-toggle-panel]'));
check('主刊 #dossier 深链 · ESC 回焦可见触发器',
  panelSnapshot(deepBrand.win, 'doc-manifesto').hidden === true &&
  deepBrand.win.document.activeElement === deepBrandTrigger);
deepBrand.win.close();

const reducedBrand = boot('nexus-ai-website/index.html', BRAND_SCRIPTS, { reduced: true });
const reducedReveals = Array.from(reducedBrand.win.document.querySelectorAll('.reveal'));
check('主刊 reduced-motion · reveal 静态可见 / 光流单帧降级',
  reducedBrand.errors.length === 0 && reducedReveals.length > 0 &&
  reducedReveals.every((el) => el.classList.contains('active')) &&
  reducedBrand.win.document.querySelector('.hero-field').getAttribute('data-canvas-ready') === 'true' &&
  reducedBrand.canvasStats.frames > 0 &&
  !reducedBrand.win.document.querySelector('.cursor-glow'),
  reducedBrand.errors.join('; '));
reducedBrand.win.close();

/* ------------------------------------------------------------ services run */
section('6. 副刊运行时 DOM 与交互');

const services = boot('nexus-ai-services-website/index.html', SERVICE_SCRIPTS);
const sw = services.win;
const servicesReady = services.errors.length === 0 && Boolean(sw.NexusUI && sw.switchProductTab &&
  sw.runErpDemo && sw.runSoloDemo && sw.calculateROI && sw.submitConsultForm);
check('副刊脚本加载无异常', servicesReady, services.errors.join('; '));

if (servicesReady) {
  checkMountedPanels(sw, SERVICE_PANEL_IDS, '副刊');
  const servicesCanvas = sw.document.querySelector('.hero-field');
  check('副刊全屏光流 Canvas 已实际绘制',
    Boolean(servicesCanvas) && servicesCanvas.getAttribute('data-canvas-ready') === 'true' &&
    services.canvasStats.frames > 0 && services.canvasStats.stroke > 0 && services.canvasStats.fill > 0,
    `ready=${servicesCanvas && servicesCanvas.getAttribute('data-canvas-ready')} frames=${services.canvasStats.frames}`);

  checkToggleRoundTrip(sw, SERVICE_PANEL_IDS, '副刊');

  const caseTrigger = sw.document.querySelector('.case-row[data-toggle="srv-cases"]');
  const caseCue = caseTrigger.querySelector('.case-actions .text-link');
  caseTrigger.click();
  check('副刊案例行展开态 · 工程复盘文案同步为收起',
    caseTrigger.getAttribute('aria-expanded') === 'true' &&
    caseCue.textContent.startsWith('− 收起工程复盘'), caseCue.textContent);
  caseTrigger.click();
  check('副刊案例行收起态 · 工程复盘文案恢复',
    caseTrigger.getAttribute('aria-expanded') === 'false' &&
    caseCue.textContent.startsWith('+ 展开工程复盘'), caseCue.textContent);

  check('副刊双核首屏 · ERP 可见 / Solo 隐藏',
    sw.document.getElementById('panel-erp').hidden === false &&
    sw.document.getElementById('panel-solo').hidden === true);
  sw.switchProductTab('solo');
  check('副刊双核切换 · Solo',
    sw.document.getElementById('panel-solo').hidden === false &&
    sw.document.getElementById('panel-erp').hidden === true &&
    sw.document.getElementById('tab-btn-solo').getAttribute('aria-selected') === 'true');
  sw.switchProductTab('erp');
  check('副刊双核切换 · ERP',
    sw.document.getElementById('panel-erp').hidden === false &&
    sw.document.getElementById('tab-btn-erp').getAttribute('aria-selected') === 'true');

  const engineLink = sw.document.querySelector('.hero-ctas [data-engine-link="solo"]');
  engineLink.click();
  check('副刊首屏引擎入口 · 点击直达 Solo 沙盒',
    sw.document.getElementById('panel-solo').hidden === false &&
    sw.document.getElementById('tab-btn-solo').getAttribute('aria-selected') === 'true');
  sw.switchProductTab('erp');

  const ERP_NEEDLES = ['3000套智能阀门', 'M8高强螺栓', '账面净利润反而少了'];
  ERP_NEEDLES.forEach((needle, index) => {
    sw.runErpDemo(index);
    const output = sw.document.getElementById('erp-sandbox-output');
    check(`副刊 ERP 沙盒场景 ${index + 1}`,
      output.textContent.includes(needle) && output.querySelectorAll('.term-slip').length === 1 &&
      output.querySelectorAll('.term-metric').length === 3);
  });

  const SOLO_NEEDLES = ['AI 海外社媒获客专员', 'AI 爆款选题与多端内容矩阵', 'AI 客户画像与朋友圈千人千面'];
  sw.switchProductTab('solo');
  SOLO_NEEDLES.forEach((needle, index) => {
    sw.runSoloDemo(index);
    const output = sw.document.getElementById('solo-sandbox-output');
    check(`副刊 Solo 沙盒场景 ${index + 1}`,
      output.textContent.includes(needle) && output.querySelectorAll('.term-agent').length === 3);
  });

  sw.NexusUI.openDossier('srv-roi');
  const text = (id) => {
    const el = sw.document.getElementById(id);
    return el ? el.textContent.trim() : null;
  };
  check('副刊 ROI 默认值 · 25人 / 3.5h / ¥8,500 → ¥892,500 · 18,375h',
    text('roi-money-saved') === '892,500' && text('roi-time-saved') === '18,375' &&
    text('roi-eq-staff') === '9' && text('roi-staff-val') === '25' &&
    text('roi-hours-val') === '3.5' && text('roi-salary-val') === '8,500');
  check('副刊 ROI 主干横幅 · 默认基准值与回本周期',
    text('roi-strip-money') === '892,500' && text('roi-strip-hours') === '18,375' &&
    text('roi-strip-payback') === '2.5' && text('roi-strip-payback-prefix') === '<');

  check('副刊 ROI · 一人公司方案 2人 / 5h / ¥12,000 → ¥144,000 · 2,100h',
    sw.setRoiType('solo') === true &&
    text('roi-money-saved') === '144,000' && text('roi-time-saved') === '2,100' &&
    text('roi-eq-staff') === '1' &&
    text('roi-badge') === '一人公司/轻团队高人效方案' &&
    text('roi-strip-payback-prefix') === '≈' && text('roi-strip-payback') === '15.5');
  check('副刊 ROI · 恢复中小企业基准值',
    sw.setRoiType('sme') === true &&
    text('roi-money-saved') === '892,500' && text('roi-time-saved') === '18,375' &&
    text('roi-strip-payback-prefix') === '<');

  const staffSlider = sw.document.getElementById('roi-staff-slider');
  staffSlider.value = '10';
  staffSlider.dispatchEvent(new sw.Event('input', { bubbles: true }));
  check('副刊 ROI · 滑块输入实时重算',
    text('roi-money-saved') === '357,000' && text('roi-time-saved') === '7,350' &&
    text('roi-eq-staff') === '4');
  sw.setRoiType('sme');
  sw.NexusUI.closeDossier('srv-roi');

  sw.NexusUI.openDossier('srv-consult');
  const consultName = sw.document.getElementById('form-name');
  const consultPhone = sw.document.getElementById('form-phone');
  const consultProduct = sw.document.getElementById('form-product');
  const consultCompany = sw.document.getElementById('form-company');
  const consultDesc = sw.document.getElementById('form-desc');
  consultName.value = '<img src=x onerror=alert(1)>';
  consultPhone.value = '13800000000';
  consultProduct.value = '一人公司 AI 智能效率套件';
  consultCompany.value = '测试工作室';
  consultDesc.value = '<script>alert(2)</script>';
  const consultOk = sw.submitConsultForm({ preventDefault() {} });
  const consultSuccess = sw.document.getElementById('form-success-box');
  const consultDetail = sw.document.getElementById('form-success-detail');
  const consultForm = sw.document.getElementById('consult-form');
  check('副刊诊断预约 · 成功回执',
    Boolean(consultOk) && consultSuccess.hidden === false && consultForm.hidden === true &&
    consultDetail.textContent.includes('13800000000') &&
    consultDetail.textContent.includes('一人公司 AI 智能效率套件'));
  check('副刊诊断预约 · XSS 输入已转义',
    consultDetail.innerHTML.includes('&lt;img') && !consultDetail.innerHTML.includes('<img'),
    consultDetail.innerHTML.slice(0, 160));
  sw.resetConsultForm();
  check('副刊诊断预约 · 重置恢复', consultForm.hidden === false && consultSuccess.hidden === true);
  sw.NexusUI.closeDossier('srv-consult');

  sw.NexusUI.openDossier('srv-bottleneck');
  sw.document.dispatchEvent(new sw.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  check('副刊面板 · ESC 原位收起且不锁页面滚动',
    panelSnapshot(sw, 'srv-bottleneck').hidden === true &&
    panelSnapshot(sw, 'srv-bottleneck').aria === 'true' &&
    sw.document.body.style.overflow === '' &&
    !sw.document.body.classList.contains('dossier-open'));

  check('副刊终端实时指令流非空',
    (sw.document.getElementById('live-log-text').textContent || '').trim().length > 10);
  check('副刊 UTC+8 实时时钟已启动',
    /^UTC\+8 \d{2}:\d{2}:\d{2}$/.test((sw.document.getElementById('live-clock').textContent || '').trim()),
    (sw.document.getElementById('live-clock').textContent || '').trim());
  check('副刊运行时无异常', services.errors.length === 0, services.errors.join('; '));
}

sw.close();

const deepServices = boot('nexus-ai-services-website/index.html', SERVICE_SCRIPTS, { hash: '#dossier=srv-roi' });
check('副刊 #dossier 深链自动展开 SRV-04',
  deepServices.errors.length === 0 && deepServices.win.NexusUI.getCurrent() === 'srv-roi' &&
  panelSnapshot(deepServices.win, 'srv-roi').hidden === false &&
  panelSnapshot(deepServices.win, 'srv-roi').aria === 'false',
  deepServices.errors.join('; '));
deepServices.win.close();

/* ---------------------------------------------------------------- summary */
console.log('\n============================================================');
console.log(`  ${passed} / ${passed + failures.length} checks passed`);
if (failures.length) {
  console.error('  FAILURES:');
  for (const failure of failures) console.error(`   - ${failure}`);
  process.exit(1);
}
console.log('  ALL CHECKS PASSED');
process.exit(0);
