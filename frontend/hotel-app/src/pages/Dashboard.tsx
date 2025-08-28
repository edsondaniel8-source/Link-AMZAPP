import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Hotel, 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp,
  Star,
  Eye,
  MessageSquare,
  Plus,
  BarChart3,
  Settings,
  CheckCircle,
  Clock,
  AlertCircle,
  BedDouble
} from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();

  // Mock data - seria substituído por dados reais da API
  const stats = {
    totalRooms: 40,
    occupiedRooms: 34,
    occupancyRate: 85,
    todayRevenue: 28500,
    monthlyRevenue: 456780,
    pendingBookings: 5,
    checkInsToday: 18,
    checkOutsToday: 12,
    averageRating: 4.7,
    totalReviews: 128
  };

  const todayCheckIns = [
    {
      id: "1",
      guestName: "Maria Santos",
      roomType: "Quarto Duplo Superior",
      checkInTime: "14:00",
      nights: 3,
      status: "confirmed",
      pricePerNight: 1250
    },
    {
      id: "2",
      guestName: "João Pedro",
      roomType: "Suite Executiva", 
      checkInTime: "15:30",
      nights: 2,
      status: "pending",
      pricePerNight: 2100
    },
    {
      id: "3",
      guestName: "Ana Costa",
      roomType: "Quarto Standard",
      checkInTime: "16:00",
      nights: 1,
      status: "confirmed",
      pricePerNight: 950
    }
  ];

  const partnershipProposals = [
    {
      id: "1",
      title: "Transfer VIP Weekend",
      applicants: 12,
      maxDrivers: 15,
      status: "active",
      budget: 8500,
      responseRate: 80
    },
    {
      id: "2",
      title: "Shuttle Aeroporto",
      applicants: 8,
      maxDrivers: 10,
      status: "active", 
      budget: 5200,
      responseRate: 80
    }
  ];

  const weeklyOccupancy = [
    { day: 'Dom', date: '25', occupancy: 78, rooms: '31/40' },
    { day: 'Seg', date: '26', occupancy: 65, rooms: '26/40' },
    { day: 'Ter', date: '27', occupancy: 82, rooms: '33/40' },
    { day: 'Qua', date: '28', occupancy: 85, rooms: '34/40' },
    { day: 'Qui', date: '29', occupancy: 92, rooms: '37/40' },
    { day: 'Sex', date: '30', occupancy: 95, rooms: '38/40' },
    { day: 'Sáb', date: '31', occupancy: 88, rooms: '35/40' },
  ];

  const pendingTasks = [
    {
      id: "1",
      title: "Limpeza urgente - Quarto 205",
      description: "Check-in às 15:00",
      type: "urgent",
      icon: AlertCircle,
      color: "orange"
    },
    {
      id: "2", 
      title: "Confirmar reserva - Ana Costa",
      description: "Check-in amanhã",
      type: "confirm",
      icon: Calendar,
      color: "blue"
    },
    {
      id: "3",
      title: "Atualizar preços fim de semana", 
      description: "Aplicar desconto 15%",
      type: "pricing",
      icon: CheckCircle,
      color: "green"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Painel do Hotel</h1>
            <p className="text-gray-600 mt-1">
              Bem-vindo(a), {user?.firstName || 'Gestor'} - Hotel Costa do Sol
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-700 font-medium">Ativo</span>
            </div>
            <Link to="/partnerships/create">
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Plus className="w-4 h-4 mr-2" />
                Nova Proposta
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Ocupação Hoje</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.occupancyRate}%</p>
                  <p className="text-xs text-blue-700">
                    {stats.occupiedRooms} de {stats.totalRooms} quartos
                  </p>
                </div>
                <BedDouble className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Receita Hoje</p>
                  <p className="text-2xl font-bold text-green-900">
                    {stats.todayRevenue.toLocaleString()} MZN
                  </p>
                  <p className="text-xs text-green-700">+15% vs ontem</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600">Check-ins Hoje</p>
                  <p className="text-2xl font-bold text-orange-900">{stats.checkInsToday}</p>
                  <p className="text-xs text-blue-600">{stats.pendingBookings} pendentes</p>
                </div>
                <Users className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600">Avaliação Média</p>
                  <p className="text-2xl font-bold text-yellow-900">{stats.averageRating}</p>
                  <p className="text-xs text-yellow-700">{stats.totalReviews} avaliações</p>
                </div>
                <CheckCircle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Check-ins Today */}
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Check-ins de Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayCheckIns.map((checkin) => (
                  <div 
                    key={checkin.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      checkin.status === 'confirmed' 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-orange-50 border-orange-200'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        checkin.status === 'confirmed' ? 'bg-blue-500' : 'bg-orange-500'
                      }`}>
                        {checkin.status === 'confirmed' ? (
                          <Users className="h-6 w-6 text-white" />
                        ) : (
                          <AlertCircle className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{checkin.guestName}</p>
                        <p className="text-sm text-gray-600">{checkin.roomType} • {checkin.nights} noites</p>
                        <p className={`text-sm ${
                          checkin.status === 'confirmed' ? 'text-blue-600' : 'text-orange-600'
                        }`}>
                          Check-in: {checkin.checkInTime} - {checkin.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {checkin.pricePerNight.toLocaleString()} MZN/noite
                      </p>
                      <div className="flex space-x-2 mt-2">
                        {checkin.status === 'confirmed' ? (
                          <Button size="sm" className="bg-green-500 hover:bg-green-600">
                            Check-in
                          </Button>
                        ) : (
                          <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                            Preparar
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          {checkin.status === 'confirmed' ? 'Detalhes' : 'Contato'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Partnership Proposals */}
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-orange-600" />
                <span className="text-orange-800">Propostas para Motoristas</span>
              </CardTitle>
              <Badge className="bg-orange-600 text-white w-fit">Nova Feature!</Badge>
              <p className="text-sm text-orange-700">
                Publique ofertas para motoristas e aumente suas reservas!
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
                        <p className="text-sm text-gray-600">
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
                    Crie propostas para atrair motoristas!
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

        {/* Weekly Occupancy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Ocupação Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-4">
              {weeklyOccupancy.map((item, index) => (
                <div key={index} className="text-center">
                  <p className="text-sm font-medium text-gray-600">{item.day}</p>
                  <p className="text-lg font-bold text-gray-900">{item.date}</p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${item.occupancy}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{item.occupancy}%</p>
                    <p className="text-xs text-gray-500">{item.rooms}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Tarefas Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <task.icon className={`h-5 w-5 text-${task.color}-500`} />
                    <div>
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <p className="text-sm text-gray-600">{task.description}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className={`bg-${task.color}-500 hover:bg-${task.color}-600 text-white`}
                  >
                    {task.type === 'urgent' ? 'Urgente' : 
                     task.type === 'confirm' ? 'Confirmar' : 'Aplicar'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/rooms">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Hotel className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <p className="font-medium">Gestão de Quartos</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/bookings">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Calendar className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <p className="font-medium">Reservas & Check-in</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/financial">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <BarChart3 className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <p className="font-medium">Relatórios Financeiros</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/reviews">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Star className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                <p className="font-medium">Avaliações & Reputação</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}