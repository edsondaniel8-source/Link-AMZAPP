import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal, integer, date, time, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ===== USERS =====
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  phone: text("phone"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("4.50"),
  roles: json("roles").$type<string[]>().default(["client"]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// ===== RIDES (SISTEMA UNIFICADO) =====
export const rides = pgTable("rides_unified", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").references(() => users.id).notNull(),
  fromAddress: varchar("from_address", { length: 255 }).notNull(),
  toAddress: varchar("to_address", { length: 255 }).notNull(),
  departureDate: date("departure_date").notNull(),
  departureTime: time("departure_time").notNull(),
  maxPassengers: integer("max_passengers").notNull(),
  availableSeats: integer("available_seats").notNull(),
  pricePerSeat: decimal("price_per_seat", { precision: 10, scale: 2 }).notNull(),
  vehicleType: varchar("vehicle_type", { length: 50 }).default("sedan"),
  vehicleInfo: text("vehicle_info"),
  description: text("description"),
  status: varchar("status", { length: 20 }).default("active"),
  allowNegotiation: boolean("allow_negotiation").default(false),
  isRecurring: boolean("is_recurring").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ===== ACCOMMODATIONS =====
export const accommodations = pgTable("accommodations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hostId: varchar("host_id").references(() => users.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // hotel, guesthouse, apartment, villa
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  province: varchar("province", { length: 100 }).notNull(),
  description: text("description"),
  amenities: json("amenities").$type<string[]>().default([]),
  images: json("images").$type<string[]>().default([]),
  maxGuests: integer("max_guests").notNull(),
  bedrooms: integer("bedrooms").default(1),
  bathrooms: integer("bathrooms").default(1),
  pricePerNight: decimal("price_per_night", { precision: 10, scale: 2 }).notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("4.00"),
  totalReviews: integer("total_reviews").default(0),
  isAvailable: boolean("is_available").default(true),
  minimumNights: integer("minimum_nights").default(1),
  checkInTime: time("check_in_time").default("15:00"),
  checkOutTime: time("check_out_time").default("11:00"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ===== BOOKINGS UNIFICADAS =====
export const bookings = pgTable("bookings_unified", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").references(() => users.id).notNull(),
  serviceType: varchar("service_type", { length: 20 }).notNull(), // 'ride' | 'accommodation'
  serviceId: varchar("service_id").notNull(), // ID do ride ou accommodation
  providerId: varchar("provider_id").references(() => users.id).notNull(), // driver ou host
  
  // Detalhes comuns
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).default("pending"), // pending, confirmed, cancelled, completed
  specialRequests: text("special_requests"),
  contactPhone: varchar("contact_phone"),
  contactEmail: varchar("contact_email"),
  
  // Para viagens
  seatsBooked: integer("seats_booked"),
  pickupLocation: text("pickup_location"),
  
  // Para alojamentos
  checkInDate: date("check_in_date"),
  checkOutDate: date("check_out_date"),
  guests: integer("guests"),
  nights: integer("nights"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ===== AVAILABILITY CALENDAR (para alojamentos) =====
export const availability = pgTable("availability", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  accommodationId: varchar("accommodation_id").references(() => accommodations.id).notNull(),
  date: date("date").notNull(),
  isAvailable: boolean("is_available").default(true),
  specialPrice: decimal("special_price", { precision: 10, scale: 2 }),
  reason: text("reason"), // "booked", "maintenance", "holiday_pricing"
});

// ===== TIPOS EXPORTADOS =====
export type User = typeof users.$inferSelect;
export type Ride = typeof rides.$inferSelect;
export type Accommodation = typeof accommodations.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Availability = typeof availability.$inferSelect;

// ===== SCHEMAS DE INSERÇÃO =====
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true 
});

export const insertRideSchema = createInsertSchema(rides).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertAccommodationSchema = createInsertSchema(accommodations).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertBookingSchema = createInsertSchema(bookings).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertAvailabilitySchema = createInsertSchema(availability).omit({ 
  id: true 
});

// ===== TIPOS DE INSERÇÃO =====
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertRide = z.infer<typeof insertRideSchema>;
export type InsertAccommodation = z.infer<typeof insertAccommodationSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertAvailability = z.infer<typeof insertAvailabilitySchema>;

// ===== SCHEMAS DE VALIDAÇÃO PARA API =====
export const createRideApiSchema = z.object({
  fromAddress: z.string().min(1, "Origem é obrigatória"),
  toAddress: z.string().min(1, "Destino é obrigatório"),
  departureDate: z.string().min(1, "Data é obrigatória"),
  departureTime: z.string().min(1, "Hora é obrigatória"),
  maxPassengers: z.number().min(1).max(8),
  pricePerSeat: z.number().min(0),
  vehicleType: z.string().optional(),
  vehicleInfo: z.string().optional(),
  description: z.string().optional(),
  allowNegotiation: z.boolean().default(false),
});

export const createAccommodationApiSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.enum(["hotel", "guesthouse", "apartment", "villa", "lodge"]),
  address: z.string().min(1, "Endereço é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  province: z.string().min(1, "Província é obrigatória"),
  description: z.string().optional(),
  amenities: z.array(z.string()).default([]),
  maxGuests: z.number().min(1),
  bedrooms: z.number().min(1),
  bathrooms: z.number().min(1),
  pricePerNight: z.number().min(0),
  minimumNights: z.number().min(1).default(1),
});

export const createBookingApiSchema = z.object({
  serviceType: z.enum(["ride", "accommodation"]),
  serviceId: z.string().min(1),
  specialRequests: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional(),
  // Para viagens
  seatsBooked: z.number().optional(),
  pickupLocation: z.string().optional(),
  // Para alojamentos
  checkInDate: z.string().optional(),
  checkOutDate: z.string().optional(),
  guests: z.number().optional(),
});