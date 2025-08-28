import { Router } from "express";
import { verifyFirebaseToken, type AuthenticatedRequest } from "../../shared/firebaseAuth";
import { storage } from "../../shared/storage";

const router = Router();

// Dashboard do organizador de eventos
router.get('/dashboard', verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const userId = authReq.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "User ID not found" });
    }

    const stats = {
      activeEvents: 8,
      totalParticipants: 1245,
      totalRevenue: 85500.00,
      occupancyRate: 87,
      upcomingEvents: [
        {
          id: "event-1",
          title: "Festival de Música Moçambicana",
          venue: "Centro de Conferências",
          capacity: 500,
          sold: 450,
          date: "2024-08-30T19:00:00Z",
          price: 250.00
        },
        {
          id: "event-2",
          title: "Workshop de Fotografia", 
          venue: "Estúdio Arte",
          capacity: 25,
          sold: 18,
          date: "2024-09-02T09:00:00Z",
          price: 450.00
        }
      ],
      recentSales: [
        {
          id: "sale-1",
          event: "Festival de Música",
          buyer: "Ana Silva",
          tickets: 3,
          amount: 750.00,
          time: "há 5 minutos"
        },
        {
          id: "sale-2",
          event: "Workshop Fotografia",
          buyer: "Carlos Santos", 
          tickets: 1,
          amount: 450.00,
          time: "há 12 minutos"
        }
      ],
      weeklyPerformance: [
        { day: 'Dom', date: '25', sales: 12, revenue: '2.450' },
        { day: 'Seg', date: '26', sales: 8, revenue: '1.800' },
        { day: 'Ter', date: '27', sales: 15, revenue: '3.200' },
        { day: 'Qua', date: '28', sales: 22, revenue: '4.750' },
        { day: 'Qui', date: '29', sales: 18, revenue: '3.900' },
        { day: 'Sex', date: '30', sales: 35, revenue: '7.500' },
        { day: 'Sáb', date: '31', sales: 28, revenue: '6.100' }
      ]
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error("Event dashboard error:", error);
    res.status(500).json({ message: "Erro ao carregar dashboard" });
  }
});

// Lista de eventos do organizador
router.get('/events', verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const organizerId = authReq.user?.claims?.sub;
    if (!organizerId) {
      return res.status(401).json({ message: "User ID not found" });
    }

    // TODO: Implementar busca real de eventos
    const events = [
      {
        id: "event-1",
        title: "Festival de Música Moçambicana",
        description: "Celebração da música tradicional e moderna",
        date: "2024-08-30T19:00:00Z",
        venue: "Centro de Conferências",
        capacity: 500,
        ticketsSold: 450,
        price: 250.00,
        status: "active"
      }
    ];

    res.json({
      success: true,
      events
    });
  } catch (error) {
    console.error("Event list error:", error);
    res.status(500).json({ message: "Erro ao carregar eventos" });
  }
});

// Criar novo evento
router.post('/events', verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const organizerId = authReq.user?.claims?.sub;
    if (!organizerId) {
      return res.status(401).json({ message: "User ID not found" });
    }

    const {
      title,
      description,
      date,
      venue,
      capacity,
      price,
      imageUrl
    } = req.body;

    if (!title || !date || !venue || !capacity || !price) {
      return res.status(400).json({ 
        message: "Dados obrigatórios não fornecidos" 
      });
    }

    // TODO: Implementar criação real do evento
    const event = {
      id: `event-${Date.now()}`,
      title,
      description,
      date,
      venue,
      capacity,
      price,
      imageUrl,
      organizerId,
      status: "active",
      ticketsSold: 0,
      createdAt: new Date()
    };

    res.status(201).json({
      success: true,
      message: "Evento criado com sucesso",
      event
    });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({ message: "Erro ao criar evento" });
  }
});

// Inscrições/vendas de ingressos
router.get('/bookings', verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const organizerId = authReq.user?.claims?.sub;
    if (!organizerId) {
      return res.status(401).json({ message: "User ID not found" });
    }

    const bookings = await storage.getProviderBookings(organizerId);

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error("Event bookings error:", error);
    res.status(500).json({ message: "Erro ao carregar inscrições" });
  }
});

// Relatórios de evento
router.get('/analytics', verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const organizerId = authReq.user?.claims?.sub;
    if (!organizerId) {
      return res.status(401).json({ message: "User ID not found" });
    }

    const analytics = {
      totalEvents: 15,
      totalRevenue: 125000.00,
      totalAttendees: 2850,
      averageOccupancy: 82,
      monthlyGrowth: 18.5,
      topEvents: [
        {
          title: "Festival de Música",
          attendees: 450,
          revenue: 112500.00
        },
        {
          title: "Workshop Fotografia",
          attendees: 18,
          revenue: 8100.00
        }
      ]
    };

    res.json({
      success: true,
      analytics
    });
  } catch (error) {
    console.error("Event analytics error:", error);
    res.status(500).json({ message: "Erro ao carregar relatórios" });
  }
});

export default router;