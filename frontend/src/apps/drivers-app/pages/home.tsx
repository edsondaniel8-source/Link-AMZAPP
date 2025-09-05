import React, { useState } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { 
  Car, 
  Plus, 
  Calendar, 
  MapPin, 
  Users, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Settings,
  UserCheck,
  Route
} from 'lucide-react';
import apiService from '@/services/api';

interface DriverRide {
  id: string;
  fromAddress: string;
  toAddress: string;
  departureDate: string;
  price: string;
  maxPassengers: number;
  availableSeats: number;
  status: 'active' | 'completed' | 'cancelled';
  bookings: number;
  revenue: number;
}

export default function DriversHome() {
  const { user } = useAuth();
  const [showCreateRide, setShowCreateRide] = useState(false);

  // Buscar viagens do motorista
  const { data: driverRides, isLoading } = useQuery({
    queryKey: ['driver-rides', user?.uid],
    queryFn: () => apiService.getDriverRides(user?.uid),
    enabled: !!user?.uid,
    // Dados mock por enquanto
    initialData: [
      {
        id: '1',
        fromAddress: 'Maputo',
        toAddress: 'Beira',
        departureDate: '2025-09-15',
        price: '1500',
        maxPassengers: 4,
        availableSeats: 2,
        status: 'active' as const,
        bookings: 2,
        revenue: 3000
      },
      {
        id: '2',
        fromAddress: 'Maputo',
        toAddress: 'Inhambane',
        departureDate: '2025-09-18',
        price: '800',
        maxPassengers: 4,
        availableSeats: 4,
        status: 'active' as const,
        bookings: 0,
        revenue: 0
      }
    ]
  });

  // Estatísticas do motorista
  const stats = {
    totalRides: driverRides?.length || 0,
    activeRides: driverRides?.filter(r => r.status === 'active').length || 0,
    totalBookings: driverRides?.reduce((sum, r) => sum + r.bookings, 0) || 0,
    totalRevenue: driverRides?.reduce((sum, r) => sum + r.revenue, 0) || 0,
    rating: 4.8,
    completedTrips: 25
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <Car className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
            <p className="text-gray-600 mb-4">
              Esta área é exclusiva para motoristas registados.
            </p>
            <Link href="/login">
              <Button className="w-full">Fazer Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Link-A Motoristas
            </h1>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
              Área do Motorista
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/" data-testid="link-main-app">
              <Button variant="outline">
                🏠 App Principal
              </Button>
            </Link>
            <Button variant="ghost" data-testid="button-user-menu">
              <UserCheck className="w-4 h-4 mr-2" />
              {user.email?.split('@')[0]}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Estatísticas de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Car className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Viagens Ativas</p>
                  <p className="text-2xl font-bold">{stats.activeRides}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Reservas</p>
                  <p className="text-2xl font-bold">{stats.totalBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Receita</p>
                  <p className="text-2xl font-bold">{stats.totalRevenue} MT</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avaliação</p>
                  <p className="text-2xl font-bold">{stats.rating}/5</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações rápidas */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => setShowCreateRide(true)}
                className="bg-blue-600 hover:bg-blue-700"
                data-testid="button-create-ride"
              >
                <Plus className="w-4 h-4 mr-2" />
                Publicar Nova Viagem
              </Button>
              
              <Button variant="outline" data-testid="button-view-bookings">
                <Calendar className="w-4 h-4 mr-2" />
                Ver Reservas
              </Button>
              
              <Button variant="outline" data-testid="button-manage-routes">
                <Route className="w-4 h-4 mr-2" />
                Gerir Rotas
              </Button>
              
              <Button variant="outline" data-testid="button-settings">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Gestão de viagens */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="w-5 h-5" />
              As Minhas Viagens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active">
              <TabsList>
                <TabsTrigger value="active">Ativas</TabsTrigger>
                <TabsTrigger value="completed">Concluídas</TabsTrigger>
                <TabsTrigger value="cancelled">Canceladas</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4">
                {driverRides?.filter(ride => ride.status === 'active').length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma viagem ativa no momento.</p>
                    <Button 
                      onClick={() => setShowCreateRide(true)}
                      className="mt-4"
                      data-testid="button-create-first-ride"
                    >
                      Publicar Primeira Viagem
                    </Button>
                  </div>
                ) : (
                  driverRides?.filter(ride => ride.status === 'active').map((ride: DriverRide) => (
                    <Card key={ride.id} className="border-l-4 border-l-green-500">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="h-4 w-4 text-blue-600" />
                              <span className="font-medium">{ride.fromAddress}</span>
                              <span className="text-gray-400">→</span>
                              <span className="font-medium">{ride.toAddress}</span>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(ride.departureDate).toLocaleDateString('pt-MZ')}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {ride.availableSeats}/{ride.maxPassengers} lugares
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <Badge 
                                variant={ride.availableSeats > 0 ? "default" : "secondary"}
                                className={ride.availableSeats > 0 ? "bg-green-100 text-green-700" : ""}
                              >
                                {ride.availableSeats > 0 ? "Disponível" : "Lotado"}
                              </Badge>
                              <span className="text-sm text-gray-600">
                                {ride.bookings} reserva(s) • {ride.revenue} MT recebido
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-xl font-bold text-green-600 mb-2">
                              {ride.price} MT
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" data-testid={`button-edit-ride-${ride.id}`}>
                                Editar
                              </Button>
                              <Button size="sm" variant="outline" data-testid={`button-cancel-ride-${ride.id}`}>
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="completed">
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Viagens concluídas aparecerão aqui.</p>
                </div>
              </TabsContent>

              <TabsContent value="cancelled">
                <div className="text-center py-8 text-gray-500">
                  <XCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Viagens canceladas aparecerão aqui.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Modal para criar viagem (placeholder) */}
      {showCreateRide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Publicar Nova Viagem</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Funcionalidade em desenvolvimento. Em breve poderá publicar viagens diretamente aqui.
              </p>
              <Button 
                onClick={() => setShowCreateRide(false)}
                className="w-full"
                data-testid="button-close-create-modal"
              >
                Fechar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}