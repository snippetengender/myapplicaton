import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
  },
  server: {
    host: "0.0.0.0",
    strictPort: true,
    port: 5173,
    hmr: {
      host: "0.0.0.0",
      protocol: "ws",
    },
    cors: true,
  },
});
