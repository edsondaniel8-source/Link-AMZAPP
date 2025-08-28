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
  AlertCircle,
  Hotel,
  Calendar as CalendarIcon,
  UserCheck
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

  const partnerRequests = [
    {
      id: "1",
      type: "hotel",
      from: "Hotel Cardoso",
      category: "PARCERIA HOTEL",
      title: "Solicitação de Transporte VIP",
      description: "Precisamos de motorista para transfer de hóspedes VIP no fim-de-semana",
      date: "25-27 Jan",
      offer: "+25% tarifa normal",
      priority: "high",
      slots: "3 vagas disponíveis"
    },
    {
      id: "2", 
      type: "event",
      from: "Festival da Praia",
      category: "EVENTO ESPECIAL",
      title: "Transporte para Festival",
      description: "Oportunidade para transportar visitantes durante festival de 3 dias",
      date: "1-3 Fev",
      offer: "Tarifa fixa 500 MZN/viagem",
      priority: "medium",
      slots: "5 motoristas necessários"
    },
    {
      id: "3",
      type: "admin",
      from: "Administração Link-A",
      category: "OPORTUNIDADE ADMIN",
      title: "Programa Motorista Premium",
      description: "Convite para programa de motoristas premium com benefícios exclusivos",
      date: "Permanente",
      offer: "Comissão reduzida 10%",
      priority: "low",
      slots: "Limitado"
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

            {/* Partner Requests - Special Feature */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  Solicitações de Parceiros
                  <Badge variant="destructive" className="ml-2">3 Novas</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {partnerRequests.map((request) => (
                    <div 
                      key={request.id} 
                      className={`border-l-4 rounded-r-lg p-4 bg-gradient-to-r ${
                        request.priority === 'high' ? 'border-red-500 from-red-50 to-red-25' :
                        request.priority === 'medium' ? 'border-yellow-500 from-yellow-50 to-yellow-25' :
                        'border-blue-500 from-blue-50 to-blue-25'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            request.type === 'hotel' ? 'bg-purple-100' :
                            request.type === 'event' ? 'bg-orange-100' : 'bg-gray-100'
                          }`}>
                            {request.type === 'hotel' ? 
                              <Hotel className="w-5 h-5 text-purple-600" /> :
                              request.type === 'event' ?
                              <CalendarIcon className="w-5 h-5 text-orange-600" /> :
                              <AlertCircle className="w-5 h-5 text-gray-600" />
                            }
                          </div>
                          <div>
                            <Badge variant="outline" className="text-xs mb-1">
                              {request.category}
                            </Badge>
                            <h4 className="font-semibold text-gray-900">{request.title}</h4>
                            <p className="text-sm text-gray-600">{request.from}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={
                            request.priority === 'high' ? 'bg-red-600' :
                            request.priority === 'medium' ? 'bg-yellow-600' : 'bg-blue-600'
                          }>
                            {request.priority === 'high' ? 'URGENTE' :
                             request.priority === 'medium' ? 'IMPORTANTE' : 'NORMAL'}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 mb-3">{request.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Data:</span>
                          <span className="ml-1">{request.date}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Vagas:</span>
                          <span className="ml-1">{request.slots}</span>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg mb-4">
                        <p className="font-semibold text-green-700 text-center">{request.offer}</p>
                      </div>

                      <div className="flex space-x-2">
                        <Button className="flex-1 bg-green-600 hover:bg-green-700">
                          Interessado
                        </Button>
                        <Button variant="outline" className="flex-1">
                          Mais Info
                        </Button>
                        <Button variant="ghost" size="sm">
                          ✕
                        </Button>
                      </div>
                    </div>
                  ))}
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