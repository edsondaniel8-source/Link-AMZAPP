import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { rides, bookings, users } from '../shared/schema';
import { verifyFirebaseToken, verifyRole } from './auth';
import { eq, and, gte, lte, like, or } from 'drizzle-orm';

const router = Router();

// Função para obter termos de proximidade para busca mais flexível
function getProximityTerms(location: string): string[] {
  const term = location.toLowerCase().trim();
  const proximityMap: Record<string, string[]> = {
    'malanga': ['malanga', 'zimpeto', 'maputo', 'matola'],
    'zimpeto': ['zimpeto', 'malanga', 'maputo', 'matola'],
    'maputo': ['maputo', 'matola', 'zimpeto', 'malanga', 'costa do sol'],
    'matola': ['matola', 'maputo', 'zimpeto', 'malanga'],
    'bilene': ['bilene', 'xai-xai', 'manhiça', 'palmeira'],
    'xai-xai': ['xai-xai', 'bilene', 'manhiça', 'chokwe'],
    'beira': ['beira', 'dondo', 'sofala'],
    'nampula': ['nampula', 'nacala', 'ilha de moçambique'],
    'tete': ['tete', 'cahora bassa', 'moatize'],
    'inhambane': ['inhambane', 'tofo', 'vilanculos', 'maxixe'],
    'pemba': ['pemba', 'montepuez', 'cabo delgado'],
    'quelimane': ['quelimane', 'mocuba', 'zambézia']
  };
  
  // Procurar correspondências exatas primeiro
  for (const [key, values] of Object.entries(proximityMap)) {
    if (term.includes(key) || values.some(v => term.includes(v))) {
      return values;
    }
  }
  
  // Se não encontrar correspondência, retornar o termo original
  return [term];
}

// Schema para criar nova viagem
const createRideSchema = z.object({
  type: z.string(),
  fromAddress: z.string(),
  toAddress: z.string(),
  fromLat: z.number().optional(),
  fromLng: z.number().optional(),
  toLat: z.number().optional(),
  toLng: z.number().optional(),
  price: z.number(),
  maxPassengers: z.number().default(4),
  availableSeats: z.number().default(4),
  route: z.array(z.string()).optional(),
  allowPickupEnRoute: z.boolean().default(false),
  allowNegotiation: z.boolean().default(false),
  isRoundTrip: z.boolean().default(false),
  returnDate: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  departureDate: z.string(),
});

// Schema para buscar viagens
const searchRidesSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  date: z.string().optional(),
  passengers: z.number().default(1),
  maxPrice: z.number().optional(),
  page: z.number().default(1),
  limit: z.number().default(20),
});

