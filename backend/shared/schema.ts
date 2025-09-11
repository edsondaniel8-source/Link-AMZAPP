import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal, integer, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth - CORRIGIDO
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => ({
    // Retorna um objeto em vez de array
    expireIdx: index("IDX_session_expire").on(table.expire),
  })
);

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
  verificationStatus: text("verification_status").default("pending"),
  verificationDate: timestamp("verification_date"),
  verificationNotes: text("verification_notes"),
  identityDocumentUrl: text("identity_document_url"),
  identityDocumentType: text("identity_document_type"),
  profilePhotoUrl: text("profile_photo_url"),
  fullName: text("full_name"),
  documentNumber: text("document_number"),
  dateOfBirth: timestamp("date_of_birth"),
  registrationCompleted: boolean("registration_completed").default(false),
  verificationBadge: text("verification_badge"),
  badgeEarnedDate: timestamp("badge_earned_date"),
});

// Simplified Rides table
export const rides = pgTable("rides", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").references(() => users.id),
  fromLocation: varchar("from_location", { length: 255 }).notNull(),
  toLocation: varchar("to_location", { length: 255 }).notNull(),
  departureDate: timestamp("departure_date").notNull(),
  departureTime: text("departure_time").notNull(),
  availableSeats: integer("available_seats").notNull(),
  pricePerSeat: decimal("price_per_seat", { precision: 10, scale: 2 }).notNull(),
  vehicleType: varchar("vehicle_type", { length: 50 }),
  additionalInfo: text("additional_info"),
  status: varchar("status", { length: 20 }).default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

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
  offerDriverDiscounts: boolean("offer_driver_discounts").default(false),
  driverDiscountRate: decimal("driver_discount_rate", { precision: 5, scale: 2 }).default("10.00"),
  minimumDriverLevel: text("minimum_driver_level").default("bronze"),
  partnershipBadgeVisible: boolean("partnership_badge_visible").default(false),
  enablePartnerships: boolean("enable_partnerships").default(false),
  accommodationDiscount: integer("accommodation_discount").default(10),
  transportDiscount: integer("transport_discount").default(15),
});

