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
      "https://link-amzapp-production.up.railway.app", // ← SEU FRONTEND
      "https://link-aturismomoz.com", // ← ADICIONE SEU DOMÍNIO REAL
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

app.use(express.json());

// Armazenamento em memória (substitua por database real)
let rides = [];

// API Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Link-A Backend API funcionando",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
    environment: process.env.NODE_ENV || "production",
    totalRides: rides.length,
  });
});

// Buscar viagens
app.get("/api/rides/search", (req, res) => {
  const { from, to, passengers = 1 } = req.query;

  console.log(
    `Buscar viagens: de ${from} para ${to}, ${passengers} passageiros`,
  );

  // Filtra as viagens
  let filteredRides = rides.filter(
    (ride) =>
      (!from || ride.fromAddress.toLowerCase().includes(from.toLowerCase())) &&
      (!to || ride.toAddress.toLowerCase().includes(to.toLowerCase())) &&
      ride.availableSeats >= parseInt(passengers),
  );

  res.json({
    rides: filteredRides,
    pagination: {
      page: 1,
      limit: 20,
      total: filteredRides.length,
    },
  });
});

// Criar nova rota (viagem) - ROTA QUE ESTAVA FALTANDO
app.post("/api/simplified-rides", (req, res) => {
  try {
    const { from, to, date, time, seats, price, vehicleType, additionalInfo } =
      req.body;

    console.log("📦 Dados recebidos para nova rota:", req.body);

    // Validação melhorada
    if (!from || !to || !date || !time || !seats || !price) {
      return res.status(400).json({
        error: "Dados incompletos",
        message:
          "Preencha todos os campos obrigatórios: origem, destino, data, hora, lugares e preço",
        missing: {
          from: !from,
          to: !to,
          date: !date,
          time: !time,
          seats: !seats,
          price: !price,
        },
      });
    }

    // Criar nova viagem
    const newRide = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      fromAddress: from,
      toAddress: to,
      date,
      time,
      availableSeats: parseInt(seats),
      price: parseFloat(price),
      vehicleType: vehicleType || "Standard",
      additionalInfo: additionalInfo || "",
      status: "active",
      createdAt: new Date().toISOString(),
      driverId: "mock-driver-id", // Em produção, use req.user.id
      driverName: "Motorista",
      vehicleInfo: vehicleType
        ? `${vehicleType} - Disponível`
        : "Veículo Disponível",
      estimatedDuration: 30, // minutos
    };

    // Adiciona à lista
    rides.push(newRide);

    console.log("✅ Nova rota criada:", newRide);

    res.status(201).json({
      success: true,
      message: "Rota publicada com sucesso!",
      ride: newRide,
      totalRides: rides.length,
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
app.get("/api/rides-simple/create", (req, res) => {
  res.json({
    success: true,
    message: "Endpoint POST para criar rotas. Use POST para criar nova rota.",
    totalRides: rides.length,
    rides: rides,
  });
});

// Rota alternativa também (para compatibilidade)
app.post("/api/rides", (req, res) => {
  // Redireciona para a rota simple/create
  console.log("📦 Redirecting /api/rides to /api/rides-simple/create");
  req.url = "/api/rides-simple/create";
  app.handle(req, res);
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
      "POST /api/rides-simple/create",
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

// Iniciar servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🌐 Link-A Backend Server running on port ${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api/`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  console.log(`🚗 Rides: http://localhost:${PORT}/api/rides-simple/create`);
  console.log("✅ Backend funcionando corretamente");
});

export default app;
