export interface Booking {
  id?: string;
  userId: string;
  type: "ride" | "hotel" | "event";
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: Date;
  updatedAt: Date;
  details: RideDetails | HotelDetails | EventDetails;
}

export interface RideDetails {
  pickup: string;
  destination: string;
  date: string;
  passengers: number;
  price?: number;
  driverId?: string;
}

export interface HotelDetails {
  hotelName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  price?: number;
}

export interface EventDetails {
  eventName: string;
  eventDate: string;
  tickets: number;
  price?: number;
}
