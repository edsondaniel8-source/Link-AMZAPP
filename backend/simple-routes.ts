import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./src/shared/storage";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Health check - já funciona
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
      const rides = await storage.getRides();
      console.log(`Encontradas ${rides.length} viagens`);
      
      res.json({
        success: true,
        data: { rides, total: rides.length }
      });
    } catch (error) {
      console.error("Erro ao buscar viagens:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor"
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
        createdAt: new Date().toISOString()
      };

      const createdRide = await storage.createRide(newRide);
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
        message: "Erro interno do servidor"
      });
    }
  });

  // GET /api/rides/:id - Busca viagem por ID
  app.get('/api/rides/:id', async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`GET /api/rides/${id} - Buscando viagem...`);
      
      const ride = await storage.getRide(id);

      if (!ride) {
        return res.status(404).json({
          success: false,
          message: "Viagem não encontrada"
        });
      }

      res.json({
        success: true,
        data: ride
      });
    } catch (error) {
      console.error("Erro ao buscar viagem:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor"
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

  const httpServer = createServer(app);
  
  return httpServer;
}