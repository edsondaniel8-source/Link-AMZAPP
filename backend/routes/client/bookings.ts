import { Router } from 'express';
import { z } from 'zod';
import { db } from '../../db';
import { bookings, rides, accommodations } from '../../shared/unified-schema';
import { verifyFirebaseToken } from '../auth';
import { eq, and } from 'drizzle-orm';

const router = Router();

// Schema para criar reserva (Cliente)
const createBookingSchema = z.object({
  serviceType: z.enum(['ride', 'accommodation']),
  serviceId: z.string(),
  clientId: z.string(),
  contactPhone: z.string(),
  contactEmail: z.string(),
  // Para viagens
  seatsBooked: z.number().optional(),
  // Para alojamentos
  checkInDate: z.string().optional(),
  checkOutDate: z.string().optional(),
  guests: z.number().optional(),
  specialRequests: z.string().optional(),
});

// Criar nova reserva (Cliente)
router.post('/create', async (req, res) => {
  try {
    const bookingData = createBookingSchema.parse(req.body);
    
    console.log('📦 [CLIENT] Criando nova reserva:', bookingData);

    let serviceName = '';
    let totalAmount = 0;
    let providerId = '';
    let providerName = '';
    let providerPhone = '';

    if (bookingData.serviceType === 'ride') {
      // Buscar informações da viagem
      const [ride] = await db
        .select()
        .from(rides)
        .where(eq(rides.id, bookingData.serviceId));

      if (!ride) {
        return res.status(404).json({
          error: 'Viagem não encontrada',
          message: 'A viagem selecionada não está disponível'
        });
      }

      if (!bookingData.seatsBooked || ride.availableSeats < bookingData.seatsBooked) {
        return res.status(400).json({
          error: 'Lugares insuficientes',
          message: `Apenas ${ride.availableSeats} lugares disponíveis`
        });
      }

      serviceName = `${ride.fromCity || ride.fromAddress} → ${ride.toCity || ride.toAddress}`;
      totalAmount = ride.pricePerSeat * bookingData.seatsBooked;
      providerId = ride.driverId;
      providerName = ride.driverName || 'Motorista';
      providerPhone = ride.driverPhone || '';

    } else if (bookingData.serviceType === 'accommodation') {
      // Buscar informações do alojamento
      const [accommodation] = await db
        .select()
        .from(accommodations)
        .where(eq(accommodations.id, bookingData.serviceId));

      if (!accommodation) {
        return res.status(404).json({
          error: 'Alojamento não encontrado',
          message: 'O alojamento selecionado não está disponível'
        });
      }

      if (!bookingData.checkInDate || !bookingData.checkOutDate) {
        return res.status(400).json({
          error: 'Datas obrigatórias',
          message: 'Informe as datas de check-in e check-out'
        });
      }

      const checkIn = new Date(bookingData.checkInDate);
      const checkOut = new Date(bookingData.checkOutDate);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

      serviceName = accommodation.name;
      totalAmount = accommodation.pricePerNight * nights;
      providerId = accommodation.hostId;
      providerName = accommodation.hostName || 'Anfitrião';
      providerPhone = accommodation.hostPhone || '';
    }

    // Criar a reserva
    const [newBooking] = await db
      .insert(bookings)
      .values({
        serviceType: bookingData.serviceType,
        serviceId: bookingData.serviceId,
        serviceName,
        clientId: bookingData.clientId,
        providerId,
        providerName,
        providerPhone,
        totalAmount,
        status: 'pending',
        seatsBooked: bookingData.seatsBooked || null,
        checkInDate: bookingData.checkInDate ? new Date(bookingData.checkInDate) : null,
        checkOutDate: bookingData.checkOutDate ? new Date(bookingData.checkOutDate) : null,
        guests: bookingData.guests || null,
        nights: bookingData.serviceType === 'accommodation' && bookingData.checkInDate && bookingData.checkOutDate
          ? Math.ceil((new Date(bookingData.checkOutDate).getTime() - new Date(bookingData.checkInDate).getTime()) / (1000 * 60 * 60 * 24))
          : null,
        specialRequests: bookingData.specialRequests || null,
        contactPhone: bookingData.contactPhone,
        contactEmail: bookingData.contactEmail,
      })
      .returning();

    console.log('✅ [CLIENT] Reserva criada com sucesso:', newBooking.id);

    res.status(201).json({
      success: true,
      message: 'Reserva criada com sucesso',
      booking: newBooking
    });

  } catch (error) {
    console.error('❌ [CLIENT] Erro ao criar reserva:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Listar reservas do cliente
router.get('/my-bookings/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    
    console.log('🔍 [CLIENT] Buscando reservas do cliente:', clientId);

    const clientBookings = await db
      .select()
      .from(bookings)
      .where(eq(bookings.clientId, clientId))
      .orderBy(bookings.createdAt);

    console.log(`✅ [CLIENT] Encontradas ${clientBookings.length} reservas`);

    res.json({
      success: true,
      bookings: clientBookings
    });

  } catch (error) {
    console.error('❌ [CLIENT] Erro ao buscar reservas:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Cancelar reserva (Cliente)
router.patch('/:bookingId/cancel', async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    console.log('🚫 [CLIENT] Cancelando reserva:', bookingId);

    const [updatedBooking] = await db
      .update(bookings)
      .set({ 
        status: 'cancelled',
        updatedAt: new Date()
      })
      .where(eq(bookings.id, bookingId))
      .returning();

    if (!updatedBooking) {
      return res.status(404).json({
        error: 'Reserva não encontrada',
        message: 'Não foi possível encontrar esta reserva'
      });
    }

    console.log('✅ [CLIENT] Reserva cancelada com sucesso');

    res.json({
      success: true,
      message: 'Reserva cancelada com sucesso',
      booking: updatedBooking
    });

  } catch (error) {
    console.error('❌ [CLIENT] Erro ao cancelar reserva:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

export default router;