import express from 'express';
import { createServer } from 'http';

// ===== ROTAS COMPARTILHADAS =====
import sharedHealthRoutes from './shared/health';

// ===== NOVA API DRIZZLE UNIFICADA =====
import drizzleApiRoutes from './drizzle-api';

// ===== SISTEMAS FUNCIONAIS (manter compatibilidade) =====
import authRoutes from './auth';
import geoRoutes from './geo';
import billingRoutes from './billing';
import chatRoutes from './chat';
import pmsRoutes from './pms';
import { initializeChatService } from '../services/chatService';

export async function registerRoutes(app: express.Express) {
  // ===== ROTAS COMPARTILHADAS =====
  app.use('/api/health', sharedHealthRoutes);
  console.log('✅ Rotas básicas registradas com sucesso');

  // ===== NOVA API DRIZZLE UNIFICADA (principal) =====
  app.use('/api/rides-simple', drizzleApiRoutes); // Compatibilidade com frontend
  app.use('/api/drizzle', drizzleApiRoutes); // Nova API principal
  console.log('🗃️ API Drizzle principal configurada');

  // ===== SISTEMAS FUNCIONAIS (manter compatibilidade) =====
  app.use('/api/auth-legacy', authRoutes); // Auth legado
  app.use('/api/geo', geoRoutes); // Geolocalização para Moçambique
  app.use('/api/billing', billingRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/pms', pmsRoutes);

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