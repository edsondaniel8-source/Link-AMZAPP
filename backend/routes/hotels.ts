import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db.js';
import { accommodations, hotelRooms, partnershipProposals } from '../shared/schema.js';
import { verifyFirebaseToken, verifyRole } from './auth.js';
import { eq, and, gte, lte, like } from 'drizzle-orm';

const router = Router();

// Schema para buscar alojamentos
const searchHotelsSchema = z.object({
  location: z.string().optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  guests: z.number().default(1),
  maxPrice: z.number().optional(),
  type: z.string().optional(),
  page: z.number().default(1),
  limit: z.number().default(20),
});

// Schema para criar alojamento
const createAccommodationSchema = z.object({
  name: z.string(),
  type: z.string(),
  address: z.string(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  pricePerNight: z.number(),
  description: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  offerDriverDiscounts: z.boolean().default(false),
  driverDiscountRate: z.number().default(10),
  minimumDriverLevel: z.string().default('bronze'),
  partnershipBadgeVisible: z.boolean().default(false),
});

// Schema para criar proposta de parceria
const createPartnershipProposalSchema = z.object({
  title: z.string(),
  description: z.string(),
  proposalType: z.string(),
  targetRegions: z.array(z.string()),
  minimumDriverLevel: z.string().default('bronze'),
  requiredVehicleType: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  basePaymentMzn: z.number(),
  bonusPaymentMzn: z.number().default(0),
  premiumRate: z.number().default(0),
  offerFreeAccommodation: z.boolean().default(false),
  offerMeals: z.boolean().default(false),
  offerFuel: z.boolean().default(false),
  additionalBenefits: z.array(z.string()).optional(),
  maxDriversNeeded: z.number(),
  minimumRides: z.number().optional(),
  estimatedEarnings: z.string().optional(),
  priority: z.string().default('normal'),
  contactMethod: z.string().default('in_app'),
  applicationDeadline: z.string().optional(),
  requiresInterview: z.boolean().default(false),
});

// Buscar alojamentos (público)
router.get('/search', async (req, res) => {
  try {
    const query = searchHotelsSchema.parse(req.query);
    
    let whereConditions: any = [eq(accommodations.isAvailable, true)];
    
    if (query.location) {
      whereConditions.push(like(accommodations.address, `%${query.location}%`));
    }
    
    if (query.type) {
      whereConditions.push(eq(accommodations.type, query.type));
    }
    
    if (query.maxPrice) {
      whereConditions.push(lte(accommodations.pricePerNight, query.maxPrice.toString()));
    }

    const offset = (query.page - 1) * query.limit;
    
    const hotelResults = await db
      .select()
      .from(accommodations)
      .where(and(...whereConditions))
      .limit(query.limit)
      .offset(offset);

    res.json({
      hotels: hotelResults,
      pagination: {
        page: query.page,
        limit: query.limit,
        total: hotelResults.length,
      }
    });
  } catch (error) {
    console.error('Erro ao buscar alojamentos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar novo alojamento (apenas gestores de hotel)
router.post('/', verifyFirebaseToken, verifyRole(['hotel_manager', 'admin']), async (req: any, res) => {
  try {
    const accommodationData = createAccommodationSchema.parse(req.body);
    const hostId = req.user.uid;

    const [newAccommodation] = await db.insert(accommodations).values({
      ...accommodationData,
      hostId,
      pricePerNight: accommodationData.pricePerNight.toString(),
      driverDiscountRate: accommodationData.driverDiscountRate.toString(),
    }).returning();

    res.status(201).json({
      message: 'Alojamento criado com sucesso',
      accommodation: newAccommodation
    });
  } catch (error) {
    console.error('Erro ao criar alojamento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter alojamentos do gestor
router.get('/my-accommodations', verifyFirebaseToken, verifyRole(['hotel_manager', 'admin']), async (req: any, res) => {
  try {
    const hostId = req.user.uid;
    
    const myAccommodations = await db
      .select()
      .from(accommodations)
      .where(eq(accommodations.hostId, hostId));

    res.json({ accommodations: myAccommodations });
  } catch (error) {
    console.error('Erro ao buscar alojamentos do gestor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar proposta de parceria para motoristas
router.post('/partnership-proposals', verifyFirebaseToken, verifyRole(['hotel_manager', 'admin']), async (req: any, res) => {
  try {
    const proposalData = createPartnershipProposalSchema.parse(req.body);
    
    // Verificar se o hotel existe e pertence ao usuário
    const [hotel] = await db
      .select()
      .from(accommodations)
      .where(and(
        eq(accommodations.id, req.body.hotelId),
        eq(accommodations.hostId, req.user.uid)
      ));

    if (!hotel) {
      return res.status(404).json({ error: 'Hotel não encontrado' });
    }

    const [newProposal] = await db.insert(partnershipProposals).values({
      hotelId: req.body.hotelId,
      ...proposalData,
      startDate: new Date(proposalData.startDate),
      endDate: new Date(proposalData.endDate),
      applicationDeadline: proposalData.applicationDeadline ? new Date(proposalData.applicationDeadline) : null,
      basePaymentMzn: proposalData.basePaymentMzn.toString(),
      bonusPaymentMzn: proposalData.bonusPaymentMzn.toString(),
      premiumRate: proposalData.premiumRate.toString(),
    }).returning();

    res.status(201).json({
      message: 'Proposta de parceria criada com sucesso',
      proposal: newProposal
    });
  } catch (error) {
    console.error('Erro ao criar proposta de parceria:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter propostas de parceria ativas (para motoristas)
router.get('/partnership-proposals', verifyFirebaseToken, verifyRole(['driver', 'admin']), async (req: any, res) => {
  try {
    const activeProposals = await db
      .select({
        id: partnershipProposals.id,
        hotelId: partnershipProposals.hotelId,
        title: partnershipProposals.title,
        description: partnershipProposals.description,
        proposalType: partnershipProposals.proposalType,
        targetRegions: partnershipProposals.targetRegions,
        minimumDriverLevel: partnershipProposals.minimumDriverLevel,
        requiredVehicleType: partnershipProposals.requiredVehicleType,
        startDate: partnershipProposals.startDate,
        endDate: partnershipProposals.endDate,
        basePaymentMzn: partnershipProposals.basePaymentMzn,
        bonusPaymentMzn: partnershipProposals.bonusPaymentMzn,
        premiumRate: partnershipProposals.premiumRate,
        offerFreeAccommodation: partnershipProposals.offerFreeAccommodation,
        offerMeals: partnershipProposals.offerMeals,
        offerFuel: partnershipProposals.offerFuel,
        additionalBenefits: partnershipProposals.additionalBenefits,
        maxDriversNeeded: partnershipProposals.maxDriversNeeded,
        currentApplicants: partnershipProposals.currentApplicants,
        estimatedEarnings: partnershipProposals.estimatedEarnings,
        priority: partnershipProposals.priority,
        applicationDeadline: partnershipProposals.applicationDeadline,
        // Incluir informações do hotel
        hotelName: accommodations.name,
        hotelAddress: accommodations.address,
      })
      .from(partnershipProposals)
      .leftJoin(accommodations, eq(partnershipProposals.hotelId, accommodations.id))
      .where(eq(partnershipProposals.status, 'active'));

    res.json({ proposals: activeProposals });
  } catch (error) {
    console.error('Erro ao buscar propostas de parceria:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter propostas do gestor de hotel
router.get('/my-proposals', verifyFirebaseToken, verifyRole(['hotel_manager', 'admin']), async (req: any, res) => {
  try {
    const hostId = req.user.uid;
    
    const myProposals = await db
      .select({
        id: partnershipProposals.id,
        hotelId: partnershipProposals.hotelId,
        title: partnershipProposals.title,
        description: partnershipProposals.description,
        proposalType: partnershipProposals.proposalType,
        startDate: partnershipProposals.startDate,
        endDate: partnershipProposals.endDate,
        basePaymentMzn: partnershipProposals.basePaymentMzn,
        maxDriversNeeded: partnershipProposals.maxDriversNeeded,
        currentApplicants: partnershipProposals.currentApplicants,
        status: partnershipProposals.status,
        priority: partnershipProposals.priority,
        createdAt: partnershipProposals.createdAt,
        // Incluir informações do hotel
        hotelName: accommodations.name,
      })
      .from(partnershipProposals)
      .leftJoin(accommodations, eq(partnershipProposals.hotelId, accommodations.id))
      .where(eq(accommodations.hostId, hostId));

    res.json({ proposals: myProposals });
  } catch (error) {
    console.error('Erro ao buscar propostas do gestor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar alojamento
router.put('/:accommodationId', verifyFirebaseToken, verifyRole(['hotel_manager', 'admin']), async (req: any, res) => {
  try {
    const { accommodationId } = req.params;
    const hostId = req.user.uid;
    const updateData = createAccommodationSchema.partial().parse(req.body);

    // Verificar se o alojamento pertence ao gestor (exceto para admins)
    if (!req.dbUser.roles.includes('admin')) {
      const [existingAccommodation] = await db
        .select()
        .from(accommodations)
        .where(and(eq(accommodations.id, accommodationId), eq(accommodations.hostId, hostId)));

      if (!existingAccommodation) {
        return res.status(404).json({ error: 'Alojamento não encontrado' });
      }
    }

    const [updatedAccommodation] = await db
      .update(accommodations)
      .set({
        ...updateData,
        pricePerNight: updateData.pricePerNight?.toString(),
        driverDiscountRate: updateData.driverDiscountRate?.toString(),
      })
      .where(eq(accommodations.id, accommodationId))
      .returning();

    res.json({
      message: 'Alojamento atualizado com sucesso',
      accommodation: updatedAccommodation
    });
  } catch (error) {
    console.error('Erro ao atualizar alojamento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter detalhes de um alojamento específico
router.get('/:accommodationId', async (req, res) => {
  try {
    const { accommodationId } = req.params;
    
    const [accommodation] = await db
      .select()
      .from(accommodations)
      .where(and(eq(accommodations.id, accommodationId), eq(accommodations.isAvailable, true)));

    if (!accommodation) {
      return res.status(404).json({ error: 'Alojamento não encontrado' });
    }

    res.json({ accommodation });
  } catch (error) {
    console.error('Erro ao buscar detalhes do alojamento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;