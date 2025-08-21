import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  userType: text("user_type").default("user"), // user, driver, host, restaurant
  avatar: text("avatar"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  totalReviews: integer("total_reviews").default(0),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const rides = pgTable("rides", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // UberX, Comfort, UberXL
  fromAddress: text("from_address").notNull(),
  toAddress: text("to_address").notNull(),
  fromLat: decimal("from_lat", { precision: 10, scale: 7 }),
  fromLng: decimal("from_lng", { precision: 10, scale: 7 }),
  toLat: decimal("to_lat", { precision: 10, scale: 7 }),
  toLng: decimal("to_lng", { precision: 10, scale: 7 }),
  price: decimal("price", { precision: 8, scale: 2 }).notNull(),
  estimatedDuration: integer("estimated_duration"), // minutes
  estimatedDistance: decimal("estimated_distance", { precision: 5, scale: 2 }), // miles
  availableIn: integer("available_in"), // minutes until pickup
  driverName: text("driver_name"),
  vehicleInfo: text("vehicle_info"),
  maxPassengers: integer("max_passengers").default(4), // Maximum seats in vehicle
  availableSeats: integer("available_seats").default(4), // Currently available seats
  isActive: boolean("is_active").default(true),
  // New advanced features
  route: text("route").array(), // Array of intermediate stops/cities along the route
  allowPickupEnRoute: boolean("allow_pickup_en_route").default(false),
  allowNegotiation: boolean("allow_negotiation").default(false),
  isRoundTrip: boolean("is_round_trip").default(false),
  returnDate: timestamp("return_date"), // For round trips
  returnDepartureTime: timestamp("return_departure_time"), // For round trips
  minPrice: decimal("min_price", { precision: 8, scale: 2 }), // Minimum acceptable price for negotiation
  maxPrice: decimal("max_price", { precision: 8, scale: 2 }), // Maximum price for negotiation
  departureDate: timestamp("departure_date"), // Date of departure
});

