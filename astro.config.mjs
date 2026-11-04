// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import optimizeImages from './integrations/optimize-images.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://mybirdhouse.ca',
  integrations: [sitemap(), optimizeImages()],
  // CSS goes inline: one less round trip before the first paint on phones
  build: { inlineStylesheets: 'always' },
  vite: {
    plugins: [tailwindcss()],
  },
});
