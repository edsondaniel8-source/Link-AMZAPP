import { Router, Request, Response, NextFunction } from "express";
import { storage } from "../../../storage";
// import { insertEventSchema } from "../../shared/storage";
import { z } from "zod";

const router = Router();

// Middleware de autenticação temporário
interface AuthenticatedRequest extends Request {
  user?: {
    claims?: {
      sub?: string;
      email?: string;
    };
  };
}

const verifyFirebaseToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Token não fornecido" });
  }
  
  // Mock validation - replace with real Firebase verification
  (req as AuthenticatedRequest).user = {
    claims: { sub: `firebase-${Date.now()}`, email: "test@linkamz.com" }
  };
  
  next();
};

// GET /api/events - Lista todos os eventos públicos com filtros
router.get("/", async (req, res) => {
  try {
    const { 
      eventType, 
      category, 
      status = 'approved', 
      isPublic = 'true',
      startDate,
      location,
      sortBy = 'startDate',
      page = 1, 
      limit = 20 
    } = req.query;

    const filters: any = {};
    
    if (eventType) filters.eventType = eventType;
    if (category) filters.category = category;
    if (status) filters.status = status;
    if (isPublic !== undefined) filters.isPublic = isPublic === 'true';
    if (startDate) filters.startDate = new Date(startDate as string);

    let events = await storage.event.getEventsByFilter(filters);
    
    // Filtros adicionais
    if (location) {
      events = events.filter(event => 
        event.location?.toLowerCase().includes((location as string).toLowerCase())
      );
    }
    
    // Ordenação personalizada
    if (sortBy === 'date_asc') {
      events = events.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
    } else if (sortBy === 'price_asc') {
      events = events.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortBy === 'popular') {
      events = events.sort((a, b) => (b.currentAttendees || 0) - (a.currentAttendees || 0));
    }
    
    // Aplicar paginação
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedEvents = events.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        events: paginatedEvents,
        total: events.length,
        page: Number(page),
        totalPages: Math.ceil(events.length / Number(limit))
      }
    });
  } catch (error) {
    console.error("Erro ao listar eventos:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
      error: "Failed to fetch events"
    });
  }
});

// GET /api/events/:id - Obter evento específico
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const event = await storage.event.getEvent(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Evento não encontrado"
      });
    }

    res.json({
      success: true,
      data: { event }
    });
  } catch (error) {
    console.error("Erro ao buscar evento:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

// POST /api/events - Criar novo evento (apenas organizadores)
router.post("/", verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  
  try {
    const userId = authReq.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    // Validar dados com Zod
    const createEventSchema = insertEventSchema.omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });

    const validatedData = createEventSchema.parse({
      ...req.body,
      organizerId: userId,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate)
    });

    const newEvent = await storage.event.createEvent(validatedData);

    res.status(201).json({
      success: true,
      message: "Evento criado com sucesso",
      data: { event: newEvent }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Dados inválidos",
        errors: error.errors
      });
    }

    console.error("Erro ao criar evento:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

// PUT /api/events/:id - Atualizar evento
router.put("/:id", verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  
  try {
    const userId = authReq.user?.claims?.sub;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    // Verificar se o evento existe e pertence ao usuário
    const existingEvent = await storage.event.getEvent(id);
    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: "Evento não encontrado"
      });
    }

    if (existingEvent.organizerId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Sem permissão para editar este evento"
      });
    }

    const updateData = {
      ...req.body,
      startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
      endDate: req.body.endDate ? new Date(req.body.endDate) : undefined
    };

    const updatedEvent = await storage.event.updateEvent(id, updateData);

    res.json({
      success: true,
      message: "Evento atualizado com sucesso",
      data: { event: updatedEvent }
    });
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

// DELETE /api/events/:id - Excluir evento
router.delete("/:id", verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  
  try {
    const userId = authReq.user?.claims?.sub;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    // Verificar se o evento existe e pertence ao usuário
    const existingEvent = await storage.event.getEvent(id);
    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: "Evento não encontrado"
      });
    }

    if (existingEvent.organizerId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Sem permissão para excluir este evento"
      });
    }

    const deleted = await storage.event.deleteEvent(id);
    
    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: "Erro ao excluir evento"
      });
    }

    res.json({
      success: true,
      message: "Evento excluído com sucesso"
    });
  } catch (error) {
    console.error("Erro ao excluir evento:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

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

    const bookings = await storage.booking.getProviderBookings(organizerId);

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