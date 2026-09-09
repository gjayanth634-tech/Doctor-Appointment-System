import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite dev server runs on 5173 by default.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Optional: proxy /api to backend so you can also call relative URLs.
      '/api': 'http://localhost:5000'
    }
  }
});
