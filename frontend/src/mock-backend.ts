// Mock backend temporário até configurarmos o backend real
// Este arquivo simula as respostas do backend PostgreSQL

// Mock backend temporário

const mockRides = [
  {
    id: "ride-1",
    type: "Standard",
    fromAddress: "Maputo Centro",
    toAddress: "Matola",
    fromLat: -25.9692,
    fromLng: 32.5732,
    toLat: -25.9748,
    toLng: 32.4589,
    price: "150.00",
    estimatedDuration: 45,
    estimatedDistance: 15.5,
    availableIn: 10,
    driverId: "driver-1",
    driverName: "João Silva",
    vehicleInfo: "Toyota Corolla Branco",
    maxPassengers: 4,
    availableSeats: 3,
    isActive: true,
    departureDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description: "Viagem confortável com ar condicionado"
  },
  {
    id: "ride-2", 
    type: "Comfort",
    fromAddress: "Beira",
    toAddress: "Nampula",
    fromLat: -19.8436,
    fromLng: 34.8389,
    toLat: -15.1165,
    toLng: 39.2666,
    price: "850.00",
    estimatedDuration: 360,
    estimatedDistance: 425.2,
    availableIn: 60,
    driverId: "driver-2", 
    driverName: "Maria Santos",
    vehicleInfo: "Mercedes Vito Prata",
    maxPassengers: 7,
    availableSeats: 5,
    isActive: true,
    departureDate: new Date(Date.now() + 24*60*60*1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description: "Viagem longa com paradas para descanso"
  }
];

// Interceptar requisições fetch para /api/rides
const originalFetch = window.fetch;
window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === 'string' ? input : input.toString();
  
  // Interceptar GET /api/rides
  if (url === '/api/rides' || url.startsWith('/api/rides?')) {
    const urlObj = new URL(url, window.location.origin);
    const searchParams = urlObj.searchParams;
    
    let filteredRides = [...mockRides];
    
    // Aplicar filtros
    const fromAddress = searchParams.get('fromAddress');
    const toAddress = searchParams.get('toAddress');
    
    if (fromAddress) {
      filteredRides = filteredRides.filter(ride => 
        ride.fromAddress.toLowerCase().includes(fromAddress.toLowerCase())
      );
    }
    
    if (toAddress) {
      filteredRides = filteredRides.filter(ride =>
        ride.toAddress.toLowerCase().includes(toAddress.toLowerCase())
      );
    }
    
    return new Response(JSON.stringify({
      success: true,
      data: {
        rides: filteredRides,
        total: filteredRides.length,
        page: 1,
        totalPages: 1
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Interceptar POST /api/rides
  if (url === '/api/rides' && init?.method === 'POST') {
    const body = JSON.parse(init.body as string);
    
    const newRide = {
      id: `ride-${Date.now()}`,
      ...body,
      driverId: 'current-driver',
      availableSeats: body.maxPassengers,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockRides.push(newRide);
    
    return new Response(JSON.stringify({
      success: true,
      data: { ride: newRide },
      message: "Rota criada com sucesso"
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Para outras requisições, usar fetch original
  return originalFetch(input, init);
};

console.log('🔄 Mock backend ativado - usando dados temporários');