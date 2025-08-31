// frontend/src/shared/lib/rideService.ts
import { ApiClient } from "../../lib/apiClient";
import { SharedDataService } from '../services/sharedDataService';

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
    
    // Criar rota localmente sem depender do backend
    const newRide: Ride = {
      id: Date.now().toString(),
      driverId: 'current-driver',
      fromAddress: rideData.fromAddress,
      toAddress: rideData.toAddress,
      departureDate: rideData.departureDate,
      price: rideData.price,
      maxPassengers: rideData.maxPassengers,
      type: rideData.type || 'Standard',
      status: 'active' as const,
      currentPassengers: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      driverName: 'Motorista Atual',
      vehiclePhoto: rideData.vehiclePhoto || null,
      description: rideData.description || ''
    };
    
    console.log('✅ RideService: Rota criada com sucesso', newRide);
    return newRide;
  },

  // Buscar as rides do motorista logado
  getMyRides: async (): Promise<Ride[]> => {
    const driverId = 'current-driver';
    const driverRides = SharedDataService.getDriverRides(driverId);
    
    return driverRides.map((ride: any) => ({
      id: ride.id,
      driverId: ride.driverId,
      fromAddress: ride.fromAddress,
      toAddress: ride.toAddress,
      departureDate: ride.departureDate,
      price: ride.price,
      maxPassengers: ride.maxPassengers,
      type: ride.type,
      status: ride.status as 'active' | 'completed' | 'cancelled',
      currentPassengers: ride.maxPassengers - ride.availableSeats,
      createdAt: ride.createdAt,
      updatedAt: ride.updatedAt,
      driverName: ride.driverName,
      vehiclePhoto: ride.vehiclePhoto,
      description: ride.description || ''
    }));
  },

  // Buscar rides públicas (para a main-app dos clientes)
  searchRides: async (searchParams: SearchParams): Promise<Ride[]> => {
    console.log('🔍 RideService: Buscando rotas reais', searchParams);
    
    // Usar dados reais do serviço compartilhado primeiro
    const sharedRides = SharedDataService.searchRides({
      from: searchParams.from,
      to: searchParams.to,
      passengers: searchParams.passengers,
      date: searchParams.date
    });

    if (sharedRides.length > 0) {
      console.log(`✅ Encontradas ${sharedRides.length} rotas reais dos motoristas`);
      return sharedRides.map((ride: any) => ({
        id: ride.id,
        driverId: ride.driverId,
        fromAddress: ride.fromAddress,
        toAddress: ride.toAddress,
        departureDate: ride.departureDate,
        price: ride.price,
        maxPassengers: ride.maxPassengers,
        type: ride.type,
        status: ride.status as 'active' | 'completed' | 'cancelled',
        currentPassengers: ride.maxPassengers - ride.availableSeats,
        createdAt: ride.createdAt,
        updatedAt: ride.updatedAt,
        driverName: ride.driverName,
        vehiclePhoto: ride.vehiclePhoto,
        description: ride.description || '',
        vehicleInfo: ride.vehicleInfo
      }));
    }

    // Se não há rotas reais, retorna array vazio
    console.log('📡 Nenhuma rota encontrada nos dados compartilhados');
    return [];
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