import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./src/shared/storage";
import { verifyFirebaseToken, type AuthenticatedRequest } from "./src/shared/firebaseAuth";
import { insertBookingSchema } from "@shared/schema";

// Import all controllers
import rideController from "./src/modules/rides/rideController";
import hotelController from "./src/modules/hotels/hotelController";
import eventController from "./src/modules/events/eventController";
import bookingController from "./src/modules/bookings/bookingController";
import userController from "./src/modules/users/userController";

// Import route modules
import searchRoutes from "./searchRoutes";
import profileRoutes from "./profileRoutes";
import blogRoutes from "./blogRoutes";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware


  // Configure multer for file uploads
  const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
  });

  // Mount all new controllers
  app.use('/api/rides', rideController);
  app.use('/api/hotels', hotelController);
  app.use('/api/events', eventController);
  app.use('/api/bookings', bookingController);
  app.use('/api/users', userController);

  // Mount route modules (legacy)
  app.use('/api/search', searchRoutes);
  app.use('/api/profile', profileRoutes);
  app.use('/api/blog', blogRoutes);
  
  // Import and mount admin routes dynamically
  const adminController = await import("./src/modules/admin/adminController");
  app.use('/api/admin', adminController.default);
  
  // Import and mount test routes
  const testRoutes = await import("./testRoutes");
  app.use('/api/test', testRoutes.default);

  // Auth routes - Firebase Auth only
  app.get('/api/auth/user', verifyFirebaseToken, async (req, res) => {
    const authReq = req as AuthenticatedRequest;
    try {
      const userId = authReq.user?.claims?.sub;
      const userEmail = authReq.user?.claims?.email;
      
      if (!userId) {
        return res.status(401).json({ message: "User ID not found" });
      }
      
      // Verificar se usuário existe no banco, se não, criar
      let user = await storage.getUser(userId);
      
      if (!user) {
        console.log(`Creating new user for Firebase UID: ${userId}`);
        // Criar usuário no banco com dados do Firebase
        user = await storage.upsertUser({
          id: userId,
          email: userEmail || null,
          firstName: authReq.user?.displayName?.split(' ')[0] || null,
          lastName: authReq.user?.displayName?.split(' ').slice(1).join(' ') || null,
          profileImageUrl: null,
          isVerified: false,
          userType: 'user',
          registrationCompleted: false
        });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Endpoint para configurar roles do usuário
  app.post('/api/auth/setup-roles', verifyFirebaseToken, async (req, res) => {
    const authReq = req as AuthenticatedRequest;
    try {
      const { roles } = req.body;
      if (!roles || !Array.isArray(roles)) {
        return res.status(400).json({ error: 'Roles devem ser fornecidos como array' });
      }

      const userId = authReq.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "User ID not found" });
      }

      // Atualizar roles do usuário na base de dados
      const user = await storage.updateUserRoles(userId, roles);
      
      res.json({ 
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: roles, // Retornar os roles selecionados
          userType: user.userType,
          profileImageUrl: user.profileImageUrl,
          isVerified: user.isVerified || false
        }
      });
    } catch (error) {
      console.error('Erro ao configurar roles:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Registration completion endpoint
  app.post('/api/auth/complete-registration', upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'documentPhoto', maxCount: 1 }
  ]), verifyFirebaseToken, async (req, res) => {
    const authReq = req as AuthenticatedRequest;
    try {
      const {
        firstName,
        lastName,
        phone,
        email,
        documentType,
        documentNumber
      } = req.body;

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (!files.profilePhoto || !files.documentPhoto) {
        return res.status(400).json({ message: "Fotos de perfil e documento são obrigatórias" });
      }

      const userId = authReq.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "User ID not found" });
      }

      // TODO: Upload files to storage service (implement with object storage)
      const profilePhotoUrl = `uploads/profile_${userId}_${Date.now()}.jpg`;
      const documentPhotoUrl = `uploads/document_${userId}_${Date.now()}.jpg`;

      const userData = {
        id: userId,
        email: email || null,
        firstName,
        lastName,
        phone,
        identityDocumentType: documentType,
        documentNumber,
        profilePhotoUrl,
        identityDocumentUrl: documentPhotoUrl,
        registrationCompleted: true,
        verificationStatus: "pending"
      };

      const user = await storage.upsertUser(userData);
      res.json({ user, message: "Registro concluído com sucesso!" });
    } catch (error) {
      console.error("Error completing registration:", error);
      res.status(500).json({ message: "Erro ao completar registro" });
    }
  });

  // Login endpoint to check if user needs to complete registration
  app.post('/api/auth/check-registration', verifyFirebaseToken, async (req, res) => {
    const authReq = req as AuthenticatedRequest;
    try {
      const userId = authReq.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "User ID not found" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.json({ needsRegistration: true });
      }

      if (!user.registrationCompleted) {
        return res.json({ needsRegistration: true });
      }

      res.json({ needsRegistration: false, user });
    } catch (error) {
      console.error("Error checking registration:", error);
      res.status(500).json({ message: "Erro ao verificar registro" });
    }
  });
  // Legacy routes replaced by controllers above

  // Payment routes
  const paymentRoutes = await import("./paymentRoutes");
  app.use("/api/payments", paymentRoutes.default);

  const httpServer = createServer(app);
  return httpServer;
}
