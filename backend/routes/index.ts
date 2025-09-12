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

// ===== NOVAS IMPORTACOES IDENTIFICADAS =====
import { PartnershipController } from '../src/modules/partnerships/partnershipController';
import { driverPartnershipRoutes } from '../src/modules/drivers/partnershipRoutes';
import { hotelPartnershipRoutes } from '../src/modules/hotels/partnershipRoutes';
import clientController from '../src/modules/clients/clientController';
import adminController from '../src/modules/admin/adminController';
import eventController from '../src/modules/events/eventController';
import userController from '../src/modules/users/userController';

// ===== ROTAS INDIVIDUAIS DA RAIZ =====
import adminRoutes from '../adminRoutes';
import paymentRoutes from '../paymentRoutes';
import profileRoutes from '../profileRoutes';
import searchRoutes from '../searchRoutes';

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

  // ===== ROTAS DE PARCERIAS =====
  const partnershipController = new PartnershipController();
  const partnershipRouter = express.Router();
  
  partnershipRouter.get('/proposals/available', partnershipController.getAvailableProposals);
  partnershipRouter.get('/proposals/my', partnershipController.getMyProposals);
  
  app.use('/api/partnerships', partnershipRouter);
  app.use('/api/driver/partnership', driverPartnershipRoutes);
  app.use('/api/hotel/partnership', hotelPartnershipRoutes);
  console.log('🤝 Rotas de parceria registradas com sucesso');

  // ===== ROTAS DE CLIENTES =====
  app.use('/api/clients', clientController);
  console.log('👥 Rotas de clientes registradas com sucesso');

  // ===== ROTAS DE ADMINISTRAÇÃO =====
  app.use('/api/admin/system', adminController);
  console.log('👨‍💼 Rotas de administração registradas com sucesso');

  // ===== ROTAS DE EVENTOS =====
  app.use('/api/events', eventController);
  console.log('🎉 Rotas de eventos registradas com sucesso');

  // ===== ROTAS DE USUÁRIOS =====
  app.use('/api/users', userController);
  console.log('👤 Rotas de usuários registradas com sucesso');

  // ===== ROTAS INDIVIDUAIS DA RAIZ =====
  app.use('/api/admin-legacy', adminRoutes);
  app.use('/api/payment', paymentRoutes);
  app.use('/api/profile', profileRoutes);
  app.use('/api/search', searchRoutes);
  console.log('📁 Rotas individuais registradas com sucesso');

  // ===== ROTA DE ESTATÍSTICAS ADMIN =====
  app.get('/api/admin/stats', async (req, res) => {
    try {
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

  console.log('🔌 Todas as rotas registradas - pronto para criar servidor HTTP');
}