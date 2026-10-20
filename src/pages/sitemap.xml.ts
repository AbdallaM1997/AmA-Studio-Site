/** sitemap.xml for search engines: every page, built from the games and news data so new ones are added automatically. */
import type { APIRoute } from 'astro';
import games from '../data/games.json';
import news from '../data/news.json';

export const GET: APIRoute = ({ site }) => {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');
  const abs = (path: string) => new URL(base.replace(/\/$/, '') + path, site).href;
  const pages: { path: string; lastmod?: string; priority: string }[] = [
    { path: '/', priority: '1.0' },
    { path: '/games/', priority: '0.9' },
    ...games.map((g) => ({ path: `/games/${g.slug}/`, priority: '0.9' })),
    { path: '/news/', priority: '0.7' },
    ...news.map((n) => ({ path: `/news/${n.slug}/`, lastmod: n.date, priority: '0.6' })),
    { path: '/support/', priority: '0.6' },
    { path: '/privacy/', priority: '0.3' },
    { path: '/terms/', priority: '0.3' },
    { path: '/delete-data/', priority: '0.3' },
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${abs(p.path)}</loc>${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ''}<priority>${p.priority}</priority></url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
