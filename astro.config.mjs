import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import markdoc from '@astrojs/markdoc'
import tailwind from '@astrojs/tailwind'
import keystatic from '@keystatic/astro'
import vercel from '@astrojs/vercel'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://spaw.vercel.app',
  integrations: [react(), markdoc(), tailwind(), keystatic(), sitemap()],
  output: 'static',
  adapter: vercel(),
})
