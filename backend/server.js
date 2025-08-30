// Backend simples para testar a API
import express from "express";
import cors from "cors";

const app = express();
const PORT = 8000;

// CORS
app.use(cors({
  origin: ['http://localhost:5000', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// API Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Link-A Backend API funcionando',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Buscar viagens (mock para teste)
app.get('/api/rides/search', (req, res) => {
  const { from, to, passengers = 1 } = req.query;
  
  console.log(`Buscar viagens: de ${from} para ${to}, ${passengers} passageiros`);
  
  // Mock data para teste
  const mockRides = [
    {
      id: '1',
      type: 'Standard',
      fromAddress: from || 'Maputo',
      toAddress: to || 'Matola',
      price: '50.00',
      estimatedDuration: 30,
      availableSeats: 3,
      driverName: 'João Silva',
      vehicleInfo: 'Toyota Corolla Branco',
      departureDate: new Date().toISOString()
    },
    {
      id: '2', 
      type: 'Comfort',
      fromAddress: from || 'Maputo',
      toAddress: to || 'Matola',
      price: '75.00',
      estimatedDuration: 25,
      availableSeats: 2,
      driverName: 'Maria Santos',
      vehicleInfo: 'Honda Civic Prata',
      departureDate: new Date().toISOString()
    }
  ];
  
  res.json({
    rides: mockRides,
    pagination: {
      page: 1,
      limit: 20,
      total: mockRides.length
    }
  });
});

// Catch-all para rotas não encontradas
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ 
      error: 'API endpoint não encontrado',
      path: req.path 
    });
  }
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 Link-A Backend Server running on port ${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api/`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  console.log('✅ Backend funcionando corretamente');
});

export default app;