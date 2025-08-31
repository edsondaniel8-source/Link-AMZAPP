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
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => {
          console.log(`🔄 API Request: ${path}`);
          return path;
        },
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('🔴 Backend não disponível, usando mock API');
            const url = req.url;
            const method = req.method;
            
            // Health check
            if (url === '/api/health') {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                status: 'OK',
                message: 'Link-A API funcionando (mock)',
                timestamp: new Date().toISOString(),
                version: '2.0.0',
                environment: 'development'
              }));
              return;
            }
            
            // Buscar viagens (GET)
            if (url.startsWith('/api/rides/search')) {
              const urlParams = new URLSearchParams(url.split('?')[1] || '');
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
            
            // Criar nova rota (POST)
            if (url === '/api/rides' && method === 'POST') {
              console.log('✅ Mock API: Criando nova rota');
              
              // Ler body da requisição
              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });
              
              req.on('end', () => {
                try {
                  const routeData = body ? JSON.parse(body) : {};
                  console.log('📝 Dados da rota recebidos:', routeData);
                  
                  const newRide = {
                    id: Date.now().toString(),
                    status: 'published',
                    createdAt: new Date().toISOString(),
                    message: 'Rota publicada com sucesso!',
                    ...routeData
                  };
                  
                  res.writeHead(201, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify(newRide));
                } catch (error) {
                  console.error('Erro ao processar dados:', error);
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: 'Erro interno do servidor' }));
                }
              });
              return;
            }
            
            // Erro 404 para outros endpoints
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
              error: 'API endpoint não encontrado',
              path: url
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