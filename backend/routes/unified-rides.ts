import { Router } from 'express';
import { Pool } from 'pg';
import { z } from 'zod';

const router = Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// ===== SCHEMAS DE VALIDAÇÃO =====
const createRideSchema = z.object({
  fromAddress: z.string().min(1, "Origem é obrigatória"),
  toAddress: z.string().min(1, "Destino é obrigatório"), 
  departureDate: z.string().min(1, "Data é obrigatória"),
  maxPassengers: z.number().min(1).max(8),
  pricePerSeat: z.number().min(0),
  vehicleType: z.string().optional().default("sedan"),
  description: z.string().optional(),
  allowNegotiation: z.boolean().optional().default(false),
});

const searchRidesSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  date: z.string().optional(),
  passengers: z.number().min(1).default(1),
  maxPrice: z.number().optional(),
});

// ===== BUSCAR VIAGENS =====
router.get('/search', async (req, res) => {
  try {
    const { from, to, date, passengers = 1, maxPrice } = searchRidesSchema.parse({
      ...req.query,
      passengers: req.query.passengers ? parseInt(req.query.passengers as string) : 1,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
    });

    let query = `
      SELECT 
        r.id,
        r.driver_id,
        r.from_address,
        r.to_address,
        r.departure_date,
        r.departure_time,
        r.max_passengers,
        r.available_seats,
        r.price_per_seat,
        r.vehicle_type,
        r.vehicle_info,
        r.description,
        r.allow_negotiation,
        r.status,
        u.first_name || ' ' || u.last_name as driver_name,
        u.rating as driver_rating,
        u.phone as driver_phone,
        COALESCE(SUM(b.seats_booked), 0) as booked_seats
      FROM rides_unified r
      JOIN users u ON r.driver_id = u.id
      LEFT JOIN bookings_unified b ON r.id = b.service_id 
        AND b.service_type = 'ride' 
        AND b.status IN ('pending', 'confirmed')
      WHERE r.status = 'active' 
        AND r.available_seats >= $1
        AND r.departure_date >= CURRENT_DATE
    `;

    const params: any[] = [passengers];
    let paramCount = 1;

    if (from) {
      paramCount++;
      query += ` AND LOWER(r.from_address) LIKE LOWER($${paramCount})`;
      params.push(`%${from}%`);
    }

    if (to) {
      paramCount++;
      query += ` AND LOWER(r.to_address) LIKE LOWER($${paramCount})`;
      params.push(`%${to}%`);
    }

    if (date) {
      paramCount++;
      query += ` AND r.departure_date = $${paramCount}`;
      params.push(date);
    }

    if (maxPrice) {
      paramCount++;
      query += ` AND r.price_per_seat <= $${paramCount}`;
      params.push(maxPrice);
    }

    query += `
      GROUP BY r.id, u.first_name, u.last_name, u.rating, u.phone
      HAVING r.available_seats - COALESCE(SUM(b.seats_booked), 0) >= $1
      ORDER BY r.departure_date ASC, r.departure_time ASC
    `;

    const result = await pool.query(query, params);

    // Transformar dados para o frontend
    const rides = result.rows.map((row: any) => ({
      id: row.id,
      driverId: row.driver_id,
      fromAddress: row.from_address,
      toAddress: row.to_address,
      departureDate: `${row.departure_date}T${row.departure_time}`,
      price: row.price_per_seat.toString(),
      maxPassengers: row.max_passengers,
      availableSeats: row.available_seats - parseInt(row.booked_seats),
      currentPassengers: parseInt(row.booked_seats),
      type: row.vehicle_type,
      vehicleInfo: row.vehicle_info,
      description: row.description,
      allowNegotiation: row.allow_negotiation,
      driverName: row.driver_name || 'Motorista',
      driverRating: parseFloat(row.driver_rating) || 4.5,
      driverPhone: row.driver_phone,
    }));

    res.json({ 
      success: true,
      rides,
      total: rides.length,
      searchCriteria: { from, to, date, passengers, maxPrice }
    });

  } catch (error) {
    console.error('Erro na busca de viagens:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ===== CRIAR NOVA VIAGEM =====
router.post('/create', async (req, res) => {
  try {
    const rideData = createRideSchema.parse(req.body);
    
    // Usar driverId do usuário autenticado ou teste
    const driverId = req.body.driverId || '9624afd4-5385-4601-af6e-4cf747dba1bc';
    
    // Converter data/hora
    const date = new Date(rideData.departureDate);
    const departureTimeOnly = date.toTimeString().slice(0, 5); // HH:MM
    const departureDateOnly = date.toISOString().split('T')[0]; // YYYY-MM-DD

    const query = `
      INSERT INTO rides_unified (
        driver_id, from_address, to_address, departure_date, departure_time,
        max_passengers, available_seats, price_per_seat, vehicle_type, 
        vehicle_info, description, allow_negotiation
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const values = [
      driverId,
      rideData.fromAddress,
      rideData.toAddress,
      departureDateOnly,
      departureTimeOnly,
      rideData.maxPassengers,
      rideData.maxPassengers, // disponível = máximo inicialmente
      rideData.pricePerSeat,
      rideData.vehicleType,
      req.body.vehicleInfo || null,
      rideData.description || null,
      rideData.allowNegotiation
    ];

    const result = await pool.query(query, values);
    const newRide = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Viagem criada com sucesso',
      ride: {
        id: newRide.id,
        driverId: newRide.driver_id,
        fromAddress: newRide.from_address,
        toAddress: newRide.to_address,
        departureDate: `${newRide.departure_date}T${newRide.departure_time}`,
        price: newRide.price_per_seat.toString(),
        maxPassengers: newRide.max_passengers,
        availableSeats: newRide.available_seats,
        type: newRide.vehicle_type,
        description: newRide.description,
        allowNegotiation: newRide.allow_negotiation
      }
    });

  } catch (error) {
    console.error('Erro ao criar viagem:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Dados inválidos',
        details: error.errors.map(e => e.message)
      });
    }
    
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ===== BUSCAR VIAGENS DO MOTORISTA =====
router.get('/driver/:driverId', async (req, res) => {
  try {
    const { driverId } = req.params;

    const query = `
      SELECT 
        r.*,
        COUNT(b.id) as total_bookings,
        COALESCE(SUM(b.seats_booked), 0) as booked_seats,
        COALESCE(SUM(CASE WHEN b.status = 'confirmed' THEN b.total_amount ELSE 0 END), 0) as confirmed_revenue
      FROM rides_unified r
      LEFT JOIN bookings_unified b ON r.id = b.service_id AND b.service_type = 'ride'
      WHERE r.driver_id = $1
      GROUP BY r.id
      ORDER BY r.departure_date DESC, r.departure_time DESC
    `;

    const result = await pool.query(query, [driverId]);

    const rides = result.rows.map((row: any) => ({
      id: row.id,
      fromAddress: row.from_address,
      toAddress: row.to_address,
      departureDate: `${row.departure_date}T${row.departure_time}`,
      price: row.price_per_seat.toString(),
      maxPassengers: row.max_passengers,
      availableSeats: row.available_seats - parseInt(row.booked_seats),
      currentPassengers: parseInt(row.booked_seats),
      type: row.vehicle_type,
      description: row.description,
      status: row.status,
      totalBookings: parseInt(row.total_bookings),
      confirmedRevenue: parseFloat(row.confirmed_revenue),
      createdAt: row.created_at
    }));

    res.json({ success: true, rides });

  } catch (error) {
    console.error('Erro ao buscar viagens do motorista:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ===== ATUALIZAR VIAGEM =====
router.put('/:rideId', async (req, res) => {
  try {
    const { rideId } = req.params;
    const updateData = req.body;

    // Verificar se a viagem existe e pertence ao motorista
    const checkQuery = 'SELECT * FROM rides_unified WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [rideId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Viagem não encontrada' });
    }

    // Construir query de atualização dinamicamente
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    if (updateData.pricePerSeat !== undefined) {
      paramCount++;
      updates.push(`price_per_seat = $${paramCount}`);
      values.push(updateData.pricePerSeat);
    }

    if (updateData.description !== undefined) {
      paramCount++;
      updates.push(`description = $${paramCount}`);
      values.push(updateData.description);
    }

    if (updateData.status !== undefined) {
      paramCount++;
      updates.push(`status = $${paramCount}`);
      values.push(updateData.status);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar' });
    }

    paramCount++;
    updates.push(`updated_at = $${paramCount}`);
    values.push(new Date());

    values.push(rideId); // Para o WHERE

    const updateQuery = `
      UPDATE rides_unified 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount + 1}
      RETURNING *
    `;

    const result = await pool.query(updateQuery, values);

    res.json({
      success: true,
      message: 'Viagem atualizada com sucesso',
      ride: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao atualizar viagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ===== CANCELAR VIAGEM =====
router.delete('/:rideId', async (req, res) => {
  try {
    const { rideId } = req.params;

    // Verificar se há reservas confirmadas
    const bookingsQuery = `
      SELECT COUNT(*) as confirmed_bookings 
      FROM bookings_unified 
      WHERE service_id = $1 AND service_type = 'ride' AND status = 'confirmed'
    `;
    
    const bookingsResult = await pool.query(bookingsQuery, [rideId]);
    
    if (parseInt(bookingsResult.rows[0].confirmed_bookings) > 0) {
      return res.status(400).json({ 
        error: 'Não é possível cancelar viagem com reservas confirmadas' 
      });
    }

    // Marcar como cancelada em vez de deletar
    const cancelQuery = `
      UPDATE rides_unified 
      SET status = 'cancelled', updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(cancelQuery, [rideId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Viagem não encontrada' });
    }

    // Cancelar reservas pendentes
    await pool.query(`
      UPDATE bookings_unified 
      SET status = 'cancelled', updated_at = NOW()
      WHERE service_id = $1 AND service_type = 'ride' AND status = 'pending'
    `, [rideId]);

    res.json({
      success: true,
      message: 'Viagem cancelada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao cancelar viagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;