import express from 'express';
import { z } from 'zod';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq, and, gte, lte, ilike, sql, desc, asc } from 'drizzle-orm';
import { rides, bookings, users } from '../shared/schema';

const router = express.Router();

// Initialize database connection
const dbUrl = process.env.DATABASE_URL!;
const client = neon(dbUrl);
const db = drizzle(client);

// Advanced ride search endpoint with PostgreSQL queries
router.get('/search', async (req, res) => {
  try {
    const { from, to, date, passengers, maxPrice, vehicleType } = req.query;
    
    // Build query conditions
    const conditions = [];
    
    if (from) {
      conditions.push(ilike(rides.fromAddress, `%${from}%`));
    }
    
    if (to) {
      conditions.push(ilike(rides.toAddress, `%${to}%`));
    }
    
    if (date) {
      conditions.push(eq(rides.departureDate, new Date(date as string)));
    }
    
    if (passengers) {
      conditions.push(gte(rides.availableSeats, parseInt(passengers as string)));
    }
    
    if (maxPrice) {
      conditions.push(lte(rides.price, sql`${parseFloat(maxPrice as string)}`));
    }
    
    if (vehicleType) {
      conditions.push(ilike(rides.vehicleInfo, `%${vehicleType}%`));
    }
    
    // Always filter for active rides
    conditions.push(eq(rides.isActive, true));
    
    // Build the advanced search query with JOIN for driver information
    let query = db
      .select({
        id: rides.id,
        type: rides.type,
        fromAddress: rides.fromAddress,
        toAddress: rides.toAddress,
        departureDate: rides.departureDate,
        price: rides.price,
        availableSeats: rides.availableSeats,
        vehicleInfo: rides.vehicleInfo,
        driverName: rides.driverName,
        driverId: rides.driverId,
        estimatedDuration: rides.estimatedDuration,
        estimatedDistance: rides.estimatedDistance,
        // Driver information from users table
        driverRating: users.rating,
        driverPhone: users.phone,
        driverVerified: users.isVerified,
      })
      .from(rides)
      .leftJoin(users, eq(rides.driverId, users.id));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    const results = await query.orderBy(asc(rides.departureDate), asc(rides.price));
    
    // Advanced filtering: distance-based and driver ratings
    const filteredResults = results.filter(ride => {
      // Filter by driver rating (minimum 4.0 for quality drivers)
      const driverRating = Number(ride.driverRating) || 0;
      return driverRating >= 4.0;
    });
    
    res.json({ 
      rides: filteredResults,
      total: filteredResults.length,
      filters: { from, to, date, passengers, maxPrice, vehicleType },
      message: `Found ${filteredResults.length} rides with advanced filtering`
    });
    
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search rides' });
  }
});

// Create new ride (for drivers)
router.post('/create', async (req, res) => {
  try {
    const rideSchema = z.object({
      driverId: z.string(),
      fromAddress: z.string(),
      toAddress: z.string(),
      departureDate: z.string().transform(str => new Date(str)),
      price: z.number().positive(),
      availableSeats: z.number().int().positive(),
      vehicleInfo: z.string().optional(),
      driverName: z.string(),
    });
    
    const rideData = rideSchema.parse(req.body);
    
    const [newRide] = await db.insert(rides).values({
      ...rideData,
      type: 'regular',
      isActive: true,
      maxPassengers: rideData.availableSeats,
    }).returning();
    
    res.status(201).json({ 
      ride: newRide,
      message: 'Ride created successfully'
    });
    
  } catch (error) {
    console.error('Create ride error:', error);
    res.status(400).json({ error: 'Failed to create ride' });
  }
});

// Get rides for a specific driver
router.get('/driver/:driverId', async (req, res) => {
  try {
    const { driverId } = req.params;
    
    const driverRides = await db
      .select()
      .from(rides)
      .where(eq(rides.driverId, driverId))
      .orderBy(desc(rides.departureDate));
    
    res.json({ 
      rides: driverRides,
      total: driverRides.length
    });
    
  } catch (error) {
    console.error('Get driver rides error:', error);
    res.status(500).json({ error: 'Failed to get driver rides' });
  }
});

// Book a ride (simplified booking)
router.post('/:rideId/book', async (req, res) => {
  try {
    const { rideId } = req.params;
    const bookingSchema = z.object({
      passengerId: z.string(),
      seatsRequested: z.number().int().positive(),
    });
    
    const bookingData = bookingSchema.parse(req.body);
    
    // Check if ride exists and has available seats
    const [ride] = await db.select().from(rides).where(eq(rides.id, rideId));
    
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }
    
    if (ride.availableSeats < bookingData.seatsRequested) {
      return res.status(400).json({ error: 'Not enough seats available' });
    }
    
    // Calculate total price
    const totalPrice = Number(ride.price) * bookingData.seatsRequested;
    
    // Create booking using existing schema
    const [newBooking] = await db.insert(bookings).values({
      rideId: rideId,
      userId: bookingData.passengerId,
      type: 'ride',
      status: 'pending',
      totalPrice: sql`${totalPrice}`,
    }).returning();
    
    // Update available seats
    await db.update(rides)
      .set({ availableSeats: ride.availableSeats - bookingData.seatsRequested })
      .where(eq(rides.id, rideId));
    
    res.status(201).json({ 
      booking: newBooking,
      message: 'Booking created successfully'
    });
    
  } catch (error) {
    console.error('Book ride error:', error);
    res.status(400).json({ error: 'Failed to book ride' });
  }
});

// Get all bookings for a ride
router.get('/:rideId/bookings', async (req, res) => {
  try {
    const { rideId } = req.params;
    
    const rideBookings = await db
      .select({
        id: bookings.id,
        passengerId: bookings.userId,
        status: bookings.status,
        totalPrice: bookings.totalPrice,
        createdAt: bookings.createdAt,
        passengerName: sql<string>`CONCAT(${users.firstName}, ' ', ${users.lastName})`,
        passengerPhone: users.phone,
      })
      .from(bookings)
      .leftJoin(users, eq(bookings.userId, users.id))
      .where(and(
        eq(bookings.rideId, rideId),
        eq(bookings.type, 'ride')
      ))
      .orderBy(desc(bookings.createdAt));
    
    res.json({ 
      bookings: rideBookings,
      total: rideBookings.length
    });
    
  } catch (error) {
    console.error('Get ride bookings error:', error);
    res.status(500).json({ error: 'Failed to get ride bookings' });
  }
});

export default router;