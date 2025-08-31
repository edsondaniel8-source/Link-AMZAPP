import express from 'express';
import { createServer } from 'http';

// ===== NOVA ESTRUTURA ORGANIZACIONAL POR ROLES =====
// Client Routes
import clientRidesRoutes from './client/rides';
import clientBookingsRoutes from './client/bookings';

// Driver Routes  
import driverRidesRoutes from './driver/rides';
import driverVehiclesRoutes from './driver/vehicles';

// Hotel Routes
import hotelAvailabilityRoutes from './hotel/availability';
import hotelBookingsRoutes from './hotel/bookings';

// Admin Routes
import adminDashboardRoutes from './admin/dashboard';
import adminUsersRoutes from './admin/users';

// Shared Routes
import sharedAuthRoutes from './shared/auth';
import sharedHealthRoutes from './shared/health';

// ===== SISTEMAS LEGADOS (manter compatibilidade) =====
import authRoutes from './auth';
import ridesRoutes from './rides';
import simplifiedRidesRoutes from './simplified-rides';
import unifiedRidesRoutes from './unified-rides';
import unifiedAccommodationsRoutes from './unified-accommodations';
import unifiedBookingsRoutes from './unified-bookings-manager';
import geoRoutes from './geo';
import hotelsRoutes from './hotels';
import eventsRoutes from './events';
import bookingsRoutes from './bookings';
import highlightsRoutes from './highlights';
import billingRoutes from './billing';
import chatRoutes from './chat';
import pmsRoutes from './pms';
import { initializeChatService } from '../services/chatService';

export async function registerRoutes(app: express.Express) {
  // ===== NOVA ESTRUTURA ORGANIZACIONAL POR ROLES =====
  console.log('🔧 Registrando rotas organizadas por roles...');
  
  // Client APIs - Para clientes buscarem e reservarem serviços
  app.use('/api/client/rides', clientRidesRoutes);
  app.use('/api/client/bookings', clientBookingsRoutes);
  
  // Driver APIs - Para motoristas gerirem viagens e veículos
  app.use('/api/driver/rides', driverRidesRoutes);
  app.use('/api/driver/vehicles', driverVehiclesRoutes);
  
  // Hotel APIs - Para gestores de alojamentos
  app.use('/api/hotel/availability', hotelAvailabilityRoutes);
  app.use('/api/hotel/bookings', hotelBookingsRoutes);
  
  // Admin APIs - Para administradores da plataforma
  app.use('/api/admin/dashboard', adminDashboardRoutes);
  app.use('/api/admin/users', adminUsersRoutes);
  
  // Shared APIs - Funcionalidades compartilhadas
  app.use('/api/auth', sharedAuthRoutes);
  app.use('/api/health', sharedHealthRoutes);
  
  console.log('✅ Rotas organizadas por roles registradas com sucesso');

  // ===== SISTEMA UNIFICADO LINK-A (manter funcionando) =====
  app.use('/api/unified/rides', unifiedRidesRoutes); // Sistema de viagens unificado
  app.use('/api/unified/accommodations', unifiedAccommodationsRoutes); // Sistema de alojamentos
  app.use('/api/unified/bookings', unifiedBookingsRoutes); // Sistema de reservas unificado
  
  // ===== SISTEMAS LEGADOS (manter compatibilidade) =====
  app.use('/api/auth-legacy', authRoutes); // Auth legado
  app.use('/api/rides', ridesRoutes); // Sistema antigo - deprecado
  app.use('/api/rides-simple', simplifiedRidesRoutes); // Sistema simplificado - deprecado
  app.use('/api/geo', geoRoutes); // Geolocalização para Moçambique
  app.use('/api/hotels', hotelsRoutes); // Sistema antigo de hotéis - deprecado
  app.use('/api/events', eventsRoutes);
  app.use('/api/bookings', bookingsRoutes); // Sistema antigo de reservas - deprecado
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