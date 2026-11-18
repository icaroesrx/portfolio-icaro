import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative asset paths: the same build works at a domain root (Vercel) and
  // under a sub-path (GitHub Pages project sites) without any extra config.
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    // three.js ships in its own lazy-loaded chunk, which is larger than
    // Vite's default 500 kB warning threshold by design.
    chunkSizeWarningLimit: 1200,
  },
})
