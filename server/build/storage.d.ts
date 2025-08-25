import { type User, type UpsertUser, type InsertUser, type Ride, type InsertRide, type Accommodation, type InsertAccommodation, type Booking, type InsertBooking } from "@shared/schema";
export interface IStorage {
    getUser(id: string): Promise<User | undefined>;
    upsertUser(user: UpsertUser): Promise<User>;
    searchRides(from: string, to: string): Promise<Ride[]>;
    getRide(id: string): Promise<Ride | undefined>;
    createRide(ride: InsertRide): Promise<Ride>;
    searchAccommodations(location: string, checkIn?: Date, checkOut?: Date): Promise<Accommodation[]>;
    getAccommodation(id: string): Promise<Accommodation | undefined>;
    createAccommodation(accommodation: InsertAccommodation): Promise<Accommodation>;
    getBooking(id: string): Promise<Booking | undefined>;
    getUserBookings(userId: string): Promise<Booking[]>;
    getProviderBookings(providerId: string): Promise<Booking[]>;
    createBooking(booking: InsertBooking): Promise<Booking>;
    updateBookingStatus(id: string, status: string, details?: any): Promise<Booking | undefined>;
    approveBooking(bookingId: string, providerId: string): Promise<Booking | undefined>;
    rejectBooking(bookingId: string, providerId: string, reason: string): Promise<Booking | undefined>;
}
export declare class DatabaseStorage implements IStorage {
    getUser(id: string): Promise<User | undefined>;
    upsertUser(userData: UpsertUser): Promise<User>;
    searchRides(from: string, to: string): Promise<Ride[]>;
    getRide(id: string): Promise<Ride | undefined>;
    createRide(insertRide: InsertRide): Promise<Ride>;
    searchAccommodations(location: string, checkIn?: Date, checkOut?: Date): Promise<Accommodation[]>;
    getAccommodation(id: string): Promise<Accommodation | undefined>;
    createAccommodation(insertAccommodation: InsertAccommodation): Promise<Accommodation>;
    getBooking(id: string): Promise<Booking | undefined>;
    getUserBookings(userId: string): Promise<Booking[]>;
    getProviderBookings(providerId: string): Promise<Booking[]>;
    createBooking(insertBooking: InsertBooking): Promise<Booking>;
    updateBookingStatus(id: string, status: string, details?: any): Promise<Booking | undefined>;
    approveBooking(bookingId: string, providerId: string): Promise<Booking | undefined>;
    rejectBooking(bookingId: string, providerId: string, reason: string): Promise<Booking | undefined>;
}
export declare class MemStorage {
    private users;
    private rides;
    private accommodations;
    private bookings;
    constructor();
    getUser(id: string): Promise<User | undefined>;
    getUserByUsername(username: string): Promise<User | undefined>;
    getUserByEmail(email: string): Promise<User | undefined>;
    createUser(insertUser: InsertUser): Promise<User>;
    searchRides(from: string, to: string): Promise<Ride[]>;
    getRide(id: string): Promise<Ride | undefined>;
    createRide(insertRide: InsertRide): Promise<Ride>;
    searchAccommodations(location: string, checkIn?: Date, checkOut?: Date): Promise<Accommodation[]>;
    getAccommodation(id: string): Promise<Accommodation | undefined>;
    createAccommodation(insertAccommodation: InsertAccommodation): Promise<Accommodation>;
    getBooking(id: string): Promise<Booking | undefined>;
    getUserBookings(userId: string): Promise<Booking[]>;
    createBooking(insertBooking: InsertBooking): Promise<Booking>;
    updateBookingStatus(id: string, status: string, details?: any): Promise<Booking | undefined>;
    getProviderBookings(providerId: string): Promise<Booking[]>;
    approveBooking(bookingId: string, providerId: string): Promise<Booking | undefined>;
    rejectBooking(bookingId: string, providerId: string, reason: string): Promise<Booking | undefined>;
}
export declare const storage: DatabaseStorage;
//# sourceMappingURL=storage.d.ts.map