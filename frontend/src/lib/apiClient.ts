// API Client que usa Mock Service quando backend não está disponível
import { MockApiService } from "../services/mockApi";

// Função para detectar se o backend está disponível
async function isBackendAvailable(): Promise<boolean> {
  try {
    const response = await fetch("/api/health", {
      method: "GET",
      signal: AbortSignal.timeout(2000), // 2 segundos timeout
    });
    return response.ok;
  } catch {
    return false;
  }
}

// Cliente API inteligente
export class ApiClient {
  private static useBackend = true;

  static async checkBackend() {
    this.useBackend = await isBackendAvailable();
    console.log(
      `🔗 Using ${this.useBackend ? "real backend" : "mock service"}`,
    );
  }

  // ===== RIDES API =====

  static async createRide(rideData: any) {
    console.log("📝 API: Criando rota", rideData);

    try {
      if (this.useBackend) {
        const response = await fetch("/api/simplified-rides", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rideData),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
      }
    } catch (error) {
      console.log("🔄 Fallback to mock service");
      this.useBackend = false;
    }

    // Usar mock service
    return await MockApiService.createRide(rideData);
  }

  static async searchRides(params: {
    from?: string;
    to?: string;
    passengers?: string;
    date?: string;
  }) {
    console.log("🔍 API: Buscar viagens", params);

    try {
      if (this.useBackend) {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`/api/rides/search?${queryString}`);

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
      }
    } catch (error) {
      console.log("🔄 Fallback to mock service");
      this.useBackend = false;
    }

    // Usar mock service com melhor estrutura de resposta
    const result = await MockApiService.searchRides(params);
    return {
      success: true,
      rides: result.rides,
      message: `Encontradas ${result.rides.length} viagens disponíveis`,
      pagination: result.pagination,
    };
  }

  // ===== ACCOMMODATIONS API =====

  static async searchAccommodations(params: {
    location?: string;
    type?: string;
    maxPrice?: string;
  }) {
    console.log("🏨 API: Buscar acomodações", params);

    try {
      if (this.useBackend) {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(
          `/api/accommodations/search?${queryString}`,
        );

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
      }
    } catch (error) {
      console.log("🔄 Fallback to mock service for accommodations");
      this.useBackend = false;
    }

    return await MockApiService.searchAccommodations(params);
  }

  // ===== BOOKINGS API =====

  static async createBooking(bookingData: any) {
    console.log("📋 API: Criando reserva", bookingData);

    try {
      if (this.useBackend) {
        const response = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
      }
    } catch (error) {
      console.log("🔄 Fallback to mock service for bookings");
      this.useBackend = false;
    }

    return await MockApiService.createBooking(bookingData);
  }

  // ===== HEALTH CHECK =====

  static async healthCheck() {
    try {
      if (this.useBackend) {
        const response = await fetch("/api/health");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
      }
    } catch (error) {
      console.log("🔄 Fallback to mock service health");
      this.useBackend = false;
    }

    return await MockApiService.healthCheck();
  }
}

// Inicializar verificação do backend
ApiClient.checkBackend();
