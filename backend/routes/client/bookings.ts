import { Router } from 'express';
import { verifyFirebaseToken, requireClientRole } from '../../middleware/role-auth';

const router = Router();

// Aplicar middleware de autenticação em todas as rotas de cliente
router.use(verifyFirebaseToken);
router.use(requireClientRole);

// GET /api/client/bookings - Buscar reservas do cliente
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.uid;
    
    // Mock data - substituir por consulta real ao banco
    const bookings = [
      {
        id: '1',
        type: 'ride',
        status: 'confirmed',
        from: 'Maputo',
        to: 'Matola',
        date: '2025-01-15',
        time: '08:00',
        price: 150,
        driver: 'João Silva',
        vehicle: 'Toyota Hiace'
      }
    ];
    
    res.json(bookings);
  } catch (error) {
    console.error('Erro ao buscar reservas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/client/bookings - Criar nova reserva
router.post('/', async (req, res) => {
  try {
    const userId = req.user?.uid;
    const { type, from, to, date, time, passengers } = req.body;
    
    // Validação básica
    if (!type || !from || !to || !date) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: type, from, to, date' 
      });
    }
    
    // Mock - criar reserva
    const newBooking = {
      id: Date.now().toString(),
      userId,
      type,
      from,
      to,
      date,
      time,
      passengers,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/client/bookings/:id - Atualizar reserva
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.uid;
    const updates = req.body;
    
    // Mock - atualizar reserva
    const updatedBooking = {
      id,
      userId,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    res.json(updatedBooking);
  } catch (error) {
    console.error('Erro ao atualizar reserva:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/client/bookings/:id - Cancelar reserva
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.uid;
    
    // Mock - cancelar reserva
    res.json({ 
      message: 'Reserva cancelada com sucesso',
      bookingId: id
    });
  } catch (error) {
    console.error('Erro ao cancelar reserva:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;