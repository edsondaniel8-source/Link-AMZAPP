import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
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
