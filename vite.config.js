import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    allowedHosts: [
      'f75919ef5060.ngrok-free.app',
      'ed0f05af4a9d.ngrok-free.app',
      '5d47d8d74bdd.ngrok-free.app',
      'f469d948f95a.ngrok-free.app',
      'localhost',
      '.ngrok-free.app',
      '.ngrok.io',
      'all'
    ],
    hmr: {
      clientPort: 5173
    }
  }
})
