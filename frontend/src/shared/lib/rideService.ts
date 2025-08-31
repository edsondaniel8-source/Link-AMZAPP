// frontend/src/shared/lib/rideService.ts
import { ApiClient } from "../../lib/apiClient";

export interface RideData {
  type?: string;
  fromAddress: string;
  toAddress: string;
  departureDate: string;
  price: number;
  maxPassengers: number;
  vehicleType?: string;
  description?: string;
  pickupPoint?: string;
  dropoffPoint?: string;
  driverId?: string;
  allowNegotiation?: boolean;
  isRoundTrip?: boolean;
  vehiclePhoto?: File | null;
}

export interface SearchParams {
  from?: string;
  to?: string;
  date?: string;
  passengers?: number;
}

export interface Ride extends RideData {
  id: string;
  driverId: string;
  status: 'active' | 'completed' | 'cancelled';
  currentPassengers: number;
  createdAt: string;
  updatedAt: string;
  driverName: string;
  vehiclePhoto?: string | null;
}

export const rideService = {
  // Criar uma nova ride
  createRide: async (rideData: RideData): Promise<Ride> => {
    console.log('📝 RideService: Criando nova rota', rideData);
    
    // Converter para formato esperado pelo ApiClient
    const apiData = {
      from: rideData.fromAddress,
      to: rideData.toAddress,
      price: rideData.price.toString(),
      date: rideData.departureDate.split('T')[0],
      time: rideData.departureDate.split('T')[1]?.substring(0, 5) || '08:00',
      seats: rideData.maxPassengers.toString(),
      vehicleType: rideData.type || rideData.vehicleType || 'Standard'
    };
    
    const result = await ApiClient.createRide(apiData);
    
    // Converter resposta para formato esperado
    if (result.success && result.route) {
      return {
        id: result.route.id,
        driverId: 'current-driver',
        fromAddress: result.route.fromAddress,
        toAddress: result.route.toAddress,
        departureDate: result.route.departureDate,
        price: parseFloat(result.route.price),
        maxPassengers: result.route.availableSeats,
        type: result.route.type,
        status: 'active' as const,
        currentPassengers: 0,
        createdAt: result.route.createdAt,
        updatedAt: result.route.createdAt,
        driverName: result.route.driverName || 'Motorista',
        vehiclePhoto: result.route.vehiclePhoto || null,
        description: result.route.description || ''
      };
    }
    
    throw new Error(result.message || 'Erro ao criar rota');
  },

  // Buscar as rides do motorista logado
  getMyRides: async (): Promise<Ride[]> => {
    const result = await ApiClient.searchRides({});
    return result.rides.map((ride: any) => ({
      id: ride.id,
      driverId: 'current-driver',
      fromAddress: ride.fromAddress,
      toAddress: ride.toAddress,
      departureDate: ride.departureDate,
      price: parseFloat(ride.price),
      maxPassengers: ride.availableSeats,
      type: ride.type,
      status: 'active' as const,
      currentPassengers: 0,
      createdAt: ride.createdAt,
      updatedAt: ride.createdAt,
      driverName: ride.driverName || 'Motorista',
      vehiclePhoto: ride.vehiclePhoto || null,
      description: ride.description || ''
    }));
  },

  // Buscar rides públicas (para a main-app dos clientes)
  searchRides: async (searchParams: SearchParams): Promise<Ride[]> => {
    console.log('🔍 RideService: Buscando rotas', searchParams);
    
    const apiParams = {
      from: searchParams.from,
      to: searchParams.to,
      passengers: searchParams.passengers?.toString(),
      date: searchParams.date
    };
    
    const result = await ApiClient.searchRides(apiParams);
    
    return result.rides.map((ride: any) => ({
      id: ride.id,
      driverId: ride.driverName || 'driver-id',
      fromAddress: ride.fromAddress,
      toAddress: ride.toAddress,
      departureDate: ride.departureDate,
      price: parseFloat(ride.price),
      maxPassengers: ride.availableSeats,
      type: ride.type,
      status: 'active' as const,
      currentPassengers: 0,
      createdAt: ride.createdAt || new Date().toISOString(),
      updatedAt: ride.createdAt || new Date().toISOString(),
      driverName: ride.driverName || 'Motorista',
      vehiclePhoto: ride.vehiclePhoto || null,
      description: ride.description || ''
    }));
  },

  // Atualizar uma ride existente (mock por enquanto)
  updateRide: async (rideId: string, updateData: Partial<RideData>): Promise<Ride> => {
    console.log('📝 RideService: Atualizando rota', rideId, updateData);
    // Por enquanto, retorna dados mockados
    return {
      id: rideId,
      driverId: 'current-driver',
      fromAddress: updateData.fromAddress || 'Maputo',
      toAddress: updateData.toAddress || 'Matola',
      departureDate: updateData.departureDate || new Date().toISOString(),
      price: updateData.price || 0,
      maxPassengers: updateData.maxPassengers || 4,
      type: updateData.type || 'Standard',
      status: 'active' as const,
      currentPassengers: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      driverName: 'Motorista',
      vehiclePhoto: null,
      description: updateData.description || ''
    };
  },

  // Cancelar (deletar) uma ride (mock por enquanto)
  cancelRide: async (rideId: string): Promise<void> => {
    console.log('🗑️ RideService: Cancelando rota', rideId);
    // Mock implementation
  },

  // Obter detalhes de uma ride específica (mock por enquanto)
  getRideDetails: async (rideId: string): Promise<Ride> => {
    console.log('📋 RideService: Obtendo detalhes da rota', rideId);
    // Mock implementation
    return {
      id: rideId,
      driverId: 'current-driver',
      fromAddress: 'Maputo',
      toAddress: 'Matola',
      departureDate: new Date().toISOString(),
      price: 100,
      maxPassengers: 4,
      type: 'Standard',
      status: 'active' as const,
      currentPassengers: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      driverName: 'Motorista',
      vehiclePhoto: null,
      description: ''
    };
  },
};

// Exporta como padrão também, para facilitar a importação
export default rideService;