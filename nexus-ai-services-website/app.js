/* =========================================================================
   YIRAN NEXUS · SERVICES ISSUE CONTROL LAYER
   Terminal sandbox · live log · dual-engine tabs · ROI · consultation form
   ========================================================================= */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  function escapeHtml(value) {
    if (window.NexusUI && typeof window.NexusUI.escapeHtml === 'function') return window.NexusUI.escapeHtml(value);
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function stripTags(value) {
    return String(value == null ? '' : value).replace(/<[^>]*>/g, '');
  }

  function formatNumber(value) {
    return String(Math.round(Number(value) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function startClock() {
    var el = document.getElementById('live-clock');
    if (!el) return;
    var formatter = null;
    try {
      formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Shanghai',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      });
    } catch (err) { formatter = null; }
    var tick = function () {
      var now = new Date();
      var text;
      if (formatter) {
        text = formatter.format(now);
      } else {
        var shifted = new Date(now.getTime() + (now.getTimezoneOffset() + 480) * 60000);
        text = [shifted.getHours(), shifted.getMinutes(), shifted.getSeconds()].map(function (n) {
          return String(n).padStart(2, '0');
        }).join(':');
      }
      el.textContent = 'UTC+8 ' + text;
    };
    tick();
    window.setInterval(tick, 1000);
  }

  /* ------------------------------------------------------------ live log */
  var liveLogs = [
    '正在解析宁波华东仓原材料BOM缺口，已自动触发ERP采购单 #PO-8942...',
    '【一人公司AI矩阵】跨境独立站客服Agent已完成德语询盘解答并生成PayPal账单...',
    '【企业AI+ERP】车间视觉终端识别送货单完毕，已自动核对入库并同步应付账款...',
    '【企业AI+ERP】检测到3号注塑机交期冲突，AI已重新推演最优排产甘特图...',
    '【一人公司AI矩阵】已自动抓取今日行业热点，生成6篇多平台种草图文并完成定时发布...'
  ];

  function startLiveLog() {
    var el = document.getElementById('live-log-text');
    if (!el || prefersReduced) return;
    var index = 0;
    window.setInterval(function () {
      index = (index + 1) % liveLogs.length;
      el.style.opacity = '0';
      window.setTimeout(function () {
        el.textContent = liveLogs[index];
        el.style.opacity = '1';
      }, 200);
    }, 3800);
  }

  /* ------------------------------------------------------- engine switch */
  function switchProductTab(tab) {
    var panelErp = document.getElementById('panel-erp');
    var panelSolo = document.getElementById('panel-solo');
    var btnErp = document.getElementById('tab-btn-erp');
    var btnSolo = document.getElementById('tab-btn-solo');
    if (!panelErp || !panelSolo || !btnErp || !btnSolo) return false;
    var isErp = tab !== 'solo';
    panelErp.hidden = !isErp;
    panelSolo.hidden = isErp;
    btnErp.setAttribute('aria-selected', String(isErp));
    btnSolo.setAttribute('aria-selected', String(!isErp));
    return true;
  }

  /* ---------------------------------------------------------- ERP demos */
  var erpDemos = [
    {
      userPrompt: '“下周新接了3000套智能阀门急单，帮我核查华东仓BOM原材料缺口，自动重排车间机台并生成采购申请单。”',
      aiSteps: [
        '已读取 ERP 库存表、在途采购单及 3000套智能阀门 3级 BOM 清单',
        '识别到【304不锈钢密封圈】缺口 1,450 件，【微型步进电机】库存充足',
        '已自动调用历史最优供应商（宁波精工）比价，并重排 2号、4号CNC机台夜班班次'
      ],
      cardTitle: 'AI+ERP 自动生成执行单据（待您一键确认）',
      metrics: [
        ['预计齐套交期', '10月31日 16:00 (提前1.5天)'],
        ['自动生成采购单', '#PO-20261026-09 (¥28,400)'],
        ['产能负荷率', '94.2% (无交期延误风险)']
      ],
      actionText: '已同步至车间MES看板与采购部企业微信'
    },
    {
      userPrompt: '“[上传了一张微信拍的褶皱纸质送货单照片] 把这张供应商送来的五金配件入库，核对跟上月采购合同单价有没有出入。”',
      aiSteps: [
        '多模态视觉大模型 OCR 识别手写/印章单据成功（识别准确率 99.9%）',
        '自动匹配 ERP 关联采购合同 #HT-9021，校验全部 12 项物料编码与实收数量',
        '价格异常拦截：发现第4项【M8高强螺栓】送货单价 ¥1.25 高于合同约定价 ¥1.10！'
      ],
      cardTitle: 'AI 智能审单与入库拦截报告',
      metrics: [
        ['正常入库项', '11 项物料已自动生成入库单'],
        ['异常差价拦截', '拦截多计金额 ¥1,500.00'],
        ['财务应付凭证', '已按合同正确价预生成凭证']
      ],
      actionText: '已自动向采购员与供应商发送差价核实通知'
    },
    {
      userPrompt: '“为什么这个月营收涨了20%，但账面净利润反而少了？帮我穿透查一下原因，并把超期未回款的客户列出来催收。”',
      aiSteps: [
        '已跨模块穿透分析：销售订单毛利表 + 车间实际工时损耗 + 物流费用明细',
        '定位核心原因：① 华南区特价促销让利 4.2%；② A款包装纸箱原材料本月中旬涨价 11%',
        '已筛出 4 家超账期 15 天以上客户（合计应收 ¥34.6万），并拟好差异化催款函'
      ],
      cardTitle: '业财一体 AI 经营诊断与催收执行卡',
      metrics: [
        ['利润流失主因', '辅料涨价未同步更新销售底价'],
        ['逾期应收总额', '¥ 346,000 (4家客户)'],
        ['AI 自动动作', '已向对应销售企微派发催收跟进任务']
      ],
      actionText: '已自动锁定逾期超30天客户的ERP新建发货权限'
    }
  ];

  function runErpDemo(index) {
    var data = erpDemos[index] || erpDemos[0];
    document.querySelectorAll('[data-erp-demo]').forEach(function (btn) {
      btn.setAttribute('aria-selected', String(Number(btn.getAttribute('data-erp-demo')) === Number(index)));
    });
    var container = document.getElementById('erp-sandbox-output');
    if (!container) return false;

    var html = '<div class="term-line"><span class="term-flag">OPERATOR</span>总经理 / 业务主管指令：</div>' +
      '<div class="term-user">' + data.userPrompt + '</div>' +
      '<div class="term-line"><span class="term-flag">NEXUS</span>依然智枢 AI+ERP 引擎已执行以下底层操作：</div>' +
      data.aiSteps.map(function (step) {
        var text = stripTags(step);
        var warn = text.indexOf('价格异常拦截') === 0;
        return '<div class="term-line"><span class="' + (warn ? 'term-warn' : 'term-ok') + '">' + (warn ? '[ALERT]' : '[OK]') + '</span> ' + text + '</div>';
      }).join('') +
      '<div class="term-slip">' +
      '<div class="term-slip-title">' + data.cardTitle + ' · <span class="term-steel">已打通最后一公里执行</span></div>' +
      '<div class="term-metrics">' + data.metrics.map(function (metric) {
        return '<div class="term-metric"><p class="k">' + metric[0] + '</p><p class="v">' + metric[1] + '</p></div>';
      }).join('') + '</div>' +
      '<div class="term-status"><span class="term-ok">' + data.actionText + '</span><span>全流程耗时：1.2秒</span></div>' +
      '</div>';
    container.innerHTML = html;
    container.scrollTop = 0;
    return true;
  }

  /* --------------------------------------------------------- solo demos */
  var soloDemos = [
    {
      title: '跨境电商 / 外贸 SOHO 超级个体 24小时自动化流水线',
      desc: '主理人只需负责选品决策，其余获客、多语种询盘跟进、算价、下单履约全部由定制AI数字员工闭环完成：',
      agents: [
        { role: 'AI 海外社媒获客专员', time: '08:00 自动执行', task: '抓取TikTok/Instagram欧美热门趋势，自动生成5条本土化英文短视频脚本与独立站SEO文章并发布。', status: '日均自然流询盘 +38条' },
        { role: 'AI 多语种销冠客服', time: '7×24h 秒级响应', task: '通过WhatsApp/邮件用英、德、西语同时接待12位海外买家，调用产品库自动发送阶梯报价单与样品链接。', status: '夜间无人值守成交 $4,200' },
        { role: 'AI 供应链跟单与记账助理', time: '订单触发即执行', task: '客户付款后，自动向国内工厂下达采购指令、回填国际物流单号，并生成单品净利核算表。', status: '零人工干预自动履约' }
      ]
    },
    {
      title: '知识IP / 咨询顾问 / 商业设计师 一人公司放大器',
      desc: '把您一个人的专业大脑复制成10个分身，彻底摆脱“手停口停”的时间出卖模式：',
      agents: [
        { role: 'AI 爆款选题与多端内容矩阵', time: '09:00 自动执行', task: '将您的一段3分钟语音观点，自动扩写为公众号深度长文、小红书高颜值图文卡片及视频号口播稿。', status: '全网内容产出效率提升 10倍' },
        { role: 'AI 私域诊断与高客单逼单助手', time: '全天候私域接待', task: '新粉加微信后，AI按您的顾问话术自动进行客户需求问卷诊断，筛出高意向客户并预约您的1对1付费咨询。', status: '无效陪聊时间减少 90%' },
        { role: 'AI 方案报告与合同法务助理', time: '交付阶段加速', task: '根据客户沟通录音，调用您的历史案例库10分钟生成《定制初版方案PPT大纲》与标准服务合同。', status: '交付产能翻 3倍' }
      ]
    },
    {
      title: '高客单私域工作室 / 垂直非标定制买手团队',
      desc: '针对非标定制、生鲜特产供应链、软装设计等重服务行业，让1个人轻松维护5000+高净值客户：',
      agents: [
        { role: 'AI 客户画像与朋友圈千人千面', time: '智能标签触发', task: '自动分析客户聊天记录中的预算偏好、复购周期与审美风格，每日自动生成针对性的朋友圈文案与私信关怀。', status: '老客复购率提升 65%' },
        { role: 'AI 视觉选款与秒级定制报价', time: '客户发图即响应', task: '客户发来参考图，AI秒级在您的数万张档口/工厂图库中检索同款，结合当日原料行情算出精准定制报价。', status: '询单转化率提升 2.8倍' },
        { role: 'AI 定制工期盯单管家', time: '全流程节点播报', task: '自动追踪合作工坊生产进度，在打版、质检、顺丰寄出节点自动向客户发送精美进度播报卡。', status: '高端服务体验拉满' }
      ]
    }
  ];

  function runSoloDemo(index) {
    var data = soloDemos[index] || soloDemos[0];
    document.querySelectorAll('[data-solo-demo]').forEach(function (btn) {
      btn.setAttribute('aria-selected', String(Number(btn.getAttribute('data-solo-demo')) === Number(index)));
    });
    var container = document.getElementById('solo-sandbox-output');
    if (!container) return false;

    var html = '<div class="term-line"><span class="term-flag">SELECT</span>' + data.title + '</div>' +
      '<div class="term-user">' + data.desc + '</div>' +
      data.agents.map(function (agent, agentIndex) {
        return '<div class="term-agent">' +
          '<div class="term-line"><span class="term-flag">0' + (agentIndex + 1) + '</span><span class="role">' + agent.role + '</span><span class="time">' + agent.time + '</span></div>' +
          '<p class="task">' + agent.task + '</p>' +
          '<p class="status">' + agent.status + '</p>' +
          '</div>';
      }).join('');
    container.innerHTML = html;
    container.scrollTop = 0;
    return true;
  }

  /* ---------------------------------------------------------------- ROI */
  var ROI_PROJECT_INVESTMENT = 186000;

  function setRoiType(type) {
    var sme = document.querySelector('[data-roi-type="sme"]');
    var solo = document.querySelector('[data-roi-type="solo"]');
    var staffEl = document.getElementById('roi-staff-slider');
    var hoursEl = document.getElementById('roi-hours-slider');
    var salaryEl = document.getElementById('roi-salary-slider');
    if (!sme || !solo || !staffEl || !hoursEl || !salaryEl) return false;

    var isSolo = type === 'solo';
    sme.setAttribute('aria-pressed', String(!isSolo));
    solo.setAttribute('aria-pressed', String(isSolo));
    staffEl.value = isSolo ? 2 : 25;
    hoursEl.value = isSolo ? 5 : 3.5;
    salaryEl.value = isSolo ? 12000 : 8500;
    calculateROI();
    return true;
  }

  function calculateROI() {
    var staffEl = document.getElementById('roi-staff-slider');
    var hoursEl = document.getElementById('roi-hours-slider');
    var salaryEl = document.getElementById('roi-salary-slider');
    var staffValEl = document.getElementById('roi-staff-val');
    var hoursValEl = document.getElementById('roi-hours-val');
    var salaryValEl = document.getElementById('roi-salary-val');
    var timeSavedEl = document.getElementById('roi-time-saved');
    var moneySavedEl = document.getElementById('roi-money-saved');
    var eqStaffEl = document.getElementById('roi-eq-staff');
    var recEl = document.getElementById('roi-recommendation');
    var badgeEl = document.getElementById('roi-badge');
    if (!staffEl || !hoursEl || !salaryEl || !staffValEl || !hoursValEl || !salaryValEl ||
        !timeSavedEl || !moneySavedEl || !eqStaffEl || !recEl || !badgeEl) return false;

    var staff = parseInt(staffEl.value, 10) || 25;
    var hours = parseFloat(hoursEl.value) || 0;
    var salary = parseInt(salaryEl.value, 10) || 0;

    var annualHoursSaved = Math.round(staff * hours * 250 * 0.84);
    var annualMoneySaved = Math.round(annualHoursSaved * salary / 175);
    var eqStaff = Math.max(1, Math.round(annualHoursSaved / 2000));

    staffValEl.textContent = staff;
    hoursValEl.textContent = hours.toFixed(1);
    salaryValEl.textContent = formatNumber(salary);
    timeSavedEl.textContent = formatNumber(annualHoursSaved);
    moneySavedEl.textContent = formatNumber(annualMoneySaved);
    eqStaffEl.textContent = eqStaff;

    var stripMoney = document.getElementById('roi-strip-money');
    var stripHours = document.getElementById('roi-strip-hours');
    var stripPayback = document.getElementById('roi-strip-payback');
    var stripPrefix = document.getElementById('roi-strip-payback-prefix');
    if (stripMoney) stripMoney.textContent = formatNumber(annualMoneySaved);
    if (stripHours) stripHours.textContent = formatNumber(annualHoursSaved);
    if (stripPayback && annualMoneySaved > 0) {
      var payback = (ROI_PROJECT_INVESTMENT * 12) / annualMoneySaved;
      stripPayback.textContent = payback.toFixed(1);
      if (stripPrefix) stripPrefix.textContent = payback <= 2.5501 ? '< ' : '≈ ';
    }

    if (staff <= 8) {
      badgeEl.textContent = '一人公司/轻团队高人效方案';
      recEl.textContent = '【一人公司 AI 超级效率矩阵定制版】为您配置 24h 智能销冠客服 + 全自动内容获客工作流 + 自动跟单记账助理，无需扩招员工即可实现业绩倍增。';
    } else if (staff <= 40) {
      badgeEl.textContent = '预计回本周期 < 2.5个月';
      recEl.textContent = '【成长型企业 AI+ERP 核心模块定制】重点打通微信/纸质单据自动审单入库、智能库存预警与业财一体核算，支持旧系统无损升级，彻底解放跟单与财务人员。';
    } else {
      badgeEl.textContent = '规模化企业深度赋能方案';
      recEl.textContent = '【企业级全链路 AI+ERP 私有化旗舰版】深度定制智能排产算法、供应链协同Agent、管理层自然语言BI驾驶舱及私有大模型本地安全部署，免费培养1名内部AI管理员。';
    }
    return true;
  }

  /* ------------------------------------------------------ consult form */
  function submitConsultForm(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    var form = document.getElementById('consult-form');
    var success = document.getElementById('form-success-box');
    var detail = document.getElementById('form-success-detail');
    var nameEl = document.getElementById('form-name');
    var phoneEl = document.getElementById('form-phone');
    var productEl = document.getElementById('form-product');
    if (!form || !success || !detail || !nameEl || !phoneEl || !productEl) return false;

    var name = escapeHtml(nameEl.value.trim());
    var phone = escapeHtml(phoneEl.value.trim());
    var product = escapeHtml(productEl.value);

    if (!name || !phone) {
      if (!name) nameEl.focus();
      else phoneEl.focus();
      return false;
    }

    detail.innerHTML = '尊敬的 <strong>' + name + '</strong>，我们已收到您关于 <strong>【' + product + '】</strong> 的定制诊断需求。<br>宁波依然网络科技（依然智枢）林经理与首席AI架构师将在 2 小时内通过电话/微信（<strong>' + phone + '</strong>）与您取得联系，您也可直接拨打专线 <strong>159-6841-4820</strong>。';
    form.hidden = true;
    success.hidden = false;

    var again = success.querySelector('[data-consult-reset]');
    if (again && typeof again.focus === 'function') {
      try { again.focus({ preventScroll: true }); } catch (err) { again.focus(); }
    }
    return true;
  }

  function resetConsultForm() {
    var form = document.getElementById('consult-form');
    var success = document.getElementById('form-success-box');
    if (!form || !success) return false;
    form.reset();
    form.hidden = false;
    success.hidden = true;
    var nameEl = document.getElementById('form-name');
    if (nameEl && typeof nameEl.focus === 'function') {
      try { nameEl.focus({ preventScroll: true }); } catch (err) { nameEl.focus(); }
    }
    return true;
  }

  /* ---------------------------------------------------------- delegation */
  function initDelegation() {
    document.addEventListener('click', function (event) {
      var target = event.target;
      if (!target || !target.closest) return;

      var tab = target.closest('[data-engine-tab]');
      if (tab) {
        event.preventDefault();
        switchProductTab(tab.getAttribute('data-engine-tab'));
        return;
      }

      var link = target.closest('[data-engine-link]');
      if (link) {
        event.preventDefault();
        var engine = link.getAttribute('data-engine-link') === 'solo' ? 'solo' : 'erp';
        switchProductTab(engine);
        var products = document.getElementById('products');
        if (products && typeof products.scrollIntoView === 'function') {
          products.scrollIntoView({ block: 'start', behavior: prefersReduced ? 'auto' : 'smooth' });
        }
        var tabBtn = document.getElementById(engine === 'solo' ? 'tab-btn-solo' : 'tab-btn-erp');
        if (tabBtn) {
          try { tabBtn.focus({ preventScroll: true }); } catch (err) { tabBtn.focus(); }
        }
        return;
      }

      var erpBtn = target.closest('[data-erp-demo]');
      if (erpBtn) {
        event.preventDefault();
        runErpDemo(parseInt(erpBtn.getAttribute('data-erp-demo'), 10));
        return;
      }

      var soloBtn = target.closest('[data-solo-demo]');
      if (soloBtn) {
        event.preventDefault();
        runSoloDemo(parseInt(soloBtn.getAttribute('data-solo-demo'), 10));
        return;
      }

      var roiType = target.closest('[data-roi-type]');
      if (roiType) {
        event.preventDefault();
        setRoiType(roiType.getAttribute('data-roi-type'));
        return;
      }

      var resetBtn = target.closest('[data-consult-reset]');
      if (resetBtn) {
        event.preventDefault();
        resetConsultForm();
        return;
      }

      var zoomClose = target.closest('.image-zoom-overlay');
      if (zoomClose) { event.preventDefault(); closeImageZoom(); return; }
      var fig = target.closest('figure.engine-figure, figure.band');
      if (fig && !activeZoomFig && !fig.closest('.toggle-panel')) { event.preventDefault(); openImageZoom(fig); return; }
    });

    document.addEventListener('input', function (event) {
      var target = event.target;
      if (!target) return;
      if (target.id === 'roi-staff-slider' || target.id === 'roi-hours-slider' || target.id === 'roi-salary-slider') {
        calculateROI();
      }
    });

    document.addEventListener('submit', function (event) {
      if (event.target && event.target.id === 'consult-form') submitConsultForm(event);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && activeZoomFig) { event.preventDefault(); event.stopPropagation(); closeImageZoom(); }
    });
  }

  var activeZoomFig = null, zoomOverlay = null;

  function ensureZoomOverlay() {
    if (zoomOverlay) return zoomOverlay;
    zoomOverlay = document.createElement('div');
    zoomOverlay.className = 'image-zoom-overlay';
    zoomOverlay.setAttribute('role', 'dialog'); zoomOverlay.setAttribute('aria-modal', 'true'); zoomOverlay.setAttribute('aria-label', '大图预览');
    zoomOverlay.innerHTML = '<div class="image-zoom-backdrop"></div><div class="image-zoom-view"><img class="image-zoom-img" alt=""><div class="image-zoom-caption"></div></div><button type="button" class="image-zoom-close" aria-label="关闭预览" title="关闭 (Esc)">✕</button>';
    document.body.appendChild(zoomOverlay);
    zoomOverlay.addEventListener('click', function (e) { e.preventDefault(); closeImageZoom(); });
    return zoomOverlay;
  }

  function openImageZoom(fig) {
    if (activeZoomFig) return false;
    var img = fig.querySelector('img');
    if (!img) return false;
    var ov = ensureZoomOverlay(), view = ov.querySelector('.image-zoom-view');
    var zoomImg = ov.querySelector('.image-zoom-img'), cap = ov.querySelector('.image-zoom-caption');
    var figcaption = fig.querySelector('figcaption');
    activeZoomFig = fig;
    var s = img.currentSrc || img.src;
    zoomImg.src = s; zoomImg.setAttribute('src', s); zoomImg.alt = img.alt || '';
    if (cap) { cap.innerHTML = figcaption ? figcaption.innerHTML : ''; cap.style.display = figcaption ? 'flex' : 'none'; }
    var rect = img.getBoundingClientRect();
    var vw = window.innerWidth || 1280, vh = window.innerHeight || 720;
    var padX = vw > 900 ? 56 : 20, padY = vh > 700 ? 64 : 32, capH = figcaption ? 40 : 0;
    var maxW = Math.min(vw - padX * 2, 1440), maxH = vh - padY * 2 - capH;
    var rectW = rect.width || 800, rectH = rect.height || 450, aspect = rectW / rectH;
    var targetW = maxW, targetH = targetW / aspect;
    if (targetH > maxH) { targetH = maxH; targetW = targetH * aspect; }
    var targetLeft = Math.round((vw - targetW) / 2), targetTop = Math.max(padY, Math.round((vh - targetH - capH) / 2));
    var scaleX = rectW / targetW, scaleY = rectH / targetH;
    var deltaX = Math.round(rect.left - targetLeft), deltaY = Math.round(rect.top - targetTop);
    view.style.left = targetLeft + 'px'; view.style.top = targetTop + 'px';
    view.style.width = Math.round(targetW) + 'px'; view.style.height = Math.round(targetH) + 'px';
    view.style.transformOrigin = '0 0';
    view.style.transform = 'translate3d(' + deltaX + 'px, ' + deltaY + 'px, 0) scale(' + scaleX + ', ' + scaleY + ')';
    view.style.transition = 'none';
    fig.classList.add('is-zoomed-origin'); ov.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    void view.offsetHeight;
    var reduced = Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (!reduced) view.style.transition = 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)';
    view.style.transform = 'translate3d(0, 0, 0) scale(1, 1)';
    setTimeout(function () {
      var btn = ov.querySelector('.image-zoom-close');
      if (btn) try { btn.focus({ preventScroll: true }); } catch (err) {}
    }, reduced ? 20 : 430);
    return true;
  }

  function closeImageZoom() {
    if (!activeZoomFig || !zoomOverlay) return false;
    var fig = activeZoomFig, img = fig.querySelector('img'), view = zoomOverlay.querySelector('.image-zoom-view');
    var rect = img ? img.getBoundingClientRect() : { left: 0, top: 0, width: 800, height: 450 };
    var targetLeft = parseFloat(view.style.left) || 0, targetTop = parseFloat(view.style.top) || 0;
    var targetW = parseFloat(view.style.width) || (rect.width || 800), targetH = parseFloat(view.style.height) || (rect.height || 450);
    var rectW = rect.width || targetW, rectH = rect.height || targetH;
    var scaleX = rectW / targetW, scaleY = rectH / targetH;
    var deltaX = Math.round(rect.left - targetLeft), deltaY = Math.round(rect.top - targetTop);
    var reduced = Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (!reduced) view.style.transition = 'transform 0.36s cubic-bezier(0.16, 1, 0.3, 1)';
    view.style.transform = 'translate3d(' + deltaX + 'px, ' + deltaY + 'px, 0) scale(' + scaleX + ', ' + scaleY + ')';
    zoomOverlay.classList.remove('is-active');
    fig.classList.remove('is-zoomed-origin');
    document.body.style.overflow = '';
    activeZoomFig = null;
    setTimeout(function () {
      view.style.transition = 'none'; view.style.transform = '';
      try { fig.focus({ preventScroll: true }); } catch (err) {}
    }, reduced ? 20 : 380);
    return true;
  }

  function setupFigures() {
    var figs = document.querySelectorAll('figure.engine-figure, figure.band');
    Array.prototype.forEach.call(figs, function (fig) {
      if (!fig.getAttribute('tabindex')) fig.setAttribute('tabindex', '0');
      if (!fig.getAttribute('role')) fig.setAttribute('role', 'button');
      if (!fig.getAttribute('aria-label')) {
        var cap = fig.querySelector('figcaption');
        fig.setAttribute('aria-label', '点击全屏查看大图：' + (cap ? cap.textContent.trim() : '大图'));
      }
    });
  }

  function init() {
    startClock();
    runErpDemo(0);
    runSoloDemo(0);
    calculateROI();
    startLiveLog();
    setupFigures();
    initDelegation();
  }

  window.switchProductTab = switchProductTab;
  window.runErpDemo = runErpDemo;
  window.runSoloDemo = runSoloDemo;
  window.setRoiType = setRoiType;
  window.calculateROI = calculateROI;
  window.submitConsultForm = submitConsultForm;
  window.resetConsultForm = resetConsultForm;
  window.escapeHtml = escapeHtml;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
