import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Import backend routes
import { registerRoutes } from './backend/routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 8000; // Porta que o proxy Vite espera

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos do frontend build
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Link-A Backend API funcionando',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// Registrar todas as rotas da API
async function startServer() {
  try {
    console.log('🚀 Inicializando Link-A Backend...');
    
    // Registrar rotas da API
    const server = await registerRoutes(app);
    
    // SPA Catch-all handler - serve index.html para rotas não-API
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ 
          error: 'API endpoint não encontrado',
          path: req.path 
        });
      }
      
      // Para qualquer outra rota, servir index.html (React SPA)
      res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
    });
    
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🌐 Link-A Backend Server running on port ${PORT}`);
      console.log(`📱 Frontend: http://localhost:${PORT}/`);
      console.log(`🔌 API: http://localhost:${PORT}/api/`);
      console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
      console.log('✅ Todas as APIs configuradas e funcionando');
    });
  } catch (error) {
    console.error('❌ Erro ao inicializar servidor:', error);
    process.exit(1);
  }
}

startServer();