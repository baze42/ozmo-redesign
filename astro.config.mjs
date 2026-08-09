import vercel from '@astrojs/vercel';
import { defineConfig } from 'astro/config';

const site = process.env.PUBLIC_SITE_URL || 'https://ozmodigital.com';

export default defineConfig({
  site,
  adapter: vercel(),
  integrations: [],
});
