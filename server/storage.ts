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
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: string, status: string): Promise<Booking | undefined>;
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
        departureDate: new Date("2025-01-22T06:00:00"),
        route: ["Maputo", "Xai-Xai", "Maxixe", "Inhambane", "Vilanculos", "Beira"],
        allowPickupEnRoute: true,
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
        departureDate: new Date("2025-01-22T20:00:00"),
        route: ["Maputo", "Beira", "Quelimane", "Mocuba", "Nampula"],
        allowPickupEnRoute: true,
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
        departureDate: new Date("2025-01-23T07:30:00"),
        route: ["Maputo", "Ressano Garcia", "Machipanda", "Chimoio"],
        allowPickupEnRoute: false,
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
        departureDate: new Date("2025-01-22T18:00:00"),
        route: ["Maputo", "Beira", "Quelimane", "Nampula", "Nacala", "Pemba"],
        allowPickupEnRoute: true,
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
        departureDate: new Date("2025-01-23T05:00:00"),
        route: ["Maputo", "Beira", "Chimoio", "Tete"],
        allowPickupEnRoute: true,
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
        departureDate: new Date("2025-01-22T14:00:00"),
        route: ["Maputo", "Boane", "Manhiça", "Xai-Xai"],
        allowPickupEnRoute: true,
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
        departureDate: new Date("2025-01-23T08:00:00"),
        route: ["Maputo", "Xai-Xai", "Maxixe", "Inhambane"],
        allowPickupEnRoute: true,
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
        departureDate: new Date("2025-01-22T19:30:00"),
        route: ["Maputo", "Beira", "Gorongosa", "Caia", "Quelimane"],
        allowPickupEnRoute: true,
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
        departureDate: new Date("2025-01-23T04:00:00"),
        route: ["Maputo", "Beira", "Nampula", "Cuamba", "Lichinga"],
        allowPickupEnRoute: true,
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
        departureDate: new Date("2025-01-22T16:30:00"),
        route: ["Maputo Centro", "Matola Rio", "Matola"],
        allowPickupEnRoute: true,
        isActive: true,
      },
    ];

    // Mock accommodations data
    const mockAccommodations: Accommodation[] = [
      {
        id: "acc-1",
        name: "Grand Plaza Hotel",
        type: "Hotel",
        address: "Downtown • 2.1 km from center",
        lat: "40.7589",
        lng: "-73.9851",
        pricePerNight: "185.00",
        rating: "4.8",
        reviewCount: 342,
        images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945"],
        amenities: ["WiFi", "Pool", "Gym", "Restaurant"],
        description: "Luxury hotel in downtown with city views",
        distanceFromCenter: "2.1",
        isAvailable: true,
      },
      {
        id: "acc-2",
        name: "Boutique Suites",
        type: "Hotel",
        address: "Arts District • 1.8 km from center",
        lat: "40.7505",
        lng: "-73.9934",
        pricePerNight: "145.00",
        rating: "4.6",
        reviewCount: 198,
        images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4"],
        amenities: ["WiFi", "Breakfast", "Parking"],
        description: "Stylish boutique hotel in arts district",
        distanceFromCenter: "1.8",
        isAvailable: true,
      },
      {
        id: "acc-3",
        name: "Executive Inn",
        type: "Hotel",
        address: "Business District • 3.2 km from center",
        lat: "40.7614",
        lng: "-73.9776",
        pricePerNight: "125.00",
        rating: "4.7",
        reviewCount: 256,
        images: ["https://images.unsplash.com/photo-1578683010236-d716f9a3f461"],
        amenities: ["WiFi", "Business Center", "Gym"],
        description: "Modern business hotel with workspace",
        distanceFromCenter: "3.2",
        isAvailable: true,
      },
      {
        id: "acc-4",
        name: "Modern Loft",
        type: "Apartment",
        address: "Trendy Neighborhood • 2.5 km from center",
        lat: "40.7282",
        lng: "-73.9942",
        pricePerNight: "95.00",
        rating: "4.5",
        reviewCount: 89,
        images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"],
        amenities: ["WiFi", "Kitchen", "Washing Machine"],
        description: "Stylish modern apartment rental",
        distanceFromCenter: "2.5",
        isAvailable: true,
      },
    ];

    mockRides.forEach(ride => this.rides.set(ride.id, ride));
    mockAccommodations.forEach(acc => this.accommodations.set(acc.id, acc));
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
    const booking: Booking = { 
      ...insertBooking, 
      id, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (booking) {
      booking.status = status;
      booking.updatedAt = new Date();
      this.bookings.set(id, booking);
      return booking;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
