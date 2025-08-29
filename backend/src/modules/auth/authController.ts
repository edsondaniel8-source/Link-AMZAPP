import { Router } from "express";
// import { verifyFirebaseToken, type AuthenticatedRequest } from "../../shared/firebaseAuth";
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

// Endpoint tradicional de registro com role específico
router.post('/register', async (req, res) => {
  try {
    const { email, password, role = 'client' } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email e senha são obrigatórios" 
      });
    }

    // TODO: Implementar criação no Firebase Auth aqui
    console.log(`📝 Registro solicitado: ${email} com role: ${role}`);
    
    res.status(201).json({
      success: true,
      message: "Registro realizado com sucesso",
      user: { 
        id: "temp-id", 
        email, 
        role: role 
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      message: "Erro ao realizar registro" 
    });
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
    let user = await storage.upsertUser({
      id: userId,
      userType: roles[0], // Usar o primeiro role como userType principal
      registrationCompleted: true
    });
    
    // Atualizar dados pessoais se fornecidos
    if (firstName || lastName || phone) {
      user = await storage.upsertUser({
        id: userId,
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        registrationCompleted: true
      });
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