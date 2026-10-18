// Builds one social post from window.__POST at the size in window.__FORMAT.
// scripts/social.mjs sets those, waits for window.__ready, then calls window.__seek(t) per frame.
(() => {
  const P = window.__POST || {};
  const F = window.__FORMAT || { name: 'square', w: 1080, h: 1080 };
  const ROOT = window.__ROOT || '../../';
  const post = document.getElementById('post');

  const ratio = F.w / F.h;
  const aspect = ratio >= 2.4 ? 'strip' : ratio >= 1.3 ? 'wide' : ratio <= 0.7 ? 'tall' : 'box';
  const template = P.template || 'announce';
  const theme = P.theme || (template === 'profile' ? 'yellow' : 'cream');
  document.documentElement.style.setProperty('--u', Math.min(F.w, F.h) / 100 + 'px');
  document.body.className = `t-${template} th-${theme} a-${aspect === 'strip' ? 'wide a-strip' : aspect} f-${F.name}`;

  const asset = (p) => /^(https?:|file:|data:)/.test(p) ? p : p.startsWith('/') ? ROOT + 'public' + p : ROOT + p;
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const delay = (e, s) => { e.style.setProperty('--d', s + 's'); return e; };

  function logo(size) {
    const l = el('span', 'logo', '<span class="logo__word">AmA<span class="logo__spark"></span></span><span class="logo__studio">Studio</span>');
    if (size) l.style.setProperty('--s', size);
    return l;
  }

  function headline(lines, start = .2) {
    const h = el('h1', 'headline');
    const list = Array.isArray(lines) ? lines : [lines || ''];
    list.forEach((line, i) => {
      const row = el('span', 'line');
      const inner = delay(el('span', '', esc(line)), start + i * .12);
      if (i === list.length - 1 && P.dot !== false) inner.appendChild(delay(el('span', 'dot', '.'), start + list.length * .12 + .35));
      row.appendChild(inner);
      h.appendChild(row);
    });
    return h;
  }

  function media(src, start) {
    const isVideo = /\.(mp4|webm|mov|m4v)$/i.test(src);
    const m = document.createElement(isVideo ? 'video' : 'img');
    m.src = asset(src);
    if (isVideo) { m.muted = true; m.playsInline = true; m.preload = 'auto'; m.dataset.start = start || 0; if (P.videoEnd) m.dataset.end = P.videoEnd; }
    return m;
  }

  function squares() {
    if (P.squares === false) return;
    const sets = {
      tall: [[80, 3.5, 8, -14, 1], [91, 9, 4, 18, 2], [70, 2, 2.6, 12, 3]],
      box: [[83, 7, 8, -14, 1], [92, 17, 4, 18, 2], [70, 4, 3, 10, 3]],
      wide: [[90, 9, 6, -14, 1], [95, 22, 3, 18, 2], [52, 6, 2.6, 12, 3]],
      strip: [[4, 18, 9, -14, 1], [12, 62, 5, 18, 2], [92, 22, 7, 12, 3], [85, 66, 4, -10, 1]],
    };
    (sets[aspect] || sets.box).forEach(([x, y, size, rot, c], i) => {
      const s = delay(el('span', 'sq'), .35 + i * .12);
      s.style.cssText += `left:${x}%;top:${y}%;width:${size * Math.min(F.w, F.h) / 100}px;height:${size * Math.min(F.w, F.h) / 100}px;rotate:${rot}deg;`;
      const inner = el('i');
      inner.style.background = `var(--sq${c})`;
      inner.style.setProperty('--dur', (4.5 + i) + 's');
      inner.style.setProperty('--fd', (-i * 1.3) + 's');
      s.appendChild(inner);
      post.appendChild(s);
    });
  }

  function foot() {
    const f = el('div', 'foot');
    f.appendChild(logo(aspect === 'tall' ? 'calc(var(--u) * 9)' : null));
    f.appendChild(delay(el('span', 'url', esc(P.url ?? 'amastudios.net')), 1.3));
    return f;
  }

  function copy() {
    const c = el('div', 'copy');
    if (P.headline) c.appendChild(headline(P.headline));
    if (P.text) c.appendChild(delay(el('p', 'text', esc(P.text)), .75));
    if (P.cta) c.appendChild(el('span', 'cta', esc(P.cta)));
    return c;
  }

  // ---------- Templates ----------
  const build = {
    announce() {
      if (P.label) post.appendChild(el('div', 'label', esc(P.label)));
      const body = el('div', 'body');
      body.appendChild(copy());
      post.appendChild(body);
      post.appendChild(foot());
    },
    game() {
      if (P.label) post.appendChild(el('div', 'label', esc(P.label)));
      const body = el('div', 'body');
      const m = el('div', 'media');
      const panel = el('div', 'panel');
      panel.appendChild(media(P.image || P.video, P.videoStart));
      m.appendChild(panel);
      if (aspect === 'wide') { body.appendChild(m); body.appendChild(copy()); } else { body.appendChild(m); body.appendChild(copy()); }
      post.appendChild(body);
      post.appendChild(foot());
    },
    screens() {
      if (P.label) post.appendChild(el('div', 'label', esc(P.label)));
      const body = el('div', 'body');
      const imgs = (P.images || [P.image]).filter(Boolean).slice(0, 3);
      const m = el('div', 'media');
      const phones = el('div', `phones n${imgs.length}`);
      imgs.forEach((src, i) => { const ph = delay(el('div', 'phone'), .3 + i * .15); ph.appendChild(media(src, P.videoStart)); phones.appendChild(ph); });
      m.appendChild(phones);
      if (aspect === 'tall') { body.appendChild(copy()); body.appendChild(m); } else { body.appendChild(copy()); body.appendChild(m); }
      post.appendChild(body);
      post.appendChild(foot());
    },
    clip() {
      P.images = [P.video];
      build.screens();
    },
    profile() {
      post.appendChild(logo());
    },
    cover() {
      post.appendChild(logo());
      const c = el('div', 'copy');
      c.appendChild(headline(P.headline || ['Serious', 'about fun']));
      if (P.text && aspect !== 'strip') c.appendChild(delay(el('div', 'sub', esc(P.text)), .9));
      post.appendChild(c);
    },
  };
  (build[template] || build.announce)();
  if (template !== 'profile') squares();

  // ---------- Fit the headline: shrink until every line fits and the post doesn't overflow ----------
  function fit() {
    const h = post.querySelector('.headline');
    if (!h || template === 'cover') return;
    const start = { tall: 19, box: 15, wide: 13, strip: 13 }[aspect] * (P.headlineScale || 1);
    const m = post.querySelector('.media');
    const minMedia = aspect === 'wide' ? 0 : F.h * (aspect === 'tall' ? (template === 'clip' ? .5 : .38) : .34);
    let size = start;
    const u = Math.min(F.w, F.h) / 100;
    const lineOk = () => [...h.querySelectorAll('.line')].every((l) => l.scrollWidth <= l.clientWidth + 1);
    for (let i = 0; i < 60; i++) {
      h.style.fontSize = size * u + 'px';
      const overflow = post.scrollHeight > post.clientHeight + 1;
      // Media may give up space before the headline drops below ~60% of its start size.
      const mediaOk = !m || m.clientHeight >= minMedia || aspect === 'wide' || size < start * .6;
      if (lineOk() && !overflow && mediaOk) break;
      size *= .95;
    }
  }

  // Size phones (9:18) to fit their box; in narrow boxes they overlap.
  function sizePhones() {
    const box = post.querySelector('.phones');
    if (!box) return;
    const n = box.children.length;
    const W = box.parentElement.clientWidth, H = box.parentElement.clientHeight;
    const overlap = aspect === 'box' && n > 1 ? .35 : 0;
    const gapRatio = overlap ? -overlap : .08;
    let ph = H * .94;
    let pw = ph / 2;
    const need = pw * (n + (n - 1) * gapRatio);
    if (need > W * .96) { pw *= (W * .96) / need; ph = pw * 2; }
    box.style.setProperty('--pw', pw + 'px');
    box.style.setProperty('--ph', ph + 'px');
    box.style.setProperty('--gap', pw * gapRatio + 'px');
  }

  const loaded = (m) => new Promise((res) => {
    if (m.tagName === 'IMG') { if (m.complete) res(); else { m.onload = m.onerror = () => res(); } }
    else if (m.readyState >= 2) res(); else { m.onloadeddata = m.onerror = () => res(); }
  });

  function seekVideo(v, t) {
    const start = +v.dataset.start || 0;
    const end = +v.dataset.end || v.duration || start + 1;
    const span = Math.max(.1, end - start);
    const target = start + (t % span);
    return new Promise((res) => {
      if (Math.abs(v.currentTime - target) < .001) return res();
      const done = () => { v.removeEventListener('seeked', done); res(); };
      v.addEventListener('seeked', done);
      v.currentTime = target;
      setTimeout(done, 2000);
    });
  }

  window.__seek = async (t) => {
    for (const a of document.getAnimations()) { a.pause(); a.currentTime = t * 1000; }
    await Promise.all([...document.querySelectorAll('video')].map((v) => seekVideo(v, t)));
    await new Promise((r) => { requestAnimationFrame(() => requestAnimationFrame(r)); setTimeout(r, 200); });
  };

  window.__ready = (async () => {
    await document.fonts.ready;
    await Promise.all([...document.querySelectorAll('img, video')].map(loaded));
    // Measure at the end state, then fit.
    for (const a of document.getAnimations()) { a.pause(); a.currentTime = 4000; }
    fit();
    sizePhones();
    const broken = [...document.querySelectorAll('img')].filter((i) => !i.naturalWidth).map((i) => i.src)
      .concat([...document.querySelectorAll('video')].filter((v) => !v.videoWidth).map((v) => v.src));
    return { broken };
  })();
})();
