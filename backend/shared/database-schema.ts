import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal, integer, boolean, jsonb, index, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ===== ESQUEMA BASEADO NA ESTRUTURA REAL DO DATABASE =====

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table (estrutura existente)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  phone: text("phone").unique(),
  userType: text("user_type").default("client"),
  roles: text("roles").array().default(sql`'{client}'`),
  canOfferServices: boolean("can_offer_services").default(false),
  avatar: text("avatar"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  totalReviews: integer("total_reviews").default(0),
  isVerified: boolean("is_verified").default(false),
});

// Rides table (baseado na estrutura REAL do database)
export const rides = pgTable("rides", {
  id: varchar("id").primaryKey(),
  type: text("type"),
  fromAddress: text("from_address"),
  toAddress: text("to_address"),
  fromLat: decimal("from_lat"),
  fromLng: decimal("from_lng"),
  toLat: decimal("to_lat"),
  toLng: decimal("to_lng"),
  price: decimal("price"),
  estimatedDuration: integer("estimated_duration"),
  estimatedDistance: decimal("estimated_distance"),
  availableIn: integer("available_in"),
  driverName: text("driver_name"),
  vehicleInfo: text("vehicle_info"),
  maxPassengers: integer("max_passengers"),
  availableSeats: integer("available_seats"),
  isActive: boolean("is_active").default(true),
  route: text("route").array(),
  allowPickupEnRoute: boolean("allow_pickup_en_route").default(false),
  allowNegotiation: boolean("allow_negotiation").default(false),
  isRoundTrip: boolean("is_round_trip").default(false),
  returnDate: timestamp("return_date"),
  returnDepartureTime: timestamp("return_departure_time"),
  minPrice: decimal("min_price"),
  maxPrice: decimal("max_price"),
  departureDate: timestamp("departure_date"),
});

// Bookings table (baseado na estrutura REAL do database)
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  type: text("type"),
  status: text("status"),
  rideId: varchar("ride_id"),
  pickupTime: timestamp("pickup_time"),
  accommodationId: varchar("accommodation_id"),
  checkInDate: timestamp("check_in_date"),
  checkOutDate: timestamp("check_out_date"),
  guests: integer("guests"),
  nights: integer("nights"),
  passengers: integer("passengers").default(1),
  totalPrice: decimal("total_price"),
  guestName: text("guest_name"),
  guestEmail: text("guest_email"),
  guestPhone: text("guest_phone"),
  paymentMethod: text("payment_method"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Accommodations table (mantendo estrutura do schema original)
export const accommodations = pgTable("accommodations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(),
  hostId: varchar("host_id").references(() => users.id),
  address: text("address").notNull(),
  lat: decimal("lat", { precision: 10, scale: 7 }),
  lng: decimal("lng", { precision: 10, scale: 7 }),
  pricePerNight: decimal("price_per_night", { precision: 8, scale: 2 }).notNull(),
  rating: decimal("rating", { precision: 3, scale: 1 }),
  reviewCount: integer("review_count").default(0),
  images: text("images").array(),
  amenities: text("amenities").array(),
  description: text("description"),
  distanceFromCenter: decimal("distance_from_center", { precision: 4, scale: 1 }),
  isAvailable: boolean("is_available").default(true),
});

// ===== TIPOS EXPORTADOS =====
export type User = typeof users.$inferSelect;
export type Ride = typeof rides.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Accommodation = typeof accommodations.$inferSelect;

// ===== SCHEMAS DE INSERÇÃO =====
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true,
  updatedAt: true 
});

export const insertRideSchema = createInsertSchema(rides).omit({ 
  id: true
});

export const insertBookingSchema = createInsertSchema(bookings).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true 
});

export const insertAccommodationSchema = createInsertSchema(accommodations).omit({ 
  id: true
});

// ===== TIPOS DE INSERÇÃO =====
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertRide = z.infer<typeof insertRideSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertAccommodation = z.infer<typeof insertAccommodationSchema>;