import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
    dedupe: ['react', 'react-dom'],
    preserveSymlinks: true,
  },
  server: {
    proxy: {
      '/api': process.env.API_ORIGIN ?? 'http://127.0.0.1:3001',
    },
  },
})
