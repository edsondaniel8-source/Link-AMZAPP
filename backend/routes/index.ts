import express from 'express';
import { createServer } from 'http';

// ===== ROTAS COMPARTILHADAS =====
import sharedHealthRoutes from './shared/health';

// ===== NOVA API DRIZZLE UNIFICADA =====
import drizzleApiRoutes from './drizzle-api';

// ===== SISTEMAS FUNCIONAIS (Firebase Auth apenas) =====
import authRoutes from './auth';
import bookingsRoutes from './bookings';
import geoRoutes from './geo';
import billingRoutes from './billing';
import chatRoutes from './chat';
import pmsRoutes from './pms';

// ===== SISTEMA DE HOTELS =====
import hotelController from '../src/modules/hotels/hotelController';

// ===== NOVAS IMPORTACOES PARA PROVIDER/DRIVER =====
import providerRidesRoutes from './provider/rides';
import providerDashboardRoutes from './provider/dashboard';
import rideController from '../src/modules/rides/rideController';
import driverController from '../src/modules/drivers/driverController';

import { initializeChatService } from '../services/chatService';

export async function registerRoutes(app: express.Express): Promise<void> {
  // ===== ROTAS COMPARTILHADAS =====
  app.use('/api/health', sharedHealthRoutes);
  console.log('✅ Rotas básicas registradas com sucesso');

  // ===== NOVA API DRIZZLE UNIFICADA (principal) =====
  app.use('/api/rides-simple', drizzleApiRoutes); // Compatibilidade com frontend
  app.use('/api/drizzle', drizzleApiRoutes); // Nova API principal
  console.log('🗃️ API Drizzle principal configurada');

  // ===== SISTEMAS FUNCIONAIS (Firebase Auth) =====
  app.use('/api/auth', authRoutes); // Firebase Auth
  app.use('/api/bookings', bookingsRoutes); // Sistema de reservas
  app.use('/api/geo', geoRoutes); // Geolocalização para Moçambique
  app.use('/api/billing', billingRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/pms', pmsRoutes);

  // ===== SISTEMA DE HOTELS =====
  app.use('/api/hotels', hotelController);
  console.log('🏨 Rotas de hotels registradas com sucesso');

  // ===== NOVAS ROTAS DE PROVIDER/DRIVER =====
  app.use('/api/provider/rides', providerRidesRoutes);
  app.use('/api/provider/dashboard', providerDashboardRoutes);
  app.use('/api/rides', rideController);
  app.use('/api/driver', driverController);
  console.log('🚗 Rotas de provider/driver registradas com sucesso');

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

  // Inicializar sistema de chat WebSocket apenas se necessário
  // initializeChatService será chamado quando o servidor HTTP for criado
  console.log('🔌 Rotas registradas - pronto para criar servidor HTTP');
}