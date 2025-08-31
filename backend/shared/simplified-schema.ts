import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal, integer, date, time } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (keeping existing structure for compatibility)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  name: text("name"), // Full name for driver display
  phone: text("phone").unique(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Simplified Rides table following your proposed SQL schema
export const rides = pgTable("rides", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`), // Keep UUID for compatibility
  driverId: varchar("driver_id").references(() => users.id),
  fromLocation: varchar("from_location", { length: 255 }).notNull(),
  toLocation: varchar("to_location", { length: 255 }).notNull(),
  departureDate: date("departure_date").notNull(),
  departureTime: time("departure_time").notNull(),
  availableSeats: integer("available_seats").notNull(),
  pricePerSeat: decimal("price_per_seat", { precision: 10, scale: 2 }).notNull(),
  vehicleType: varchar("vehicle_type", { length: 50 }),
  additionalInfo: text("additional_info"),
  status: varchar("status", { length: 20 }).default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Simplified Bookings table following your proposed SQL schema
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`), // Keep UUID for compatibility
  rideId: varchar("ride_id").references(() => rides.id),
  passengerId: varchar("passenger_id").references(() => users.id),
  seatsBooked: integer("seats_booked").notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Export types for simplified schema
export type User = typeof users.$inferSelect;
export type Ride = typeof rides.$inferSelect;
export type Booking = typeof bookings.$inferSelect;

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertRideSchema = createInsertSchema(rides).omit({ id: true, createdAt: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, createdAt: true });

// Insert types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertRide = z.infer<typeof insertRideSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;