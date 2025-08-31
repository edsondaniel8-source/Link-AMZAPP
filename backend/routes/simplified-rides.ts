import express from 'express';
import { z } from 'zod';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq, and, gte, lte, ilike, sql, desc, asc } from 'drizzle-orm';
import { rides, bookings, users } from '../shared/schema';

const router = express.Router();
const dbUrl = process.env.DATABASE_URL!;
const client = neon(dbUrl);
const db = drizzle(client);

// Search rides with advanced filtering
router.get('/search', async (req, res) => {
  try {
    const { from, to, date, passengers, maxPrice, vehicleType, minRating } = req.query;
    
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
      conditions.push(eq(rides.vehicleInfo, vehicleType as string));
    }
    
    // Always filter for active rides
    conditions.push(eq(rides.isActive, true));
    
    // Build the query with driver information
    let query = db
      .select({
        id: rides.id,
        driverId: rides.driverId,
        fromAddress: rides.fromAddress,
        toAddress: rides.toAddress,
        departureDate: rides.departureDate,
        price: rides.price,
        availableSeats: rides.availableSeats,
        vehicleInfo: rides.vehicleInfo,
        driverName: rides.driverName,
        driverRating: users.rating,
        estimatedDuration: rides.estimatedDuration,
        estimatedDistance: rides.estimatedDistance,
      })
      .from(rides)
      .leftJoin(users, eq(rides.driverId, users.id));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    // Apply minimum rating filter if specified
    if (minRating) {
      query = query.where(gte(users.rating, sql`${parseFloat(minRating as string)}`));
    }
    
    const results = await query.orderBy(asc(rides.departureDate), asc(rides.price));
    
    // Filter results with additional logic (distance, driver rating, etc.)
    const filteredResults = results.filter(ride => {
      // Driver rating filter (minimum 4.0 for good drivers)
      const driverRating = Number(ride.driverRating) || 0;
      return driverRating >= (minRating ? parseFloat(minRating as string) : 4.0);
    });
    
    res.json({ 
      rides: filteredResults,
      total: filteredResults.length,
      filters: { from, to, date, passengers, maxPrice, vehicleType, minRating }
    });
    
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search rides' });
  }
});

// Create new ride (for drivers)
router.post('/create', async (req, res) => {
  try {
    const rideData = z.object({
      driverId: z.string(),
      fromAddress: z.string(),
      toAddress: z.string(),
      departureDate: z.string().transform(str => new Date(str)),
      price: z.number().positive(),
      availableSeats: z.number().int().positive(),
      vehicleInfo: z.string().optional(),
      estimatedDuration: z.number().optional(),
      driverName: z.string(),
    }).parse(req.body);
    
    const [newRide] = await db.insert(rides).values({
      ...rideData,
      isActive: true,
      type: 'regular', // Default type
    }).returning();
    
    res.status(201).json({ ride: newRide });
    
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
    
    res.json({ rides: driverRides });
    
  } catch (error) {
    console.error('Get driver rides error:', error);
    res.status(500).json({ error: 'Failed to get driver rides' });
  }
});

// Book a ride (for passengers)
router.post('/:rideId/book', async (req, res) => {
  try {
    const { rideId } = req.params;
    const bookingData = z.object({
      passengerId: z.string(),
      seatsRequested: z.number().int().positive(),
    }).parse(req.body);
    
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
    
    // Create booking (using existing booking schema for compatibility)
    const [newBooking] = await db.insert(bookings).values({
      rideId: rideId,
      userId: bookingData.passengerId,
      type: 'ride',
      status: 'pending_approval',
      providerId: ride.driverId,
      originalPrice: sql`${totalPrice}`,
      totalPrice: sql`${totalPrice}`,
    }).returning();
    
    // Update available seats
    await db.update(rides)
      .set({ availableSeats: ride.availableSeats - bookingData.seatsRequested })
      .where(eq(rides.id, rideId));
    
    res.status(201).json({ booking: newBooking });
    
  } catch (error) {
    console.error('Book ride error:', error);
    res.status(400).json({ error: 'Failed to book ride' });
  }
});

export default router;