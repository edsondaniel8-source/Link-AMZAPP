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
    console.log('📝 RideService: Criando nova rota no backend', rideData);
    
    try {
      const response = await fetch('/api/rides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: rideData.type || 'Standard',
          fromAddress: rideData.fromAddress,
          toAddress: rideData.toAddress,
          departureDate: rideData.departureDate,
          price: rideData.price.toString(),
          maxPassengers: rideData.maxPassengers,
          availableSeats: rideData.maxPassengers,
          driverName: 'Motorista Atual',
          vehicleInfo: rideData.type || 'Standard',
          isActive: true,
          allowNegotiation: rideData.allowNegotiation || false,
          isRoundTrip: rideData.isRoundTrip || false,
          description: rideData.description || ''
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Erro ao criar rota');
      }

      const backendRide = result.data.ride;
      
      const newRide: Ride = {
        id: backendRide.id,
        driverId: backendRide.driverId || 'current-driver',
        fromAddress: backendRide.fromAddress,
        toAddress: backendRide.toAddress,
        departureDate: backendRide.departureDate,
        price: parseFloat(backendRide.price),
        maxPassengers: backendRide.maxPassengers,
        type: backendRide.type,
        status: 'active' as const,
        currentPassengers: backendRide.maxPassengers - backendRide.availableSeats,
        createdAt: backendRide.createdAt,
        updatedAt: backendRide.updatedAt,
        driverName: backendRide.driverName || 'Motorista',
        vehiclePhoto: null,
        description: backendRide.description || ''
      };
      
      console.log('✅ RideService: Rota criada com sucesso no backend', newRide);
      return newRide;
    } catch (error) {
      console.error('❌ RideService: Erro ao criar rota', error);
      throw error;
    }
  },

  // Buscar as rides do motorista logado
  getMyRides: async (): Promise<Ride[]> => {
    try {
      const response = await fetch('/api/rides?isActive=true');
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Erro ao buscar rotas');
      }

      return result.data.rides.map((ride: any) => ({
        id: ride.id,
        driverId: ride.driverId || 'current-driver',
        fromAddress: ride.fromAddress,
        toAddress: ride.toAddress,
        departureDate: ride.departureDate,
        price: parseFloat(ride.price),
        maxPassengers: ride.maxPassengers,
        type: ride.type,
        status: ride.isActive ? 'active' as const : 'completed' as const,
        currentPassengers: ride.maxPassengers - ride.availableSeats,
        createdAt: ride.createdAt,
        updatedAt: ride.updatedAt,
        driverName: ride.driverName || 'Motorista',
        vehiclePhoto: null,
        description: ride.description || ''
      }));
    } catch (error) {
      console.error('❌ RideService: Erro ao buscar rotas do motorista', error);
      return [];
    }
  },

  // Buscar rides públicas (para a main-app dos clientes)
  searchRides: async (searchParams: SearchParams): Promise<Ride[]> => {
    console.log('🔍 RideService: Buscando rotas no backend', searchParams);
    
    try {
      const queryParams = new URLSearchParams();
      
      if (searchParams.from) queryParams.append('fromAddress', searchParams.from);
      if (searchParams.to) queryParams.append('toAddress', searchParams.to);
      if (searchParams.passengers) queryParams.append('minSeats', searchParams.passengers.toString());
      if (searchParams.date) queryParams.append('departureDate', searchParams.date);
      queryParams.append('isActive', 'true');

      const response = await fetch(`/api/rides?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Erro ao buscar rotas');
      }

      console.log(`✅ Encontradas ${result.data.rides.length} rotas no backend`);
      
      return result.data.rides.map((ride: any) => ({
        id: ride.id,
        driverId: ride.driverId || 'current-driver',
        fromAddress: ride.fromAddress,
        toAddress: ride.toAddress,
        departureDate: ride.departureDate,
        price: parseFloat(ride.price),
        maxPassengers: ride.maxPassengers,
        type: ride.type,
        status: ride.isActive ? 'active' as const : 'completed' as const,
        currentPassengers: ride.maxPassengers - ride.availableSeats,
        createdAt: ride.createdAt,
        updatedAt: ride.updatedAt,
        driverName: ride.driverName || 'Motorista',
        vehiclePhoto: null,
        description: ride.description || '',
        vehicleInfo: ride.vehicleInfo
      }));
    } catch (error) {
      console.error('❌ RideService: Erro ao buscar rotas', error);
      return [];
    }
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