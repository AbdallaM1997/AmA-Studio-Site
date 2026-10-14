// Validates the site's content files. Run: npm run check:data
import { readFileSync } from 'node:fs';

const errors = [];
const warn = [];
const read = (p) => {
  try { return JSON.parse(readFileSync(new URL(`../src/data/${p}`, import.meta.url), 'utf8')); }
  catch (e) { errors.push(`${p}: not valid JSON — ${e.message}`); return null; }
};

const site = read('site.json');
const games = read('games.json');
const news = read('news.json');

const THEMES = ['red', 'yellow', 'black'];
const STATUS = ['coming-soon', 'live', 'in-lab'];
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

if (site) {
  if (!['pop', 'blocks', 'night'].includes(site.splash?.variant)) errors.push('site.json: splash.variant must be pop, blocks or night');
  if (/example\.com/.test(site.email)) warn.push('site.json: email is still the example address');
  if (/example\.com/.test(site.url)) warn.push('site.json: url is still example.com');
}

const checkSlugs = (list, file) => {
  const seen = new Set();
  list.forEach((item, i) => {
    if (!SLUG.test(item.slug ?? '')) errors.push(`${file}[${i}]: slug "${item.slug}" must be lowercase-with-hyphens`);
    if (seen.has(item.slug)) errors.push(`${file}: duplicate slug "${item.slug}"`);
    seen.add(item.slug);
    if (item.theme && !THEMES.includes(item.theme)) errors.push(`${file}[${i}]: theme must be ${THEMES.join(', ')}`);
  });
};

if (games) {
  checkSlugs(games, 'games.json');
  if (games.filter((g) => g.featured).length > 1) warn.push('games.json: more than one game is featured; the first one is used');
  games.forEach((g, i) => {
    for (const k of ['title', 'tagline', 'genre', 'status', 'platforms', 'howToPlay', 'features', 'stores', 'screenshots']) {
      if (g[k] === undefined) errors.push(`games.json[${i}] (${g.slug}): missing "${k}"`);
    }
    if (g.status && !STATUS.includes(g.status)) errors.push(`games.json[${i}]: status must be ${STATUS.join(', ')}`);
    if (g.status === 'live' && !g.stores?.appStore && !g.stores?.googlePlay) errors.push(`games.json[${i}] (${g.slug}): live game needs at least one store link`);
    if (!g.keyArt) warn.push(`games.json: ${g.slug} has no key art yet`);
  });
}

if (news) {
  checkSlugs(news, 'news.json');
  news.forEach((n, i) => {
    if (!DATE.test(n.date ?? '')) errors.push(`news.json[${i}] (${n.slug}): date must be YYYY-MM-DD`);
    if (!Array.isArray(n.body) || !n.body.length) errors.push(`news.json[${i}] (${n.slug}): body must be a list of paragraphs`);
    if (/\.\s*$/.test(n.title ?? '')) warn.push(`news.json: "${n.title}" ends with a full stop; the page adds the red one`);
  });
}

warn.forEach((w) => console.log(`  note: ${w}`));
if (errors.length) {
  errors.forEach((e) => console.error(`  ✗ ${e}`));
  process.exit(1);
}
console.log('  ✓ data looks good');
