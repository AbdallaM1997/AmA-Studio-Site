// Social post generator: marketing/posts/<id>.json → marketing/out/<id>/ (PNG stills, MP4 videos, captions.md).
// Renders marketing/templates/post.html in headless Edge/Chrome (no npm packages) and encodes video with ffmpeg.
//
//   npm run social -- <post-id> [more ids]     one or more posts
//   npm run social -- --all                    every post
//   options: --only story,square   --no-video   --list
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, rmSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const POSTS = join(ROOT, 'marketing', 'posts');
const OUT = join(ROOT, 'marketing', 'out');
const TEMPLATE = pathToFileURL(join(ROOT, 'marketing', 'templates', 'post.html')).href;

const FORMATS = {
  square: { w: 1080, h: 1080, use: 'Instagram / Facebook feed (1:1)' },
  portrait: { w: 1080, h: 1350, use: 'Instagram / Facebook feed, best reach (4:5)' },
  story: { w: 1080, h: 1920, use: 'Stories, Reels, TikTok, Shorts (9:16)' },
  landscape: { w: 1200, h: 628, use: 'LinkedIn / Facebook / X link post (1.91:1)' },
  avatar: { w: 1080, h: 1080, use: 'Profile picture (all platforms)' },
  'fb-cover': { w: 1640, h: 624, use: 'Facebook page cover' },
  'linkedin-cover': { w: 1128, h: 191, use: 'LinkedIn company page cover' },
  'youtube-banner': { w: 2560, h: 1440, use: 'YouTube channel banner (keep text in the middle)' },
  'x-header': { w: 1500, h: 500, use: 'X / Twitter header' },
};

// ---------- args ----------
const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const only = opt('--only')?.split(',');
const ids = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--only');
const allIds = readdirSync(POSTS).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5));

if (flag('--list')) {
  console.log('Posts:\n  ' + allIds.join('\n  ') + '\n\nFormats:');
  for (const [k, f] of Object.entries(FORMATS)) console.log(`  ${k.padEnd(15)} ${f.w}x${f.h}  ${f.use}`);
  process.exit(0);
}
const todo = flag('--all') ? allIds : ids;
if (!todo.length) { console.log('Usage: npm run social -- <post-id> | --all | --list'); process.exit(1); }

// ---------- tools ----------
function findBrowser() {
  const c = [process.env.CHROME_PATH,
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Google/Chrome/Application/chrome.exe', `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/microsoft-edge'];
  const hit = c.find((p) => p && existsSync(p));
  if (!hit) throw new Error('No Edge or Chrome found. Set CHROME_PATH to a Chromium browser.');
  return hit;
}

function findFfmpeg() {
  if (process.env.FFMPEG) return process.env.FFMPEG;
  const wg = join(process.env.LOCALAPPDATA || '', 'Microsoft', 'WinGet', 'Packages');
  if (existsSync(wg)) {
    for (const d of readdirSync(wg).filter((d) => /ffmpeg/i.test(d))) {
      for (const sub of readdirSync(join(wg, d))) {
        const p = join(wg, d, sub, 'bin', 'ffmpeg.exe');
        if (existsSync(p)) return p;
      }
    }
  }
  return 'ffmpeg';
}

// Minimal Chrome DevTools Protocol client over the built-in WebSocket.
async function launch() {
  const profile = mkdtempSync(join(tmpdir(), 'ama-social-'));
  const proc = spawn(findBrowser(), ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
    '--hide-scrollbars', '--mute-audio', '--allow-file-access-from-files', '--no-first-run', '--no-default-browser-check',
    '--disable-extensions', '--force-color-profile=srgb', 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
  const wsUrl = await new Promise((res, rej) => {
    let buf = '';
    proc.stderr.on('data', (d) => { buf += d; const m = buf.match(/DevTools listening on (ws:\/\/\S+)/); if (m) res(m[1]); });
    proc.on('exit', () => rej(new Error('Browser exited early:\n' + buf)));
    setTimeout(() => rej(new Error('Browser did not start')), 20000);
  });
  const ws = new WebSocket(wsUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0; const pending = new Map(); const listeners = [];
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m.result); }
    else listeners.forEach((l) => l(m));
  };
  const send = (method, params = {}, sessionId) => new Promise((res, rej) => {
    const msg = { id: ++id, method, params }; if (sessionId) msg.sessionId = sessionId;
    pending.set(msg.id, { res, rej }); ws.send(JSON.stringify(msg));
  });
  const once = (method, sessionId) => new Promise((res) => {
    const l = (m) => { if (m.method === method && m.sessionId === sessionId) { listeners.splice(listeners.indexOf(l), 1); res(m.params); } };
    listeners.push(l);
  });
  const close = async () => { try { await send('Browser.close'); } catch {} ws.close(); proc.kill(); try { rmSync(profile, { recursive: true, force: true }); } catch {} };
  return { send, once, close };
}