// Ratings table for all user types
export const ratings = pgTable("ratings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromUserId: varchar("from_user_id").references(() => users.id),
  toUserId: varchar("to_user_id").references(() => users.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  serviceType: text("service_type").notNull(),
  bookingId: varchar("booking_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chat rooms table
export const chatRooms = pgTable("chat_rooms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  participantOneId: varchar("participant_one_id").references(() => users.id).notNull(),
  participantTwoId: varchar("participant_two_id").references(() => users.id).notNull(),
  bookingId: varchar("booking_id"),
  serviceType: text("service_type"),
  lastMessage: text("last_message"),
  lastMessageAt: timestamp("last_message_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chat messages table
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  chatRoomId: varchar("chat_room_id").references(() => chatRooms.id).notNull(),
  fromUserId: varchar("from_user_id").references(() => users.id),
  toUserId: varchar("to_user_id").references(() => users.id),
  message: text("message").notNull(),
  messageType: text("message_type").default("text"),
  bookingId: varchar("booking_id"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin actions table
export const adminActions = pgTable("admin_actions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adminId: varchar("admin_id").references(() => users.id),
  targetUserId: varchar("target_user_id").references(() => users.id),
  action: text("action").notNull(),
  reason: text("reason").notNull(),
  duration: integer("duration"),
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
  status: text("status").default("pending"),
  message: text("message"),
  expiresAt: timestamp("expires_at"),
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
  status: text("status").default("pending"),
  message: text("message"),
  estimatedDetour: integer("estimated_detour"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// CONSOLIDATED: Payments table
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").references(() => bookings.id),
  userId: varchar("user_id").references(() => users.id),
  serviceType: text("service_type").notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  platformFee: decimal("platform_fee", { precision: 10, scale: 2 }).notNull(),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).default("0.00"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method"),
  cardLast4: text("card_last4"),
  cardBrand: text("card_brand"),
  mpesaNumber: text("mpesa_number"),
  paymentStatus: text("payment_status").default("pending"),
  paymentReference: text("payment_reference"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Simplified Bookings table
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  rideId: varchar("ride_id").references(() => rides.id),
  passengerId: varchar("passenger_id").references(() => users.id),
  accommodationId: varchar("accommodation_id").references(() => accommodations.id),
  type: varchar("type", { length: 20 }).default('ride'),
  status: varchar("status", { length: 20 }).default("pending"),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  seatsBooked: integer("seats_booked").notNull(),
  passengers: integer("passengers").default(1),
  guestName: text("guest_name"),
  guestEmail: text("guest_email"),
  guestPhone: text("guest_phone"),
  checkInDate: timestamp("check_in_date"),
  checkOutDate: timestamp("check_out_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Driver statistics
export const driverStats = pgTable("driver_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").references(() => users.id).unique(),
  totalRides: integer("total_rides").default(0),
  totalDistance: decimal("total_distance", { precision: 10, scale: 2 }).default("0.00"),
  totalEarnings: decimal("total_earnings", { precision: 12, scale: 2 }).default("0.00"),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("0.00"),
  completedRidesThisMonth: integer("completed_rides_this_month").default(0),
  completedRidesThisYear: integer("completed_rides_this_year").default(0),
  partnershipLevel: text("partnership_level").default("bronze"),
  lastRideDate: timestamp("last_ride_date"),
  joinedAt: timestamp("joined_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Events and Fairs System
export const eventManagers = pgTable("event_managers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  companyName: text("company_name").notNull(),
  companyType: text("company_type").notNull(),
  description: text("description"),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  website: text("website"),
  logo: text("logo"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizerId: varchar("organizer_id").references(() => users.id),
  managerId: varchar("manager_id").references(() => eventManagers.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  eventType: text("event_type").notNull(),
  category: text("category").notNull(),
  venue: text("venue").notNull(),
  address: text("address").notNull(),
  lat: decimal("lat", { precision: 10, scale: 7 }),
  lng: decimal("lng", { precision: 10, scale: 7 }),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  startTime: text("start_time"),
  endTime: text("end_time"),
  isPaid: boolean("is_paid").default(false),
  ticketPrice: decimal("ticket_price", { precision: 8, scale: 2 }).default("0"),
  maxTickets: integer("max_tickets").default(100),
  ticketsSold: integer("tickets_sold").default(0),
  enablePartnerships: boolean("enable_partnerships").default(false),
  accommodationDiscount: integer("accommodation_discount").default(10),
  transportDiscount: integer("transport_discount").default(15),
  organizerName: text("organizer_name"),
  organizerContact: text("organizer_contact"),
  organizerEmail: text("organizer_email"),
  images: text("images").array(),
  maxAttendees: integer("max_attendees"),
  currentAttendees: integer("current_attendees").default(0),
  status: text("status").notNull().default("pending"),
  requiresApproval: boolean("requires_approval").default(true),
  isPublic: boolean("is_public").default(true),
  isFeatured: boolean("is_featured").default(false),
  hasPartnerships: boolean("has_partnerships").default(false),
  websiteUrl: text("website_url"),
  socialMediaLinks: text("social_media_links").array(),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Loyalty System
export const loyaltyProgram = pgTable("loyalty_program", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  totalPoints: integer("total_points").default(0),
  currentPoints: integer("current_points").default(0),
  membershipLevel: text("membership_level").default("bronze"),
  joinedAt: timestamp("joined_at").defaultNow(),
  lastActivityAt: timestamp("last_activity_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const pointsHistory = pgTable("points_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  loyaltyId: varchar("loyalty_id").references(() => loyaltyProgram.id),
  actionType: text("action_type").notNull(),
  pointsAmount: integer("points_amount").notNull(),
  reason: text("reason").notNull(),
  relatedId: varchar("related_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const loyaltyRewards = pgTable("loyalty_rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  rewardType: text("reward_type").notNull(),
  pointsCost: integer("points_cost").notNull(),
  discountValue: decimal("discount_value", { precision: 8, scale: 2 }),
  minimumLevel: text("minimum_level").default("bronze"),
  isActive: boolean("is_active").default(true),
  maxRedemptions: integer("max_redemptions"),
  validUntil: timestamp("valid_until"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const rewardRedemptions = pgTable("reward_redemptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  rewardId: varchar("reward_id").references(() => loyaltyRewards.id),
  pointsUsed: integer("points_used").notNull(),
  status: text("status").notNull().default("active"),
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
  type: text("type").notNull(),
  priority: text("priority").default("normal"),
  isRead: boolean("is_read").default(false),
  actionUrl: text("action_url"),
  relatedId: varchar("related_id"),
  createdAt: timestamp("created_at").defaultNow(),
  readAt: timestamp("read_at"),
});

// Driver verification documents
export const driverDocuments = pgTable("driver_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").references(() => users.id).notNull(),
  vehicleRegistrationUrl: text("vehicle_registration_url"),
  drivingLicenseUrl: text("driving_license_url"),
  vehicleInsuranceUrl: text("vehicle_insurance_url"),
  vehicleInspectionUrl: text("vehicle_inspection_url"),
  vehicleMake: text("vehicle_make"),
  vehicleModel: text("vehicle_model"),
  vehicleYear: integer("vehicle_year"),
  vehiclePlate: text("vehicle_plate"),
  vehicleColor: text("vehicle_color"),
  isVerified: boolean("is_verified").default(false),
  verificationDate: timestamp("verification_date"),
  verificationNotes: text("verification_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Hotel partnership proposals system
export const partnershipProposals = pgTable("partnership_proposals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hotelId: varchar("hotel_id").references(() => accommodations.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  proposalType: text("proposal_type").notNull(),
  targetRegions: text("target_regions").array(),
  minimumDriverLevel: text("minimum_driver_level").default("bronze"),
  requiredVehicleType: text("required_vehicle_type"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  specificDates: text("specific_dates").array(),
  timeSlots: text("time_slots").array(),
  basePaymentMzn: decimal("base_payment_mzn", { precision: 8, scale: 2 }).notNull(),
  bonusPaymentMzn: decimal("bonus_payment_mzn", { precision: 8, scale: 2 }).default("0.00"),
  premiumRate: decimal("premium_rate", { precision: 5, scale: 2 }).default("0.00"),
  offerFreeAccommodation: boolean("offer_free_accommodation").default(false),
  offerMeals: boolean("offer_meals").default(false),
  offerFuel: boolean("offer_fuel").default(false),
  additionalBenefits: text("additional_benefits").array(),
  maxDriversNeeded: integer("max_drivers_needed").notNull(),
  currentApplicants: integer("current_applicants").default(0),
  minimumRides: integer("minimum_rides"),
  estimatedEarnings: text("estimated_earnings"),
  status: text("status").default("active"),
  priority: text("priority").default("normal"),
  featuredUntil: timestamp("featured_until"),
  contactMethod: text("contact_method").default("in_app"),
  applicationDeadline: timestamp("application_deadline"),
  requiresInterview: boolean("requires_interview").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tabela de junção para aplicações de motoristas
export const partnershipApplications = pgTable("partnership_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  proposalId: varchar("proposal_id")
    .references(() => partnershipProposals.id)
    .notNull(),
  driverId: varchar("driver_id")
    .references(() => users.id)
    .notNull(),
  status: text("status").default("pending"),
  applicationDate: timestamp("application_date").defaultNow(),
  acceptedAt: timestamp("accepted_at"),
  completedAt: timestamp("completed_at"),
  message: text("message"),
  estimatedCompletion: timestamp("estimated_completion"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Hotel rooms management
export const hotelRooms = pgTable("hotel_rooms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  accommodationId: varchar("accommodation_id").references(() => accommodations.id).notNull(),
  roomNumber: text("room_number").notNull(),
  roomType: text("room_type").notNull(),
  description: text("description"),
  images: text("images").array(),
  basePrice: decimal("base_price", { precision: 8, scale: 2 }).notNull(),
  weekendPrice: decimal("weekend_price", { precision: 8, scale: 2 }),
  holidayPrice: decimal("holiday_price", { precision: 8, scale: 2 }),
  maxOccupancy: integer("max_occupancy").notNull().default(2),
  bedType: text("bed_type"),
  bedCount: integer("bed_count").default(1),
  hasPrivateBathroom: boolean("has_private_bathroom").default(true),
  hasAirConditioning: boolean("has_air_conditioning").default(false),
  hasWifi: boolean("has_wifi").default(false),
  hasTV: boolean("has_tv").default(false),
  hasBalcony: boolean("has_balcony").default(false),
  hasKitchen: boolean("has_kitchen").default(false),
  roomAmenities: text("room_amenities").array(),
  isAvailable: boolean("is_available").default(true),
  maintenanceUntil: timestamp("maintenance_until"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Hotels table
export const hotels = pgTable("hotels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address").notNull(),
  // ... outras colunas
});

// Room types table
export const roomTypes = pgTable("room_types", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hotelId: varchar("hotel_id").references(() => hotels.id),
  type: text("type").notNull(),
  pricePerNight: decimal("price_per_night", { precision: 8, scale: 2 }).notNull(),
  // ... outras colunas
});

// Hotel financial reports
export const hotelFinancialReports = pgTable("hotel_financial_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  accommodationId: varchar("accommodation_id").references(() => accommodations.id).notNull(),
  reportDate: timestamp("report_date").notNull(),
  reportType: text("report_type").notNull(),
  totalRevenue: decimal("total_revenue", { precision: 10, scale: 2 }).notNull(),
  roomRevenue: decimal("room_revenue", { precision: 10, scale: 2 }).notNull(),
  serviceRevenue: decimal("service_revenue", { precision: 10, scale: 2 }).default("0.00"),
  totalBookings: integer("total_bookings").default(0),
  confirmedBookings: integer("confirmed_bookings").default(0),
  cancelledBookings: integer("cancelled_bookings").default(0),
  noShowBookings: integer("no_show_bookings").default(0),
  totalRooms: integer("total_rooms").notNull(),
  occupiedRooms: integer("occupied_rooms").default(0),
  occupancyRate: decimal("occupancy_rate", { precision: 5, scale: 2 }).default("0.00"),
  averageDailyRate: decimal("average_daily_rate", { precision: 8, scale: 2 }).default("0.00"),
  revenuePerAvailableRoom: decimal("revenue_per_available_room", { precision: 8, scale: 2 }).default("0.00"),
  platformFees: decimal("platform_fees", { precision: 8, scale: 2 }).default("0.00"),
  netRevenue: decimal("net_revenue", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// System settings table
export const systemSettings = pgTable("system_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: varchar("key").notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  type: varchar("type"),
  updatedBy: varchar("updated_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Zod Schemas
export const insertUserSchema = createInsertSchema(users);
export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});
export const insertBookingSchema = createInsertSchema(bookings);
export const insertRideSchema = createInsertSchema(rides);
export const insertAccommodationSchema = createInsertSchema(accommodations);
export const insertPartnershipProposalSchema = createInsertSchema(partnershipProposals);
export const insertHotelRoomSchema = createInsertSchema(hotelRooms);
export const insertHotelFinancialReportSchema = createInsertSchema(hotelFinancialReports);
export const insertPartnershipApplicationSchema = createInsertSchema(partnershipApplications);

export type NewSystemSetting = typeof systemSettings.$inferInsert;