/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // 'prompt' (instead of 'autoUpdate') means a new version never swaps
      // itself in silently under an open tab — the app decides when, via
      // the update banner in src/components/PwaUpdatePrompt.tsx, which
      // calls updateServiceWorker(true) when the person taps "Atualizar".
      registerType: 'prompt',
      // Lets `npm run dev` register a (dev-mode) service worker too, so the
      // install prompt / update flow can be tested without a full build.
      devOptions: { enabled: true, type: 'module' },
      includeAssets: ['favicon.ico', 'favicon.png', 'apple-touch-icon.png'],
      // The plugin generates and injects the <link rel="manifest"> itself —
      // this replaces the static public/site.webmanifest (same content).
      manifest: {
        name: 'Buddy',
        short_name: 'Buddy',
        description:
          'Um app de rotina, foco e bem-estar com sessões de foco, diário, respiração e um mascote que evolui com você.',
        theme_color: '#3F6B58',
        background_color: '#F1F7EF',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        lang: 'pt-BR',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        ],
      },
      workbox: {
        // Precaches the app shell (HTML/CSS/JS/icons) so it opens instantly
        // and works offline after the first visit. API calls to Supabase
        // are NOT cached here — they always go to the network, same as
        // before; only the app's own static files are served from cache.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        navigateFallback: '/index.html',
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
