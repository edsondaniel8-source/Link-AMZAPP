import express from "express";
import cors from "cors";
import { createServer } from "http";

// Import modular controllers
import authController from "./src/modules/auth/authController";
import clientController from "./src/modules/clients/clientController";
import driverController from "./src/modules/drivers/driverController";
import hotelController from "./src/modules/hotels/hotelController";
import eventController from "./src/modules/events/eventController";
import adminController from "./src/modules/admin/adminController";

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: [
    'https://link-aturismomoz.com',
    'https://link-amzapp.vercel.app',
    'https://link-amzapp-git-main-brunooliveira3s-projects.vercel.app',
    /https:\/\/link-amzapp-.*\.vercel\.app$/,
    'http://localhost:3000', // Frontend separado
    'http://localhost:5000'  // Development fallback
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Link-A API Backend funcionando',
    timestamp: new Date().toISOString(),
    version: '2.0.0-hybrid'
  });
});

// Mount modular routes
app.use('/api/auth', authController);
app.use('/api/clients', clientController);  
app.use('/api/drivers', driverController);
app.use('/api/hotels', hotelController);
app.use('/api/events', eventController);
app.use('/api/admin', adminController);

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error:', err);
  res.status(500).json({
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Endpoint não encontrado',
    path: req.originalUrl
  });
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