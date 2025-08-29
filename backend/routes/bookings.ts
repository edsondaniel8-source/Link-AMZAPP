import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db.js';
import { bookings, rides, accommodations, events, users } from '../shared/schema.js';
import { verifyFirebaseToken } from './auth.js';
import { eq, and, desc } from 'drizzle-orm';

const router = Router();

// Schema para criar reserva
const createBookingSchema = z.object({
  serviceType: z.enum(['ride', 'stay', 'event']),
  serviceId: z.string(), // ID do ride, accommodation ou event
  guests: z.number().default(1),
  checkInDate: z.string().optional(),
  checkOutDate: z.string().optional(),
  specialRequests: z.string().optional(),
  contactInfo: z.object({
    phone: z.string(),
    email: z.string().email(),
  }),
  // Para eventos
  numberOfTickets: z.number().optional(),
  // Para viagens
  pickupLocation: z.string().optional(),
  dropoffLocation: z.string().optional(),
});

// Schema para atualizar status da reserva
const updateBookingStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed', 'no_show']),
  notes: z.string().optional(),
});

// Criar nova reserva
router.post('/', verifyFirebaseToken, async (req: any, res) => {
  try {
    const bookingData = createBookingSchema.parse(req.body);
    const userId = req.user.uid;

    let totalPrice = 0;
    let providerUserId = null;
    let serviceName = '';
    let serviceDetails: any = {};

    // Verificar se o serviço existe e obter detalhes
    switch (bookingData.serviceType) {
      case 'ride':
        const [ride] = await db
          .select()
          .from(rides)
          .where(and(eq(rides.id, bookingData.serviceId), eq(rides.isActive, true)));
        
        if (!ride) {
          return res.status(404).json({ error: 'Viagem não encontrada' });
        }
        
        if (ride.availableSeats < bookingData.guests) {
          return res.status(400).json({ error: 'Não há lugares suficientes disponíveis' });
        }

        totalPrice = parseFloat(ride.price) * bookingData.guests;
        providerUserId = ride.driverId;
        serviceName = `${ride.fromAddress} → ${ride.toAddress}`;
        serviceDetails = {
          fromAddress: ride.fromAddress,
          toAddress: ride.toAddress,
          departureDate: ride.departureDate,
          vehicleInfo: ride.vehicleInfo,
          driverName: ride.driverName,
        };
        break;

      case 'stay':
        const [accommodation] = await db
          .select()
          .from(accommodations)
          .where(and(eq(accommodations.id, bookingData.serviceId), eq(accommodations.isAvailable, true)));
        
        if (!accommodation) {
          return res.status(404).json({ error: 'Alojamento não encontrado' });
        }

        if (!bookingData.checkInDate || !bookingData.checkOutDate) {
          return res.status(400).json({ error: 'Datas de check-in e check-out são obrigatórias' });
        }

        const checkIn = new Date(bookingData.checkInDate);
        const checkOut = new Date(bookingData.checkOutDate);
        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        
        totalPrice = parseFloat(accommodation.pricePerNight) * nights;
        providerUserId = accommodation.hostId;
        serviceName = accommodation.name;
        serviceDetails = {
          accommodationName: accommodation.name,
          address: accommodation.address,
          type: accommodation.type,
          amenities: accommodation.amenities,
          nights,
        };
        break;

      case 'event':
        const [event] = await db
          .select()
          .from(events)
          .where(and(eq(events.id, bookingData.serviceId), eq(events.status, 'approved')));
        
        if (!event) {
          return res.status(404).json({ error: 'Evento não encontrado' });
        }

        const ticketsRequested = bookingData.numberOfTickets || 1;
        const availableTickets = event.maxTickets - event.ticketsSold;
        
        if (availableTickets < ticketsRequested) {
          return res.status(400).json({ error: 'Não há ingressos suficientes disponíveis' });
        }

        totalPrice = parseFloat(event.ticketPrice) * ticketsRequested;
        providerUserId = event.organizerId;
        serviceName = event.title;
        serviceDetails = {
          eventTitle: event.title,
          venue: event.venue,
          address: event.address,
          startDate: event.startDate,
          endDate: event.endDate,
          numberOfTickets: ticketsRequested,
        };
        break;
    }

    // Criar a reserva
    const [newBooking] = await db.insert(bookings).values({
      userId,
      serviceType: bookingData.serviceType,
      serviceId: bookingData.serviceId,
      providerUserId,
      totalPrice: totalPrice.toString(),
      guests: bookingData.guests,
      checkInDate: bookingData.checkInDate ? new Date(bookingData.checkInDate) : null,
      checkOutDate: bookingData.checkOutDate ? new Date(bookingData.checkOutDate) : null,
      specialRequests: bookingData.specialRequests,
      contactInfo: bookingData.contactInfo,
      serviceName,
      serviceDetails,
      status: 'pending',
    }).returning();

    // Atualizar disponibilidade do serviço
    if (bookingData.serviceType === 'ride') {
      await db
        .update(rides)
        .set({ availableSeats: Math.max(0, (await db.select().from(rides).where(eq(rides.id, bookingData.serviceId)))[0].availableSeats - bookingData.guests) })
        .where(eq(rides.id, bookingData.serviceId));
    } else if (bookingData.serviceType === 'event') {
      await db
        .update(events)
        .set({ ticketsSold: (await db.select().from(events).where(eq(events.id, bookingData.serviceId)))[0].ticketsSold + (bookingData.numberOfTickets || 1) })
        .where(eq(events.id, bookingData.serviceId));
    }

    res.status(201).json({
      message: 'Reserva criada com sucesso',
      booking: newBooking
    });
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter reservas do usuário
router.get('/my-bookings', verifyFirebaseToken, async (req: any, res) => {
  try {
    const userId = req.user.uid;
    
    const userBookings = await db
      .select()
      .from(bookings)
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.createdAt));

    res.json({ bookings: userBookings });
  } catch (error) {
    console.error('Erro ao buscar reservas do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter reservas recebidas (para prestadores de serviços)
router.get('/received', verifyFirebaseToken, async (req: any, res) => {
  try {
    const providerId = req.user.uid;
    
    const receivedBookings = await db
      .select({
        id: bookings.id,
        userId: bookings.userId,
        serviceType: bookings.serviceType,
        serviceName: bookings.serviceName,
        serviceDetails: bookings.serviceDetails,
        totalPrice: bookings.totalPrice,
        guests: bookings.guests,
        checkInDate: bookings.checkInDate,
        checkOutDate: bookings.checkOutDate,
        specialRequests: bookings.specialRequests,
        contactInfo: bookings.contactInfo,
        status: bookings.status,
        createdAt: bookings.createdAt,
        // Incluir informações do cliente
        clientName: users.firstName,
        clientLastName: users.lastName,
        clientEmail: users.email,
        clientPhoto: users.profileImageUrl,
      })
      .from(bookings)
      .leftJoin(users, eq(bookings.userId, users.id))
      .where(eq(bookings.providerUserId, providerId))
      .orderBy(desc(bookings.createdAt));

    res.json({ bookings: receivedBookings });
  } catch (error) {
    console.error('Erro ao buscar reservas recebidas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar status da reserva (para prestadores de serviços)
router.put('/:bookingId/status', verifyFirebaseToken, async (req: any, res) => {
  try {
    const { bookingId } = req.params;
    const providerId = req.user.uid;
    const { status, notes } = updateBookingStatusSchema.parse(req.body);

    // Verificar se a reserva pertence ao prestador
    const [booking] = await db
      .select()
      .from(bookings)
      .where(and(eq(bookings.id, bookingId), eq(bookings.providerUserId, providerId)));

    if (!booking) {
      return res.status(404).json({ error: 'Reserva não encontrada' });
    }

    const [updatedBooking] = await db
      .update(bookings)
      .set({
        status,
        providerNotes: notes,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId))
      .returning();

    res.json({
      message: 'Status da reserva atualizado com sucesso',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Erro ao atualizar status da reserva:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Cancelar reserva (para clientes)
router.put('/:bookingId/cancel', verifyFirebaseToken, async (req: any, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.uid;
    const { reason } = req.body;

    // Verificar se a reserva pertence ao usuário
    const [booking] = await db
      .select()
      .from(bookings)
      .where(and(eq(bookings.id, bookingId), eq(bookings.userId, userId)));

    if (!booking) {
      return res.status(404).json({ error: 'Reserva não encontrada' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Reserva já foi cancelada' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ error: 'Não é possível cancelar uma reserva já completada' });
    }

    // Atualizar status da reserva
    const [updatedBooking] = await db
      .update(bookings)
      .set({
        status: 'cancelled',
        cancellationReason: reason,
        cancelledAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId))
      .returning();

    // Restaurar disponibilidade do serviço
    if (booking.serviceType === 'ride') {
      await db
        .update(rides)
        .set({ availableSeats: (await db.select().from(rides).where(eq(rides.id, booking.serviceId)))[0].availableSeats + booking.guests })
        .where(eq(rides.id, booking.serviceId));
    } else if (booking.serviceType === 'event') {
      const ticketCount = booking.serviceDetails?.numberOfTickets || 1;
      await db
        .update(events)
        .set({ ticketsSold: Math.max(0, (await db.select().from(events).where(eq(events.id, booking.serviceId)))[0].ticketsSold - ticketCount) })
        .where(eq(events.id, booking.serviceId));
    }

    res.json({
      message: 'Reserva cancelada com sucesso',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Erro ao cancelar reserva:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter detalhes de uma reserva específica
router.get('/:bookingId', verifyFirebaseToken, async (req: any, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.uid;

    const [booking] = await db
      .select()
      .from(bookings)
      .where(and(
        eq(bookings.id, bookingId),
        or(eq(bookings.userId, userId), eq(bookings.providerUserId, userId))
      ));

    if (!booking) {
      return res.status(404).json({ error: 'Reserva não encontrada' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Erro ao buscar detalhes da reserva:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;