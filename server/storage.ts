import { type User, type InsertUser, type Ride, type InsertRide, type Accommodation, type InsertAccommodation, type Booking, type InsertBooking } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Ride operations
  searchRides(from: string, to: string): Promise<Ride[]>;
  getRide(id: string): Promise<Ride | undefined>;
  createRide(ride: InsertRide): Promise<Ride>;
  
  // Accommodation operations
  searchAccommodations(location: string, checkIn?: Date, checkOut?: Date): Promise<Accommodation[]>;
  getAccommodation(id: string): Promise<Accommodation | undefined>;
  createAccommodation(accommodation: InsertAccommodation): Promise<Accommodation>;
  
  // Booking operations
  getBooking(id: string): Promise<Booking | undefined>;
  getUserBookings(userId: string): Promise<Booking[]>;
  getProviderBookings(providerId: string): Promise<Booking[]>; // For drivers/hosts/organizers
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: string, status: string, details?: any): Promise<Booking | undefined>;
  approveBooking(bookingId: string, providerId: string): Promise<Booking | undefined>;
  rejectBooking(bookingId: string, providerId: string, reason: string): Promise<Booking | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private rides: Map<string, Ride>;
  private accommodations: Map<string, Accommodation>;
  private bookings: Map<string, Booking>;

  constructor() {
    this.users = new Map();
    this.rides = new Map();
    this.accommodations = new Map();
    this.bookings = new Map();
    
    // Initialize with all mock data including rides and accommodations
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock rides data - 10 trips from Maputo to all Mozambique provinces
    const mockRides: Ride[] = [
      {
        id: "ride-1",
        type: "Econômico",
        fromAddress: "Maputo Centro",
        toAddress: "Beira, Sofala",
        fromLat: "-25.9692",
        fromLng: "32.5732",
        toLat: "-19.8433",
        toLng: "34.8517",
        price: "2500.00", // ~530km trip
        estimatedDuration: 420, // 7 hours
        estimatedDistance: "530.0",
        availableIn: 60,
        driverName: "Carlos Matsinhe",
        vehicleInfo: "Toyota Hiace - AAA 123 MP",
        maxPassengers: 14,
        availableSeats: 8,
        departureDate: new Date("2025-08-30T06:00:00"),
        route: ["Maputo", "Xai-Xai", "Maxixe", "Inhambane", "Vilanculos", "Beira"],
        allowPickupEnRoute: true,
        allowNegotiation: false,
        isRoundTrip: false,
        returnDate: null,
        returnDepartureTime: null,
        minPrice: null,
        maxPrice: null,
        isActive: true,
      },
      {
        id: "ride-2", 
        type: "Conforto",
        fromAddress: "Maputo Centro",
        toAddress: "Nampula, Nampula",
        fromLat: "-25.9692",
        fromLng: "32.5732",
        toLat: "-15.1165",
        toLng: "39.2666",
        price: "4200.00", // ~1800km trip
        estimatedDuration: 1080, // 18 hours
        estimatedDistance: "1800.0",
        availableIn: 120,
        driverName: "Maria Nhachungue",
        vehicleInfo: "Mercedes Sprinter - BBB 456 MP",
        maxPassengers: 20,
        availableSeats: 12,
        departureDate: new Date("2025-08-30T20:00:00"),
        route: ["Maputo", "Beira", "Quelimane", "Mocuba", "Nampula"],
        allowPickupEnRoute: true,
        allowNegotiation: false,
        isRoundTrip: false,
        returnDate: null,
        returnDepartureTime: null,
        minPrice: null,
        maxPrice: null,
        isActive: true,
      },
      {
        id: "ride-3",
        type: "Econômico",
        fromAddress: "Maputo Centro", 
        toAddress: "Chimoio, Manica",
        fromLat: "-25.9692",
        fromLng: "32.5732",
        toLat: "-19.1165",
        toLng: "33.4833",
        price: "1800.00", // ~400km trip
        estimatedDuration: 300, // 5 hours
        estimatedDistance: "400.0",
        availableIn: 45,
        driverName: "João Tembe",
        vehicleInfo: "Toyota Quantum - CCC 789 MP",
        maxPassengers: 16,
        availableSeats: 10,
        departureDate: new Date("2025-08-30T07:30:00"),
        route: ["Maputo", "Ressano Garcia", "Machipanda", "Chimoio"],
        allowPickupEnRoute: false,
        allowNegotiation: true,
        isRoundTrip: false,
        returnDate: null,
        returnDepartureTime: null,
        minPrice: "1600.00",
        maxPrice: "2000.00",
        isActive: true,
      },
      {
        id: "ride-4",
        type: "Executivo",
        fromAddress: "Maputo Centro",
        toAddress: "Pemba, Cabo Delgado", 
        fromLat: "-25.9692",
        fromLng: "32.5732",
        toLat: "-12.9745",
        toLng: "40.5178",
        price: "5500.00", // ~2100km trip
        estimatedDuration: 1260, // 21 hours
        estimatedDistance: "2100.0",
        availableIn: 180,
        driverName: "Ana Macuácua",
        vehicleInfo: "Scania Bus - DDD 012 MP",
        maxPassengers: 45,
        availableSeats: 28,
        departureDate: new Date("2025-08-30T18:00:00"),
        route: ["Maputo", "Beira", "Quelimane", "Nampula", "Nacala", "Pemba"],
        allowPickupEnRoute: true,
        allowNegotiation: false,
        isRoundTrip: false,
        returnDate: null,
        returnDepartureTime: null,
        minPrice: null,
        maxPrice: null,
        isActive: true,
      },
      {
        id: "ride-5",
        type: "Conforto",
        fromAddress: "Maputo Centro",
        toAddress: "Tete, Tete",
        fromLat: "-25.9692", 
        fromLng: "32.5732",
        toLat: "-16.1564",
        toLng: "33.5867",
        price: "3200.00", // ~900km trip
        estimatedDuration: 540, // 9 hours
        estimatedDistance: "900.0",
        availableIn: 90,
        driverName: "Pedro Sitoe",
        vehicleInfo: "Iveco Daily - EEE 345 MP",
        maxPassengers: 19,
        availableSeats: 11,
        departureDate: new Date("2025-08-30T05:00:00"),
        route: ["Maputo", "Beira", "Chimoio", "Tete"],
        allowPickupEnRoute: true,
        allowNegotiation: true,
        isRoundTrip: false,
        returnDate: null,
        returnDepartureTime: null,
        minPrice: "2800.00",
        maxPrice: "3600.00",
        isActive: true,
      },
      {
        id: "ride-6",
        type: "Econômico",
        fromAddress: "Maputo Centro",
        toAddress: "Xai-Xai, Gaza",
        fromLat: "-25.9692",
        fromLng: "32.5732",
        toLat: "-25.0519",
        toLng: "33.6442",
        price: "800.00", // ~220km trip
        estimatedDuration: 150, // 2.5 hours
        estimatedDistance: "220.0",
        availableIn: 30,
        driverName: "Lurdes Cossa",
        vehicleInfo: "Toyota Hiace - FFF 678 MP",
        maxPassengers: 14,
        availableSeats: 7,
        departureDate: new Date("2025-08-30T14:00:00"),
        route: ["Maputo", "Boane", "Manhiça", "Xai-Xai"],
        allowPickupEnRoute: true,
        allowNegotiation: false,
        isRoundTrip: false,
        returnDate: null,
        returnDepartureTime: null,
        minPrice: null,
        maxPrice: null,
        isActive: true,
      },
      {
        id: "ride-7",
        type: "Conforto", 
        fromAddress: "Maputo Centro",
        toAddress: "Inhambane, Inhambane",
        fromLat: "-25.9692",
        fromLng: "32.5732",
        toLat: "-23.8650",
        toLng: "35.3833",
        price: "1500.00", // ~470km trip
        estimatedDuration: 330, // 5.5 hours
        estimatedDistance: "470.0",
        availableIn: 75,
        driverName: "Alfredo Chissano",
        vehicleInfo: "Mercedes Vito - GGG 901 MP",
        maxPassengers: 8,
        availableSeats: 4,
        departureDate: new Date("2025-08-30T08:00:00"),
        route: ["Maputo", "Xai-Xai", "Maxixe", "Inhambane"],
        allowPickupEnRoute: true,
        allowNegotiation: false,
        isRoundTrip: false,
        returnDate: null,
        returnDepartureTime: null,
        minPrice: null,
        maxPrice: null,
        isActive: true,
      },
      {
        id: "ride-8",
        type: "Executivo",
        fromAddress: "Maputo Centro",
        toAddress: "Quelimane, Zambézia",
        fromLat: "-25.9692",
        fromLng: "32.5732", 
        toLat: "-17.8786",
        toLng: "36.8883",
        price: "3800.00", // ~1200km trip
        estimatedDuration: 720, // 12 hours
        estimatedDistance: "1200.0",
        availableIn: 150,
        driverName: "Isabel Mabunda",
        vehicleInfo: "Volvo Bus - HHH 234 MP",
        maxPassengers: 50,
        availableSeats: 32,
        departureDate: new Date("2025-08-30T19:30:00"),
        route: ["Maputo", "Beira", "Gorongosa", "Caia", "Quelimane"],
        allowPickupEnRoute: true,
        allowNegotiation: false,
        isRoundTrip: false,
        returnDate: null,
        returnDepartureTime: null,
        minPrice: null,
        maxPrice: null,
        isActive: true,
      },
      {
        id: "ride-9",
        type: "Econômico",
        fromAddress: "Maputo Centro",
        toAddress: "Lichinga, Niassa",
        fromLat: "-25.9692",
        fromLng: "32.5732",
        toLat: "-13.3133",
        toLng: "35.2406",
        price: "4800.00", // ~1900km trip
        estimatedDuration: 1140, // 19 hours
        estimatedDistance: "1900.0",
        availableIn: 240,
        driverName: "Tomás Machel",
        vehicleInfo: "Mercedes O500 - III 567 MP",
        maxPassengers: 55,
        availableSeats: 38,
        departureDate: new Date("2025-08-30T04:00:00"),
        route: ["Maputo", "Beira", "Nampula", "Cuamba", "Lichinga"],
        allowPickupEnRoute: true,
        allowNegotiation: false,
        isRoundTrip: false,
        returnDate: null,
        returnDepartureTime: null,
        minPrice: null,
        maxPrice: null,
        isActive: true,
      },
      {
        id: "ride-10",
        type: "Conforto",
        fromAddress: "Maputo Centro", 
        toAddress: "Matola, Maputo Província",
        fromLat: "-25.9692",
        fromLng: "32.5732",
        toLat: "-25.9623",
        toLng: "32.4589",
        price: "150.00", // ~15km trip
        estimatedDuration: 25, // 25 minutes
        estimatedDistance: "15.0",
        availableIn: 10,
        driverName: "Sérgio Manjate",
        vehicleInfo: "Toyota Avanza - JJJ 890 MP",
        maxPassengers: 7,
        availableSeats: 3,
        departureDate: new Date("2025-08-30T16:30:00"),
        route: ["Maputo Centro", "Matola Rio", "Matola"],
        allowPickupEnRoute: true,
        allowNegotiation: false,
        isRoundTrip: false,
        returnDate: null,
        returnDepartureTime: null,
        minPrice: null,
        maxPrice: null,
        isActive: true,
      },
      // NEW TRIP: Baião, Matola to Maxixe
      {
        id: "ride-11",
        type: "Econômico",
        fromAddress: "Baião, Matola",
        toAddress: "Maxixe, Inhambane",
        fromLat: "-25.9623",
        fromLng: "32.4589",
        toLat: "-23.8589",
        toLng: "35.3472",
        price: "1200.00", // ~450km trip
        estimatedDuration: 360, // 6 hours
        estimatedDistance: "450.0",
        availableIn: 90,
        driverName: "Fernando Mucavele",
        vehicleInfo: "Toyota Hiace - KKK 123 MP",
        maxPassengers: 14,
        availableSeats: 9,
        departureDate: new Date("2025-08-30T06:30:00"),
        route: ["Baião", "Maputo", "Xai-Xai", "Maxixe"],
        allowPickupEnRoute: true,
        allowNegotiation: true,
        isRoundTrip: false,
        returnDate: null,
        returnDepartureTime: null,
        minPrice: "1000.00",
        maxPrice: "1400.00",
        isActive: true,
      },
    ];

    // Mock accommodations data - 5 Mozambican accommodations
    const mockAccommodations: Accommodation[] = [
      {
        id: "acc-1",
        name: "Hotel Polana Serena",
        type: "Hotel",
        address: "Maputo Centro • 0.5 km do centro",
        lat: "-25.9655",
        lng: "32.5790",
        pricePerNight: "8500.00",
        rating: "4.9",
        reviewCount: 342,
        images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945"],
        amenities: ["WiFi", "Piscina", "Ginásio", "Restaurante", "Spa", "Vista para o Mar"],
        description: "Hotel de luxo icônico no coração de Maputo com vista para a Baía",
        distanceFromCenter: "0.5",
        isAvailable: true,
        offerDriverDiscounts: true,
        driverDiscountRate: "15.00",
        minimumDriverLevel: "gold",
        partnershipBadgeVisible: true,
      },
      {
        id: "acc-2",
        name: "Hotel Beira-Mar",
        type: "Hotel",
        address: "Inhambane Centro • 1.2 km do centro",
        lat: "-23.8650",
        lng: "35.3833",
        pricePerNight: "3500.00",
        rating: "4.6",
        reviewCount: 198,
        images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4"],
        amenities: ["WiFi", "Pequeno-almoço", "Estacionamento", "Vista para o Mar"],
        description: "Hotel acolhedor com vista para a baía de Inhambane",
        distanceFromCenter: "1.2",
        isAvailable: true,
        offerDriverDiscounts: true,
        driverDiscountRate: "12.00",
        minimumDriverLevel: "silver",
        partnershipBadgeVisible: true,
      },
      {
        id: "acc-3",
        name: "Casa Banana Lodge",
        type: "Pousada",
        address: "Vilanculos • 2.5 km do centro",
        lat: "-22.0189",
        lng: "35.3111",
        pricePerNight: "4800.00",
        rating: "4.7",
        reviewCount: 256,
        images: ["https://images.unsplash.com/photo-1578683010236-d716f9a3f461"],
        amenities: ["WiFi", "Piscina", "Bar", "Mergulho", "Passeios de Barco"],
        description: "Lodge tropical com acesso direto às praias paradisíacas",
        distanceFromCenter: "2.5",
        isAvailable: true,
        offerDriverDiscounts: false,
        driverDiscountRate: "0.00",
        minimumDriverLevel: "bronze",
        partnershipBadgeVisible: false,
      },
      {
        id: "acc-4",
        name: "Apartamento Marginal",
        type: "Apartamento",
        address: "Maputo Marginal • 1.8 km do centro",
        lat: "-25.9598",
        lng: "32.5856",
        pricePerNight: "2800.00",
        rating: "4.5",
        reviewCount: 89,
        images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"],
        amenities: ["WiFi", "Cozinha", "Varanda", "Vista para o Mar", "Ar Condicionado"],
        description: "Apartamento moderno na Marginal com vista panorâmica",
        distanceFromCenter: "1.8",
        isAvailable: true,
        offerDriverDiscounts: true,
        driverDiscountRate: "10.00",
        minimumDriverLevel: "bronze",
        partnershipBadgeVisible: true,
      },
      {
        id: "acc-5",
        name: "Hotel Tivoli Beira",
        type: "Hotel",
        address: "Beira Centro • 0.8 km do centro",
        lat: "-19.8433",
        lng: "34.8517",
        pricePerNight: "5200.00",
        rating: "4.4",
        reviewCount: 287,
        images: ["https://images.unsplash.com/photo-1564501049412-61c2a3083791"],
        amenities: ["WiFi", "Restaurante", "Bar", "Ginásio", "Centro de Negócios"],
        description: "Hotel business no centro de Beira com todas as comodidades",
        distanceFromCenter: "0.8",
        isAvailable: true,
        offerDriverDiscounts: true,
        driverDiscountRate: "20.00",
        minimumDriverLevel: "platinum",
        partnershipBadgeVisible: true,
      },
    ];

    // Mock events data - 2 upcoming events
    const mockEvents = [
      {
        id: "event-1",
        name: "Festival de Marrabenta",
        type: "Cultural",
        description: "Festival anual de música tradicional moçambicana com artistas nacionais e internacionais",
        location: "Centro Cultural Franco-Moçambicano, Maputo",
        lat: "-25.9655",
        lng: "32.5790",
        startDate: new Date("2025-08-30T18:00:00"),
        endDate: new Date("2025-08-31T23:00:00"),
        price: "1500.00",
        isActive: true,
        isFree: false,
        maxAttendees: 2000,
        currentAttendees: 450,
        organizerId: "org-1",
        images: ["https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f"],
        amenities: ["Bar", "Food Court", "Estacionamento", "Segurança"],
      },
      {
        id: "event-2", 
        name: "Feira de Artesanato de Inhambane",
        type: "Comercial",
        description: "Feira gratuita de artesanato local com produtos tradicionais moçambicanos",
        location: "Mercado Central de Inhambane",
        lat: "-23.8650",
        lng: "35.3833",
        startDate: new Date("2025-08-30T08:00:00"),
        endDate: new Date("2025-09-02T18:00:00"),
        price: "0.00",
        isActive: true,
        isFree: true,
        maxAttendees: 5000,
        currentAttendees: 1200,
        organizerId: "org-2",
        images: ["https://images.unsplash.com/photo-1441986300917-64674bd600d8"],
        amenities: ["Food Court", "Estacionamento", "WC Público", "Primeiros Socorros"],
      },
    ];

    mockRides.forEach(ride => this.rides.set(ride.id, ride));
    mockAccommodations.forEach(acc => this.accommodations.set(acc.id, acc));
    
    // Initialize events if events storage exists (for future implementation)
    // mockEvents.forEach(event => this.events?.set(event.id, event));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async searchRides(from: string, to: string): Promise<Ride[]> {
    return Array.from(this.rides.values()).filter(ride => ride.isActive);
  }

  async getRide(id: string): Promise<Ride | undefined> {
    return this.rides.get(id);
  }

  async createRide(insertRide: InsertRide): Promise<Ride> {
    const id = randomUUID();
    const ride: Ride = { ...insertRide, id };
    this.rides.set(id, ride);
    return ride;
  }

  async searchAccommodations(location: string, checkIn?: Date, checkOut?: Date): Promise<Accommodation[]> {
    return Array.from(this.accommodations.values()).filter(acc => acc.isAvailable);
  }

  async getAccommodation(id: string): Promise<Accommodation | undefined> {
    return this.accommodations.get(id);
  }

  async createAccommodation(insertAccommodation: InsertAccommodation): Promise<Accommodation> {
    const id = randomUUID();
    const accommodation: Accommodation = { ...insertAccommodation, id };
    this.accommodations.set(id, accommodation);
    return accommodation;
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => booking.userId === userId);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    
    // Determine provider based on booking type
    let providerId = null;
    if (insertBooking.type === "ride" && insertBooking.rideId) {
      const ride = this.rides.get(insertBooking.rideId);
      providerId = ride?.driverId || null;
    } else if (insertBooking.type === "stay" && insertBooking.accommodationId) {
      const accommodation = this.accommodations.get(insertBooking.accommodationId);
      providerId = accommodation?.hostId || null;
    } else if (insertBooking.type === "event" && insertBooking.eventId) {
      // For events, we'll need to look up the event organizer
      // For now, we'll set a placeholder
      providerId = "event-organizer-" + insertBooking.eventId;
    }
    
    const booking: Booking = { 
      ...insertBooking, 
      id, 
      providerId,
      status: "pending_approval",
      requestedAt: new Date(),
      customerNotified: false,
      providerNotified: false,
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBookingStatus(id: string, status: string, details?: any): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (booking) {
      booking.status = status;
      booking.updatedAt = new Date();
      if (details) {
        Object.assign(booking, details);
      }
      this.bookings.set(id, booking);
      return booking;
    }
    return undefined;
  }

  async getProviderBookings(providerId: string): Promise<Booking[]> {
    const providerBookings = Array.from(this.bookings.values()).filter(
      booking => booking.providerId === providerId
    );
    return providerBookings;
  }

  async approveBooking(bookingId: string, providerId: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(bookingId);
    if (booking && booking.providerId === providerId) {
      booking.status = "approved";
      booking.approvedAt = new Date();
      booking.providerNotified = true;
      booking.updatedAt = new Date();
      this.bookings.set(bookingId, booking);
      return booking;
    }
    return undefined;
  }

  async rejectBooking(bookingId: string, providerId: string, reason: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(bookingId);
    if (booking && booking.providerId === providerId) {
      booking.status = "rejected";
      booking.rejectedAt = new Date();
      booking.rejectionReason = reason;
      booking.providerNotified = true;
      booking.updatedAt = new Date();
      this.bookings.set(bookingId, booking);
      return booking;
    }
    return undefined;
  }

  private initializeMockData() {
    // Add mock bookings for testing the confirmation system
    const mockBookings = [
      {
        id: "booking-1",
        userId: "user-1",
        providerId: "driver-1",
        type: "ride",
        status: "pending_approval",
        rideId: "ride-1",
        pickupTime: new Date("2025-08-30T14:00:00"),
        originalPrice: "450.00",
        discountApplied: "0.00",
        totalPrice: "450.00",
        paymentMethod: "visa_4242",
        requestedAt: new Date("2025-08-25T10:30:00"),
        customerNotified: false,
        providerNotified: false,
        createdAt: new Date("2025-08-25T10:30:00"),
        updatedAt: new Date("2025-08-25T10:30:00"),
      },
      {
        id: "booking-2",
        userId: "user-1",
        providerId: "host-1", 
        type: "stay",
        status: "approved",
        accommodationId: "acc-1",
        checkInDate: new Date("2025-09-01T15:00:00"),
        checkOutDate: new Date("2025-09-03T11:00:00"),
        guests: 2,
        nights: 2,
        originalPrice: "17000.00",
        discountApplied: "1700.00",
        totalPrice: "15300.00",
        paymentMethod: "mastercard_5555",
        requestedAt: new Date("2025-08-22T16:45:00"),
        approvedAt: new Date("2025-08-23T09:15:00"),
        customerNotified: true,
        providerNotified: true,
        createdAt: new Date("2025-08-22T16:45:00"),
        updatedAt: new Date("2025-08-23T09:15:00"),
      },
      {
        id: "booking-3",
        userId: "user-1",
        providerId: "organizer-1",
        type: "event",
        status: "confirmed",
        eventId: "event-1",
        ticketQuantity: 2,
        ticketNumbers: ["T001234", "T001235"],
        qrCodes: ["QR001234", "QR001235"],
        originalPrice: "400.00",
        discountApplied: "0.00",
        totalPrice: "400.00",
        paymentMethod: "mpesa_843123456",
        requestedAt: new Date("2025-08-20T14:20:00"),
        approvedAt: new Date("2025-08-20T15:30:00"),
        confirmedAt: new Date("2025-08-20T16:00:00"),
        customerNotified: true,
        providerNotified: true,
        createdAt: new Date("2025-08-20T14:20:00"),
        updatedAt: new Date("2025-08-20T16:00:00"),
      },
      {
        id: "booking-4",
        userId: "user-1",
        providerId: "driver-2",
        type: "ride",
        status: "rejected",
        rideId: "ride-5",
        pickupTime: new Date("2025-08-28T08:00:00"),
        originalPrice: "1200.00",
        discountApplied: "0.00",
        totalPrice: "1200.00",
        paymentMethod: "bank_transfer",
        requestedAt: new Date("2025-08-24T12:00:00"),
        rejectedAt: new Date("2025-08-24T14:30:00"),
        rejectionReason: "Veículo em manutenção nesta data. Desculpe pelo inconveniente.",
        customerNotified: true,
        providerNotified: true,
        createdAt: new Date("2025-08-24T12:00:00"),
        updatedAt: new Date("2025-08-24T14:30:00"),
      },
    ];

    mockBookings.forEach(booking => {
      this.bookings.set(booking.id, booking as any);
    });

    // Add mock provider bookings for testing
    const providerBookings = [
      {
        id: "booking-provider-1",
        userId: "customer-1",
        providerId: "user-1", // Current user as provider
        type: "ride",
        status: "pending_approval",
        rideId: "ride-2",
        pickupTime: new Date("2025-08-30T16:00:00"),
        originalPrice: "320.00",
        discountApplied: "0.00",
        totalPrice: "320.00",
        paymentMethod: "visa_4242",
        requestedAt: new Date("2025-08-25T14:30:00"),
        customerNotified: false,
        providerNotified: false,
        createdAt: new Date("2025-08-25T14:30:00"),
        updatedAt: new Date("2025-08-25T14:30:00"),
      },
      {
        id: "booking-provider-2",
        userId: "customer-2",
        providerId: "user-1", // Current user as provider
        type: "stay",
        status: "pending_approval",
        accommodationId: "acc-2",
        checkInDate: new Date("2025-09-05T15:00:00"),
        checkOutDate: new Date("2025-09-07T11:00:00"),
        guests: 1,
        nights: 2,
        originalPrice: "12000.00",
        discountApplied: "0.00",
        totalPrice: "12000.00",
        paymentMethod: "mastercard_5555",
        requestedAt: new Date("2025-08-24T11:15:00"),
        customerNotified: false,
        providerNotified: false,
        createdAt: new Date("2025-08-24T11:15:00"),
        updatedAt: new Date("2025-08-24T11:15:00"),
      },
    ];

    providerBookings.forEach(booking => {
      this.bookings.set(booking.id, booking as any);
    });
  }
}

export const storage = new MemStorage();
