import { defineConfig } from 'astro/config';
import site from './src/data/site.json' with { type: 'json' };

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: site.url,
  trailingSlash: 'always',
});
