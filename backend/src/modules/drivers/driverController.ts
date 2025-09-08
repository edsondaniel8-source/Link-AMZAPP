import { Router } from "express";
import { verifyFirebaseToken, type AuthenticatedRequest } from "../../shared/firebaseAuth";
import { storage } from "../../../storage";

const router = Router();

// Dashboard do motorista
router.get('/dashboard', verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const userId = authReq.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "User ID not found" });
    }

    // Estatísticas do motorista
    const stats = {
      today: {
        rides: 12,
        earnings: 2450.00,
        hoursOnline: "8h 30m"
      },
      pendingRequests: [
        {
          id: "req-1",
          passenger: "Maria Silva",
          from: "Maputo",
          to: "Beira", 
          passengers: 2,
          departure: "2024-08-30T08:00:00Z",
          price: 1250.00
        },
        {
          id: "req-2", 
          passenger: "João Pedro",
          from: "Maputo",
          to: "Xai-Xai",
          passengers: 1,
          departure: "2024-08-30T14:00:00Z", 
          price: 450.00
        }
      ],
      completedToday: [
        {
          id: "ride-1",
          passenger: "Ana Costa",
          from: "Maputo Centro",
          to: "Aeroporto",
          completedAt: "09:30",
          earnings: 150.00
        },
        {
          id: "ride-2",
          passenger: "Carlos Silva", 
          from: "Matola",
          to: "Polana",
          completedAt: "11:15",
          earnings: 180.00
        }
      ]
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error("Driver dashboard error:", error);
    res.status(500).json({ message: "Erro ao carregar dashboard" });
  }
});

// Aceitar solicitação de viagem
router.post('/accept-ride/:requestId', verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const { requestId } = req.params;
    const driverId = authReq.user?.claims?.sub;

    if (!driverId) {
      return res.status(401).json({ message: "User ID not found" });
    }

    // TODO: Implementar lógica de aceitar viagem
    
    res.json({
      success: true,
      message: "Viagem aceita com sucesso",
      rideId: requestId
    });
  } catch (error) {
    console.error("Accept ride error:", error);
    res.status(500).json({ message: "Erro ao aceitar viagem" });
  }
});

// Recusar solicitação de viagem
router.post('/reject-ride/:requestId', verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const { requestId } = req.params;
    const { reason } = req.body;
    const driverId = authReq.user?.claims?.sub;

    if (!driverId) {
      return res.status(401).json({ message: "User ID not found" });
    }

    // TODO: Implementar lógica de recusar viagem
    
    res.json({
      success: true,
      message: "Viagem recusada",
      requestId
    });
  } catch (error) {
    console.error("Reject ride error:", error);
    res.status(500).json({ message: "Erro ao recusar viagem" });
  }
});

// Histórico de viagens do motorista
router.get('/rides-history', verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const driverId = authReq.user?.claims?.sub;
    if (!driverId) {
      return res.status(401).json({ message: "User ID not found" });
    }

    const { page = 1, limit = 10 } = req.query;

    // TODO: Buscar histórico real do banco
    const mockHistory = {
      rides: [
        {
          id: "ride-001",
          passenger: "Maria Santos",
          from: "Maputo",
          to: "Beira",
          date: "2024-08-28",
          earnings: 1250.00,
          rating: 5,
          status: "completed"
        },
        {
          id: "ride-002", 
          passenger: "João Silva",
          from: "Maputo",
          to: "Matola",
          date: "2024-08-28",
          earnings: 180.00,
          rating: 4,
          status: "completed"
        }
      ],
      pagination: {
        total: 156,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: 16
      }
    };

    res.json({
      success: true,
      ...mockHistory
    });
  } catch (error) {
    console.error("Driver rides history error:", error);
    res.status(500).json({ message: "Erro ao carregar histórico" });
  }
});

// Ganhos do motorista
router.get('/earnings', verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const driverId = authReq.user?.claims?.sub;
    if (!driverId) {
      return res.status(401).json({ message: "User ID not found" });
    }

    const earnings = {
      today: 2450.00,
      thisWeek: 12300.00,
      thisMonth: 45600.00,
      total: 234500.00,
      breakdown: {
        rides: 2100.00,
        tips: 250.00,
        bonuses: 100.00
      },
      weeklyChart: [
        { day: "Seg", amount: 1200 },
        { day: "Ter", amount: 1800 },
        { day: "Qua", amount: 2100 },
        { day: "Qui", amount: 1950 },
        { day: "Sex", amount: 2750 },
        { day: "Sáb", amount: 3200 },
        { day: "Dom", amount: 1500 }
      ]
    };

    res.json({
      success: true,
      earnings
    });
  } catch (error) {
    console.error("Driver earnings error:", error);
    res.status(500).json({ message: "Erro ao carregar ganhos" });
  }
});

export default router;