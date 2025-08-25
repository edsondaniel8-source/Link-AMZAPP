// FILEPATH: server/routes.production.ts
// Production-ready routes for Firebase Authentication only
import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { authStorage } from "./authStorage";
import { verifyFirebaseToken, type AuthenticatedRequest } from "./firebaseAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Production Firebase Auth API - focused on authentication only

  // Configure multer for file uploads
  const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
  });

  // Get authenticated user profile
  app.get('/api/me', verifyFirebaseToken, async (req, res) => {
    const authReq = req as AuthenticatedRequest;
    try {
      const userId = authReq.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "User ID not found" });
      }
      const user = await authStorage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Complete user registration with document upload
  app.post('/api/complete-registration', 
    verifyFirebaseToken,
    upload.fields([
      { name: 'profilePhoto', maxCount: 1 },
      { name: 'documentPhoto', maxCount: 1 }
    ]),
    async (req, res) => {
      const authReq = req as AuthenticatedRequest;
      try {
        const userId = authReq.user?.claims?.sub;
        const userEmail = authReq.user?.claims?.email;
        
        if (!userId || !userEmail) {
          return res.status(401).json({ message: "User authentication failed" });
        }

        const { 
          fullName, 
          phoneNumber, 
          documentType, 
          documentNumber 
        } = req.body;

        // Validate required fields
        if (!fullName || !phoneNumber || !documentType || !documentNumber) {
          return res.status(400).json({ 
            message: "Missing required fields: fullName, phoneNumber, documentType, documentNumber" 
          });
        }

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const profilePhotoUrl = files.profilePhoto?.[0] ? `/uploads/profile-${userId}` : null;
        const documentPhotoUrl = files.documentPhoto?.[0] ? `/uploads/document-${userId}` : null;

        const userData = {
          id: userId,
          email: userEmail,
          fullName,
          phoneNumber,
          documentType,
          documentNumber,
          profilePhotoUrl,
          documentPhotoUrl,
          registrationCompleted: true,
          verificationStatus: "pending"
        };

        const user = await authStorage.upsertUser(userData);
        res.json({ user, message: "Registro concluído com sucesso!" });
      } catch (error) {
        console.error("Error completing registration:", error);
        res.status(500).json({ message: "Erro ao completar registro" });
      }
    }
  );

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      service: 'link-a-backend'
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}