import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  MessageCircle, 
  Navigation,
  CheckCircle,
  XCircle,
  RotateCcw,
  Star,
  Filter,
  Map
} from "lucide-react";
import { Link } from "wouter";

export default function RidesManagement() {
  const [vehicleStatus, setVehicleStatus] = useState("online");
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for rides
  const activeRides = [
    {
      id: "1",
      passenger: "Maria Silva",
      pickup: "Aeroporto Internacional de Maputo",
      destination: "Hotel Polana",
      status: "in_progress",
      startTime: "14:30",
      estimatedDuration: "25 min",
      fare: 350,
      distance: "12km",
      rating: 4.9,
      phone: "+258 84 123 4567",
      specialRequests: "Tem bagagem extra"
    }
  ];

  const availableRides = [
    {
      id: "2",
      pickup: "Shopping Maputo",
      destination: "Universidade Eduardo Mondlane", 
      distance: "8km",
      fare: 220,
      requestTime: "15:15",
      passengerRating: 4.7,
      surge: false
    },
    {
      id: "3",
      pickup: "Costa do Sol",
      destination: "Aeroporto",
      distance: "15km", 
      fare: 420,
      requestTime: "15:30",
      passengerRating: 4.8,
      surge: true,
      surgeMultiplier: 1.5
    }
  ];

  const completedRides = [
    {
      id: "4",
      passenger: "João Santos",
      pickup: "Centro Comercial Tunduru",
      destination: "Marginal de Maputo",
      completedAt: "13:45",
      duration: "18 min",
      fare: 280,
      distance: "7km",
      rating: 5,
      earnings: 252, // After platform commission
      tip: 20
    },
    {
      id: "5", 
      passenger: "Ana Costa",
      pickup: "Polana Cimento",
      destination: "Baixa da Cidade",
      completedAt: "12:30",
      duration: "15 min", 
      fare: 180,
      distance: "5km",
      rating: 4,
      earnings: 162,
      tip: 0
    }
  ];

  const handleAcceptRide = (rideId: string) => {
    console.log("Accepting ride:", rideId);
  };

  const handleRejectRide = (rideId: string) => {
    console.log("Rejecting ride:", rideId);
  };

  const handleCompleteRide = (rideId: string) => {
    console.log("Completing ride:", rideId);
  };

  const handleStartNavigation = (destination: string) => {
    console.log("Starting navigation to:", destination);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">← Dashboard</Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Gestão de Corridas</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Status do Veículo:</span>
                <select 
                  value={vehicleStatus}
                  onChange={(e) => setVehicleStatus(e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="online">Online</option>
                  <option value="busy">Ocupado</option>
                  <option value="offline">Offline</option>
                  <option value="maintenance">Manutenção</option>
                </select>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Ativas ({activeRides.length})
            </TabsTrigger>
            <TabsTrigger value="available" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Disponíveis ({availableRides.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Concluídas ({completedRides.length})
            </TabsTrigger>
          </TabsList>

          {/* Active Rides */}
          <TabsContent value="active">
            <div className="space-y-4">
              {activeRides.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <RotateCcw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Nenhuma corrida ativa no momento</p>
                  </CardContent>
                </Card>
              ) : (
                activeRides.map((ride) => (
                  <Card key={ride.id} className="border-l-4 border-l-green-500">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <User className="w-5 h-5" />
                          {ride.passenger}
                        </CardTitle>
                        <Badge className="bg-green-600">EM PROGRESSO</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Route Info */}
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <MapPin className="w-4 h-4 text-green-600 mr-2" />
                            <span className="font-medium">Origem:</span>
                            <span className="ml-1 text-gray-600">{ride.pickup}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin className="w-4 h-4 text-red-600 mr-2" />
                            <span className="font-medium">Destino:</span>
                            <span className="ml-1 text-gray-600">{ride.destination}</span>
                          </div>
                        </div>

                        {/* Trip Details */}
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Início</p>
                            <p className="font-semibold">{ride.startTime}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Duração Est.</p>
                            <p className="font-semibold">{ride.estimatedDuration}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Tarifa</p>
                            <p className="font-semibold text-green-600">{ride.fare} MZN</p>
                          </div>
                        </div>

                        {/* Special Requests */}
                        {ride.specialRequests && (
                          <div className="bg-yellow-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-yellow-800">Solicitações Especiais:</p>
                            <p className="text-sm text-yellow-700">{ride.specialRequests}</p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <Button 
                            className="flex-1"
                            onClick={() => handleStartNavigation(ride.destination)}
                          >
                            <Navigation className="w-4 h-4 mr-2" />
                            Navegação GPS
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => window.open(`tel:${ride.phone}`)}
                          >
                            <Phone className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => {/* Open chat */}}
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                          <Button 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleCompleteRide(ride.id)}
                          >
                            Concluir
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Available Rides */}
          <TabsContent value="available">
            <div className="space-y-4">
              {availableRides.map((ride) => (
                <Card key={ride.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Solicitado às {ride.requestTime}</span>
                        {ride.surge && (
                          <Badge className="bg-red-600">
                            SURGE {ride.surgeMultiplier}x
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          {ride.fare} MZN
                        </p>
                        <p className="text-sm text-gray-600">{ride.distance}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 text-green-600 mr-2" />
                        <span className="font-medium">Origem:</span>
                        <span className="ml-1 text-gray-600">{ride.pickup}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 text-red-600 mr-2" />
                        <span className="font-medium">Destino:</span>
                        <span className="ml-1 text-gray-600">{ride.destination}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-600">
                          Passageiro: {ride.passengerRating}/5.0
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleStartNavigation(ride.pickup)}
                      >
                        <Map className="w-4 h-4 mr-1" />
                        Ver no Mapa
                      </Button>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleAcceptRide(ride.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Aceitar
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleRejectRide(ride.id)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Rejeitar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Completed Rides */}
          <TabsContent value="completed">
            <div className="space-y-4">
              {completedRides.map((ride) => (
                <Card key={ride.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-semibold">{ride.passenger}</p>
                          <div className="flex items-center text-sm text-gray-600">
                            <Star className="w-3 h-3 text-yellow-500 mr-1" />
                            {ride.rating}/5
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">+{ride.earnings} MZN</p>
                        <p className="text-sm text-gray-600">Concluída às {ride.completedAt}</p>
                        {ride.tip > 0 && (
                          <p className="text-xs text-blue-600">Gorjeta: +{ride.tip} MZN</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">Rota:</span>
                        <span className="ml-1">{ride.pickup} → {ride.destination}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
                        <div>
                          <span className="font-medium">Distância:</span>
                          <span className="ml-1">{ride.distance}</span>
                        </div>
                        <div>
                          <span className="font-medium">Duração:</span>
                          <span className="ml-1">{ride.duration}</span>
                        </div>
                        <div>
                          <span className="font-medium">Tarifa:</span>
                          <span className="ml-1">{ride.fare} MZN</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}