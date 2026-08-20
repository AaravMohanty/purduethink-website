/* PurdueTHINK — page behaviour
   Shrink-on-scroll nav, accordion, scroll reveal, count-up stats.
   Plain DOM. No framework, no build step.
   Navigation is real URLs (one HTML file per page), so there is no view switching here. */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {

      const root = document.getElementById('ptk-root');
      const nav = document.getElementById('ptk-nav');
      const logo = nav ? nav.querySelector('[data-navlogo]') : null;
      if (!root) return;

      // ---- slim, shrink-on-scroll nav ----
      const onScroll = () => {
        const y = window.pageYOffset || document.documentElement.scrollTop || 0;
        if (!nav) return;
        if (y > 40) {
          Object.assign(nav.style, {
            padding: '12px 40px',
            background: '#0F1D33',
            borderBottom: '1px solid rgba(255,255,255,0.08)'
          });
          if (logo) logo.style.height = '26px';
        } else {
          Object.assign(nav.style, {
            padding: '22px 40px',
            background: 'transparent',
            borderBottom: '1px solid transparent'
          });
          if (logo) logo.style.height = '34px';
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();

      // ---- mobile nav toggle ----
      const navToggle = nav ? nav.querySelector('.ptk-navtoggle') : null;
      if (navToggle) {
        navToggle.addEventListener('click', () => {
          const open = nav.getAttribute('data-open') === '1';
          nav.setAttribute('data-open', open ? '0' : '1');
          navToggle.setAttribute('aria-expanded', open ? 'false' : 'true');
        });
        // close it when a link inside is followed
        nav.addEventListener('click', (e) => {
          if (e.target.closest('a')) {
            nav.setAttribute('data-open', '0');
            navToggle.setAttribute('aria-expanded', 'false');
          }
        });
      }

      // ---- member cards: tap to reveal the detail overlay (no hover on touch) ----
      if (window.matchMedia('(hover: none)').matches) {
        root.querySelectorAll('.ptk-person').forEach((card) => {
          card.addEventListener('click', (e) => {
            if (e.target.closest('a')) return;   // let the LinkedIn badge through
            card.setAttribute('data-show', card.getAttribute('data-show') === '1' ? '0' : '1');
          });
        });
      }

      // ---- accordion rows: data-acc on a button, panel is the sibling .ptk-acc-panel ----
      const setAcc = (btn, force) => {
        const panel = btn.parentElement.querySelector('.ptk-acc-panel');
        const chev = btn.querySelector('.ptk-acc-chev');
        if (!panel) return;
        const isOpen = panel.style.display !== 'none';
        const next = (force === true) ? true : !isOpen;
        panel.style.display = next ? 'block' : 'none';
        btn.setAttribute('aria-expanded', next ? 'true' : 'false');
        if (chev) chev.style.transform = next ? 'rotate(180deg)' : 'none';
      };

      root.addEventListener('click', (e) => {
        const a = e.target.closest('a, button');
        if (!a || !root.contains(a)) return;

        if (a.hasAttribute('data-acc')) {
          e.preventDefault();
          setAcc(a, null);
          return;
        }
        // same-page anchor scrolls; every other link navigates normally
        const href = a.getAttribute('href') || '';
        if (href.charAt(0) === '#' && href.length > 1) {
          const target = document.getElementById(href.slice(1));
          if (!target) return;
          e.preventDefault();
          window.scrollTo({ top: Math.max(0, target.offsetTop - 60), behavior: 'smooth' });
        }
      });

      // ---- counters + scroll reveal ----
      const fmt = (n) => Math.round(n).toLocaleString('en-US');
      const animate = (el) => {
        const target = parseFloat(el.getAttribute('data-count')) || 0;
        const pre = el.getAttribute('data-prefix') || '';
        const suf = el.getAttribute('data-suffix') || '';
        const dur = 1700;
        const t0 = performance.now();
        const step = (now) => {
          const t = Math.min(1, (now - t0) / dur);
          const e = 1 - Math.pow(1 - t, 3);
          el.textContent = pre + fmt(target * e) + suf;
          if (t < 1) requestAnimationFrame(step);
        };
        el.textContent = pre + '0' + suf;
        requestAnimationFrame(step);
      };

      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              const el = en.target;
              el.setAttribute('data-revealed', '1');
              if (el.hasAttribute('data-count')) animate(el);
              io.unobserve(el);
            }
          });
        }, { threshold: 0.2 });
        root.querySelectorAll('[data-reveal],[data-count]').forEach((el) => io.observe(el));
        // safety: reveal anything still hidden after 4.5s
        setTimeout(() => {
          root.querySelectorAll('[data-reveal]:not([data-revealed])').forEach((el) => el.setAttribute('data-revealed', '1'));
        }, 4500);
      } else {
        root.querySelectorAll('[data-reveal]').forEach((el) => el.setAttribute('data-revealed', '1'));
        root.querySelectorAll('[data-count]').forEach((el) => animate(el));
      }

  });
})();
