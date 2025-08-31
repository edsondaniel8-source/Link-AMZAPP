import express from "express";
import cors from "cors";
import { db } from "./db.ts";
import { rides } from "./src/shared/schema.ts";

const app = express();
const PORT = process.env.PORT || 3001;

console.log("🚀 Inicializando Link-A Backend...");

// CORS e middleware
app.use(cors({
  origin: ["http://localhost:5000", "http://localhost:5001"],
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: "OK",
    message: "Link-A Backend API funcionando",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
    environment: process.env.NODE_ENV || "development"
  });
});

// GET /api/rides - Lista todas as viagens
app.get('/api/rides', async (req, res) => {
  try {
    console.log("GET /api/rides - Buscando viagens...");
    const allRides = await db.select().from(rides);
    console.log(`Encontradas ${allRides.length} viagens`);
    
    res.json({
      success: true,
      data: { rides: allRides, total: allRides.length }
    });
  } catch (error) {
    console.error("Erro ao buscar viagens:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
      error: error.message
    });
  }
});

// POST /api/rides - Cria nova viagem
app.post('/api/rides', async (req, res) => {
  try {
    console.log("POST /api/rides - Criando viagem:", req.body);
    const rideData = req.body;
    
    if (!rideData.fromAddress || !rideData.toAddress || !rideData.price) {
      return res.status(400).json({
        success: false,
        message: "Campos obrigatórios: fromAddress, toAddress, price"
      });
    }

    const newRide = {
      ...rideData,
      driverId: `driver-${Date.now()}`,
      isActive: true,
      createdAt: new Date()
    };

    const [createdRide] = await db.insert(rides).values(newRide).returning();
    console.log("Viagem criada:", createdRide);

    res.status(201).json({
      success: true,
      data: createdRide,
      message: "Viagem criada com sucesso"
    });
  } catch (error) {
    console.error("Erro ao criar viagem:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
      error: error.message
    });
  }
});

// Catch all para debug
app.use('/api/*', (req, res) => {
  console.log(`API endpoint não encontrado: ${req.method} ${req.path}`);
  res.status(404).json({
    error: "API endpoint não encontrado",
    path: req.path,
    method: req.method
  });
});

// Graceful shutdown
const signals = ['SIGTERM', 'SIGINT'];
signals.forEach(signal => {
  process.on(signal, () => {
    console.log(`🛑 Recebido sinal ${signal}. Iniciando shutdown elegante...`);
    process.exit(0);
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 Link-A Backend Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}/`);
  console.log(`🔌 API: http://localhost:${PORT}/api/`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  console.log("✅ Todas as APIs configuradas e funcionando");
});