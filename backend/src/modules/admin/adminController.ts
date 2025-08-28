import { Router } from "express";
import { verifyFirebaseToken, type AuthenticatedRequest } from "../../shared/firebaseAuth";
import { storage } from "../../shared/storage";

const router = Router();

// Dashboard administrativo
router.get('/dashboard', verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const userId = authReq.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "User ID not found" });
    }

    // Verificar se é admin
    const user = await storage.getUser(userId);
    if (!user || user.userType !== 'admin') {
      return res.status(403).json({ message: "Acesso negado" });
    }

    const stats = {
      totalUsers: 12456,
      dailyTransactions: 1234,
      totalRevenue: 2500000.00,
      growthRate: 18.5,
      sectorStats: {
        transport: {
          activeDrivers: 1245,
          dailyRides: 3456,
          revenue: 850000.00
        },
        accommodation: {
          partnerHotels: 156,
          dailyBookings: 234,
          revenue: 1200000.00
        },
        events: {
          organizers: 89,
          activeEvents: 67,
          revenue: 450000.00
        }
      },
      recentActivity: [
        {
          id: "activity-1",
          type: "approval",
          title: "Novo hotel aprovado",
          description: "Hotel Maputo Plaza foi aprovado e está ativo",
          time: "há 15 minutos",
          status: "success"
        },
        {
          id: "activity-2",
          type: "verification",
          title: "Novo motorista verificado",
          description: "João Silva completou a verificação",
          time: "há 32 minutos",
          status: "info"
        },
        {
          id: "activity-3",
          type: "issue",
          title: "Relatório de problema",
          description: "Usuário reportou problema com pagamento",
          time: "há 1 hora",
          status: "warning"
        }
      ],
      pendingTasks: [
        {
          id: "pending-1",
          type: "verification",
          title: "5 verificações de motorista pendentes",
          description: "Documentos aguardando análise",
          priority: "medium"
        },
        {
          id: "pending-2",
          type: "dispute",
          title: "3 disputas de pagamento", 
          description: "Requer intervenção administrativa",
          priority: "high"
        },
        {
          id: "pending-3",
          type: "approval",
          title: "2 hotéis aguardando aprovação",
          description: "Novos parceiros para análise",
          priority: "low"
        }
      ]
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({ message: "Erro ao carregar dashboard" });
  }
});

// Gestão de usuários
router.get('/users', verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const userId = authReq.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "User ID not found" });
    }

    const { page = 1, limit = 20, type, status } = req.query;

    // TODO: Implementar busca real de usuários com filtros
    const users = [
      {
        id: "user-1",
        name: "João Silva",
        email: "joao@email.com",
        type: "driver",
        status: "verified",
        joinDate: "2024-07-15",
        lastActivity: "há 2 horas"
      },
      {
        id: "user-2",
        name: "Maria Santos",
        email: "maria@email.com", 
        type: "client",
        status: "active",
        joinDate: "2024-08-01",
        lastActivity: "há 1 dia"
      }
    ];

    res.json({
      success: true,
      users,
      pagination: {
        total: 12456,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: 623
      }
    });
  } catch (error) {
    console.error("Admin users error:", error);
    res.status(500).json({ message: "Erro ao carregar usuários" });
  }
});

// Aprovar usuário/serviço
router.post('/approve/:userId', verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const { userId: targetUserId } = req.params;
    const adminId = authReq.user?.claims?.sub;

    if (!adminId) {
      return res.status(401).json({ message: "User ID not found" });
    }

    // Verificar se é admin
    const admin = await storage.getUser(adminId);
    if (!admin || admin.userType !== 'admin') {
      return res.status(403).json({ message: "Acesso negado" });
    }

    // TODO: Implementar aprovação real
    const approvedUser = await storage.getUser(targetUserId);
    if (!approvedUser) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json({
      success: true,
      message: "Usuário aprovado com sucesso",
      user: approvedUser
    });
  } catch (error) {
    console.error("Admin approve error:", error);
    res.status(500).json({ message: "Erro ao aprovar usuário" });
  }
});

// Estatísticas do sistema
router.get('/analytics', verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const userId = authReq.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "User ID not found" });
    }

    const analytics = {
      userGrowth: {
        total: 12456,
        monthlyGrowth: 8.5,
        weeklyGrowth: 2.1
      },
      revenueGrowth: {
        total: 2500000.00,
        monthlyGrowth: 22.3,
        weeklyGrowth: 5.7
      },
      transactionVolume: {
        daily: 1234,
        weekly: 8945,
        monthly: 38720
      },
      sectorPerformance: [
        { sector: "Transport", revenue: 850000, growth: 15.2 },
        { sector: "Hotels", revenue: 1200000, growth: 22.8 },
        { sector: "Events", revenue: 450000, growth: 18.1 }
      ]
    };

    res.json({
      success: true,
      analytics
    });
  } catch (error) {
    console.error("Admin analytics error:", error);
    res.status(500).json({ message: "Erro ao carregar relatórios" });
  }
});

export default router;