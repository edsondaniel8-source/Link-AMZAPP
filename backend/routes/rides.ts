import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db.js';
import { rides, bookings, users } from '../shared/schema.js';
import { verifyFirebaseToken, verifyRole } from './auth.js';
import { eq, and, gte, lte, like, or } from 'drizzle-orm';

const router = Router();

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
    const query = searchRidesSchema.parse(req.query);
    
    let whereConditions: any = [eq(rides.isActive, true)];
    
    if (query.from) {
      whereConditions.push(like(rides.fromAddress, `%${query.from}%`));
    }
    
    if (query.to) {
      whereConditions.push(like(rides.toAddress, `%${query.to}%`));
    }
    
    if (query.date) {
      const searchDate = new Date(query.date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      whereConditions.push(
        and(
          gte(rides.departureDate, searchDate),
          lte(rides.departureDate, nextDay)
        )
      );
    }
    
    if (query.passengers) {
      whereConditions.push(gte(rides.availableSeats, query.passengers));
    }
    
    if (query.maxPrice) {
      whereConditions.push(lte(rides.price, query.maxPrice.toString()));
    }

    const offset = (query.page - 1) * query.limit;
    
    const rideResults = await db
      .select({
        id: rides.id,
        type: rides.type,
        fromAddress: rides.fromAddress,
        toAddress: rides.toAddress,
        price: rides.price,
        estimatedDuration: rides.estimatedDuration,
        estimatedDistance: rides.estimatedDistance,
        availableIn: rides.availableIn,
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
      .limit(query.limit)
      .offset(offset)
      .orderBy(rides.departureDate);

    res.json({
      rides: rideResults,
      pagination: {
        page: query.page,
        limit: query.limit,
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
      ...rideData,
      driverId,
      driverName: `${driverUser.firstName} ${driverUser.lastName}`.trim(),
      departureDate: new Date(rideData.departureDate),
      returnDate: rideData.returnDate ? new Date(rideData.returnDate) : null,
      price: rideData.price.toString(),
      minPrice: rideData.minPrice?.toString(),
      maxPrice: rideData.maxPrice?.toString(),
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

    const [updatedRide] = await db
      .update(rides)
      .set({
        ...updateData,
        departureDate: updateData.departureDate ? new Date(updateData.departureDate) : undefined,
        returnDate: updateData.returnDate ? new Date(updateData.returnDate) : undefined,
        price: updateData.price?.toString(),
        minPrice: updateData.minPrice?.toString(),
        maxPrice: updateData.maxPrice?.toString(),
      })
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