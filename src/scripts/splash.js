// Splash timeline. The CSS in Splash.astro animates everything except the
// typewriter, which is done here so the caret follows the letters.
// When the splash ends it fires `ama:ready` so the page animations can start.

const TYPE_START = 1700;   // ms before the tagline starts typing
const TYPE_SPEED = 45;     // ms per letter
const HOLD = 900;          // ms the finished splash stays on screen

export function runSplash() {
  const root = document.documentElement;
  const splash = document.querySelector('.splash');
  if (!splash || !root.classList.contains('splash-on')) {
    window.dispatchEvent(new Event('ama:ready'));
    return;
  }

  const typeEl = splash.querySelector('.splash__type');
  const text = typeEl?.dataset.text ?? '';
  const timers = [];
  let done = false;

  const finish = () => {
    if (done) return;
    done = true;
    timers.forEach(clearTimeout);
    try { sessionStorage.setItem('ama-splash', '1'); } catch {}
    splash.classList.add('is-out');
    window.dispatchEvent(new Event('ama:ready'));
    const end = () => root.classList.remove('splash-on');
    splash.addEventListener('animationend', (e) => { if (e.target === splash) end(); });
    setTimeout(end, 900); // safety net
  };

  // typewriter
  timers.push(setTimeout(() => {
    splash.classList.add('is-typing');
    [...text].forEach((_, i) => {
      timers.push(setTimeout(() => { typeEl.textContent = text.slice(0, i + 1); }, i * TYPE_SPEED));
    });
    timers.push(setTimeout(() => {
      splash.classList.add('is-typed');
      timers.push(setTimeout(finish, HOLD));
    }, text.length * TYPE_SPEED + 80));
  }, TYPE_START));

  // skip: button, click anywhere, or any key
  splash.querySelector('.splash__skip')?.addEventListener('click', finish);
  splash.addEventListener('click', finish);
  window.addEventListener('keydown', finish, { once: true });
}
