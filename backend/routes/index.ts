import express from 'express';
import type { Express } from 'express';
import { createServer, type Server } from 'http';

// Import route modules
import clientBookingsRouter from './client/bookings';
import clientProfileRouter from './client/profile';
import providerDashboardRouter from './provider/dashboard';
import providerRidesRouter from './provider/rides';

// Import shared routes (auth, search, etc.)
import { verifyFirebaseToken } from '../middleware/role-auth';

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Routes de autenticação (públicas)
  app.post('/api/auth/action-roles', async (req, res) => {
    try {
      const { roles } = req.body;
      
      if (!roles || !Array.isArray(roles)) {
        return res.status(400).json({ 
          error: 'Campo roles é obrigatório e deve ser um array' 
        });
      }
      
      // Mock response - implementar lógica real
      res.json({
        success: true,
        message: 'Roles configurados com sucesso',
        roles
      });
    } catch (error) {
      console.error('Erro ao configurar roles:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });
  
  // Routes públicas de busca
  app.get('/api/search/rides', async (req, res) => {
    try {
      const { from, to, date, passengers } = req.query;
      
      // Mock data
      const rides = [
        {
          id: '1',
          from: from || 'Maputo',
          to: to || 'Matola',
          date: date || '2025-01-15',
          time: '08:00',
          driver: 'João Silva',
          vehicle: 'Toyota Hiace',
          price: 350,
          availableSeats: 5
        }
      ];
      
      res.json(rides);
    } catch (error) {
      console.error('Erro na busca de viagens:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });
  
  app.get('/api/search/accommodations', async (req, res) => {
    try {
      const { location, checkin, checkout, guests } = req.query;
      
      // Mock data
      const accommodations = [
        {
          id: '1',
          name: 'Hotel Exemplo',
          location: location || 'Maputo',
          price: 2500,
          rating: 4.5,
          amenities: ['WiFi', 'Piscina', 'Restaurante']
        }
      ];
      
      res.json(accommodations);
    } catch (error) {
      console.error('Erro na busca de hospedagem:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });
  
  // Routes de cliente (protegidas)
  app.use('/api/client/bookings', clientBookingsRouter);
  app.use('/api/client/profile', clientProfileRouter);
  
  // Routes de prestador (protegidas)  
  app.use('/api/provider/dashboard', providerDashboardRouter);
  app.use('/api/provider/rides', providerRidesRouter);
  
  // Route de teste de autenticação
  app.get('/api/auth/me', verifyFirebaseToken, async (req, res) => {
    try {
      const user = req.user;
      res.json(user);
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });
  
  // Criar servidor HTTP
  const httpServer = createServer(app);
  
  return httpServer;
}