/* ============================================================
   Geethma Dias — Portfolio interactions
   Vanilla JS, no dependencies. Motion-aware & performant.
   ============================================================ */
(() => {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // Mark that JS is active so CSS can safely hide pre-animation states.
  document.documentElement.classList.add('js');

  /* ---------- Preloader ---------- */
  const loader = $('#loader');
  const countEl = $('#loaderCount');
  const barEl = $('#loaderBar');

  function reveal(instant) {
    document.body.classList.add('loaded');
    const lines = $$('.hero__title .line');
    if (instant) { lines.forEach(l => l.classList.add('in')); return; }
    // kick the hero title in, staggered
    requestAnimationFrame(() => lines.forEach((l, i) => {
      setTimeout(() => l.classList.add('in'), 150 + i * 90);
    }));
  }

  function runLoader() {
    // Skip the intro for reduced-motion users, and for static snapshots/link previews (?still).
    const skip = reduce || new URLSearchParams(location.search).has('still');
    if (skip) { if (loader) loader.remove(); reveal(true); return; }
    let p = 0;
    const tick = () => {
      p += Math.max(1, (100 - p) * 0.06) + Math.random() * 3;
      if (p >= 100) p = 100;
      if (countEl) countEl.textContent = Math.floor(p);
      if (barEl) barEl.style.width = p + '%';
      if (p < 100) { setTimeout(tick, 90 + Math.random() * 80); }
      else { setTimeout(reveal, 350); }
    };
    tick();
  }
  if (document.readyState === 'complete') runLoader();
  else window.addEventListener('load', runLoader);
  // safety: never trap the user
  setTimeout(() => { if (!document.body.classList.contains('loaded')) reveal(); }, 6000);

  /* ---------- Wrap reveal-lines into line spans ---------- */
  $$('[data-reveal-lines]').forEach(el => {
    const text = el.textContent.trim();
    el.innerHTML = `<span class="rline"><span>${text}</span></span>`;
  });

  /* ---------- IntersectionObserver reveals ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  $$('[data-reveal], [data-reveal-lines]').forEach(el => io.observe(el));

  /* ---------- Count-up stats ---------- */
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      if (reduce) { el.textContent = target + suffix; countIO.unobserve(el); return; }
      let cur = 0; const step = target / 36;
      const run = () => {
        cur += step;
        if (cur >= target) { el.textContent = target + suffix; }
        else { el.textContent = Math.floor(cur) + suffix; requestAnimationFrame(run); }
      };
      run(); countIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  $$('[data-count]').forEach(el => countIO.observe(el));

  /* ---------- Scroll progress + nav hide ---------- */
  const bar = $('.progress__bar');
  const nav = $('#nav');
  let lastY = 0;
  const onScroll = () => {
    const h = document.documentElement;
    const sc = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    if (bar) bar.style.transform = `scaleX(${sc})`;
    const y = h.scrollTop;
    if (nav && !document.body.classList.contains('menu-open')) {
      if (y > lastY && y > 400) nav.classList.add('hide');
      else nav.classList.remove('hide');
    }
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const burger = $('#burger');
  const menu = $('#menu');
  const burgerTxt = burger ? $('.burger__txt', burger) : null;
  const toggleMenu = (force) => {
    const open = force ?? !document.body.classList.contains('menu-open');
    document.body.classList.toggle('menu-open', open);
    burger?.setAttribute('aria-expanded', String(open));
    menu?.setAttribute('aria-hidden', String(!open));
    if (burgerTxt) burgerTxt.textContent = open ? 'Close' : 'Menu';
  };
  burger?.addEventListener('click', () => toggleMenu());
  $$('#menu a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

  /* ---------- Smooth anchor scroll ---------- */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (ev) => {
      const id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const t = document.querySelector(id);
      if (!t) return;
      ev.preventDefault();
      toggleMenu(false);
      t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
  });
  $('#toTop')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

  /* ---------- Custom cursor + magnetic ---------- */
  if (canHover && !reduce) {
    document.body.classList.add('cursor-on');
    const cursor = $('.cursor');
    const label = $('.cursor__label');
    let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
    const lerp = (a, b, n) => a + (b - a) * n;
    window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; }, { passive: true });
    const renderCursor = () => {
      cx = lerp(cx, tx, 0.18); cy = lerp(cy, ty, 0.18);
      if (cursor) cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    $$('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor?.classList.add('is-active');
        if (label) label.textContent = el.dataset.cursor;
      });
      el.addEventListener('mouseleave', () => {
        cursor?.classList.remove('is-active');
        if (label) label.textContent = '';
      });
    });

    // Magnetic buttons
    $$('[data-magnetic]').forEach(el => {
      const strength = 0.35;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
      el.style.transition = 'transform .4s cubic-bezier(0.22,1,0.36,1)';
    });
  }

  /* ---------- Hero portrait parallax ---------- */
  if (!reduce) {
    const photo = $('.hero__photo');
    if (photo) {
      let raf;
      window.addEventListener('scroll', () => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const y = Math.min(window.scrollY, 700);
          photo.style.transform = `translateY(${y * -0.05}px)`;
          raf = null;
        });
      }, { passive: true });
    }
  }

  /* ---------- Footer: year + local clock ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  const clock = $('#clock');
  const tickClock = () => {
    if (!clock) return;
    try {
      clock.textContent = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Colombo'
      }).format(new Date());
    } catch (_) { clock.textContent = ''; }
  };
  tickClock(); setInterval(tickClock, 30000);

  /* ---------- Copy email chips ---------- */
  $$('.contact__chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      const txt = chip.textContent.trim();
      if (navigator.clipboard && chip.href?.startsWith('mailto')) {
        navigator.clipboard.writeText(txt).then(() => {
          const old = chip.textContent;
          chip.textContent = 'Copied ✓';
          setTimeout(() => { chip.textContent = old; }, 1400);
        }).catch(() => {});
      }
    });
  });
})();
