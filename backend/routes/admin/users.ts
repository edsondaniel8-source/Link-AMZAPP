import { Router } from 'express';
import { z } from 'zod';
import { db } from '../../db';
import { users } from '../../shared/unified-schema';
import { verifyFirebaseToken } from '../auth';
import { eq, like, or, count } from 'drizzle-orm';

const router = Router();

// Schema para atualizar usuário
const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  roles: z.array(z.enum(['client', 'driver', 'hotel_manager', 'admin'])).optional(),
  isActive: z.boolean().optional(),
});

// Buscar usuários com filtros avançados (Admin)
router.get('/search', async (req, res) => {
  try {
    const { 
      query: searchQuery, 
      role, 
      status, 
      page = 1, 
      limit = 20 
    } = req.query;
    
    console.log('🔍 [ADMIN] Buscando usuários:', { searchQuery, role, status, page, limit });

    let query = db.select().from(users);

    // Busca por texto (nome, email, telefone)
    if (searchQuery && typeof searchQuery === 'string') {
      query = query.where(
        or(
          like(users.name, `%${searchQuery}%`),
          like(users.email, `%${searchQuery}%`),
          like(users.phone, `%${searchQuery}%`)
        )
      );
    }

    // Filtrar por role
    if (role && typeof role === 'string') {
      // Para PostgreSQL arrays, usar operador ANY
      query = query.where(sql`${role} = ANY(${users.roles})`);
    }

    // Paginação
    const offset = (Number(page) - 1) * Number(limit);
    const usersList = await query.limit(Number(limit)).offset(offset).orderBy(users.createdAt);

    // Contar total para paginação
    const [totalCount] = await db.select({ count: count() }).from(users);

    console.log(`✅ [ADMIN] Encontrados ${usersList.length} usuários`);

    res.json({
      success: true,
      users: usersList,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount.count,
        hasMore: usersList.length === Number(limit)
      }
    });

  } catch (error) {
    console.error('❌ [ADMIN] Erro ao buscar usuários:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Obter detalhes completos de um usuário (Admin)
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('🔍 [ADMIN] Buscando detalhes do usuário:', userId);

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

    // Buscar estatísticas adicionais do usuário
    // (reservas, viagens criadas, etc. - implementar conforme necessário)

    console.log('✅ [ADMIN] Detalhes do usuário encontrados');

    res.json({
      success: true,
      user,
      stats: {
        // Adicionar estatísticas específicas do usuário
        totalBookings: 0,
        totalRides: 0,
        totalRevenue: 0
      }
    });

  } catch (error) {
    console.error('❌ [ADMIN] Erro ao buscar detalhes do usuário:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Atualizar usuário (Admin)
router.patch('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = updateUserSchema.parse(req.body);
    
    console.log('✏️ [ADMIN] Atualizando usuário:', userId, updateData);

    const [updatedUser] = await db
      .update(users)
      .set({
        ...updateData,
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

    console.log('✅ [ADMIN] Usuário atualizado com sucesso');

    res.json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      user: updatedUser
    });

  } catch (error) {
    console.error('❌ [ADMIN] Erro ao atualizar usuário:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Desativar usuário (Admin)
router.patch('/:userId/deactivate', async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;
    
    console.log('🚫 [ADMIN] Desativando usuário:', userId, reason);

    const [updatedUser] = await db
      .update(users)
      .set({ 
        isActive: false,
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

    console.log('✅ [ADMIN] Usuário desativado com sucesso');

    res.json({
      success: true,
      message: 'Usuário desativado com sucesso',
      user: updatedUser
    });

  } catch (error) {
    console.error('❌ [ADMIN] Erro ao desativar usuário:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Reativar usuário (Admin)
router.patch('/:userId/activate', async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('✅ [ADMIN] Reativando usuário:', userId);

    const [updatedUser] = await db
      .update(users)
      .set({ 
        isActive: true,
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

    console.log('✅ [ADMIN] Usuário reativado com sucesso');

    res.json({
      success: true,
      message: 'Usuário reativado com sucesso',
      user: updatedUser
    });

  } catch (error) {
    console.error('❌ [ADMIN] Erro ao reativar usuário:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Adicionar role a usuário (Admin)
router.post('/:userId/roles', async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    if (!role || !['client', 'driver', 'hotel_manager', 'admin'].includes(role)) {
      return res.status(400).json({
        error: 'Role inválido',
        message: 'Role deve ser: client, driver, hotel_manager ou admin'
      });
    }
    
    console.log('➕ [ADMIN] Adicionando role ao usuário:', userId, role);

    // Buscar usuário atual
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

    // Adicionar role se não existir
    const currentRoles = user.roles || [];
    if (!currentRoles.includes(role)) {
      currentRoles.push(role);
    }

    const [updatedUser] = await db
      .update(users)
      .set({ 
        roles: currentRoles,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();

    console.log('✅ [ADMIN] Role adicionado com sucesso');

    res.json({
      success: true,
      message: `Role ${role} adicionado com sucesso`,
      user: updatedUser
    });

  } catch (error) {
    console.error('❌ [ADMIN] Erro ao adicionar role:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Remover role de usuário (Admin)
router.delete('/:userId/roles/:role', async (req, res) => {
  try {
    const { userId, role } = req.params;
    
    console.log('➖ [ADMIN] Removendo role do usuário:', userId, role);

    // Buscar usuário atual
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

    // Remover role
    const currentRoles = user.roles || [];
    const newRoles = currentRoles.filter(r => r !== role);

    const [updatedUser] = await db
      .update(users)
      .set({ 
        roles: newRoles,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();

    console.log('✅ [ADMIN] Role removido com sucesso');

    res.json({
      success: true,
      message: `Role ${role} removido com sucesso`,
      user: updatedUser
    });

  } catch (error) {
    console.error('❌ [ADMIN] Erro ao remover role:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

export default router;