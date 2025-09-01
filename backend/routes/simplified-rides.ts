// Backend completo para produção
import express from "express";
import cors from "cors";
import { Pool } from "pg";

const app = express();
const PORT = process.env.PORT || 8000;

// CORS para produção - permitindo seu frontend no Railway
app.use(
  cors({
    origin: [
      "http://localhost:5000",
      "http://localhost:3000",
      "https://link-amzapp-production.up.railway.app",
      "https://link-aturismomoz.com",
      // Adicione outros domínios conforme necessário
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Configuração do banco de dados PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// Inicializar tabelas se não existirem
const initDatabase = async () => {
  try {
    // Tabela de usuários
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        phone VARCHAR(20),
        rating DECIMAL(2,1) DEFAULT 4.5,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Tabela de viagens
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rides_simple (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        driver_id UUID NOT NULL REFERENCES users(id),
        from_location TEXT NOT NULL,
        to_location TEXT NOT NULL,
        departure_date DATE NOT NULL,
        departure_time TIME NOT NULL,
        available_seats INTEGER NOT NULL,
        price_per_seat DECIMAL(10,2) NOT NULL,
        vehicle_type VARCHAR(50) DEFAULT 'Standard',
        additional_info TEXT,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Tabela de reservas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings_simple (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        ride_id UUID NOT NULL REFERENCES rides_simple(id) ON DELETE CASCADE,
        passenger_id UUID NOT NULL REFERENCES users(id),
        seats_booked INTEGER NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'confirmed',
        phone VARCHAR(20),
        email VARCHAR(255),
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log("✅ Tabelas verificadas/criadas com sucesso");
  } catch (error) {
    console.error("❌ Erro ao inicializar o banco de dados:", error);
  }
};

// Inicializar o banco de dados quando o servidor iniciar
initDatabase();

// API Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Link-A Backend API funcionando",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
    environment: process.env.NODE_ENV || "production",
  });
});

// Buscar viagens
app.get("/api/rides/search", async (req, res) => {
  try {
    const { from, to, passengers = 1, date } = req.query;

    console.log(
      `Buscar viagens: de ${from} para ${to}, ${passengers} passageiros, data: ${date}`
    );

    let query = `
      SELECT 
        r.*,
        u.first_name || ' ' || u.last_name as driver_name,
        u.rating as driver_rating,
        u.phone as driver_phone,
        COUNT(b.id) as total_bookings,
        COALESCE(SUM(b.seats_booked), 0) as booked_seats
      FROM rides_simple r
      JOIN users u ON r.driver_id = u.id
      LEFT JOIN bookings_simple b ON r.id = b.ride_id
      WHERE r.available_seats >= $1
      AND r.status = 'active'
    `;

    const queryParams = [parseInt(passengers)];
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
      query += ` AND r.departure_date = $${paramCount}`;
      queryParams.push(date);
    }

    query += ` GROUP BY r.id, u.id ORDER BY r.departure_date ASC, r.departure_time ASC`;

    const result = await pool.query(query, queryParams);

    // Transformar resultados para o formato esperado pelo frontend
    const rides = result.rows.map((row) => ({
      id: row.id,
      driverId: row.driver_id,
      fromAddress: row.from_location,
      toAddress: row.to_location,
      date: row.departure_date,
      time: row.departure_time,
      availableSeats: row.available_seats,
      price: row.price_per_seat.toString(),
      vehicleType: row.vehicle_type,
      additionalInfo: row.additional_info,
      status: row.status,
      driverName: row.driver_name || 'Motorista',
      driverRating: row.driver_rating || 4.0,
      driverPhone: row.driver_phone,
      currentPassengers: parseInt(row.booked_seats) || 0,
      createdAt: row.created_at
    }));

    res.json({
      rides: rides,
      pagination: {
        page: 1,
        limit: 20,
        total: rides.length,
      },
    });
  } catch (error) {
    console.error("❌ Erro ao buscar viagens:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: error.message,
    });
  }
});

