#!/usr/bin/env node
/* =========================================================================
   YIRAN NEXUS · END-TO-END SITE VERIFICATION
   Static gates + jsdom runtime assertions for the brand and services issues.
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

const SITE_GROUPS = [
  { dir: 'shared', limit: 500, label: 'WP1 共享层' },
  { dir: 'nexus-ai-website', limit: 500, label: 'WP2 品牌主刊' },
  { dir: 'nexus-ai-services-website', limit: 600, label: 'WP3 业务副刊' }
];

/* ------------------------------------------------------------- static info */
section('1. 代码规模与整洁度');

for (const rel of REQUIRED_FILES) {
  check(`交付文件存在 · ${rel}`, fs.existsSync(path.join(ROOT, rel)));
}

const sourceFiles = [];
for (const group of SITE_GROUPS) {
  for (const rel of listSourceFiles(group.dir)) {
    const text = read(rel);
    const lines = lineCount(text);
    sourceFiles.push({ rel, text, lines, group });
    check(`单文件 < 1000 行 · ${rel} (${lines})`, lines < 1000, `实际 ${lines} 行`);
    check(`${group.label} 门禁 < ${group.limit} 行 · ${rel} (${lines})`, lines < group.limit, `实际 ${lines} 行`);
  }
}

const placeholderPattern = /TODO|FIXME|\.\.\.省略|\bpass\b/;
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
      if (!stack.length) {
        issues.push(`第 ${line} 行多余的 </${name}>`);
      } else {
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

/* ------------------------------------------------------------ anti-pattern */
section('2. 反模式清零');

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
check('两站已移除 Tailwind / Three.js / FontAwesome / 旧光标与霓虹反模式', antiOffenders.length === 0, antiOffenders.join('; '));

const sharedCss = read('shared/industrial-magazine.css');
const brandHtml = read('nexus-ai-website/index.html');
const servicesHtml = read('nexus-ai-services-website/index.html');
const brandCss = read('nexus-ai-website/styles.css');
const servicesCss = read('nexus-ai-services-website/styles.css');

const TOKENS = ['--bg: #0a0c0f', '--ink: #eae6dc', '--bronze: #b08c5c', '--steel: #9fd8ff', '--hairline: rgba(234, 230, 220, 0.14)'];
check('共享令牌 · 黑曜石 / 骨白 / 古铜 / 冷钢 / 发丝线', TOKENS.every((token) => sharedCss.includes(token)), TOKENS.filter((token) => !sharedCss.includes(token)).join(', '));

const FONTS = ['Noto+Serif+SC', 'Bodoni+Moda', 'Inter+Tight', 'JetBrains+Mono'];
check('两刊字体栈 · Noto Serif SC / Bodoni Moda / Inter Tight / JetBrains Mono',
  FONTS.every((font) => brandHtml.includes(font) && servicesHtml.includes(font)));

check('主刊工业星盘 · .dial / .draw / .focal / .hero-frame',
  ['class="dial"', 'class="draw', 'class="focal', 'class="hero-frame'].every((needle) => brandHtml.includes(needle)));
check('副刊桥接拓扑 · .bridge-svg / .bridge-flow / .bridge-pulse',
  ['bridge-svg', 'bridge-flow', 'bridge-pulse'].every((needle) => servicesHtml.includes(needle)));
check('两刊准星画框与摄影过渡带', [brandHtml, servicesHtml].every((html) =>
  html.includes('hero-frame') && html.includes('class="mark"') && html.includes('class="band"') && html.includes('FIG.0')));
check('两刊 reduced-motion 静态降级',
  sharedCss.includes('prefers-reduced-motion') && brandCss.includes('prefers-reduced-motion') && servicesCss.includes('prefers-reduced-motion'));

const BAND_ASSETS = [
  'nexus-ai-website/assets/workshop-lathe-machine.jpg',
  'nexus-ai-website/assets/lathe-boring.jpg',
  'nexus-ai-website/assets/precision-engineering-metrology-of-small-holes-5940488905.jpg'
];
check('摄影过渡带图片资源存在', BAND_ASSETS.every((rel) => fs.existsSync(path.join(ROOT, rel))));

/* --------------------------------------------------------- content parity */
section('3. 内容 100% 零丢失');

const brandCorpus = brandHtml + read('nexus-ai-website/dossiers.js') + read('nexus-ai-website/app.js');
const servicesCorpus = servicesHtml + read('nexus-ai-services-website/dossiers.js') + read('nexus-ai-services-website/app.js');
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
assertContent('共享直联实体 · 林经理专线 / 商务邮箱 / 备案号', allCorpus, SHARED_CONTACT);
assertContent('主刊联络实体', brandCorpus, SHARED_CONTACT.concat('ir@nbyiran.com'));
assertContent('副刊联络实体', servicesCorpus, ['159-6841-4820', 'bd@nbyiran.com', '浙ICP备15016619号-10']);

assertContent('主刊三大信仰', brandCorpus, ['科技平权', '拒绝标准品桎梏', '结果导向', 'BELIEF 01', 'BELIEF 02', 'BELIEF 03']);
assertContent('主刊两大物种', brandCorpus, ['企业级 AI+ERP 智能中枢', '一人公司 AI 数字硅基团队', 'SPECIES 01', 'SPECIES 02']);
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
  '892,500', '18,375', '8.5 倍', '98.6%', '1人 = 6人', '3000套智能阀门', 'M8高强螺栓', '¥ 346,000 (4家客户)'
]);
assertContent('副刊免费诊断三项承诺', servicesCorpus, [
  '1对1 业务卡点梳理', '定制原型演示', '透明周期与报价清单'
]);
assertContent('副刊旧系统与私有化交付承诺', servicesCorpus, [
  '旧系统无损升级', '私有化部署', '国家级科技型中小企业'
]);

