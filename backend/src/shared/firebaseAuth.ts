import admin from "firebase-admin";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedUser as SharedAuthenticatedUser } from "./types";

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

// Use the AuthenticatedUser definition from types.ts
export interface AuthenticatedUser extends SharedAuthenticatedUser {}

// Request extended with authenticated user data
export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
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

// CORREÇÃO APLICADA: Valor padrão para code e tratamento de details
export const createApiError = (message: string, code: string = "API_ERROR", details?: any): ApiError => ({
  success: false,
  message,
  code,
  details: details instanceof Error ? details.message : details,
  timestamp: new Date().toISOString(),
});

// Helper function to convert null to undefined for compatibility
const nullToUndefined = <T>(value: T | null): T | undefined => {
  return value === null ? undefined : value;
};

// Enhanced Firebase token verification middleware
export const verifyFirebaseToken = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json(createApiError(
      "Token de autenticação não fornecido", 
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
    
    // Create claims object without sub duplication
    const { sub, ...decodedTokenWithoutSub } = decodedToken;
    const claims = {
      sub: decodedToken.sub,
      email: decodedToken.email,
      ...decodedTokenWithoutSub
    };
    
    authReq.user = {
      // Core properties from SharedAuthenticatedUser
      id: userRecord.uid, // Use uid as id for compatibility
      uid: userRecord.uid,
      email: nullToUndefined(userRecord.email),
      firstName: nullToUndefined(userRecord.displayName?.split(' ')[0]),
      lastName: nullToUndefined(userRecord.displayName?.split(' ').slice(1).join(' ')),
      fullName: nullToUndefined(userRecord.displayName),
      phone: nullToUndefined(userRecord.phoneNumber),
      
      // System data (default values)
      userType: 'client' as const,
      roles: ['client'],
      canOfferServices: false,
      isVerified: userRecord.emailVerified || false,
      
      // Profile data
      profileImageUrl: nullToUndefined(userRecord.photoURL),
      avatar: nullToUndefined(userRecord.photoURL),
      rating: 0,
      totalReviews: 0,
      
      // Verification data
      verificationStatus: 'pending' as const,
      verificationDate: null,
      verificationNotes: null,
      verificationBadge: null,
      badgeEarnedDate: null,
      
      // Documents
      identityDocumentUrl: null,
      identityDocumentType: null,
      profilePhotoUrl: nullToUndefined(userRecord.photoURL),
      documentNumber: null,
      dateOfBirth: null,
      
      // Status
      registrationCompleted: false,
      
      // Auth claims
      claims: claims,
      
      // Additional properties for compatibility
      createdAt: new Date(userRecord.metadata.creationTime || Date.now()),
      updatedAt: userRecord.metadata.lastSignInTime ? new Date(userRecord.metadata.lastSignInTime) : null
    };
    
    next();
  } catch (error) {
    console.error('Erro na verificação do token Firebase:', error);
    
    let errorMessage = "Token inválido";
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
    
    res.status(401).json(createApiError(
      errorMessage, 
      errorCode, 
      error instanceof Error ? error.message : String(error)
    ));
  }
};