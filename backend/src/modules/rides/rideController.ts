import { Router, Request, Response, NextFunction } from "express";
import { storage } from "../../shared/storage";
import { insertRideSchema } from "../../shared/storage";
import { z } from "zod";

const router = Router();

// Middleware de autenticação temporário
interface AuthenticatedRequest extends Request {
  user?: {
    claims?: {
      sub?: string;
      email?: string;
    };
  };
}

const verifyFirebaseToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Token não fornecido" });
  }
  
  // Mock validation - replace with real Firebase verification
  (req as AuthenticatedRequest).user = {
    claims: { sub: `firebase-${Date.now()}`, email: "test@linkamz.com" }
  };
  
  next();
};

// GET /api/rides - Lista todas as viagens com filtros
router.get("/", async (req, res) => {
  try {
    const { 
      fromAddress, 
      toAddress, 
      type, 
      isActive, 
      departureDate,
      page = 1, 
      limit = 20 
    } = req.query;

    const filters: any = {};
    
    if (fromAddress) filters.fromAddress = fromAddress;
    if (toAddress) filters.toAddress = toAddress;
    if (type) filters.type = type;
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    if (departureDate) filters.departureDate = new Date(departureDate as string);

    const rides = await storage.getRides(filters);
    
    // Aplicar paginação
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedRides = rides.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        rides: paginatedRides,
        total: rides.length,
        page: Number(page),
        totalPages: Math.ceil(rides.length / Number(limit))
      }
    });
  } catch (error) {
    console.error("Erro ao listar viagens:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
      error: "Failed to fetch rides"
    });
  }
});

// GET /api/rides/:id - Obter viagem específica
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const ride = await storage.getRide(id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Viagem não encontrada"
      });
    }

    res.json({
      success: true,
      data: { ride }
    });
  } catch (error) {
    console.error("Erro ao buscar viagem:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

// POST /api/rides - Criar nova viagem (apenas motoristas)
router.post("/", verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  
  try {
    const userId = authReq.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    // Validar dados com Zod
    const createRideSchema = insertRideSchema.omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });

    const validatedData = createRideSchema.parse({
      ...req.body,
      driverId: userId,
      departureDate: req.body.departureDate ? new Date(req.body.departureDate) : undefined,
      returnDate: req.body.returnDate ? new Date(req.body.returnDate) : undefined
    });

    const newRide = await storage.createRide(validatedData);

    res.status(201).json({
      success: true,
      message: "Viagem criada com sucesso",
      data: { ride: newRide }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Dados inválidos",
        errors: error.errors
      });
    }

    console.error("Erro ao criar viagem:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

// PUT /api/rides/:id - Atualizar viagem
router.put("/:id", verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  
  try {
    const userId = authReq.user?.claims?.sub;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    // Verificar se a viagem existe e pertence ao usuário
    const existingRide = await storage.getRide(id);
    if (!existingRide) {
      return res.status(404).json({
        success: false,
        message: "Viagem não encontrada"
      });
    }

    if (existingRide.driverId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Sem permissão para editar esta viagem"
      });
    }

    const updateData = {
      ...req.body,
      departureDate: req.body.departureDate ? new Date(req.body.departureDate) : undefined,
      returnDate: req.body.returnDate ? new Date(req.body.returnDate) : undefined
    };

    const updatedRide = await storage.updateRide(id, updateData);

    res.json({
      success: true,
      message: "Viagem atualizada com sucesso",
      data: { ride: updatedRide }
    });
  } catch (error) {
    console.error("Erro ao atualizar viagem:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

// DELETE /api/rides/:id - Excluir viagem
router.delete("/:id", verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  
  try {
    const userId = authReq.user?.claims?.sub;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    // Verificar se a viagem existe e pertence ao usuário
    const existingRide = await storage.getRide(id);
    if (!existingRide) {
      return res.status(404).json({
        success: false,
        message: "Viagem não encontrada"
      });
    }

    if (existingRide.driverId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Sem permissão para excluir esta viagem"
      });
    }

    const deleted = await storage.deleteRide(id);
    
    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: "Erro ao excluir viagem"
      });
    }

    res.json({
      success: true,
      message: "Viagem excluída com sucesso"
    });
  } catch (error) {
    console.error("Erro ao excluir viagem:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

// GET /api/rides/driver/:driverId - Listar viagens de um motorista específico
router.get("/driver/:driverId", async (req, res) => {
  try {
    const { driverId } = req.params;
    const { status } = req.query;

    let filters: any = {};
    
    const rides = await storage.getRides(filters);
    
    // Filtrar por motorista
    let driverRides = rides.filter(ride => ride.driverId === driverId);
    
    // Filtrar por status se fornecido
    if (status === 'active') {
      driverRides = driverRides.filter(ride => ride.isActive);
    } else if (status === 'inactive') {
      driverRides = driverRides.filter(ride => !ride.isActive);
    }

    res.json({
      success: true,
      data: { rides: driverRides }
    });
  } catch (error) {
    console.error("Erro ao listar viagens do motorista:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

// GET /api/rides/search - Pesquisar viagens com parâmetros avançados
router.get("/search", async (req, res) => {
  try {
    const { 
      origin, 
      destination,
      date,
      passengers = 1,
      type,
      maxPrice,
      sortBy = 'departureDate'
    } = req.query;

    const filters: any = {};
    
    if (origin) filters.fromAddress = origin;
    if (destination) filters.toAddress = destination;
    if (type) filters.type = type;
    
    let rides = await storage.getRides(filters);
    
    // Filtros adicionais
    if (date) {
      const searchDate = new Date(date as string);
      rides = rides.filter(ride => {
        if (!ride.departureDate) return true;
        const rideDate = new Date(ride.departureDate);
        return rideDate.toDateString() === searchDate.toDateString();
      });
    }
    
    if (passengers) {
      const requiredSeats = Number(passengers);
      rides = rides.filter(ride => 
        (ride.availableSeats || 0) >= requiredSeats
      );
    }
    
    if (maxPrice) {
      rides = rides.filter(ride => 
        Number(ride.price) <= Number(maxPrice)
      );
    }

    // Ordenação
    if (sortBy === 'price') {
      rides = rides.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'departureDate') {
      rides = rides.sort((a, b) => {
        if (!a.departureDate || !b.departureDate) return 0;
        return new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime();
      });
    }

    res.json({
      success: true,
      data: { 
        rides,
        count: rides.length,
        filters: {
          origin,
          destination,
          date,
          passengers,
          type,
          maxPrice
        }
      }
    });
  } catch (error) {
    console.error("Erro na pesquisa de viagens:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

export default router;