// Buscar viagens (público)
router.get('/search', async (req, res) => {
  try {
    const { 
      from, 
      to, 
      date,
      passengers,
      minPrice,
      maxPrice,
      vehicleType,
      allowNegotiation,
      page = '1',
      limit = '20'
    } = req.query;

    // Validação básica
    if (!from || !to) {
      return res.status(400).json({ 
        error: "Origem e destino são obrigatórios",
        details: "Os parâmetros 'from' e 'to' devem ser fornecidos"
      });
    }
    
    let whereConditions: any = [eq(rides.isActive, true)];
    
    // Implementar busca por proximidade - encontrar resultados aproximados
    if (from) {
      const proximityTerms = getProximityTerms(from as string);
      const fromConditions = proximityTerms.map(term => 
        like(rides.fromAddress, `%${term}%`)
      );
      whereConditions.push(or(...fromConditions));
    }
    
    if (to) {
      const proximityTerms = getProximityTerms(to as string);
      const toConditions = proximityTerms.map(term => 
        like(rides.toAddress, `%${term}%`)
      );
      whereConditions.push(or(...toConditions));
    }
    
    if (date) {
      const searchDate = new Date(date as string);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      whereConditions.push(
        and(
          gte(rides.departureDate, searchDate),
          lte(rides.departureDate, nextDay)
        )
      );
    }
    
    if (passengers) {
      whereConditions.push(gte(rides.availableSeats, Number(passengers)));
    }
    
    if (minPrice) {
      whereConditions.push(gte(rides.price, minPrice as string));
    }
    
    if (maxPrice) {
      whereConditions.push(lte(rides.price, maxPrice as string));
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const offset = (pageNum - 1) * limitNum;
    
    const rideResults = await db
      .select({
        id: rides.id,
        type: rides.type,
        fromAddress: rides.fromAddress,
        toAddress: rides.toAddress,
        price: rides.price,
        estimatedDuration: rides.estimatedDuration,
        estimatedDistance: rides.estimatedDistance,
        driverId: rides.driverId,
        driverName: rides.driverName,
        vehicleInfo: rides.vehicleInfo,
        maxPassengers: rides.maxPassengers,
        availableSeats: rides.availableSeats,
        route: rides.route,
        allowPickupEnRoute: rides.allowPickupEnRoute,
        allowNegotiation: rides.allowNegotiation,
        isRoundTrip: rides.isRoundTrip,
        returnDate: rides.returnDate,
        departureDate: rides.departureDate,
        minPrice: rides.minPrice,
        maxPrice: rides.maxPrice,
      })
      .from(rides)
      .where(and(...whereConditions))
      .limit(limitNum)
      .offset(offset)
      .orderBy(rides.departureDate);

    res.json({
      success: true,
      rides: rideResults,
      searchParams: {
        from,
        to,
        date,
        appliedFilters: {
          minPrice: minPrice ? Number(minPrice) : null,
          maxPrice: maxPrice ? Number(maxPrice) : null,
          passengers: passengers ? Number(passengers) : null,
          allowNegotiation: allowNegotiation === 'true'
        }
      },
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: rideResults.length,
      }
    });
  } catch (error) {
    console.error('Erro ao buscar viagens:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar nova viagem (apenas motoristas)
router.post('/', verifyFirebaseToken, verifyRole(['driver', 'admin']), async (req: any, res) => {
  try {
    const rideData = createRideSchema.parse(req.body);
    const driverId = req.user.uid;
    const driverUser = req.dbUser;

    const [newRide] = await db.insert(rides).values({
      type: rideData.type,
      fromAddress: rideData.fromAddress,
      toAddress: rideData.toAddress,
      fromLat: rideData.fromLat?.toString(),
      fromLng: rideData.fromLng?.toString(),
      toLat: rideData.toLat?.toString(),
      toLng: rideData.toLng?.toString(),
      price: rideData.price.toString(),
      maxPassengers: rideData.maxPassengers,
      availableSeats: rideData.availableSeats,
      route: rideData.route,
      allowPickupEnRoute: rideData.allowPickupEnRoute,
      allowNegotiation: rideData.allowNegotiation,
      isRoundTrip: rideData.isRoundTrip,
      minPrice: rideData.minPrice?.toString(),
      maxPrice: rideData.maxPrice?.toString(),
      departureDate: new Date(rideData.departureDate),
      returnDate: rideData.returnDate ? new Date(rideData.returnDate) : null,
      driverId,
      driverName: `${driverUser.firstName} ${driverUser.lastName}`.trim(),
    }).returning();

    res.status(201).json({
      message: 'Viagem criada com sucesso',
      ride: newRide
    });
  } catch (error) {
    console.error('Erro ao criar viagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter viagens do motorista
router.get('/my-rides', verifyFirebaseToken, verifyRole(['driver', 'admin']), async (req: any, res) => {
  try {
    const driverId = req.user.uid;
    
    const driverRides = await db
      .select()
      .from(rides)
      .where(eq(rides.driverId, driverId))
      .orderBy(rides.departureDate);

    res.json({ rides: driverRides });
  } catch (error) {
    console.error('Erro ao buscar viagens do motorista:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar viagem
router.put('/:rideId', verifyFirebaseToken, verifyRole(['driver', 'admin']), async (req: any, res) => {
  try {
    const { rideId } = req.params;
    const driverId = req.user.uid;
    const updateData = createRideSchema.partial().parse(req.body);

    // Verificar se a viagem pertence ao motorista (exceto para admins)
    if (!req.dbUser.roles.includes('admin')) {
      const [existingRide] = await db
        .select()
        .from(rides)
        .where(and(eq(rides.id, rideId), eq(rides.driverId, driverId)));

      if (!existingRide) {
        return res.status(404).json({ error: 'Viagem não encontrada' });
      }
    }

    const updateFields: any = {};
    if (updateData.type) updateFields.type = updateData.type;
    if (updateData.fromAddress) updateFields.fromAddress = updateData.fromAddress;
    if (updateData.toAddress) updateFields.toAddress = updateData.toAddress;
    if (updateData.fromLat) updateFields.fromLat = updateData.fromLat.toString();
    if (updateData.fromLng) updateFields.fromLng = updateData.fromLng.toString();
    if (updateData.toLat) updateFields.toLat = updateData.toLat.toString();
    if (updateData.toLng) updateFields.toLng = updateData.toLng.toString();
    if (updateData.price) updateFields.price = updateData.price.toString();
    if (updateData.maxPassengers) updateFields.maxPassengers = updateData.maxPassengers;
    if (updateData.availableSeats) updateFields.availableSeats = updateData.availableSeats;
    if (updateData.route) updateFields.route = updateData.route;
    if (updateData.allowPickupEnRoute !== undefined) updateFields.allowPickupEnRoute = updateData.allowPickupEnRoute;
    if (updateData.allowNegotiation !== undefined) updateFields.allowNegotiation = updateData.allowNegotiation;
    if (updateData.isRoundTrip !== undefined) updateFields.isRoundTrip = updateData.isRoundTrip;
    if (updateData.minPrice) updateFields.minPrice = updateData.minPrice.toString();
    if (updateData.maxPrice) updateFields.maxPrice = updateData.maxPrice.toString();
    if (updateData.departureDate) updateFields.departureDate = new Date(updateData.departureDate);
    if (updateData.returnDate) updateFields.returnDate = new Date(updateData.returnDate);

    const [updatedRide] = await db
      .update(rides)
      .set(updateFields)
      .where(eq(rides.id, rideId))
      .returning();

    res.json({
      message: 'Viagem atualizada com sucesso',
      ride: updatedRide
    });
  } catch (error) {
    console.error('Erro ao atualizar viagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Cancelar viagem
router.delete('/:rideId', verifyFirebaseToken, verifyRole(['driver', 'admin']), async (req: any, res) => {
  try {
    const { rideId } = req.params;
    const driverId = req.user.uid;

    // Verificar se a viagem pertence ao motorista (exceto para admins)
    if (!req.dbUser.roles.includes('admin')) {
      const [existingRide] = await db
        .select()
        .from(rides)
        .where(and(eq(rides.id, rideId), eq(rides.driverId, driverId)));

      if (!existingRide) {
        return res.status(404).json({ error: 'Viagem não encontrada' });
      }
    }

    await db
      .update(rides)
      .set({ isActive: false })
      .where(eq(rides.id, rideId));

    res.json({ message: 'Viagem cancelada com sucesso' });
  } catch (error) {
    console.error('Erro ao cancelar viagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter detalhes de uma viagem específica
router.get('/:rideId', async (req, res) => {
  try {
    const { rideId } = req.params;
    
    const [ride] = await db
      .select()
      .from(rides)
      .where(and(eq(rides.id, rideId), eq(rides.isActive, true)));

    if (!ride) {
      return res.status(404).json({ error: 'Viagem não encontrada' });
    }

    res.json({ ride });
  } catch (error) {
    console.error('Erro ao buscar detalhes da viagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;