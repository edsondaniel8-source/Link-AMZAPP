import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq, and, gte, lte, ilike, sql, desc, asc } from 'drizzle-orm';
import { rides, bookings, users, type Ride, type Booking, type InsertRide, type InsertBooking } from './simplified-schema';

const dbUrl = process.env.DATABASE_URL!;
const client = neon(dbUrl);
const db = drizzle(client);

export interface ISimplifiedStorage {
  // Ride operations
  createRide(ride: InsertRide): Promise<Ride>;
  getRide(id: string): Promise<Ride | undefined>;
  searchRides(filters: RideSearchFilters): Promise<RideWithDriver[]>;
  updateRide(id: string, data: Partial<Ride>): Promise<Ride | undefined>;
  deleteRide(id: string): Promise<boolean>;
  getDriverRides(driverId: string): Promise<Ride[]>;

  // Booking operations  
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: string): Promise<Booking | undefined>;
  getRideBookings(rideId: string): Promise<Booking[]>;
  getUserBookings(userId: string): Promise<Booking[]>;
  updateBooking(id: string, data: Partial<Booking>): Promise<Booking | undefined>;
  cancelBooking(id: string): Promise<boolean>;

  // User operations (basic)
  getUser(id: string): Promise<any>;
}

export interface RideSearchFilters {
  from?: string;
  to?: string;
  date?: string;
  passengers?: number;
  maxPrice?: number;
  vehicleType?: string;
  minRating?: number;
}

export interface RideWithDriver extends Ride {
  driverName: string;
  driverRating: number;
}

export class SimplifiedStorage implements ISimplifiedStorage {
  
  // Ride operations
  async createRide(ride: InsertRide): Promise<Ride> {
    const [newRide] = await db.insert(rides).values(ride).returning();
    return newRide;
  }

  async getRide(id: string): Promise<Ride | undefined> {
    const [ride] = await db.select().from(rides).where(eq(rides.id, id));
    return ride;
  }

  async searchRides(filters: RideSearchFilters): Promise<RideWithDriver[]> {
    const conditions = [];

    if (filters.from) {
      conditions.push(ilike(rides.fromLocation, `%${filters.from}%`));
    }

    if (filters.to) {
      conditions.push(ilike(rides.toLocation, `%${filters.to}%`));
    }

    if (filters.date) {
      conditions.push(eq(rides.departureDate, filters.date));
    }

    if (filters.passengers) {
      conditions.push(gte(rides.availableSeats, filters.passengers));
    }

    if (filters.maxPrice) {
      conditions.push(lte(rides.pricePerSeat, sql`${filters.maxPrice}`));
    }

    if (filters.vehicleType) {
      conditions.push(eq(rides.vehicleType, filters.vehicleType));
    }

    // Always filter for active rides
    conditions.push(eq(rides.status, 'active'));

    let query = db
      .select({
        id: rides.id,
        driverId: rides.driverId,
        fromLocation: rides.fromLocation,
        toLocation: rides.toLocation,
        departureDate: rides.departureDate,
        departureTime: rides.departureTime,
        availableSeats: rides.availableSeats,
        pricePerSeat: rides.pricePerSeat,
        vehicleType: rides.vehicleType,
        additionalInfo: rides.additionalInfo,
        status: rides.status,
        createdAt: rides.createdAt,
        driverName: users.name,
        driverRating: users.rating,
      })
      .from(rides)
      .leftJoin(users, eq(rides.driverId, users.id));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Filter by minimum rating if specified
    if (filters.minRating) {
      query = query.where(gte(users.rating, sql`${filters.minRating}`));
    }

    const results = await query.orderBy(asc(rides.departureTime), asc(rides.pricePerSeat));
    
    return results.map(row => ({
      ...row,
      driverName: row.driverName || 'Motorista',
      driverRating: Number(row.driverRating) || 0,
    })) as RideWithDriver[];
  }

  async updateRide(id: string, data: Partial<Ride>): Promise<Ride | undefined> {
    const [updated] = await db.update(rides).set(data).where(eq(rides.id, id)).returning();
    return updated;
  }

  async deleteRide(id: string): Promise<boolean> {
    const result = await db.delete(rides).where(eq(rides.id, id));
    return result.rowCount > 0;
  }

  async getDriverRides(driverId: string): Promise<Ride[]> {
    return await db.select().from(rides)
      .where(eq(rides.driverId, driverId))
      .orderBy(desc(rides.createdAt));
  }

  // Booking operations
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db.insert(bookings).values(booking).returning();
    return newBooking;
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async getRideBookings(rideId: string): Promise<Booking[]> {
    return await db.select().from(bookings)
      .where(eq(bookings.rideId, rideId))
      .orderBy(desc(bookings.createdAt));
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return await db.select().from(bookings)
      .where(eq(bookings.passengerId, userId))
      .orderBy(desc(bookings.createdAt));
  }

  async updateBooking(id: string, data: Partial<Booking>): Promise<Booking | undefined> {
    const [updated] = await db.update(bookings).set(data).where(eq(bookings.id, id)).returning();
    return updated;
  }

  async cancelBooking(id: string): Promise<boolean> {
    const [updated] = await db.update(bookings)
      .set({ status: 'cancelled' })
      .where(eq(bookings.id, id))
      .returning();
    return !!updated;
  }

  // User operations (basic for compatibility)
  async getUser(id: string): Promise<any> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
}

export const simplifiedStorage = new SimplifiedStorage();