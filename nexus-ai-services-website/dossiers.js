/* =========================================================================
   YIRAN NEXUS · SERVICES ISSUE DOSSIER LIBRARY
   SRV-01 → SRV-06 · full original service copy preserved verbatim
   ========================================================================= */
(function () {
  'use strict';

  function actions(links) {
    return '<div class="dossier-actions">' + links.map(function (link) {
      if (link.href) return '<a class="btn btn-line" href="' + link.href + '">' + link.label + '</a>';
      if (link.dossier) return '<button type="button" class="btn btn-line" data-dossier="' + link.dossier + '" aria-haspopup="dialog">' + link.label + '</button>';
      return '<span class="dossier-badge">' + link.label + '</span>';
    }).join('') + '</div>';
  }

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

  function compare(rows) {
    return '<table class="dossier-table"><thead><tr><th>对比维度</th><th>传统 ERP</th><th>智枢 AI+ERP</th></tr></thead><tbody>' +
      rows.map(function (row) {
        return '<tr><td>' + row[0] + '</td><td><span class="before">' + row[1] + '</span></td><td><span class="after">' + row[2] + '</span></td></tr>';
      }).join('') + '</tbody></table>';
  }

  var registry = {

    'srv-bottleneck': {
      code: 'SRV-01 // THE BOTTLENECK',
      category: '破局诊断 · The Diagnostic',
      title: '为什么 90% 的中小企业觉得“AI大模型很好玩，但落不到实际业务里”？',
      subtitle: 'Three Symptoms · One Last-Mile Prescription',
      render: function () {
        return '' +
          '<p class="dossier-lead">这是我们在宁波与长三角的车间、仓库和业务办公室里反复听到的困惑。问题往往不在模型不够聪明，而在通用认知能力与企业私有业务之间，缺少一套<strong>可落地、可运维、可衡量</strong>的桥接系统。</p>' +
          '<h3>三大症结 // Three Symptoms</h3>' +
          grid([
            ['SYMPTOM 01 · 通用大模型不懂企业内部数据', '<strong>公网ChatGPT/DeepSeek只能写文章</strong>，无法读取您的库存表、生产工单与历史报价，更无法直接操作业务系统。'],
            ['SYMPTOM 02 · 传统软件死板昂贵，员工极度抗拒', '<strong>传统ERP动辄几十万且层层表单繁琐</strong>，一线工人和业务员不会用、不愿录，最后沦为高价摆设。'],
            ['SYMPTOM 03 · 智枢破局：AI大模型 + 业务系统深度定制', '<strong>拍张单据照片、发句语音即可完成入库、排产、审合同与自动跟单！</strong>让系统迁就人，彻底打通落地最后一公里。']
          ]) +
          '<h3>为什么中小企业纷纷将传统ERP升级为【智枢量身定制 AI+ERP】？</h3>' +
          '<p class="dossier-note">三维对比 // 操作门槛与数据录入 · 业务适配度 · 决策与执行价值</p>' +
          compare([
            ['操作门槛与数据录入', '传统ERP：需专职文员手工填几十个字段，极易出错', '智枢 AI+ERP：拍照、发语音、甩Excel，AI自动解析入库'],
            ['业务适配度', '传统ERP：固定套装模板，企业必须削足适履改流程', '智枢 AI+ERP：100%按您现有的行业潜规则与特殊工艺定制'],
            ['决策与执行价值', '传统ERP：仅做死板事后记账，出了亏损月底才知道', '智枢 AI+ERP：事前库存预警、事中自动盯单、实时推演利润']
          ]) +
          '<h3>依然智枢的判断 // Editorial Note</h3>' +
          '<p>市面上的通用SaaS只能解决30%的表面问题，剩下的70%非标业务细节才是决定成败的“最后一公里”。因此我们不卖标准化账号，也不把企业硬塞进固定模板——我们派驻AI架构师与行业顾问1对1贴身打造，从真实单据、BOM、报价与考核规矩出发，让AI在原有流程里长出执行力。</p>' +
          '<div class="dossier-callout"><span class="k">破局处方 // Prescription</span>不是再买一套软件，而是把大模型的能力接进您已经在用的进销存、生产、企微与财务系统，让每一次指令都落在真实单据与真实交付上。</div>' +
          actions([
            { dossier: 'srv-erp-spec', label: '查看企业 AI+ERP 四大模块 // SRV-02A' },
            { dossier: 'srv-process', label: '查看五步落地法 // SRV-03' },
            { dossier: 'srv-consult', label: '预约 1对1 业务诊断' }
          ]);
      }
    },

    'srv-erp-spec': {
      code: 'SRV-02A // ENGINE 01',
      category: '双核引擎 · Enterprise AI+ERP',
      title: '企业级 AI+ERP 智能系统',
      subtitle: 'Autonomous Enterprise Resource Planning',
      render: function () {
        return '' +
          '<p class="dossier-lead">把“死账本”变成会思考、会自动执行的“AI运营总监”。告别繁琐的几十级菜单点击。我们将大语言模型深度嵌入采购、生产、仓储、销售、财务全链路，支持语音、拍照、自然语言直接操控ERP。</p>' +
          metrics([
            ['自然语言', '交互范式 · 直接操控 ERP'],
            ['私有化', '本地私有化 / 混合云部署'],
            ['100%', '非标业务流量身定制']
          ]) +
          '<div class="dossier-callout"><span class="k">实时沙盒 // Live Sandbox</span>企业 AI+ERP 实时交互体验沙盒 · 已连接：ERP数据库 + 供应链Agent。点击测试企业日常高频指令，看 AI+ERP 如何打通最后一公里。</div>' +
          '<h3>四大定制模块 // Core Modules</h3>' +
          '<h4>E01 / 自然语言查账与BI决策</h4>' +
          '<p>直接问“上月华南区哪款产品毛利最高但回款慢？”，3秒生成可视化图表与催款建议。</p>' +
          '<h4>E02 / AI动态排产与智能补货</h4>' +
          '<p>结合交期、机台负荷、原材料库存与历史销量，AI自动推演最优排产计划与采购预警。</p>' +
          '<h4>E03 / 非标单据/合同秒级录入审阅</h4>' +
          '<p>微信发来的采购单、纸质送货单拍照即自动识别校验入库，自动排查合同价格与账期风险。</p>' +
          '<h4>E04 / 100%非标业务流定制</h4>' +
          '<p>无论是特殊BOM拆解、委外加工核算还是多级分销返利，完全按您的实际规矩量身定制。</p>' +
          '<h3>旧系统兼容 // Zero-Loss Integration</h3>' +
          '<p>依托十年生产管理与进销存底层研发功底，100%源码级量身定制，支持原有老旧ERP数据库、金蝶/用友、企微及车间PLC硬件API无损对接。</p>' +
          '<ul>' +
          '<li><strong>数据库直达：</strong>不推翻既有账本与历史数据，通过企业级 RAG 与数据库接入完成业务规则衔接。</li>' +
          '<li><strong>一线可用：</strong>自然语言、拍照、语音均可触发业务动作，降低车间、仓库与财务人员的系统负担。</li>' +
          '<li><strong>可审计执行：</strong>自动审单、排产与采购动作保留来源、依据与人工确认入口。</li>' +
          '<li><strong>数据不出域：</strong>支持本地服务器私有部署或专属加密云部署，财务、客户与BOM配方数据留在企业内。</li>' +
          '</ul>' +
          '<div class="dossier-callout"><span class="k">适用现场 // Fit</span>多品种小批量制造、非标产线、进销存与生产协同复杂、旧系统改造预算有限，却迫切希望以 AI 提升交付与资金效率的成长型企业。</div>' +
          actions([
            { dossier: 'srv-solo-spec', label: '切换一人公司 AI 引擎 // SRV-02B' },
            { dossier: 'srv-roi', label: '测算 AI+ERP 投资回报 // SRV-04' },
            { dossier: 'srv-consult', label: '预约企业 AI+ERP 诊断' }
          ]) +
          '<p class="dossier-note">ENGINE 01 // ENTERPRISE CORE · 支持私有化部署 / 旧ERP无损改造 · 1:1 贴合非标产线</p>';
      }
    },

    'srv-solo-spec': {
      code: 'SRV-02B // ENGINE 02',
      category: '双核引擎 · Solopreneur AI Suite',
      title: '一人公司 AI 智能效率工具',
      subtitle: 'One-Person Company Intelligence Matrix',
      render: function () {
        return '' +
          '<p class="dossier-lead">不招一个全职员工，为您定制一支 7×24h 连轴转的“AI铁军”。一人公司最大的瓶颈是精力被琐事榨干。我们根据您的细分赛道（跨境电商、咨询培训、自媒体MCN、独立开发、非标定制贸易等），为您量身配置专属AI自动化工作流。</p>' +
          metrics([
            ['1人=6人', '精英团队数字员工'],
            ['7×24h', '全自动无人值守'],
            ['100%', '工作流与客户资产私有']
          ]) +
          '<div class="dossier-callout"><span class="k">协同工作台 // Live Matrix</span>一人公司 AI 数字员工协同工作台 · 1人 = 6人精英团队 · 全自动无人值守模式：开启。选择您的一人公司/小微团队类型，查看量身定制的 AI 自动化流水线。</div>' +
          '<h3>四大数字员工 // Digital Crew</h3>' +
          '<h4>S01 / AI 全网获客与内容工厂</h4>' +
          '<p>自动抓取行业爆款选题，一键生成小红书/抖音/公众号/LinkedIn多端图文视频脚本并定时分发。</p>' +
          '<h4>S02 / AI 金牌销冠客服分身</h4>' +
          '<p>接入个人微信/企微/私信，学习您的说话语气与产品知识库，秒级回复询盘、精准算价逼单。</p>' +
          '<h4>S03 / 全自动交付与跟单RPA</h4>' +
          '<p>客户付款后自动建群、生成定制方案PDF、同步供应链发货、登记记账并定期回访复购。</p>' +
          '<h4>S04 / 第二大脑私有知识库</h4>' +
          '<p>将您散落的录音、聊天记录、行业研报、历史案例全部向量化，随时调用您的经验智慧。</p>' +
          '<h3>资产归属 // Ownership</h3>' +
          '<p>所有工作流与客户资产 100% 归属您私有，绝不封号或泄露机密。数字员工学习的是您的说话语气、产品知识与顾问话术，产出沉淀在您自己的知识库与工作流里，而不是被锁在别人的平台账号中。</p>' +
          '<ul>' +
          '<li><strong>获客：</strong>行业热点捕捉、多平台内容生成、定时分发与询盘汇总。</li>' +
          '<li><strong>成交：</strong>7×24 小时响应、产品库调用、阶梯报价与高意向客户预约。</li>' +
          '<li><strong>交付：</strong>建群、方案PDF、供应链发货、记账回访全链路自动跟单。</li>' +
          '<li><strong>沉淀：</strong>录音、聊天、研报与案例向量化，形成可随时调用的第二大脑。</li>' +
          '</ul>' +
          '<div class="dossier-callout"><span class="k">组织目标 // Leverage</span>把一个人的专业大脑复制成可协同的数字团队，摆脱“手停口停”的时间出卖模式，把精力集中到判断、审美与关系上。</div>' +
          actions([
            { dossier: 'srv-erp-spec', label: '切换企业 AI+ERP 引擎 // SRV-02A' },
            { dossier: 'srv-roi', label: '测算一人公司投资回报 // SRV-04' },
            { dossier: 'srv-consult', label: '定制我的 AI 数字团队' }
          ]) +
          '<p class="dossier-note">ENGINE 02 // SUPER INDIVIDUAL · 超级个体 / 工作室 / 轻资产团队专属 · 全自动无人值守模式：开启</p>';
      }
    },

    'srv-process': {
      code: 'SRV-03 // THE METHODOLOGY',
      category: '量身定制 · Five-Step Method',
      title: '五步彻底打通最后一公里',
      subtitle: 'Tailor-Made Methodology · Refuse Template Shells',
      render: function () {
        return '' +
          '<p class="dossier-lead">市面上的通用SaaS只能解决30%的表面问题，剩下的70%非标业务细节才是决定成败的“最后一公里”。我们派驻AI架构师与行业顾问1对1贴身打造。</p>' +
          '<h3>STEP 01 / 深度业务诊断与卡点梳理</h3>' +
          '<p>深入您的车间、仓库或日常获客工作流，盘点现有Excel表格、旧系统与高耗时人力卡点，输出《AI降本增效定制蓝图》。</p>' +
          '<p class="dossier-note">交付物：业务流诊断报告 + 原型图</p>' +
          '<h3>STEP 02 / 专属知识库构建与模型微调</h3>' +
          '<p>清洗您的历史报价单、BOM工艺、售后话术，通过RAG检索增强与行业Prompt工程，让大模型100%懂您的行话与业务规矩。</p>' +
          '<p class="dossier-note">交付物：企业专属私有AI大脑</p>' +
          '<h3>STEP 03 / 旧系统无损改造与AI工作流定制</h3>' +
          '<p>依托十年生产管理与进销存底层研发功底，100%源码级量身定制，支持原有老旧ERP数据库、金蝶/用友、企微及车间PLC硬件API无损对接。</p>' +
          '<p class="dossier-note">交付物：定制AI+ERP / 智能效率套件</p>' +
          '<h3>STEP 04 / 私有化安全部署与1对1驻场辅导</h3>' +
          '<p>支持本地服务器私有部署或专属加密云部署，确保财务、客户与BOM配方数据绝对不出域；工程师1对1驻场手把手实操辅导，10分钟快速上手。</p>' +
          '<p class="dossier-note">交付物：源码/私有环境 + 1对1实操辅导</p>' +
          '<h3>STEP 05 / 包教包会赋能与周度安全巡检</h3>' +
          '<p><strong>包教包会承诺：</strong>免费为企业定向培养 1 名内部 AI 系统管理员，提供每周私有服务器、模型与数据库安全巡检备份，彻底消除无人维护顾虑。</p>' +
          '<p class="dossier-note">交付物：定向培养1名管理员 + 周度巡检备份</p>' +
          '<div class="dossier-callout"><span class="k">交付标准 // Delivery Standard</span>以经营指标为唯一标尺：库存周转、订单交付周期、人均产值与订单错漏率。系统交付不是终点，直到您的团队能独立运转才算完成。</div>' +
          actions([
            { dossier: 'srv-roi', label: '测算降本增效回报 // SRV-04' },
            { dossier: 'srv-cases', label: '查阅实业落地复盘 // SRV-05' },
            { dossier: 'srv-consult', label: '预约 1对1 驻场诊断' }
          ]);
      }
    },

    'srv-roi': {
      code: 'SRV-04 // ROI SIMULATOR',
      category: '价值精算 · Interactive ROI',
      title: '算一算：为您量身定制AI系统，一年能省下多少真金白银？',
      subtitle: 'Interactive ROI Simulator · 3 Sliders',
      render: function () {
        return '' +
          '<p class="dossier-lead">拖动下方滑块，根据您的真实团队规模与日常文书/录单/客服耗时，实时测算降本增效回报。主干基准读数（25 人 / 3.5 小时 / ¥8,500）将随您的输入实时同步。</p>' +
          '<h3>1. 选择您的组织形态：</h3>' +
          '<div class="roi-types" role="group" aria-label="组织形态切换">' +
          '<button type="button" class="roi-type" data-roi-type="sme" aria-pressed="true">中小企业 (10 - 300人)</button>' +
          '<button type="button" class="roi-type" data-roi-type="solo" aria-pressed="false">一人公司 / 精品团队 (1 - 9人)</button>' +
          '</div>' +
          '<div class="roi-slider">' +
          '<div class="roi-slider-head"><label for="roi-staff-slider">2. 涉及业务运营/跟单/财务/客服人数：</label><b><span id="roi-staff-val">25</span> 人</b></div>' +
          '<input type="range" id="roi-staff-slider" min="1" max="150" value="25">' +
          '<div class="roi-scale"><span>1人 (超级个体)</span><span>50人 (成长型企)</span><span>150人+ (规模企业)</span></div>' +
          '</div>' +
          '<div class="roi-slider">' +
          '<div class="roi-slider-head"><label for="roi-hours-slider">3. 人均每天花在录单/核对/做表/重复客服的时间：</label><b><span id="roi-hours-val">3.5</span> 小时/天</b></div>' +
          '<input type="range" id="roi-hours-slider" min="1" max="7" step="0.5" value="3.5">' +
          '<div class="roi-scale"><span>1小时/天</span><span>3.5小时/天 (行业均值)</span><span>7小时/天 (重度繁琐)</span></div>' +
          '</div>' +
          '<div class="roi-slider">' +
          '<div class="roi-slider-head"><label for="roi-salary-slider">4. 岗位月均综合成本 (含薪资/社保/管理损耗)：</label><b>¥ <span id="roi-salary-val">8,500</span> /月</b></div>' +
          '<input type="range" id="roi-salary-slider" min="4000" max="25000" step="500" value="8500">' +
          '</div>' +
          '<div class="roi-dashboard">' +
          '<span class="roi-badge" id="roi-badge">预计回本周期 &lt; 2.5个月</span>' +
          '<p class="k">AI 定制赋能年度价值预估 // 预计每年直接释放人力与运营降本价值</p>' +
          '<div class="roi-total">¥ <span id="roi-money-saved">892,500</span></div>' +
          '<div class="roi-dashboard-grid">' +
          '<div><div class="v"><span id="roi-time-saved">18,375</span> <small>小时</small></div><div class="k">每年节省无效工时 · ≈ 解放 <span id="roi-eq-staff">9</span> 名全职员工精力</div></div>' +
          '<div><div class="v">8.5 倍</div><div class="k">业务流转与响应提速 · 订单错漏率下降 98.6%</div></div>' +
          '</div>' +
          '<p class="roi-recommendation"><span class="k">智枢为您匹配的定制方案建议：</span><span id="roi-recommendation">【企业级 AI+ERP 智能中枢定制版】重点打通智能审单入库、车间动态排产与业财自动化核算，支持与现有系统无缝对接。</span></p>' +
          '<p class="roi-footnote">测算口径：年度节省工时 = 人数 × 人均每日重复工时 × 250 个工作日 × 84% AI 可替代率；年度价值 = 节省工时 × 综合时薪（月薪 ÷ 175 小时）。结果为估算值，最终以业务诊断报告为准。</p>' +
          '<div class="dossier-actions"><button type="button" class="btn btn-primary" data-dossier="srv-consult" aria-haspopup="dialog">获取我司专属《AI定制方案与报价清单》 →</button></div>' +
          '</div>' +
          '<p class="dossier-note">ROI SIMULATOR // 25人 / 3.5h / ¥8,500 基准读数：¥ 892,500 · 18,375 小时 · &lt; 2.5 个月</p>';
      },
      onMount: function () {
        if (typeof window.calculateROI === 'function') window.calculateROI();
      }
    },

    'srv-cases': {
      code: 'SRV-05 // CASE ARCHIVE',
      category: '实业实录 · Success Stories',
      title: '深耕实体产业十年，赋能制造、供应链与超级个体跃迁',
      subtitle: 'Success Stories · Ningbo & Yangtze River Delta',
      render: function () {
        return '' +
          '<p class="dossier-lead">自 2015 年起扎根宁波制造业与商贸一线，每一个项目均为 1对1 深入车间与业务现场量身打造，用真实的降本与营收数据说话。</p>' +
          '<h3 data-dossier-anchor="case-01">CASE 01 / 非标BOM核价与AI智能排产系统定制</h3>' +
          '<p class="dossier-note">实体制造 &amp; 新材料 · 标杆场景 · 企业 AI+ERP</p>' +
          '<p><strong>原痛点：</strong>非标定制与新材料配方核价需工程师耗时2天，车间插单频繁导致交期延误率高达28%。</p>' +
          '<p><strong>定制方案：</strong>基于原进销存/生产底座升级 AI 自动拆解 BOM 核价引擎 + 动态插单重排产 ERP 模块。</p>' +
          metrics([['3分钟', '自动完成精准报价'], ['+32%', '车间产能利用率提升'], ['4 家', '代表服务企业']]) +
          '<p class="dossier-note">代表服务背景：佳乐股份 · 凯孚新材料 · 楚鑫材料 · 宁波艾升纸制</p>' +
          '<h3 data-dossier-anchor="case-02">CASE 02 / 微信群语音/手写单自动开单与库存预测</h3>' +
          '<p class="dossier-note">生鲜食品食材供应链 · 65人 · 企业 AI+ERP</p>' +
          '<p><strong>原痛点：</strong>每天数百张餐饮与生鲜客户手写菜单、方言语音发在微信群，多名文员通宵录ERP仍常发错货。</p>' +
          '<p><strong>定制方案：</strong>企微群AI接单Agent直连进销存ERP，图片/语音秒转出库单并自动匹配配送车线。</p>' +
          metrics([['省 6 人', '专职录单文员成本'], ['99.8%', '订单分拣准确率'], ['65人', '供应链团队规模']]) +
          '<p class="dossier-note">代表服务背景：日合柑桔 · 食全食美</p>' +
          '<h3 data-dossier-anchor="case-03">CASE 03 / 1人操盘年销千万的全自动出海矩阵</h3>' +
          '<p class="dossier-note">跨境品牌独立站 · 超级个体 · 一人公司AI套件</p>' +
          '<p><strong>原痛点：</strong>主理人独自兼顾选品、海外社媒内容、红人建联邮件与跨时区客服，精力严重透支。</p>' +
          '<p><strong>定制方案：</strong>定制AI多语种海外获客与导购销冠Agent + 自动算价跟单与跨境供应链履约工作流。</p>' +
          metrics([['1人=8人', '零全职雇员高人效'], ['3.4倍', '海外询盘转化率增长'], ['24h', '无人值守成交']]) +
          '<p class="dossier-note">代表服务背景：Floravase（跨境出海品牌）</p>' +
          '<h3 data-dossier-anchor="case-04">CASE 04 / 工程标书/合同AI自动审拟与项目协同</h3>' +
          '<p class="dossier-note">工程建筑与专业服务机构 · AI知识库 &amp; 流程套件</p>' +
          '<p><strong>原痛点：</strong>大量时间消耗在工程合同审查、材料核对与客户初级咨询解答，高价值项目无暇深度管控。</p>' +
          '<p><strong>定制方案：</strong>注入10年历史工程规范与私有档案库，打造24h智能审单、标书生成与项目进度预警引擎。</p>' +
          metrics([['+210%', '项目流转效率提升'], ['85%', '文书审核时间缩减'], ['10年', '历史工程规范沉淀']]) +
          '<p class="dossier-note">代表服务背景：天坤建筑 · 行业商协会数字化平台</p>' +
          '<h3>宁波及华东标杆实业制造、供应链与科研院所历史合作名录</h3>' +
          '<p>历经国家级/市级科研机构与本土规模制造企业检验，具备高安全合规私有化交付水准。</p>' +
          grid([
            ['制造实业标杆', '<strong>佳乐股份</strong>'],
            ['新材料研发制造', '<strong>凯孚新材料</strong>'],
            ['工业新材料实业', '<strong>楚鑫材料</strong>'],
            ['包装生产制造', '<strong>宁波艾升纸制</strong>'],
            ['建筑工程系统', '<strong>天坤建筑</strong>'],
            ['跨境出海品牌', '<strong>Floravase</strong>'],
            ['生鲜农业供应链', '<strong>日合柑桔</strong>'],
            ['餐饮食材供应链', '<strong>食全食美</strong>'],
            ['国际科研合作平台', '<strong>中国—中东欧国家创新合作研究中心</strong>'],
            ['权威科研智库机构', '<strong>宁波海上丝绸之路研究院</strong>']
          ]) +
          '<div class="dossier-callout"><span class="k">资质背书 // Credentials</span>国家级科技型中小企业 · 多项核心软著 · 浙ICP备15016619号-10</div>' +
          actions([
            { dossier: 'srv-consult', label: '预约 1对1 定制诊断' },
            { dossier: 'srv-process', label: '查看五步交付法 // SRV-03' }
          ]) +
          '<p class="dossier-note">SUCCESS STORIES // 排列不分先后 · 案例数据来自真实交付现场</p>';
      }
    },

    'srv-consult': {
      code: 'SRV-06 // THE CONSULTATION',
      category: '预约定制诊断 · Bespoke Diagnosis',
      title: '立即开启您的 AI 量身定制落地之旅',
      subtitle: '1对1 免费业务流诊断 · 2 小时内响应',
      render: function () {
        return '' +
          '<p class="dossier-lead">不确定您的业务该如何结合大模型？提交右侧需求，我们的<strong>资深AI系统架构师</strong>将在 2 小时内与您联系，免费为您提供：</p>' +
          grid([
            ['01 / BUSINESS AUDIT', '<strong>1对1 业务卡点梳理</strong><br>分析您现有ERP或日常工作流中最值得AI化的高回报环节。'],
            ['02 / PROTOTYPE', '<strong>定制原型演示</strong><br>用您的真实业务数据（脱敏）现场演示 AI+ERP 或数字员工运行效果。'],
            ['03 / TRANSPARENT QUOTE', '<strong>透明周期与报价清单</strong><br>按模块灵活定制，丰俭由人，拒绝捆绑隐藏消费。']
          ]) +
          '<h3>直联通道 // Direct Line</h3>' +
          grid([
            ['定制咨询专线 / 林经理', '<strong>159-6841-4820</strong>（微信同号）'],
            ['商务与定制邮箱', '<strong>bd@nbyiran.com</strong>'],
            ['研发与实业交付中心', '中国 · 宁波市江北区（长三角实业交付中心）']
          ]) +
          '<h3>FORM // 1对1 定制诊断预约单</h3>' +
          '<form id="consult-form">' +
          '<div class="field-row">' +
          '<div class="field"><label for="form-name">您的称呼 *</label><input id="form-name" name="name" type="text" required placeholder="例如：张总 / 李主理人"></div>' +
          '<div class="field"><label for="form-phone">联系电话 / 微信 *</label><input id="form-phone" name="phone" type="text" required placeholder="用于接收定制方案与演示预约"></div>' +
          '</div>' +
          '<div class="field-row">' +
          '<div class="field"><label for="form-product">您关注的定制方向 *</label><select id="form-product" name="product">' +
          '<option value="企业级 AI+ERP 系统定制">企业级 AI+ERP 系统量身定制</option>' +
          '<option value="一人公司 AI 智能效率套件">一人公司 AI 智能效率工具定制</option>' +
          '<option value="现有老旧ERP接入AI大模型升级">现有老旧ERP/软件接入AI大模型改造</option>' +
          '<option value="企业私有大模型知识库部署">企业私有大模型与智能客服/销冠定制</option>' +
          '</select></div>' +
          '<div class="field"><label for="form-company">所在行业与团队规模</label><input id="form-company" name="company" type="text" placeholder="如：五金制造50人 / 跨境电商一人公司"></div>' +
          '</div>' +
          '<div class="field"><label for="form-desc">您最希望解决的“最后一公里”业务痛点：</label><textarea id="form-desc" name="desc" rows="3" placeholder="请简单描述您的业务卡点（例如：每天大量非标订单手工录ERP太慢、库存总是算不准、或希望打造24小时自动获客跟单工作流...）"></textarea></div>' +
          '<div class="form-actions"><button type="submit" class="btn btn-primary" style="width:100%; justify-content:center;">立即提交 · 免费获取 1对1 量身定制方案</button></div>' +
          '<p class="form-note">我们严格遵守《企业商业秘密保密协议》，您的信息仅用于本次方案评估。</p>' +
          '</form>' +
          '<div class="form-success" id="form-success-box" aria-live="polite" hidden>' +
          '<h4>定制诊断预约已成功提交！</h4>' +
          '<p id="form-success-detail"></p>' +
          '<button type="button" class="btn btn-line" data-consult-reset>返回继续修改或再次提交</button>' +
          '</div>' +
          '<div class="dossier-callout"><span class="k">响应承诺 // Response</span>林经理与首席AI架构师将在 2 小时内通过电话/微信与您取得联系；所有信息仅用于本次方案评估，严格保密。</div>' +
          '<p class="dossier-note">宁波依然网络科技有限公司（智枢 AI）· 国家级科技型中小企业 · 浙ICP备15016619号-10</p>';
      }
    }
  };

  window.NexusUI.registerDossiers(registry, [
    'srv-bottleneck', 'srv-erp-spec', 'srv-solo-spec', 'srv-process',
    'srv-roi', 'srv-cases', 'srv-consult'
  ], {
    contactId: 'srv-consult',
    contactLabel: '✉ 预约定制诊断 // BOOK'
  });

  window.NexusServicesDossiers = registry;
})();
