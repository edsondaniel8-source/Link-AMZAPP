import { Router } from 'express';
import { z } from 'zod';
import { db } from '../../db';
import { rides } from '../../shared/schema';
import { verifyFirebaseToken } from '../auth';
import { eq } from 'drizzle-orm';

const router = Router();

// Listar informações de veículos do motorista baseado nas viagens
router.get('/my-vehicles/:driverId', async (req, res) => {
  try {
    const { driverId } = req.params;
    
    console.log('🔍 [DRIVER] Buscando informações de veículos do motorista:', driverId);

    // Buscar viagens do motorista para extrair informações de veículos
    const driverRides = await db
      .select({
        vehicleType: rides.vehicleType,
        vehicleInfo: rides.vehicleInfo
      })
      .from(rides)
      .where(eq(rides.driverId, driverId))
      .groupBy(rides.vehicleType, rides.vehicleInfo);

    // Criar lista de veículos únicos
    const vehicles = driverRides.map((ride, index) => ({
      id: `vehicle-${index + 1}`,
      type: ride.vehicleType || 'sedan',
      info: ride.vehicleInfo || '',
      status: 'active'
    }));

    console.log(`✅ [DRIVER] Encontrados ${vehicles.length} veículos únicos`);

    res.json({
      success: true,
      vehicles,
      message: 'Lista de veículos baseada nas viagens publicadas'
    });

  } catch (error) {
    console.error('❌ [DRIVER] Erro ao buscar veículos:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Obter estatísticas de veículos
router.get('/stats/:driverId', async (req, res) => {
  try {
    const { driverId } = req.params;
    
    console.log('📊 [DRIVER] Buscando estatísticas de veículos:', driverId);

    // Buscar estatísticas baseadas nas viagens
    const driverRides = await db
      .select()
      .from(rides)
      .where(eq(rides.driverId, driverId));

    const totalRides = driverRides.length;
    const activeRides = driverRides.filter(ride => ride.status === 'active').length;
    const vehicleTypes = [...new Set(driverRides.map(ride => ride.vehicleType))];

    const stats = {
      totalVehicles: vehicleTypes.length,
      totalRides,
      activeRides,
      vehicleTypes,
      mostUsedVehicle: vehicleTypes[0] || 'sedan'
    };

    console.log('✅ [DRIVER] Estatísticas de veículos calculadas:', stats);

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('❌ [DRIVER] Erro ao buscar estatísticas:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

export default router;