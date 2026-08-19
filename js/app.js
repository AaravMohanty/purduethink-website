/* PurdueTHINK — page behaviour
   View switching, shrink-on-scroll nav, accordion, scroll reveal.
   Plain DOM. No framework, no build step. */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {

      const root = document.getElementById('ptk-root');
      const nav = document.getElementById('ptk-nav');
      const logo = nav ? nav.querySelector('[data-navlogo]') : null;

      // ---- slim, shrink-on-scroll nav ----
      const onScroll = () => {
        const y = window.pageYOffset || document.documentElement.scrollTop || 0;
        if (!nav) return;
        if (y > 40) {
          Object.assign(nav.style, {
            padding: '12px 40px',
            background: '#0F1D33',
            backdropFilter: 'none',
            webkitBackdropFilter: 'none',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            boxShadow: 'none'
          });
          if (logo) logo.style.height = '26px';
        } else {
          Object.assign(nav.style, {
            padding: '22px 40px',
            background: 'transparent',
            backdropFilter: 'none',
            webkitBackdropFilter: 'none',
            borderBottom: '1px solid transparent',
            boxShadow: 'none'
          });
          if (logo) logo.style.height = '34px';
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      const _onScroll = onScroll;

      // ---- multi-view tabs (Home / Projects / People / Apply) ----
      const views = {
        home: document.getElementById('home'),
        projects: document.getElementById('projects'),
        people: document.getElementById('people'),
        apply: document.getElementById('apply'),
        consulting: document.getElementById('consulting'),
        interview: document.getElementById('interview')
      };
      const revealIn = (el) => {
        if (el) el.querySelectorAll('[data-reveal]:not([data-revealed])').forEach((n) => n.setAttribute('data-revealed', '1'));
      };
      const showView = (name, targetId) => {
        Object.keys(views).forEach((k) => { if (views[k]) views[k].style.display = (k === name) ? 'block' : 'none'; });
        revealIn(views[name]);
        onScroll();
        const t = targetId ? document.getElementById(targetId) : null;
        window.scrollTo({ top: t ? Math.max(0, t.offsetTop - 60) : 0, behavior: 'auto' });
      };
      const _showView = showView;
      const setApplyTab = (tab) => {
        if (tab !== 'interview') return;
        const el = document.getElementById('apply-interview');
        if (el) window.scrollTo({ top: Math.max(0, el.offsetTop - 40), behavior: 'auto' });
      };
      // open/close one accordion row; force === true always opens
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

      const onNavClick = (e) => {
        const a = e.target.closest('a, button');
        if (!a || !root.contains(a)) return;
        if (a.hasAttribute('data-acc')) {
          e.preventDefault();
          setAcc(a, null);
          return;
        }
        if (a.hasAttribute('data-openacc')) {
          e.preventDefault();
          const btn = document.getElementById(a.getAttribute('data-openacc'));
          if (btn) {
            setAcc(btn, true);
            const anchor = document.getElementById('proj-archive') || btn;
            window.scrollTo({ top: Math.max(0, anchor.offsetTop - 40), behavior: 'smooth' });
            btn.focus({ preventScroll: true });
          }
          return;
        }
        if (a.hasAttribute('data-home'))     { e.preventDefault(); showView('home'); return; }
        if (a.hasAttribute('data-projects')) { e.preventDefault(); showView('projects'); return; }
        if (a.hasAttribute('data-people'))   { e.preventDefault(); showView('people', a.getAttribute('data-target')); return; }
        if (a.hasAttribute('data-consulting')){ e.preventDefault(); showView('consulting'); return; }
        if (a.hasAttribute('data-interview')) { e.preventDefault(); showView('interview'); return; }
        if (a.hasAttribute('data-apply'))    { e.preventDefault(); showView('apply'); setApplyTab(a.getAttribute('data-subtab') || 'recruitment'); return; }
        // in-page anchor: scroll if the target is in the open view, otherwise switch to the view that owns it
        const href = a.getAttribute('href') || '';
        if (href.charAt(0) === '#' && href.length > 1) {
          const id = href.slice(1);
          const target = document.getElementById(id);
          if (!target) return;
          let owner = null;
          Object.keys(views).forEach((k) => {
            if (views[k] && (views[k] === target || views[k].contains(target))) owner = k;
          });
          e.preventDefault();
          if (owner && views[owner] && views[owner].style.display === 'none') showView(owner, id);
          else window.scrollTo({ top: Math.max(0, target.offsetTop - 60), behavior: 'smooth' });
        }
      };
      root.addEventListener('click', onNavClick);
      const _onNavClick = onNavClick;
      const firstAcc = root.querySelector('#acc-f25');
      if (firstAcc) setAcc(firstAcc, true);

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
        const _io = io;
        // safety: reveal anything still hidden after 4.5s
        const _fb = setTimeout(() => {
          root.querySelectorAll('[data-reveal]:not([data-revealed])').forEach((el) => el.setAttribute('data-revealed', '1'));
        }, 4500);
      } else {
        root.querySelectorAll('[data-reveal]').forEach((el) => el.setAttribute('data-revealed', '1'));
        root.querySelectorAll('[data-count]').forEach((el) => animate(el));
      }

  });
})();
