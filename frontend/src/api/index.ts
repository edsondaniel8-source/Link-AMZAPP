// API Clients organizados por roles
// Exports principais por contexto de usuário

// === CLIENT APIs ===
export { clientRidesApi } from './client/rides';
export { clientBookingsApi } from './client/bookings';
export type { RideSearchParams, Ride, RideSearchResponse } from './client/rides';
export type { CreateBookingRequest, Booking } from './client/bookings';

// === DRIVER APIs ===
export { driverRidesApi } from './driver/rides';
export { driverVehiclesApi } from './driver/vehicles';
export type { CreateRideRequest, DriverRide, DriverStats } from './driver/rides';
export type { Vehicle, VehicleStats } from './driver/vehicles';

// === HOTEL APIs ===
export { hotelAvailabilityApi } from './hotel/availability';
export { hotelBookingsApi } from './hotel/bookings';
export type { CreateAccommodationRequest, Accommodation, AvailabilityRequest } from './hotel/availability';
export type { HotelBooking, HotelStats } from './hotel/bookings';

// === ADMIN APIs ===
export { adminDashboardApi } from './admin/dashboard';
export { adminUsersApi } from './admin/users';
export type { PlatformStats, RecentActivity, SystemHealth } from './admin/dashboard';
export type { User, UserSearchParams, UserStats } from './admin/users';

// === SHARED APIs ===
export { sharedAuthApi } from './shared/auth';
export { sharedHealthApi } from './shared/health';
export type { AuthUser, UserProfile, RegisterData } from './shared/auth';
export type { HealthStatus, DetailedHealthStatus } from './shared/health';

// API clients agrupados por contexto
export const apiClients = {
  client: {
    rides: clientRidesApi,
    bookings: clientBookingsApi,
  },
  driver: {
    rides: driverRidesApi,
    vehicles: driverVehiclesApi,
  },
  hotel: {
    availability: hotelAvailabilityApi,
    bookings: hotelBookingsApi,
  },
  admin: {
    dashboard: adminDashboardApi,
    users: adminUsersApi,
  },
  shared: {
    auth: sharedAuthApi,
    health: sharedHealthApi,
  },
};

export default apiClients;