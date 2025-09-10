import { Router } from 'express';
import { verifyFirebaseToken, requireDriverRole } from '../../middleware/role-auth';
import { AuthenticatedUser } from '../../shared/types'; // ✅ Importação adicionada

const router = Router();

// Aplicar middleware de autenticação específico para motoristas
router.use(verifyFirebaseToken);
router.use(requireDriverRole);

// GET /api/provider/rides - Listar viagens do motorista
router.get('/', async (req, res) => {
  try {
    const driverId = (req.user as AuthenticatedUser)?.uid; // ✅ CORRIGIDO
    const { status, page = 1, limit = 10 } = req.query;
    
    if (!driverId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    
    // Mock data - substituir por consulta real
    const rides = [
      {
        id: '1',
        driverId,
        from: 'Maputo Centro',
        to: 'Matola Santos',
        departure: '2025-01-15T08:00:00Z',
        arrival: '2025-01-15T08:45:00Z',
        status: 'completed',
        passengers: 4,
        maxPassengers: 7,
        price: 350,
        vehicle: 'Toyota Hiace Branca',
        rating: 5
      },
      {
        id: '2',
        driverId,
        from: 'Maputo',
        to: 'Xai-Xai',
        departure: '2025-01-16T06:00:00Z',
        status: 'scheduled',
        passengers: 2,
        maxPassengers: 14,
        price: 800,
        vehicle: 'Mercedes Sprinter',
        rating: null
      }
    ];
    
    const filteredRides = status ? 
      rides.filter(ride => ride.status === status) : 
      rides;
    
    res.json({
      rides: filteredRides,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: filteredRides.length
      }
    });
  } catch (error) {
    console.error('Erro ao buscar viagens:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/provider/rides - Criar nova oferta de viagem
router.post('/', async (req, res) => {
  try {
    const driverId = (req.user as AuthenticatedUser)?.uid; // ✅ CORRIGIDO
    const { 
      from, 
      to, 
      departure, 
      maxPassengers, 
      price, 
      vehicle, 
      description 
    } = req.body;
    
    if (!driverId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    
    // Validação
    if (!from || !to || !departure || !maxPassengers || !price) {
      return res.status(400).json({
        error: 'Campos obrigatórios: from, to, departure, maxPassengers, price'
      });
    }
    
    // Mock - criar viagem
    const newRide = {
      id: Date.now().toString(),
      driverId,
      from,
      to,
      departure,
      maxPassengers,
      price,
      vehicle,
      description,
      status: 'scheduled',
      passengers: 0,
      createdAt: new Date().toISOString()
    };
    
    res.status(201).json(newRide);
  } catch (error) {
    console.error('Erro ao criar viagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/provider/rides/:id - Atualizar viagem
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const driverId = (req.user as AuthenticatedUser)?.uid; // ✅ CORRIGIDO
    const updates = req.body;
    
    if (!driverId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    
    // Mock - atualizar viagem
    const updatedRide = {
      id,
      driverId,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    res.json(updatedRide);
  } catch (error) {
    console.error('Erro ao atualizar viagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/provider/rides/:id - Cancelar viagem
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const driverId = (req.user as AuthenticatedUser)?.uid; // ✅ CORRIGIDO
    
    if (!driverId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    
    // Mock - cancelar viagem
    res.json({
      message: 'Viagem cancelada com sucesso',
      rideId: id
    });
  } catch (error) {
    console.error('Erro ao cancelar viagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;