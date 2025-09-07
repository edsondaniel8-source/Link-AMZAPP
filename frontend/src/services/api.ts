import { auth } from '@/shared/lib/firebaseConfig';

/**
 * Serviço central de API para todas as apps
 * Gerencia autenticação Firebase e comunicação com Railway backend
 */
class ApiService {
  private baseURL: string;

  constructor() {
    // ✅ Railway centralizado - backend completo
    this.baseURL = import.meta.env.VITE_API_URL || 'https://link-a-backend-production.up.railway.app';
    console.log('🏗️ ApiService inicializado com Railway:', this.baseURL);
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    try {
      if (auth?.currentUser) {
        const token = await auth.currentUser.getIdToken();
        headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.debug('No auth token available:', error);
    }

    return headers;
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: unknown
  ): Promise<T> {
    const headers = await this.getAuthHeaders();
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      method,
      headers,
      credentials: 'include',
    };

    if (data && method !== 'GET') {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`${response.status}: ${error}`);
    }

    return response.json();
  }

  // ===== RIDES API =====
  async searchRides(params: {
    from?: string;
    to?: string;
    passengers?: number;
    date?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params.from) searchParams.append('from', params.from);
    if (params.to) searchParams.append('to', params.to);
    if (params.passengers) searchParams.append('passengers', params.passengers.toString());
    if (params.date) searchParams.append('date', params.date);

    return this.request('GET', `/api/rides-simple/search?${searchParams}`);
  }

  async createRide(rideData: {
    fromAddress: string;
    toAddress: string;
    departureDate: string;
    price: number;
    maxPassengers: number;
    type?: string;
    description?: string;
  }) {
    return this.request('POST', '/api/rides-simple/create', rideData);
  }

  // ===== BOOKINGS API =====
  async createBooking(bookingData: {
    rideId?: string;
    accommodationId?: string;
    type: 'ride' | 'accommodation';
    guestInfo: {
      name: string;
      email: string;
      phone: string;
    };
    details: {
      passengers?: number;
      checkIn?: string;
      checkOut?: string;
      totalAmount: number;
    };
  }) {
    return this.request('POST', '/api/bookings/create', bookingData);
  }

  async getUserBookings() {
    return this.request('GET', '/api/bookings/user');
  }

  // ===== USER/AUTH API =====
  async getUserProfile() {
    return this.request('GET', '/api/auth/profile');
  }

  async updateUserProfile(userData: any) {
    return this.request('PUT', '/api/auth/profile', userData);
  }

  // ===== HOTELS API =====
  async searchAccommodations(params: {
    location?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params.location) searchParams.append('address', params.location); // Backend usa 'address' não 'location'
    if (params.checkIn) searchParams.append('checkIn', params.checkIn);
    if (params.checkOut) searchParams.append('checkOut', params.checkOut);
    if (params.guests) searchParams.append('guests', params.guests.toString());
    // Adicionar filtro para apenas acomodações disponíveis
    searchParams.append('isAvailable', 'true');

    return this.request('GET', `/api/hotels?${searchParams}`);
  }

  async createAccommodation(accommodationData: any) {
    return this.request('POST', '/api/hotels', accommodationData);
  }

  // ===== ADMIN API =====
  async getAdminStats() {
    return this.request('GET', '/api/admin/stats');
  }

  async getAdminRides() {
    return this.request('GET', '/api/admin/rides');
  }

  async getAdminBookings() {
    return this.request('GET', '/api/admin/bookings');
  }

  // ===== PARTNERSHIPS API =====
  async createPartnership(partnershipData: {
    partnerId: string;
    type: 'driver-hotel' | 'hotel-driver';
    terms: string;
  }) {
    return this.request('POST', '/api/partnerships/create', partnershipData);
  }

  async getPartnershipRequests() {
    return this.request('GET', '/api/partnerships/requests');
  }

  // ===== EVENTS API =====
  async getEvents() {
    return this.request('GET', '/api/events');
  }

  async createEvent(eventData: any) {
    return this.request('POST', '/api/events/create', eventData);
  }

  // ===== FEATURED OFFERS API =====
  async getFeaturedOffers() {
    return this.request('GET', '/api/offers/featured');
  }

  // ===== CHAT API =====
  async getChatRooms() {
    return this.request('GET', '/api/chat/rooms');
  }

  async getChatMessages(roomId: string) {
    return this.request('GET', `/api/chat/messages/${roomId}`);
  }

  async sendMessage(roomId: string, message: string) {
    return this.request('POST', `/api/chat/messages/${roomId}`, { message });
  }
}

export const apiService = new ApiService();
export default apiService;