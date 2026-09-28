import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:8084',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:8084',
        changeOrigin: true,
      },
      '/gateway-proxy': {
        target: 'http://localhost:8084',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gateway-proxy/, '')
      },
      '/actuator': {
        target: 'http://localhost:8084',
        changeOrigin: true
      }
    }
  }
})
