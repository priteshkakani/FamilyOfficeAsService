import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/", // Use root for Vercel/Netlify
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'), // Points to project root to match tsconfig
      'react': path.resolve("./node_modules/react"),
      'react-dom': path.resolve("./node_modules/react-dom"),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0', // Listen on all network interfaces
    strictPort: true, // Don't try other ports if 3000 is in use
    open: true,
    proxy: {
      // Proxy /api to backend (FastAPI) in development
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
  build: {
    outDir: "dist",
  },
});
