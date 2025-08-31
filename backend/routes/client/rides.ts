import { Router } from 'express';
import { z } from 'zod';
import { db } from '../../db';
import { rides } from '../../shared/unified-schema';
import { verifyFirebaseToken } from '../auth';
import { eq, and, gte, lte, like, or } from 'drizzle-orm';

const router = Router();

// Schema para buscar viagens como cliente
const searchRidesSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  date: z.string().optional(),
  passengers: z.number().default(1),
  maxPrice: z.number().optional(),
  page: z.number().default(1),
  limit: z.number().default(20),
});

// Buscar viagens disponíveis (Cliente)
router.get('/search', async (req, res) => {
  try {
    const { 
      from, 
      to, 
      date, 
      passengers = 1, 
      maxPrice, 
      page = 1, 
      limit = 20 
    } = searchRidesSchema.parse({
      from: req.query.from,
      to: req.query.to,
      date: req.query.date,
      passengers: req.query.passengers ? parseInt(req.query.passengers as string) : 1,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    });

    console.log('🔍 [CLIENT] Busca de viagens:', { from, to, date, passengers, maxPrice });

    let query = db
      .select()
      .from(rides)
      .where(and(
        eq(rides.status, 'active'),
        gte(rides.availableSeats, passengers)
      ));

    // Filtrar por origem (busca flexível)
    if (from) {
      query = query.where(like(rides.fromAddress, `%${from}%`));
    }

    // Filtrar por destino (busca flexível)
    if (to) {
      query = query.where(like(rides.toAddress, `%${to}%`));
    }

    // Filtrar por data
    if (date) {
      query = query.where(eq(rides.departureDate, date));
    }

    // Filtrar por preço máximo
    if (maxPrice) {
      query = query.where(lte(rides.pricePerSeat, maxPrice));
    }

    // Paginação
    const offset = (page - 1) * limit;
    const results = await query.limit(limit).offset(offset);

    console.log(`✅ [CLIENT] Encontradas ${results.length} viagens`);

    res.json({
      success: true,
      rides: results,
      pagination: {
        page,
        limit,
        total: results.length,
        hasMore: results.length === limit
      }
    });

  } catch (error) {
    console.error('❌ [CLIENT] Erro ao buscar viagens:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Obter detalhes de uma viagem específica (Cliente)
router.get('/:rideId', async (req, res) => {
  try {
    const { rideId } = req.params;
    
    console.log('🔍 [CLIENT] Buscando detalhes da viagem:', rideId);

    const [ride] = await db
      .select()
      .from(rides)
      .where(and(
        eq(rides.id, rideId),
        eq(rides.status, 'active')
      ));

    if (!ride) {
      return res.status(404).json({ 
        error: 'Viagem não encontrada',
        message: 'Esta viagem não está disponível'
      });
    }

    console.log('✅ [CLIENT] Detalhes da viagem encontrados');

    res.json({
      success: true,
      ride
    });

  } catch (error) {
    console.error('❌ [CLIENT] Erro ao buscar detalhes da viagem:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

export default router;