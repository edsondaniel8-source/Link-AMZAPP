import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  plugins: [],
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
    target: 'es2020',
    loader: 'tsx',
  },
  root: ".",
  publicDir: "public",
  build: {
    outDir: "dist",
    sourcemap: false,
    target: 'es2020',
    rollupOptions: {
      external: [],
      output: {
        manualChunks: undefined,
      },
    },
    chunkSizeWarningLimit: 2000,
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 3000,
    host: "0.0.0.0",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "../attached_assets"),
    },
  },
  define: {
    global: "globalThis",
  },
});