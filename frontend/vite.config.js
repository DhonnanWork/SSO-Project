// frontend/vite.config.js (Final)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // Penting: Memberitahu Vite untuk listen di semua alamat jaringan
    hmr: {
      clientPort: 3000, // Penting: Memberitahu klien HMR untuk selalu terhubung ke port 3000
    },
  }
})