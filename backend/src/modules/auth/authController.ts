import { Router } from "express";
import { verifyFirebaseToken, type AuthenticatedRequest } from "../../firebaseAuth";
import { storage } from "../../storage";

const router = Router();

// Login simplificado - sem verificação redundante
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email e senha são obrigatórios" 
      });
    }

    // TODO: Implementar autenticação com Firebase
    // Por enquanto, mock da resposta
    const user = {
      id: "user-123",
      email,
      firstName: "João",
      lastName: "Silva", 
      roles: ["driver"], // Papéis do usuário
      isVerified: true,
      profileImageUrl: null
    };

    const token = "mock-jwt-token";

    res.json({
      success: true,
      message: "Login realizado com sucesso",
      token,
      user
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      message: "Erro interno do servidor" 
    });
  }
});

// Validar token
router.get('/validate', verifyFirebaseToken, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const userId = authReq.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Token inválido" });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: [user.userType], // Converter userType para array de roles
        isVerified: user.isVerified,
        profileImageUrl: user.profileImageUrl
      }
    });
  } catch (error) {
    console.error("Token validation error:", error);
    res.status(500).json({ message: "Erro ao validar token" });
  }
});

// Registro simplificado - sem verificação redundante
router.post('/register', async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      userType = 'client',
      profileImageUrl,
      identityDocumentUrl
    } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        message: "Dados obrigatórios não fornecidos" 
      });
    }

    // Criar usuário já verificado (documentos foram enviados no registro)
    const userData = {
      email,
      firstName,
      lastName,
      phone,
      userType,
      profileImageUrl,
      identityDocumentUrl,
      registrationCompleted: true,
      isVerified: true, // Já verificado
      verificationStatus: "verified", // Já verificado
      verificationDate: new Date(),
      canOfferServices: userType !== 'client' // Permite serviços se não for cliente
    };

    const user = await storage.upsertUser(userData);
    
    // TODO: Criar usuário no Firebase Auth
    const token = "mock-jwt-token";

    res.status(201).json({
      success: true,
      message: "Registro realizado com sucesso",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: [user.userType],
        isVerified: true,
        profileImageUrl: user.profileImageUrl
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      message: "Erro ao realizar registro" 
    });
  }
});

export default router;