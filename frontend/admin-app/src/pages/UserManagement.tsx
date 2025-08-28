import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users,
  Car,
  Building,
  Search,
  Filter,
  Eye,
  UserCheck,
  UserX,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  Ban,
  RefreshCw
} from "lucide-react";

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Mock data - seria substituído por dados reais da API
  const pendingUsers = [
    {
      id: "1",
      type: "driver",
      name: "Carlos Mazive",
      email: "carlos.m@email.com",
      phone: "+258 84 123 4567",
      city: "Maputo",
      registrationDate: "2024-01-28",
      vehicleType: "Sedan Toyota Corolla",
      licenseNumber: "MM123456",
      documentsStatus: "complete",
      verificationLevel: "basic",
      profileImage: null
    },
    {
      id: "2",
      type: "hotel",
      name: "Residencial Alvorada",
      email: "alvorada@hotel.com",
      phone: "+258 23 456 789",
      city: "Beira",
      registrationDate: "2024-01-27",
      category: "3 estrelas",
      rooms: 25,
      documentsStatus: "pending",
      verificationLevel: "business",
      address: "Rua da Manga, 123, Beira"
    },
    {
      id: "3",
      type: "driver",
      name: "Ana Mondlane",
      email: "ana.mondlane@email.com",
      phone: "+258 26 789 012",
      city: "Nampula",
      registrationDate: "2024-01-26",
      vehicleType: "SUV Nissan X-Trail",
      licenseNumber: "NM789012",
      documentsStatus: "complete",
      verificationLevel: "premium",
      profileImage: null
    },
    {
      id: "4",
      type: "event",
      name: "Festival Organizadores Lda",
      email: "info@festivalmz.com",
      phone: "+258 21 345 678",
      city: "Maputo",
      registrationDate: "2024-01-25",
      category: "Organizador de Eventos",
      eventsPlanned: 5,
      documentsStatus: "review",
      verificationLevel: "business",
      website: "festivalmz.com"
    }
  ];

  const activeUsers = [
    {
      id: "1",
      type: "driver",
      name: "João Silva",
      email: "joao.silva@email.com",
      phone: "+258 84 987 6543",
      city: "Maputo",
      joinDate: "2023-12-15",
      status: "active",
      rating: 4.8,
      totalRides: 456,
      earnings: 23500,
      lastActivity: "2024-01-28 14:30"
    },
    {
      id: "2",
      type: "hotel",
      name: "Hotel Polana Serena",
      email: "reservas@polanaserena.com",
      phone: "+258 21 491 000",
      city: "Maputo",
      joinDate: "2023-11-20",
      status: "active",
      rating: 4.9,
      totalBookings: 234,
      earnings: 89750,
      lastActivity: "2024-01-28 16:45"
    },
    {
      id: "3",
      type: "event",
      name: "Maputo Music Events",
      email: "contact@maputomusic.com",
      phone: "+258 84 555 123",
      city: "Maputo",
      joinDate: "2024-01-10",
      status: "active",
      rating: 4.6,
      totalEvents: 12,
      earnings: 15600,
      lastActivity: "2024-01-28 11:20"
    }
  ];

  const suspendedUsers = [
    {
      id: "1",
      type: "driver",
      name: "Pedro Santos",
      email: "pedro.s@email.com",
      phone: "+258 82 123 456",
      city: "Beira",
      suspensionDate: "2024-01-20",
      reason: "Múltiplas reclamações de clientes",
      duration: "30 dias",
      status: "suspended"
    },
    {
      id: "2",
      type: "hotel",
      name: "Pensão Central",
      email: "central@pensao.com",
      phone: "+258 23 789 012",
      city: "Quelimane",
      suspensionDate: "2024-01-18",
      reason: "Violação das políticas de preços",
      duration: "Indefinido",
      status: "suspended"
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      complete: "bg-green-100 text-green-800",
      review: "bg-blue-100 text-blue-800",
      active: "bg-green-100 text-green-800",
      suspended: "bg-red-100 text-red-800",
      basic: "bg-gray-100 text-gray-800",
      premium: "bg-purple-100 text-purple-800",
      business: "bg-blue-100 text-blue-800"
    };
    return colors[status] || colors.pending;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      driver: Car,
      hotel: Building,
      event: Calendar
    };
    return icons[type] || Users;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      driver: "text-purple-600",
      hotel: "text-orange-600", 
      event: "text-blue-600"
    };
    return colors[type] || "text-gray-600";
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      driver: "🚗 Motorista",
      hotel: "🏨 Hotel",
      event: "🎉 Eventos"
    };
    return labels[type] || type;
  };

  const filteredPendingUsers = pendingUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || user.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                👥 Gestão de Utilizadores
              </h1>
              <p className="text-gray-600 mt-1">
                Aprovar, remover e gerir todos os utilizadores da plataforma
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-yellow-600 text-white px-4 py-2">
                {pendingUsers.length} Pendentes
              </Badge>
              <Badge className="bg-green-600 text-white px-4 py-2">
                {activeUsers.length} Ativos
              </Badge>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por nome, email ou telefone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">Todos os tipos</option>
                  <option value="driver">Motoristas</option>
                  <option value="hotel">Hotéis</option>
                  <option value="event">Eventos</option>
                </select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="pending">⏳ Aprovações Pendentes ({pendingUsers.length})</TabsTrigger>
            <TabsTrigger value="active">✅ Utilizadores Ativos ({activeUsers.length})</TabsTrigger>
            <TabsTrigger value="suspended">🚫 Suspensos ({suspendedUsers.length})</TabsTrigger>
          </TabsList>

          {/* Pending Approvals Tab */}
          <TabsContent value="pending">
            <div className="space-y-4">
              {filteredPendingUsers.map((user) => {
                const TypeIcon = getTypeIcon(user.type);
                return (
                  <Card key={user.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <TypeIcon className={`w-8 h-8 ${getTypeColor(user.type)}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                              <Badge variant="outline">{getTypeLabel(user.type)}</Badge>
                              <Badge className={getStatusColor(user.verificationLevel)}>
                                {user.verificationLevel === "basic" ? "Básico" :
                                 user.verificationLevel === "premium" ? "Premium" : "Negócio"}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span>{user.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <span>{user.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{user.city}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>Registado em {new Date(user.registrationDate).toLocaleDateString('pt-MZ')}</span>
                              </div>
                            </div>
                            
                            {/* Type-specific info */}
                            {user.type === "driver" && (
                              <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                                <p className="text-sm"><strong>Veículo:</strong> {user.vehicleType}</p>
                                <p className="text-sm"><strong>Carta de Condução:</strong> {user.licenseNumber}</p>
                              </div>
                            )}
                            {user.type === "hotel" && (
                              <div className="mt-3 p-3 bg-orange-50 rounded-lg">
                                <p className="text-sm"><strong>Categoria:</strong> {user.category}</p>
                                <p className="text-sm"><strong>Quartos:</strong> {user.rooms}</p>
                                <p className="text-sm"><strong>Morada:</strong> {user.address}</p>
                              </div>
                            )}
                            {user.type === "event" && (
                              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm"><strong>Categoria:</strong> {user.category}</p>
                                <p className="text-sm"><strong>Eventos Planeados:</strong> {user.eventsPlanned}</p>
                                <p className="text-sm"><strong>Website:</strong> {user.website}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <Badge className={getStatusColor(user.documentsStatus)}>
                            {user.documentsStatus === "complete" ? "📋 Documentos OK" :
                             user.documentsStatus === "pending" ? "⏳ Pendente" : "🔍 Em Revisão"}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <UserCheck className="w-4 h-4 mr-2" />
                          Aprovar
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileCheck className="w-4 h-4 mr-2" />
                          Ver Documentos
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Contactar
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <UserX className="w-4 h-4 mr-2" />
                          Rejeitar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Active Users Tab */}
          <TabsContent value="active">
            <div className="space-y-4">
              {activeUsers.map((user) => {
                const TypeIcon = getTypeIcon(user.type);
                return (
                  <Card key={user.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <TypeIcon className={`w-8 h-8 ${getTypeColor(user.type)}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                              <Badge variant="outline">{getTypeLabel(user.type)}</Badge>
                              <Badge className={getStatusColor(user.status)}>
                                ✅ Ativo
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span>{user.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <span>{user.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{user.city}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>Ativo desde {new Date(user.joinDate).toLocaleDateString('pt-MZ')}</span>
                              </div>
                            </div>
                            
                            {/* Performance metrics */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-gray-50 rounded-lg">
                              <div className="text-center">
                                <p className="text-lg font-bold text-gray-900">{user.rating}</p>
                                <p className="text-xs text-gray-600">Avaliação</p>
                              </div>
                              <div className="text-center">
                                <p className="text-lg font-bold text-gray-900">
                                  {user.totalRides || user.totalBookings || user.totalEvents}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {user.type === "driver" ? "Corridas" :
                                   user.type === "hotel" ? "Reservas" : "Eventos"}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-lg font-bold text-green-600">
                                  {(user.earnings / 1000).toFixed(1)}K
                                </p>
                                <p className="text-xs text-gray-600">Ganhos (MZN)</p>
                              </div>
                              <div className="text-center">
                                <p className="text-lg font-bold text-blue-600">
                                  {user.lastActivity.split(' ')[1]}
                                </p>
                                <p className="text-xs text-gray-600">Última atividade</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Perfil
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Contactar
                        </Button>
                        <Button size="sm" variant="outline">
                          <Shield className="w-4 h-4 mr-2" />
                          Histórico
                        </Button>
                        <Button size="sm" variant="outline" className="text-orange-600 hover:text-orange-700">
                          <Ban className="w-4 h-4 mr-2" />
                          Suspender
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Suspended Users Tab */}
          <TabsContent value="suspended">
            <div className="space-y-4">
              {suspendedUsers.map((user) => {
                const TypeIcon = getTypeIcon(user.type);
                return (
                  <Card key={user.id} className="hover:shadow-md transition-shadow border-red-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                            <TypeIcon className={`w-8 h-8 text-red-600`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                              <Badge variant="outline">{getTypeLabel(user.type)}</Badge>
                              <Badge className={getStatusColor(user.status)}>
                                🚫 Suspenso
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span>{user.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <span>{user.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{user.city}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>Suspenso em {new Date(user.suspensionDate).toLocaleDateString('pt-MZ')}</span>
                              </div>
                            </div>
                            
                            {/* Suspension details */}
                            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                              <p className="text-sm"><strong>Motivo:</strong> {user.reason}</p>
                              <p className="text-sm"><strong>Duração:</strong> {user.duration}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Reativar
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalhes
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Contactar
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <UserX className="w-4 h-4 mr-2" />
                          Banir Permanente
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}