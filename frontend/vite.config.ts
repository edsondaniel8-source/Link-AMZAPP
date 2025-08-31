import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

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
    middlewareMode: false,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, req, res) => {
            console.log('🔴 Proxy error:', err.message);
            console.log('🔄 Fallback: Using mock API for', req.url);
            
            // Fallback para mock quando backend não está disponível
            if (req.url.startsWith('/api/health')) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                status: 'OK',
                message: 'Link-A API funcionando (fallback mock)',
                timestamp: new Date().toISOString(),
                version: '2.0.0',
                environment: 'development'
              }));
              return;
            }
            
            if (req.url.startsWith('/api/rides/search')) {
              const urlParams = new URLSearchParams(req.url.split('?')[1] || '');
              const from = urlParams.get('from') || 'Maputo';
              const to = urlParams.get('to') || 'Matola';
              
              console.log(`Mock API: Buscar viagens de ${from} para ${to}`);
              
              const mockRides = [
                {
                  id: '1',
                  type: 'Standard',
                  fromAddress: from,
                  toAddress: to,
                  price: '50.00',
                  estimatedDuration: 30,
                  availableSeats: 3,
                  driverName: 'João Silva',
                  vehicleInfo: 'Toyota Corolla Branco',
                  departureDate: new Date().toISOString()
                }
              ];
              
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                rides: mockRides,
                pagination: { page: 1, limit: 20, total: mockRides.length }
              }));
              return;
            }
            
            // POST para criar nova rota
            if (req.url === '/api/rides' && req.method === 'POST') {
              console.log('Mock API: Criando nova rota');
              
              // Simular criação bem-sucedida
              const newRide = {
                id: Date.now().toString(),
                status: 'published',
                createdAt: new Date().toISOString(),
                message: 'Rota publicada com sucesso!'
              };
              
              res.writeHead(201, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(newRide));
              return;
            }
            
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
              error: 'API endpoint não encontrado (fallback)',
              path: req.url
            }));
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('🔄 Proxying request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('✅ Proxy response:', proxyRes.statusCode, req.url);
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