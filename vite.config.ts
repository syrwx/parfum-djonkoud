import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement basées sur le mode (development, production)
  // process.cwd() pointe vers la racine du projet
  // Fix: Cast process to any to avoid TypeScript error 'Property cwd does not exist on type Process'
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    // Permet d'utiliser process.env.API_KEY dans le code React (ex: geminiService.ts)
    // même si c'est une application frontend pure après le build.
    define: {
      'process.env': env
    },
    server: {
      // Configuration pour le développement local
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
    build: {
      // Dossier de sortie pour la production
      outDir: 'dist',
    }
  };
});