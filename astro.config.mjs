// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://norien.es',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      // Páginas legales provisionales (noindex): fuera del sitemap hasta tener los textos.
      filter: (page) => !/\/(aviso-legal|privacidad|cookies)\/?$/.test(page),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
