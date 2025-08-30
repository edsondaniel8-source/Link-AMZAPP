// frontend/src/shared/lib/rideService.ts
import { api } from "./api";

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
}

export const rideService = {
  // Criar uma nova ride
  createRide: (rideData: RideData): Promise<Ride> => {
    return api.post("/api/rides", rideData);
  },

  // Buscar as rides do motorista logado
  getMyRides: (): Promise<Ride[]> => {
    return api.get("/api/rides/my-rides");
  },

  // Buscar rides públicas (para a main-app dos clientes)
  searchRides: (searchParams: SearchParams): Promise<Ride[]> => {
    // Converte o objeto de parâmetros numa query string
    const queryString = new URLSearchParams(searchParams as Record<string, string>).toString();
    return api.get(`/api/rides/search?${queryString}`);
  },

  // Atualizar uma ride existente
  updateRide: (rideId: string, updateData: Partial<RideData>): Promise<Ride> => {
    return api.put(`/api/rides/${rideId}`, updateData);
  },

  // Cancelar (deletar) uma ride
  cancelRide: (rideId: string): Promise<void> => {
    return api.delete(`/api/rides/${rideId}`);
  },

  // Obter detalhes de uma ride específica (para a página de detalhes)
  getRideDetails: (rideId: string): Promise<Ride> => {
    return api.get(`/api/rides/${rideId}`);
  },
};

// Exporta como padrão também, para facilitar a importação
export default rideService;