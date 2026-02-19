import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Exclude server functions from the build - they run on Supabase
    rollupOptions: {
      external: [
        /^jsr:/,
        /^npm:/,
        /^node:/,
      ],
      // Ensure server files are not included
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
  // Don't scan server directory for dependencies
  optimizeDeps: {
    exclude: ['supabase/functions/server'],
  },
});