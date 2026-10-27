/* =========================================================================
   YIRAN NEXUS · BRAND ISSUE RUNTIME
   Clock · intent routing · contact form · clipboard delegation
   ========================================================================= */
(function () {
  'use strict';

  function escapeHtml(value) {
    return window.NexusUI && window.NexusUI.escapeHtml
      ? window.NexusUI.escapeHtml(value)
      : String(value == null ? '' : value);
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
    } catch (err) {
      formatter = null;
    }
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

  function selectIntent(value) {
    if (!window.NexusUI) return false;
    window.NexusUI.openDossier('doc-contact', document.querySelector('[data-dossier="doc-contact"]'));
    var select = document.getElementById('intent-select');
    if (!select) return false;
    select.value = value;
    if (select.value !== value) {
      var option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
      select.value = value;
    }
    var form = document.getElementById('contact-form');
    var success = document.getElementById('contact-success');
    if (form) form.hidden = false;
    if (success) success.hidden = true;
    var brief = document.getElementById('contact-brief');
    var name = document.getElementById('contact-name');
    if (name && typeof name.focus === 'function') {
      try { name.focus({ preventScroll: true }); } catch (err) { name.focus(); }
    }
    return true;
  }

  function handleFormSubmit(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    var form = document.getElementById('contact-form');
    var success = document.getElementById('contact-success');
    var detail = document.getElementById('contact-success-detail');
    if (!form || !success || !detail) return false;

    var nameEl = document.getElementById('contact-name');
    var orgEl = document.getElementById('contact-org');
    var methodEl = document.getElementById('contact-method');
    var intentEl = document.getElementById('intent-select');
    var briefEl = document.getElementById('contact-brief');

    var name = escapeHtml(nameEl ? nameEl.value.trim() : '');
    var org = escapeHtml(orgEl ? orgEl.value.trim() : '');
    var method = escapeHtml(methodEl ? methodEl.value.trim() : '');
    var intent = escapeHtml(intentEl ? intentEl.value : '企业 AI+ERP 量身定制咨询');
    var brief = escapeHtml(briefEl ? briefEl.value.trim() : '');

    if (!name || !org || !method) {
      if (nameEl && !name) nameEl.focus();
      else if (orgEl && !org) orgEl.focus();
      else if (methodEl) methodEl.focus();
      return false;
    }

    detail.innerHTML = '尊敬的 <strong>' + name + '</strong>（' + org + '），我们已收到您关于 <strong>' + intent +
      '</strong> 的联络意图。' + (brief ? '命题简述已加密送达：<span style="color:var(--ink-3)">' + brief + '</span>。' : '') +
      '依然智枢创始与专家团队将于 12 小时内通过 <strong>' + method + '</strong> 与您直接对接。如需即时沟通，可拨打林经理专线 <strong>159-6841-4820</strong>（微信同号）。';

    form.hidden = true;
    success.hidden = false;
    var again = success.querySelector('[data-form-reset]');
    if (again && typeof again.focus === 'function') {
      try { again.focus({ preventScroll: true }); } catch (err) { again.focus(); }
    }
    return true;
  }

  function resetContactForm() {
    var form = document.getElementById('contact-form');
    var success = document.getElementById('contact-success');
    if (!form || !success) return false;
    form.reset();
    form.hidden = false;
    success.hidden = true;
    var name = document.getElementById('contact-name');
    if (name && typeof name.focus === 'function') {
      try { name.focus({ preventScroll: true }); } catch (err) { name.focus(); }
    }
    return true;
  }

  function initDelegation() {
    document.addEventListener('click', function (event) {
      var target = event.target;
      if (!target || !target.closest) return;

      var copyBtn = target.closest('[data-copy]');
      if (copyBtn) {
        event.preventDefault();
        if (window.NexusUI) window.NexusUI.copyText(copyBtn.getAttribute('data-copy'), copyBtn);
        return;
      }

      var intentBtn = target.closest('[data-select-intent]');
      if (intentBtn) {
        event.preventDefault();
        selectIntent(intentBtn.getAttribute('data-select-intent'));
        return;
      }

      var resetBtn = target.closest('[data-form-reset]');
      if (resetBtn) {
        event.preventDefault();
        resetContactForm();
      }
    });
  }

  window.selectIntent = selectIntent;
  window.handleFormSubmit = handleFormSubmit;
  window.resetContactForm = resetContactForm;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      startClock();
      initDelegation();
    });
  } else {
    startClock();
    initDelegation();
  }
})();
