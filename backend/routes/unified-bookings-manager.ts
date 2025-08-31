import { Router } from 'express';
import { Pool } from 'pg';
import { z } from 'zod';

const router = Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// ===== SCHEMAS DE VALIDAÇÃO =====
const createBookingSchema = z.object({
  serviceType: z.enum(['ride', 'accommodation']),
  serviceId: z.string().min(1),
  specialRequests: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional(),
  // Para viagens
  seatsBooked: z.number().optional(),
  pickupLocation: z.string().optional(),
  // Para alojamentos
  checkInDate: z.string().optional(),
  checkOutDate: z.string().optional(),
  guests: z.number().optional(),
});

const updateBookingSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  specialRequests: z.string().optional(),
});

// ===== CRIAR NOVA RESERVA UNIFICADA =====
router.post('/create', async (req, res) => {
  try {
    const bookingData = createBookingSchema.parse(req.body);
    
    // Usar clientId do usuário autenticado ou teste
    const clientId = req.body.clientId || 'cdaaee9b-5ef6-4b6e-98bc-79533d795d73';
    
    let totalAmount = 0;
    let providerId = '';
    let serviceName = '';
    let calculatedNights = 0;

    if (bookingData.serviceType === 'ride') {
      // Buscar informações da viagem
      const rideQuery = `
        SELECT r.*, u.id as driver_id, u.first_name || ' ' || u.last_name as driver_name
        FROM rides_unified r
        JOIN users u ON r.driver_id = u.id
        WHERE r.id = $1 AND r.status = 'active'
      `;
      
      const rideResult = await pool.query(rideQuery, [bookingData.serviceId]);
      
      if (rideResult.rows.length === 0) {
        return res.status(404).json({ error: 'Viagem não encontrada ou não disponível' });
      }

      const ride = rideResult.rows[0];
      
      if (!bookingData.seatsBooked || bookingData.seatsBooked < 1) {
        return res.status(400).json({ error: 'Número de lugares é obrigatório para viagens' });
      }

      // Verificar disponibilidade
      const availabilityQuery = `
        SELECT 
          r.available_seats - COALESCE(SUM(b.seats_booked), 0) as available_now
        FROM rides_unified r
        LEFT JOIN bookings_unified b ON r.id = b.service_id 
          AND b.service_type = 'ride' 
          AND b.status IN ('pending', 'confirmed')
        WHERE r.id = $1
        GROUP BY r.available_seats
      `;
      
      const availabilityResult = await pool.query(availabilityQuery, [bookingData.serviceId]);
      const availableSeats = availabilityResult.rows[0]?.available_now || ride.available_seats;

      if (availableSeats < bookingData.seatsBooked) {
        return res.status(400).json({ 
          error: `Apenas ${availableSeats} lugares disponíveis` 
        });
      }

      totalAmount = parseFloat(ride.price_per_seat) * bookingData.seatsBooked;
      providerId = ride.driver_id;
      serviceName = `${ride.from_address} → ${ride.to_address}`;

    } else if (bookingData.serviceType === 'accommodation') {
      // Buscar informações do alojamento
      const accommodationQuery = `
        SELECT a.*, u.id as host_id, u.first_name || ' ' || u.last_name as host_name
        FROM accommodations a
        JOIN users u ON a.host_id = u.id
        WHERE a.id = $1 AND a.is_available = true
      `;
      
      const accommodationResult = await pool.query(accommodationQuery, [bookingData.serviceId]);
      
      if (accommodationResult.rows.length === 0) {
        return res.status(404).json({ error: 'Alojamento não encontrado ou não disponível' });
      }

      const accommodation = accommodationResult.rows[0];

      if (!bookingData.checkInDate || !bookingData.checkOutDate) {
        return res.status(400).json({ 
          error: 'Datas de check-in e check-out são obrigatórias para alojamentos' 
        });
      }

      if (!bookingData.guests || bookingData.guests < 1) {
        return res.status(400).json({ error: 'Número de hóspedes é obrigatório' });
      }

      if (bookingData.guests > accommodation.max_guests) {
        return res.status(400).json({ 
          error: `Máximo ${accommodation.max_guests} hóspedes permitidos` 
        });
      }

      // Calcular noites
      const checkIn = new Date(bookingData.checkInDate);
      const checkOut = new Date(bookingData.checkOutDate);
      calculatedNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

      if (calculatedNights < accommodation.minimum_nights) {
        return res.status(400).json({ 
          error: `Mínimo ${accommodation.minimum_nights} noites requeridas` 
        });
      }

      // Verificar disponibilidade nas datas
      const conflictQuery = `
        SELECT COUNT(*) as conflicts
        FROM bookings_unified b
        WHERE b.service_id = $1 
          AND b.service_type = 'accommodation'
          AND b.status IN ('pending', 'confirmed')
          AND (
            (DATE($2) BETWEEN b.check_in_date AND b.check_out_date - INTERVAL '1 day') OR
            (DATE($3) BETWEEN b.check_in_date + INTERVAL '1 day' AND b.check_out_date) OR
            (b.check_in_date BETWEEN DATE($2) AND DATE($3) - INTERVAL '1 day')
          )
      `;
      
      const conflictResult = await pool.query(conflictQuery, [
        bookingData.serviceId, 
        bookingData.checkInDate, 
        bookingData.checkOutDate
      ]);

      if (parseInt(conflictResult.rows[0].conflicts) > 0) {
        return res.status(400).json({ 
          error: 'Alojamento não disponível nas datas selecionadas' 
        });
      }

      totalAmount = parseFloat(accommodation.price_per_night) * calculatedNights;
      providerId = accommodation.host_id;
      serviceName = accommodation.name;
    }

    // Criar a reserva
    const insertQuery = `
      INSERT INTO bookings_unified (
        client_id, service_type, service_id, provider_id, total_amount,
        special_requests, contact_phone, contact_email, seats_booked,
        pickup_location, check_in_date, check_out_date, guests, nights
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const bookingValues = [
      clientId,
      bookingData.serviceType,
      bookingData.serviceId,
      providerId,
      totalAmount,
      bookingData.specialRequests || null,
      bookingData.contactPhone || null,
      bookingData.contactEmail || null,
      bookingData.seatsBooked || null,
      bookingData.pickupLocation || null,
      bookingData.checkInDate || null,
      bookingData.checkOutDate || null,
      bookingData.guests || null,
      calculatedNights || null
    ];

    const result = await pool.query(insertQuery, bookingValues);
    const newBooking = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Reserva criada com sucesso',
      booking: {
        id: newBooking.id,
        serviceType: newBooking.service_type,
        serviceId: newBooking.service_id,
        serviceName,
        totalAmount: parseFloat(newBooking.total_amount),
        status: newBooking.status,
        seatsBooked: newBooking.seats_booked,
        checkInDate: newBooking.check_in_date,
        checkOutDate: newBooking.check_out_date,
        guests: newBooking.guests,
        nights: newBooking.nights,
        specialRequests: newBooking.special_requests,
        contactPhone: newBooking.contact_phone,
        contactEmail: newBooking.contact_email,
        createdAt: newBooking.created_at
      }
    });

  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Dados inválidos',
        details: error.errors.map(e => e.message)
      });
    }
    
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ===== BUSCAR RESERVAS DO CLIENTE =====
router.get('/client/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const { status, serviceType } = req.query;

    let query = `
      SELECT 
        b.*,
        CASE 
          WHEN b.service_type = 'ride' THEN r.from_address || ' → ' || r.to_address
          WHEN b.service_type = 'accommodation' THEN a.name
        END as service_name,
        CASE 
          WHEN b.service_type = 'ride' THEN u1.first_name || ' ' || u1.last_name
          WHEN b.service_type = 'accommodation' THEN u2.first_name || ' ' || u2.last_name
        END as provider_name,
        CASE 
          WHEN b.service_type = 'ride' THEN u1.phone
          WHEN b.service_type = 'accommodation' THEN u2.phone
        END as provider_phone
      FROM bookings_unified b
      LEFT JOIN rides_unified r ON b.service_id = r.id AND b.service_type = 'ride'
      LEFT JOIN accommodations a ON b.service_id = a.id AND b.service_type = 'accommodation'
      LEFT JOIN users u1 ON r.driver_id = u1.id
      LEFT JOIN users u2 ON a.host_id = u2.id
      WHERE b.client_id = $1
    `;

    const params: any[] = [clientId];
    let paramCount = 1;

    if (status) {
      paramCount++;
      query += ` AND b.status = $${paramCount}`;
      params.push(status);
    }

    if (serviceType) {
      paramCount++;
      query += ` AND b.service_type = $${paramCount}`;
      params.push(serviceType);
    }

    query += ` ORDER BY b.created_at DESC`;

    const result = await pool.query(query, params);

    const bookings = result.rows.map((row: any) => ({
      id: row.id,
      serviceType: row.service_type,
      serviceId: row.service_id,
      serviceName: row.service_name,
      providerId: row.provider_id,
      providerName: row.provider_name,
      providerPhone: row.provider_phone,
      totalAmount: parseFloat(row.total_amount),
      status: row.status,
      seatsBooked: row.seats_booked,
      checkInDate: row.check_in_date,
      checkOutDate: row.check_out_date,
      guests: row.guests,
      nights: row.nights,
      specialRequests: row.special_requests,
      contactPhone: row.contact_phone,
      contactEmail: row.contact_email,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    res.json({ success: true, bookings });

  } catch (error) {
    console.error('Erro ao buscar reservas do cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ===== BUSCAR RESERVAS DO FORNECEDOR =====
router.get('/provider/:providerId', async (req, res) => {
  try {
    const { providerId } = req.params;
    const { status, serviceType } = req.query;

    let query = `
      SELECT 
        b.*,
        CASE 
          WHEN b.service_type = 'ride' THEN r.from_address || ' → ' || r.to_address
          WHEN b.service_type = 'accommodation' THEN a.name
        END as service_name,
        u.first_name || ' ' || u.last_name as client_name,
        u.phone as client_phone
      FROM bookings_unified b
      LEFT JOIN rides_unified r ON b.service_id = r.id AND b.service_type = 'ride'
      LEFT JOIN accommodations a ON b.service_id = a.id AND b.service_type = 'accommodation'
      JOIN users u ON b.client_id = u.id
      WHERE b.provider_id = $1
    `;

    const params: any[] = [providerId];
    let paramCount = 1;

    if (status) {
      paramCount++;
      query += ` AND b.status = $${paramCount}`;
      params.push(status);
    }

    if (serviceType) {
      paramCount++;
      query += ` AND b.service_type = $${paramCount}`;
      params.push(serviceType);
    }

    query += ` ORDER BY b.created_at DESC`;

    const result = await pool.query(query, params);

    const bookings = result.rows.map((row: any) => ({
      id: row.id,
      serviceType: row.service_type,
      serviceId: row.service_id,
      serviceName: row.service_name,
      clientId: row.client_id,
      clientName: row.client_name,
      clientPhone: row.client_phone,
      totalAmount: parseFloat(row.total_amount),
      status: row.status,
      seatsBooked: row.seats_booked,
      checkInDate: row.check_in_date,
      checkOutDate: row.check_out_date,
      guests: row.guests,
      nights: row.nights,
      specialRequests: row.special_requests,
      contactPhone: row.contact_phone,
      contactEmail: row.contact_email,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    res.json({ success: true, bookings });

  } catch (error) {
    console.error('Erro ao buscar reservas do fornecedor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ===== ATUALIZAR STATUS DA RESERVA =====
router.put('/:bookingId/status', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, specialRequests } = updateBookingSchema.parse(req.body);

    // Verificar se a reserva existe
    const checkQuery = 'SELECT * FROM bookings_unified WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [bookingId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva não encontrada' });
    }

    const updateQuery = `
      UPDATE bookings_unified 
      SET status = $1, special_requests = COALESCE($2, special_requests), updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [status, specialRequests, bookingId]);

    res.json({
      success: true,
      message: 'Status da reserva atualizado com sucesso',
      booking: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao atualizar status da reserva:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Dados inválidos',
        details: error.errors.map(e => e.message)
      });
    }
    
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ===== CANCELAR RESERVA =====
router.delete('/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;

    const cancelQuery = `
      UPDATE bookings_unified 
      SET status = 'cancelled', updated_at = NOW()
      WHERE id = $1 AND status IN ('pending', 'confirmed')
      RETURNING *
    `;

    const result = await pool.query(cancelQuery, [bookingId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Reserva não encontrada ou não pode ser cancelada' 
      });
    }

    res.json({
      success: true,
      message: 'Reserva cancelada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao cancelar reserva:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ===== DETALHES DA RESERVA =====
router.get('/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;

    const query = `
      SELECT 
        b.*,
        CASE 
          WHEN b.service_type = 'ride' THEN r.from_address || ' → ' || r.to_address
          WHEN b.service_type = 'accommodation' THEN a.name
        END as service_name,
        CASE 
          WHEN b.service_type = 'ride' THEN r.departure_date || 'T' || r.departure_time
          WHEN b.service_type = 'accommodation' THEN a.address
        END as service_details,
        u1.first_name || ' ' || u1.last_name as client_name,
        u1.phone as client_phone,
        CASE 
          WHEN b.service_type = 'ride' THEN u2.first_name || ' ' || u2.last_name
          WHEN b.service_type = 'accommodation' THEN u3.first_name || ' ' || u3.last_name
        END as provider_name,
        CASE 
          WHEN b.service_type = 'ride' THEN u2.phone
          WHEN b.service_type = 'accommodation' THEN u3.phone
        END as provider_phone
      FROM bookings_unified b
      JOIN users u1 ON b.client_id = u1.id
      LEFT JOIN rides_unified r ON b.service_id = r.id AND b.service_type = 'ride'
      LEFT JOIN accommodations a ON b.service_id = a.id AND b.service_type = 'accommodation'
      LEFT JOIN users u2 ON r.driver_id = u2.id
      LEFT JOIN users u3 ON a.host_id = u3.id
      WHERE b.id = $1
    `;

    const result = await pool.query(query, [bookingId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva não encontrada' });
    }

    const booking = result.rows[0];

    res.json({
      success: true,
      booking: {
        id: booking.id,
        serviceType: booking.service_type,
        serviceId: booking.service_id,
        serviceName: booking.service_name,
        serviceDetails: booking.service_details,
        clientId: booking.client_id,
        clientName: booking.client_name,
        clientPhone: booking.client_phone,
        providerId: booking.provider_id,
        providerName: booking.provider_name,
        providerPhone: booking.provider_phone,
        totalAmount: parseFloat(booking.total_amount),
        status: booking.status,
        seatsBooked: booking.seats_booked,
        pickupLocation: booking.pickup_location,
        checkInDate: booking.check_in_date,
        checkOutDate: booking.check_out_date,
        guests: booking.guests,
        nights: booking.nights,
        specialRequests: booking.special_requests,
        contactPhone: booking.contact_phone,
        contactEmail: booking.contact_email,
        createdAt: booking.created_at,
        updatedAt: booking.updated_at
      }
    });

  } catch (error) {
    console.error('Erro ao buscar detalhes da reserva:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;