/* =========================================================================
   YIRAN NEXUS · BRAND ISSUE RUNTIME
   Clock · real-day role switch · intent routing · contact form · image zoom
   ========================================================================= */
(function () {
  'use strict';

  function escapeHtml(value) {
    if (window.NexusUI && window.NexusUI.escapeHtml) return window.NexusUI.escapeHtml(value);
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function startClock() {
    var el = document.getElementById('live-clock');
    if (!el) return;
    var formatter = null;
    try {
      formatter = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    } catch (err) { formatter = null; }
    var tick = function () {
      var now = new Date(), text;
      if (formatter) { text = formatter.format(now); } else {
        var s = new Date(now.getTime() + (now.getTimezoneOffset() + 480) * 60000);
        text = [s.getHours(), s.getMinutes(), s.getSeconds()].map(function (n) { return String(n).padStart(2, '0'); }).join(':');
      }
      el.textContent = 'UTC+8 ' + text;
    };
    tick(); window.setInterval(tick, 1000);
  }

  function switchStoryRole(role) {
    var next = role === 'solo' ? 'solo' : 'erp', tabs = document.querySelectorAll('[data-story-role]'), panels = document.querySelectorAll('.day-panel');
    if (!tabs.length || !panels.length) return false;
    Array.prototype.forEach.call(tabs, function (t) { var a = t.getAttribute('data-story-role') === next; t.setAttribute('aria-selected', String(a)); t.setAttribute('tabindex', a ? '0' : '-1'); });
    Array.prototype.forEach.call(panels, function (p) { var a = p.id === 'story-' + next; p.hidden = !a; p.setAttribute('aria-hidden', String(!a)); });
    document.dispatchEvent(new CustomEvent('nexus:story-role', { detail: { role: next } }));
    return true;
  }

  function selectIntent(value) {
    if (!window.NexusUI) return false;
    var trigger = document.querySelector('[data-toggle="doc-contact"]') || document.querySelector('[data-dossier="doc-contact"]');
    window.NexusUI.openDossier('doc-contact', trigger);
    var select = document.getElementById('intent-select');
    if (!select) return false;
    select.value = value;
    if (select.value !== value) {
      var opt = document.createElement('option'); opt.value = value; opt.textContent = value;
      select.appendChild(opt); select.value = value;
    }
    var form = document.getElementById('contact-form'), success = document.getElementById('contact-success');
    if (form) form.hidden = false; if (success) success.hidden = true;
    var name = document.getElementById('contact-name');
    if (name && typeof name.focus === 'function') { try { name.focus({ preventScroll: true }); } catch (err) { name.focus(); } }
    return true;
  }

  function handleFormSubmit(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    var form = document.getElementById('contact-form'), success = document.getElementById('contact-success'), detail = document.getElementById('contact-success-detail');
    if (!form || !success || !detail) return false;
    var nameEl = document.getElementById('contact-name'), orgEl = document.getElementById('contact-org'), methodEl = document.getElementById('contact-method');
    var intentEl = document.getElementById('intent-select'), briefEl = document.getElementById('contact-brief');
    var name = escapeHtml(nameEl ? nameEl.value.trim() : ''), org = escapeHtml(orgEl ? orgEl.value.trim() : '');
    var method = escapeHtml(methodEl ? methodEl.value.trim() : ''), intent = escapeHtml(intentEl ? intentEl.value : '企业 AI+ERP 量身定制咨询');
    var briefLine = escapeHtml(briefEl ? briefEl.value.trim().replace(/[。．.；;，,\s]+$/, '') : '');
    if (!name || !org || !method) {
      if (nameEl && !name) nameEl.focus(); else if (orgEl && !org) orgEl.focus(); else if (methodEl) methodEl.focus();
      return false;
    }
    detail.innerHTML = '尊敬的 <strong>' + name + '</strong>（' + org + '），我们已收到您关于 <strong>' + intent +
      '</strong> 的联络意图。' + (briefLine ? '命题简述已加密送达：<span style="color:var(--ink-3)">' + briefLine + '</span>。' : '') +
      '依然智枢创始与专家团队将于 12 小时内通过 <strong>' + method + '</strong> 与您直接对接。如需即时沟通，可拨打林经理专线 <strong>159-6841-4820</strong>（微信同号）。';
    form.hidden = true; success.hidden = false;
    var again = success.querySelector('[data-form-reset]');
    if (again && typeof again.focus === 'function') { try { again.focus({ preventScroll: true }); } catch (err) { again.focus(); } }
    return true;
  }

  function resetContactForm() {
    var form = document.getElementById('contact-form'), success = document.getElementById('contact-success');
    if (!form || !success) return false;
    form.reset(); form.hidden = false; success.hidden = true;
    var name = document.getElementById('contact-name');
    if (name && typeof name.focus === 'function') { try { name.focus({ preventScroll: true }); } catch (err) { name.focus(); } }
    return true;
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

  function initDelegation() {
    document.addEventListener('click', function (event) {
      var target = event.target;
      if (!target || !target.closest) return;
      var zoomClose = target.closest('.image-zoom-overlay');
      if (zoomClose) { event.preventDefault(); closeImageZoom(); return; }
      var fig = target.closest('figure.engine-figure, figure.band');
      if (fig && !activeZoomFig && !fig.closest('.toggle-panel')) { event.preventDefault(); openImageZoom(fig); return; }
      var storyBtn = target.closest('[data-story-role]');
      if (storyBtn) { event.preventDefault(); switchStoryRole(storyBtn.getAttribute('data-story-role')); return; }
      var audioBtn = target.closest('#hero-audio-btn');
      if (audioBtn) {
        event.preventDefault();
        var vid = document.querySelector('.hero-bg-video');
        if (vid) {
          vid.muted = !vid.muted; var live = !vid.muted; audioBtn.setAttribute('aria-pressed', String(live));
          var tag = audioBtn.querySelector('.audio-state-tag'); if (tag) tag.textContent = live ? 'AUDIO // 44kHz' : 'AUDIO // MUTE';
        }
        return;
      }
      var copyBtn = target.closest('[data-copy]');
      if (copyBtn) { event.preventDefault(); if (window.NexusUI) window.NexusUI.copyText(copyBtn.getAttribute('data-copy'), copyBtn); return; }
      var intentBtn = target.closest('[data-select-intent]');
      if (intentBtn) { event.preventDefault(); selectIntent(intentBtn.getAttribute('data-select-intent')); return; }
      var resetBtn = target.closest('[data-form-reset]');
      if (resetBtn) { event.preventDefault(); resetContactForm(); }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && activeZoomFig) { event.preventDefault(); event.stopPropagation(); closeImageZoom(); return; }
      var target = event.target;
      if (!target || !target.closest) return;
      var fig = target.closest('figure.engine-figure, figure.band');
      if (fig && !fig.closest('.toggle-panel') && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        if (activeZoomFig) closeImageZoom(); else openImageZoom(fig);
        return;
      }
      var tab = target.closest('[data-story-role]');
      if (!tab || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
      event.preventDefault();
      var next = tab.getAttribute('data-story-role') === 'erp' ? 'solo' : 'erp';
      switchStoryRole(next);
      var nextTab = document.querySelector('[data-story-role="' + next + '"]');
      if (nextTab) try { nextTab.focus({ preventScroll: true }); } catch (err) { nextTab.focus(); }
    });

    document.addEventListener('submit', function (event) {
      if (event.target && event.target.id === 'contact-form') handleFormSubmit(event);
    });
  }

  function initCyberScanMatrix(canvas, ctx, prefersReduced) {
    if (!canvas || !ctx || !canvas.closest || !canvas.closest('.brand-hero')) return false;
    var required = ['beginPath', 'arc', 'stroke', 'fill', 'clearRect'];
    for (var q = 0; q < required.length; q += 1) { if (typeof ctx[required[q]] !== 'function') return false; }
    if (!ctx.moveTo) ctx.moveTo = function () {};
    if (!ctx.lineTo) ctx.lineTo = function () {};

    var dpr = Math.min(window.devicePixelRatio || 1, 2), width = 1280, height = 720, lastTime = null;
    var mouse = { x: -1000, y: -1000, active: false };
    var crosshairs = [
      { rx: 0.18, ry: 0.22, warm: false }, { rx: 0.82, ry: 0.18, warm: true },
      { rx: 0.32, ry: 0.78, warm: false }, { rx: 0.76, ry: 0.82, warm: false }, { rx: 0.54, ry: 0.42, warm: true }
    ];
    var nodes = [
      { rx: 0.14, ry: 0.38, phase: 0.0, warm: false }, { rx: 0.26, ry: 0.62, phase: 1.4, warm: true },
      { rx: 0.66, ry: 0.28, phase: 2.1, warm: false }, { rx: 0.86, ry: 0.58, phase: 0.8, warm: false },
      { rx: 0.94, ry: 0.36, phase: 3.2, warm: true },  { rx: 0.46, ry: 0.86, phase: 1.9, warm: false }
    ];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth || (canvas.parentElement && canvas.parentElement.clientWidth) || 1280;
      height = canvas.clientHeight || (canvas.parentElement && canvas.parentElement.clientHeight) || 720;
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      if (typeof ctx.setTransform === 'function') ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function render(time, advance) {
      if (advance) lastTime = time;
      ctx.clearRect(0, 0, width, height);

      var clen = 4;
      for (var c = 0; c < crosshairs.length; c += 1) {
        var ch = crosshairs[c], cx = width * ch.rx, cy = height * ch.ry;
        ctx.beginPath(); ctx.moveTo(cx - clen, cy); ctx.lineTo(cx + clen, cy);
        ctx.moveTo(cx, cy - clen); ctx.lineTo(cx, cy + clen);
        ctx.strokeStyle = ch.warm ? 'rgba(217, 180, 131, 0.26)' : 'rgba(159, 216, 255, 0.20)';
        ctx.lineWidth = 1; ctx.stroke();
      }

      var now = (time || 0) * 0.003;
      for (var n = 0; n < nodes.length; n += 1) {
        var node = nodes[n], nx = width * node.rx, ny = height * node.ry;
        var breath = prefersReduced ? 0.35 : (Math.sin(now + node.phase) * 0.28 + 0.42);
        ctx.beginPath(); ctx.arc(nx, ny, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = node.warm ? 'rgba(217, 180, 131, ' + breath + ')' : 'rgba(159, 216, 255, ' + breath + ')';
        ctx.fill();
      }

      if (!prefersReduced && mouse.active) {
        ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 16, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(159, 216, 255, 0.16)'; ctx.lineWidth = 1; ctx.stroke();
      }
    }

    resize(); render(0, false);
    if (!prefersReduced && typeof window.requestAnimationFrame === 'function') {
      var frame = function (t) { render(t || 0, true); window.requestAnimationFrame(frame); };
      window.requestAnimationFrame(frame);
    }
    window.addEventListener('resize', function () { resize(); render(lastTime || 0, false); }, { passive: true });
    canvas.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect(); mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top; mouse.active = true;
    }, { passive: true });
    canvas.addEventListener('mouseleave', function () { mouse.active = false; }, { passive: true });
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
    switchStoryRole('erp');
    setupFigures();
    initDelegation();
  }

  window.NexusCustomHero = initCyberScanMatrix;
  window.switchStoryRole = switchStoryRole;
  window.selectIntent = selectIntent;
  window.handleFormSubmit = handleFormSubmit;
  window.resetContactForm = resetContactForm;
  window.openImageZoom = openImageZoom;
  window.closeImageZoom = closeImageZoom;

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
