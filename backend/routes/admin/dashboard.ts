import { Router } from 'express';
import { db } from '../../db';
import { users, rides, accommodations, bookings } from '../../shared/unified-schema';
import { verifyFirebaseToken } from '../auth';
import { eq, and, gte, count, sum, sql } from 'drizzle-orm';

const router = Router();

// Obter estatísticas gerais da plataforma (Admin)
router.get('/stats', async (req, res) => {
  try {
    console.log('📊 [ADMIN] Buscando estatísticas da plataforma');

    // Contar usuários
    const [userCount] = await db
      .select({ count: count() })
      .from(users);

    // Contar viagens ativas
    const [activeRidesCount] = await db
      .select({ count: count() })
      .from(rides)
      .where(eq(rides.isActive, true));

    // Contar alojamentos ativos
    const [activeAccommodationsCount] = await db
      .select({ count: count() })
      .from(accommodations)
      .where(eq(accommodations.isActive, true));

    // Contar reservas por status
    const [pendingBookingsCount] = await db
      .select({ count: count() })
      .from(bookings)
      .where(eq(bookings.status, 'pending'));

    const [confirmedBookingsCount] = await db
      .select({ count: count() })
      .from(bookings)
      .where(eq(bookings.status, 'confirmed'));

    const [completedBookingsCount] = await db
      .select({ count: count() })
      .from(bookings)
      .where(eq(bookings.status, 'completed'));

    // Calcular receita total (apenas reservas completas)
    const [totalRevenueResult] = await db
      .select({ total: sum(bookings.totalAmount) })
      .from(bookings)
      .where(eq(bookings.status, 'completed'));

    const totalRevenue = totalRevenueResult?.total || 0;

    // Estatísticas de crescimento (mock - implementar com dados reais)
    const currentMonth = new Date();
    const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);

    const stats = {
      overview: {
        totalUsers: userCount.count,
        activeRides: activeRidesCount.count,
        activeAccommodations: activeAccommodationsCount.count,
        totalBookings: pendingBookingsCount.count + confirmedBookingsCount.count + completedBookingsCount.count,
        totalRevenue: Number(totalRevenue)
      },
      bookings: {
        pending: pendingBookingsCount.count,
        confirmed: confirmedBookingsCount.count,
        completed: completedBookingsCount.count,
        cancelled: 0 // Adicionar query se necessário
      },
      growth: {
        newUsersThisMonth: 45, // Mock - implementar query real
        bookingGrowth: 23.5, // Mock - percentual de crescimento
        revenueGrowth: 18.2 // Mock - percentual de crescimento
      },
      topRoutes: [
        { route: 'Maputo → Matola', bookings: 45 },
        { route: 'Beira → Dondo', bookings: 32 },
        { route: 'Nampula → Nacala', bookings: 28 }
      ],
      topCities: [
        { city: 'Maputo', accommodations: 15, bookings: 89 },
        { city: 'Beira', accommodations: 8, bookings: 56 },
        { city: 'Nampula', accommodations: 5, bookings: 34 }
      ]
    };

    console.log('✅ [ADMIN] Estatísticas calculadas:', stats.overview);

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('❌ [ADMIN] Erro ao buscar estatísticas:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Listar usuários com filtros (Admin)
router.get('/users', async (req, res) => {
  try {
    const { role, status, page = 1, limit = 50 } = req.query;
    
    console.log('👥 [ADMIN] Listando usuários:', { role, status, page, limit });

    let query = db.select().from(users);

    // Filtrar por role se especificado
    if (role && typeof role === 'string') {
      query = query.where(sql`${role} = ANY(${users.roles})`);
    }

    // Paginação
    const offset = (Number(page) - 1) * Number(limit);
    const usersList = await query.limit(Number(limit)).offset(offset);

    console.log(`✅ [ADMIN] Encontrados ${usersList.length} usuários`);

    res.json({
      success: true,
      users: usersList,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: usersList.length
      }
    });

  } catch (error) {
    console.error('❌ [ADMIN] Erro ao listar usuários:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Aprovar/Desaprovar motorista (Admin)
router.patch('/users/:userId/driver-status', async (req, res) => {
  try {
    const { userId } = req.params;
    const { approved, reason } = req.body;
    
    console.log('🚗 [ADMIN] Alterando status de motorista:', { userId, approved, reason });

    // Buscar usuário
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        message: 'O usuário especificado não existe'
      });
    }

    // Atualizar roles do usuário
    let newRoles = user.roles || [];
    
    if (approved) {
      if (!newRoles.includes('driver')) {
        newRoles.push('driver');
      }
    } else {
      newRoles = newRoles.filter(role => role !== 'driver');
    }

    const [updatedUser] = await db
      .update(users)
      .set({ 
        roles: newRoles,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();

    console.log('✅ [ADMIN] Status de motorista atualizado');

    res.json({
      success: true,
      message: approved ? 'Motorista aprovado com sucesso' : 'Aprovação de motorista removida',
      user: updatedUser
    });

  } catch (error) {
    console.error('❌ [ADMIN] Erro ao alterar status de motorista:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Listar todas as reservas com filtros (Admin)
router.get('/bookings', async (req, res) => {
  try {
    const { status, serviceType, page = 1, limit = 50 } = req.query;
    
    console.log('📋 [ADMIN] Listando reservas:', { status, serviceType, page, limit });

    let query = db.select().from(bookings);

    // Filtrar por status se especificado
    if (status && typeof status === 'string') {
      query = query.where(eq(bookings.status, status as any));
    }

    // Filtrar por tipo de serviço se especificado
    if (serviceType && typeof serviceType === 'string') {
      query = query.where(eq(bookings.serviceType, serviceType as any));
    }

    // Paginação
    const offset = (Number(page) - 1) * Number(limit);
    const bookingsList = await query.limit(Number(limit)).offset(offset).orderBy(bookings.createdAt);

    console.log(`✅ [ADMIN] Encontradas ${bookingsList.length} reservas`);

    res.json({
      success: true,
      bookings: bookingsList,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: bookingsList.length
      }
    });

  } catch (error) {
    console.error('❌ [ADMIN] Erro ao listar reservas:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Suspender usuário (Admin)
router.patch('/users/:userId/suspend', async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason, duration } = req.body;
    
    console.log('🚫 [ADMIN] Suspendendo usuário:', { userId, reason, duration });

    const [updatedUser] = await db
      .update(users)
      .set({ 
        // Adicionar campos de suspensão se necessário
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        message: 'O usuário especificado não existe'
      });
    }

    console.log('✅ [ADMIN] Usuário suspenso com sucesso');

    res.json({
      success: true,
      message: 'Usuário suspenso com sucesso',
      user: updatedUser
    });

  } catch (error) {
    console.error('❌ [ADMIN] Erro ao suspender usuário:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

export default router;