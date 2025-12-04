import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:1323',
        changeOrigin: true,
        xfwd: true,
      },
    },
  },
  plugins: [react()],
})
