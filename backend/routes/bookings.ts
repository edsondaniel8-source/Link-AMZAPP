import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { bookings, rides } from '../shared/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { verifyFirebaseToken } from '../middleware/role-auth';
import { AuthenticatedUser } from '../shared/types';

const router = Router();

// ===== SCHEMAS DE VALIDAÇÃO =====
const createBookingSchema = z.object({
  rideId: z.string().optional(),
  accommodationId: z.string().optional(),
  type: z.enum(['ride', 'accommodation']),
  guestInfo: z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    phone: z.string().min(1, "Telefone é obrigatório"),
  }),
  details: z.object({
    passengers: z.number().optional(),
    checkIn: z.string().optional(),
    checkOut: z.string().optional(),
    totalAmount: z.number().positive("Valor deve ser positivo"),
  }),
});

// ===== BOOKINGS API =====

// Criar reserva
router.post('/create', verifyFirebaseToken, async (req: any, res) => {
  try {
    const bookingData = createBookingSchema.parse(req.body);
    const userId = (req.user as AuthenticatedUser)?.uid;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    console.log('📦 [BOOKING] Criando reserva:', { 
      type: bookingData.type, 
      userId,
      rideId: bookingData.rideId,
      accommodationId: bookingData.accommodationId
    });

    // Verificar se é reserva de ride
    if (bookingData.type === 'ride' && bookingData.rideId) {
      const [ride] = await db
        .select()
        .from(rides)
        .where(eq(rides.id, bookingData.rideId));

      if (!ride) {
        return res.status(404).json({ error: 'Viagem não encontrada' });
      }

      // Verificar lugares disponíveis
      const passengers = bookingData.details.passengers || 1;
      if ((ride.availableSeats || 0) < passengers) {
        return res.status(400).json({ error: 'Lugares insuficientes' });
      }

      // Atualizar lugares disponíveis
      await db
        .update(rides)
        .set({
          availableSeats: (ride.availableSeats || 0) - passengers
        })
        .where(eq(rides.id, bookingData.rideId));
    }

    // ✅ CORRETO: Usar passengerId (decisão mantida)
    const [newBooking] = await db
      .insert(bookings)
      .values({
        passengerId: userId, // ✅ passengerId conforme schema atual
        rideId: bookingData.rideId || null,
        accommodationId: bookingData.accommodationId || null,
        status: 'confirmed',
        totalPrice: bookingData.details.totalAmount.toString(),
        guestName: bookingData.guestInfo.name,
        guestEmail: bookingData.guestInfo.email,
        guestPhone: bookingData.guestInfo.phone,
        checkInDate: bookingData.details.checkIn ? new Date(bookingData.details.checkIn) : null,
        checkOutDate: bookingData.details.checkOut ? new Date(bookingData.details.checkOut) : null,
        passengers: bookingData.details.passengers || 1,
      })
      .returning();

    console.log('✅ [BOOKING] Reserva criada:', newBooking.id);

    res.status(201).json({
      success: true,
      booking: {
        ...newBooking,
        serviceType: bookingData.type // ✅ Adiciona serviceType calculado
      },
      message: `Reserva de ${bookingData.type} confirmada com sucesso!`
    });

  } catch (error) {
    console.error('❌ [BOOKING] Erro ao criar reserva:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Buscar reservas do usuário
router.get('/user', verifyFirebaseToken, async (req: any, res) => {
  try {
    const userId = (req.user as AuthenticatedUser)?.uid;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    console.log('🔍 [BOOKING] Buscando reservas do usuário:', userId);

    // ✅ CORRETO: Usar passengerId (decisão mantida)
    const userBookings = await db
      .select()
      .from(bookings)
      .where(eq(bookings.passengerId, userId)) // ✅ passengerId conforme schema
      .orderBy(desc(bookings.createdAt))
      .limit(50);

    console.log(`✅ [BOOKING] Encontradas ${userBookings.length} reservas`);

    // ✅ SOLUÇÃO 2: Calcular serviceType baseado nas colunas existentes
    const bookingsWithServiceType = userBookings.map(booking => ({
      ...booking,
      serviceType: booking.rideId ? 'ride' : 
                  booking.accommodationId ? 'accommodation' : 'unknown'
    }));

    res.json({
      success: true,
      bookings: bookingsWithServiceType
    });

  } catch (error) {
    console.error('❌ [BOOKING] Erro ao buscar reservas:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Cancelar reserva
router.delete('/:bookingId', verifyFirebaseToken, async (req: any, res) => {
  try {
    const { bookingId } = req.params;
    const userId = (req.user as AuthenticatedUser)?.uid;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    // Buscar reserva
    // ✅ CORRETO: Usar passengerId (decisão mantida)
    const [booking] = await db
      .select()
      .from(bookings)
      .where(and(
        eq(bookings.id, bookingId),
        eq(bookings.passengerId, userId) // ✅ passengerId conforme schema
      ));

    if (!booking) {
      return res.status(404).json({ error: 'Reserva não encontrada' });
    }

    // Se for reserva de ride, devolver lugares
    // ✅ CORREÇÃO: Determinar se é ride pela presença de rideId
    if (booking.rideId) {
      await db
        .update(rides)
        .set({
          availableSeats: sql`available_seats + ${booking.passengers || 1}` // ✅ Corrigido: passengers em vez de passengerId
        })
        .where(eq(rides.id, booking.rideId));
    }

    // Cancelar reserva
    await db
      .update(bookings)
      .set({
        status: 'cancelled',
        updatedAt: new Date()
      })
      .where(eq(bookings.id, bookingId));

    console.log('✅ [BOOKING] Reserva cancelada:', bookingId);

    res.json({
      success: true,
      message: 'Reserva cancelada com sucesso'
    });

  } catch (error) {
    console.error('❌ [BOOKING] Erro ao cancelar reserva:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// ===== HEALTH CHECK =====
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'Link-A Bookings API',
    timestamp: new Date().toISOString()
  });
});

export default router;