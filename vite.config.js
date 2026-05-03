import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

const pkg = JSON.parse(
  readFileSync(fileURLToPath(new URL('./package.json', import.meta.url)), 'utf-8')
)

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // Registration + all update logic lives in main.jsx so it is part of the
      // content-hashed app bundle. registerSW.js is still generated but not
      // injected; the bundle takes over.
      injectRegister: false,
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Oogi Workout',
        short_name: 'Oogi',
        description: 'Home workout timer with guided sets, rest, and audio cues',
        theme_color: '#030f14',
        background_color: '#030f14',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Precache all static assets including the HTML shell.
        globPatterns: ['**/*.{js,css,html,svg,json,woff2}'],
        // Serve cached index.html for all navigations (SPA fallback).
        // The new content reaches users via the update cycle: reg.update() →
        // new SW installs → skipWaiting → controllerchange → page reload.
        navigateFallback: 'index.html',
        // Take over immediately — don't wait for all tabs to close.
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  test: {
    environment: 'node',
  },
})
