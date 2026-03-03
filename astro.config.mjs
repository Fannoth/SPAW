import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import markdoc from '@astrojs/markdoc'
import tailwind from '@astrojs/tailwind'
import keystatic from '@keystatic/astro'
import node from '@astrojs/node'

export default defineConfig({
  integrations: [react(), markdoc(), tailwind(), keystatic()],
  output: 'static',
  adapter: node({ mode: 'standalone' }),
})
