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
  canOfferServices: boolean("can_offer_services").default(false), // Only verified users can offer rides/accommodations
  avatar: text("avatar"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  totalReviews: integer("total_reviews").default(0),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  
  // Document verification system
  verificationStatus: text("verification_status").default("pending"), // pending, in_review, verified, rejected
  verificationDate: timestamp("verification_date"),
  verificationNotes: text("verification_notes"), // Admin notes
  
  // Required documents
  identityDocumentUrl: text("identity_document_url"),
  identityDocumentType: text("identity_document_type"), // bilhete_identidade, passaporte, carta_conducao
  profilePhotoUrl: text("profile_photo_url"),
  
  // Additional verification fields
  fullName: text("full_name"),
  documentNumber: text("document_number"),
  dateOfBirth: timestamp("date_of_birth"),
  
  // Verification badge/seal
  verificationBadge: text("verification_badge"), // bronze, silver, gold, platinum
  badgeEarnedDate: timestamp("badge_earned_date"),
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
  // Partnership visibility - only show to drivers if enabled
  hasPartnershipProgram: boolean("has_partnership_program").default(false),
  partnershipBadgeVisible: boolean("partnership_badge_visible").default(false), // Show "Motoristas VIP" badge
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

// Driver-Hotel Partnership System - OPTIONAL for accommodations to offer
export const accommodationPartnershipPrograms = pgTable("accommodation_partnership_programs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  accommodationId: varchar("accommodation_id").references(() => accommodations.id),
  hostId: varchar("host_id").references(() => users.id), // The accommodation owner/manager
  isEnabled: boolean("is_enabled").default(false), // Host must opt-in to offer partnerships
  programName: text("program_name").notNull(), // e.g., "Programa VIP Motoristas"
  description: text("description"), // Host's description of their program
  // Partnership levels the accommodation wants to offer
  bronzeEnabled: boolean("bronze_enabled").default(false),
  bronzeDiscount: decimal("bronze_discount", { precision: 5, scale: 2 }).default("0.00"),
  bronzeMinRides: integer("bronze_min_rides").default(10),
  silverEnabled: boolean("silver_enabled").default(false),
  silverDiscount: decimal("silver_discount", { precision: 5, scale: 2 }).default("0.00"),
  silverMinRides: integer("silver_min_rides").default(25),
  goldEnabled: boolean("gold_enabled").default(false),
  goldDiscount: decimal("gold_discount", { precision: 5, scale: 2 }).default("0.00"),
  goldMinRides: integer("gold_min_rides").default(50),
  platinumEnabled: boolean("platinum_enabled").default(false),
  platinumDiscount: decimal("platinum_discount", { precision: 5, scale: 2 }).default("0.00"),
  platinumMinRides: integer("platinum_min_rides").default(100),
  // Additional benefits the host wants to offer
  extraBenefits: text("extra_benefits").array(), // ["priority_checkin", "free_breakfast", "spa_access"]
  termsAndConditions: text("terms_and_conditions"),
  validUntil: timestamp("valid_until"), // Optional program expiry
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Active partnerships between qualified drivers and participating accommodations
export const driverHotelPartnerships = pgTable("driver_hotel_partnerships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").references(() => users.id),
  accommodationId: varchar("accommodation_id").references(() => accommodations.id),
  programId: varchar("program_id").references(() => accommodationPartnershipPrograms.id),
  qualifiedLevel: text("qualified_level").notNull(), // "bronze", "silver", "gold", "platinum"
  discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  qualifiedAt: timestamp("qualified_at").defaultNow(),
  expiresAt: timestamp("expires_at"), // When driver needs to re-qualify
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

// Events and Fairs System - Comprehensive event management
export const eventManagers = pgTable("event_managers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id), // User who manages events
  companyName: text("company_name").notNull(),
  companyType: text("company_type").notNull(), // "event_company", "hotel", "restaurant", "venue"
  description: text("description"),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  website: text("website"),
  logo: text("logo"), // URL to company logo
  isVerified: boolean("is_verified").default(false), // Admin verification
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  managerId: varchar("manager_id").references(() => eventManagers.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  eventType: text("event_type").notNull(), // "feira", "festival", "concerto", "conferencia", "casamento", "festa"
  category: text("category").notNull(), // "cultura", "negocios", "entretenimento", "gastronomia", "educacao"
  venue: text("venue").notNull(), // Event location/venue name
  address: text("address").notNull(),
  lat: decimal("lat", { precision: 10, scale: 7 }),
  lng: decimal("lng", { precision: 10, scale: 7 }),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  startTime: text("start_time"), // e.g., "14:00"
  endTime: text("end_time"), // e.g., "22:00"
  images: text("images").array(), // Event photos
  ticketPrice: decimal("ticket_price", { precision: 8, scale: 2 }), // Base ticket price
  maxAttendees: integer("max_attendees"),
  currentAttendees: integer("current_attendees").default(0),
  status: text("status").notNull().default("upcoming"), // "upcoming", "ongoing", "completed", "cancelled"
  isPublic: boolean("is_public").default(true),
  isFeatured: boolean("is_featured").default(false), // Show on homepage
  hasPartnerships: boolean("has_partnerships").default(false), // Offer partnerships
  websiteUrl: text("website_url"),
  socialMediaLinks: text("social_media_links").array(),
  tags: text("tags").array(), // Search tags
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const eventPartnerships = pgTable("event_partnerships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").references(() => events.id),
  partnerType: text("partner_type").notNull(), // "hotel", "driver", "restaurant"
  partnerId: varchar("partner_id").notNull(), // ID of hotel/driver/restaurant
  partnerName: text("partner_name").notNull(),
  discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }).notNull(),
  specialOffer: text("special_offer"), // Description of special offer
  minEventTickets: integer("min_event_tickets").default(1), // Minimum tickets to qualify
  isActive: boolean("is_active").default(true),
  validFrom: timestamp("valid_from").defaultNow(),
  validUntil: timestamp("valid_until"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const eventBookings = pgTable("event_bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").references(() => events.id),
  userId: varchar("user_id").references(() => users.id),
  ticketQuantity: integer("ticket_quantity").notNull().default(1),
  totalPrice: decimal("total_price", { precision: 8, scale: 2 }).notNull(),
  partnershipUsed: varchar("partnership_used"), // ID of partnership used
  discountApplied: decimal("discount_applied", { precision: 8, scale: 2 }).default("0.00"),
  bookingStatus: text("booking_status").notNull().default("confirmed"), // "confirmed", "cancelled", "attended"
  paymentStatus: text("payment_status").notNull().default("pending"), // "pending", "paid", "refunded"
  specialRequests: text("special_requests"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Loyalty System - Points and Rewards
export const loyaltyProgram = pgTable("loyalty_program", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  totalPoints: integer("total_points").default(0),
  currentPoints: integer("current_points").default(0), // Available to spend
  membershipLevel: text("membership_level").default("bronze"), // "bronze", "silver", "gold", "platinum"
  joinedAt: timestamp("joined_at").defaultNow(),
  lastActivityAt: timestamp("last_activity_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const pointsHistory = pgTable("points_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  loyaltyId: varchar("loyalty_id").references(() => loyaltyProgram.id),
  actionType: text("action_type").notNull(), // "earned", "redeemed", "expired"
  pointsAmount: integer("points_amount").notNull(),
  reason: text("reason").notNull(), // "ride_completed", "stay_booked", "event_attended", "reward_redeemed"
  relatedId: varchar("related_id"), // ID of related booking/ride/event
  createdAt: timestamp("created_at").defaultNow(),
});

export const loyaltyRewards = pgTable("loyalty_rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  rewardType: text("reward_type").notNull(), // "discount", "free_ride", "upgrade", "event_ticket"
  pointsCost: integer("points_cost").notNull(),
  discountValue: decimal("discount_value", { precision: 8, scale: 2 }), // For discount rewards
  minimumLevel: text("minimum_level").default("bronze"), // Required membership level
  isActive: boolean("is_active").default(true),
  maxRedemptions: integer("max_redemptions"), // Limit per user
  validUntil: timestamp("valid_until"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const rewardRedemptions = pgTable("reward_redemptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  rewardId: varchar("reward_id").references(() => loyaltyRewards.id),
  pointsUsed: integer("points_used").notNull(),
  status: text("status").notNull().default("active"), // "active", "used", "expired"
  expiresAt: timestamp("expires_at"),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Real-time Notifications System
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // "ride", "stay", "event", "payment", "partnership", "loyalty", "system"
  priority: text("priority").default("normal"), // "low", "normal", "high", "urgent"
  isRead: boolean("is_read").default(false),
  actionUrl: text("action_url"), // Optional URL to navigate to
  relatedId: varchar("related_id"), // ID of related entity
  createdAt: timestamp("created_at").defaultNow(),
  readAt: timestamp("read_at"),
});

// Driver verification documents (vehicle documents for drivers)
export const driverDocuments = pgTable("driver_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").references(() => users.id).notNull(),
  
  // Vehicle documents
  vehicleRegistrationUrl: text("vehicle_registration_url"), // Registo do veículo
  drivingLicenseUrl: text("driving_license_url"), // Carta de condução
  vehicleInsuranceUrl: text("vehicle_insurance_url"), // Seguro do veículo
  vehicleInspectionUrl: text("vehicle_inspection_url"), // Inspecção técnica
  
  // Vehicle details
  vehicleMake: text("vehicle_make"), // Marca
  vehicleModel: text("vehicle_model"), // Modelo
  vehicleYear: integer("vehicle_year"), // Ano
  vehiclePlate: text("vehicle_plate"), // Matrícula
  vehicleColor: text("vehicle_color"), // Cor
  
  // Verification status
  isVerified: boolean("is_verified").default(false),
  verificationDate: timestamp("verification_date"),
  verificationNotes: text("verification_notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type Ride = typeof rides.$inferSelect;
export type Accommodation = typeof accommodations.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Rating = typeof ratings.$inferSelect;
export type Event = typeof events.$inferSelect;
export type EventManager = typeof eventManagers.$inferSelect;
export type EventPartnership = typeof eventPartnerships.$inferSelect;
export type EventBooking = typeof eventBookings.$inferSelect;
export type LoyaltyProgram = typeof loyaltyProgram.$inferSelect;
export type PointsHistory = typeof pointsHistory.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type Restaurant = typeof restaurants.$inferSelect;
export type AdminAction = typeof adminActions.$inferSelect;
export type PriceRegulation = typeof priceRegulations.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type DriverDocument = typeof driverDocuments.$inferSelect;

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
