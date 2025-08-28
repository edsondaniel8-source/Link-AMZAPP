import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Ticket,
  Users,
  DollarSign,
  TrendingUp,
  MapPin,
  Clock,
  Star,
  Eye,
  MessageSquare,
  Plus,
  BarChart3,
  Settings,
  CheckCircle,
  AlertCircle,
  Music
} from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();

  // Mock data - seria substituído por dados reais da API
  const stats = {
    totalEvents: 12,
    activeEvents: 8,
    soldTickets: 2847,
    totalRevenue: 1456780,
    averageAttendance: 78,
    upcomingEvents: 5,
    completedEvents: 4,
    totalCapacity: 3650
  };

  const upcomingEvents = [
    {
      id: "1",
      title: "Festival de Música Maputo 2024",
      type: "Festival",
      date: "2024-02-15",
      time: "19:00",
      venue: "Costa do Sol",
      capacity: 500,
      soldTickets: 387,
      revenue: 96750,
      status: "selling",
      image: "festival.jpg"
    },
    {
      id: "2",
      title: "Workshop de Fotografia",
      type: "Workshop",
      date: "2024-02-08",
      time: "14:00", 
      venue: "Centro Cultural",
      capacity: 50,
      soldTickets: 42,
      revenue: 8400,
      status: "almost_sold_out",
      image: "workshop.jpg"
    },
    {
      id: "3",
      title: "Feira de Artesanato",
      type: "Feira",
      date: "2024-02-20",
      time: "09:00",
      venue: "Praça da Independência",
      capacity: 200,
      soldTickets: 89,
      revenue: 17800,
      status: "selling",
      image: "feira.jpg"
    }
  ];

  const partnershipProposals = [
    {
      id: "1",
      title: "Transfer VIP Festival",
      event: "Festival de Música Maputo 2024",
      applicants: 18,
      maxDrivers: 25,
      status: "active",
      budget: 12500,
      responseRate: 72
    },
    {
      id: "2",
      title: "Shuttle Workshop",
      event: "Workshop de Fotografia", 
      applicants: 6,
      maxDrivers: 8,
      status: "active",
      budget: 3200,
      responseRate: 75
    }
  ];

  const recentSales = [
    {
      id: "1",
      eventTitle: "Festival de Música Maputo 2024",
      customerName: "Maria Santos",
      tickets: 2,
      ticketType: "VIP",
      amount: 1200,
      saleTime: "Há 15 min",
      paymentMethod: "MPesa"
    },
    {
      id: "2",
      eventTitle: "Workshop de Fotografia",
      customerName: "João Pedro",
      tickets: 1,
      ticketType: "Standard",
      amount: 200,
      saleTime: "Há 1h",
      paymentMethod: "Cartão"
    },
    {
      id: "3",
      eventTitle: "Feira de Artesanato",
      customerName: "Ana Costa",
      tickets: 3,
      ticketType: "Família",
      amount: 450,
      saleTime: "Há 2h",
      paymentMethod: "Transferência"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard de Eventos
              </h1>
              <p className="text-gray-600 mt-1">
                Bem-vindo(a), {user?.firstName || 'Organizador'} - Link-A Events
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-purple-100 px-3 py-1 rounded-full">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-purple-700 font-medium">Ativo</span>
              </div>
              <div className="flex space-x-3">
                <Link to="/events/create">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Evento
                  </Button>
                </Link>
                <Link to="/partnerships/create">
                  <Button variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Nova Proposta
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Eventos Ativos</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.activeEvents}</p>
                  <p className="text-xs text-purple-700">
                    {stats.totalEvents} total
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Ingressos Vendidos</p>
                  <p className="text-2xl font-bold text-green-900">{stats.soldTickets.toLocaleString()}</p>
                  <p className="text-xs text-green-700">
                    {Math.round((stats.soldTickets / stats.totalCapacity) * 100)}% da capacidade
                  </p>
                </div>
                <Ticket className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Receita Total</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {stats.totalRevenue.toLocaleString()} MZN
                  </p>
                  <p className="text-xs text-blue-700">+23% vs mês anterior</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Taxa de Comparecimento</p>
                  <p className="text-2xl font-bold text-orange-900">{stats.averageAttendance}%</p>
                  <p className="text-xs text-orange-700">Média dos eventos</p>
                </div>
                <Users className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Upcoming Events */}
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Próximos Eventos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div 
                    key={event.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                          <Music className="w-8 h-8 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{event.title}</h4>
                          <p className="text-sm text-gray-600">{event.type}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>{new Date(event.date).toLocaleDateString('pt-MZ')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span>{event.venue}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge 
                        className={
                          event.status === 'almost_sold_out' 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-green-100 text-green-800'
                        }
                      >
                        {event.status === 'almost_sold_out' ? 'Quase Esgotado' : 'À Venda'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-500">Vendidos</p>
                        <p className="font-medium">{event.soldTickets}/{event.capacity}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(event.soldTickets / event.capacity) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-500">Receita</p>
                        <p className="font-medium text-green-600">
                          {event.revenue.toLocaleString()} MZN
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Ocupação</p>
                        <p className="font-medium">
                          {Math.round((event.soldTickets / event.capacity) * 100)}%
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver Detalhes
                      </Button>
                      <Button size="sm" variant="outline">
                        <BarChart3 className="w-4 h-4 mr-1" />
                        Analytics
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/events">
                <Button variant="outline" className="w-full mt-4">
                  Ver Todos os Eventos
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Partnership Proposals for Drivers */}
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-orange-600" />
                <span className="text-orange-800">Propostas para Motoristas</span>
              </CardTitle>
              <Badge className="bg-orange-600 text-white w-fit">Novo Sistema!</Badge>
              <p className="text-sm text-orange-700">
                Publique ofertas de transporte para seus eventos!
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {partnershipProposals.map((proposal) => (
                  <div 
                    key={proposal.id}
                    className="bg-white rounded-lg p-4 shadow-sm border border-orange-100"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{proposal.title}</h4>
                        <p className="text-sm text-gray-600">{proposal.event}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {proposal.applicants}/{proposal.maxDrivers} candidatos
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-500">Orçamento</p>
                        <p className="font-medium text-green-600">
                          {proposal.budget.toLocaleString()} MZN
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Taxa de Resposta</p>
                        <p className="font-medium">{proposal.responseRate}%</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver Candidatos
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="bg-white rounded-lg p-4 border-2 border-dashed border-orange-200 text-center">
                  <MessageSquare className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm mb-3">
                    Ofereça transporte VIP para seus eventos!
                  </p>
                  <Link to="/partnerships/create">
                    <Button className="bg-orange-600 hover:bg-orange-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Proposta
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Sales */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="w-5 h-5" />
              Vendas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale) => (
                <div 
                  key={sale.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Ticket className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{sale.customerName}</h4>
                      <p className="text-sm text-gray-600">{sale.eventTitle}</p>
                      <p className="text-xs text-gray-500">
                        {sale.tickets} ingresso(s) • {sale.ticketType} • {sale.saleTime}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      {sale.amount.toLocaleString()} MZN
                    </p>
                    <p className="text-sm text-gray-500">{sale.paymentMethod}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/events">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Calendar className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <p className="font-medium">Gestão de Eventos</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/tickets">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Ticket className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <p className="font-medium">Vendas & Ingressos</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/analytics">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <BarChart3 className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <p className="font-medium">Analytics</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/experience">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Star className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                <p className="font-medium">Experiência</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}