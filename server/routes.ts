import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { verifyFirebaseToken } from "./firebaseAuth";
import { insertBookingSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware


  // Configure multer for file uploads
  const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
  });

  // Auth routes - Replit Auth only
  app.get('/api/auth/user', verifyFirebaseToken, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Registration completion endpoint
  app.post('/api/auth/complete-registration', upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'documentPhoto', maxCount: 1 }
  ]), verifyFirebaseToken, async (req: any, res) => {
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

      // TODO: Upload files to storage service (implement with object storage)
      const profilePhotoUrl = `uploads/profile_${req.user.claims.sub}_${Date.now()}.jpg`;
      const documentPhotoUrl = `uploads/document_${req.user.claims.sub}_${Date.now()}.jpg`;

      const userData = {
        id: req.user.claims.sub,
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
  app.post('/api/auth/check-registration', verifyFirebaseToken, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      
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
  // Ride search
  app.get("/api/rides/search", async (req, res) => {
    try {
      const { from, to } = req.query;
      if (!from || !to) {
        return res.status(400).json({ message: "From and to locations are required" });
      }
      
      const rides = await storage.searchRides(from as string, to as string);
      res.json(rides);
    } catch (error) {
      res.status(500).json({ message: "Failed to search rides" });
    }
  });

  // Get specific ride
  app.get("/api/rides/:id", async (req, res) => {
    try {
      const ride = await storage.getRide(req.params.id);
      if (!ride) {
        return res.status(404).json({ message: "Ride not found" });
      }
      res.json(ride);
    } catch (error) {
      res.status(500).json({ message: "Failed to get ride" });
    }
  });

  // Accommodation search
  app.get("/api/accommodations/search", async (req, res) => {
    try {
      const { location, checkIn, checkOut } = req.query;
      if (!location) {
        return res.status(400).json({ message: "Location is required" });
      }
      
      const checkInDate = checkIn ? new Date(checkIn as string) : undefined;
      const checkOutDate = checkOut ? new Date(checkOut as string) : undefined;
      
      const accommodations = await storage.searchAccommodations(
        location as string, 
        checkInDate, 
        checkOutDate
      );
      res.json(accommodations);
    } catch (error) {
      res.status(500).json({ message: "Failed to search accommodations" });
    }
  });

  // Get specific accommodation
  app.get("/api/accommodations/:id", async (req, res) => {
    try {
      const accommodation = await storage.getAccommodation(req.params.id);
      if (!accommodation) {
        return res.status(404).json({ message: "Accommodation not found" });
      }
      res.json(accommodation);
    } catch (error) {
      res.status(500).json({ message: "Failed to get accommodation" });
    }
  });

  // Create booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(validatedData);
      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({ message: "Invalid booking data", error });
    }
  });

  // Get user bookings
  app.get("/api/bookings/user/:userId", async (req, res) => {
    try {
      const bookings = await storage.getUserBookings(req.params.userId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user bookings" });
    }
  });

  // Get provider bookings (for drivers, hosts, event organizers)
  app.get("/api/bookings/provider/:providerId", async (req, res) => {
    try {
      const bookings = await storage.getProviderBookings(req.params.providerId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to get provider bookings" });
    }
  });

  // Approve booking (provider accepts booking request)
  app.post("/api/bookings/:bookingId/approve", async (req, res) => {
    try {
      const { providerId } = req.body;
      if (!providerId) {
        return res.status(400).json({ message: "Provider ID is required" });
      }

      const booking = await storage.approveBooking(req.params.bookingId, providerId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found or unauthorized" });
      }

      res.json({ 
        message: "Reserva aprovada com sucesso", 
        booking,
        status: "approved" 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to approve booking" });
    }
  });

  // Reject booking (provider rejects booking request)
  app.post("/api/bookings/:bookingId/reject", async (req, res) => {
    try {
      const { providerId, reason } = req.body;
      if (!providerId || !reason) {
        return res.status(400).json({ message: "Provider ID and rejection reason are required" });
      }

      const booking = await storage.rejectBooking(req.params.bookingId, providerId, reason);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found or unauthorized" });
      }

      res.json({ 
        message: "Reserva rejeitada", 
        booking,
        status: "rejected",
        reason 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to reject booking" });
    }
  });

  // Confirm booking (customer confirms after provider approval)
  app.post("/api/bookings/:bookingId/confirm", async (req, res) => {
    try {
      const { userId } = req.body;
      const booking = await storage.getBooking(req.params.bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      if (booking.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      if (booking.status !== "approved") {
        return res.status(400).json({ message: "Booking must be approved before confirmation" });
      }

      const confirmedBooking = await storage.updateBookingStatus(booking.id, "confirmed", {
        confirmedAt: new Date(),
        customerNotified: true
      });

      res.json({ 
        message: "Reserva confirmada com sucesso", 
        booking: confirmedBooking,
        status: "confirmed" 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to confirm booking" });
    }
  });

  // Update booking status
  app.patch("/api/bookings/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const booking = await storage.updateBookingStatus(req.params.id, status);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to update booking status" });
    }
  });

  // Admin routes
  const adminRoutes = await import("./adminRoutes");
  app.use("/api/admin", adminRoutes.default);

  // Payment routes
  const paymentRoutes = await import("./paymentRoutes");
  app.use("/api/payments", paymentRoutes.default);

  const httpServer = createServer(app);
  return httpServer;
}
