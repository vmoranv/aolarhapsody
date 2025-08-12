import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load all env variables from .env files
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(
        mode === 'production' ? process.env.VITE_API_URL : env.VITE_API_URL
      ),
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          landing: path.resolve(__dirname, 'landing.html'),
        },
      },
    },
    server: {
      proxy: {
        '/api': {
          // This proxy is ONLY for local development.
          // It reads from VITE_API_URL in your local .env file.
          // If not found, it defaults to the local backend.
          target: env.VITE_API_URL || 'http://localhost:3000',
          changeOrigin: true,
        },
        '/proxy': {
          target: 'https://aola.100bt.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxy/, ''),
        },
      },
    },
  };
});
