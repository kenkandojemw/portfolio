import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base:'/',
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow access from any IP address
    port: 5173, // Specify port (optional, defaults to 5173)
    strictPort: false, // Allow fallback to other ports if 3000 is occupied
    cors: true, // Enable CORS for cross-origin requests
  },
  preview: {
    host: '0.0.0.0', // Also apply to preview mode
    port: 5173,
    strictPort: false,
  }
})
