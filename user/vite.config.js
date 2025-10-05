import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins:[react()],
  server: {
    host:'0.0.0.0',
    strictPort: true,
    port: 5173,
    hmr: {
      host: '0.0.0.0',
      protocol: 'ws',
      // clientPort: 443
    },
    cors: true,
    // Add allowed hosts
    origin: 'https://b5fe88c9ec31.ngrok-free.app'
  },
  // For Vite 5+, add allowedHosts in a separate property
  preview: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // Add your Ngrok domain to allowed hosts
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  // Add CSP headers with your Ngrok URL
  optimizeDeps: {
    exclude: [], // Add packages to exclude from optimization
  }
});
