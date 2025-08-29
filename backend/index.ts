import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Import routes function
import { registerRoutes } from "./routes.js";

const app = express();
const PORT = parseInt(process.env.PORT || '8000', 10);

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware - CORS configurado para Railway e desenvolvimento
app.use(cors({
  origin: [
    // Domínios de produção
    'https://link-aturismomoz.com',
    'https://www.link-aturismomoz.com',
    'https://link-amzapp.vercel.app',
    'https://link-amzapp-git-main-brunooliveira3s-projects.vercel.app',
    // Todos os deploys do Vercel
    /https:\/\/link-amzapp-.*\.vercel\.app$/,
    // Railway backend URL
    process.env.CORS_ORIGIN || 'https://link-amzapp-production.up.railway.app',
    // Desenvolvimento
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:8000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos do frontend build
app.use(express.static(path.join(__dirname)));

// API Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Link-A Backend API funcionando',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Função principal do servidor
async function startServer() {
  try {
    console.log('🚀 Inicializando Link-A Backend...');
    
    // Registrar todas as rotas da API
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
      res.sendFile(path.join(__dirname, 'index.html'));
    });
    
    // Iniciar servidor
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

// Iniciar servidor
startServer();

export default app;