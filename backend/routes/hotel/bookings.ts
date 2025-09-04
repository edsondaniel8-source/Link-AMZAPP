import { Router } from 'express';
import { z } from 'zod';
import { db } from '../../db';
import { bookings } from '../../shared/schema';
import { verifyFirebaseToken } from '../auth';
import { eq, and } from 'drizzle-orm';

const router = Router();

// Listar reservas dos alojamentos do host (Hotel Manager)
router.get('/my-bookings/:hostId', async (req, res) => {
  try {
    const { hostId } = req.params;
    const { status } = req.query;
    
    console.log('🔍 [HOTEL] Buscando reservas do host:', hostId);

    let query = db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.providerId, hostId),
          eq(bookings.serviceType, 'accommodation')
        )
      );

    // Filtrar por status se especificado
    if (status && typeof status === 'string') {
      query = query.where(eq(bookings.status, status as any));
    }

    const hostBookings = await query.orderBy(bookings.createdAt);

    console.log(`✅ [HOTEL] Encontradas ${hostBookings.length} reservas`);

    res.json({
      success: true,
      bookings: hostBookings
    });

  } catch (error) {
    console.error('❌ [HOTEL] Erro ao buscar reservas:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Confirmar reserva (Hotel Manager)
router.patch('/:bookingId/confirm', async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    console.log('✅ [HOTEL] Confirmando reserva:', bookingId);

    const [updatedBooking] = await db
      .update(bookings)
      .set({ 
        status: 'confirmed',
        updatedAt: new Date()
      })
      .where(
        and(
          eq(bookings.id, bookingId),
          eq(bookings.serviceType, 'accommodation')
        )
      )
      .returning();

    if (!updatedBooking) {
      return res.status(404).json({
        error: 'Reserva não encontrada',
        message: 'Não foi possível encontrar esta reserva'
      });
    }

    console.log('✅ [HOTEL] Reserva confirmada com sucesso');

    res.json({
      success: true,
      message: 'Reserva confirmada com sucesso',
      booking: updatedBooking
    });

  } catch (error) {
    console.error('❌ [HOTEL] Erro ao confirmar reserva:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Rejeitar reserva (Hotel Manager)
router.patch('/:bookingId/reject', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;
    
    console.log('❌ [HOTEL] Rejeitando reserva:', bookingId, reason);

    const [updatedBooking] = await db
      .update(bookings)
      .set({ 
        status: 'cancelled',
        specialRequests: reason ? `Rejeitado: ${reason}` : 'Rejeitado pelo anfitrião',
        updatedAt: new Date()
      })
      .where(
        and(
          eq(bookings.id, bookingId),
          eq(bookings.serviceType, 'accommodation')
        )
      )
      .returning();

    if (!updatedBooking) {
      return res.status(404).json({
        error: 'Reserva não encontrada',
        message: 'Não foi possível encontrar esta reserva'
      });
    }

    console.log('✅ [HOTEL] Reserva rejeitada com sucesso');

    res.json({
      success: true,
      message: 'Reserva rejeitada',
      booking: updatedBooking
    });

  } catch (error) {
    console.error('❌ [HOTEL] Erro ao rejeitar reserva:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Marcar check-in (Hotel Manager)
router.patch('/:bookingId/checkin', async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    console.log('🏨 [HOTEL] Fazendo check-in:', bookingId);

    const [updatedBooking] = await db
      .update(bookings)
      .set({ 
        status: 'active',
        updatedAt: new Date()
      })
      .where(
        and(
          eq(bookings.id, bookingId),
          eq(bookings.serviceType, 'accommodation')
        )
      )
      .returning();

    if (!updatedBooking) {
      return res.status(404).json({
        error: 'Reserva não encontrada',
        message: 'Não foi possível encontrar esta reserva'
      });
    }

    console.log('✅ [HOTEL] Check-in realizado com sucesso');

    res.json({
      success: true,
      message: 'Check-in realizado com sucesso',
      booking: updatedBooking
    });

  } catch (error) {
    console.error('❌ [HOTEL] Erro ao fazer check-in:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Marcar check-out (Hotel Manager)
router.patch('/:bookingId/checkout', async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    console.log('🏨 [HOTEL] Fazendo check-out:', bookingId);

    const [updatedBooking] = await db
      .update(bookings)
      .set({ 
        status: 'completed',
        updatedAt: new Date()
      })
      .where(
        and(
          eq(bookings.id, bookingId),
          eq(bookings.serviceType, 'accommodation')
        )
      )
      .returning();

    if (!updatedBooking) {
      return res.status(404).json({
        error: 'Reserva não encontrada',
        message: 'Não foi possível encontrar esta reserva'
      });
    }

    console.log('✅ [HOTEL] Check-out realizado com sucesso');

    res.json({
      success: true,
      message: 'Check-out realizado com sucesso',
      booking: updatedBooking
    });

  } catch (error) {
    console.error('❌ [HOTEL] Erro ao fazer check-out:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Obter estatísticas de ocupação (Hotel Manager)
router.get('/stats/:hostId', async (req, res) => {
  try {
    const { hostId } = req.params;
    
    console.log('📊 [HOTEL] Buscando estatísticas do host:', hostId);

    // Buscar todas as reservas do host
    const allBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.providerId, hostId),
          eq(bookings.serviceType, 'accommodation')
        )
      );

    const totalBookings = allBookings.length;
    const confirmedBookings = allBookings.filter(b => b.status === 'confirmed').length;
    const activeBookings = allBookings.filter(b => b.status === 'active').length;
    const completedBookings = allBookings.filter(b => b.status === 'completed').length;
    const totalRevenue = allBookings
      .filter(b => b.status === 'completed')
      .reduce((sum, booking) => sum + booking.totalAmount, 0);

    const stats = {
      totalBookings,
      confirmedBookings,
      activeBookings,
      completedBookings,
      totalRevenue,
      occupancyRate: totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0,
      averageStayLength: allBookings.length > 0 
        ? Math.round(allBookings.reduce((sum, b) => sum + (b.nights || 1), 0) / allBookings.length) 
        : 0
    };

    console.log('✅ [HOTEL] Estatísticas calculadas:', stats);

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('❌ [HOTEL] Erro ao buscar estatísticas:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

export default router;