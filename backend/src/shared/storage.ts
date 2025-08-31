import { db } from "../../db";
import { 
  users, 
  rides, 
  accommodations, 
  bookings, 
  events, 
  payments, 
  ratings, 
  loyaltyProgram,
  pointsHistory,
  notifications,
  driverDocuments,
  eventManagers,
  chatMessages,
  adminActions,
  priceRegulations,
  driverStats,
  partnershipProposals
} from "@shared/schema";
import { eq, and, desc, asc, like, gte, lte, sql, or, count, avg } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Types from schema
export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;
export type Ride = typeof rides.$inferSelect;
export type Accommodation = typeof accommodations.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type Rating = typeof ratings.$inferSelect;

// Insert schemas
export const insertUserSchema = createInsertSchema(users);
export const insertRideSchema = createInsertSchema(rides);
export const insertAccommodationSchema = createInsertSchema(accommodations);
export const insertBookingSchema = createInsertSchema(bookings);
export const insertEventSchema = createInsertSchema(events);
export const insertPaymentSchema = createInsertSchema(payments);

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserRoles(id: string, roles: string[]): Promise<User>;
  getUsersByType(userType: string): Promise<User[]>;
  searchUsers(query: string): Promise<User[]>;
  
  // Rides operations
  createRide(ride: typeof rides.$inferInsert): Promise<Ride>;
  getRide(id: string): Promise<Ride | undefined>;
  getRides(filters?: any): Promise<Ride[]>;
  updateRide(id: string, data: Partial<Ride>): Promise<Ride | undefined>;
  deleteRide(id: string): Promise<boolean>;
  
  // Accommodations operations
  createAccommodation(accommodation: typeof accommodations.$inferInsert): Promise<Accommodation>;
  getAccommodation(id: string): Promise<Accommodation | undefined>;
  getAccommodations(filters?: any): Promise<Accommodation[]>;
  updateAccommodation(id: string, data: Partial<Accommodation>): Promise<Accommodation | undefined>;
  deleteAccommodation(id: string): Promise<boolean>;
  
  // Bookings operations
  createBooking(booking: typeof bookings.$inferInsert): Promise<Booking>;
  getBooking(id: string): Promise<Booking | undefined>;
  getUserBookings(userId: string): Promise<Booking[]>;
  getProviderBookings(providerId: string): Promise<Booking[]>;
  updateBooking(id: string, data: Partial<Booking>): Promise<Booking | undefined>;
  
  // Events operations
  createEvent(event: typeof events.$inferInsert): Promise<Event>;
  getEvent(id: string): Promise<Event | undefined>;
  getEvents(filters?: any): Promise<Event[]>;
  updateEvent(id: string, data: Partial<Event>): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<boolean>;
  
  // Payments operations
  createPayment(payment: typeof payments.$inferInsert): Promise<Payment>;
  getPayment(id: string): Promise<Payment | undefined>;
  getUserPayments(userId: string): Promise<Payment[]>;
  updatePayment(id: string, data: Partial<Payment>): Promise<Payment | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserRoles(id: string, roles: string[]): Promise<User> {
    const primaryRole = roles.length > 0 ? roles[0] : 'user';
    
    const [updatedUser] = await db
      .update(users)
      .set({ 
        userType: primaryRole,
        registrationCompleted: true,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
      
    if (!updatedUser) {
      throw new Error(`User with id ${id} not found`);
    }
    
    return updatedUser;
  }

  async getUsersByType(userType: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.userType, userType));
  }

  async searchUsers(query: string): Promise<User[]> {
    return await db.select().from(users).where(
      or(
        like(users.firstName, `%${query}%`),
        like(users.lastName, `%${query}%`),
        like(users.email, `%${query}%`)
      )
    );
  }

  // Rides operations
  async createRide(ride: typeof rides.$inferInsert): Promise<Ride> {
    const [newRide] = await db.insert(rides).values(ride).returning();
    return newRide;
  }

  async getRide(id: string): Promise<Ride | undefined> {
    const [ride] = await db.select().from(rides).where(eq(rides.id, id));
    return ride;
  }

  async getRides(filters: any = {}): Promise<Ride[]> {
    let query = db.select().from(rides);
    
    const conditions = [];
    
    if (filters.fromAddress) {
      conditions.push(like(rides.fromAddress, `%${filters.fromAddress}%`));
    }
    
    if (filters.toAddress) {
      conditions.push(like(rides.toAddress, `%${filters.toAddress}%`));
    }
    
    if (filters.type) {
      conditions.push(eq(rides.type, filters.type));
    }
    
    if (filters.isActive !== undefined) {
      conditions.push(eq(rides.isActive, filters.isActive));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(rides.departureDate));
  }

  async updateRide(id: string, data: Partial<Ride>): Promise<Ride | undefined> {
    const [updated] = await db.update(rides).set(data).where(eq(rides.id, id)).returning();
    return updated;
  }

  async deleteRide(id: string): Promise<boolean> {
    const result = await db.delete(rides).where(eq(rides.id, id));
    return result.rowCount > 0;
  }

  // Accommodations operations
  async createAccommodation(accommodation: typeof accommodations.$inferInsert): Promise<Accommodation> {
    const [newAccommodation] = await db.insert(accommodations).values(accommodation).returning();
    return newAccommodation;
  }

  async getAccommodation(id: string): Promise<Accommodation | undefined> {
    const [accommodation] = await db.select().from(accommodations).where(eq(accommodations.id, id));
    return accommodation;
  }

  async getAccommodations(filters: any = {}): Promise<Accommodation[]> {
    let query = db.select().from(accommodations);
    
    const conditions = [];
    
    if (filters.type) {
      conditions.push(eq(accommodations.type, filters.type));
    }
    
    if (filters.address) {
      conditions.push(like(accommodations.address, `%${filters.address}%`));
    }
    
    if (filters.isAvailable !== undefined) {
      conditions.push(eq(accommodations.isAvailable, filters.isAvailable));
    }
    
    if (filters.minPrice) {
      conditions.push(gte(accommodations.pricePerNight, filters.minPrice));
    }
    
    if (filters.maxPrice) {
      conditions.push(lte(accommodations.pricePerNight, filters.maxPrice));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(accommodations.rating));
  }

  async updateAccommodation(id: string, data: Partial<Accommodation>): Promise<Accommodation | undefined> {
    const [updated] = await db.update(accommodations).set(data).where(eq(accommodations.id, id)).returning();
    return updated;
  }

  async deleteAccommodation(id: string): Promise<boolean> {
    const result = await db.delete(accommodations).where(eq(accommodations.id, id));
    return result.rowCount > 0;
  }

  // Bookings operations
  async createBooking(booking: typeof bookings.$inferInsert): Promise<Booking> {
    const [newBooking] = await db.insert(bookings).values(booking).returning();
    return newBooking;
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return await db.select().from(bookings)
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.createdAt));
  }

  async getProviderBookings(providerId: string): Promise<Booking[]> {
    return await db.select().from(bookings)
      .where(eq(bookings.providerId, providerId))
      .orderBy(desc(bookings.createdAt));
  }

  async updateBooking(id: string, data: Partial<Booking>): Promise<Booking | undefined> {
    const [updated] = await db.update(bookings).set({...data, updatedAt: new Date()}).where(eq(bookings.id, id)).returning();
    return updated;
  }

  // Events operations
  async createEvent(event: typeof events.$inferInsert): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async getEvents(filters: any = {}): Promise<Event[]> {
    let query = db.select().from(events);
    
    const conditions = [];
    
    if (filters.eventType) {
      conditions.push(eq(events.eventType, filters.eventType));
    }
    
    if (filters.category) {
      conditions.push(eq(events.category, filters.category));
    }
    
    if (filters.status) {
      conditions.push(eq(events.status, filters.status));
    }
    
    if (filters.isPublic !== undefined) {
      conditions.push(eq(events.isPublic, filters.isPublic));
    }
    
    if (filters.startDate) {
      conditions.push(gte(events.startDate, filters.startDate));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(asc(events.startDate));
  }

  async updateEvent(id: string, data: Partial<Event>): Promise<Event | undefined> {
    const [updated] = await db.update(events).set({...data, updatedAt: new Date()}).where(eq(events.id, id)).returning();
    return updated;
  }

  async deleteEvent(id: string): Promise<boolean> {
    const result = await db.delete(events).where(eq(events.id, id));
    return result.rowCount > 0;
  }

  // Payments operations
  async createPayment(payment: typeof payments.$inferInsert): Promise<Payment> {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment;
  }

  async getUserPayments(userId: string): Promise<Payment[]> {
    return await db.select().from(payments)
      .where(eq(payments.userId, userId))
      .orderBy(desc(payments.createdAt));
  }

  async updatePayment(id: string, data: Partial<Payment>): Promise<Payment | undefined> {
    const [updated] = await db.update(payments).set({...data, updatedAt: new Date()}).where(eq(payments.id, id)).returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();