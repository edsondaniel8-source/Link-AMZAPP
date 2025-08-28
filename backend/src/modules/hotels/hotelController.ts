import { Router } from "express";
import { verifyFirebaseToken, type AuthenticatedRequest } from "../../shared/firebaseAuth";
import { storage } from "../../shared/storage";

const router = Router();

// Dashboard do hotel
router.get('/dashboard', verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const userId = authReq.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "User ID not found" });
    }

    const stats = {
      occupancy: {
        today: 85,
        currentRooms: 34,
        totalRooms: 40
      },
      revenue: {
        today: 12450.00,
        changePercent: '+15%'
      },
      checkins: {
        today: 18,
        pending: 6
      },
      rating: {
        average: 4.7,
        totalReviews: 128
      },
      todayCheckins: [
        {
          id: "checkin-1",
          guestName: "Maria Santos",
          roomType: "Quarto Duplo Superior",
          nights: 3,
          checkInTime: "14:00",
          status: "confirmed",
          price: 1250.00
        },
        {
          id: "checkin-2", 
          guestName: "João Pedro",
          roomType: "Suite Executiva",
          nights: 2,
          checkInTime: "15:30",
          status: "pending",
          price: 2100.00
        }
      ],
      weeklyOccupancy: [
        { day: 'Dom', date: '25', occupancy: 78, rooms: '31/40' },
        { day: 'Seg', date: '26', occupancy: 65, rooms: '26/40' },
        { day: 'Ter', date: '27', occupancy: 82, rooms: '33/40' },
        { day: 'Qua', date: '28', occupancy: 85, rooms: '34/40' },
        { day: 'Qui', date: '29', occupancy: 92, rooms: '37/40' },
        { day: 'Sex', date: '30', occupancy: 95, rooms: '38/40' },
        { day: 'Sáb', date: '31', occupancy: 88, rooms: '35/40' }
      ],
      pendingTasks: [
        {
          id: "task-1",
          type: "cleaning",
          description: "Limpeza urgente - Quarto 205",
          detail: "Check-in às 15:00",
          priority: "urgent"
        },
        {
          id: "task-2",
          type: "confirmation", 
          description: "Confirmar reserva - Ana Costa",
          detail: "Check-in amanhã",
          priority: "normal"
        }
      ]
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error("Hotel dashboard error:", error);
    res.status(500).json({ message: "Erro ao carregar dashboard" });
  }
});

// Reservas do hotel
router.get('/reservations', verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const hotelId = authReq.user?.claims?.sub;
    if (!hotelId) {
      return res.status(401).json({ message: "User ID not found" });
    }

    const reservations = await storage.getProviderBookings(hotelId);

    res.json({
      success: true,
      reservations
    });
  } catch (error) {
    console.error("Hotel reservations error:", error);
    res.status(500).json({ message: "Erro ao carregar reservas" });
  }
});

// Confirmar check-in
router.post('/checkin/:reservationId', verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const { reservationId } = req.params;
    const hotelId = authReq.user?.claims?.sub;

    if (!hotelId) {
      return res.status(401).json({ message: "User ID not found" });
    }

    const reservation = await storage.updateBookingStatus(reservationId, 'in_progress');

    res.json({
      success: true,
      message: "Check-in realizado com sucesso",
      reservation
    });
  } catch (error) {
    console.error("Hotel checkin error:", error);
    res.status(500).json({ message: "Erro ao realizar check-in" });
  }
});

// Quartos disponíveis
router.get('/rooms', verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const hotelId = authReq.user?.claims?.sub;
    if (!hotelId) {
      return res.status(401).json({ message: "User ID not found" });
    }

    // TODO: Implementar busca real de quartos
    const rooms = [
      {
        id: "room-101",
        number: "101",
        type: "Standard",
        status: "available",
        price: 850.00,
        capacity: 2
      },
      {
        id: "room-102",
        number: "102", 
        type: "Deluxe",
        status: "occupied",
        price: 1250.00,
        capacity: 2
      }
    ];

    res.json({
      success: true,
      rooms
    });
  } catch (error) {
    console.error("Hotel rooms error:", error);
    res.status(500).json({ message: "Erro ao carregar quartos" });
  }
});

export default router;