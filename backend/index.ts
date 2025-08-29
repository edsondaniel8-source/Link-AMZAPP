import express from "express";
import cors from "cors";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

// Import modular controllers
import authController from "./src/modules/auth/authController";
import clientController from "./src/modules/clients/clientController";
import driverController from "./src/modules/drivers/driverController";
import hotelController from "./src/modules/hotels/hotelController";
import eventController from "./src/modules/events/eventController";
import adminController from "./src/modules/admin/adminController";

const app = express();
const PORT = process.env.PORT || 8000;

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware - CORS configurado para Railway e Vercel
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
    'http://localhost:5000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Link-A API Backend funcionando',
    timestamp: new Date().toISOString(),
    version: '2.0.0-hybrid',
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    cors: {
      origin: process.env.CORS_ORIGIN || 'Railway auto-configured'
    }
  });
});

// API Health check específico
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Link-A API routes funcionando',
    timestamp: new Date().toISOString(),
    availableRoutes: [
      '/api/auth',
      '/api/clients',
      '/api/drivers', 
      '/api/hotels',
      '/api/events',
      '/api/admin'
    ]
  });
});

// Mount modular routes
app.use('/api/auth', authController);
app.use('/api/clients', clientController);  
app.use('/api/drivers', driverController);
app.use('/api/hotels', hotelController);
app.use('/api/events', eventController);
app.use('/api/admin', adminController);

// Serve static files from React build (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'dist')));

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error:', err);
  res.status(500).json({
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// SPA Catch-all handler - serve index.html for all non-API routes
app.get('*', (req, res) => {
  // Don't intercept API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ 
      error: 'API endpoint não encontrado',
      path: req.path 
    });
  }
  
  // For any other route, serve index.html (React SPA)
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Link-A Backend API running on port ${PORT}`);
  console.log(`📱 Client API: http://localhost:${PORT}/api/clients`);
  console.log(`🚗 Driver API: http://localhost:${PORT}/api/drivers`);
  console.log(`🏨 Hotel API: http://localhost:${PORT}/api/hotels`);
  console.log(`🎪 Event API: http://localhost:${PORT}/api/events`);
  console.log(`⚙️ Admin API: http://localhost:${PORT}/api/admin`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
});

export default app;