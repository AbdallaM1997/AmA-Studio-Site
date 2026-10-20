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

  // Safety net: anything already on screen that the observer missed (background tab, slow first frame,
  // page restored from the back/forward cache) is shown anyway
  const sweep = () => items.forEach((el) => {
    if (el.classList.contains('is-in')) return;
    const r = el.getBoundingClientRect();
    if (r.bottom > 0 && r.top < window.innerHeight && r.height > 0) { el.classList.add('is-in'); io.unobserve(el); }
  });
  setTimeout(sweep, 1200);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) setTimeout(sweep, 400); });
  window.addEventListener('pageshow', (e) => { if (e.persisted) sweep(); });
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
    let raf = 0, x = 0, y = 0;
    const apply = () => {
      raf = 0;
      card.style.transform = `perspective(900px) rotateY(${(x * 5).toFixed(2)}deg) rotateX(${(-y * 5).toFixed(2)}deg) translateY(-4px)`;
    };
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      x = (e.clientX - r.left) / r.width - 0.5;
      y = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(apply);
    });
    card.addEventListener('pointerleave', () => { cancelAnimationFrame(raf); raf = 0; card.style.transform = ''; });
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

  // Pop-ups (<dialog> modals) sit in the browser's top layer, above any z-index.
  // Put the cursor in the top layer too, and bring it back to the front whenever a dialog opens.
  const canTop = typeof el.showPopover === 'function';
  const toFront = () => {
    if (!canTop) return;
    try { if (el.matches(':popover-open')) el.hidePopover(); el.showPopover(); } catch (e) {}
  };
  if (canTop) {
    el.setAttribute('popover', 'manual');
    toFront();
    new MutationObserver((list) => {
      if (list.some((m) => m.target.tagName === 'DIALOG' && m.target.hasAttribute('open'))) toFront();
    }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
  }
  const dot = el.firstElementChild.nextElementSibling;
  const ring = el.firstElementChild;

  let x = -100, y = -100, rx = x, ry = y, raf = 0;
  const tick = () => {
    // The frame eases after the pointer; with reduced motion it just sits on it
    rx += (x - rx) * (reduce ? 1 : 0.22);
    ry += (y - ry) * (reduce ? 1 : 0.22);
    dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    ring.style.transform = `translate3d(${rx.toFixed(2)}px, ${ry.toFixed(2)}px, 0)`;
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
    // The dot's edge is the opposite of its fill (black dot gets a cream edge, cream dot a black edge)
    el.style.setProperty('--c-edge', /^#?(f8f5ec|fff|rgb\(248)/i.test(ink.replace(/\s/g, '')) || ink.includes('--cream') ? 'var(--black)' : 'var(--cream)');
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
    const label = el.querySelector('.label')?.textContent || el.getAttribute('aria-label') || el.querySelector('h1, h2')?.textContent || '';
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

  // Exact landing spot: right under the sticky nav (its height changes with the layout)
  const nav = document.querySelector('.nav');
  const navH = () => (nav ? nav.getBoundingClientRect().height : 0);
  const setNavVar = () => document.documentElement.style.setProperty('--nav-h', `${Math.round(navH())}px`);
  setNavVar();
  window.addEventListener('resize', setNavVar);
  const topOf = (sec) => sec.getBoundingClientRect().top + window.scrollY - navH();

  // Gentle settle: when scrolling stops just short of the next section start, glide it into place.
  // It only ever moves the way you were already scrolling, so it never pulls you back.
  const settleOn = window.matchMedia('(min-width: 961px) and (pointer: fine)');
  let timer = 0;
  let lastY = window.scrollY;
  let dir = 0;
  let gliding = false;
  const settle = () => {
    if (gliding) { gliding = false; return; } // this scrollend is the end of our own glide
    if (reduce || !settleOn.matches || document.documentElement.classList.contains('splash-on') || !dir) return;
    const y = window.scrollY;
    const maxY = document.documentElement.scrollHeight - window.innerHeight;
    if (y <= 2 || y >= maxY - 2) return;
    const reach = window.innerHeight * 0.22;
    let best = null;
    secs.forEach((sec) => {
      const t = Math.min(Math.max(topOf(sec), 0), maxY);
      const d = (t - y) * dir; // distance ahead in the scroll direction
      if (d > 2 && d < reach && (best === null || d < (best - y) * dir)) best = t;
    });
    if (best === null) return;
    gliding = true;
    window.scrollTo({ top: best, behavior: 'smooth' });
  };
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (!gliding && Math.abs(y - lastY) > 0) dir = Math.sign(y - lastY);
    lastY = y;
    if (!('onscrollend' in window)) { clearTimeout(timer); timer = setTimeout(settle, 160); }
  }, { passive: true });
  // Any new wheel/touch/key input takes over from a glide
  const takeOver = () => { gliding = false; };
  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((t) => window.addEventListener(t, takeOver, { passive: true }));
  if ('onscrollend' in window) window.addEventListener('scrollend', settle);

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

/* ---------- Newsletter ----------
   No formAction in site.json: shows a "coming soon" note.
   A MailerLite form URL (assets.mailerlite.com/jsonp/.../subscribe): sends in the background
   and answers on the page. Any other URL: a normal form post. */
function setupNewsletter() {
  document.querySelectorAll('form[data-newsletter]').forEach((form) => {
    const action = form.getAttribute('action') || '';
    const note = form.querySelector('[data-note]');
    const say = (t) => { if (note) note.textContent = t; };

    if (!action) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        say('Sign-up opens soon. Thanks for the interest!');
      });
      return;
    }
    if (!action.includes('mailerlite.com')) return;

    const btn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]');
      const data = new FormData();
      data.append('fields[email]', email ? email.value.trim() : '');
      data.append('ml-submit', '1');
      data.append('anticsrf', 'true');
      if (btn) btn.disabled = true;
      say('Sending.');
      try {
        const res = await fetch(action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json.success === false) throw new Error('rejected');
        form.reset();
        window.umami?.track('Newsletter sign-up');
        say("You're in. Check your inbox to confirm.");
      } catch (err) {
        say("That didn't go through. Check the email and try again.");
      } finally {
        if (btn) btn.disabled = false;
      }
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
