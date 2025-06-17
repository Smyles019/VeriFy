import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Vite handles SPA fallback by default in dev
    // You only need history fallback for custom backends or production server
  },
});
