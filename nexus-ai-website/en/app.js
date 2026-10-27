/* ==========================================================================
   YIRAN NEXUS · EXECUTIVE ENGLISH EDITION
   Dual UTC/UTC+8 clock, ambient audio, hero particle canvas, robust clipboard
   ========================================================================== */

(function () {
  'use strict';

  // 1. Dual Timezone Clock (UTC & UTC+8)
  function initClock() {
    const clockEl = document.getElementById('live-clock');
    if (!clockEl) return;

    function formatTime(d) {
      const h = String(d.getUTCHours()).padStart(2, '0');
      const m = String(d.getUTCMinutes()).padStart(2, '0');
      const s = String(d.getUTCSeconds()).padStart(2, '0');
      return `${h}:${m}:${s}`;
    }

    function tick() {
      const now = new Date();
      const utcTime = formatTime(now);
      const cstDate = new Date(now.getTime() + 8 * 3600 * 1000);
      const cstTime = formatTime(cstDate);
      clockEl.textContent = `UTC ${utcTime} · UTC+8 ${cstTime}`;
    }

    tick();
    setInterval(tick, 1000);
  }

  // 2. Hero Background Canvas & Ambient Audio
  function initHeroMedia() {
    try {
      if (window.NexusUI && typeof window.NexusUI.initHeroCanvas === 'function') {
        window.NexusUI.initHeroCanvas('.hero-field');
      }
    } catch (err) {
      console.warn('Hero canvas initialization skipped:', err);
    }

    const audioBtn = document.getElementById('hero-audio-btn');
    const video = document.querySelector('.hero-bg-video');
    const audioTag = audioBtn ? audioBtn.querySelector('.audio-state-tag') : null;

    if (video) {
      if (video.hasAttribute('muted')) {
        video.muted = true;
      }
      if (audioBtn) {
        audioBtn.addEventListener('click', function (e) {
          e.preventDefault();
          const targetMuted = !video.muted;
          video.muted = targetMuted;
          if (!targetMuted && typeof video.play === 'function') {
            const playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
              playPromise.catch(function () {
                video.muted = true;
                syncAudioState(false);
              });
            }
          }
          syncAudioState(!video.muted);
        });

        function syncAudioState(isLive) {
          audioBtn.setAttribute('aria-pressed', String(isLive));
          if (audioTag) {
            audioTag.textContent = isLive ? 'AUDIO // LIVE' : 'AUDIO // MUTE';
          }
        }
      }
    }
  }

  // 3. Robust One-Click Copy with Accessibility & Race-Condition Guard
  function initCopyButtons() {
    const copyBtns = document.querySelectorAll('button[data-copy]');
    if (!copyBtns.length) return;

    let liveRegion = document.getElementById('copy-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'copy-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      liveRegion.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
      document.body.appendChild(liveRegion);
    }

    copyBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const textToCopy = btn.getAttribute('data-copy');
        if (!textToCopy) return;

        if (btn._resetTimer) {
          clearTimeout(btn._resetTimer);
          btn._resetTimer = null;
        }

        const originalText = btn.dataset.originalText || btn.textContent;
        btn.dataset.originalText = originalText;

        function setFeedback(feedbackText, isSuccess) {
          btn.textContent = feedbackText;
          btn.style.borderColor = isSuccess ? 'var(--accent)' : 'var(--hairline)';
          btn.style.color = isSuccess ? 'var(--accent)' : 'var(--ink-2)';
          if (liveRegion) {
            liveRegion.textContent = isSuccess ? `${textToCopy} copied to clipboard.` : `Failed to copy ${textToCopy}.`;
          }
          btn._resetTimer = setTimeout(function () {
            btn.textContent = originalText;
            btn.style.borderColor = '';
            btn.style.color = '';
            btn._resetTimer = null;
          }, 2000);
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(textToCopy)
            .then(function () { setFeedback('COPIED', true); })
            .catch(function () {
              fallbackCopy(textToCopy, setFeedback);
            });
        } else {
          fallbackCopy(textToCopy, setFeedback);
        }
      });
    });

    function fallbackCopy(text, feedbackCb) {
      let successful = false;
      const activeEl = document.activeElement;
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none;';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        successful = document.execCommand('copy');
      } catch (err) {
        successful = false;
      }
      document.body.removeChild(ta);
      if (activeEl && typeof activeEl.focus === 'function') {
        activeEl.focus();
      }
      if (successful) {
        feedbackCb('COPIED', true);
      } else {
        feedbackCb('FAILED', false);
      }
    }
  }

  // 4. Scroll Reveal Intersection Observer
  function initReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );

      reveals.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      reveals.forEach(function (el) {
        el.classList.add('is-visible');
      });
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  function run() {
    initClock();
    initHeroMedia();
    initCopyButtons();
    initReveal();
  }
})();