// Criar nova rota (viagem)
app.post("/api/rides-simple/create", async (req, res) => {
  try {
    const { 
      driverId, 
      fromAddress, 
      toAddress, 
      date, 
      time, 
      seats, 
      price, 
      vehicleType, 
      additionalInfo 
    } = req.body;

    console.log("📦 Dados recebidos para nova rota:", req.body);

    // Validação melhorada
    if (!fromAddress || !toAddress || !date || !time || !seats || !price) {
      return res.status(400).json({
        error: "Dados incompletos",
        message:
          "Preencha todos os campos obrigatórios: origem, destino, data, hora, lugares e preço",
        missing: {
          fromAddress: !fromAddress,
          toAddress: !toAddress,
          date: !date,
          time: !time,
          seats: !seats,
          price: !price,
        },
      });
    }

    // Usar driverId do usuário autenticado ou padrão para teste
    const finalDriverId = driverId || '9624afd4-5385-4601-af6e-4cf747dba1bc';

    // Verificar se o usuário existe
    const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [finalDriverId]);
    if (userCheck.rows.length === 0) {
      // Criar usuário padrão se não existir
      await pool.query(
        'INSERT INTO users (id, email, first_name, last_name) VALUES ($1, $2, $3, $4)',
        [finalDriverId, 'driver@example.com', 'Motorista', 'Padrão']
      );
    }

    // Inserir nova viagem no banco de dados
    const query = `
      INSERT INTO rides_simple (
        driver_id, from_location, to_location, departure_date, departure_time,
        available_seats, price_per_seat, vehicle_type, additional_info
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      finalDriverId,
      fromAddress,
      toAddress,
      date,
      time,
      parseInt(seats),
      parseFloat(price),
      vehicleType || 'Standard',
      additionalInfo || ''
    ];

    const result = await pool.query(query, values);
    const newRide = result.rows[0];

    console.log("✅ Nova rota criada no banco de dados:", newRide);

    res.status(201).json({
      success: true,
      message: "Rota publicada com sucesso!",
      ride: {
        id: newRide.id,
        driverId: newRide.driver_id,
        fromAddress: newRide.from_location,
        toAddress: newRide.to_location,
        date: newRide.departure_date,
        time: newRide.departure_time,
        availableSeats: newRide.available_seats,
        price: newRide.price_per_seat.toString(),
        vehicleType: newRide.vehicle_type,
        additionalInfo: newRide.additional_info,
        status: newRide.status,
        createdAt: newRide.created_at
      }
    });
  } catch (error) {
    console.error("❌ Erro ao criar rota:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: error.message,
    });
  }
});

// Listar todas as rotas (GET para teste)
app.get("/api/rides-simple/create", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, u.first_name || ' ' || u.last_name as driver_name 
      FROM rides_simple r 
      JOIN users u ON r.driver_id = u.id 
      ORDER BY r.created_at DESC
    `);

    const rides = result.rows.map(row => ({
      id: row.id,
      driverId: row.driver_id,
      fromAddress: row.from_location,
      toAddress: row.to_location,
      date: row.departure_date,
      time: row.departure_time,
      availableSeats: row.available_seats,
      price: row.price_per_seat.toString(),
      vehicleType: row.vehicle_type,
      additionalInfo: row.additional_info,
      status: row.status,
      driverName: row.driver_name,
      createdAt: row.created_at
    }));

    res.json({
      success: true,
      message: "Endpoint POST para criar rotas. Use POST para criar nova rota.",
      totalRides: rides.length,
      rides: rides,
    });
  } catch (error) {
    console.error("❌ Erro ao listar rotas:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: error.message,
    });
  }
});

// Rota alternativa também (para compatibilidade)
app.post("/api/rides", async (req, res) => {
  // Redireciona para a rota simple/create
  console.log("📦 Redirecting /api/rides to /api/rides-simple/create");
  req.url = "/api/rides-simple/create";
  app.handle(req, res);
});