export const accommodations = pgTable("accommodations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // Hotel, Apartment, House
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

// Ratings table for all user types
export const ratings = pgTable("ratings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromUserId: varchar("from_user_id").references(() => users.id),
  toUserId: varchar("to_user_id").references(() => users.id),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  serviceType: text("service_type").notNull(), // ride, stay, restaurant
  bookingId: varchar("booking_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chat messages table
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromUserId: varchar("from_user_id").references(() => users.id),
  toUserId: varchar("to_user_id").references(() => users.id),
  message: text("message").notNull(),
  messageType: text("message_type").default("text"), // text, image, location
  bookingId: varchar("booking_id"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Restaurant table
export const restaurants = pgTable("restaurants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
  cuisine: text("cuisine").notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  priceRange: text("price_range"), // $, $$, $$$
  image: text("image"),
  lat: decimal("lat", { precision: 10, scale: 7 }),
  lng: decimal("lng", { precision: 10, scale: 7 }),
  isOpen: boolean("is_open").default(true),
  specialties: text("specialties").array(),
  menu: jsonb("menu"), // Store menu items as JSON
  dailySpecials: jsonb("daily_specials"), // Store daily specials as JSON
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin actions table
export const adminActions = pgTable("admin_actions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adminId: varchar("admin_id").references(() => users.id),
  targetUserId: varchar("target_user_id").references(() => users.id),
  action: text("action").notNull(), // warning, suspend, ban, remove
  reason: text("reason").notNull(),
  duration: integer("duration"), // days for suspension
  notes: text("notes"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Price regulations table
export const priceRegulations = pgTable("price_regulations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  rideType: text("ride_type").notNull(),
  minPricePerKm: decimal("min_price_per_km", { precision: 8, scale: 2 }).notNull(),
  maxPricePerKm: decimal("max_price_per_km", { precision: 8, scale: 2 }).notNull(),
  baseFare: decimal("base_fare", { precision: 8, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Price negotiation requests
export const priceNegotiations = pgTable("price_negotiations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  rideId: varchar("ride_id").references(() => rides.id),
  passengerId: varchar("passenger_id").references(() => users.id),
  driverId: varchar("driver_id").references(() => users.id),
  originalPrice: decimal("original_price", { precision: 8, scale: 2 }).notNull(),
  proposedPrice: decimal("proposed_price", { precision: 8, scale: 2 }).notNull(),
  counterPrice: decimal("counter_price", { precision: 8, scale: 2 }),
  status: text("status").default("pending"), // pending, accepted, rejected, countered
  message: text("message"), // Optional message with the negotiation
  expiresAt: timestamp("expires_at"), // Negotiation expiry time
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Pickup requests for en-route pickups
export const pickupRequests = pgTable("pickup_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  rideId: varchar("ride_id").references(() => rides.id),
  passengerId: varchar("passenger_id").references(() => users.id),
  driverId: varchar("driver_id").references(() => users.id),
  pickupLocation: text("pickup_location").notNull(),
  pickupLat: decimal("pickup_lat", { precision: 10, scale: 7 }),
  pickupLng: decimal("pickup_lng", { precision: 10, scale: 7 }),
  destinationLocation: text("destination_location").notNull(),
  destinationLat: decimal("destination_lat", { precision: 10, scale: 7 }),
  destinationLng: decimal("destination_lng", { precision: 10, scale: 7 }),
  requestedSeats: integer("requested_seats").default(1),
  proposedPrice: decimal("proposed_price", { precision: 8, scale: 2 }),
  status: text("status").default("pending"), // pending, accepted, rejected
  message: text("message"),
  estimatedDetour: integer("estimated_detour"), // Additional minutes for detour
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Transactions table for payment processing
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").references(() => bookings.id),
  userId: varchar("user_id").references(() => users.id),
  serviceType: text("service_type").notNull(), // 'ride', 'accommodation', 'restaurant'
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  platformFee: decimal("platform_fee", { precision: 10, scale: 2 }).notNull(), // 10% of subtotal
  total: decimal("total", { precision: 10, scale: 2 }).notNull(), // subtotal + platformFee
  paymentMethod: text("payment_method"), // 'card', 'mpesa', 'bank_transfer'
  paymentStatus: text("payment_status").default("pending"), // 'pending', 'completed', 'failed', 'refunded'
  paymentReference: text("payment_reference"), // External payment processor reference
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payment methods table
export const paymentMethods = pgTable("payment_methods", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  type: text("type").notNull(), // 'card', 'mpesa', 'bank_account'
  isDefault: boolean("is_default").default(false),
  cardLast4: text("card_last4"), // For cards
  cardBrand: text("card_brand"), // visa, mastercard, etc
  mpesaNumber: text("mpesa_number"), // For M-Pesa
  bankAccount: text("bank_account"), // For bank transfers
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  type: text("type").notNull(), // "ride" or "stay"
  status: text("status").notNull().default("pending"), // pending, confirmed, completed, cancelled
  
  // Ride booking fields
  rideId: varchar("ride_id").references(() => rides.id),
  pickupTime: timestamp("pickup_time"),
  
  // Stay booking fields
  accommodationId: varchar("accommodation_id").references(() => accommodations.id),
  checkInDate: timestamp("check_in_date"),
  checkOutDate: timestamp("check_out_date"),
  guests: integer("guests"),
  nights: integer("nights"),
  
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method"), // visa_4242, mastercard_5555, etc
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Driver-Hotel Partnership System for Special Discounts
export const driverHotelPartnerships = pgTable("driver_hotel_partnerships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").references(() => users.id),
  accommodationId: varchar("accommodation_id").references(() => accommodations.id),
  partnershipType: text("partnership_type").notNull(), // "bronze", "silver", "gold", "platinum"
  discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }).notNull(), // e.g., 15.00 for 15%
  minimumRides: integer("minimum_rides").default(0), // Minimum rides to qualify
  isActive: boolean("is_active").default(true),
  validFrom: timestamp("valid_from").defaultNow(),
  validUntil: timestamp("valid_until"), // Optional expiry date
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Driver statistics to track eligibility for partnership levels
export const driverStats = pgTable("driver_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").references(() => users.id).unique(),
  totalRides: integer("total_rides").default(0),
  totalDistance: decimal("total_distance", { precision: 10, scale: 2 }).default("0.00"), // in km
  totalEarnings: decimal("total_earnings", { precision: 12, scale: 2 }).default("0.00"), // in MZN
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("0.00"),
  completedRidesThisMonth: integer("completed_rides_this_month").default(0),
  completedRidesThisYear: integer("completed_rides_this_year").default(0),
  partnershipLevel: text("partnership_level").default("bronze"), // bronze, silver, gold, platinum
  lastRideDate: timestamp("last_ride_date"),
  joinedAt: timestamp("joined_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Partnership benefits and rewards
export const partnershipBenefits = pgTable("partnership_benefits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  level: text("level").notNull(), // bronze, silver, gold, platinum
  benefitType: text("benefit_type").notNull(), // "accommodation_discount", "priority_booking", "free_meal"
  benefitValue: decimal("benefit_value", { precision: 8, scale: 2 }), // percentage or monetary value
  description: text("description").notNull(),
  minimumRidesRequired: integer("minimum_rides_required").default(0),
  minimumRatingRequired: decimal("minimum_rating_required", { precision: 3, scale: 2 }).default("0.00"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Discount usage tracking
export const discountUsageLog = pgTable("discount_usage_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  partnershipId: varchar("partnership_id").references(() => driverHotelPartnerships.id),
  driverId: varchar("driver_id").references(() => users.id),
  accommodationId: varchar("accommodation_id").references(() => accommodations.id),
  bookingId: varchar("booking_id").references(() => bookings.id),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }).notNull(),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).notNull(),
  finalPrice: decimal("final_price", { precision: 10, scale: 2 }).notNull(),
  discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }).notNull(),
  usedAt: timestamp("used_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertRideSchema = createInsertSchema(rides).omit({
  id: true,
});

export const insertAccommodationSchema = createInsertSchema(accommodations).omit({
  id: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertRide = z.infer<typeof insertRideSchema>;
export type InsertAccommodation = z.infer<typeof insertAccommodationSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type User = typeof users.$inferSelect;
export type Ride = typeof rides.$inferSelect;
export type Accommodation = typeof accommodations.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Rating = typeof ratings.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type Restaurant = typeof restaurants.$inferSelect;
export type AdminAction = typeof adminActions.$inferSelect;
export type PriceRegulation = typeof priceRegulations.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type PaymentMethod = typeof paymentMethods.$inferSelect;

// Partnership system types
export type DriverHotelPartnership = typeof driverHotelPartnerships.$inferSelect;
export type DriverStats = typeof driverStats.$inferSelect;
export type PartnershipBenefit = typeof partnershipBenefits.$inferSelect;
export type DiscountUsageLog = typeof discountUsageLog.$inferSelect;

// Price negotiation types
export const insertPriceNegotiationSchema = createInsertSchema(priceNegotiations);
export type PriceNegotiation = typeof priceNegotiations.$inferSelect;
export type InsertPriceNegotiation = z.infer<typeof insertPriceNegotiationSchema>;

// Pickup request types
export const insertPickupRequestSchema = createInsertSchema(pickupRequests);
export type PickupRequest = typeof pickupRequests.$inferSelect;
export type InsertPickupRequest = z.infer<typeof insertPickupRequestSchema>;

// Partnership system schemas
export const insertDriverStatsSchema = createInsertSchema(driverStats).omit({
  id: true,
  joinedAt: true,
  updatedAt: true,
});

export const insertDriverHotelPartnershipSchema = createInsertSchema(driverHotelPartnerships).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertDriverStats = z.infer<typeof insertDriverStatsSchema>;
export type InsertDriverHotelPartnership = z.infer<typeof insertDriverHotelPartnershipSchema>;
