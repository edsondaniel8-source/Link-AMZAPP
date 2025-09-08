import { Router, Request, Response, NextFunction } from "express";
import { storage } from "../../../storage";
// import { insertBookingSchema } from "../../shared/storage";
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

// GET /api/bookings - Lista reservas do usuário
router.get("/", verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  
  try {
    const userId = authReq.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const { 
      type, 
      status, 
      page = 1, 
      limit = 20 
    } = req.query;

    let bookings = await storage.booking.getUserBookings(userId);
    
    // Aplicar filtros
    if (type) {
      bookings = bookings.filter(booking => booking.type === type);
    }
    
    if (status) {
      bookings = bookings.filter(booking => booking.status === status);
    }
    
    // Aplicar paginação
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedBookings = bookings.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        bookings: paginatedBookings,
        total: bookings.length,
        page: Number(page),
        totalPages: Math.ceil(bookings.length / Number(limit))
      }
    });
  } catch (error) {
    console.error("Erro ao listar reservas:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

// GET /api/bookings/:id - Obter reserva específica
router.get("/:id", verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  
  try {
    const userId = authReq.user?.claims?.sub;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const booking = await storage.booking.getBooking(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Reserva não encontrada"
      });
    }

    // Verificar se o usuário tem permissão para ver esta reserva
    if (booking.userId !== userId && booking.providerId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Sem permissão para ver esta reserva"
      });
    }

    res.json({
      success: true,
      data: { booking }
    });
  } catch (error) {
    console.error("Erro ao buscar reserva:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

// POST /api/bookings - Criar nova reserva
router.post("/", verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  
  try {
    const userId = authReq.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    // Validar dados com Zod
    const createBookingSchema = insertBookingSchema.omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });

    const validatedData = createBookingSchema.parse({
      ...req.body,
      userId,
      checkInDate: req.body.checkInDate ? new Date(req.body.checkInDate) : undefined,
      checkOutDate: req.body.checkOutDate ? new Date(req.body.checkOutDate) : undefined,
      pickupTime: req.body.pickupTime ? new Date(req.body.pickupTime) : undefined
    });

    // Verificar se o serviço está disponível
    if (validatedData.type === 'ride' && validatedData.rideId) {
      const ride = await storage.ride.getRide(validatedData.rideId);
      if (!ride) {
        return res.status(404).json({
          success: false,
          message: "Viagem não encontrada"
        });
      }
      
      // Verificar assentos disponíveis
      if ((ride.availableSeats || 0) < 1) {
        return res.status(400).json({
          success: false,
          message: "Não há assentos disponíveis"
        });
      }
      
      validatedData.providerId = ride.driverId;
    }

    if (validatedData.type === 'stay' && validatedData.accommodationId) {
      const accommodation = await storage.accommodation.getAccommodation(validatedData.accommodationId);
      if (!accommodation) {
        return res.status(404).json({
          success: false,
          message: "Acomodação não encontrada"
        });
      }
      
      if (!accommodation.isAvailable) {
        return res.status(400).json({
          success: false,
          message: "Acomodação não disponível"
        });
      }
      
      validatedData.providerId = accommodation.hostId;
    }

    if (validatedData.type === 'event' && validatedData.eventId) {
      const event = await storage.event.getEvent(validatedData.eventId);
      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Evento não encontrado"
        });
      }
      
      // Verificar se há ingressos disponíveis
      const ticketsSold = event.ticketsSold || 0;
      const maxTickets = event.maxTickets || 0;
      if (ticketsSold >= maxTickets) {
        return res.status(400).json({
          success: false,
          message: "Ingressos esgotados"
        });
      }
      
      validatedData.providerId = event.organizerId;
    }

    const newBooking = await storage.booking.createBooking(validatedData);

    res.status(201).json({
      success: true,
      message: "Reserva criada com sucesso",
      data: { booking: newBooking }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Dados inválidos",
        errors: error.errors
      });
    }

    console.error("Erro ao criar reserva:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

// PUT /api/bookings/:id/status - Atualizar status da reserva (apenas provedores)
router.put("/:id/status", verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  
  try {
    const userId = authReq.user?.claims?.sub;
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const booking = await storage.booking.getBooking(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Reserva não encontrada"
      });
    }

    // Apenas o provedor pode alterar o status
    if (booking.providerId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Sem permissão para alterar esta reserva"
      });
    }

    const updateData: any = { status };
    
    if (status === 'approved') {
      updateData.approvedAt = new Date();
    } else if (status === 'rejected') {
      updateData.rejectedAt = new Date();
      if (rejectionReason) {
        updateData.rejectionReason = rejectionReason;
      }
    } else if (status === 'confirmed') {
      updateData.confirmedAt = new Date();
    }

    const updatedBooking = await storage.booking.updateBooking(id, updateData);

    res.json({
      success: true,
      message: `Reserva ${status === 'approved' ? 'aprovada' : status === 'rejected' ? 'rejeitada' : 'atualizada'} com sucesso`,
      data: { booking: updatedBooking }
    });
  } catch (error) {
    console.error("Erro ao atualizar status da reserva:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

// PUT /api/bookings/:id/cancel - Cancelar reserva (apenas cliente)
router.put("/:id/cancel", verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  
  try {
    const userId = authReq.user?.claims?.sub;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const booking = await storage.booking.getBooking(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Reserva não encontrada"
      });
    }

    // Apenas o cliente pode cancelar
    if (booking.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Sem permissão para cancelar esta reserva"
      });
    }

    // Verificar se ainda pode ser cancelada
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: "Esta reserva não pode ser cancelada"
      });
    }

    const updatedBooking = await storage.booking.updateBooking(id, { 
      status: 'cancelled' 
    });

    res.json({
      success: true,
      message: "Reserva cancelada com sucesso",
      data: { booking: updatedBooking }
    });
  } catch (error) {
    console.error("Erro ao cancelar reserva:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

// GET /api/bookings/provider/:providerId - Reservas de um provedor (motorista/anfitrião/organizador)
router.get("/provider/:providerId", verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  
  try {
    const userId = authReq.user?.claims?.sub;
    const { providerId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    // Verificar se o usuário é o provedor ou tem permissão
    if (providerId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Sem permissão para ver estas reservas"
      });
    }

    const { 
      type, 
      status, 
      page = 1, 
      limit = 20 
    } = req.query;

    let bookings = await storage.booking.getProviderBookings(providerId);
    
    // Aplicar filtros
    if (type) {
      bookings = bookings.filter(booking => booking.type === type);
    }
    
    if (status) {
      bookings = bookings.filter(booking => booking.status === status);
    }
    
    // Aplicar paginação
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedBookings = bookings.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        bookings: paginatedBookings,
        total: bookings.length,
        page: Number(page),
        totalPages: Math.ceil(bookings.length / Number(limit))
      }
    });
  } catch (error) {
    console.error("Erro ao listar reservas do provedor:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

// GET /api/bookings/stats - Estatísticas de reservas do usuário
router.get("/stats", verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  
  try {
    const userId = authReq.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    // Buscar reservas como cliente
    const userBookings = await storage.booking.getUserBookings(userId);
    
    // Buscar reservas como provedor
    const providerBookings = await storage.booking.getProviderBookings(userId);

    const stats = {
      asCustomer: {
        total: userBookings.length,
        completed: userBookings.filter(b => b.status === 'completed').length,
        cancelled: userBookings.filter(b => b.status === 'cancelled').length,
        pending: userBookings.filter(b => b.status === 'pending_approval').length,
        byType: {
          rides: userBookings.filter(b => b.type === 'ride').length,
          stays: userBookings.filter(b => b.type === 'stay').length,
          events: userBookings.filter(b => b.type === 'event').length
        }
      },
      asProvider: {
        total: providerBookings.length,
        completed: providerBookings.filter(b => b.status === 'completed').length,
        cancelled: providerBookings.filter(b => b.status === 'cancelled').length,
        pending: providerBookings.filter(b => b.status === 'pending_approval').length,
        byType: {
          rides: providerBookings.filter(b => b.type === 'ride').length,
          stays: providerBookings.filter(b => b.type === 'stay').length,
          events: providerBookings.filter(b => b.type === 'event').length
        }
      }
    };

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

export default router;