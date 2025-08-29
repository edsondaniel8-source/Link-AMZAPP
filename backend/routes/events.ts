import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db.js';
import { events, bookings } from '../shared/schema.js';
import { verifyFirebaseToken, verifyRole } from './auth.js';
import { eq, and, gte, lte, like, desc } from 'drizzle-orm';

const router = Router();

// Schema para buscar eventos
const searchEventsSchema = z.object({
  location: z.string().optional(),
  category: z.string().optional(),
  eventType: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  maxPrice: z.number().optional(),
  page: z.number().default(1),
  limit: z.number().default(20),
});

// Schema para criar evento
const createEventSchema = z.object({
  title: z.string(),
  description: z.string(),
  eventType: z.string(), // feira, festival, concerto, conferencia, casamento, festa
  category: z.string(), // cultura, negocios, entretenimento, gastronomia, educacao
  venue: z.string(),
  address: z.string(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  startDate: z.string(),
  endDate: z.string(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  isPaid: z.boolean().default(false),
  ticketPrice: z.number().default(0),
  maxTickets: z.number().default(100),
  enablePartnerships: z.boolean().default(false),
  accommodationDiscount: z.number().default(10),
  transportDiscount: z.number().default(15),
  organizerName: z.string().optional(),
  organizerContact: z.string().optional(),
  organizerEmail: z.string().optional(),
  images: z.array(z.string()).optional(),
  maxAttendees: z.number().optional(),
  isPublic: z.boolean().default(true),
  websiteUrl: z.string().optional(),
  socialMediaLinks: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

// Buscar eventos (público)
router.get('/search', async (req, res) => {
  try {
    const query = searchEventsSchema.parse(req.query);
    
    let whereConditions: any = [
      eq(events.isPublic, true),
      eq(events.status, 'approved')
    ];
    
    if (query.location) {
      whereConditions.push(like(events.address, `%${query.location}%`));
    }
    
    if (query.category) {
      whereConditions.push(eq(events.category, query.category));
    }
    
    if (query.eventType) {
      whereConditions.push(eq(events.eventType, query.eventType));
    }
    
    if (query.startDate) {
      whereConditions.push(gte(events.startDate, new Date(query.startDate)));
    }
    
    if (query.endDate) {
      whereConditions.push(lte(events.endDate, new Date(query.endDate)));
    }
    
    if (query.maxPrice) {
      whereConditions.push(lte(events.ticketPrice, query.maxPrice.toString()));
    }

    const offset = (query.page - 1) * query.limit;
    
    const eventResults = await db
      .select({
        id: events.id,
        title: events.title,
        description: events.description,
        eventType: events.eventType,
        category: events.category,
        venue: events.venue,
        address: events.address,
        startDate: events.startDate,
        endDate: events.endDate,
        startTime: events.startTime,
        endTime: events.endTime,
        isPaid: events.isPaid,
        ticketPrice: events.ticketPrice,
        maxTickets: events.maxTickets,
        ticketsSold: events.ticketsSold,
        images: events.images,
        organizerName: events.organizerName,
        tags: events.tags,
        isFeatured: events.isFeatured,
        enablePartnerships: events.enablePartnerships,
        accommodationDiscount: events.accommodationDiscount,
        transportDiscount: events.transportDiscount,
      })
      .from(events)
      .where(and(...whereConditions))
      .limit(query.limit)
      .offset(offset)
      .orderBy(events.startDate);

    res.json({
      events: eventResults,
      pagination: {
        page: query.page,
        limit: query.limit,
        total: eventResults.length,
      }
    });
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter eventos em destaque
router.get('/featured', async (req, res) => {
  try {
    const featuredEvents = await db
      .select({
        id: events.id,
        title: events.title,
        description: events.description,
        eventType: events.eventType,
        category: events.category,
        venue: events.venue,
        address: events.address,
        startDate: events.startDate,
        endDate: events.endDate,
        startTime: events.startTime,
        isPaid: events.isPaid,
        ticketPrice: events.ticketPrice,
        images: events.images,
        organizerName: events.organizerName,
        tags: events.tags,
      })
      .from(events)
      .where(and(
        eq(events.isFeatured, true),
        eq(events.isPublic, true),
        eq(events.status, 'approved'),
        gte(events.startDate, new Date())
      ))
      .limit(10)
      .orderBy(events.startDate);

    res.json({ events: featuredEvents });
  } catch (error) {
    console.error('Erro ao buscar eventos em destaque:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar novo evento (usuários autenticados)
router.post('/', verifyFirebaseToken, async (req: any, res) => {
  try {
    const eventData = createEventSchema.parse(req.body);
    const organizerId = req.user.uid;

    const [newEvent] = await db.insert(events).values({
      ...eventData,
      organizerId,
      startDate: new Date(eventData.startDate),
      endDate: new Date(eventData.endDate),
      ticketPrice: eventData.ticketPrice.toString(),
      status: 'pending', // Eventos precisam de aprovação
      requiresApproval: true,
    }).returning();

    res.status(201).json({
      message: 'Evento criado com sucesso. Aguardando aprovação.',
      event: newEvent
    });
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter eventos do organizador
router.get('/my-events', verifyFirebaseToken, async (req: any, res) => {
  try {
    const organizerId = req.user.uid;
    
    const myEvents = await db
      .select()
      .from(events)
      .where(eq(events.organizerId, organizerId))
      .orderBy(desc(events.createdAt));

    res.json({ events: myEvents });
  } catch (error) {
    console.error('Erro ao buscar eventos do organizador:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Aprovar evento (apenas admins)
router.put('/:eventId/approve', verifyFirebaseToken, verifyRole(['admin']), async (req: any, res) => {
  try {
    const { eventId } = req.params;
    const { featured } = req.body;

    const [updatedEvent] = await db
      .update(events)
      .set({ 
        status: 'approved',
        isFeatured: featured || false,
        updatedAt: new Date()
      })
      .where(eq(events.id, eventId))
      .returning();

    if (!updatedEvent) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    res.json({
      message: 'Evento aprovado com sucesso',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Erro ao aprovar evento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rejeitar evento (apenas admins)
router.put('/:eventId/reject', verifyFirebaseToken, verifyRole(['admin']), async (req: any, res) => {
  try {
    const { eventId } = req.params;

    const [updatedEvent] = await db
      .update(events)
      .set({ 
        status: 'cancelled',
        updatedAt: new Date()
      })
      .where(eq(events.id, eventId))
      .returning();

    if (!updatedEvent) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    res.json({
      message: 'Evento rejeitado',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Erro ao rejeitar evento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar eventos pendentes (apenas admins)
router.get('/pending', verifyFirebaseToken, verifyRole(['admin']), async (req: any, res) => {
  try {
    const pendingEvents = await db
      .select()
      .from(events)
      .where(eq(events.status, 'pending'))
      .orderBy(desc(events.createdAt));

    res.json({ events: pendingEvents });
  } catch (error) {
    console.error('Erro ao buscar eventos pendentes:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar evento
router.put('/:eventId', verifyFirebaseToken, async (req: any, res) => {
  try {
    const { eventId } = req.params;
    const organizerId = req.user.uid;
    const updateData = createEventSchema.partial().parse(req.body);

    // Verificar se o evento pertence ao organizador (exceto para admins)
    if (!req.dbUser?.roles?.includes('admin')) {
      const [existingEvent] = await db
        .select()
        .from(events)
        .where(and(eq(events.id, eventId), eq(events.organizerId, organizerId)));

      if (!existingEvent) {
        return res.status(404).json({ error: 'Evento não encontrado' });
      }
    }

    const [updatedEvent] = await db
      .update(events)
      .set({
        ...updateData,
        startDate: updateData.startDate ? new Date(updateData.startDate) : undefined,
        endDate: updateData.endDate ? new Date(updateData.endDate) : undefined,
        ticketPrice: updateData.ticketPrice?.toString(),
        updatedAt: new Date(),
        // Se o evento foi modificado, precisa de nova aprovação
        status: req.dbUser?.roles?.includes('admin') ? undefined : 'pending',
      })
      .where(eq(events.id, eventId))
      .returning();

    res.json({
      message: 'Evento atualizado com sucesso',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter detalhes de um evento específico
router.get('/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const [event] = await db
      .select()
      .from(events)
      .where(and(
        eq(events.id, eventId),
        eq(events.isPublic, true),
        eq(events.status, 'approved')
      ));

    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    res.json({ event });
  } catch (error) {
    console.error('Erro ao buscar detalhes do evento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;