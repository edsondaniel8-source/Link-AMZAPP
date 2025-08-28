import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Search,
  Filter,
  Plus,
  Edit3,
  Settings,
  Eye,
  Trash2,
  Music,
  Star,
  Ticket,
  TrendingUp
} from "lucide-react";
import { Link } from "wouter";

export default function Events() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - seria substituído por dados reais da API
  const events = [
    {
      id: "1",
      title: "Festival de Música Maputo 2024",
      type: "Festival",
      category: "Música",
      description: "O maior festival de música de Moçambique com artistas nacionais e internacionais",
      startDate: "2024-02-15T19:00",
      endDate: "2024-02-15T23:30",
      venue: "Costa do Sol",
      address: "Avenida Marginal, Maputo",
      capacity: 500,
      soldTickets: 387,
      revenue: 96750,
      status: "selling",
      featured: true,
      ticketBatches: [
        { name: "Lote 1", price: 200, sold: 150, total: 200 },
        { name: "Lote 2", price: 250, sold: 137, total: 200 },
        { name: "VIP", price: 400, sold: 100, total: 100 }
      ]
    },
    {
      id: "2",
      title: "Workshop de Fotografia Digital",
      type: "Workshop",
      category: "Educação",
      description: "Aprenda técnicas avançadas de fotografia digital com profissionais",
      startDate: "2024-02-08T14:00",
      endDate: "2024-02-08T18:00",
      venue: "Centro Cultural Franco-Moçambicano",
      address: "Rua Timor Leste, Maputo",
      capacity: 50,
      soldTickets: 42,
      revenue: 8400,
      status: "almost_sold_out",
      featured: false,
      ticketBatches: [
        { name: "Standard", price: 200, sold: 42, total: 50 }
      ]
    },
    {
      id: "3",
      title: "Feira de Artesanato Tradicional",
      type: "Feira",
      category: "Cultura",
      description: "Exposição e venda de artesanato tradicional moçambicano",
      startDate: "2024-02-20T09:00",
      endDate: "2024-02-22T17:00",
      venue: "Praça da Independência",
      address: "Praça da Independência, Maputo",
      capacity: 200,
      soldTickets: 89,
      revenue: 17800,
      status: "selling",
      featured: false,
      ticketBatches: [
        { name: "Individual", price: 100, sold: 59, total: 120 },
        { name: "Família", price: 150, sold: 30, total: 80 }
      ]
    },
    {
      id: "4",
      title: "Concerto de Jazz",
      type: "Show",
      category: "Música",
      description: "Noite especial com os melhores jazzistas de Moçambique",
      startDate: "2024-01-30T20:00",
      endDate: "2024-01-30T23:00",
      venue: "Teatro Avenida",
      address: "Avenida 25 de Setembro, Maputo",
      capacity: 120,
      soldTickets: 120,
      revenue: 36000,
      status: "completed",
      featured: true,
      ticketBatches: [
        { name: "Standard", price: 250, sold: 80, total: 80 },
        { name: "VIP", price: 400, sold: 40, total: 40 }
      ]
    },
    {
      id: "5",
      title: "Conferência de Tecnologia",
      type: "Conferência",
      category: "Tecnologia",
      description: "Tendências em tecnologia e inovação para 2024",
      startDate: "2024-03-05T08:00",
      endDate: "2024-03-05T18:00",
      venue: "Hotel Polana Serena",
      address: "Avenida Julius Nyerere, Maputo",
      capacity: 300,
      soldTickets: 45,
      revenue: 22500,
      status: "selling",
      featured: false,
      ticketBatches: [
        { name: "Early Bird", price: 350, sold: 25, total: 50 },
        { name: "Regular", price: 500, sold: 20, total: 200 },
        { name: "VIP", price: 750, sold: 0, total: 50 }
      ]
    }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.venue.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === "all" || 
                      (activeTab === "active" && ["selling", "almost_sold_out"].includes(event.status)) ||
                      (activeTab === "completed" && event.status === "completed") ||
                      (activeTab === "draft" && event.status === "draft");

    return matchesSearch && matchesTab;
  });

  const stats = {
    total: events.length,
    active: events.filter(e => ["selling", "almost_sold_out"].includes(e.status)).length,
    completed: events.filter(e => e.status === "completed").length,
    draft: events.filter(e => e.status === "draft").length
  };

  const getStatusColor = (status: string) => {
    const colors = {
      selling: "bg-green-100 text-green-800",
      almost_sold_out: "bg-orange-100 text-orange-800",
      sold_out: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
      cancelled: "bg-gray-100 text-gray-800",
      draft: "bg-purple-100 text-purple-800"
    };
    return colors[status] || colors.draft;
  };

  const getStatusText = (status: string) => {
    const texts = {
      selling: "À Venda",
      almost_sold_out: "Quase Esgotado",
      sold_out: "Esgotado",
      completed: "Realizado",
      cancelled: "Cancelado",
      draft: "Rascunho"
    };
    return texts[status] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestão de Eventos</h1>
              <p className="text-gray-600 mt-1">
                Crie e gerencie eventos, lotes de ingressos e experiências únicas
              </p>
            </div>
            <Link to="/events/create">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Criar Evento
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Eventos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Eventos Ativos</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Realizados</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
                </div>
                <Star className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rascunhos</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.draft}</p>
                </div>
                <Edit3 className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar eventos por título, categoria ou local..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtros Avançados
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="all">Todos ({stats.total})</TabsTrigger>
            <TabsTrigger value="active">Ativos ({stats.active})</TabsTrigger>
            <TabsTrigger value="completed">Realizados ({stats.completed})</TabsTrigger>
            <TabsTrigger value="draft">Rascunhos ({stats.draft})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                      <Music className="w-16 h-16 text-purple-400" />
                    </div>
                    {event.featured && (
                      <Badge className="absolute top-4 left-4 bg-yellow-500 text-white">
                        Destaque
                      </Badge>
                    )}
                    <Badge className={`absolute top-4 right-4 ${getStatusColor(event.status)}`}>
                      {getStatusText(event.status)}
                    </Badge>
                  </div>

                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{event.type}</Badge>
                            <Badge variant="outline">{event.category}</Badge>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                    </div>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(event.startDate).toLocaleDateString('pt-MZ')} às {new Date(event.startDate).toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{event.soldTickets}/{event.capacity} participantes</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Vendas</span>
                        <span className="text-sm font-medium">
                          {Math.round((event.soldTickets / event.capacity) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(event.soldTickets / event.capacity) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Revenue */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Receita</span>
                        <span className="font-bold text-green-600">
                          {event.revenue.toLocaleString()} MZN
                        </span>
                      </div>
                    </div>

                    {/* Ticket Batches Summary */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Lotes de Ingressos:</p>
                      <div className="space-y-1">
                        {event.ticketBatches.map((batch, index) => (
                          <div key={index} className="flex justify-between items-center text-xs">
                            <span>{batch.name}</span>
                            <span className="text-gray-600">
                              {batch.sold}/{batch.total} • {batch.price} MZN
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {filteredEvents.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum evento encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                Não há eventos que correspondam aos seus filtros atuais.
              </p>
              <Link to="/events/create">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Evento
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}