/* ------------------------------------------------------------- jsdom boot */
function boot(relHtml, scriptFiles, options = {}) {
  const html = read(relHtml)
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<link\b[^>]*>/gi, '');
  const errors = [];
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

  try {
    for (const rel of scriptFiles) win.eval(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
    win.document.dispatchEvent(new win.Event('DOMContentLoaded'));
  } catch (error) {
    errors.push('load: ' + String((error && error.message) || error));
  }

  return { dom, win, errors };
}

function drawerState(win) {
  const drawer = win.document.getElementById('dossier-drawer');
  const content = win.document.getElementById('dossier-content');
  return {
    aria: drawer ? drawer.getAttribute('aria-hidden') : null,
    length: content ? content.innerHTML.trim().length : 0,
    text: content ? content.textContent.trim() : ''
  };
}

const BRAND_SCRIPTS = ['shared/dossier-drawer.js', 'nexus-ai-website/dossiers.js', 'nexus-ai-website/app.js'];
const SERVICE_SCRIPTS = ['shared/dossier-drawer.js', 'nexus-ai-services-website/dossiers.js', 'nexus-ai-services-website/app.js'];

/* -------------------------------------------------------------- brand run */
section('4. 主刊运行时 DOM 与交互');

const brand = boot('nexus-ai-website/index.html', BRAND_SCRIPTS);
const bw = brand.win;
const brandReady = brand.errors.length === 0 && Boolean(bw.NexusUI && bw.selectIntent && bw.handleFormSubmit);
check('主刊脚本加载无异常', brandReady, brand.errors.join('; '));

