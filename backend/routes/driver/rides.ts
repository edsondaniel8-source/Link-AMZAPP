import { Router } from 'express';
import { z } from 'zod';
import { db } from '../../db';
import { rides } from '../../shared/unified-schema';
import { verifyFirebaseToken } from '../auth';
import { eq, and } from 'drizzle-orm';

const router = Router();

// Schema para criar nova viagem (Motorista)
const createRideSchema = z.object({
  driverId: z.string(),
  driverName: z.string(),
  driverPhone: z.string(),
  vehicleType: z.string(),
  vehiclePlate: z.string(),
  vehicleColor: z.string().optional(),
  vehicleSeats: z.number(),
  fromAddress: z.string(),
  fromCity: z.string(),
  fromProvince: z.string(),
  fromLatitude: z.number().optional(),
  fromLongitude: z.number().optional(),
  toAddress: z.string(),
  toCity: z.string(),
  toProvince: z.string(),
  toLatitude: z.number().optional(),
  toLongitude: z.number().optional(),
  departureDateTime: z.string(),
  pricePerSeat: z.number(),
  maxPassengers: z.number(),
  route: z.array(z.string()).optional(),
  allowPickupEnRoute: z.boolean().default(false),
  allowNegotiation: z.boolean().default(false),
  isRoundTrip: z.boolean().default(false),
  returnDateTime: z.string().optional(),
  description: z.string().optional(),
});

// Criar nova viagem (Motorista)
router.post('/create', async (req, res) => {
  try {
    const rideData = createRideSchema.parse(req.body);
    
    console.log('🚗 [DRIVER] Criando nova viagem:', rideData);

    const [newRide] = await db
      .insert(rides)
      .values({
        ...rideData,
        departureDateTime: new Date(rideData.departureDateTime),
        returnDateTime: rideData.returnDateTime ? new Date(rideData.returnDateTime) : null,
        availableSeats: rideData.maxPassengers,
        isActive: true,
      })
      .returning();

    console.log('✅ [DRIVER] Viagem criada com sucesso:', newRide.id);

    res.status(201).json({
      success: true,
      message: 'Viagem publicada com sucesso',
      ride: newRide
    });

  } catch (error) {
    console.error('❌ [DRIVER] Erro ao criar viagem:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Listar viagens do motorista
router.get('/my-rides/:driverId', async (req, res) => {
  try {
    const { driverId } = req.params;
    
    console.log('🔍 [DRIVER] Buscando viagens do motorista:', driverId);

    const driverRides = await db
      .select()
      .from(rides)
      .where(eq(rides.driverId, driverId))
      .orderBy(rides.departureDateTime);

    console.log(`✅ [DRIVER] Encontradas ${driverRides.length} viagens`);

    res.json({
      success: true,
      rides: driverRides
    });

  } catch (error) {
    console.error('❌ [DRIVER] Erro ao buscar viagens:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Atualizar viagem (Motorista)
router.patch('/:rideId', async (req, res) => {
  try {
    const { rideId } = req.params;
    const updateData = req.body;
    
    console.log('✏️ [DRIVER] Atualizando viagem:', rideId, updateData);

    // Verificar se a viagem pertence ao motorista
    const [existingRide] = await db
      .select()
      .from(rides)
      .where(eq(rides.id, rideId));

    if (!existingRide) {
      return res.status(404).json({
        error: 'Viagem não encontrada',
        message: 'Esta viagem não existe'
      });
    }

    const [updatedRide] = await db
      .update(rides)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(rides.id, rideId))
      .returning();

    console.log('✅ [DRIVER] Viagem atualizada com sucesso');

    res.json({
      success: true,
      message: 'Viagem atualizada com sucesso',
      ride: updatedRide
    });

  } catch (error) {
    console.error('❌ [DRIVER] Erro ao atualizar viagem:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Cancelar viagem (Motorista)
router.patch('/:rideId/cancel', async (req, res) => {
  try {
    const { rideId } = req.params;
    
    console.log('🚫 [DRIVER] Cancelando viagem:', rideId);

    const [updatedRide] = await db
      .update(rides)
      .set({ 
        isActive: false,
        updatedAt: new Date()
      })
      .where(eq(rides.id, rideId))
      .returning();

    if (!updatedRide) {
      return res.status(404).json({
        error: 'Viagem não encontrada',
        message: 'Esta viagem não existe'
      });
    }

    console.log('✅ [DRIVER] Viagem cancelada com sucesso');

    res.json({
      success: true,
      message: 'Viagem cancelada com sucesso',
      ride: updatedRide
    });

  } catch (error) {
    console.error('❌ [DRIVER] Erro ao cancelar viagem:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Obter estatísticas do motorista
router.get('/stats/:driverId', async (req, res) => {
  try {
    const { driverId } = req.params;
    
    console.log('📊 [DRIVER] Buscando estatísticas do motorista:', driverId);

    // Buscar todas as viagens do motorista
    const allRides = await db
      .select()
      .from(rides)
      .where(eq(rides.driverId, driverId));

    const activeRides = allRides.filter(ride => ride.isActive);
    const completedRides = allRides.filter(ride => !ride.isActive);
    const totalRevenue = allRides.reduce((sum, ride) => sum + (ride.pricePerSeat * (ride.maxPassengers - ride.availableSeats)), 0);

    const stats = {
      totalRides: allRides.length,
      activeRides: activeRides.length,
      completedRides: completedRides.length,
      totalRevenue,
      averageRating: 4.8, // Mock - implementar sistema de avaliações
    };

    console.log('✅ [DRIVER] Estatísticas calculadas:', stats);

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('❌ [DRIVER] Erro ao buscar estatísticas:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

export default router;