async function openPage(b, post, name, fmt) {
  const { targetId } = await b.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId: s } = await b.send('Target.attachToTarget', { targetId, flatten: true });
  const send = (m, p) => b.send(m, p, s);
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: fmt.w, height: fmt.h, deviceScaleFactor: 1, mobile: false });
  const rootUrl = pathToFileURL(ROOT).href.replace(/\/?$/, '/');
  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `window.__POST=${JSON.stringify(post)};window.__FORMAT=${JSON.stringify({ name, w: fmt.w, h: fmt.h })};window.__ROOT=${JSON.stringify(rootUrl)};`,
  });
  const loaded = b.once('Page.loadEventFired', s);
  await send('Page.navigate', { url: TEMPLATE });
  await loaded;
  const evalAsync = async (expr) => {
    const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  };
  const ready = await evalAsync('window.__ready');
  if (ready?.broken?.length) console.warn(`  ! missing media: ${ready.broken.join(', ')}`);
  const shot = async (format = 'png') => Buffer.from((await send('Page.captureScreenshot', format === 'png' ? { format } : { format, quality: 92 })).data, 'base64');
  return { evalAsync, shot, close: () => b.send('Target.closeTarget', { targetId }) };
}

function encode(fps, outFile, post) {
  const ff = findFfmpeg();
  const a = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-'];
  if (post.audio) a.push('-ss', String(post.audioStart || 0), '-i', resolveAsset(post.audio));
  a.push('-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', '-movflags', '+faststart');
  if (post.audio) a.push('-c:a', 'aac', '-b:a', '192k', '-shortest', '-map', '0:v', '-map', '1:a');
  a.push(outFile);
  const p = spawn(ff, a, { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => { p.on('exit', (c) => c ? rej(new Error('ffmpeg failed (' + c + ')')) : res()); p.on('error', rej); });
  return { write: (buf) => new Promise((r) => (p.stdin.write(buf) ? r() : p.stdin.once('drain', r))), end: async () => { p.stdin.end(); await done; } };
}

const resolveAsset = (p) => p.startsWith('/') ? join(ROOT, 'public', p) : join(ROOT, p);

function captions(post) {
  const lines = [`# ${post.id}`, ''];
  const tags = (post.hashtags || []).map((t) => (t.startsWith('#') ? t : '#' + t)).join(' ');
  for (const [platform, text] of Object.entries(post.captions || {})) {
    lines.push(`## ${platform}`, '', text.trim());
    if (tags && platform !== 'linkedin') lines.push('', tags);
    lines.push('');
  }
  if (post.altText) lines.push('## Alt text', '', post.altText, '');
  return lines.join('\n');
}

// ---------- run ----------
const browser = await launch();
try {
  for (const id of todo) {
    const file = join(POSTS, id + '.json');
    if (!existsSync(file)) { console.error(`No post "${id}". Try --list.`); process.exitCode = 1; continue; }
    const post = { id, ...JSON.parse(readFileSync(file, 'utf8')) };
    const dir = join(OUT, id);
    mkdirSync(dir, { recursive: true });
    console.log(`\n${id}`);
    const formats = (post.formats || ['square', 'portrait', 'story', 'landscape']).filter((f) => !only || only.includes(f));
    const videos = flag('--no-video') ? [] : (post.videos || []).filter((f) => !only || only.includes(f));
    for (const name of new Set([...formats, ...videos])) {
      const fmt = FORMATS[name];
      if (!fmt) { console.warn(`  ! unknown format "${name}"`); continue; }
      const page = await openPage(browser, post, name, fmt);
      if (formats.includes(name)) {
        await page.evalAsync(`window.__seek(${post.stillAt ?? 3})`);
        writeFileSync(join(dir, name + '.png'), await page.shot('png'));
        console.log(`  ${name}.png  ${fmt.w}x${fmt.h}`);
      }
      if (videos.includes(name)) {
        const fps = post.fps || 30, dur = post.duration || 6, total = Math.round(fps * dur);
        const enc = encode(fps, join(dir, name + '.mp4'), post);
        for (let f = 0; f < total; f++) {
          await page.evalAsync(`window.__seek(${f / fps})`);
          await enc.write(await page.shot('jpeg'));
          if (f % fps === 0) process.stdout.write(`\r  ${name}.mp4  ${Math.round((f / total) * 100)}%`);
        }
        await enc.end();
        console.log(`\r  ${name}.mp4  ${fmt.w}x${fmt.h}, ${dur}s`);
      }
      await page.close();
    }
    if (post.captions) { writeFileSync(join(dir, 'captions.md'), captions(post)); console.log('  captions.md'); }
  }
} finally {
  await browser.close();
}
console.log(`\nDone → marketing/out/`);
