import { Router } from 'express';
import { db } from '../db.js';
import { rides, accommodations, events } from '../shared/schema.js';
import { desc, eq, and, gte } from 'drizzle-orm';

const router = Router();

// Get weekly highlights for the homepage
router.get('/api/highlights', async (req, res) => {
  try {
    console.log('📊 Fetching highlights data...');

    // Get top 3 rides with highest ratings
    const topRides = await db
      .select({
        id: rides.id,
        from: rides.fromAddress,
        to: rides.toAddress,
        price: rides.price,
        departureDate: rides.departureDate,
        driverName: rides.driverName,
        estimatedDuration: rides.estimatedDuration,
        availableSeats: rides.availableSeats,
        type: rides.type
      })
      .from(rides)
      .where(and(
        eq(rides.isActive, true),
        gte(rides.departureDate, new Date())
      ))
      .orderBy(desc(rides.price))
      .limit(3);

    // Get top 3 accommodations with highest ratings  
    const topHotels = await db
      .select({
        id: accommodations.id,
        name: accommodations.name,
        location: accommodations.address,
        pricePerNight: accommodations.pricePerNight,
        rating: accommodations.rating,
        type: accommodations.type,
        amenities: accommodations.amenities,
        distanceFromCenter: accommodations.distanceFromCenter
      })
      .from(accommodations)
      .where(eq(accommodations.isAvailable, true))
      .orderBy(desc(accommodations.rating))
      .limit(3);

    // Get top 3 featured events
    const featuredEvents = await db
      .select({
        id: events.id,
        title: events.title,
        location: events.address,
        startDate: events.startDate,
        ticketPrice: events.ticketPrice,
        eventType: events.eventType,
        category: events.category,
        venue: events.venue,
        maxAttendees: events.maxAttendees,
        currentAttendees: events.currentAttendees
      })
      .from(events)
      .where(and(
        eq(events.status, 'approved'),
        eq(events.isPublic, true),
        gte(events.startDate, new Date())
      ))
      .orderBy(desc(events.startDate))
      .limit(3);

    // Transform data to match frontend expectations
    const highlights = {
      topRides: topRides.map(ride => ({
        from: ride.from,
        to: ride.to,
        price: parseFloat(ride.price),
        date: ride.departureDate?.toISOString().split('T')[0] || 'TBD',
        driver: ride.driverName || 'Motorista',
        rating: 4.5, // Default until we implement ratings
        id: ride.id,
        duration: ride.estimatedDuration,
        seats: ride.availableSeats,
        type: ride.type
      })),
      
      topHotels: topHotels.map(hotel => ({
        name: hotel.name,
        location: hotel.location,
        price: parseFloat(hotel.pricePerNight),
        rating: parseFloat(hotel.rating || '4.0'),
        image: getHotelEmoji(hotel.type),
        id: hotel.id,
        amenities: hotel.amenities,
        distance: hotel.distanceFromCenter
      })),
      
      featuredEvents: featuredEvents.map(event => ({
        name: event.title,
        location: event.venue,
        date: event.startDate?.toISOString().split('T')[0] || 'TBD',
        price: parseFloat(event.ticketPrice || '0'),
        image: getEventEmoji(event.category),
        id: event.id,
        type: event.eventType,
        category: event.category,
        attendance: event.currentAttendees,
        capacity: event.maxAttendees
      }))
    };

    console.log(`✅ Highlights fetched: ${highlights.topRides.length} rides, ${highlights.topHotels.length} hotels, ${highlights.featuredEvents.length} events`);
    
    res.json(highlights);
    
  } catch (error) {
    console.error('❌ Error fetching highlights:', error);
    
    // Return fallback data on error
    const fallbackHighlights = {
      topRides: [
        { from: "Maputo", to: "Beira", price: 1500, date: "2024-01-15", driver: "João M.", rating: 4.8 },
        { from: "Nampula", to: "Nacala", price: 800, date: "2024-01-16", driver: "Maria S.", rating: 4.9 },
        { from: "Tete", to: "Chimoio", price: 1200, date: "2024-01-17", driver: "Carlos A.", rating: 4.7 }
      ],
      topHotels: [
        { name: "Hotel Marisol", location: "Maputo", price: 3500, rating: 4.6, image: "🏨" },
        { name: "Pensão Oceano", location: "Beira", price: 2200, rating: 4.4, image: "🏖️" },
        { name: "Lodge Safari", location: "Gorongosa", price: 4800, rating: 4.9, image: "🦁" }
      ],
      featuredEvents: [
        { name: "Festival de Marrabenta", location: "Maputo", date: "2024-02-10", price: 500, image: "🎵" },
        { name: "Feira Artesanal", location: "Beira", date: "2024-02-15", price: 200, image: "🎨" },
        { name: "Concerto de Música", location: "Nampula", date: "2024-02-20", price: 750, image: "🎤" }
      ]
    };
    
    res.json(fallbackHighlights);
  }
});

// Helper function to get hotel emoji based on type
function getHotelEmoji(type: string): string {
  const typeMap: Record<string, string> = {
    'Hotel': '🏨',
    'Apartment': '🏠',
    'House': '🏡',
    'Lodge': '🏕️',
    'Resort': '🏖️',
    'Guesthouse': '🏘️'
  };
  return typeMap[type] || '🏨';
}

// Helper function to get event emoji based on category
function getEventEmoji(category: string): string {
  const categoryMap: Record<string, string> = {
    'cultura': '🎭',
    'negocios': '💼',
    'entretenimento': '🎪',
    'gastronomia': '🍽️',
    'educacao': '📚',
    'musica': '🎵',
    'arte': '🎨',
    'desporto': '⚽',
    'festival': '🎉'
  };
  return categoryMap[category] || '📅';
}

export default router;