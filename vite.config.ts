import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');

  // --- CONFIGURATION CLÉ API ---
  env.API_KEY = "AIzaSyCCvmXCSiyQub7R8sjFVNxD4j50DOmGGn8";

  return {
    // base '/' est essentiel pour le routage SPA sur les serveurs
    base: '/',
    plugins: [react()],
    define: {
      'process.env': env
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      target: 'es2020',
      sourcemap: mode === 'development',
    }
  };
});