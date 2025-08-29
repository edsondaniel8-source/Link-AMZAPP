import express from 'express';
import { createServer } from 'http';
import authRoutes from './auth.js';
import ridesRoutes from './rides.js';
import hotelsRoutes from './hotels.js';
import eventsRoutes from './events.js';
import bookingsRoutes from './bookings.js';

export async function registerRoutes(app: express.Express) {
  // Centralizar todas as rotas da API
  app.use('/api/auth', authRoutes);
  app.use('/api/rides', ridesRoutes);
  app.use('/api/hotels', hotelsRoutes);
  app.use('/api/events', eventsRoutes);
  app.use('/api/bookings', bookingsRoutes);

  // API de destaque para homepage
  app.get('/api/highlights', async (req, res) => {
    try {
      // Buscar dados em paralelo para a homepage
      const [featuredEvents, topRides, topHotels] = await Promise.all([
        // Eventos em destaque (será implementado com dados reais)
        Promise.resolve([
          { id: '1', name: 'Festival de Marrabenta', location: 'Maputo', date: '2024-02-10', price: 500, image: '🎵' },
          { id: '2', name: 'Feira Artesanal', location: 'Beira', date: '2024-02-15', price: 200, image: '🎨' },
          { id: '3', name: 'Concerto de Música', location: 'Nampula', date: '2024-02-20', price: 750, image: '🎤' }
        ]),
        
        // Melhores ofertas de viagens da semana
        Promise.resolve([
          { id: '1', from: 'Maputo', to: 'Beira', price: 1500, date: '2024-01-15', driver: 'João M.', rating: 4.8 },
          { id: '2', from: 'Nampula', to: 'Nacala', price: 800, date: '2024-01-16', driver: 'Maria S.', rating: 4.9 },
          { id: '3', from: 'Tete', to: 'Chimoio', price: 1200, date: '2024-01-17', driver: 'Carlos A.', rating: 4.7 }
        ]),
        
        // Melhores ofertas de alojamento da semana
        Promise.resolve([
          { id: '1', name: 'Hotel Marisol', location: 'Maputo', price: 3500, rating: 4.6, image: '🏨' },
          { id: '2', name: 'Pensão Oceano', location: 'Beira', price: 2200, rating: 4.4, image: '🏖️' },
          { id: '3', name: 'Lodge Safari', location: 'Gorongosa', price: 4800, rating: 4.9, image: '🦁' }
        ])
      ]);

      res.json({
        featuredEvents,
        topRides,
        topHotels,
        popularDestinations: [
          'Maputo', 'Beira', 'Nampula', 'Tete', 'Chimoio', 'Nacala'
        ]
      });
    } catch (error) {
      console.error('Erro ao buscar destaques:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

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
  return httpServer;
}