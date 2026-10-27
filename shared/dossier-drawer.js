/* =========================================================================
   YIRAN NEXUS · INLINE TOGGLE ENGINE + HERO CANVAS
   Shared by the brand issue and the services issue via window.NexusUI.
   Panels open in place. No drawer. No body scroll lock.
   ========================================================================= */
(function () {
  'use strict';

  var registry = {};
  var orderedIds = [];
  var panelById = {};
  var triggerById = {};
  var openMap = {};
  var currentId = null;
  var config = { contactId: null, contactLabel: '✉ 发起联络' };
  var prefersReduced = safeMatch('(prefers-reduced-motion: reduce)');

  function safeMatch(query) {
    if (!window.matchMedia) return false;
    try { return window.matchMedia(query).matches; } catch (err) { return false; }
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function allTriggers() {
    return Array.prototype.slice.call(document.querySelectorAll('[data-toggle], [data-dossier]'));
  }

  function triggerValue(el) { return el.getAttribute('data-toggle') || el.getAttribute('data-dossier') || ''; }

  function findTriggers(id) {
    return allTriggers().filter(function (el) { return triggerValue(el) === id; });
  }

  function findPanel(id) {
    return panelById[id] || document.querySelector('[data-toggle-panel="' + id + '"]');
  }

  function defaultTrigger(id) {
    var list = findTriggers(id);
    return list.filter(function (el) { return !el.closest('[hidden]'); })[0] || null;
  }

  function syncTrigger(trigger, expanded, id) {
    if (!trigger) return;
    trigger.setAttribute('aria-expanded', String(expanded));
    trigger.classList.toggle('is-expanded', expanded);
    var panel = findPanel(id);
    if (panel && panel.id && !trigger.getAttribute('aria-controls')) trigger.setAttribute('aria-controls', panel.id);
    var icon = trigger.querySelector('.toggle-icon');
    if (icon) icon.textContent = expanded ? '−' : '+';
    var go = trigger.querySelector('.row-go');
    if (go) {
      if (!go.getAttribute('data-open-label')) go.setAttribute('data-open-label', go.textContent);
      var label = go.getAttribute('data-open-label');
      go.textContent = expanded ? label.replace(/^[+＋]\s*/, '− 收起 // ') : label;
    }
    var labelEl = trigger.querySelector('.toggle-label');
    if (labelEl) {
      if (!labelEl.getAttribute('data-open-label')) labelEl.setAttribute('data-open-label', labelEl.textContent);
      var text = labelEl.getAttribute('data-open-label');
      labelEl.textContent = expanded ? text.replace(/^[+＋]\s*/, '').replace(/^(展开|启动|查阅|填写)/, '收起') : text;
    }
    var cue = trigger.querySelector('[data-toggle-cue]');
    if (cue) {
      if (!cue.getAttribute('data-open-label')) cue.setAttribute('data-open-label', cue.textContent);
      cue.textContent = expanded ? (cue.getAttribute('data-expanded-label') || cue.getAttribute('data-open-label')) : cue.getAttribute('data-open-label');
    }
  }

  function syncTriggers(id) {
    var expanded = Boolean(openMap[id]);
    findTriggers(id).forEach(function (trigger) { syncTrigger(trigger, expanded, id); });
  }

  function setHash(id, open) {
    if (!window.history || !history.replaceState) return;
    var hash = '#dossier=' + encodeURIComponent(id);
    try {
      if (open && location.hash !== hash) history.replaceState(null, '', hash);
      else if (!open && location.hash.indexOf('#dossier=') === 0) history.replaceState(null, '', location.pathname + location.search);
    } catch (err) { /* file:// still supports hash writes in all target browsers */ }
  }

  function buildPanel(id, entry, panel) {
    var safeId = escapeHtml(id);
    var html = '<div class="toggle-inner">' +
      '<header class="toggle-head">' +
      '<div class="toggle-meta"><p class="toggle-code">' + escapeHtml(entry.code || 'NEXUS // 档案') + '</p>' +
      '<p class="toggle-cat">' + escapeHtml(entry.category || '工业档案') + '</p></div>' +
      '<button type="button" class="toggle-close" data-toggle-close="' + safeId + '" aria-label="收起当前面板">收起面板 ×</button>' +
      '</header>' +
      '<h2 class="toggle-title">' + escapeHtml(entry.title || '工业档案') + '</h2>' +
      (entry.subtitle ? '<p class="toggle-subtitle">' + escapeHtml(entry.subtitle) + '</p>' : '') +
      '<div class="dossier-content">' + (typeof entry.render === 'function' ? entry.render() : '') + '</div>' +
      '<footer class="toggle-foot">' +
      '<button type="button" class="toggle-back" data-toggle-close="' + safeId + '">↑ 收起详情</button>' +
      '<div class="toggle-foot-right">' +
      (config.contactId && config.contactId !== id ? '<button type="button" class="toggle-jump" data-toggle-jump="' + escapeHtml(config.contactId) + '">' + escapeHtml(config.contactLabel) + '</button>' : '') +
      '<span class="toggle-note">ESC 亦可收起 · 原位阅读不打断上下文</span>' +
      '</div></footer></div>';
    panel.innerHTML = html;
    if (typeof entry.onMount === 'function') {
      try { entry.onMount(panel); } catch (err) {
        if (window.console) console.error('[NexusUI] panel mount failed:', err);
      }
    }
  }

  function mountAll() {
    openMap = {};
    currentId = null;
    orderedIds.forEach(function (id) {
      var entry = registry[id];
      var panel = findPanel(id);
      if (!entry || !panel) { if (window.console) console.warn('[NexusUI] missing panel for:', id); return; }
      panelById[id] = panel;
      panel.hidden = true;
      panel.classList.remove('is-open');
      panel.setAttribute('aria-hidden', 'true');
      if (!panel.getAttribute('role')) panel.setAttribute('role', 'region');
      try { buildPanel(id, entry, panel); panel.setAttribute('data-rendered', 'true'); }
      catch (err) { if (window.console) console.error('[NexusUI] panel render failed:', id, err); }
      syncTriggers(id);
    });
    allTriggers().forEach(function (trigger) {
      var id = triggerValue(trigger);
      if (!id) return;
      var panel = findPanel(id);
      if (panel && panel.id) trigger.setAttribute('aria-controls', panel.id);
      if (!trigger.hasAttribute('aria-expanded')) trigger.setAttribute('aria-expanded', 'false');
    });
  }

  function scrollPanelIntoView(panel, trigger) {
    if (!panel || typeof panel.scrollIntoView !== 'function') return;
    var rect = panel.getBoundingClientRect ? panel.getBoundingClientRect() : null;
    var vh = window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || 800;
    var needsScroll = !rect;
    if (rect) needsScroll = rect.top < 84 || rect.top > vh - 96;
    if (trigger && rect) {
      var triggerRect = trigger.getBoundingClientRect ? trigger.getBoundingClientRect() : null;
      if (triggerRect && Math.abs(triggerRect.top - rect.top) > vh * 0.85) needsScroll = true;
    }
    if (needsScroll) { try { panel.scrollIntoView({ block: 'start', behavior: prefersReduced ? 'auto' : 'smooth' }); } catch (err) { panel.scrollIntoView(); } }
  }

  function focusAnchor(panel, trigger) {
    if (!trigger || !trigger.getAttribute) return;
    var key = trigger.getAttribute('data-dossier-focus');
    if (!key) return;
    var target = panel.querySelector('[data-dossier-anchor="' + key.replace(/"/g, '') + '"]');
    if (target && typeof target.scrollIntoView === 'function') {
      try { target.scrollIntoView({ block: 'start', behavior: prefersReduced ? 'auto' : 'smooth' }); } catch (err) { target.scrollIntoView(); }
    }
  }

  function openDossier(id, triggerEl) {
    var entry = registry[id];
    var panel = findPanel(id);
    if (!entry || !panel) {
      if (window.console) console.warn('[NexusUI] unknown panel:', id);
      return false;
    }
    panelById[id] = panel;
    if (!panel.getAttribute('data-rendered')) buildPanel(id, entry, panel);
    var already = Boolean(openMap[id]);
    if (triggerEl) triggerById[id] = triggerEl;
    else if (!triggerById[id]) triggerById[id] = defaultTrigger(id);
    openMap[id] = true;
    currentId = id;
    panel.hidden = false;
    panel.removeAttribute('hidden');
    panel.setAttribute('aria-hidden', 'false');
    panel.classList.add('is-open');
    syncTriggers(id);
    setHash(id, true);
    if (triggerEl && triggerEl.getAttribute && triggerEl.getAttribute('data-dossier-focus')) {
      focusAnchor(panel, triggerEl);
    } else {
      scrollPanelIntoView(panel, triggerEl);
    }
    if (!already) {
      document.dispatchEvent(new CustomEvent('nexus:panel-open', { detail: { id: id, panel: panel } }));
    }
    return true;
  }

  function clearHash(id) {
    if (window.history && history.replaceState) {
      try {
        if (location.hash === '#dossier=' + encodeURIComponent(id)) history.replaceState(null, '', location.pathname + location.search);
      } catch (err) {}
    }
  }

  function closeDossier(id, skipFocus) {
    var targetId = id || currentId;
    if (!targetId || !openMap[targetId]) return false;
    var panel = findPanel(targetId);
    if (panel) {
      panel.hidden = true;
      panel.setAttribute('aria-hidden', 'true');
      panel.classList.remove('is-open');
    }
    delete openMap[targetId];
    syncTriggers(targetId);
    clearHash(targetId);
    if (currentId === targetId) {
      currentId = null;
      for (var i = orderedIds.length - 1; i >= 0; i -= 1) {
        if (openMap[orderedIds[i]]) { currentId = orderedIds[i]; break; }
      }
    }
    var trigger = triggerById[targetId];
    if (!skipFocus && trigger && document.contains(trigger)) {
      try { trigger.focus({ preventScroll: true }); } catch (err) { trigger.focus(); }
    }
    document.dispatchEvent(new CustomEvent('nexus:dossier-close', { detail: { id: targetId } }));
    return true;
  }

  function toggleDossier(id, triggerEl) {
    return openMap[id] ? (closeDossier(id), false) : openDossier(id, triggerEl);
  }

  function stepDossier(delta) {
    if (!orderedIds.length) return false;
    var index = currentId ? orderedIds.indexOf(currentId) : -1;
    var next = index < 0 ? (delta > 0 ? 0 : orderedIds.length - 1) : index + (delta > 0 ? 1 : -1);
    if (next < 0 || next >= orderedIds.length) return false;
    if (currentId) closeDossier(currentId, true);
    var opened = openDossier(orderedIds[next], triggerById[orderedIds[next]] || null);
    if (opened) { try { triggerById[orderedIds[next]].focus({ preventScroll: true }); } catch (err) {} }
    return opened;
  }

  function applyHash() {
    var match = location.hash.match(/^#(?:dossier|panel)=([A-Za-z0-9_-]+)/);
    if (!match) return;
    var id = decodeURIComponent(match[1]);
    if (registry[id] && !openMap[id]) openDossier(id, triggerById[id] || defaultTrigger(id));
  }

  function onKeydown(event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
      var active = document.activeElement;
      var panel = active && active.closest ? active.closest('[data-toggle-panel]') : null;
      var id = panel ? panel.getAttribute('data-toggle-panel') : currentId;
      if (id && openMap[id]) {
        event.preventDefault();
        closeDossier(id);
      }
      return;
    }
    if (event.key !== 'Enter' && event.key !== ' ') return;
    var trigger = event.target && event.target.closest ? event.target.closest('[data-toggle], [data-dossier]') : null;
    if (!trigger || /^(BUTTON|A|INPUT|SELECT|TEXTAREA)$/.test(trigger.tagName)) return;
    event.preventDefault();
    toggleDossier(triggerValue(trigger), trigger);
  }

  function onClick(event) {
    var target = event.target;
    if (!target || !target.closest) return;
    var closer = target.closest('[data-toggle-close]');
    if (closer) {
      event.preventDefault();
      closeDossier(closer.getAttribute('data-toggle-close'));
      return;
    }
    var jump = target.closest('[data-toggle-jump]');
    if (jump) {
      event.preventDefault();
      var jumpId = jump.getAttribute('data-toggle-jump');
      openDossier(jumpId, null);
      var jumpPanel = findPanel(jumpId);
      var closeBtn = jumpPanel && jumpPanel.querySelector('.toggle-close');
      if (closeBtn) { try { closeBtn.focus({ preventScroll: true }); } catch (err) { closeBtn.focus(); } }
      return;
    }
    var trigger = target.closest('[data-toggle], [data-dossier]');
    if (!trigger) return;
    var id = triggerValue(trigger);
    if (!id) return;
    event.preventDefault();
    toggleDossier(id, trigger);
  }

  /* ------------------------------------------------------------ canvas */
  function initOneCanvas(canvas) {
    if (!canvas || canvas.getAttribute('data-canvas-ready') === 'true') return false;
    var ctx = null;
    try { if (typeof canvas.getContext === 'function') ctx = canvas.getContext('2d'); } catch (err) { ctx = null; }
    if (!ctx) return false;
    try {
      if (typeof window.NexusCustomHero === 'function' && window.NexusCustomHero(canvas, ctx, prefersReduced)) {
        canvas.setAttribute('data-canvas-ready', 'true'); return true;
      }
    } catch (e) { /* fallback */ }
    canvas.setAttribute('data-canvas-ready', 'true');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var width = canvas.clientWidth || canvas.parentElement && canvas.parentElement.clientWidth || 1280;
    var height = canvas.clientHeight || canvas.parentElement && canvas.parentElement.clientHeight || 720;
    var nodes = [];
    var seed = 20150115;
    function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
    function resize() {
      width = canvas.clientWidth || width;
      height = canvas.clientHeight || height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    for (var i = 0; i < 54; i += 1) {
      nodes.push({ x: rnd() * width, y: rnd() * height, r: 0.5 + rnd() * 1.5, vx: (rnd() - 0.5) * 0.14, vy: (rnd() - 0.5) * 0.12, warm: rnd() > 0.55 });
    }
    var mouse = { x: width * 0.7, y: height * 0.45, active: false };
    function drawFrame(time) {
      var cx = width * 0.68;
      var cy = height * 0.45;
      var pulse = prefersReduced ? 0 : Math.sin(time * 0.00045) * 0.5 + 0.5;
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.27);
      for (var ring = 0; ring < 3; ring += 1) {
        var rx = width * (0.24 + ring * 0.1);
        var ry = height * (0.085 + ring * 0.042);
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = ring === 1 ? 'rgba(217,180,131,' + (0.16 + pulse * 0.12) + ')' : 'rgba(159,216,255,' + (0.11 + pulse * 0.09) + ')';
        ctx.lineWidth = 1;
        ctx.stroke();
        var angle = time * 0.00006 * (ring % 2 ? -1 : 1) + ring * 1.7;
        var px = Math.cos(angle) * rx;
        var py = Math.sin(angle) * ry;
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = ring === 1 ? 'rgba(217,180,131,.9)' : 'rgba(159,216,255,.8)';
        ctx.fill();
      }
      ctx.restore();
      ctx.save();
      ctx.translate(width * 0.2, height * 0.6);
      ctx.rotate(-0.4);
      ctx.beginPath();
      ctx.ellipse(0, 0, width * 0.22, height * 0.12, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(234,230,220,.055)';
      ctx.stroke();
      ctx.restore();
      nodes.forEach(function (node) {
        if (!prefersReduced) {
          node.x += node.vx;
          node.y += node.vy;
          if (mouse.active) {
            var dx = node.x - mouse.x;
            var dy = node.y - mouse.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0.1 && dist < 170) {
              node.x += (dx / dist) * 0.22;
              node.y += (dy / dist) * 0.22;
            }
          }
          if (node.x < -10) node.x = width + 10;
          if (node.x > width + 10) node.x = -10;
          if (node.y < -10) node.y = height + 10;
          if (node.y > height + 10) node.y = -10;
        }
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fillStyle = node.warm ? 'rgba(217,180,131,.38)' : 'rgba(159,216,255,.32)';
        ctx.fill();
      });
    }
    resize();
    drawFrame(0);
    if (!prefersReduced && typeof window.requestAnimationFrame === 'function') {
      var tick = function (time) {
        drawFrame(time || 0);
        window.requestAnimationFrame(tick);
      };
      window.requestAnimationFrame(tick);
    }
    window.addEventListener('resize', function () {
      resize();
      drawFrame(window.performance && window.performance.now ? window.performance.now() : 0);
    }, { passive: true });
    canvas.addEventListener('mousemove', function (event) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
      mouse.active = true;
    }, { passive: true });
    canvas.addEventListener('mouseleave', function () { mouse.active = false; }, { passive: true });
    return true;
  }

  function initHeroCanvas(selector) {
    var canvases = document.querySelectorAll(selector || '.hero-field');
    if (!canvases.length) return false;
    var ready = false;
    Array.prototype.forEach.call(canvases, function (canvas) { ready = initOneCanvas(canvas) || ready; });
    return ready;
  }

  function initAmbient() {
    var reveals = document.querySelectorAll('.reveal');
    if (prefersReduced || typeof window.IntersectionObserver !== 'function') {
      Array.prototype.forEach.call(reveals, function (el) { el.classList.add('active'); });
    } else {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add('active'); observer.unobserve(entry.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      Array.prototype.forEach.call(reveals, function (el) { observer.observe(el); });
    }
    var head = document.querySelector('.site-head');
    if (head) {
      var onScroll = function () { head.classList.toggle('is-scrolled', window.scrollY > 32); };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeydown);
    window.addEventListener('hashchange', applyHash);
    initHeroCanvas('.hero-field');
    applyHash();
  }

  function copyText(text, btn) {
    var value = String(text == null ? '' : text);
    var feedback = function () {
      if (!btn) return;
      if (!btn.getAttribute('data-original-html')) btn.setAttribute('data-original-html', btn.innerHTML);
      btn.setAttribute('data-copied', 'true');
      btn.innerHTML = '<span>COPIED // ' + escapeHtml(value) + '</span>';
      window.clearTimeout(btn._copyTimer);
      btn._copyTimer = window.setTimeout(function () {
        btn.innerHTML = btn.getAttribute('data-original-html') || 'COPY';
        btn.removeAttribute('data-copied');
      }, 2200);
    };
    var fallback = function () {
      try {
        var area = document.createElement('textarea');
        area.value = value;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        if (document.execCommand) document.execCommand('copy');
        area.remove();
      } catch (err) {
        if (window.console) console.warn('[NexusUI] clipboard fallback unavailable');
      }
      feedback();
    };
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(value).then(feedback, fallback);
    } else { fallback(); }
  }

  window.NexusUI = {
    registerDossiers: function (nextRegistry, order, options) {
      registry = nextRegistry || {};
      orderedIds = (Array.isArray(order) ? order : Object.keys(registry)).filter(function (id) { return Boolean(registry[id]); });
      if (options && typeof options === 'object') {
        config.contactId = options.contactId || null;
        config.contactLabel = options.contactLabel || config.contactLabel;
      }
      if (document.body) mountAll();
      else document.addEventListener('DOMContentLoaded', mountAll, { once: true });
    },
    toggleDossier: toggleDossier,
    openDossier: openDossier,
    closeDossier: closeDossier,
    stepDossier: stepDossier,
    initHeroCanvas: initHeroCanvas,
    escapeHtml: escapeHtml,
    copyText: copyText,
    getCurrent: function () { return currentId; },
    isOpen: function (id) { return id ? Boolean(openMap[id]) : Boolean(currentId); }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAmbient);
  } else {
    initAmbient();
  }
})();
