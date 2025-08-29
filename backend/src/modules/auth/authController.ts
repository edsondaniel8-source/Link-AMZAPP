import { Router } from "express";
import { verifyFirebaseToken, type AuthenticatedRequest } from "../../shared/firebaseAuth";
import { storage } from "../../shared/storage";

const router = Router();

// Obter dados do usuário autenticado
router.get('/user', verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const userId = authReq.user?.claims?.sub;
    const userEmail = authReq.user?.claims?.email;
    
    if (!userId) {
      return res.status(401).json({ message: "Token inválido" });
    }

    // Verificar se usuário existe na base de dados
    let user = await storage.getUser(userId);
    
    if (!user) {
      // Criar usuário automaticamente se não existir
      user = await storage.upsertUser({
        id: userId,
        email: userEmail || null,
        firstName: authReq.user?.displayName?.split(' ')[0] || null,
        lastName: authReq.user?.displayName?.split(' ').slice(1).join(' ') || null,
        profileImageUrl: null,
        userType: 'user'
      });
    }

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: [user.userType], // Converter userType para array de roles
      isVerified: user.isVerified || false,
      profileImageUrl: user.profileImageUrl,
      registrationCompleted: user.registrationCompleted || false,
      needsRoleSelection: !user.registrationCompleted
    });
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Configurar roles do usuário durante signup
router.post('/setup-roles', verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const userId = authReq.user?.claims?.sub;
    const { roles, firstName, lastName, phone } = req.body;
    
    if (!userId) {
      return res.status(401).json({ message: "Token inválido" });
    }
    
    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      return res.status(400).json({ message: "Pelo menos um role deve ser selecionado" });
    }

    // Atualizar dados do usuário
    let user = await storage.updateUserRoles(userId, roles);
    
    // Atualizar dados pessoais através do storage se fornecidos
    if (firstName || lastName || phone) {
      const updatedUser = await storage.upsertUser({
        id: userId,
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        phone: phone || user.phone,
        registrationCompleted: true
      });
      user = updatedUser;
    }
    
    res.json({ 
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: roles,
        userType: user.userType,
        profileImageUrl: user.profileImageUrl,
        isVerified: user.isVerified || false,
        registrationCompleted: true
      }
    });
  } catch (error) {
    console.error('Erro ao configurar roles:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router;