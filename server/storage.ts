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
    // Mock rides data
    const mockRides: Ride[] = [
      {
        id: "ride-1",
        type: "UberX",
        fromAddress: "Downtown",
        toAddress: "Airport",
        fromLat: "40.7128",
        fromLng: "-74.0060",
        toLat: "40.6892",
        toLng: "-74.1745",
        price: "12.50",
        estimatedDuration: 15,
        estimatedDistance: "8.2",
        availableIn: 4,
        driverName: "John Doe",
        vehicleInfo: "Honda Civic - ABC 123",
        isActive: true,
      },
      {
        id: "ride-2",
        type: "Comfort",
        fromAddress: "Downtown",
        toAddress: "Airport",
        fromLat: "40.7128",
        fromLng: "-74.0060",
        toLat: "40.6892",
        toLng: "-74.1745",
        price: "18.25",
        estimatedDuration: 15,
        estimatedDistance: "8.2",
        availableIn: 6,
        driverName: "Jane Smith",
        vehicleInfo: "Toyota Camry - XYZ 789",
        isActive: true,
      },
      {
        id: "ride-3",
        type: "UberXL",
        fromAddress: "Downtown",
        toAddress: "Airport",
        fromLat: "40.7128",
        fromLng: "-74.0060",
        toLat: "40.6892",
        toLng: "-74.1745",
        price: "22.75",
        estimatedDuration: 15,
        estimatedDistance: "8.2",
        availableIn: 8,
        driverName: "Mike Johnson",
        vehicleInfo: "Honda Pilot - DEF 456",
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
