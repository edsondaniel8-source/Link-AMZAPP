// Mock API Service - Sistema completo de viagens e acomodações
interface Ride {
  id: string;
  type: string;
  fromAddress: string;
  toAddress: string;
  price: string;
  estimatedDuration: number;
  availableSeats: number;
  driverName: string;
  vehicleInfo: string;
  vehiclePhoto?: string | null;
  description?: string;
  departureDate: string;
  createdAt: string;
  status: string;
}

interface Accommodation {
  id: string;
  name: string;
  type: string;
  location: string;
  price: string;
  rating: number;
  amenities: string[];
  description: string;
  images: string[];
  availableRooms: number;
  createdAt: string;
}

interface Booking {
  id: string;
  type: 'ride' | 'accommodation';
  itemId: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: string;
  bookingDate: string;
  details: any;
}

// Armazenamento em memória
let rides: Ride[] = [
  {
    id: '1',
    type: 'Standard',
    fromAddress: 'Maputo',
    toAddress: 'Matola',
    price: '50.00',
    estimatedDuration: 30,
    availableSeats: 3,
    driverName: 'João Silva',
    vehicleInfo: 'Toyota Corolla Branco',
    departureDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    status: 'published'
  }
];

let accommodations: Accommodation[] = [
  {
    id: '1',
    name: 'Hotel Maputo Plaza',
    type: 'Hotel',
    location: 'Maputo',
    price: '2500.00',
    rating: 4.5,
    amenities: ['WiFi', 'Piscina', 'Restaurante', 'Academia'],
    description: 'Hotel luxuoso no centro de Maputo com vista para a baía',
    images: [],
    availableRooms: 15,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Pousada Beira Mar',
    type: 'Pousada',
    location: 'Beira',
    price: '1200.00',
    rating: 4.0,
    amenities: ['WiFi', 'Café da manhã', 'Ar condicionado'],
    description: 'Pousada aconchegante próxima à praia',
    images: [],
    availableRooms: 8,
    createdAt: new Date().toISOString()
  }
];

let bookings: Booking[] = [];

// API Service
export class MockApiService {
  // ===== RIDES API =====
  
  static async createRide(rideData: any): Promise<{ success: boolean; message: string; route: Ride }> {
    console.log('📝 Criando nova rota:', rideData);
    
    // Validação
    if (!rideData.from || !rideData.to || !rideData.price) {
      throw new Error('Dados obrigatórios faltando: De onde, Para onde e Preço são obrigatórios');
    }
    
    // Simular upload da foto se presente
    let vehiclePhotoUrl = null;
    if (rideData.vehiclePhoto) {
      // Em uma implementação real, faria upload para cloud storage
      vehiclePhotoUrl = URL.createObjectURL(rideData.vehiclePhoto);
      console.log('📸 Foto do veículo processada');
    }
    
    // Criar nova rota
    const newRide: Ride = {
      id: Date.now().toString(),
      type: rideData.vehicleType || 'Standard',
      fromAddress: rideData.from,
      toAddress: rideData.to,
      price: rideData.price.toString(),
      estimatedDuration: 45,
      availableSeats: parseInt(rideData.seats) || 4,
      driverName: 'Motorista Atual',
      vehicleInfo: `${rideData.vehicleType || 'Veículo'} - Disponível`,
      vehiclePhoto: vehiclePhotoUrl,
      description: rideData.description || '',
      departureDate: rideData.date && rideData.time ? 
        `${rideData.date}T${rideData.time}:00.000Z` : 
        new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: 'published'
    };
    
    rides.push(newRide);
    console.log('✅ Nova rota criada:', newRide);
    
    return {
      success: true,
      message: 'Rota publicada com sucesso!',
      route: newRide
    };
  }
  
