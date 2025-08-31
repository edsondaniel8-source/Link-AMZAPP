import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { startApiServer } from "./server/api.js";

// Inicializar servidor API
let apiServer;
const API_PORT = 8001; // Usar porta diferente
if (process.env.NODE_ENV !== 'production') {
  try {
    apiServer = startApiServer(API_PORT);
    console.log(`🚀 API Server iniciado em desenvolvimento na porta ${API_PORT}`);
  } catch (error) {
    console.log('⚠️ Não foi possível iniciar API Server:', error.message);
  }
}

export default defineConfig({
  plugins: [react()],
  root: ".",
  publicDir: "public",
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-toast'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    host: "0.0.0.0",
    port: 5000,
    proxy: {
      '/api': {
        target: `http://localhost:${API_PORT || 8001}`,
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(`🔄 Proxying: ${req.method} ${req.url} → http://localhost:${API_PORT || 8001}`);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log(`✅ Response: ${proxyRes.statusCode} ${req.url}`);
          });
          proxy.on('error', (err, req, res) => {
            console.log(`🔴 Proxy error: ${err.message}`);
            res.writeHead(503, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
              error: 'Backend service temporarily unavailable',
              message: err.message,
              timestamp: new Date().toISOString()
            }));
          });
        },
      }
    }
  },
  preview: {
    port: 5000,
    host: "0.0.0.0",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@assets": path.resolve(__dirname, "../attached_assets"),
    },
  },
  define: {
    global: "globalThis",
  },
});