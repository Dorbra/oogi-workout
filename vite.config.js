import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

const pkg = JSON.parse(
  readFileSync(fileURLToPath(new URL('./package.json', import.meta.url)), 'utf-8')
)

// Emits dist/version.json with the current app version so the client can
// detect stale builds without relying solely on the service-worker update cycle.
function versionJsonPlugin() {
  return {
    name: 'emit-version-json',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: JSON.stringify({ v: pkg.version }),
      })
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    versionJsonPlugin(),
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
        // version.json must never be precached — the client fetches it fresh
        // on every focus to detect stale builds and force a reload.
        globIgnores: ['**/version.json'],
        // Serve cached index.html for all navigations (SPA fallback).
        // The new content reaches users via the update cycle: reg.update() →
        // new SW installs → skipWaiting → controllerchange → page reload.
        navigateFallback: 'index.html',
        // Take over immediately — don't wait for all tabs to close.
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        // Always fetch version.json from the network — never serve from cache.
        runtimeCaching: [{
          urlPattern: /\/version\.json(\?.*)?$/,
          handler: 'NetworkOnly',
        }],
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
