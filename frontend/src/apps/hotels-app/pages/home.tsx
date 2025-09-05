import React, { useState } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { 
  Hotel, 
  Plus, 
  Calendar, 
  MapPin, 
  Users, 
  TrendingUp,
  Star,
  CheckCircle,
  XCircle,
  DollarSign,
  Settings,
  UserCheck,
  Handshake,
  BarChart3
} from 'lucide-react';
import apiService from '@/services/api';

interface HotelAccommodation {
  id: string;
  name: string;
  type: string;
  address: string;
  pricePerNight: string;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  totalBookings: number;
  monthlyRevenue: number;
  occupancyRate: number;
}

export default function HotelsHome() {
  const { user } = useAuth();
  const [showCreateAccommodation, setShowCreateAccommodation] = useState(false);

  // Buscar acomodações do hotel
  const { data: accommodations, isLoading } = useQuery({
    queryKey: ['hotel-accommodations', user?.uid],
    queryFn: () => apiService.getHotelAccommodations(user?.uid),
    enabled: !!user?.uid,
    // Dados mock por enquanto
    initialData: [
      {
        id: '1',
        name: 'Quarto Duplo Vista Mar',
        type: 'hotel_room',
        address: 'Costa do Sol, Maputo',
        pricePerNight: '2500',
        rating: 4.7,
        reviewCount: 23,
        isAvailable: true,
        totalBookings: 45,
        monthlyRevenue: 112500,
        occupancyRate: 75
      },
      {
        id: '2',
        name: 'Suite Executiva',
        type: 'hotel_suite',
        address: 'Costa do Sol, Maputo',
        pricePerNight: '4000',
        rating: 4.9,
        reviewCount: 18,
        isAvailable: true,
        totalBookings: 28,
        monthlyRevenue: 112000,
        occupancyRate: 85
      }
    ]
  });

  // Estatísticas do hotel
  const stats = {
    totalAccommodations: accommodations?.length || 0,
    availableRooms: accommodations?.filter(a => a.isAvailable).length || 0,
    totalBookings: accommodations?.reduce((sum, a) => sum + a.totalBookings, 0) || 0,
    monthlyRevenue: accommodations?.reduce((sum, a) => sum + a.monthlyRevenue, 0) || 0,
    averageRating: accommodations?.reduce((sum, a) => sum + a.rating, 0) / (accommodations?.length || 1) || 0,
    averageOccupancy: accommodations?.reduce((sum, a) => sum + a.occupancyRate, 0) / (accommodations?.length || 1) || 0
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <Hotel className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
            <p className="text-gray-600 mb-4">
              Esta área é exclusiva para gestores de alojamento registados.
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Link-A Hotéis
            </h1>
            <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
              Área do Alojamento
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
                <Hotel className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Quartos Disponíveis</p>
                  <p className="text-2xl font-bold">{stats.availableRooms}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
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
                  <p className="text-sm font-medium text-gray-600">Receita Mensal</p>
                  <p className="text-2xl font-bold">{stats.monthlyRevenue.toLocaleString()} MT</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Taxa Ocupação</p>
                  <p className="text-2xl font-bold">{stats.averageOccupancy.toFixed(1)}%</p>
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
                onClick={() => setShowCreateAccommodation(true)}
                className="bg-green-600 hover:bg-green-700"
                data-testid="button-create-accommodation"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Quarto
              </Button>
              
              <Button variant="outline" data-testid="button-view-bookings">
                <Calendar className="w-4 h-4 mr-2" />
                Ver Reservas
              </Button>
              
              <Button variant="outline" data-testid="button-partnerships">
                <Handshake className="w-4 h-4 mr-2" />
                Parcerias
              </Button>
              
              <Button variant="outline" data-testid="button-analytics">
                <BarChart3 className="w-4 h-4 mr-2" />
                Relatórios
              </Button>
              
              <Button variant="outline" data-testid="button-settings">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Gestão de acomodações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hotel className="w-5 h-5" />
              As Minhas Acomodações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active">
              <TabsList>
                <TabsTrigger value="active">Disponíveis</TabsTrigger>
                <TabsTrigger value="booked">Reservadas</TabsTrigger>
                <TabsTrigger value="maintenance">Manutenção</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4">
                {accommodations?.filter(acc => acc.isAvailable).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Hotel className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma acomodação disponível no momento.</p>
                    <Button 
                      onClick={() => setShowCreateAccommodation(true)}
                      className="mt-4"
                      data-testid="button-create-first-accommodation"
                    >
                      Adicionar Primeira Acomodação
                    </Button>
                  </div>
                ) : (
                  accommodations?.filter(acc => acc.isAvailable).map((accommodation: HotelAccommodation) => (
                    <Card key={accommodation.id} className="border-l-4 border-l-green-500">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Hotel className="h-4 w-4 text-green-600" />
                              <span className="font-medium text-lg">{accommodation.name}</span>
                              <Badge variant="secondary">{accommodation.type}</Badge>
                            </div>
                            
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-600">{accommodation.address}</span>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                <span>{accommodation.rating}</span>
                                <span>({accommodation.reviewCount} avaliações)</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <BarChart3 className="h-4 w-4" />
                                <span>{accommodation.occupancyRate}% ocupação</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <Badge 
                                variant="default"
                                className="bg-green-100 text-green-700"
                              >
                                Disponível
                              </Badge>
                              <span className="text-sm text-gray-600">
                                {accommodation.totalBookings} reservas • {accommodation.monthlyRevenue.toLocaleString()} MT/mês
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-xl font-bold text-green-600 mb-2">
                              {accommodation.pricePerNight} MT/noite
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" data-testid={`button-edit-accommodation-${accommodation.id}`}>
                                Editar
                              </Button>
                              <Button size="sm" variant="outline" data-testid={`button-disable-accommodation-${accommodation.id}`}>
                                Desativar
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="booked">
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Acomodações reservadas aparecerão aqui.</p>
                </div>
              </TabsContent>

              <TabsContent value="maintenance">
                <div className="text-center py-8 text-gray-500">
                  <XCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Acomodações em manutenção aparecerão aqui.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Modal para criar acomodação (placeholder) */}
      {showCreateAccommodation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Adicionar Nova Acomodação</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Funcionalidade em desenvolvimento. Em breve poderá adicionar acomodações diretamente aqui.
              </p>
              <Button 
                onClick={() => setShowCreateAccommodation(false)}
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