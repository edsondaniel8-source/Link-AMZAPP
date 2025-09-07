import React, { useState } from 'react';
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
import { Switch } from '@/shared/components/ui/switch';
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
  BarChart3,
  PartyPopper,
  MessageCircle,
  Edit,
  Upload,
  Save,
  Eye,
  EyeOff
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

interface HotelProfile {
  id: string;
  name: string;
  address: string;
  description: string;
  amenities: string[];
  images: string[];
  contactEmail: string;
  contactPhone: string;
  isSetup: boolean;
}

interface RoomType {
  id: string;
  name: string;
  description: string;
  pricePerNight: number;
  maxOccupancy: number;
  amenities: string[];
  images: string[];
  isAvailable: boolean;
}

interface HotelEvent {
  id: string;
  title: string;
  description: string;
  eventType: string;
  venue: string;
  startDate: string;
  endDate: string;
  ticketPrice: number;
  maxTickets: number;
  ticketsSold: number;
  status: string;
}

export default function HotelsHome() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateAccommodation, setShowCreateAccommodation] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
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
  
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    eventType: 'festival',
    venue: '',
    startDate: '',
    endDate: '',
    ticketPrice: 0,
    maxTickets: 100
  });

  // Buscar perfil do hotel
  const { data: hotelProfile } = useQuery({
    queryKey: ['hotel-profile', user?.uid],
    queryFn: () => apiService.getUserProfile(),
    enabled: !!user?.uid
  });

  // Buscar acomodações do hotel
  const { data: accommodations, isLoading } = useQuery({
    queryKey: ['hotel-accommodations', user?.uid],
    queryFn: () => apiService.getHotelAccommodations?.(user?.uid),
    enabled: !!user?.uid,
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
    ]
  });

  // Buscar eventos do hotel
  const { data: hotelEvents } = useQuery({
    queryKey: ['hotel-events', user?.uid],
    queryFn: () => apiService.getEvents(),
    enabled: !!user?.uid,
    initialData: [
      {
        id: '1',
        title: 'Festival de Verão na Costa',
        description: 'Evento musical com artistas locais',
        eventType: 'festival',
        venue: 'Costa do Sol Beach',
        startDate: '2025-09-20',
        endDate: '2025-09-22',
        ticketPrice: 150,
        maxTickets: 200,
        ticketsSold: 45,
        status: 'upcoming'
      }
    ]
  });

  // Mutations para criar acomodações e eventos
  const createAccommodationMutation = useMutation({
    mutationFn: (data: any) => apiService.createAccommodation(data),
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

  const createEventMutation = useMutation({
    mutationFn: (data: any) => apiService.createEvent(data),
    onSuccess: () => {
      toast({ title: 'Sucesso', description: 'Evento criado com sucesso!' });
      setShowCreateEvent(false);
      setEventForm({ title: '', description: '', eventType: 'festival', venue: '', startDate: '', endDate: '', ticketPrice: 0, maxTickets: 100 });
      queryClient.invalidateQueries({ queryKey: ['hotel-events'] });
    },
    onError: () => {
      toast({ title: 'Erro', description: 'Erro ao criar evento', variant: 'destructive' });
    }
  });

  // Estatísticas do hotel
  const stats = {
    totalAccommodations: accommodations?.length || 0,
    availableRooms: accommodations?.filter(a => a.isAvailable).length || 0,
    totalBookings: accommodations?.reduce((sum, a) => sum + a.totalBookings, 0) || 0,
    monthlyRevenue: accommodations?.reduce((sum, a) => sum + a.monthlyRevenue, 0) || 0,
    averageRating: accommodations?.reduce((sum, a) => sum + a.rating, 0) / (accommodations?.length || 1) || 0,
    averageOccupancy: accommodations?.reduce((sum, a) => sum + a.occupancyRate, 0) / (accommodations?.length || 1) || 0,
    totalEvents: hotelEvents?.length || 0,
    upcomingEvents: hotelEvents?.filter(e => e.status === 'upcoming').length || 0
  };

  // Handlers
  const handleCreateAccommodation = () => {
    const accommodationData = {
      ...accommodationForm,
      pricePerNight: parseFloat(accommodationForm.pricePerNight),
      amenities: accommodationForm.amenities.split(',').map(a => a.trim()).filter(a => a),
      hostId: user?.uid
    };
    createAccommodationMutation.mutate(accommodationData);
  };

  const handleCreateEvent = () => {
    const eventData = {
      ...eventForm,
      organizerId: user?.uid,
      ticketPrice: parseFloat(eventForm.ticketPrice.toString()),
      maxTickets: parseInt(eventForm.maxTickets.toString())
    };
    createEventMutation.mutate(eventData);
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
        {/* Estatísticas de resumo */}
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
                  <PartyPopper className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-700">Eventos Ativos</p>
                  <p className="text-3xl font-bold text-purple-900">{stats.totalEvents}</p>
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
            <CardTitle>Gestão Simplificada</CardTitle>
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
              
              <Dialog open={showCreateEvent} onOpenChange={setShowCreateEvent}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-16 flex-col" data-testid="button-create-event">
                    <PartyPopper className="w-6 h-6 mb-1" />
                    <span className="text-xs">Criar Evento</span>
                  </Button>
                </DialogTrigger>
              </Dialog>
              
              <Button variant="outline" className="h-16 flex-col" onClick={() => setActiveTab('partnerships')} data-testid="button-partnerships">
                <MessageCircle className="w-6 h-6 mb-1" />
                <span className="text-xs">Chat Parcerias</span>
              </Button>
              
              <Button variant="outline" className="h-16 flex-col" onClick={() => setActiveTab('calendar')} data-testid="button-calendar">
                <Calendar className="w-6 h-6 mb-1" />
                <span className="text-xs">Disponibilidade</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Gestão por abas */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Resumo</TabsTrigger>
            <TabsTrigger value="rooms">Quartos</TabsTrigger>
            <TabsTrigger value="events">Eventos</TabsTrigger>
            <TabsTrigger value="partnerships">Parcerias</TabsTrigger>
            <TabsTrigger value="calendar">Calendário</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hotel className="w-5 h-5" />
                  Resumo do Hotel
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
                    <p className="text-2xl font-bold text-yellow-600">{stats.upcomingEvents}</p>
                    <p className="text-sm text-gray-600">Eventos Ativos</p>
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
                  Gestão de Quartos
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
                          data-testid="button-create-first-accommodation"
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
                                  
                                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                                    <div className="flex items-center gap-1">
                                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                      <span className="font-medium">{accommodation.rating}</span>
                                      <span>({accommodation.reviewCount})</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <BarChart3 className="h-4 w-4" />
                                      <span>{accommodation.occupancyRate}% ocupação</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Users className="h-4 w-4" />
                                      <span>{accommodation.totalBookings} reservas</span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Disponível
                                    </Badge>
                                    <span className="text-sm text-gray-500">
                                      Receita: {accommodation.monthlyRevenue.toLocaleString()} MT/mês
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="text-right ml-6">
                                  <div className="text-2xl font-bold text-green-600 mb-3">
                                    {accommodation.pricePerNight} MT
                                    <span className="text-sm text-gray-500 font-normal">/noite</span>
                                  </div>
                                  <div className="space-y-2">
                                    <Button size="sm" variant="outline" className="w-full" data-testid={`button-edit-accommodation-${accommodation.id}`}>
                                      <Edit className="w-3 h-3 mr-1" />
                                      Editar
                                    </Button>
                                    <Button size="sm" variant="outline" className="w-full" data-testid={`button-toggle-accommodation-${accommodation.id}`}>
                                      <EyeOff className="w-3 h-3 mr-1" />
                                      Ocultar
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="booked">
                    <div className="text-center py-12 text-gray-500">
                      <CheckCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">Quartos Reservados</h3>
                      <p className="text-sm">Quartos com reservas ativas aparecerão aqui.</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="maintenance">
                    <div className="text-center py-12 text-gray-500">
                      <XCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">Quartos em Manutenção</h3>
                      <p className="text-sm">Quartos temporariamente indisponíveis aparecerão aqui.</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PartyPopper className="w-5 h-5" />
                  Gestão de Eventos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hotelEvents?.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <PartyPopper className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Nenhum evento criado</h3>
                    <p className="text-sm mb-4">Crie eventos para atrair mais hóspedes.</p>
                    <Button onClick={() => setShowCreateEvent(true)} className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Primeiro Evento
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {hotelEvents?.map((event: HotelEvent) => (
                      <Card key={event.id} className="border-l-4 border-l-purple-500">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                  <PartyPopper className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-lg">{event.title}</h3>
                                  <Badge variant="secondary">{event.eventType}</Badge>
                                </div>
                              </div>
                              
                              <p className="text-gray-600 mb-3">{event.description}</p>
                              
                              <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>{event.venue}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>{event.startDate} - {event.endDate}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-4 mt-3">
                                <Badge className={`${event.status === 'upcoming' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                  {event.status === 'upcoming' ? 'Próximo' : 'Finalizado'}
                                </Badge>
                                <span className="text-sm text-gray-600">
                                  {event.ticketsSold}/{event.maxTickets} bilhetes vendidos
                                </span>
                              </div>
                            </div>
                            
                            <div className="text-right ml-6">
                              <div className="text-xl font-bold text-purple-600 mb-3">
                                {event.ticketPrice} MT
                                <span className="text-sm text-gray-500 font-normal">/bilhete</span>
                              </div>
                              <div className="space-y-2">
                                <Button size="sm" variant="outline" className="w-full">
                                  <Edit className="w-3 h-3 mr-1" />
                                  Editar
                                </Button>
                                <Button size="sm" variant="outline" className="w-full">
                                  <Eye className="w-3 h-3 mr-1" />
                                  Ver Detalhes
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="partnerships">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Sistema de Parcerias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Sistema de Chat para Parcerias</h3>
                  <p className="text-sm mb-4">Conecte-se com motoristas para criar parcerias mutuamente benéficas.</p>
                  <div className="bg-blue-50 p-4 rounded-lg max-w-md mx-auto">
                    <p className="text-sm text-blue-700">
                      💡 <strong>Dica:</strong> Use o chat para negociar descontos para hóspedes e receber comissões de transfers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Calendário de Disponibilidade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Calendário Simplificado</h3>
                  <p className="text-sm mb-4">Gerencie a disponibilidade dos seus quartos de forma visual.</p>
                  <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <div className="w-4 h-4 bg-green-500 rounded mx-auto mb-2"></div>
                      <p className="text-xs text-green-700">Disponível</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg text-center">
                      <div className="w-4 h-4 bg-red-500 rounded mx-auto mb-2"></div>
                      <p className="text-xs text-red-700">Reservado</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <div className="w-4 h-4 bg-gray-500 rounded mx-auto mb-2"></div>
                      <p className="text-xs text-gray-700">Manutenção</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal para criar acomodação */}
      <Dialog open={showCreateAccommodation} onOpenChange={setShowCreateAccommodation}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Hotel className="w-5 h-5" />
              Adicionar Novo Quarto
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="room-name">Nome do Quarto</Label>
                <Input 
                  id="room-name" 
                  value={accommodationForm.name}
                  onChange={(e) => setAccommodationForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Quarto Duplo Vista Mar"
                  data-testid="input-room-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room-type">Tipo de Quarto</Label>
                <Select value={accommodationForm.type} onValueChange={(value) => setAccommodationForm(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger data-testid="select-room-type">
                    <SelectValue placeholder="Selecionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hotel_room">Quarto Standard</SelectItem>
                    <SelectItem value="hotel_suite">Suite</SelectItem>
                    <SelectItem value="hotel_deluxe">Quarto Deluxe</SelectItem>
                    <SelectItem value="hotel_family">Quarto Familiar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="room-location">Localização</Label>
              <LocationAutocomplete
                value={accommodationForm.address}
                onChange={(value) => setAccommodationForm(prev => ({ ...prev, address: value }))}
                placeholder="Localização do hotel (Moçambique)"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="room-price">Preço por Noite (MT)</Label>
                <Input 
                  id="room-price" 
                  type="number"
                  value={accommodationForm.pricePerNight}
                  onChange={(e) => setAccommodationForm(prev => ({ ...prev, pricePerNight: e.target.value }))}
                  placeholder="Ex: 2500"
                  data-testid="input-room-price"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room-occupancy">Máximo de Hóspedes</Label>
                <Select value={accommodationForm.maxOccupancy.toString()} onValueChange={(value) => setAccommodationForm(prev => ({ ...prev, maxOccupancy: parseInt(value) }))}>
                  <SelectTrigger data-testid="select-room-occupancy">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 pessoa</SelectItem>
                    <SelectItem value="2">2 pessoas</SelectItem>
                    <SelectItem value="3">3 pessoas</SelectItem>
                    <SelectItem value="4">4 pessoas</SelectItem>
                    <SelectItem value="6">6 pessoas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="room-description">Descrição do Quarto</Label>
              <Textarea 
                id="room-description" 
                value={accommodationForm.description}
                onChange={(e) => setAccommodationForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o quarto, suas características e o que o torna especial..."
                rows={3}
                data-testid="textarea-room-description"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="room-amenities">Comodidades (separadas por vírgula)</Label>
              <Input 
                id="room-amenities" 
                value={accommodationForm.amenities}
                onChange={(e) => setAccommodationForm(prev => ({ ...prev, amenities: e.target.value }))}
                placeholder="Wi-Fi, Ar Condicionado, Vista Mar, TV, Frigobar"
                data-testid="input-room-amenities"
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowCreateAccommodation(false)} data-testid="button-cancel-room">
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateAccommodation}
                disabled={createAccommodationMutation.isPending || !accommodationForm.name || !accommodationForm.pricePerNight}
                className="bg-green-600 hover:bg-green-700"
                data-testid="button-save-room"
              >
                {createAccommodationMutation.isPending ? 'Criando...' : 'Criar Quarto'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para criar evento */}
      <Dialog open={showCreateEvent} onOpenChange={setShowCreateEvent}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PartyPopper className="w-5 h-5" />
              Criar Novo Evento
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="event-title">Nome do Evento</Label>
              <Input 
                id="event-title" 
                value={eventForm.title}
                onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Festival de Verão na Costa"
                data-testid="input-event-title"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-type">Tipo de Evento</Label>
                <Select value={eventForm.eventType} onValueChange={(value) => setEventForm(prev => ({ ...prev, eventType: value }))}>
                  <SelectTrigger data-testid="select-event-type">
                    <SelectValue placeholder="Selecionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="festival">Festival</SelectItem>
                    <SelectItem value="concerto">Concerto</SelectItem>
                    <SelectItem value="conferencia">Conferência</SelectItem>
                    <SelectItem value="feira">Feira</SelectItem>
                    <SelectItem value="festa">Festa</SelectItem>
                    <SelectItem value="casamento">Casamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-venue">Local do Evento</Label>
                <LocationAutocomplete
                  value={eventForm.venue}
                  onChange={(value) => setEventForm(prev => ({ ...prev, venue: value }))}
                  placeholder="Local do evento..."
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="event-description">Descrição do Evento</Label>
              <Textarea 
                id="event-description" 
                value={eventForm.description}
                onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o evento, o que os participantes podem esperar..."
                rows={3}
                data-testid="textarea-event-description"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-start">Data de Início</Label>
                <Input 
                  id="event-start" 
                  type="date"
                  value={eventForm.startDate}
                  onChange={(e) => setEventForm(prev => ({ ...prev, startDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  data-testid="input-event-start-date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-end">Data de Fim</Label>
                <Input 
                  id="event-end" 
                  type="date"
                  value={eventForm.endDate}
                  onChange={(e) => setEventForm(prev => ({ ...prev, endDate: e.target.value }))}
                  min={eventForm.startDate || new Date().toISOString().split('T')[0]}
                  data-testid="input-event-end-date"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-price">Preço do Bilhete (MT)</Label>
                <Input 
                  id="event-price" 
                  type="number"
                  value={eventForm.ticketPrice}
                  onChange={(e) => setEventForm(prev => ({ ...prev, ticketPrice: parseFloat(e.target.value) || 0 }))}
                  placeholder="0 para evento gratuito"
                  data-testid="input-event-price"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-capacity">Número Máximo de Bilhetes</Label>
                <Input 
                  id="event-capacity" 
                  type="number"
                  value={eventForm.maxTickets}
                  onChange={(e) => setEventForm(prev => ({ ...prev, maxTickets: parseInt(e.target.value) || 100 }))}
                  placeholder="100"
                  data-testid="input-event-capacity"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowCreateEvent(false)} data-testid="button-cancel-event">
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateEvent}
                disabled={createEventMutation.isPending || !eventForm.title || !eventForm.venue}
                className="bg-purple-600 hover:bg-purple-700"
                data-testid="button-save-event"
              >
                {createEventMutation.isPending ? 'Criando...' : 'Criar Evento'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}