import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { rides, bookings } from '../shared/database-schema';
import { eq, and, gte, like, desc, sql } from 'drizzle-orm';

const router = Router();

// ===== SCHEMAS DE VALIDAÇÃO =====
const createRideSchema = z.object({
  fromAddress: z.string().min(1, "Origem é obrigatória"),
  toAddress: z.string().min(1, "Destino é obrigatório"),
  departureDate: z.string().min(1, "Data é obrigatória"),
  price: z.number().positive("Preço deve ser positivo"),
  maxPassengers: z.number().min(1).max(8),
  type: z.string().optional(),
  description: z.string().optional(),
});

const searchRidesSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  passengers: z.number().default(1),
});

const bookRideSchema = z.object({
  rideId: z.string(),
  passengerId: z.string(),
  seatsBooked: z.number().min(1),
  phone: z.string(),
  email: z.string().email(),
  notes: z.string().optional(),
});

// ===== RIDES API =====

// Criar viagem (Drizzle ORM)
router.post('/rides/create', async (req, res) => {
  try {
    const rideData = createRideSchema.parse(req.body);
    
    console.log('🚗 [DRIZZLE] Criando viagem:', rideData);

    const [newRide] = await db
      .insert(rides)
      .values({
        id: sql`gen_random_uuid()`,
        type: rideData.type || 'sedan',
        fromAddress: rideData.fromAddress,
        toAddress: rideData.toAddress,
        departureDate: new Date(rideData.departureDate),
        driverName: 'Motorista', // TODO: Usar auth real
        vehicleInfo: rideData.description,
        maxPassengers: rideData.maxPassengers,
        availableSeats: rideData.maxPassengers,
        price: rideData.price.toString(),
        isActive: true,
      })
      .returning();

    console.log('✅ [DRIZZLE] Viagem criada:', newRide.id);

    res.status(201).json({
      success: true,
      ride: newRide
    });

  } catch (error) {
    console.error('❌ [DRIZZLE] Erro ao criar viagem:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Buscar viagens (Drizzle ORM)
router.get('/rides/search', async (req, res) => {
  try {
    const { from, to, passengers = 1 } = searchRidesSchema.parse({
      from: req.query.from,
      to: req.query.to,
      passengers: req.query.passengers ? parseInt(req.query.passengers as string) : 1,
    });

    console.log('🔍 [DRIZZLE] Busca:', { from, to, passengers });

    let conditions = [
      eq(rides.isActive, true),
      gte(rides.availableSeats, passengers)
    ];

    // Filtros opcionais
    if (from) {
      conditions.push(like(rides.fromAddress, `%${from}%`));
    }
    if (to) {
      conditions.push(like(rides.toAddress, `%${to}%`));
    }

    const results = await db
      .select()
      .from(rides)
      .where(and(...conditions))
      .orderBy(desc(rides.departureDate))
      .limit(20);

    console.log(`✅ [DRIZZLE] Encontradas ${results.length} viagens`);

    // Transformar para formato compatível com frontend
    const ridesFormatted = results.map(ride => ({
      id: parseInt(ride.id) || ride.id, // Compatibilidade com IDs
      fromAddress: ride.fromAddress || '',
      toAddress: ride.toAddress || '',
      departureDate: ride.departureDate?.toISOString() || '',
      price: ride.price || '0',
      maxPassengers: ride.maxPassengers || 0,
      currentPassengers: 0, // TODO: Calcular reservas
      type: ride.type || 'sedan',
      driverName: ride.driverName || 'Motorista',
      driverRating: '4.50',
      description: ride.vehicleInfo || '',
      vehiclePhoto: null,
    }));

    res.json(ridesFormatted);

  } catch (error) {
    console.error('❌ [DRIZZLE] Erro ao buscar viagens:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Reservar viagem (Drizzle ORM)
router.post('/rides/book', async (req, res) => {
  try {
    const bookingData = bookRideSchema.parse(req.body);
    
    console.log('📦 [DRIZZLE] Criando reserva:', bookingData);

    // Verificar se a viagem existe
    const [ride] = await db
      .select()
      .from(rides)
      .where(eq(rides.id, bookingData.rideId));

    if (!ride) {
      return res.status(404).json({
        error: 'Viagem não encontrada'
      });
    }

    // Verificar lugares disponíveis
    const availableSeats = ride.availableSeats || 0;
    if (availableSeats < bookingData.seatsBooked) {
      return res.status(400).json({
        error: 'Lugares insuficientes'
      });
    }

    // Criar reserva
    const [newBooking] = await db
      .insert(bookings)
      .values({
        id: sql`gen_random_uuid()`,
        userId: bookingData.passengerId,
        type: 'ride',
        status: 'confirmed',
        totalPrice: (parseFloat(ride.price || '0') * bookingData.seatsBooked).toString(),
      })
      .returning();

    // Atualizar lugares disponíveis
    await db
      .update(rides)
      .set({
        availableSeats: availableSeats - bookingData.seatsBooked
      })
      .where(eq(rides.id, bookingData.rideId));

    console.log('✅ [DRIZZLE] Reserva criada:', newBooking.id);

    res.status(201).json({
      success: true,
      booking: newBooking
    });

  } catch (error) {
    console.error('❌ [DRIZZLE] Erro ao criar reserva:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== HEALTH CHECK =====
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'Link-A Drizzle API',
    timestamp: new Date().toISOString(),
    database: 'PostgreSQL + Drizzle ORM'
  });
});

export default router;