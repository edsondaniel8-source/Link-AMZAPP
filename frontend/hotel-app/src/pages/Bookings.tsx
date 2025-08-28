import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar,
  Search,
  Filter,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  CreditCard,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  MessageSquare,
  UserCheck,
  LogIn,
  LogOut,
  Users
} from "lucide-react";

export default function Bookings() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Mock data - seria substituído por dados reais da API
  const bookings = [
    {
      id: "BK001",
      guestName: "Maria Santos",
      email: "maria@email.com",
      phone: "+258 84 123 4567",
      roomType: "Suite Deluxe",
      roomNumber: "205",
      checkIn: "2024-01-28T14:00",
      checkOut: "2024-01-31T11:00",
      nights: 3,
      guests: 2,
      totalAmount: 4500,
      paidAmount: 4500,
      status: "confirmed",
      paymentMethod: "card",
      specialRequests: "Vista para o mar, check-in tardio",
      createdAt: "2024-01-25T10:30",
      bookingSource: "website"
    },
    {
      id: "BK002", 
      guestName: "João Pedro",
      email: "joao@email.com",
      phone: "+258 87 654 3210",
      roomType: "Quarto Standard",
      roomNumber: "101",
      checkIn: "2024-01-29T15:00",
      checkOut: "2024-01-31T12:00",
      nights: 2,
      guests: 1,
      totalAmount: 2800,
      paidAmount: 0,
      status: "pending_approval",
      paymentMethod: "mpesa",
      specialRequests: "",
      createdAt: "2024-01-28T16:45",
      bookingSource: "mobile_app"
    },
    {
      id: "BK003",
      guestName: "Ana Costa",
      email: "ana@email.com", 
      phone: "+258 82 987 6543",
      roomType: "Suite Premium",
      roomNumber: "301",
      checkIn: "2024-01-30T16:00",
      checkOut: "2024-02-01T10:00",
      nights: 2,
      guests: 4,
      totalAmount: 6400,
      paidAmount: 3200,
      status: "checked_in",
      paymentMethod: "bank_transfer",
      specialRequests: "Berço para bebé, refeições vegetarianas",
      createdAt: "2024-01-22T14:20",
      bookingSource: "phone"
    },
    {
      id: "BK004",
      guestName: "Carlos Silva",
      email: "carlos@email.com",
      phone: "+258 85 555 1234",
      roomType: "Quarto Deluxe",
      roomNumber: "152",
      checkIn: "2024-01-27T14:00",
      checkOut: "2024-01-28T11:00",
      nights: 1,
      guests: 2,
      totalAmount: 1800,
      paidAmount: 1800,
      status: "completed",
      paymentMethod: "card",
      specialRequests: "",
      createdAt: "2024-01-26T09:15",
      bookingSource: "website"
    }
  ];

  const todayCheckIns = bookings.filter(b => 
    new Date(b.checkIn).toDateString() === new Date().toDateString()
  );

  const todayCheckOuts = bookings.filter(b => 
    new Date(b.checkOut).toDateString() === new Date().toDateString()
  );

  const getStatusColor = (status: string) => {
    const colors = {
      pending_approval: "bg-orange-100 text-orange-800",
      confirmed: "bg-blue-100 text-blue-800",
      checked_in: "bg-green-100 text-green-800", 
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return colors[status] || colors.pending_approval;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending_approval: AlertCircle,
      confirmed: CheckCircle,
      checked_in: LogIn,
      completed: CheckCircle,
      cancelled: XCircle
    };
    return icons[status] || AlertCircle;
  };

  const getStatusText = (status: string) => {
    const texts = {
      pending_approval: "Aprovação Pendente",
      confirmed: "Confirmado",
      checked_in: "Check-in Feito",
      completed: "Completado",
      cancelled: "Cancelado"
    };
    return texts[status] || status;
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.roomNumber.includes(searchTerm);
    
    const matchesTab = activeTab === "all" || booking.status === activeTab;
    
    const matchesDate = !selectedDate || 
                       new Date(booking.checkIn).toDateString() === new Date(selectedDate).toDateString() ||
                       new Date(booking.checkOut).toDateString() === new Date(selectedDate).toDateString();

    return matchesSearch && matchesTab && matchesDate;
  });

  const stats = {
    total: bookings.length,
    pendingApproval: bookings.filter(b => b.status === "pending_approval").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    checkedIn: bookings.filter(b => b.status === "checked_in").length,
    todayCheckIns: todayCheckIns.length,
    todayCheckOuts: todayCheckOuts.length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reservas & Check-in</h1>
              <p className="text-gray-600 mt-1">
                Gerencie todas as reservas e processos de check-in/check-out
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-600">Total Reservas</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <AlertCircle className="w-6 h-6 mx-auto mb-2 text-orange-600" />
              <p className="text-2xl font-bold text-orange-600">{stats.pendingApproval}</p>
              <p className="text-xs text-gray-600">Pendentes</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
              <p className="text-xs text-gray-600">Confirmadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <LogIn className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-600">{stats.checkedIn}</p>
              <p className="text-xs text-gray-600">Check-in Feito</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <UserCheck className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold text-purple-600">{stats.todayCheckIns}</p>
              <p className="text-xs text-gray-600">Check-ins Hoje</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <LogOut className="w-6 h-6 mx-auto mb-2 text-red-600" />
              <p className="text-2xl font-bold text-red-600">{stats.todayCheckOuts}</p>
              <p className="text-xs text-gray-600">Check-outs Hoje</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por hóspede, ID da reserva ou quarto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-auto"
                />
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Mais Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="pending_approval">Pendentes</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmadas</TabsTrigger>
            <TabsTrigger value="checked_in">Check-in</TabsTrigger>
            <TabsTrigger value="completed">Completadas</TabsTrigger>
            <TabsTrigger value="cancelled">Canceladas</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="space-y-4">
              {filteredBookings.map((booking) => {
                const StatusIcon = getStatusIcon(booking.status);
                return (
                  <Card key={booking.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        {/* Guest Info */}
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            booking.status === 'confirmed' ? 'bg-blue-100' :
                            booking.status === 'checked_in' ? 'bg-green-100' :
                            booking.status === 'pending_approval' ? 'bg-orange-100' :
                            'bg-gray-100'
                          }`}>
                            <StatusIcon className={`w-6 h-6 ${
                              booking.status === 'confirmed' ? 'text-blue-600' :
                              booking.status === 'checked_in' ? 'text-green-600' :
                              booking.status === 'pending_approval' ? 'text-orange-600' :
                              'text-gray-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-bold text-lg text-gray-900">
                                  {booking.guestName}
                                </h3>
                                <p className="text-sm text-gray-600">ID: {booking.id}</p>
                              </div>
                              <Badge className={getStatusColor(booking.status)}>
                                {getStatusText(booking.status)}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span>{booking.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span>{booking.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span>{booking.roomType} - {booking.roomNumber}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Booking Details */}
                        <div className="lg:w-80 space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Check-in</p>
                              <p className="font-medium">
                                {new Date(booking.checkIn).toLocaleDateString('pt-MZ')}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(booking.checkIn).toLocaleTimeString('pt-MZ', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Check-out</p>
                              <p className="font-medium">
                                {new Date(booking.checkOut).toLocaleDateString('pt-MZ')}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(booking.checkOut).toLocaleTimeString('pt-MZ', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Noites</p>
                              <p className="font-medium">{booking.nights}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Hóspedes</p>
                              <p className="font-medium flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {booking.guests}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Total</p>
                              <p className="font-bold text-green-600">
                                {booking.totalAmount.toLocaleString()} MZN
                              </p>
                            </div>
                          </div>

                          {booking.specialRequests && (
                            <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                              <p className="font-medium text-yellow-800">Pedidos especiais:</p>
                              <p className="text-yellow-700">{booking.specialRequests}</p>
                            </div>
                          )}

                          {/* Payment Status */}
                          <div className="flex items-center gap-2 text-sm">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            <span>
                              {booking.paidAmount === booking.totalAmount ? (
                                <Badge className="bg-green-100 text-green-800">Pago</Badge>
                              ) : booking.paidAmount > 0 ? (
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  Parcial ({booking.paidAmount.toLocaleString()} MZN)
                                </Badge>
                              ) : (
                                <Badge className="bg-red-100 text-red-800">Pendente</Badge>
                              )}
                            </span>
                            <span className="text-gray-500">via {booking.paymentMethod}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 lg:w-32">
                          {booking.status === "pending_approval" && (
                            <>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Aprovar
                              </Button>
                              <Button size="sm" variant="outline">
                                <XCircle className="w-4 h-4 mr-1" />
                                Rejeitar
                              </Button>
                            </>
                          )}
                          {booking.status === "confirmed" && (
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              <LogIn className="w-4 h-4 mr-1" />
                              Check-in
                            </Button>
                          )}
                          {booking.status === "checked_in" && (
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                              <LogOut className="w-4 h-4 mr-1" />
                              Check-out
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            Detalhes
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Contactar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {filteredBookings.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma reserva encontrada
              </h3>
              <p className="text-gray-600">
                Não há reservas que correspondam aos seus filtros atuais.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}