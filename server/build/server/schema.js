import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal, integer, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
// Session storage table for Replit Auth
export const sessions = pgTable("sessions", {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
}, (table) => [index("IDX_session_expire").on(table.expire)]);
export const users = pgTable("users", {
    id: varchar("id").primaryKey().default(sql `gen_random_uuid()`),
    email: varchar("email").unique(),
    firstName: varchar("first_name"),
    lastName: varchar("last_name"),
    profileImageUrl: varchar("profile_image_url"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    phone: text("phone").unique(), // Optional - can be filled later during registration
    userType: text("user_type").default("user"), // user, driver, host, restaurant
    canOfferServices: boolean("can_offer_services").default(false), // Only verified users can offer rides/accommodations
    avatar: text("avatar"),
    rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
    totalReviews: integer("total_reviews").default(0),
    isVerified: boolean("is_verified").default(false),
    // Document verification system
    verificationStatus: text("verification_status").default("pending"), // pending, in_review, verified, rejected
    verificationDate: timestamp("verification_date"),
    verificationNotes: text("verification_notes"), // Admin notes
    // Required documents
    identityDocumentUrl: text("identity_document_url"), // Required
    identityDocumentType: text("identity_document_type"), // Optional: bilhete_identidade, passaporte, carta_conducao
    profilePhotoUrl: text("profile_photo_url"), // Required
    // Additional verification fields
    fullName: text("full_name"),
    documentNumber: text("document_number"), // Optional - can be filled during registration
    dateOfBirth: timestamp("date_of_birth"),
    // Registration completion status
    registrationCompleted: boolean("registration_completed").default(false),
    // Verification badge/seal
    verificationBadge: text("verification_badge"), // bronze, silver, gold, platinum
    badgeEarnedDate: timestamp("badge_earned_date"),
});
// Insert schemas for validation
export const insertUserSchema = createInsertSchema(users);
