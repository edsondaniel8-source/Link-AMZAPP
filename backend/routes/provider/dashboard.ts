import { Router } from 'express';
import { verifyFirebaseToken, requireProviderRole } from '../../middleware/role-auth';

const router = Router();

// Aplicar middleware de autenticação
router.use(verifyFirebaseToken);
router.use(requireProviderRole);

// GET /api/provider/dashboard - Dados do dashboard do prestador
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.uid;
    const userRoles = req.user?.roles || [];
    
    // Mock data baseado nos roles do usuário
    const dashboardData = {
      user: {
        id: userId,
        roles: userRoles
      },
      stats: {},
      recentActivity: []
    };
    
    // Estatísticas específicas por role
    if (userRoles.includes('driver')) {
      dashboardData.stats = {
        ...dashboardData.stats,
        totalRides: 85,
        completedRides: 78,
        pendingRides: 7,
        rating: 4.8,
        earnings: {
          today: 2500,
          thisWeek: 15000,
          thisMonth: 45000
        }
      };
      
      dashboardData.recentActivity.push({
        type: 'ride_completed',
        description: 'Viagem Maputo → Matola concluída',
        time: '2025-01-15 10:30',
        amount: 350
      });
    }
    
    if (userRoles.includes('hotel_manager')) {
      dashboardData.stats = {
        ...dashboardData.stats,
        totalBookings: 45,
        activeBookings: 12,
        occupancyRate: 78,
        averageRating: 4.6,
        revenue: {
          today: 8500,
          thisWeek: 45000,
          thisMonth: 180000
        }
      };
      
      dashboardData.recentActivity.push({
        type: 'booking_received',
        description: 'Nova reserva para 20-25 Janeiro',
        time: '2025-01-15 14:20',
        amount: 4500
      });
    }
    
    res.json(dashboardData);
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/provider/analytics - Análises detalhadas
router.get('/analytics', async (req, res) => {
  try {
    const userId = req.user?.uid;
    const { period = '30d' } = req.query;
    
    // Mock data
    const analytics = {
      period,
      earnings: [
        { date: '2025-01-01', amount: 1500 },
        { date: '2025-01-02', amount: 2300 },
        { date: '2025-01-03', amount: 1800 }
      ],
      performance: {
        completionRate: 95,
        cancelationRate: 5,
        averageRating: 4.7,
        responseTime: '3 min'
      }
    };
    
    res.json(analytics);
  } catch (error) {
    console.error('Erro ao buscar analytics:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;