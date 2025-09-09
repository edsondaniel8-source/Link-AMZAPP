import admin from "firebase-admin";
import { Request, Response, NextFunction } from "express";

// Type-safe Firebase Admin Auth methods
export const firebaseAuth = admin.auth();

// Firebase configuration validation
interface FirebaseConfig {
  projectId: string;
  privateKey: string;
  clientEmail: string;
}

const validateFirebaseConfig = (): FirebaseConfig => {
  const { FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL } = process.env;
  
  if (!FIREBASE_PROJECT_ID || !FIREBASE_PRIVATE_KEY || !FIREBASE_CLIENT_EMAIL) {
    throw new Error(
      'Firebase configuration incomplete. Required: FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL'
    );
  }
  
  return {
    projectId: FIREBASE_PROJECT_ID,
    privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: FIREBASE_CLIENT_EMAIL,
  };
};

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    const config = validateFirebaseConfig();
    
    admin.initializeApp({
      credential: admin.credential.cert(config),
      projectId: config.projectId,
    });
    
    console.log('✅ Firebase Admin inicializado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase Admin:', error);
    process.exit(1); // Exit if Firebase can't be initialized
  }
}

// Firebase token claims interface
export interface FirebaseTokenClaims {
  sub: string; // User ID - sempre presente
  aud: string; // Audience - sempre presente 
  auth_time: number; // Authentication time
  exp: number; // Expiration time
  firebase: {
    identities: Record<string, string[]>;
    sign_in_provider: string;
  };
  iat: number; // Issued at time
  iss: string; // Issuer
  // Optional user info
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
  uid?: string; // Sometimes present in custom tokens
}

// Authenticated user data attached to request
export interface AuthenticatedUser {
  uid: string; // Firebase UID - sempre presente
  email?: string; // Email pode ser undefined para alguns providers
  emailVerified: boolean;
  displayName?: string;
  photoURL?: string;
  disabled: boolean;
  metadata: {
    lastSignInTime?: string;
    creationTime?: string;
  };
  customClaims?: Record<string, any>;
  providerData: Array<{
    uid: string;
    displayName?: string;
    email?: string;
    photoURL?: string;
    providerId: string;
  }>;
}

// Request extended with authenticated user data
export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
  firebaseToken: FirebaseTokenClaims;
}

// API Error response interface
export interface ApiError {
  success: false;
  message: string;
  code: string;
  details?: any;
  timestamp: string;
}

// API Success response interface
export interface ApiResponse<T = any> {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
}

// Helper to create consistent API responses
export const createApiResponse = <T>(data: T, message?: string): ApiResponse<T> => ({
  success: true,
  data,
  message,
  timestamp: new Date().toISOString(),
});

export const createApiError = (message: string, code: string, details?: any): ApiError => ({
  success: false,
  message,
  code,
  details,
  timestamp: new Date().toISOString(),
});

// Enhanced Firebase token verification middleware
export const verifyFirebaseToken = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json(createApiError(
      "Token de autentica\u00e7\u00e3o n\u00e3o fornecido", 
      "AUTH_TOKEN_MISSING"
    ));
    return;
  }

  const token = authHeader.split('Bearer ')[1];
  
  if (!token || token.trim() === '') {
    res.status(401).json(createApiError(
      "Token vazio", 
      "AUTH_TOKEN_EMPTY"
    ));
    return;
  }

  try {
    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(token, true);
    
    // Get user record for complete user data
    const userRecord = await admin.auth().getUser(decodedToken.uid);
    
    // Attach comprehensive user data to request
    const authReq = req as AuthenticatedRequest;
    authReq.firebaseToken = decodedToken as FirebaseTokenClaims;
    authReq.user = {
      uid: userRecord.uid,
      email: userRecord.email,
      emailVerified: userRecord.emailVerified,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      disabled: userRecord.disabled,
      metadata: {
        lastSignInTime: userRecord.metadata.lastSignInTime,
        creationTime: userRecord.metadata.creationTime,
      },
      customClaims: userRecord.customClaims,
      providerData: userRecord.providerData,
    };
    
    next();
  } catch (error) {
    console.error('Erro na verifica\u00e7\u00e3o do token Firebase:', error);
    
    let errorMessage = "Token inv\u00e1lido";
    let errorCode = "AUTH_TOKEN_INVALID";
    
    if (error instanceof Error) {
      if (error.message.includes('expired')) {
        errorMessage = "Token expirado";
        errorCode = "AUTH_TOKEN_EXPIRED";
      } else if (error.message.includes('revoked')) {
        errorMessage = "Token revogado";
        errorCode = "AUTH_TOKEN_REVOKED";
      }
    }
    
    res.status(401).json(createApiError(errorMessage, errorCode, {
      originalError: error instanceof Error ? error.message : String(error)
    }));
  }
};