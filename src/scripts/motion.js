// Site-wide motion and small interactions.
// Everything here is optional polish: the site works and reads fine without JS,
// and every effect is switched off for people who ask for reduced motion.

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = window.matchMedia('(pointer: fine)').matches;

/* ---------- Reveal on scroll ---------- */
function setupReveal() {
  // Children of [data-stagger] reveal one after another
  document.querySelectorAll('[data-stagger]').forEach((group) => {
    const step = parseFloat(group.dataset.stagger) || 0.08;
    group.querySelectorAll(':scope > [data-reveal]').forEach((el, i) => el.style.setProperty('--d', `${(i * step).toFixed(2)}s`));
  });

  const items = document.querySelectorAll('[data-reveal]');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  items.forEach((el) => io.observe(el));
}

/* ---------- Squares follow the pointer a little ---------- */
function setupParallax() {
  if (reduce || !fine) return;
  document.querySelectorAll('[data-parallax]').forEach((area) => {
    const layers = area.querySelectorAll('[data-depth]');
    let raf = 0;
    area.addEventListener('pointermove', (e) => {
      const r = area.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => layers.forEach((l) => {
        const d = parseFloat(l.dataset.depth);
        l.style.translate = `${(x * d).toFixed(1)}px ${(y * d).toFixed(1)}px`;
      }));
    });
    area.addEventListener('pointerleave', () => layers.forEach((l) => { l.style.translate = '0 0'; }));
  });
}

/* ---------- Play break: tap the panel to drop squares ---------- */
function setupToy() {
  document.querySelectorAll('[data-toy]').forEach((area) => {
    const colors = ['var(--red)', 'var(--black)', 'var(--cream)', 'var(--red)'];
    const counter = area.querySelector('[data-toy-count]');
    let count = 0;
    let live = [];

    const drop = (x, y) => {
      const r = area.getBoundingClientRect();
      const size = 18 + Math.random() * 34;
      const sq = document.createElement('span');
      sq.className = 'toy-sq';
      sq.style.cssText = `width:${size}px;height:${size}px;left:${x - size / 2}px;top:${y - size / 2}px;background:${colors[count % colors.length]}`;
      area.appendChild(sq);
      live.push(sq);
      if (live.length > 24) live.shift().remove();
      count += 1;
      if (counter) counter.textContent = String(count);

      if (reduce) { setTimeout(() => sq.remove(), 1200); return; }
      const fall = r.height - y - size / 2 - 4;
      const spin = (Math.random() * 2 - 1) * 260;
      const drift = (Math.random() * 2 - 1) * 60;
      sq.animate([
        { transform: 'translate(0,0) scale(0) rotate(0deg)' },
        { transform: 'translate(0,-30px) scale(1.15) rotate(20deg)', offset: 0.18 },
        { transform: `translate(${drift}px, ${fall}px) scale(1) rotate(${spin}deg)` },
      ], { duration: 900 + fall, easing: 'cubic-bezier(.45,0,.7,1)', fill: 'forwards' })
        .finished.then(() => sq.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, delay: 1600, fill: 'forwards' })
          .finished.then(() => { sq.remove(); live = live.filter((s) => s !== sq); }));
    };

    area.addEventListener('click', (e) => {
      if (e.target.closest('a, button:not([data-toy-btn])')) return;
      const r = area.getBoundingClientRect();
      if (e.target.closest('[data-toy-btn]')) drop(r.width * (0.25 + Math.random() * 0.5), r.height * 0.3);
      else drop(e.clientX - r.left, e.clientY - r.top);
    });
  });
}

/* ---------- Cards tilt toward the pointer ---------- */
function setupTilt() {
  if (reduce || !fine) return;
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}

/* ---------- Mobile menu ---------- */
function setupNav() {
  const btn = document.querySelector('.nav__toggle');
  const menu = document.getElementById('nav-menu');
  if (!btn || !menu) return;
  const set = (open) => {
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('is-open', open);
  };
  btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
}

/* ---------- Newsletter (until a sign-up service is connected) ---------- */
function setupTheme() {
  const root = document.documentElement;
  const btns = document.querySelectorAll('[data-theme-toggle]');
  const saved = () => { try { return localStorage.getItem('ama-theme'); } catch (e) { return null; } };
  const apply = (t) => {
    root.dataset.theme = t;
    btns.forEach((b) => b.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'));
  };
  apply(root.dataset.theme === 'dark' ? 'dark' : 'light');
  // The new mode pops out of the button as a tilted square that grows to fill the screen
  const square = (cx, cy, s, deg) => {
    const a = (deg * Math.PI) / 180;
    const pts = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([px, py]) =>
      `${cx + s * (px * Math.cos(a) - py * Math.sin(a))}px ${cy + s * (px * Math.sin(a) + py * Math.cos(a))}px`);
    return `polygon(${pts.join(', ')})`;
  };
  btns.forEach((b) => b.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    const swap = () => {
      apply(next);
      try { localStorage.setItem('ama-theme', next); } catch (e) {}
    };
    if (reduce || !document.startViewTransition) return swap();
    const r = b.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    // Half-size big enough that the square covers the farthest corner of the window
    const s = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy)) + 20;
    const vt = document.startViewTransition(swap);
    // Safety net: if the browser can't start the animation quickly, just switch
    setTimeout(() => { if (root.dataset.theme !== next) { vt.skipTransition(); swap(); } }, 400);
    vt.ready.then(() => {
      root.animate(
        { clipPath: [square(cx, cy, 0, 60), square(cx, cy, 30, 34), square(cx, cy, s, 14)], offset: [0, 0.18, 1] },
        { duration: 750, easing: 'cubic-bezier(.65, 0, .35, 1)', pseudoElement: '::view-transition-new(root)' }
      );
    }).catch(() => {});
  }));
  // Follow the system setting until the visitor picks one
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => { if (!saved()) apply(e.matches ? 'dark' : 'light'); });
}

