import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Car, 
  Users, 
  TrendingUp,
  Navigation,
  Calendar,
  Star,
  Hotel,
  Calendar as CalendarIcon
} from "lucide-react";
import { Link } from "wouter";

export default function DriverDashboard() {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(true);

  // Mock data - in real app, this would come from API
  const dailyStats = {
    rides: 8,
    earnings: 2450,
    rating: 4.8,
    hoursActive: 6.5
  };

  const pendingRides = [
    {
      id: "1",
      pickup: "Aeroporto Internacional de Maputo",
      destination: "Hotel Polana",
      distance: "12km",
      fare: 350,
      time: "14:30",
      passenger: "Maria Silva",
      rating: 4.9
    },
    {
      id: "2",
      pickup: "Shopping Maputo",
      destination: "Universidade Eduardo Mondlane",
      distance: "8km",
      fare: 220,
      time: "15:15",
      passenger: "João Santos",
      rating: 4.7
    }
  ];


  const upcomingSchedule = [
    {
      time: "16:00",
      type: "pickup",
      location: "Centro Comercial Tunduru",
      client: "Ana Costa"
    },
    {
      time: "17:30", 
      type: "hotel_partner",
      location: "Hotel Polana → Aeroporto",
      client: "Transfer VIP"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Motorista</h1>
              <Badge variant={isOnline ? "default" : "secondary"}>
                {isOnline ? "Online" : "Offline"}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Status:</span>
                <Switch 
                  checked={isOnline} 
                  onCheckedChange={setIsOnline}
                />
              </div>
              <Link href="/profile">
                <Button variant="outline">Perfil</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Daily Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Car className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{dailyStats.rides}</p>
                      <p className="text-sm text-gray-600">Corridas Hoje</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">{dailyStats.earnings}</p>
                      <p className="text-sm text-gray-600">MZN Hoje</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Star className="w-8 h-8 text-yellow-600" />
                    <div>
                      <p className="text-2xl font-bold">{dailyStats.rating}</p>
                      <p className="text-sm text-gray-600">Avaliação</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">{dailyStats.hoursActive}h</p>
                      <p className="text-sm text-gray-600">Horas Ativas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Available Rides */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="w-5 h-5" />
                  Corridas Disponíveis na Área
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingRides.map((ride) => (
                    <div key={ride.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold">{ride.passenger}</p>
                            <div className="flex items-center text-sm text-gray-600">
                              <Star className="w-3 h-3 text-yellow-500 mr-1" />
                              {ride.rating}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">{ride.fare} MZN</p>
                          <p className="text-sm text-gray-600">{ride.distance} • {ride.time}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-green-600 mr-2" />
                          <span className="font-medium">Origem:</span>
                          <span className="ml-1">{ride.pickup}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-red-600 mr-2" />
                          <span className="font-medium">Destino:</span>
                          <span className="ml-1">{ride.destination}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button className="flex-1 bg-green-600 hover:bg-green-700">
                          Aceitar Corrida
                        </Button>
                        <Button variant="outline" className="flex-1">
                          Detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Partnership Opportunities - Featured Section */}
            <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🎯 <span className="text-orange-800">Oportunidades de Parceria</span>
                  <Badge className="bg-orange-600 text-white ml-2">5 Novas</Badge>
                </CardTitle>
                <p className="text-sm text-orange-700">Propostas exclusivas de hotéis e eventos para você!</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Hotel Partnership Post */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <Hotel className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">Hotel Cardoso</h3>
                          <p className="text-sm text-gray-600">Polana • Hotel 5 estrelas</p>
                        </div>
                      </div>
                      <Badge className="bg-purple-600 text-white">HOTEL PREMIUM</Badge>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">🚗 Transfer VIP Weekend</h4>
                      <p className="text-gray-700 text-sm mb-3">
                        Procuramos motoristas profissionais para transfers exclusivos de hóspedes VIP durante o fim-de-semana. 
                        Oportunidade para trabalhar com clientes internacionais e ganhar extra!
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <CalendarIcon className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                        <p className="text-sm font-medium">25-27 Jan</p>
                        <p className="text-xs text-gray-600">Este fim-de-semana</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-1" />
                        <p className="text-sm font-medium">+40%</p>
                        <p className="text-xs text-gray-600">Tarifa premium</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                        <p className="text-sm font-medium">3 Vagas</p>
                        <p className="text-xs text-gray-600">Disponíveis</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <Star className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                        <p className="text-sm font-medium">Bónus</p>
                        <p className="text-xs text-gray-600">+200 MZN/dia</p>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                      <h5 className="font-semibold text-green-800 mb-2">💰 O que você ganha:</h5>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Tarifa premium +40% do valor normal</li>
                        <li>• Bónus diário de 200 MZN por completar 5+ transfers</li>
                        <li>• Gorjetas generosas de hóspedes internacionais</li>
                        <li>• Certificado de Motorista Parceiro VIP</li>
                      </ul>
                    </div>

                    <div className="flex space-x-3">
                      <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                        🎯 Candidatar-me
                      </Button>
                      <Button variant="outline" className="flex-1 border-purple-300 text-purple-700">
                        📞 Contactar Hotel
                      </Button>
                    </div>
                  </div>

                  {/* Event Partnership Post */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <CalendarIcon className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">Festival da Praia</h3>
                          <p className="text-sm text-gray-600">Costa do Sol • Evento Premium</p>
                        </div>
                      </div>
                      <Badge className="bg-orange-600 text-white">EVENTO ESPECIAL</Badge>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">🎪 Transporte Oficial do Festival</h4>
                      <p className="text-gray-700 text-sm mb-3">
                        Seja motorista oficial do maior festival de música de Moçambique! 3 dias de evento com milhares de visitantes. 
                        Oportunidade única para grandes rendimentos!
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <CalendarIcon className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                        <p className="text-sm font-medium">1-3 Fev</p>
                        <p className="text-xs text-gray-600">3 dias consecutivos</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-1" />
                        <p className="text-sm font-medium">500 MZN</p>
                        <p className="text-xs text-gray-600">Tarifa fixa/viagem</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                        <p className="text-sm font-medium">8 Vagas</p>
                        <p className="text-xs text-gray-600">Ainda disponíveis</p>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-red-600 mx-auto mb-1" />
                        <p className="text-sm font-medium">Alta</p>
                        <p className="text-xs text-gray-600">Demanda</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <h5 className="font-semibold text-blue-800 mb-2">🎁 Ofertas e Descontos:</h5>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Tarifa garantida de 500 MZN por viagem (independente da distância)</li>
                        <li>• Combustível gratuito fornecido pelo evento</li>
                        <li>• Refeições gratuitas durante os 3 dias</li>
                        <li>• Entrada VIP gratuita para o festival para você + acompanhante</li>
                        <li>• Bónus de 1000 MZN se completar os 3 dias</li>
                      </ul>
                    </div>

                    <div className="flex space-x-3">
                      <Button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white">
                        🎪 Juntar-me ao Festival
                      </Button>
                      <Button variant="outline" className="flex-1 border-orange-300 text-orange-700">
                        📋 Ver Detalhes
                      </Button>
                    </div>
                  </div>

                  {/* Quick Preview of More Opportunities */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">📢 Mais Oportunidades</h4>
                      <Badge variant="outline">+3 Propostas</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div className="bg-white p-3 rounded-lg">
                        <p className="font-medium text-gray-900">Hotel Polana</p>
                        <p className="text-gray-600">Transfer Aeroporto • +30%</p>
                        <p className="text-green-600 text-xs">28-30 Jan</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <p className="font-medium text-gray-900">Casamento Premium</p>
                        <p className="text-gray-600">Evento Privado • 800 MZN</p>
                        <p className="text-green-600 text-xs">2 Fev</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <p className="font-medium text-gray-900">Conferência SADC</p>
                        <p className="text-gray-600">Evento Oficial • Tarifa VIP</p>
                        <p className="text-green-600 text-xs">5-7 Fev</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-3">
                      Ver Todas as Oportunidades →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            
            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Agenda de Hoje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingSchedule.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.time}</p>
                        <p className="text-sm text-gray-600">{item.location}</p>
                        <p className="text-xs text-gray-500">{item.client}</p>
                      </div>
                      {item.type === 'hotel_partner' && (
                        <Badge variant="secondary" className="text-xs">VIP</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/rides">
                  <Button variant="outline" className="w-full justify-start">
                    <Car className="w-4 h-4 mr-2" />
                    Gestão de Corridas
                  </Button>
                </Link>
                <Link href="/financial">
                  <Button variant="outline" className="w-full justify-start">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Financeiro
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Perfil Profissional
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Taxa de Aceitação</span>
                    <span className="font-bold text-green-600">94%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tempo Resposta</span>
                    <span className="font-bold text-blue-600">1.2 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Cancelamentos</span>
                    <span className="font-bold text-red-600">2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avaliação Média</span>
                    <span className="font-bold text-yellow-600">4.8⭐</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}