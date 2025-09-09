import { Router, Request, Response, NextFunction } from "express";
import { db } from "../../../db";
import { rides, type Ride, insertRideSchema } from "../../../shared/schema";
import { authStorage } from "../../shared/authStorage";
import { type AuthenticatedRequest, verifyFirebaseToken } from "../../shared/firebaseAuth";
import { z } from "zod";
import { eq } from "drizzle-orm";

const router = Router();

// Helper functions for database queries
const getRides = async (filters: any = {}): Promise<Ride[]> => {
  return await db.select().from(rides);
};

const getRide = async (id: string): Promise<Ride | undefined> => {
  const [ride] = await db.select().from(rides).where(eq(rides.id, id));
  return ride;
};

const createRide = async (data: any): Promise<Ride> => {
  const [ride] = await db.insert(rides).values(data).returning();
  return ride;
};

const updateRide = async (id: string, data: any): Promise<Ride | null> => {
  const [ride] = await db.update(rides).set(data).where(eq(rides.id, id)).returning();
  return ride || null;
};

const deleteRide = async (id: string): Promise<boolean> => {
  const result = await db.delete(rides).where(eq(rides.id, id));
  return (result.rowCount || 0) > 0;
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

    const rides = await getRides(filters);
    
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
    const ride = await getRide(id);

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
    const userId = authReq.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    // Validar dados com Zod
    const createRideSchema = insertRideSchema.omit({
      id: true,
      createdAt: true
    });

    const validatedData = createRideSchema.parse({
      ...req.body,
      driverId: userId,
      departureDate: req.body.departureDate ? new Date(req.body.departureDate) : undefined,
      returnDate: req.body.returnDate ? new Date(req.body.returnDate) : undefined
    });

    const newRide = await createRide(validatedData);

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
    const userId = authReq.user?.uid;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    // Verificar se a viagem existe e pertence ao usuário
    const existingRide = await getRide(id);
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

    const updatedRide = await updateRide(id, updateData);

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
    const userId = authReq.user?.uid;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    // Verificar se a viagem existe e pertence ao usuário
    const existingRide = await getRide(id);
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

    const deleted = await deleteRide(id);
    
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
    
    const rides = await getRides(filters);
    
    // Filtrar por motorista
    let driverRides = rides.filter((ride: Ride) => ride.driverId === driverId);
    
    // Filtrar por status se fornecido
    if (status === 'active') {
      driverRides = driverRides.filter((ride: Ride) => ride.status === 'active');
    } else if (status === 'inactive') {
      driverRides = driverRides.filter((ride: Ride) => ride.status !== 'active');
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
    
    let rides = await getRides(filters);
    
    // Filtros adicionais
    if (date) {
      const searchDate = new Date(date as string);
      rides = rides.filter((ride: Ride) => {
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
      rides = rides.filter((ride: Ride) => 
        Number(ride.pricePerSeat) <= Number(maxPrice)
      );
    }

    // Ordenação
    if (sortBy === 'price') {
      rides = rides.sort((a: Ride, b: Ride) => Number(a.pricePerSeat) - Number(b.pricePerSeat));
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