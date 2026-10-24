import { defineConfig } from 'astro/config';
import site from './src/data/site.json' with { type: 'json' };

// https://docs.astro.build/en/reference/configuration-reference/
// SITE_URL / BASE_PATH are set by the GitHub Pages workflow (.github/workflows/deploy.yml).
// Locally they're unset, so the site runs at the root as before.
export default defineConfig({
  site: process.env.SITE_URL || site.url,
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
  // The CSS is small: put it in the page so it doesn't block the first paint as extra requests
  build: { inlineStylesheets: 'always' },
});
