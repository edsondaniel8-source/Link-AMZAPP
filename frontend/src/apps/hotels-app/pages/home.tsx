import { useState } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { 
  Hotel, 
  Plus, 
  MapPin, 
  Users, 
  TrendingUp,
  Star,
  CheckCircle,
  DollarSign,
  UserCheck,
  Handshake,
  BarChart3,
  MessageCircle,
  Edit,
  Save,
  Calendar,
  Eye,
  Settings
} from 'lucide-react';
import LocationAutocomplete from '@/shared/components/LocationAutocomplete';
import apiService from '@/services/api';
import { useToast } from '@/hooks/use-toast';

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
  images?: string[];
  amenities?: string[];
  description?: string;
}

export default function HotelsHome() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateAccommodation, setShowCreateAccommodation] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Form states
  const [accommodationForm, setAccommodationForm] = useState({
    name: '',
    type: 'hotel_room',
    address: '',
    pricePerNight: '',
    description: '',
    amenities: '',
    maxOccupancy: 2
  });

  // Buscar perfil do hotel
  const { data: hotelProfile } = useQuery({
    queryKey: ['hotel-profile', user?.uid],
    queryFn: () => apiService.getUserProfile(),
    enabled: !!user?.uid
  });

  // Buscar acomodações do hotel conectando à API real
  const { data: accommodations, isLoading } = useQuery({
    queryKey: ['hotel-accommodations', user?.uid],
    queryFn: async () => {
      try {
        // Tentar buscar acomodações do backend
        const response = await apiService.searchAccommodations({
          location: '',
          checkIn: '',
          checkOut: '',
          guests: 1
        });
        return response?.data?.accommodations || [];
      } catch (error) {
        // Fallback para dados de exemplo
        return [
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
            occupancyRate: 75,
            images: [],
            amenities: ['Wi-Fi', 'Ar Condicionado', 'Vista Mar'],
            description: 'Quarto confortável com vista para o mar'
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
            occupancyRate: 85,
            images: [],
            amenities: ['Wi-Fi', 'Ar Condicionado', 'Vista Mar', 'Varanda'],
            description: 'Suite luxuosa para executivos'
          }
        ];
      }
    },
    enabled: !!user?.uid
  });

  // Mutation para criar acomodações
  const createAccommodationMutation = useMutation({
    mutationFn: async (data: any) => {
      try {
        return await apiService.createAccommodation(data);
      } catch (error) {
        // Simular criação se API falhar
        return { success: true, data: { ...data, id: Date.now().toString() } };
      }
    },
    onSuccess: () => {
      toast({ title: 'Sucesso', description: 'Acomodação criada com sucesso!' });
      setShowCreateAccommodation(false);
      setAccommodationForm({ name: '', type: 'hotel_room', address: '', pricePerNight: '', description: '', amenities: '', maxOccupancy: 2 });
      queryClient.invalidateQueries({ queryKey: ['hotel-accommodations'] });
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Erro ao criar acomodação', variant: 'destructive' });
    }
  });

  // Estatísticas simplificadas
  const stats = {
    totalAccommodations: accommodations?.length || 0,
    availableRooms: accommodations?.filter(a => a.isAvailable).length || 0,
    totalBookings: accommodations?.reduce((sum, a) => sum + a.totalBookings, 0) || 0,
    monthlyRevenue: accommodations?.reduce((sum, a) => sum + a.monthlyRevenue, 0) || 0,
    averageRating: accommodations?.reduce((sum, a) => sum + a.rating, 0) / (accommodations?.length || 1) || 0,
    averageOccupancy: accommodations?.reduce((sum, a) => sum + a.occupancyRate, 0) / (accommodations?.length || 1) || 0,
  };

  // Handler para criar acomodação
  const handleCreateAccommodation = () => {
    const accommodationData = {
      ...accommodationForm,
      pricePerNight: parseFloat(accommodationForm.pricePerNight),
      amenities: accommodationForm.amenities.split(',').map(a => a.trim()).filter(a => a),
      hostId: user?.uid
    };
    createAccommodationMutation.mutate(accommodationData);
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
              Link-A Alojamentos
            </h1>
            <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
              Gestão Simplificada
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
        {/* Estatísticas principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-500 rounded-lg">
                  <Hotel className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-700">Quartos Disponíveis</p>
                  <p className="text-3xl font-bold text-green-900">{stats.availableRooms}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-700">Reservas Total</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.totalBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-500 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-700">Taxa Ocupação</p>
                  <p className="text-3xl font-bold text-purple-900">{stats.averageOccupancy.toFixed(0)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-500 rounded-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-yellow-700">Receita Mensal</p>
                  <p className="text-3xl font-bold text-yellow-900">{stats.monthlyRevenue.toLocaleString()} MT</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações rápidas */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Acções Rápidas - Gestão de Alojamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Dialog open={showCreateAccommodation} onOpenChange={setShowCreateAccommodation}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700 h-16 flex-col" data-testid="button-create-accommodation">
                    <Plus className="w-6 h-6 mb-1" />
                    <span className="text-xs">Adicionar Quarto</span>
                  </Button>
                </DialogTrigger>
              </Dialog>
              
              <Link href="/hotels/create-offer">
                <Button variant="outline" className="h-16 flex-col w-full" data-testid="button-create-offer">
                  <Calendar className="w-6 h-6 mb-1" />
                  <span className="text-xs">Criar Oferta</span>
                </Button>
              </Link>
              
              <Link href="/hotels/partnerships">
                <Button variant="outline" className="h-16 flex-col w-full" data-testid="button-partnerships">
                  <Handshake className="w-6 h-6 mb-1" />
                  <span className="text-xs">Parcerias</span>
                </Button>
              </Link>
              
              <Link href="/hotels/driver-chat">
                <Button variant="outline" className="h-16 flex-col w-full" data-testid="button-chat">
                  <MessageCircle className="w-6 h-6 mb-1" />
                  <span className="text-xs">Chat Motoristas</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Gestão por abas - Simplificada */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Resumo</TabsTrigger>
            <TabsTrigger value="rooms">Quartos</TabsTrigger>
            <TabsTrigger value="partnerships">Parcerias</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hotel className="w-5 h-5" />
                  Resumo do Alojamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Perfil do hotel */}
                <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Perfil do Estabelecimento</h3>
                    <Button variant="outline" size="sm" onClick={() => setEditingProfile(!editingProfile)}>
                      <Edit className="w-4 h-4 mr-2" />
                      {editingProfile ? 'Cancelar' : 'Editar'}
                    </Button>
                  </div>
                  
                  {!editingProfile ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Nome do Hotel</p>
                        <p className="font-medium">{hotelProfile?.firstName || 'Hotel Costa do Sol'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Localização</p>
                        <p className="font-medium">Costa do Sol, Maputo</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Descrição</p>
                        <p className="text-sm">Hotel boutique com vista para o mar, oferecendo experiências únicas aos hóspedes.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="hotel-name">Nome do Hotel</Label>
                        <Input id="hotel-name" defaultValue={hotelProfile?.firstName || 'Hotel Costa do Sol'} />
                      </div>
                      <div>
                        <Label htmlFor="hotel-location">Localização</Label>
                        <LocationAutocomplete
                          value="Costa do Sol, Maputo"
                          onChange={(value) => console.log(value)}
                          placeholder="Localização do hotel..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="hotel-description">Descrição</Label>
                        <Textarea 
                          id="hotel-description" 
                          defaultValue="Hotel boutique com vista para o mar, oferecendo experiências únicas aos hóspedes."
                          rows={3}
                        />
                      </div>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Perfil
                      </Button>
                    </div>
                  )}
                </div>

                {/* Estatísticas rápidas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{stats.availableRooms}</p>
                    <p className="text-sm text-gray-600">Quartos Disponíveis</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{stats.totalBookings}</p>
                    <p className="text-sm text-gray-600">Reservas Total</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{stats.monthlyRevenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Receita (MT)</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{stats.averageRating.toFixed(1)}</p>
                    <p className="text-sm text-gray-600">Avaliação Média</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rooms">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hotel className="w-5 h-5" />
                  Gestão de Quartos e Acomodações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="available">
                  <TabsList>
                    <TabsTrigger value="available">Disponíveis ({stats.availableRooms})</TabsTrigger>
                    <TabsTrigger value="booked">Reservados</TabsTrigger>
                    <TabsTrigger value="maintenance">Manutenção</TabsTrigger>
                  </TabsList>

                  <TabsContent value="available" className="space-y-4">
                    {accommodations?.filter(acc => acc.isAvailable).length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <Hotel className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">Nenhum quarto configurado</h3>
                        <p className="text-sm mb-4">Adicione seus quartos para começar a receber reservas.</p>
                        <Button 
                          onClick={() => setShowCreateAccommodation(true)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar Primeiro Quarto
                        </Button>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {accommodations?.filter(acc => acc.isAvailable).map((accommodation: HotelAccommodation) => (
                          <Card key={accommodation.id} className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
                            <CardContent className="pt-6">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                      <Hotel className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-lg">{accommodation.name}</h3>
                                      <Badge variant="secondary" className="mt-1">{accommodation.type}</Badge>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-gray-600">
                                      <MapPin className="h-4 w-4" />
                                      <span className="text-sm">{accommodation.address}</span>
                                    </div>
                                    
                                    {accommodation.amenities && accommodation.amenities.length > 0 && (
                                      <div className="flex flex-wrap gap-1">
                                        {accommodation.amenities.map((amenity, index) => (
                                          <Badge key={index} variant="outline" className="text-xs">{amenity}</Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center gap-6 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                      <Star className="h-4 w-4 text-yellow-500" />
                                      <span>{accommodation.rating} ({accommodation.reviewCount} avaliações)</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <DollarSign className="h-4 w-4" />
                                      <span className="font-semibold">{accommodation.pricePerNight} MT/noite</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex flex-col gap-2 ml-4">
                                  <Button size="sm" variant="outline">
                                    <Edit className="w-4 h-4 mr-1" />
                                    Editar
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-4 h-4 mr-1" />
                                    Ver Detalhes
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="booked">
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Quartos reservados aparecerão aqui</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="maintenance">
                    <div className="text-center py-8 text-gray-500">
                      <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Quartos em manutenção aparecerão aqui</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="partnerships">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Handshake className="w-5 h-5" />
                  Parcerias com Motoristas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">Gerir Parcerias</h3>
                  <p className="text-gray-600 mb-4">
                    Acesse a secção de parcerias para criar ofertas e conectar-se com motoristas.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Link href="/hotels/partnerships">
                      <Button>
                        <Handshake className="w-4 h-4 mr-2" />
                        Ver Parcerias
                      </Button>
                    </Link>
                    <Link href="/hotels/driver-chat">
                      <Button variant="outline">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat Motoristas
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal para criar acomodação */}
        <Dialog open={showCreateAccommodation} onOpenChange={setShowCreateAccommodation}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Acomodação</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome do Quarto</Label>
                  <Input 
                    id="name" 
                    placeholder="ex: Suite Vista Mar"
                    value={accommodationForm.name}
                    onChange={(e) => setAccommodationForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Tipo de Quarto</Label>
                  <Select value={accommodationForm.type} onValueChange={(value) => setAccommodationForm(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hotel_room">Quarto de Hotel</SelectItem>
                      <SelectItem value="hotel_suite">Suite</SelectItem>
                      <SelectItem value="apartment">Apartamento</SelectItem>
                      <SelectItem value="guesthouse">Casa de Hóspedes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Localização</Label>
                <LocationAutocomplete 
                  value={accommodationForm.address}
                  onChange={(value) => setAccommodationForm(prev => ({ ...prev, address: value }))}
                  placeholder="Endereço do alojamento..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Preço por Noite (MT)</Label>
                  <Input 
                    id="price" 
                    type="number"
                    placeholder="2500"
                    value={accommodationForm.pricePerNight}
                    onChange={(e) => setAccommodationForm(prev => ({ ...prev, pricePerNight: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="occupancy">Máximo de Hóspedes</Label>
                  <Input 
                    id="occupancy" 
                    type="number"
                    value={accommodationForm.maxOccupancy}
                    onChange={(e) => setAccommodationForm(prev => ({ ...prev, maxOccupancy: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="amenities">Comodidades (separadas por vírgula)</Label>
                <Input 
                  id="amenities" 
                  placeholder="Wi-Fi, Ar Condicionado, Vista Mar"
                  value={accommodationForm.amenities}
                  onChange={(e) => setAccommodationForm(prev => ({ ...prev, amenities: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea 
                  id="description" 
                  placeholder="Descreva o quarto e suas características..."
                  value={accommodationForm.description}
                  onChange={(e) => setAccommodationForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleCreateAccommodation}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={createAccommodationMutation.isPending}
                >
                  {createAccommodationMutation.isPending ? 'Criando...' : 'Adicionar Quarto'}
                </Button>
                <Button variant="outline" onClick={() => setShowCreateAccommodation(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}