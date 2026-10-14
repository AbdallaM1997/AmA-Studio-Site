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
  setupNewsletter();
  setupParallax();
  setupToy();
  setupTilt();
  // Reveal waits for the splash to finish so the hero animates in on cue
  window.addEventListener('ama:ready', setupReveal, { once: true });
}
