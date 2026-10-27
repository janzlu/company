/* =========================================================================
   YIRAN NEXUS · MOBILE NAVIGATION CONTROLLER
   Decoupled responsive drawer & toggle controller for brand, services, and en editions.
   ========================================================================= */
(function () {
  'use strict';

  var mobileMql = null;
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    mobileMql = window.matchMedia('(max-width: 1180px)');
  }

  function getElements() {
    var head = document.querySelector('.site-head') || document.getElementById('site-head');
    var toggle = document.querySelector('.head-menu-toggle') || document.getElementById('menu-toggle');
    var nav = document.querySelector('.head-nav') || document.getElementById('site-nav');
    return { head: head, toggle: toggle, nav: nav };
  }

  function isEnglishPage(toggle) {
    if (document.documentElement && document.documentElement.getAttribute('lang') === 'en') return true;
    if (toggle && toggle.getAttribute('data-lang') === 'en') return true;
    return false;
  }

  function setMobileNavOpen(open) {
    var els = getElements();
    if (!els.head || !els.toggle || !els.nav) return false;
    var isExpanded = Boolean(open);

    // Mutual exclusion: when opening mobile nav, close any active dossier panel
    if (isExpanded && window.NexusUI && typeof window.NexusUI.closeDossier === 'function') {
      var currentDossier = typeof window.NexusUI.getCurrent === 'function' ? window.NexusUI.getCurrent() : null;
      if (currentDossier) window.NexusUI.closeDossier(currentDossier);
    }

    els.toggle.setAttribute('aria-expanded', String(isExpanded));
    els.head.classList.toggle('nav-open', isExpanded);
    els.nav.classList.toggle('is-open', isExpanded);

    var isEn = isEnglishPage(els.toggle);
    var label = els.toggle.querySelector('.menu-label') || els.toggle.querySelector('.toggle-txt');
    if (label) {
      label.textContent = isExpanded ? (isEn ? 'Close' : '关闭') : (isEn ? 'Menu' : '目录');
    }

    if (isExpanded) {
      document.dispatchEvent(new CustomEvent('nexus:menu-open', { detail: { nav: els.nav } }));
    }
    return isExpanded;
  }

  function initMobileNav() {
    var els = getElements();
    if (!els.head || !els.toggle || !els.nav) return false;
    if (els.head._mobileNavInitialized) return true;
    els.head._mobileNavInitialized = true;

    function onToggleClick() {
      var currentlyOpen = els.toggle.getAttribute('aria-expanded') === 'true';
      setMobileNavOpen(!currentlyOpen);
    }

    function onNavClick(e) {
      var link = e.target && e.target.closest ? e.target.closest('a') : null;
      if (link) setMobileNavOpen(false);
    }

    function onDocClick(e) {
      if (els.head.classList.contains('nav-open') && !els.head.contains(e.target)) {
        setMobileNavOpen(false);
      }
    }

    function onDocKeydown(e) {
      if ((e.key === 'Escape' || e.key === 'Esc') && els.head.classList.contains('nav-open')) {
        e.preventDefault();
        setMobileNavOpen(false);
        try { els.toggle.focus({ preventScroll: true }); } catch (err) { els.toggle.focus(); }
      }
    }

    function onBreakpointChange(e) {
      if (!e.matches && els.head.classList.contains('nav-open')) {
        setMobileNavOpen(false);
      }
    }

    function onPanelOpen() {
      setMobileNavOpen(false);
    }

    els.toggle.addEventListener('click', onToggleClick);
    els.nav.addEventListener('click', onNavClick);
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onDocKeydown);
    document.addEventListener('nexus:panel-open', onPanelOpen);

    if (mobileMql) {
      if (typeof mobileMql.addEventListener === 'function') {
        mobileMql.addEventListener('change', onBreakpointChange);
      } else if (typeof mobileMql.addListener === 'function') {
        mobileMql.addListener(onBreakpointChange);
      }
    }

    els.head._mobileNavTeardown = function () {
      setMobileNavOpen(false);
      els.toggle.removeEventListener('click', onToggleClick);
      els.nav.removeEventListener('click', onNavClick);
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onDocKeydown);
      document.removeEventListener('nexus:panel-open', onPanelOpen);
      if (mobileMql) {
        if (typeof mobileMql.removeEventListener === 'function') {
          mobileMql.removeEventListener('change', onBreakpointChange);
        } else if (typeof mobileMql.removeListener === 'function') {
          mobileMql.removeListener(onBreakpointChange);
        }
      }
      els.head._mobileNavInitialized = false;
      delete els.head._mobileNavTeardown;
    };

    return true;
  }

  function destroyMobileNav() {
    var els = getElements();
    if (els.head && typeof els.head._mobileNavTeardown === 'function') {
      els.head._mobileNavTeardown();
      return true;
    }
    return false;
  }

  window.NexusMobileNav = {
    init: initMobileNav,
    setOpen: setMobileNavOpen,
    isOpen: function () {
      var els = getElements();
      return Boolean(els.head && els.head.classList.contains('nav-open') &&
        els.toggle && els.toggle.getAttribute('aria-expanded') === 'true');
    },
    destroy: destroyMobileNav
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNav);
  } else {
    initMobileNav();
  }
})();
