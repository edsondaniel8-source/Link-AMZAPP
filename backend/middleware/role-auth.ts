import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      }),
      projectId: process.env.FIREBASE_PROJECT_ID!,
    });
    console.log('✅ Firebase Admin inicializado com sucesso no middleware');
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase Admin no middleware:', error);
  }
}

// Estender Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email?: string;
        roles?: string[];
      };
    }
  }
}

// Middleware para verificar autenticação Firebase
export const verifyFirebaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Token de autorização necessário' 
      });
    }

    const token = authHeader.substring(7);
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Buscar dados do usuário incluindo roles
    const userRecord = await admin.auth().getUser(decodedToken.uid);
    const customClaims = userRecord.customClaims || {};
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      roles: customClaims.roles || []
    };
    
    next();
  } catch (error) {
    console.error('Erro na verificação do token:', error);
    return res.status(401).json({ 
      error: 'Token inválido ou expirado' 
    });
  }
};

// Middleware para verificar roles específicos
export const requireRoles = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Usuário não autenticado' 
      });
    }

    const userRoles = req.user.roles || [];
    const hasRequiredRole = allowedRoles.some(role => 
      userRoles.includes(role)
    );

    if (!hasRequiredRole) {
      return res.status(403).json({ 
        error: 'Acesso negado: role insuficiente',
        required: allowedRoles,
        current: userRoles
      });
    }

    next();
  };
};

// Middleware específico para rotas de cliente
export const requireClientRole = requireRoles(['client', 'admin']);

// Middleware específico para rotas de prestador
export const requireProviderRole = requireRoles(['driver', 'hotel_manager', 'admin']);

// Middleware específico para rotas de motorista
export const requireDriverRole = requireRoles(['driver', 'admin']);

// Middleware específico para rotas de gerente de hotel
export const requireHotelManagerRole = requireRoles(['hotel_manager', 'admin']);

// Middleware específico para rotas de administrador
export const requireAdminRole = requireRoles(['admin']);