import { Router } from "express";
import { storage } from "../../shared/storage.js";

const router = Router();

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

    const filters = {};
    
    if (fromAddress) filters.fromAddress = fromAddress;
    if (toAddress) filters.toAddress = toAddress;
    if (type) filters.type = type;
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    if (departureDate) filters.departureDate = departureDate;

    const rides = await storage.getAllRides(filters);
    
    // Paginação simples
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedRides = rides.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        rides: paginatedRides,
        total: rides.length,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(rides.length / parseInt(limit))
      }
    });
  } catch (error) {
    console.error("Erro ao buscar viagens:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

// POST /api/rides - Cria nova viagem (requer autenticação)
router.post("/", async (req, res) => {
  try {
    const rideData = req.body;
    
    // Validação básica
    if (!rideData.fromAddress || !rideData.toAddress || !rideData.price) {
      return res.status(400).json({
        success: false,
        message: "Campos obrigatórios: fromAddress, toAddress, price"
      });
    }

    // Adicionar ID do motorista (mock por enquanto)
    const newRide = {
      ...rideData,
      driverId: `driver-${Date.now()}`,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const createdRide = await storage.createRide(newRide);

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
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const ride = await storage.getRideById(id);

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

// PUT /api/rides/:id - Atualiza viagem
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existingRide = await storage.getRideById(id);
    if (!existingRide) {
      return res.status(404).json({
        success: false,
        message: "Viagem não encontrada"
      });
    }

    const updatedRide = await storage.updateRide(id, updateData);

    res.json({
      success: true,
      data: updatedRide,
      message: "Viagem atualizada com sucesso"
    });
  } catch (error) {
    console.error("Erro ao atualizar viagem:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

// DELETE /api/rides/:id - Deleta viagem
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const existingRide = await storage.getRideById(id);
    if (!existingRide) {
      return res.status(404).json({
        success: false,
        message: "Viagem não encontrada"
      });
    }

    await storage.deleteRide(id);

    res.json({
      success: true,
      message: "Viagem deletada com sucesso"
    });
  } catch (error) {
    console.error("Erro ao deletar viagem:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
});

// GET /api/rides/search - Busca avançada de viagens
router.get("/search", async (req, res) => {
  try {
    const {
      origin,
      destination,
      date,
      passengers,
      type,
      maxPrice,
      sort = 'departureDate'
    } = req.query;

    let rides = await storage.getAllRides();

    // Filtros de busca
    if (origin) {
      rides = rides.filter(ride => 
        ride.fromAddress?.toLowerCase().includes(origin.toLowerCase())
      );
    }

    if (destination) {
      rides = rides.filter(ride => 
        ride.toAddress?.toLowerCase().includes(destination.toLowerCase())
      );
    }

    if (date) {
      rides = rides.filter(ride => {
        if (!ride.departureDate) return false;
        const rideDate = new Date(ride.departureDate).toDateString();
        const searchDate = new Date(date).toDateString();
        return rideDate === searchDate;
      });
    }

    if (passengers) {
      rides = rides.filter(ride => 
        ride.maxPassengers >= parseInt(passengers)
      );
    }

    if (type) {
      rides = rides.filter(ride => ride.type === type);
    }

    if (maxPrice) {
      rides = rides.filter(ride => 
        parseFloat(ride.price) <= parseFloat(maxPrice)
      );
    }

    // Ordenação
    if (sort === 'price') {
      rides = rides.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sort === 'departureDate') {
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