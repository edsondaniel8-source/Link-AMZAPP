import { Router } from 'express';
import { z } from 'zod';
import { db } from '../../db';
import { accommodations, bookings } from '../../shared/unified-schema';
import { verifyFirebaseToken } from '../auth';
import { eq, and, or, gte, lte } from 'drizzle-orm';

const router = Router();

// Schema para criar novo alojamento (Hotel Manager)
const createAccommodationSchema = z.object({
  hostId: z.string(),
  hostName: z.string(),
  hostPhone: z.string(),
  name: z.string(),
  type: z.enum(['hotel', 'apartment', 'villa', 'lodge', 'guesthouse']),
  description: z.string(),
  address: z.string(),
  city: z.string(),
  province: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  pricePerNight: z.number(),
  maxGuests: z.number(),
  bedrooms: z.number(),
  bathrooms: z.number(),
  amenities: z.array(z.string()).optional(),
  photos: z.array(z.string()).optional(),
  policies: z.string().optional(),
});

// Criar novo alojamento (Hotel Manager)
router.post('/create', async (req, res) => {
  try {
    const accommodationData = createAccommodationSchema.parse(req.body);
    
    console.log('🏨 [HOTEL] Criando novo alojamento:', accommodationData);

    const [newAccommodation] = await db
      .insert(accommodations)
      .values({
        ...accommodationData,
        isActive: true,
      })
      .returning();

    console.log('✅ [HOTEL] Alojamento criado com sucesso:', newAccommodation.id);

    res.status(201).json({
      success: true,
      message: 'Alojamento registrado com sucesso',
      accommodation: newAccommodation
    });

  } catch (error) {
    console.error('❌ [HOTEL] Erro ao criar alojamento:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Listar alojamentos do host
router.get('/my-properties/:hostId', async (req, res) => {
  try {
    const { hostId } = req.params;
    
    console.log('🔍 [HOTEL] Buscando propriedades do host:', hostId);

    const hostProperties = await db
      .select()
      .from(accommodations)
      .where(eq(accommodations.hostId, hostId))
      .orderBy(accommodations.createdAt);

    console.log(`✅ [HOTEL] Encontradas ${hostProperties.length} propriedades`);

    res.json({
      success: true,
      properties: hostProperties
    });

  } catch (error) {
    console.error('❌ [HOTEL] Erro ao buscar propriedades:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Verificar disponibilidade de alojamento
router.post('/check-availability', async (req, res) => {
  try {
    const { accommodationId, checkInDate, checkOutDate } = req.body;
    
    if (!accommodationId || !checkInDate || !checkOutDate) {
      return res.status(400).json({
        error: 'Dados incompletos',
        message: 'Informe o ID do alojamento e as datas'
      });
    }

    console.log('🔍 [HOTEL] Verificando disponibilidade:', { accommodationId, checkInDate, checkOutDate });

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Buscar reservas conflitantes
    const conflictingBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.serviceId, accommodationId),
          eq(bookings.serviceType, 'accommodation'),
          or(
            eq(bookings.status, 'pending'),
            eq(bookings.status, 'confirmed')
          ),
          or(
            // Check-in durante estadia existente
            and(
              lte(bookings.checkInDate, checkIn),
              gte(bookings.checkOutDate, checkIn)
            ),
            // Check-out durante estadia existente
            and(
              lte(bookings.checkInDate, checkOut),
              gte(bookings.checkOutDate, checkOut)
            ),
            // Estadia engloba período existente
            and(
              gte(bookings.checkInDate, checkIn),
              lte(bookings.checkOutDate, checkOut)
            )
          )
        )
      );

    const isAvailable = conflictingBookings.length === 0;

    console.log(`✅ [HOTEL] Disponibilidade verificada: ${isAvailable ? 'Disponível' : 'Indisponível'}`);

    res.json({
      success: true,
      available: isAvailable,
      conflicts: conflictingBookings.length,
      message: isAvailable ? 'Alojamento disponível para as datas selecionadas' : 'Alojamento não disponível para as datas selecionadas'
    });

  } catch (error) {
    console.error('❌ [HOTEL] Erro ao verificar disponibilidade:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Atualizar alojamento (Hotel Manager)
router.patch('/:accommodationId', async (req, res) => {
  try {
    const { accommodationId } = req.params;
    const updateData = req.body;
    
    console.log('✏️ [HOTEL] Atualizando alojamento:', accommodationId, updateData);

    const [updatedAccommodation] = await db
      .update(accommodations)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(accommodations.id, accommodationId))
      .returning();

    if (!updatedAccommodation) {
      return res.status(404).json({
        error: 'Alojamento não encontrado',
        message: 'Este alojamento não existe'
      });
    }

    console.log('✅ [HOTEL] Alojamento atualizado com sucesso');

    res.json({
      success: true,
      message: 'Alojamento atualizado com sucesso',
      accommodation: updatedAccommodation
    });

  } catch (error) {
    console.error('❌ [HOTEL] Erro ao atualizar alojamento:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Desativar alojamento (Hotel Manager)
router.patch('/:accommodationId/deactivate', async (req, res) => {
  try {
    const { accommodationId } = req.params;
    
    console.log('🚫 [HOTEL] Desativando alojamento:', accommodationId);

    const [updatedAccommodation] = await db
      .update(accommodations)
      .set({ 
        isActive: false,
        updatedAt: new Date()
      })
      .where(eq(accommodations.id, accommodationId))
      .returning();

    if (!updatedAccommodation) {
      return res.status(404).json({
        error: 'Alojamento não encontrado',
        message: 'Este alojamento não existe'
      });
    }

    console.log('✅ [HOTEL] Alojamento desativado com sucesso');

    res.json({
      success: true,
      message: 'Alojamento desativado com sucesso',
      accommodation: updatedAccommodation
    });

  } catch (error) {
    console.error('❌ [HOTEL] Erro ao desativar alojamento:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

export default router;