  static async searchRides(params: { from?: string; to?: string; passengers?: string }): Promise<{ rides: Ride[]; pagination: any }> {
    console.log('🔍 Buscar viagens:', params);
    
    let filteredRides = [...rides];
    
    if (params.from) {
      filteredRides = filteredRides.filter(ride => 
        ride.fromAddress.toLowerCase().includes(params.from!.toLowerCase())
      );
    }
    
    if (params.to) {
      filteredRides = filteredRides.filter(ride => 
        ride.toAddress.toLowerCase().includes(params.to!.toLowerCase())
      );
    }
    
    return {
      rides: filteredRides,
      pagination: {
        page: 1,
        limit: 20,
        total: filteredRides.length
      }
    };
  }
  
  static async getAllRides(): Promise<{ rides: Ride[]; total: number }> {
    return {
      rides: rides,
      total: rides.length
    };
  }
  
  // ===== ACCOMMODATIONS API =====
  
  static async searchAccommodations(params: { location?: string; type?: string; maxPrice?: string }): Promise<{ accommodations: Accommodation[]; pagination: any }> {
    console.log('🏨 Buscar acomodações:', params);
    
    let filteredAccommodations = [...accommodations];
    
    if (params.location) {
      filteredAccommodations = filteredAccommodations.filter(acc => 
        acc.location.toLowerCase().includes(params.location!.toLowerCase())
      );
    }
    
    if (params.type) {
      filteredAccommodations = filteredAccommodations.filter(acc => 
        acc.type.toLowerCase().includes(params.type!.toLowerCase())
      );
    }
    
    if (params.maxPrice) {
      const maxPrice = parseFloat(params.maxPrice);
      filteredAccommodations = filteredAccommodations.filter(acc => 
        parseFloat(acc.price) <= maxPrice
      );
    }
    
    return {
      accommodations: filteredAccommodations,
      pagination: {
        page: 1,
        limit: 20,
        total: filteredAccommodations.length
      }
    };
  }
  
  static async getAllAccommodations(): Promise<{ accommodations: Accommodation[]; total: number }> {
    return {
      accommodations: accommodations,
      total: accommodations.length
    };
  }
  
  // ===== BOOKINGS API =====
  
  static async createBooking(bookingData: any): Promise<{ success: boolean; message: string; booking: Booking }> {
    console.log('📋 Criando reserva:', bookingData);
    
    const newBooking: Booking = {
      id: Date.now().toString(),
      type: bookingData.type,
      itemId: bookingData.itemId,
      userId: bookingData.userId || 'current-user',
      status: 'confirmed',
      totalPrice: bookingData.totalPrice,
      bookingDate: new Date().toISOString(),
      details: bookingData.details || {}
    };
    
    bookings.push(newBooking);
    
    // Atualizar disponibilidade
    if (bookingData.type === 'ride') {
      const ride = rides.find(r => r.id === bookingData.itemId);
      if (ride && ride.availableSeats > 0) {
        ride.availableSeats--;
      }
    } else if (bookingData.type === 'accommodation') {
      const accommodation = accommodations.find(a => a.id === bookingData.itemId);
      if (accommodation && accommodation.availableRooms > 0) {
        accommodation.availableRooms--;
      }
    }
    
    console.log('✅ Reserva criada:', newBooking);
    
    return {
      success: true,
      message: 'Reserva confirmada com sucesso!',
      booking: newBooking
    };
  }
  
  static async getUserBookings(userId: string): Promise<{ bookings: Booking[] }> {
    const userBookings = bookings.filter(booking => booking.userId === userId);
    return { bookings: userBookings };
  }
  
  // ===== HEALTH CHECK =====
  
  static async healthCheck(): Promise<{ status: string; message: string; stats: any }> {
    return {
      status: 'OK',
      message: 'Link-A API funcionando (Mock Service)',
      stats: {
        totalRides: rides.length,
        totalAccommodations: accommodations.length,
        totalBookings: bookings.length,
        timestamp: new Date().toISOString()
      }
    };
  }
}