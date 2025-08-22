import admin from "firebase-admin";
import { Request, Response, NextFunction } from "express";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  // For development - use service account key or default credentials
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    displayName?: string;
  };
}

export const verifyFirebaseToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name,
    };
    next();
  } catch (error) {
    console.error('Erro na verificação do token:', error);
    return res.status(401).json({ message: "Token inválido" });
  }
};