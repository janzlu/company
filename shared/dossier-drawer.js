/* =========================================================================
   YIRAN NEXUS · DOSSIER DRAWER ENGINE + EDITORIAL AMBIENT LAYER
   Shared by the brand issue and the services issue via window.NexusUI.
   ========================================================================= */
(function () {
  'use strict';

  var registry = {};
  var orderedIds = [];
  var currentId = null;
  var lastTrigger = null;
  var els = null;
  var config = { contactId: null, contactLabel: '✉ 发起联络 // INITIATE' };
  var prefersReduced = safeMatch('(prefers-reduced-motion: reduce)');

  function safeMatch(query) {
    if (!window.matchMedia) return false;
    try { return window.matchMedia(query).matches; } catch (err) { return false; }
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function buildDrawer() {
    if (els) return;
    var backdrop = document.createElement('div');
    backdrop.className = 'dossier-backdrop';
    backdrop.id = 'dossier-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');

    var drawer = document.createElement('aside');
    drawer.id = 'dossier-drawer';
    drawer.className = 'dossier-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.setAttribute('aria-labelledby', 'dossier-title');
    drawer.innerHTML = [
      '<header class="dossier-head">',
      '  <div><p class="dossier-code" id="dossier-code">DOSSIER // 工业档案</p>',
      '  <p class="dossier-cat" id="dossier-category">档案索引</p></div>',
      '  <button type="button" class="dossier-close" id="dossier-close" aria-label="关闭档案（Esc 键）">ESC / 关闭 ×</button>',
      '</header>',
      '<div class="dossier-body" id="dossier-body">',
      '  <h2 class="dossier-title" id="dossier-title" tabindex="-1">工业档案</h2>',
      '  <p class="dossier-subtitle" id="dossier-subtitle"></p>',
      '  <div class="dossier-content" id="dossier-content"></div>',
      '</div>',
      '<footer class="dossier-foot">',
      '  <div class="dossier-step">',
      '    <button type="button" class="dossier-nav" id="dossier-prev">← 上一份档案</button>',
      '    <button type="button" class="dossier-nav" id="dossier-next">下一份档案 →</button>',
      '  </div>',
      '  <button type="button" class="dossier-nav is-contact" id="dossier-contact" hidden>✉ 发起联络 // INITIATE</button>',
      '</footer>'
    ].join('');

    document.body.appendChild(backdrop);
    document.body.appendChild(drawer);

    els = {
      backdrop: backdrop,
      drawer: drawer,
      code: drawer.querySelector('#dossier-code'),
      category: drawer.querySelector('#dossier-category'),
      title: drawer.querySelector('#dossier-title'),
      subtitle: drawer.querySelector('#dossier-subtitle'),
      content: drawer.querySelector('#dossier-content'),
      body: drawer.querySelector('#dossier-body'),
      close: drawer.querySelector('#dossier-close'),
      prev: drawer.querySelector('#dossier-prev'),
      next: drawer.querySelector('#dossier-next'),
      contact: drawer.querySelector('#dossier-contact')
    };

    els.close.addEventListener('click', closeDossier);
    els.backdrop.addEventListener('click', closeDossier);
    els.prev.addEventListener('click', function () { stepDossier(-1); });
    els.next.addEventListener('click', function () { stepDossier(1); });
    els.contact.addEventListener('click', function () {
      if (!config.contactId) return;
      openDossier(config.contactId, lastTrigger || els.contact);
    });
    document.addEventListener('keydown', onKeydown);
    window.addEventListener('hashchange', applyHash);
  }

  function onKeydown(event) {
    if (!currentId) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDossier();
      return;
    }
    if (event.key !== 'Tab') return;
    var focusables = els.drawer.querySelectorAll('a[href], button:not([disabled]):not([hidden]), input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function render(id) {
    var entry = registry[id];
    if (!entry) return false;
    currentId = id;
    els.code.textContent = entry.code || 'DOSSIER // 工业档案';
    els.category.textContent = entry.category || '档案索引';
    els.title.textContent = entry.title || '工业档案';
    els.subtitle.textContent = entry.subtitle || '';
    els.content.innerHTML = typeof entry.render === 'function' ? entry.render() : '';
    els.drawer.setAttribute('aria-hidden', 'false');
    els.body.scrollTop = 0;

    var index = orderedIds.indexOf(id);
    els.prev.disabled = index <= 0;
    els.next.disabled = index < 0 || index >= orderedIds.length - 1;
    els.contact.hidden = !config.contactId || id === config.contactId;
    els.contact.textContent = config.contactLabel;

    if (typeof entry.onMount === 'function') {
      try {
        entry.onMount(els.content);
      } catch (err) {
        if (window.console) console.error('[NexusUI] dossier mount failed:', err);
      }
    }
    return true;
  }

  function openDossier(id, triggerEl) {
    buildDrawer();
    if (!registry[id]) {
      if (window.console) console.warn('[NexusUI] unknown dossier:', id);
      return false;
    }
    var wasOpen = Boolean(currentId);
    if (triggerEl) lastTrigger = triggerEl;

    if (!wasOpen) {
      var scrollbar = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.setProperty('--sbw', Math.max(0, scrollbar) + 'px');
      document.body.classList.add('dossier-open');
      els.drawer.classList.add('is-open');
      els.backdrop.classList.add('is-open');
    }

    render(id);

    var focusKey = triggerEl && triggerEl.getAttribute ? triggerEl.getAttribute('data-dossier-focus') : '';
    if (focusKey) {
      var target = els.content.querySelector('[data-dossier-anchor="' + focusKey.replace(/"/g, '') + '"]');
      if (target && typeof target.scrollIntoView === 'function') {
        target.scrollIntoView({ block: 'start', behavior: prefersReduced ? 'auto' : 'smooth' });
      }
    }

    var hash = '#dossier=' + encodeURIComponent(id);
    if (window.location.hash !== hash) {
      try { window.history.replaceState(null, '', hash); } catch (err) { window.location.hash = hash; }
    }

    if (!wasOpen) {
      try { els.close.focus({ preventScroll: true }); } catch (err) { els.close.focus(); }
    }

    document.dispatchEvent(new CustomEvent('nexus:dossier-open', { detail: { id: id } }));
    return true;
  }

  function closeDossier() {
    if (!currentId) return;
    currentId = null;
    els.drawer.classList.remove('is-open');
    els.drawer.setAttribute('aria-hidden', 'true');
    els.backdrop.classList.remove('is-open');
    document.body.classList.remove('dossier-open');
    document.body.style.setProperty('--sbw', '0px');
    if (window.location.hash.indexOf('#dossier=') === 0) {
      try { window.history.replaceState(null, '', window.location.pathname + window.location.search); } catch (err) { window.location.hash = ''; }
    }
    if (lastTrigger && document.contains(lastTrigger)) {
      try { lastTrigger.focus({ preventScroll: true }); } catch (err) { lastTrigger.focus(); }
    }
    lastTrigger = null;
    document.dispatchEvent(new CustomEvent('nexus:dossier-close'));
  }

  function stepDossier(delta) {
    if (!currentId) return false;
    var index = orderedIds.indexOf(currentId);
    var nextIndex = index + delta;
    if (nextIndex < 0 || nextIndex >= orderedIds.length) return false;
    return openDossier(orderedIds[nextIndex], lastTrigger);
  }

  function applyHash() {
    var match = window.location.hash.match(/^#dossier=([A-Za-z0-9_-]+)/);
    if (match) {
      var id = decodeURIComponent(match[1]);
      if (registry[id] && id !== currentId) openDossier(id, null);
      return;
    }
    if (currentId) closeDossier();
  }

  function copyText(text, btn) {
    var value = String(text == null ? '' : text);
    var feedback = function () {
      if (!btn) return;
      if (!btn.dataset.originalHtml) btn.dataset.originalHtml = btn.innerHTML;
      btn.dataset.copied = 'true';
      btn.innerHTML = '<span>COPIED // ' + escapeHtml(value) + '</span>';
      window.clearTimeout(btn._copyTimer);
      btn._copyTimer = window.setTimeout(function () {
        if (btn.dataset.originalHtml) btn.innerHTML = btn.dataset.originalHtml;
        delete btn.dataset.copied;
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
    } else {
      fallback();
    }
  }

  function initAmbient() {
    var reveals = document.querySelectorAll('.reveal');
    if (prefersReduced || typeof window.IntersectionObserver !== 'function') {
      reveals.forEach(function (el) { el.classList.add('active'); });
    } else {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      reveals.forEach(function (el) { observer.observe(el); });
    }

    var head = document.querySelector('.site-head');
    if (head) {
      var onScroll = function () {
        head.classList.toggle('is-scrolled', window.scrollY > 32);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    if (!prefersReduced && safeMatch('(hover: hover) and (pointer: fine)')) {
      var glow = document.createElement('div');
      glow.className = 'cursor-glow';
      glow.setAttribute('aria-hidden', 'true');
      document.body.appendChild(glow);
      var targetX = window.innerWidth / 2;
      var targetY = window.innerHeight / 2;
      var glowX = targetX;
      var glowY = targetY;
      window.addEventListener('mousemove', function (event) {
        targetX = event.clientX;
        targetY = event.clientY;
        glow.classList.add('is-active');
      }, { passive: true });
      var tick = function () {
        glowX += (targetX - glowX) * 0.08;
        glowY += (targetY - glowY) * 0.08;
        glow.style.transform = 'translate3d(' + glowX + 'px, ' + glowY + 'px, 0)';
        window.requestAnimationFrame(tick);
      };
      if (window.requestAnimationFrame) window.requestAnimationFrame(tick);
    }

    document.addEventListener('click', function (event) {
      var trigger = event.target.closest ? event.target.closest('[data-dossier]') : null;
      if (!trigger) return;
      var id = trigger.getAttribute('data-dossier');
      if (!id) return;
      event.preventDefault();
      openDossier(id, trigger);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      var trigger = event.target.closest ? event.target.closest('[data-dossier]') : null;
      if (!trigger || /^(BUTTON|A)$/.test(trigger.tagName)) return;
      event.preventDefault();
      openDossier(trigger.getAttribute('data-dossier'), trigger);
    });
  }

  var NexusUI = {
    registerDossiers: function (nextRegistry, order, options) {
      registry = nextRegistry || {};
      orderedIds = (Array.isArray(order) ? order : Object.keys(registry)).filter(function (id) {
        return Boolean(registry[id]);
      });
      if (options && typeof options === 'object') {
        config.contactId = options.contactId || null;
        config.contactLabel = options.contactLabel || config.contactLabel;
      }
      buildDrawer();
      els.contact.textContent = config.contactLabel;
      els.contact.hidden = !config.contactId;
      applyHash();
    },
    openDossier: openDossier,
    closeDossier: closeDossier,
    stepDossier: stepDossier,
    escapeHtml: escapeHtml,
    copyText: copyText,
    getCurrent: function () { return currentId; },
    isOpen: function () { return Boolean(currentId); }
  };

  window.NexusUI = NexusUI;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAmbient);
  } else {
    initAmbient();
  }
})();
