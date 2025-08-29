import { Router, Request, Response, NextFunction } from "express";
import { storage } from "../../shared/storage";

const router = Router();

// Middleware temporário de autenticação (substituir com Firebase em produção)
interface AuthenticatedRequest extends Request {
  user?: {
    claims?: {
      sub?: string;
      email?: string;
    };
    displayName?: string;
  };
}

const verifyFirebaseToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Token não fornecido" });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // TODO: Implementar verificação real do Firebase Admin SDK
    // Por agora, simular com dados básicos extraídos do token
    console.log('🔐 Verificando token Firebase:', token.substring(0, 20) + '...');
    
    // Simular dados de usuário baseados no token (desenvolvimento)
    const mockPayload = {
      sub: `firebase-${Date.now()}`,
      email: req.body.email || "user@linkamz.com",
      name: req.body.displayName || "Usuário Link-A"
    };
    
    (req as AuthenticatedRequest).user = {
      claims: {
        sub: mockPayload.sub,
        email: mockPayload.email
      },
      displayName: mockPayload.name
    };
    
    next();
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return res.status(401).json({ message: "Token inválido" });
  }
};

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
router.post('/setup-user-roles', verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const { uid, email, displayName, photoURL, roles } = req.body;
    const userId = uid || authReq.user?.claims?.sub;
    
    if (!userId) {
      return res.status(401).json({ message: "Token inválido" });
    }
    
    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      return res.status(400).json({ message: "Pelo menos um role deve ser selecionado" });
    }

    // Criar/atualizar usuário com dados do Firebase
    let user = await storage.upsertUser({
      id: userId,
      email: email,
      firstName: displayName?.split(' ')[0] || null,
      lastName: displayName?.split(' ').slice(1).join(' ') || null,
      profileImageUrl: photoURL || null,
      userType: roles[0], // Usar o primeiro role como userType principal
      registrationCompleted: true
    });
    
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