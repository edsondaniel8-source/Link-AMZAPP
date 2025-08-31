import { Router } from 'express';
import { z } from 'zod';
import { db } from '../../db';
import { users } from '../../shared/unified-schema';
import { verifyFirebaseToken } from '../auth';
import { eq } from 'drizzle-orm';

const router = Router();

// Schema para registro de usuário
const registerUserSchema = z.object({
  firebaseUid: z.string(),
  email: z.string().email(),
  name: z.string(),
  phone: z.string().optional(),
  roles: z.array(z.enum(['client', 'driver', 'hotel_manager', 'admin'])).default(['client']),
});

// Registrar novo usuário
router.post('/register', async (req, res) => {
  try {
    const userData = registerUserSchema.parse(req.body);
    
    console.log('👤 [AUTH] Registrando novo usuário:', userData.email);

    // Verificar se usuário já existe
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.firebaseUid, userData.firebaseUid));

    if (existingUser) {
      return res.status(409).json({
        error: 'Usuário já existe',
        message: 'Este usuário já está registrado na plataforma',
        user: existingUser
      });
    }

    // Criar novo usuário
    const [newUser] = await db
      .insert(users)
      .values({
        firebaseUid: userData.firebaseUid,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        roles: userData.roles,
        isActive: true,
      })
      .returning();

    console.log('✅ [AUTH] Usuário registrado com sucesso:', newUser.id);

    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      user: newUser
    });

  } catch (error) {
    console.error('❌ [AUTH] Erro ao registrar usuário:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Fazer login/obter dados do usuário
router.post('/login', verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.user?.uid;
    
    if (!firebaseUid) {
      return res.status(401).json({
        error: 'Token inválido',
        message: 'Token de autenticação inválido'
      });
    }

    console.log('🔐 [AUTH] Fazendo login do usuário:', firebaseUid);

    // Buscar usuário no banco
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.firebaseUid, firebaseUid));

    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        message: 'Usuário não registrado na plataforma. Registre-se primeiro.'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        error: 'Conta desativada',
        message: 'Sua conta foi desativada. Entre em contato com o suporte.'
      });
    }

    console.log('✅ [AUTH] Login realizado com sucesso');

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        name: user.name,
        phone: user.phone,
        roles: user.roles,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('❌ [AUTH] Erro no login:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Obter perfil do usuário atual
router.get('/profile', verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.user?.uid;
    
    console.log('👤 [AUTH] Buscando perfil do usuário:', firebaseUid);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.firebaseUid, firebaseUid));

    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        message: 'Perfil de usuário não encontrado'
      });
    }

    console.log('✅ [AUTH] Perfil encontrado');

    res.json({
      success: true,
      user: {
        id: user.id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        name: user.name,
        phone: user.phone,
        roles: user.roles,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('❌ [AUTH] Erro ao buscar perfil:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Atualizar perfil do usuário
router.patch('/profile', verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.user?.uid;
    const { name, phone } = req.body;
    
    console.log('✏️ [AUTH] Atualizando perfil do usuário:', firebaseUid);

    if (!name && !phone) {
      return res.status(400).json({
        error: 'Dados incompletos',
        message: 'Informe pelo menos um campo para atualizar'
      });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    updateData.updatedAt = new Date();

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.firebaseUid, firebaseUid))
      .returning();

    if (!updatedUser) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        message: 'Usuário não encontrado'
      });
    }

    console.log('✅ [AUTH] Perfil atualizado com sucesso');

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      user: {
        id: updatedUser.id,
        firebaseUid: updatedUser.firebaseUid,
        email: updatedUser.email,
        name: updatedUser.name,
        phone: updatedUser.phone,
        roles: updatedUser.roles,
        isActive: updatedUser.isActive,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }
    });

  } catch (error) {
    console.error('❌ [AUTH] Erro ao atualizar perfil:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Verificar se usuário tem determinado role
router.get('/check-role/:role', verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.user?.uid;
    const { role } = req.params;
    
    console.log('🔍 [AUTH] Verificando role do usuário:', firebaseUid, role);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.firebaseUid, firebaseUid));

    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        message: 'Usuário não encontrado'
      });
    }

    const hasRole = user.roles?.includes(role as any) || false;

    console.log(`✅ [AUTH] Verificação de role: ${hasRole ? 'AUTORIZADO' : 'NÃO AUTORIZADO'}`);

    res.json({
      success: true,
      hasRole,
      role,
      userRoles: user.roles
    });

  } catch (error) {
    console.error('❌ [AUTH] Erro ao verificar role:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Solicitar role adicional (ex: ser motorista)
router.post('/request-role', verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.user?.uid;
    const { role, documents } = req.body;
    
    console.log('📝 [AUTH] Solicitação de role:', firebaseUid, role);

    if (!['driver', 'hotel_manager'].includes(role)) {
      return res.status(400).json({
        error: 'Role inválido',
        message: 'Apenas roles "driver" e "hotel_manager" podem ser solicitados'
      });
    }

    // Buscar usuário
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.firebaseUid, firebaseUid));

    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        message: 'Usuário não encontrado'
      });
    }

    // Verificar se já tem o role
    if (user.roles?.includes(role as any)) {
      return res.status(409).json({
        error: 'Role já ativo',
        message: `Você já possui o role ${role}`
      });
    }

    // TODO: Implementar sistema de aprovação de roles
    // Por agora, aprovar automaticamente
    const newRoles = [...(user.roles || []), role];

    const [updatedUser] = await db
      .update(users)
      .set({ 
        roles: newRoles,
        updatedAt: new Date()
      })
      .where(eq(users.firebaseUid, firebaseUid))
      .returning();

    console.log('✅ [AUTH] Role adicionado com sucesso');

    res.json({
      success: true,
      message: `Role ${role} adicionado com sucesso`,
      user: updatedUser
    });

  } catch (error) {
    console.error('❌ [AUTH] Erro ao solicitar role:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

export default router;