if (brandReady) {
  const BRAND_DOSSIERS = [
    'doc-overview', 'doc-manifesto', 'doc-pillar-erp', 'doc-pillar-opc',
    'doc-chronicle', 'doc-clients', 'doc-alliance', 'doc-contact'
  ];
  for (const id of BRAND_DOSSIERS) {
    let opened = false;
    try { opened = bw.NexusUI.openDossier(id); } catch (error) { opened = false; }
    const state = drawerState(bw);
    check(`主刊档案 ${id} · 非空渲染 / aria-hidden=false`,
      Boolean(opened) && state.aria === 'false' && state.length > 300 && state.text.length > 80,
      `opened=${opened} len=${state.length} aria=${state.aria}`);
  }

  bw.NexusUI.openDossier('doc-overview');
  const nextBtn = bw.document.getElementById('dossier-next');
  const prevBtn = bw.document.getElementById('dossier-prev');
  nextBtn.click();
  check('主刊档案抽屉 · 下一份', bw.NexusUI.getCurrent() === 'doc-manifesto' && bw.document.getElementById('dossier-title').textContent.includes('鸿沟'));
  prevBtn.click();
  check('主刊档案抽屉 · 上一份', bw.NexusUI.getCurrent() === 'doc-overview');

  check('主刊抽屉开启锁定页面滚动', bw.document.body.classList.contains('dossier-open'));
  bw.document.dispatchEvent(new bw.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  check('主刊抽屉 · Esc 关闭并解除滚动锁',
    drawerState(bw).aria === 'true' && !bw.document.body.classList.contains('dossier-open'));

  bw.NexusUI.openDossier('doc-alliance');
  bw.document.getElementById('dossier-backdrop').click();
  check('主刊抽屉 · 点击遮罩关闭', drawerState(bw).aria === 'true');

  const trigger = bw.document.querySelector('[data-dossier="doc-overview"]');
  trigger.focus();
  bw.NexusUI.openDossier('doc-overview', trigger);
  bw.NexusUI.closeDossier();
  check('主刊抽屉 · 关闭后焦点归还触发器', bw.document.activeElement === trigger);

  const intentOk = bw.selectIntent('战略投资洽谈 (IR)');
  const intentSelect = bw.document.getElementById('intent-select');
  check('主刊 selectIntent 打开 DOC-05 并回填下拉意图',
    Boolean(intentOk) && bw.NexusUI.getCurrent() === 'doc-contact' &&
    drawerState(bw).aria === 'false' && intentSelect && intentSelect.value === '战略投资洽谈 (IR)');

  const nameEl = bw.document.getElementById('contact-name');
  const orgEl = bw.document.getElementById('contact-org');
  const methodEl = bw.document.getElementById('contact-method');
  const briefEl = bw.document.getElementById('contact-brief');
  nameEl.value = '<img src=x onerror=alert(1)>';
  orgEl.value = '测试 <b>机构</b>';
  methodEl.value = '13800000000';
  briefEl.value = '<script>alert(2)</script>';
  const submitted = bw.handleFormSubmit({ preventDefault() {} });
  const feedback = bw.document.getElementById('contact-success-detail');
  const contactSuccess = bw.document.getElementById('contact-success');
  const contactForm = bw.document.getElementById('contact-form');
  check('主刊联络表单 · 成功回执',
    Boolean(submitted) && contactSuccess.hidden === false && contactForm.hidden === true &&
    feedback.textContent.includes('159-6841-4820'));
  check('主刊联络表单 · XSS 输入已转义',
    feedback.innerHTML.includes('&lt;img') && !feedback.innerHTML.includes('<img') &&
    feedback.innerHTML.includes('&lt;script&gt;') && !feedback.innerHTML.includes('<script>'));
  bw.resetContactForm();
  check('主刊联络表单 · 重置恢复', contactForm.hidden === false && contactSuccess.hidden === true);

  check('主刊运行时无异常', brand.errors.length === 0, brand.errors.join('; '));
}

bw.close();

const deepBrand = boot('nexus-ai-website/index.html', BRAND_SCRIPTS, { hash: '#dossier=doc-manifesto' });
check('主刊 #dossier 深链自动打开 DOC-01',
  deepBrand.errors.length === 0 && deepBrand.win.NexusUI.getCurrent() === 'doc-manifesto' &&
  drawerState(deepBrand.win).aria === 'false', deepBrand.errors.join('; '));
deepBrand.win.close();

const reducedBrand = boot('nexus-ai-website/index.html', BRAND_SCRIPTS, { reduced: true });
const reducedReveals = Array.from(reducedBrand.win.document.querySelectorAll('.reveal'));
check('主刊 reduced-motion 静态降级 · reveal 直接可见',
  reducedBrand.errors.length === 0 && reducedReveals.length > 0 &&
  reducedReveals.every((el) => el.classList.contains('active')) &&
  !reducedBrand.win.document.querySelector('.cursor-glow'),
  reducedBrand.errors.join('; '));
reducedBrand.win.close();

/* ------------------------------------------------------------ services run */
section('5. 副刊运行时 DOM 与交互');

const services = boot('nexus-ai-services-website/index.html', SERVICE_SCRIPTS);
const sw = services.win;
const servicesReady = services.errors.length === 0 && Boolean(sw.switchProductTab && sw.runErpDemo && sw.runSoloDemo && sw.calculateROI);
check('副刊脚本加载无异常', servicesReady, services.errors.join('; '));

if (servicesReady) {
  check('副刊终端首屏 · ERP 可见 / Solo 隐藏',
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

  const SERVICE_DOSSIERS = ['srv-bottleneck', 'srv-erp-spec', 'srv-solo-spec', 'srv-process', 'srv-roi', 'srv-cases', 'srv-consult'];
  for (const id of SERVICE_DOSSIERS) {
    let opened = false;
    try { opened = sw.NexusUI.openDossier(id); } catch (error) { opened = false; }
    const state = drawerState(sw);
    check(`副刊档案 ${id} · 非空渲染 / aria-hidden=false`,
      Boolean(opened) && state.aria === 'false' && state.length > 300 && state.text.length > 80,
      `opened=${opened} len=${state.length} aria=${state.aria}`);
  }

  sw.NexusUI.openDossier('srv-roi');
  const text = (id) => {
    const el = sw.document.getElementById(id);
    return el ? el.textContent.trim() : null;
  };
  check('副刊 ROI 默认值 25人 / 3.5h / ¥8,500 → ¥892,500 · 18,375h',
    text('roi-money-saved') === '892,500' && text('roi-time-saved') === '18,375' &&
    text('roi-eq-staff') === '9' && text('roi-staff-val') === '25' &&
    text('roi-hours-val') === '3.5' && text('roi-salary-val') === '8,500');
  check('副刊 ROI 主干横幅同步默认基准值',
    text('roi-strip-money') === '892,500' && text('roi-strip-hours') === '18,375' &&
    text('roi-strip-payback') === '2.5' && text('roi-strip-payback-prefix') === '<',
    `prefix=${JSON.stringify(text('roi-strip-payback-prefix'))} payback=${text('roi-strip-payback')}`);

  sw.setRoiType('solo');
  check('副刊 ROI · 一人公司方案 2人 / 5h / ¥12,000 → ¥144,000 · 2,100h',
    text('roi-money-saved') === '144,000' && text('roi-time-saved') === '2,100' &&
    text('roi-badge') === '一人公司/轻团队高人效方案' &&
    text('roi-strip-payback-prefix') === '≈' && text('roi-strip-payback') === '15.5',
    `money=${text('roi-money-saved')} time=${text('roi-time-saved')} badge=${text('roi-badge')} prefix=${text('roi-strip-payback-prefix')} payback=${text('roi-strip-payback')}`);

  sw.setRoiType('sme');
  check('副刊 ROI · 恢复中小企业基准值',
    text('roi-money-saved') === '892,500' && text('roi-time-saved') === '18,375' &&
    text('roi-strip-payback-prefix') === '<');

  const staffSlider = sw.document.getElementById('roi-staff-slider');
  staffSlider.value = '10';
  staffSlider.dispatchEvent(new sw.Event('input', { bubbles: true }));
  check('副刊 ROI · 滑块输入实时重算',
    text('roi-money-saved') === '357,000' && text('roi-time-saved') === '7,350' && text('roi-eq-staff') === '4');
  sw.setRoiType('sme');

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

  sw.NexusUI.openDossier('srv-bottleneck');
  sw.document.dispatchEvent(new sw.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  check('副刊抽屉 · Esc 关闭并解除滚动锁',
    drawerState(sw).aria === 'true' && !sw.document.body.classList.contains('dossier-open'));

  sw.NexusUI.openDossier('srv-cases');
  sw.document.getElementById('dossier-backdrop').click();
  check('副刊抽屉 · 点击遮罩关闭', drawerState(sw).aria === 'true');

  check('副刊终端实时指令流非空',
    (sw.document.getElementById('live-log-text').textContent || '').trim().length > 10);
  check('副刊运行时无异常', services.errors.length === 0, services.errors.join('; '));
}

sw.close();

const deepServices = boot('nexus-ai-services-website/index.html', SERVICE_SCRIPTS, { hash: '#dossier=srv-roi' });
check('副刊 #dossier 深链自动打开 SRV-04',
  deepServices.errors.length === 0 && deepServices.win.NexusUI.getCurrent() === 'srv-roi' &&
  drawerState(deepServices.win).aria === 'false', deepServices.errors.join('; '));
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
