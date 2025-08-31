import express from 'express';
import { Pool } from 'pg';

const router = express.Router();

// Configuração do banco de dados
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Buscar viagens com filtros
router.get('/search', async (req, res) => {
  try {
    const { from, to, date, passengers = 1 } = req.query;
    
    let query = `
      SELECT 
        r.*,
        u.first_name || ' ' || u.last_name as driver_name,
        u.rating as driver_rating
      FROM rides_simple r
      JOIN users u ON r.driver_id = u.id
      WHERE r.available_seats >= $1
    `;
    
    const queryParams: any[] = [passengers];
    let paramCount = 1;
    
    if (from) {
      paramCount++;
      query += ` AND LOWER(r.from_location) LIKE LOWER($${paramCount})`;
      queryParams.push(`%${from}%`);
    }
    
    if (to) {
      paramCount++;
      query += ` AND LOWER(r.to_location) LIKE LOWER($${paramCount})`;
      queryParams.push(`%${to}%`);
    }
    
    if (date) {
      paramCount++;
      query += ` AND r.departure_date >= $${paramCount}`;
      queryParams.push(date);
    }
    
    query += ` ORDER BY r.departure_date ASC, r.departure_time ASC`;
    
    const result = await pool.query(query, queryParams);
    
    // Transformar resultados para o formato esperado pelo frontend
    const rides = result.rows.map((row: any) => ({
      id: row.id,
      driverId: row.driver_id,
      fromAddress: row.from_location,
      toAddress: row.to_location,
      departureDate: `${row.departure_date}T${row.departure_time}`,
      price: row.price_per_seat.toString(),
      maxPassengers: row.available_seats,
      currentPassengers: 0, // TODO: Calcular baseado nas reservas
      type: row.vehicle_type,
      driverName: row.driver_name || 'Motorista',
      driverRating: row.driver_rating || 4.0,
      description: row.additional_info,
      vehiclePhoto: null // TODO: Implementar fotos de veículos
    }));
    
    res.json(rides);
    
  } catch (error) {
    console.error('Erro na busca de viagens:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar nova viagem
router.post('/create', async (req, res) => {
  try {
    const {
      driverId,
      fromAddress,
      toAddress,
      departureDate,
      price,
      availableSeats,
      vehicleInfo,
      additionalInfo
    } = req.body;
    
    // Validações básicas
    if (!fromAddress || !toAddress || !departureDate || !price || !availableSeats) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: origem, destino, data, preço e lugares disponíveis' 
      });
    }
    
    // Converter data para formato apropriado
    const date = new Date(departureDate);
    const departureTimeOnly = date.toTimeString().slice(0, 5); // HH:MM
    const departureDateOnly = date.toISOString().split('T')[0]; // YYYY-MM-DD
    
    const query = `
      INSERT INTO rides_simple (
        driver_id, from_location, to_location, departure_date, departure_time,
        available_seats, price_per_seat, vehicle_type, additional_info
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    const values = [
      driverId,
      fromAddress,
      toAddress,
      departureDateOnly,
      departureTimeOnly,
      availableSeats,
      parseFloat(price),
      vehicleInfo || 'sedan',
      additionalInfo
    ];
    
    const result = await pool.query(query, values);
    const newRide = result.rows[0];
    
    res.status(201).json({
      success: true,
      ride: {
        id: newRide.id,
        driverId: newRide.driver_id,
        fromAddress: newRide.from_location,
        toAddress: newRide.to_location,
        departureDate: `${newRide.departure_date}T${newRide.departure_time}`,
        price: newRide.price_per_seat.toString(),
        maxPassengers: newRide.available_seats,
        type: newRide.vehicle_type,
        description: newRide.additional_info
      }
    });
    
  } catch (error) {
    console.error('Erro ao criar viagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar viagens de um motorista
router.get('/driver/:driverId', async (req, res) => {
  try {
    const { driverId } = req.params;
    
    const query = `
      SELECT 
        r.*,
        COUNT(b.id) as total_bookings,
        COALESCE(SUM(b.seats_booked), 0) as booked_seats
      FROM rides_simple r
      LEFT JOIN bookings_simple b ON r.id = b.ride_id
      WHERE r.driver_id = $1
      GROUP BY r.id
      ORDER BY r.departure_date DESC, r.departure_time DESC
    `;
    
    const result = await pool.query(query, [driverId]);
    
    const rides = result.rows.map((row: any) => ({
      id: row.id,
      fromAddress: row.from_location,
      toAddress: row.to_location,
      departureDate: `${row.departure_date}T${row.departure_time}`,
      price: row.price_per_seat.toString(),
      maxPassengers: row.available_seats + parseInt(row.booked_seats),
      currentPassengers: parseInt(row.booked_seats),
      availableSeats: row.available_seats,
      type: row.vehicle_type,
      description: row.additional_info,
      totalBookings: parseInt(row.total_bookings)
    }));
    
    res.json(rides);
    
  } catch (error) {
    console.error('Erro ao buscar viagens do motorista:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar reserva
router.post('/book', async (req, res) => {
  try {
    const {
      rideId,
      passengerId,
      seatsBooked,
      phone,
      email,
      notes
    } = req.body;
    
    // Validações
    if (!rideId || !passengerId || !seatsBooked) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: ID da viagem, passageiro e número de lugares' 
      });
    }
    
    // Verificar se a viagem existe e tem lugares disponíveis
    const rideQuery = 'SELECT * FROM rides_simple WHERE id = $1';
    const rideResult = await pool.query(rideQuery, [rideId]);
    
    if (rideResult.rows.length === 0) {
      return res.status(404).json({ error: 'Viagem não encontrada' });
    }
    
    const ride = rideResult.rows[0];
    
    if (ride.available_seats < seatsBooked) {
      return res.status(400).json({ error: 'Não há lugares suficientes disponíveis' });
    }
    
    // Calcular preço total
    const totalPrice = ride.price_per_seat * seatsBooked;
    
    // Criar reserva
    const bookingQuery = `
      INSERT INTO bookings_simple (
        ride_id, passenger_id, seats_booked, total_price, status
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const bookingValues = [rideId, passengerId, seatsBooked, totalPrice, 'confirmed'];
    const bookingResult = await pool.query(bookingQuery, bookingValues);
    
    // Atualizar lugares disponíveis na viagem
    const updateRideQuery = `
      UPDATE rides_simple 
      SET available_seats = available_seats - $1 
      WHERE id = $2
    `;
    await pool.query(updateRideQuery, [seatsBooked, rideId]);
    
    res.status(201).json({
      success: true,
      booking: {
        id: bookingResult.rows[0].id,
        rideId: bookingResult.rows[0].ride_id,
        seatsBooked: bookingResult.rows[0].seats_booked,
        totalPrice: bookingResult.rows[0].total_price,
        status: bookingResult.rows[0].status
      }
    });
    
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;