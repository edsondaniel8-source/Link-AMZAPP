// Backend simples para testar a API
import express from "express";
import cors from "cors";

const app = express();
const PORT = 8000;

// CORS
app.use(
  cors({
    origin: ["http://localhost:5000", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

app.use(express.json());

// API Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Link-A Backend API funcionando",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
    environment: process.env.NODE_ENV || "development",
  });
});

// Buscar viagens (mock para teste)
app.get("/api/rides/search", (req, res) => {
  const { from, to, passengers = 1 } = req.query;

  console.log(
    `Buscar viagens: de ${from} para ${to}, ${passengers} passageiros`,
  );

  // Mock data para teste
  const mockRides = [
    {
      id: "1",
      type: "Standard",
      fromAddress: from || "Maputo",
      toAddress: to || "Matola",
      price: "50.00",
      estimatedDuration: 30,
      availableSeats: 3,
      driverName: "João Silva",
      vehicleInfo: "Toyota Corolla Branco",
      departureDate: new Date().toISOString(),
    },
    {
      id: "2",
      type: "Comfort",
      fromAddress: from || "Maputo",
      toAddress: to || "Matola",
      price: "75.00",
      estimatedDuration: 25,
      availableSeats: 2,
      driverName: "Maria Santos",
      vehicleInfo: "Honda Civic Prata",
      departureDate: new Date().toISOString(),
    },
  ];

  res.json({
    rides: mockRides,
    pagination: {
      page: 1,
      limit: 20,
      total: mockRides.length,
    },
  });
});

// Criar nova rota (viagem)
app.post("/api/rides", (req, res) => {
  try {
    const { from, to, date, time, seats, price, vehicleType, additionalInfo } =
      req.body;

    console.log("📦 Dados recebidos para nova rota:", req.body);

    // Validação básica
    if (!from || !to || !date || !time || !seats || !price) {
      return res.status(400).json({
        error: "Dados incompletos",
        message: "Preencha todos os campos obrigatórios",
      });
    }

    // Mock response - substitua com sua lógica real
    const newRide = {
      id: Math.random().toString(36).substr(2, 9),
      from,
      to,
      date,
      time,
      seats: parseInt(seats),
      price: parseFloat(price),
      vehicleType: vehicleType || "Standard",
      additionalInfo: additionalInfo || "",
      status: "active",
      createdAt: new Date().toISOString(),
      driverId: "mock-driver-id", // Substitua com ID real do usuário autenticado
    };

    console.log("✅ Nova rota criada:", newRide);

    res.status(201).json({
      success: true,
      message: "Rota publicada com sucesso!",
      ride: newRide,
    });
  } catch (error) {
    console.error("❌ Erro ao criar rota:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: error.message,
    });
  }
}); // ✅ FECHAMENTO CORRETO DA ROTA POST

// Catch-all para rotas não encontradas
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({
      error: "API endpoint não encontrado",
      path: req.path,
    });
  }
  res.status(404).json({ error: "Rota não encontrada" });
});

// Iniciar servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🌐 Link-A Backend Server running on port ${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api/`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  console.log("✅ Backend funcionando corretamente");
});

export default app;
