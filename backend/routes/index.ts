import express from 'express';
import { createServer } from 'http';
import authRoutes from './auth';
import ridesRoutes from './rides';
import hotelsRoutes from './hotels';
import eventsRoutes from './events';
import bookingsRoutes from './bookings';
import highlightsRoutes from './highlights';
import billingRoutes from './billing';
import chatRoutes from './chat';
import pmsRoutes from './pms';
import { initializeChatService } from '../services/chatService';

export async function registerRoutes(app: express.Express) {
  // Centralizar todas as rotas da API
  app.use('/api/auth', authRoutes);
  app.use('/api/rides', ridesRoutes);
  app.use('/api/hotels', hotelsRoutes);
  app.use('/api/events', eventsRoutes);
  app.use('/api/bookings', bookingsRoutes);
  app.use('/api/billing', billingRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/pms', pmsRoutes);
  app.use('/', highlightsRoutes);

  // Rota delegada para highlights (implementada em highlights.ts)

  // Rota de estatísticas para o painel admin
  app.get('/api/admin/stats', async (req, res) => {
    try {
      // TODO: Implementar com dados reais da base de dados
      res.json({
        totalUsers: 1250,
        totalRides: 89,
        totalHotels: 23,
        totalEvents: 12,
        pendingApprovals: 5,
        monthlyRevenue: 45000,
        activeBookings: 156
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  const httpServer = createServer(app);
  
  // Inicializar sistema de chat WebSocket
  initializeChatService(httpServer);
  
  return httpServer;
}