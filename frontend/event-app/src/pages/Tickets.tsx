import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Ticket,
  QrCode,
  Users,
  DollarSign,
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  Calendar,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  User,
  Hash
} from "lucide-react";

export default function Tickets() {
  const [activeTab, setActiveTab] = useState("sales");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("all");

  // Mock data - seria substituído por dados reais da API
  const ticketSales = [
    {
      id: "TK001",
      eventTitle: "Festival de Música Maputo 2024",
      customerName: "Maria Santos",
      email: "maria@email.com",
      phone: "+258 84 123 4567",
      ticketType: "VIP",
      quantity: 2,
      unitPrice: 400,
      totalAmount: 800,
      saleDate: "2024-01-28T10:30",
      paymentMethod: "MPesa",
      paymentStatus: "paid",
      ticketStatus: "active",
      qrCode: "QR001-VIP-2024",
      checkedIn: false
    },
    {
      id: "TK002", 
      eventTitle: "Workshop de Fotografia",
      customerName: "João Pedro",
      email: "joao@email.com",
      phone: "+258 87 654 3210",
      ticketType: "Standard",
      quantity: 1,
      unitPrice: 200,
      totalAmount: 200,
      saleDate: "2024-01-27T16:45",
      paymentMethod: "Cartão",
      paymentStatus: "paid",
      ticketStatus: "active",
      qrCode: "QR002-STD-2024",
      checkedIn: false
    },
    {
      id: "TK003",
      eventTitle: "Feira de Artesanato",
      customerName: "Ana Costa",
      email: "ana@email.com",
      phone: "+258 82 987 6543",
      ticketType: "Família",
      quantity: 3,
      unitPrice: 150,
      totalAmount: 450,
      saleDate: "2024-01-26T14:20",
      paymentMethod: "Transferência",
      paymentStatus: "pending",
      ticketStatus: "pending",
      qrCode: "QR003-FAM-2024",
      checkedIn: false
    },
    {
      id: "TK004",
      eventTitle: "Concerto de Jazz",
      customerName: "Carlos Silva", 
      email: "carlos@email.com",
      phone: "+258 85 555 1234",
      ticketType: "Standard",
      quantity: 2,
      unitPrice: 250,
      totalAmount: 500,
      saleDate: "2024-01-25T09:15",
      paymentMethod: "MPesa",
      paymentStatus: "paid",
      ticketStatus: "used",
      qrCode: "QR004-STD-2024",
      checkedIn: true,
      checkInTime: "2024-01-30T19:45"
    }
  ];

  const participantsList = [
    {
      id: "P001",
      eventTitle: "Festival de Música Maputo 2024",
      name: "Maria Santos",
      email: "maria@email.com",
      phone: "+258 84 123 4567",
      ticketType: "VIP",
      quantity: 2,
      registrationDate: "2024-01-28T10:30",
      checkInStatus: "not_arrived",
      specialNeeds: "Acesso para cadeira de rodas"
    },
    {
      id: "P002",
      eventTitle: "Workshop de Fotografia", 
      name: "João Pedro",
      email: "joao@email.com",
      phone: "+258 87 654 3210",
      ticketType: "Standard",
      quantity: 1,
      registrationDate: "2024-01-27T16:45",
      checkInStatus: "not_arrived",
      specialNeeds: ""
    },
    {
      id: "P003",
      eventTitle: "Concerto de Jazz",
      name: "Carlos Silva",
      email: "carlos@email.com",
      phone: "+258 85 555 1234",
      ticketType: "Standard", 
      quantity: 2,
      registrationDate: "2024-01-25T09:15",
      checkInStatus: "checked_in",
      specialNeeds: "",
      checkInTime: "2024-01-30T19:45"
    }
  ];

  const events = [
    "Festival de Música Maputo 2024",
    "Workshop de Fotografia",
    "Feira de Artesanato",
    "Concerto de Jazz"
  ];

  const filteredSales = ticketSales.filter(sale => {
    const matchesSearch = sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEvent = selectedEvent === "all" || sale.eventTitle === selectedEvent;
    
    return matchesSearch && matchesEvent;
  });

  const filteredParticipants = participantsList.filter(participant => {
    const matchesSearch = participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participant.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEvent = selectedEvent === "all" || participant.eventTitle === selectedEvent;
    
    return matchesSearch && matchesEvent;
  });

  const salesStats = {
    totalSales: ticketSales.length,
    totalRevenue: ticketSales.reduce((acc, sale) => acc + sale.totalAmount, 0),
    pendingPayments: ticketSales.filter(s => s.paymentStatus === "pending").length,
    activeTickets: ticketSales.filter(s => s.ticketStatus === "active").length
  };

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      paid: "bg-green-100 text-green-800",
      pending: "bg-orange-100 text-orange-800",
      failed: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800"
    };
    return colors[status] || colors.pending;
  };

  const getTicketStatusColor = (status: string) => {
    const colors = {
      active: "bg-blue-100 text-blue-800",
      used: "bg-gray-100 text-gray-800", 
      expired: "bg-red-100 text-red-800",
      cancelled: "bg-orange-100 text-orange-800",
      pending: "bg-yellow-100 text-yellow-800"
    };
    return colors[status] || colors.pending;
  };

  const getCheckInStatusColor = (status: string) => {
    const colors = {
      checked_in: "bg-green-100 text-green-800",
      not_arrived: "bg-gray-100 text-gray-800",
      no_show: "bg-red-100 text-red-800"
    };
    return colors[status] || colors.not_arrived;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Vendas & Ingressos</h1>
              <p className="text-gray-600 mt-1">
                Acompanhe vendas, gerencie ingressos e faça check-in de participantes
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar Dados
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                <QrCode className="w-4 h-4 mr-2" />
                Scanner QR
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Vendas</p>
                  <p className="text-2xl font-bold text-gray-900">{salesStats.totalSales}</p>
                </div>
                <Ticket className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Receita Total</p>
                  <p className="text-2xl font-bold text-green-600">
                    {salesStats.totalRevenue.toLocaleString()} MZN
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pagamentos Pendentes</p>
                  <p className="text-2xl font-bold text-orange-600">{salesStats.pendingPayments}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ingressos Ativos</p>
                  <p className="text-2xl font-bold text-blue-600">{salesStats.activeTickets}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
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
                  placeholder="Buscar por nome, email ou ID do ingresso..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">Todos os Eventos</option>
                {events.map((event) => (
                  <option key={event} value={event}>{event}</option>
                ))}
              </select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Mais Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="sales">Vendas de Ingressos</TabsTrigger>
            <TabsTrigger value="participants">Lista de Participantes</TabsTrigger>
            <TabsTrigger value="checkin">Check-in no Evento</TabsTrigger>
          </TabsList>

          {/* Sales Tab */}
          <TabsContent value="sales">
            <div className="space-y-4">
              {filteredSales.map((sale) => (
                <Card key={sale.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                      {/* Customer Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <Ticket className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-lg text-gray-900">
                                {sale.customerName}
                              </h3>
                              <p className="text-sm text-gray-600">ID: {sale.id}</p>
                            </div>
                            <div className="flex gap-2">
                              <Badge className={getPaymentStatusColor(sale.paymentStatus)}>
                                {sale.paymentStatus === 'paid' ? 'Pago' : 'Pendente'}
                              </Badge>
                              <Badge className={getTicketStatusColor(sale.ticketStatus)}>
                                {sale.ticketStatus === 'active' ? 'Ativo' : 
                                 sale.ticketStatus === 'used' ? 'Usado' : 'Pendente'}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-3">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span>{sale.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span>{sale.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>{sale.eventTitle}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Hash className="w-4 h-4 text-gray-400" />
                              <span>{sale.qrCode}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{sale.quantity} ingresso(s) • {sale.ticketType}</span>
                            <span>•</span>
                            <span>{sale.paymentMethod}</span>
                            <span>•</span>
                            <span>{new Date(sale.saleDate).toLocaleDateString('pt-MZ')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Sale Details */}
                      <div className="lg:w-64 space-y-3">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Valor Unitário</p>
                          <p className="font-medium">{sale.unitPrice.toLocaleString()} MZN</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="text-xl font-bold text-green-600">
                            {sale.totalAmount.toLocaleString()} MZN
                          </p>
                        </div>
                        
                        {sale.checkedIn && sale.checkInTime && (
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Check-in</p>
                            <p className="text-sm text-green-600 font-medium">
                              {new Date(sale.checkInTime).toLocaleDateString('pt-MZ')} às{' '}
                              {new Date(sale.checkInTime).toLocaleTimeString('pt-MZ', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="w-4 h-4 mr-1" />
                            Ver
                          </Button>
                          <Button size="sm" variant="outline">
                            <QrCode className="w-4 h-4 mr-1" />
                            QR
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Participants Tab */}
          <TabsContent value="participants">
            <div className="space-y-4">
              {filteredParticipants.map((participant) => (
                <Card key={participant.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          participant.checkInStatus === 'checked_in' ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <User className={`w-6 h-6 ${
                            participant.checkInStatus === 'checked_in' ? 'text-green-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{participant.name}</h3>
                          <p className="text-sm text-gray-600">{participant.eventTitle}</p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                            <span>{participant.email}</span>
                            <span>•</span>
                            <span>{participant.phone}</span>
                            <span>•</span>
                            <span>{participant.ticketType}</span>
                            <span>•</span>
                            <span>{participant.quantity} ingresso(s)</span>
                          </div>
                          {participant.specialNeeds && (
                            <p className="text-sm text-orange-600 mt-1">
                              Necessidades especiais: {participant.specialNeeds}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <Badge className={getCheckInStatusColor(participant.checkInStatus)}>
                          {participant.checkInStatus === 'checked_in' ? 'Presente' : 
                           participant.checkInStatus === 'not_arrived' ? 'Não Chegou' : 'Ausente'}
                        </Badge>
                        {participant.checkInTime && (
                          <p className="text-xs text-gray-500 mt-1">
                            Check-in: {new Date(participant.checkInTime).toLocaleTimeString('pt-MZ', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        )}
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            Detalhes
                          </Button>
                          {participant.checkInStatus === 'not_arrived' && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Check-in
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Check-in Tab */}
          <TabsContent value="checkin">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  Check-in no Evento
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Scanner de QR Code</h3>
                  <p className="text-gray-600">
                    Use o scanner para fazer check-in dos participantes no evento
                  </p>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <QrCode className="w-4 h-4 mr-2" />
                    Abrir Scanner
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}