// Listar viagens de um motorista
app.get("/api/rides/driver/:driverId", async (req, res) => {
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

    const rides = result.rows.map((row) => ({
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
      totalBookings: parseInt(row.total_bookings),
      status: row.status
    }));

    res.json(rides);
  } catch (error) {
    console.error('❌ Erro ao buscar viagens do motorista:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

// Criar reserva
app.post("/api/rides/book", async (req, res) => {
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

    // Verificar se o passageiro existe
    const passengerCheck = await pool.query('SELECT id FROM users WHERE id = $1', [passengerId]);
    if (passengerCheck.rows.length === 0) {
      // Criar usuário padrão se não existir
      await pool.query(
        'INSERT INTO users (id, email, first_name, last_name, phone) VALUES ($1, $2, $3, $4, $5)',
        [passengerId, email || 'passenger@example.com', 'Passageiro', 'Anônimo', phone || '']
      );
    }

    // Calcular preço total
    const totalPrice = ride.price_per_seat * seatsBooked;

    // Criar reserva
    const bookingQuery = `
      INSERT INTO bookings_simple (
        ride_id, passenger_id, seats_booked, total_price, status, phone, email, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const bookingValues = [
      rideId, 
      passengerId, 
      seatsBooked, 
      totalPrice, 
      'confirmed',
      phone || '',
      email || '',
      notes || ''
    ];

    const bookingResult = await pool.query(bookingQuery, bookingValues);

    // Atualizar lugares disponíveis na viagem
    const updateRideQuery = `
      UPDATE rides_simple 
      SET available_seats = available_seats - $1,
          updated_at = NOW()
      WHERE id = $2
    `;
    await pool.query(updateRideQuery, [seatsBooked, rideId]);

    res.status(201).json({
      success: true,
      booking: {
        id: bookingResult.rows[0].id,
        rideId: bookingResult.rows[0].ride_id,
        passengerId: bookingResult.rows[0].passenger_id,
        seatsBooked: bookingResult.rows[0].seats_booked,
        totalPrice: bookingResult.rows[0].total_price,
        status: bookingResult.rows[0].status,
        phone: bookingResult.rows[0].phone,
        email: bookingResult.rows[0].email,
        notes: bookingResult.rows[0].notes
      }
    });
  } catch (error) {
    console.error('❌ Erro ao criar reserva:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

// Obter detalhes de uma viagem específica
app.get("/api/rides/:rideId", async (req, res) => {
  try {
    const { rideId } = req.params;

    const query = `
      SELECT 
        r.*,
        u.first_name || ' ' || u.last_name as driver_name,
        u.rating as driver_rating,
        u.phone as driver_phone,
        COUNT(b.id) as total_bookings,
        COALESCE(SUM(b.seats_booked), 0) as booked_seats
      FROM rides_simple r
      JOIN users u ON r.driver_id = u.id
      LEFT JOIN bookings_simple b ON r.id = b.ride_id
      WHERE r.id = $1
      GROUP BY r.id, u.id
    `;

    const result = await pool.query(query, [rideId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Viagem não encontrada' });
    }

    const ride = result.rows[0];
    const rideDetails = {
      id: ride.id,
      driverId: ride.driver_id,
      fromAddress: ride.from_location,
      toAddress: ride.to_location,
      date: ride.departure_date,
      time: ride.departure_time,
      availableSeats: ride.available_seats,
      price: ride.price_per_seat.toString(),
      vehicleType: ride.vehicle_type,
      additionalInfo: ride.additional_info,
      status: ride.status,
      driverName: ride.driver_name,
      driverRating: ride.driver_rating,
      driverPhone: ride.driver_phone,
      currentPassengers: parseInt(ride.booked_seats) || 0,
      totalBookings: parseInt(ride.total_bookings) || 0,
      createdAt: ride.created_at
    };

    res.json(rideDetails);
  } catch (error) {
    console.error('❌ Erro ao buscar detalhes da viagem:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

// Cancelar uma viagem
app.put("/api/rides/:rideId/cancel", async (req, res) => {
  try {
    const { rideId } = req.params;

    const query = `
      UPDATE rides_simple 
      SET status = 'cancelled', updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [rideId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Viagem não encontrada' });
    }

    res.json({
      success: true,
      message: 'Viagem cancelada com sucesso',
      ride: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Erro ao cancelar viagem:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

// Catch-all para rotas API não encontradas
app.use("/api/*", (req, res) => {
  res.status(404).json({
    error: "API endpoint não encontrado",
    path: req.path,
    method: req.method,
    availableEndpoints: [
      "GET /api/health",
      "GET /api/rides/search",
      "POST /api/rides-simple/create",
      "GET /api/rides-simple/create",
      "GET /api/rides/driver/:driverId",
      "POST /api/rides/book",
      "GET /api/rides/:rideId",
      "PUT /api/rides/:rideId/cancel"
    ],
  });
});

// Catch-all para outras rotas
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Rota não encontrada",
    message: "Consulte /api/health para endpoints disponíveis",
  });
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  console.error('❌ Erro não tratado:', error);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Algo deu errado'
  });
});

// Iniciar servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🌐 Link-A Backend Server running on port ${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api/`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  console.log(`🚗 Rides: http://localhost:${PORT}/api/rides-simple/create`);
  console.log("✅ Backend funcionando corretamente com PostgreSQL");
});

export default app;