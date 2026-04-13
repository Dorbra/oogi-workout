import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/oogi-workout/',
  plugins: [react(), tailwindcss()],
  define: {
    __APP_VERSION__: JSON.stringify(
      process.env.VITE_APP_VERSION ?? process.env.npm_package_version ?? '0.0.0'
    ),
  },
})