/* ---------- Brand cursor: square dot + trailing tilted frame (mouse only) ---------- */
function setupCursor() {
  if (!fine) return;
  const el = document.createElement('div');
  el.className = 'cursor';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<span class="cursor__ring"></span><span class="cursor__dot"></span>';
  document.body.append(el);
  document.documentElement.classList.add('has-cursor');
  const dot = el.firstElementChild.nextElementSibling;
  const ring = el.firstElementChild;

  let x = -100, y = -100, rx = x, ry = y, raf = 0;
  const tick = () => {
    // The frame eases after the pointer; with reduced motion it just sits on it
    rx += (x - rx) * (reduce ? 1 : 0.22);
    ry += (y - ry) * (reduce ? 1 : 0.22);
    dot.style.transform = `translate(${x}px, ${y}px)`;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.1 ? requestAnimationFrame(tick) : 0;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };

  document.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX; y = e.clientY;
    if (!el.classList.contains('is-on')) { rx = x; ry = y; el.classList.add('is-on'); }
    kick();
  });
  document.addEventListener('mouseout', (e) => { if (!e.relatedTarget) el.classList.remove('is-on'); });
  document.addEventListener('pointerdown', () => el.classList.add('is-down'));
  document.addEventListener('pointerup', () => el.classList.remove('is-down'));

  // Match what is under the pointer: links grow the frame, play areas close it,
  // text fields get the normal I-beam, and colors follow the panel (yellow, red, dark)
  document.addEventListener('pointerover', (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    el.classList.toggle('is-text', !!t.closest('input, textarea, select, [contenteditable]'));
    el.classList.toggle('is-link', !!t.closest('a, button, label, [role="button"]'));
    el.classList.toggle('is-toy', !!t.closest('[data-toy]') && !t.closest('a, button'));
    const ink = getComputedStyle(t).getPropertyValue('--ink').trim();
    el.style.setProperty('--c-ink', ink);
    el.style.setProperty('--c-ring', t.closest('.red, .btn--red') ? ink : 'var(--red)');
  });
}

/* ---------- Sections: snap scrolling, arrival bar, right-edge pager ---------- */
function setupSections() {
  const main = document.getElementById('main');
  if (!main) return;
  const isSection = (el) => el.offsetHeight > 160 && !el.classList.contains('checker') && getComputedStyle(el).position !== 'fixed';
  let secs = [...main.children].filter(isSection);
  // A single wrapper (e.g. a news post <article>) counts as its parts
  secs = secs.flatMap((el) => (el.tagName === 'ARTICLE' ? [...el.children].filter(isSection) : [el]));
  const footer = document.querySelector('.footer');
  if (footer) secs.push(footer);
  if (secs.length < 2) return;

  const nameOf = (el) => {
    const label = el.getAttribute('aria-label') || el.querySelector('.label')?.textContent || el.querySelector('h1, h2')?.textContent || '';
    return label.replace(/\s+/g, ' ').trim().slice(0, 32) || 'Section';
  };

  const pager = document.createElement('nav');
  pager.className = 'pager';
  pager.setAttribute('aria-label', 'Page sections');
  const btns = secs.map((sec, i) => {
    sec.classList.add('snap-sec');
    const bar = document.createElement('span');
    bar.className = 'snap-bar';
    bar.setAttribute('aria-hidden', 'true');
    sec.prepend(bar);
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pager__btn';
    b.innerHTML = `<span class="pager__sq"></span><span class="pager__label"></span>`;
    b.querySelector('.pager__label').textContent = i === secs.length - 1 && sec === footer ? 'Footer' : nameOf(sec);
    b.setAttribute('aria-label', `Go to ${b.textContent}`);
    b.addEventListener('click', () => sec.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }));
    pager.append(b);
    return b;
  });
  document.body.append(pager);
  document.documentElement.classList.add('has-snap');

  // The section crossing the middle of the screen is the current one
  let current = -1;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const i = secs.indexOf(e.target);
      if (i === current) return;
      current = i;
      btns.forEach((b, j) => {
        b.classList.toggle('is-current', j === i);
        if (j === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
      });
      const sec = secs[i];
      sec.classList.remove('is-arriving');
      void sec.offsetWidth; // restart the bar sweep
      sec.classList.add('is-arriving');
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  secs.forEach((s) => io.observe(s));
}

function setupNewsletter() {
  document.querySelectorAll('form[data-newsletter]').forEach((form) => {
    if (form.getAttribute('action')) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const note = form.querySelector('[data-note]');
      if (note) note.textContent = 'Sign-up opens soon. Thanks for the interest!';
    });
  });
}

export function runMotion() {
  setupNav();
  setupTheme();
  setupCursor();
  setupSections();
  setupNewsletter();
  setupParallax();
  setupToy();
  setupTilt();
  // Reveal waits for the splash to finish so the hero animates in on cue
  window.addEventListener('ama:ready', setupReveal, { once: true });
}
