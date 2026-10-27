/* =========================================================================
   YIRAN NEXUS · BRAND ISSUE DOSSIER LIBRARY
   DOC-00 → DOC-05 · full original corporate copy preserved verbatim
   ========================================================================= */
(function () {
  'use strict';

  function metrics(items) {
    return '<div class="dossier-metrics">' + items.map(function (item) {
      return '<div class="dossier-metric"><p class="v">' + item[0] + '</p><p class="k">' + item[1] + '</p></div>';
    }).join('') + '</div>';
  }

  function grid(items) {
    return '<div class="dossier-grid">' + items.map(function (item) {
      return '<div class="dossier-cell"><p class="k">' + item[0] + '</p><p class="v">' + item[1] + '</p></div>';
    }).join('') + '</div>';
  }

  function actions(links) {
    return '<div class="dossier-actions">' + links.map(function (link) {
      return link.href
        ? '<a class="btn btn-line" href="' + link.href + '">' + link.label + '</a>'
        : '<button type="button" class="btn btn-line" data-dossier="' + link.dossier + '" aria-haspopup="dialog">' + link.label + '</button>';
    }).join('') + '</div>';
  }

  var registry = {

    'doc-overview': {
      code: 'DOC-00 // THE IDENTITY',
      category: '企业总览 · Corporate Overview',
      title: '让大模型能力普惠百业，打通 AI 与实体生产的最后一公里。',
      subtitle: 'Yiran Nexus · Yiran Network Technology · Est. 2015',
      render: function () {
        return '' +
          '<p class="dossier-lead">我们不制造悬浮于云端的算力幻觉。宁波依然网络科技有限公司旗下产业智能品牌 <strong>依然智枢（YIRAN NEXUS）</strong>，传承自 2015 年沉淀的生产管理、进销存架构与多项核心软件著作权，将前沿大语言模型（LLM）深植于真实车间、供应链与超级个体的业务毛细血管之中。</p>' +
          metrics([
            ['2015', '创立 · 国家级科技型中小企业'],
            ['10年+', '生产与进销存研发 · 多项软著'],
            ['AI+ERP', '企业级智能中枢 / 一人公司 AI 矩阵'],
            ['29.8892°N', 'LON 121.5503°E · NINGBO · UTC+8']
          ]) +
          '<h3>品牌主体与工程底座</h3>' +
          '<p>宁波依然网络科技有限公司（智枢 AI）为国家级科技型中小企业，自 2015 年起深耕生产管理系统、进销存系统与政企信息化集成。十年间，我们在宁波及长三角积累多项核心软件著作权，深度交付智能制造、新材料、建筑工程、跨境品牌与国家级科研平台项目，吃透工业 BOM、供应链与真实交付现场。</p>' +
          '<p>与纯算法团队不同，我们的起点是车间排产、库存账本与政企系统集成。这让我们在把 LLM 接入企业时，首先考虑的不是演示效果，而是<strong>旧系统无损升级、业务流贴合与一线员工是否愿意长期使用</strong>。</p>' +
          '<h3>双引擎产品结构</h3>' +
          grid([
            ['SPECIES 01 // ENTERPRISE CORE', '<strong>企业级 AI+ERP 智能中枢</strong><br>B2B 深度定制。多模态大模型嵌入采购、排产、仓储、财务全链路，让系统从“被动记录死数据的账本”，进化为“主动预警风险、自主调度资源的企业硅基大脑”。'],
            ['SPECIES 02 // SUPER INDIVIDUAL', '<strong>一人公司 AI 数字硅基团队</strong><br>OPC 专属武装。为高认知独立创业者、主理人与垂直工作室编排 7×24 小时协同运转的 AI 获客增长官、全天候金牌销冠、自动化交付工程师与财务法务助理。']
          ]) +
          '<div class="dossier-callout"><span class="k">核心使命 // Mission</span>让大模型能力普惠百业，打通 AI 与实体生产的最后一公里。不以炫技 Demo 交付，而以库存周转率、订单交付周期、人均产值的实质性跃升作为唯一衡量标尺。</div>' +
          actions([
            { href: '../nexus-ai-services-website/index.html', label: '进入业务沙盒与量身定制 →' },
            { dossier: 'doc-chronicle', label: '2015–2026 演进脉络' },
            { dossier: 'doc-alliance', label: '投资者与生态合作' }
          ]) +
          '<p class="dossier-note">基金会与资质：国家级科技型中小企业 · 多项核心软件著作权 · 浙ICP备15016619号-10</p>';
      }
    },

    'doc-manifesto': {
      code: 'DOC-01 // THE MANIFESTO',
      category: '使命宣言 · Vision & Mission',
      title: '跨越“硅基智能”与“碳基实业”的鸿沟',
      subtitle: 'Nexus Last-Mile Bridge · Two Poles, One Mission',
      render: function () {
        return '' +
          '<p class="dossier-lead">我们不做悬浮于云端的算力幻觉，也不做生搬硬套的通用软件。依然智枢存在的意义，是在万亿参数大语言模型与真实产业现场之间，架设一座可交付、可运营、可衡量的最后一公里桥接器。</p>' +
          '<h3>POLE A // 认知层 — 万亿参数大语言模型</h3>' +
          '<p>拥有通识推理、多模态理解与代码生成能力，但缺乏企业私有上下文，无法直接驱动机床、库存与现金流。</p>' +
          '<h3>NEXUS LAST-MILE BRIDGE // 智枢最后一公里桥接器</h3>' +
          '<p><strong>领域微调 · 业务流编排 · 私有化部署</strong></p>' +
          '<p>将通用模型的认知能力，转译为贴合企业 SOP 的指令、可审计的业务动作与可回滚的执行链路。桥接器不追求模型参数的最大化，而追求每一 Token 消耗与经营结果之间的最短路径。</p>' +
          '<h3>POLE B // 物理与服务层 — 中小企业与超级个体现场</h3>' +
          '<p>真实的工单排产、供应链博弈、仓储物流与高客单客户交付。让每一次 Token 的消耗都直接转化为利润率。</p>' +
          '<h3>三大企业信仰</h3>' +
          '<h4>BELIEF 01 / 科技平权</h4>' +
          '<p><strong>AI 不应只是巨头的特权。</strong>占经济体量 90% 的中小企业与个体创业者，才是生产力变革的最大基本盘。我们将昂贵的 AI 研发范式封装为可负担、高回报的敏捷底座。</p>' +
          '<h4>BELIEF 02 / 拒绝标准品桎梏</h4>' +
          '<p><strong>软件迁就业务，而非业务削足适履。</strong>每一家增长型企业都有独特的工艺与管理基因。我们坚持“专业量身定制”，深入一线梳理 SOP，打造专属的数字神经系统。</p>' +
          '<h4>BELIEF 03 / 结果导向</h4>' +
          '<p><strong>打通“最后一公里”才是终局。</strong>不以炫技的 Demo 交付，而以库存周转率、订单交付周期、人均产值（Revenue Per Capita）的实质性跃升作为唯一衡量标尺。</p>' +
          '<div class="dossier-callout"><span class="k">编辑注 // Editorial Note</span>这三条信仰不是墙上的标语，而是我们筛选项目、设定交付标准与判断长期价值的底层规则。</div>' +
          actions([
            { href: '../nexus-ai-services-website/index.html', label: '进入业务沙盒与量身定制 →' },
            { dossier: 'doc-pillar-erp', label: '查看企业 AI+ERP 物种档案' }
          ]);
      }
    },

    'doc-pillar-erp': {
      code: 'DOC-02A // SPECIES 01',
      category: '核心基石 · Enterprise Core',
      title: '企业级 AI+ERP 智能中枢',
      subtitle: 'Autonomous Enterprise Resource Planning',
      render: function () {
        return '' +
          '<p class="dossier-lead">告别传统 ERP 繁琐的表单录入与滞后报表。将多模态大模型直接嵌入采购、排产、仓储、财务全链路——让系统从“被动记录死数据的账本”，进化为“主动预警风险、自主调度资源的企业硅基大脑”。</p>' +
          metrics([
            ['自然语言', '交互范式 · 自然语言即指令'],
            ['私有化', '部署形态 · 本地私有化 / 混合云'],
            ['1:1', '定制深度 · 贴合非标产线']
          ]) +
          '<h3>交付原则</h3>' +
          '<ul>' +
          '<li><strong>旧系统无损升级：</strong>不推翻既有 ERP 与账本，优先通过企业级 RAG 与数据库接入引擎完成历史数据与业务规则的衔接。</li>' +
          '<li><strong>业务流优先：</strong>先梳理真实 SOP、单据链路与审批节点，再决定模型与智能体的介入位置。</li>' +
          '<li><strong>可审计执行：</strong>每一次自动审单、排产与采购动作均保留来源、依据与人工确认入口，避免不可控的黑箱操作。</li>' +
          '<li><strong>一线可用：</strong>自然语言即指令，降低车间、仓库与财务人员的系统负担，让 AI 真正进入日常业务。</li>' +
          '</ul>' +
          '<h3>适用现场</h3>' +
          '<p>多品种小批量制造、非标产线、进销存与生产协同复杂、旧系统改造预算有限，却迫切希望以 AI 提升交付与资金效率的成长型企业。</p>' +
          '<div class="dossier-callout"><span class="k">交付承诺 // Delivery</span>免费培养 1 名内部系统管理员 + 1对1 驻场赋能，确保系统在企业内部真正运转，而不是交付即闲置。</div>' +
          actions([
            { href: '../nexus-ai-services-website/index.html#products', label: '进入副刊沙盒 · 体验 ERP 指令 →' },
            { dossier: 'doc-contact', label: '预约企业 AI+ERP 诊断' }
          ]) +
          '<p class="dossier-note">SPECIES 01 // ENTERPRISE CORE · B2B 深度定制 · 本地私有化 / 混合云</p>';
      }
    },

    'doc-pillar-opc': {
      code: 'DOC-02B // SPECIES 02',
      category: '核心基石 · Super Individual',
      title: '一人公司 AI 数字硅基团队',
      subtitle: 'One-Person Company Intelligence Matrix',
      render: function () {
        return '' +
          '<p class="dossier-lead">赋能高认知独立创业者、主理人与垂直工作室。为您量身编排 7×24 小时协同运转的“AI 获客增长官、全天候金牌销冠、自动化交付工程师与财务法务助理”，让一个人活成一支高市值特种部队。</p>' +
          metrics([
            ['1 人 = 10+', '组织杠杆 · 专业岗位'],
            ['数字克隆', '知识资产 · 个人方法论'],
            ['趋近于零', '运转边际成本']
          ]) +
          '<h3>数字员工编排</h3>' +
          '<ul>' +
          '<li><strong>AI 获客增长官：</strong>持续捕捉平台趋势与行业热点，生成多平台内容与触达动作，让个人品牌保持稳定曝光。</li>' +
          '<li><strong>全天候金牌销冠：</strong>7×24 小时响应咨询，调用产品库与报价规则完成初步筛选、答疑与高意向客户预约。</li>' +
          '<li><strong>自动化交付工程师：</strong>依据历史案例与标准模板，生成方案初稿、合同文本与交付节点提醒。</li>' +
          '<li><strong>财务法务助理：</strong>整理订单、回款与票据信息，按预设规则生成核算与风险提示。</li>' +
          '</ul>' +
          '<h3>适用对象</h3>' +
          '<p>高客单咨询顾问、知识 IP、跨境独立站主理人、垂直非标定制工作室，以及希望以极小团队维持高质量交付的超级个体。</p>' +
          '<div class="dossier-callout"><span class="k">组织目标 // Leverage</span>把一个人的专业大脑复制成可协同的数字团队，摆脱“手停口停”的时间出卖模式，把精力集中到判断、审美与关系上。</div>' +
          actions([
            { href: '../nexus-ai-services-website/index.html#products', label: '进入副刊沙盒 · 体验 OPC 工作流 →' },
            { dossier: 'doc-contact', label: '预约一人公司 AI 诊断' }
          ]) +
          '<p class="dossier-note">SPECIES 02 // SUPER INDIVIDUAL · OPC 专属武装 · 个人方法论数字克隆</p>';
      }
    },

    'doc-chronicle': {
      code: 'DOC-03A // THE CHRONICLE',
      category: '演进纪元 · Evolution & Roadmap',
      title: '从十年实业信息化到产业 AI 的演进纪元',
      subtitle: '2015 — 2027+ · Five Phases',
      render: function () {
        return '' +
          '<p class="dossier-lead">自 2015 年创立宁波依然网络科技以来，我们用十年车间排产、进销存账本与政企系统集成功底，奠定了比纯算法初创团队更懂实体制造的工程壁垒。</p>' +
          '<h3>2015-22 · PHASE 0 · 实业信息化筑基期 [依然网络创立]</h3>' +
          '<p><strong>深耕生产管理系统、进销存系统与政企信息化集成，获评国家级科技型中小企业</strong></p>' +
          '<p>在宁波及长三角积累多项核心软件著作权，深度交付佳乐股份、凯孚新材料、中国—中东欧国家创新合作研究中心等实业与科研院所项目，吃透工业 BOM 与供应链底层逻辑。</p>' +
          '<h3>2023 · PHASE I · AI 原型破壁期</h3>' +
          '<p><strong>底层架构重构：企业级 RAG 与老旧 ERP 数据库无损接入引擎立项</strong></p>' +
          '<p>攻克工业非标单据、多源异构报表与复杂进销存账本的幻觉抑制难题，确立“旧系统无损升级 + 面向实体落地”的核心技术路线。</p>' +
          '<h3>2024 · PHASE II · 商业深潜期</h3>' +
          '<p><strong>双引擎商业闭环：定制化 AI+ERP 与一人公司 AI 套件深入制造与跨境一线</strong></p>' +
          '<p>携手新材料制造、生鲜食材供应链与跨境独立站品牌完成私有化交付，建立“免费培养 1 名内部系统管理员 + 1对1 驻场赋能”交付标准。</p>' +
          '<h3>2025-26 · PHASE III · 规模化普惠期 [CURRENT]</h3>' +
          '<p><strong>多智能体（Multi-Agent）自主协同网络与商协会数字化服务底座全面开放</strong></p>' +
          '<p>依托模块化定制母版与行业商协会数字化平台，将量身定制周期缩短 60%，让长三角乃至全国中小企业以轻量级投入拥有专属企业硅基大脑。</p>' +
          '<h3>2027+ · PHASE IV · 远景奇点</h3>' +
          '<p><strong>具身商业网络：跨企业自治供应链与硅基商业共同体</strong></p>' +
          '<p>不同企业的 AI+ERP 节点实现安全协议下的自主询价、博弈、履约与结算，构建下一代智能商业基础设施。</p>' +
          '<div class="dossier-callout"><span class="k">路径判断 // Thesis</span>产业 AI 的壁垒不在模型本身，而在十年实业流程沉淀、旧系统接入能力与真实交付现场的理解。</div>' +
          actions([
            { dossier: 'doc-clients', label: '查阅标杆客户交付背景 // DOC-03B' },
            { href: '../nexus-ai-services-website/index.html#cases', label: '查看落地案例 →' }
          ]);
      }
    },

    'doc-clients': {
      code: 'DOC-03B // TRUSTED BY',
      category: '实业背书 · Clients & Institutes',
      title: '深耕宁波与华东实体产业，历经高安全政企与制造现场检验',
      subtitle: 'Trusted by Industry & Institutes',
      render: function () {
        var clients = [
          ['智能制造 · 实业标杆', '<strong>佳乐股份</strong><br>智能制造实业标杆客户，生产管理与信息化系统长期服务对象。'],
          ['新材料研发制造', '<strong>凯孚新材料</strong><br>新材料研发制造企业，深度参与其生产与供应链数字化建设。'],
          ['工业新材料制造', '<strong>楚鑫材料</strong><br>工业新材料制造企业，面向车间与库存流程的数字化交付。'],
          ['轻工包装制造', '<strong>宁波艾升纸制</strong><br>轻工包装制造企业，覆盖生产管理与进销存核心场景。'],
          ['建筑工程信息化', '<strong>天坤建筑</strong><br>建筑工程领域客户，信息化系统集成与项目协同交付。'],
          ['跨境品牌独立站', '<strong>Floravase</strong><br>跨境品牌独立站，面向海外获客与内容运营的 AI 效率实践。'],
          ['生鲜农业供应链', '<strong>日合柑桔</strong><br>生鲜农业供应链客户，订单、库存与交付流程数字化。'],
          ['餐饮食材供应链', '<strong>食全食美</strong><br>餐饮食材供应链客户，采购与仓配环节的信息化协同。'],
          ['国家级国际科研平台', '<strong>中国—中东欧国家创新合作研究中心</strong><br>国家级国际科研平台，高安全政企与科研信息化项目交付。'],
          ['重点智库科研院所', '<strong>宁波海上丝绸之路研究院</strong><br>重点智库科研院所，研究型机构信息化与数字化服务。']
        ];
        return '' +
          '<p class="dossier-lead">以上为典型服务实业与科研院所名录。我们不做通用模板的批量复制，而是把每一家客户的工艺、单据与管理基因，沉淀为可复用的行业交付资产。</p>' +
          grid(clients) +
          '<p class="dossier-note">TRUSTED BY INDUSTRY & INSTITUTES // 典型服务实业与科研院所背书 · 排列不分先后</p>' +
          actions([
            { href: '../nexus-ai-services-website/index.html#cases', label: '查阅落地场景与案例详情 →' },
            { dossier: 'doc-contact', label: '发起合作咨询' }
          ]);
      }
    },

    'doc-alliance': {
      code: 'DOC-04 // CAPITAL & ALLIANCE',
      category: '投资与生态 · IR & Ecosystem',
      title: '与远见者共筑产业 AI 新秩序',
      subtitle: 'IR & Strategic Partnership',
      render: function () {
        return '' +
          '<p class="dossier-lead">面向风险投资机构、产业园区与行业商协会、算力与大模型厂商的三类长期协作框架。我们不追逐短期概念，而以可验证的交付现场与可持续的渠道结构构建产业 AI 基础设施。</p>' +
          '<h3>CAPITAL VISION / 资本价值 — 万亿级存量软件重塑红利</h3>' +
          '<p>传统 SaaS 与 ERP 正在经历彻底的“AI 原生化重写”。我们占据企业核心工作流入口与高粘性私有数据资产，具备极高的转换壁垒与 LTV/CAC 复利效应。</p>' +
          '<h3>CHANNEL PARTNER / 渠道与商协会共赢 — 产业园区与行业商协会赋能</h3>' +
          '<p>依托已落地验证的“商会/协会 AI 数字化服务底座”与十年企业信息化交付体系，面向地方产业集群、行业商协会及软硬件集成商开放定制底座与高额分润。</p>' +
          '<h3>TECH ALLIANCE / 算力与模型生态 — 大模型与硬件厂商联合方案</h3>' +
          '<p>与主流开源/闭源基座大模型、国产算力一体机厂商深度耦合，共同打造“开箱即用、数据不出域”的软硬一体行业智算终端。</p>' +
          '<div class="dossier-callout"><span class="k">协作入口 // Entry</span>投资人可获取 Pitch Deck 与数据室资料；渠道伙伴可申请城市/商协会合伙人；技术厂商可对接联合方案与生态实验室。</div>' +
          '<div class="dossier-actions">' +
          '<button type="button" class="btn btn-line" data-select-intent="战略投资洽谈 (IR)">获取投资人备忘录 (Pitch Deck) →</button>' +
          '<button type="button" class="btn btn-line" data-select-intent="生态与渠道合作">申请成为城市/商协会合伙人 →</button>' +
          '<button type="button" class="btn btn-line" data-select-intent="技术与算力生态共建">对接技术生态实验室 →</button>' +
          '</div>' +
          '<p class="dossier-note">IR & STRATEGIC PARTNERSHIP · NINGBO · 12 小时内由合伙人直接对接</p>';
      }
    },

    'doc-contact': {
      code: 'DOC-05 // THE TERMINAL',
      category: '建立连接 · Initiate Transmission',
      title: '与我们开启一场关于未来的对话。',
      subtitle: 'Transmission Protocol · Encrypted Direct Line',
      render: function () {
        return '' +
          '<p class="dossier-lead">无论您是寻求企业 AI+ERP 破局的实业家、渴望武装自我的超级个体，还是关注产业智能化的投资机构，我们的创始与专家团队均静候您的垂询。</p>' +
          '<h3>直联通道</h3>' +
          grid([
            ['DIRECT HOTLINE / WECHAT · 林经理专线', '<strong>159-6841-4820</strong> (微信同号)<br><button type="button" class="copy" data-copy="15968414820" data-copy-label="复制专线">[COPY]</button>'],
            ['DIRECT EMAIL · 商务与定制', '<strong>bd@nbyiran.com</strong><br><button type="button" class="copy" data-copy="bd@nbyiran.com" data-copy-label="复制商务邮箱">[CLICK TO COPY]</button>'],
            ['INVESTOR RELATIONS · 投资人专线', '<strong>ir@nbyiran.com</strong><br><button type="button" class="copy" data-copy="ir@nbyiran.com" data-copy-label="复制投资人邮箱">[CLICK TO COPY]</button>'],
            ['HEADQUARTERS · 研发与实业交付中心', '中国 · 宁波市江北区<br>（长三角实业交付中心）<br><span class="mono">29.8892°N / 121.5503°E</span>']
          ]) +
          '<h3>TRANSMISSION PROTOCOL // 加密直达</h3>' +
          '<form id="contact-form" onsubmit="handleFormSubmit(event)">' +
          '<div class="field"><label for="intent-select">您的联络意图 / INTENT</label>' +
          '<select id="intent-select" name="intent">' +
          '<option value="企业 AI+ERP 量身定制咨询">企业 AI+ERP 量身定制咨询</option>' +
          '<option value="一人公司 AI 效率工具定制">一人公司 AI 效率工具定制</option>' +
          '<option value="战略投资洽谈 (IR)">战略投资洽谈 (IR)</option>' +
          '<option value="生态与渠道合作">生态与渠道合作</option>' +
          '<option value="技术与算力生态共建">技术与算力生态共建</option>' +
          '</select></div>' +
          '<div class="field-row">' +
          '<div class="field"><label for="contact-name">称呼与职务 / NAME</label><input id="contact-name" name="name" type="text" required placeholder="如：林先生 / 创始人"></div>' +
          '<div class="field"><label for="contact-org">机构或企业名称 / ORG</label><input id="contact-org" name="org" type="text" required placeholder="公司 / 基金 / 工作室名称"></div>' +
          '</div>' +
          '<div class="field"><label for="contact-method">回执方式 / CONTACT (微信 / 手机 / 邮箱)</label><input id="contact-method" name="method" type="text" required placeholder="我们将于 12 小时内由合伙人直接与您对接"></div>' +
          '<div class="field"><label for="contact-brief">命题简述 / BRIEF</label><textarea id="contact-brief" name="brief" rows="3" placeholder="简述您的业务痛点、定制构想或合作方向..."></textarea></div>' +
          '<div class="form-actions"><button type="submit" id="submit-btn" class="btn btn-primary" style="width:100%; justify-content:center;">发送指令 // SEND SIGNAL ↗</button></div>' +
          '<p class="form-note">TRANSMISSION PROTOCOL // 加密直达 · 我们承诺不向任何第三方披露您的联络信息。</p>' +
          '</form>' +
          '<div class="form-success" id="contact-success" hidden>' +
          '<h4>TRANSMISSION RECEIVED // 信号已送达依然智枢中枢</h4>' +
          '<p id="contact-success-detail"></p>' +
          '<button type="button" class="btn btn-line" data-form-reset="contact">再发送一条 // NEW TRANSMISSION</button>' +
          '</div>' +
          '<div class="dossier-callout" style="margin-top:26px;"><span class="k">Direct Line // 直联</span>如希望即时沟通，可直接拨打林经理专线 <strong>159-6841-4820</strong>（微信同号），或发送邮件至 <strong>bd@nbyiran.com</strong>。</div>' +
          '<p class="dossier-note">宁波依然网络科技有限公司（智枢 AI）· 国家级科技型中小企业 · 浙ICP备15016619号-10</p>';
      }
    }
  };

  window.NexusUI.registerDossiers(registry, [
    'doc-overview', 'doc-manifesto', 'doc-pillar-erp', 'doc-pillar-opc',
    'doc-chronicle', 'doc-clients', 'doc-alliance', 'doc-contact'
  ], {
    contactId: 'doc-contact',
    contactLabel: '✉ 发起联络 // INITIATE'
  });

  window.NexusBrandDossiers = registry;
})();
