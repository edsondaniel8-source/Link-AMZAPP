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
    minify: 'esbuild',
    rollupOptions: {
      external: [],
      output: {
        manualChunks: (id) => {
          if (id.includes('@tanstack/react-query')) {
            return 'react-query';
          }
          if (id.includes('@radix-ui')) {
            return 'radix-ui';
          }
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react';
          }
          return undefined;
        },
      },
    },
    chunkSizeWarningLimit: 2000,
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  optimizeDeps: {
    include: [
      '@tanstack/react-query',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-select',
      '@radix-ui/react-progress', 
      '@radix-ui/react-dialog',
      '@radix-ui/react-slot',
      '@hookform/resolvers',
      '@hookform/resolvers/zod',
      'react-hook-form',
      'zod',
      'react',
      'react-dom'
    ],
    force: true,
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
    dedupe: [
      'react', 
      'react-dom', 
      '@tanstack/react-query',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-select', 
      '@radix-ui/react-progress',
      '@radix-ui/react-dialog',
      '@hookform/resolvers',
      'react-hook-form',
      'zod'
    ],
  },
  define: {
    global: "globalThis",
  },
});