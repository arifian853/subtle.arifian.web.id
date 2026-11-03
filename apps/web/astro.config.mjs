import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// Adapted from the official Astro minimal template; static hosting and API stay separate.
export default defineConfig({
  site: 'https://subtle.arifian.web.id',
  output: 'static',
  trailingSlash: 'always',
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
