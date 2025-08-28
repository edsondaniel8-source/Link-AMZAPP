import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle,
  MessageSquare,
  Users,
  Bell,
  Shield,
  Eye,
  UserX,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Send,
  Star,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Ban,
  RefreshCw,
  FileText,
  Headphones,
  Zap
} from "lucide-react";

export default function ModerationSupport() {
  const [activeTab, setActiveTab] = useState("disputes");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data - seria substituído por dados reais da API
  const disputes = [
    {
      id: "1",
      type: "payment",
      title: "Disputa de Pagamento - Corrida #8392",
      description: "Cliente alega que foi cobrado valor incorreto pela corrida",
      reporter: "Maria Santos",
      reporterType: "client",
      defendant: "João Pedro",
      defendantType: "driver",
      amount: 850,
      status: "open",
      priority: "high",
      createdAt: "2024-01-28 14:30",
      lastUpdate: "2024-01-28 16:15",
      assignedTo: "admin@link-a.co.mz"
    },
    {
      id: "2",
      type: "service",
      title: "Reclamação de Serviço - Hotel Plaza",
      description: "Quarto não correspondia às fotos, ar condicionado não funcionava",
      reporter: "Carlos Silva",
      reporterType: "client",
      defendant: "Hotel Plaza",
      defendantType: "hotel",
      amount: 2500,
      status: "investigating",
      priority: "medium",
      createdAt: "2024-01-27 09:20",
      lastUpdate: "2024-01-28 11:30",
      assignedTo: "support@link-a.co.mz"
    },
    {
      id: "3",
      type: "behavior",
      title: "Comportamento Inadequado - Motorista",
      description: "Motorista foi rude e dirigiu de forma perigosa",
      reporter: "Ana Costa",
      reporterType: "client",
      defendant: "Pedro Mondlane",
      defendantType: "driver",
      amount: 0,
      status: "resolved",
      priority: "high",
      createdAt: "2024-01-26 18:45",
      lastUpdate: "2024-01-27 14:20",
      assignedTo: "admin@link-a.co.mz"
    }
  ];

  const supportTickets = [
    {
      id: "1",
      subject: "Problemas com verificação de documentos",
      user: "João Silva",
      userType: "driver",
      email: "joao.silva@email.com",
      phone: "+258 84 123 4567",
      category: "verification",
      status: "open",
      priority: "medium",
      createdAt: "2024-01-28 10:30",
      lastReply: "2024-01-28 14:15",
      assignedTo: "Suporte Técnico"
    },
    {
      id: "2",
      subject: "Erro no processamento de pagamento",
      user: "Hotel Maputo Plaza",
      userType: "hotel",
      email: "reservas@maputo-plaza.com",
      phone: "+258 21 456 789",
      category: "payment",
      status: "investigating",
      priority: "high",
      createdAt: "2024-01-28 08:45",
      lastReply: "2024-01-28 16:30",
      assignedTo: "Suporte Financeiro"
    },
    {
      id: "3",
      subject: "Como configurar eventos recorrentes?",
      user: "Festival Moçambique",
      userType: "event",
      email: "info@festivalmz.com",
      phone: "+258 84 987 654",
      category: "tutorial",
      status: "resolved",
      priority: "low",
      createdAt: "2024-01-27 16:20",
      lastReply: "2024-01-28 09:10",
      assignedTo: "Suporte Geral"
    }
  ];

  const userReports = [
    {
      id: "1",
      reportedUser: "Carlos Mazive",
      reportedUserType: "driver",
      reporterUser: "Maria Santos",
      reason: "Cancelamento excessivo de corridas",
      details: "Cancelou 5 corridas nas últimas 2 semanas sem justificação",
      status: "pending",
      createdAt: "2024-01-28 12:00",
      evidence: ["screenshots", "chat_logs"]
    },
    {
      id: "2",
      reportedUser: "Hotel Vista Mar",
      reportedUserType: "hotel",
      reporterUser: "João Pedro",
      reason: "Preços enganosos",
      details: "Anunciam um preço mas cobram outro no check-in",
      status: "investigating",
      createdAt: "2024-01-27 14:30",
      evidence: ["photos", "receipt"]
    }
  ];

  const globalNotifications = [
    {
      id: "1",
      title: "Manutenção Programada",
      message: "Sistema ficará offline das 02:00 às 04:00 de domingo para manutenção",
      type: "maintenance",
      status: "active",
      createdAt: "2024-01-25",
      targetAudience: "all",
      sentTo: 12547
    },
    {
      id: "2",
      title: "Nova Funcionalidade: Parcerias com Eventos",
      message: "Agora motoristas podem candidatar-se a parcerias com organizadores de eventos",
      type: "feature",
      status: "draft",
      createdAt: "2024-01-28",
      targetAudience: "drivers",
      sentTo: 0
    }
  ];

  const supportStats = {
    totalTickets: 156,
    openTickets: 23,
    averageResponseTime: "2.5h",
    satisfactionRate: 94,
    activeDisputes: 7,
    resolvedToday: 12
  };

  const getStatusColor = (status: string) => {
    const colors = {
      open: "bg-red-100 text-red-800",
      investigating: "bg-yellow-100 text-yellow-800",
      resolved: "bg-green-100 text-green-800",
      pending: "bg-blue-100 text-blue-800",
      active: "bg-green-100 text-green-800",
      draft: "bg-gray-100 text-gray-800"
    };
    return colors[status] || colors.pending;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "text-red-600",
      medium: "text-yellow-600",
      low: "text-green-600"
    };
    return colors[priority] || colors.medium;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      client: Users,
      driver: Shield,
      hotel: MapPin,
      event: Calendar
    };
    return icons[type] || Users;
  };

  const filteredDisputes = disputes.filter(dispute => {
    const matchesSearch = dispute.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dispute.reporter.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || dispute.status === filterStatus;
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
                🚨 Moderação & Suporte
              </h1>
              <p className="text-gray-600 mt-1">
                Resolução de disputas, suporte ao cliente e notificações globais
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-red-600 text-white px-4 py-2">
                {supportStats.activeDisputes} Disputas Ativas
              </Badge>
              <Badge className="bg-blue-600 text-white px-4 py-2">
                {supportStats.openTickets} Tickets Abertos
              </Badge>
            </div>
          </div>
        </div>

        {/* Support Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="p-4">
              <MessageSquare className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Total Tickets</p>
              <p className="font-bold text-blue-600">{supportStats.totalTickets}</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Clock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Abertos</p>
              <p className="font-bold text-orange-600">{supportStats.openTickets}</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Zap className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Tempo Resposta</p>
              <p className="font-bold text-green-600">{supportStats.averageResponseTime}</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Star className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Satisfação</p>
              <p className="font-bold text-yellow-600">{supportStats.satisfactionRate}%</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Disputas</p>
              <p className="font-bold text-red-600">{supportStats.activeDisputes}</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <CheckCircle className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Resolvidos Hoje</p>
              <p className="font-bold text-purple-600">{supportStats.resolvedToday}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar disputas, tickets ou usuários..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">Todos os status</option>
                  <option value="open">Aberto</option>
                  <option value="investigating">Investigando</option>
                  <option value="resolved">Resolvido</option>
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
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="disputes">⚖️ Disputas ({disputes.length})</TabsTrigger>
            <TabsTrigger value="support">🎧 Suporte ({supportTickets.length})</TabsTrigger>
            <TabsTrigger value="reports">📋 Reports ({userReports.length})</TabsTrigger>
            <TabsTrigger value="notifications">📢 Notificações</TabsTrigger>
          </TabsList>

          {/* Disputes Tab */}
          <TabsContent value="disputes">
            <div className="space-y-4">
              {filteredDisputes.map((dispute) => {
                const ReporterIcon = getTypeIcon(dispute.reporterType);
                const DefendantIcon = getTypeIcon(dispute.defendantType);
                return (
                  <Card key={dispute.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{dispute.title}</h3>
                            <Badge className={getStatusColor(dispute.status)}>
                              {dispute.status === "open" ? "🔴 Aberta" :
                               dispute.status === "investigating" ? "🔍 Investigando" : "✅ Resolvida"}
                            </Badge>
                            <Badge variant="outline" className={getPriorityColor(dispute.priority)}>
                              {dispute.priority === "high" ? "🔴 Alta" :
                               dispute.priority === "medium" ? "🟡 Média" : "🟢 Baixa"}
                            </Badge>
                          </div>
                          <p className="text-gray-700 mb-3">{dispute.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                              <div className="flex items-center gap-2 mb-2">
                                <ReporterIcon className="w-4 h-4 text-red-600" />
                                <span className="font-medium text-red-900">Denunciante</span>
                              </div>
                              <p className="font-bold">{dispute.reporter}</p>
                              <p className="text-sm text-gray-600 capitalize">{dispute.reporterType}</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-center gap-2 mb-2">
                                <DefendantIcon className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-blue-900">Denunciado</span>
                              </div>
                              <p className="font-bold">{dispute.defendant}</p>
                              <p className="text-sm text-gray-600 capitalize">{dispute.defendantType}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Criado: {dispute.createdAt}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>Atualizado: {dispute.lastUpdate}</span>
                            </div>
                            {dispute.amount > 0 && (
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Valor: {dispute.amount} MZN</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Eye className="w-4 h-4 mr-2" />
                          Investigar
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Contactar Partes
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="w-4 h-4 mr-2" />
                          Ligar
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Resolver
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
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

          {/* Support Tickets Tab */}
          <TabsContent value="support">
            <div className="space-y-4">
              {supportTickets.map((ticket) => {
                const UserIcon = getTypeIcon(ticket.userType);
                return (
                  <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{ticket.subject}</h3>
                            <Badge className={getStatusColor(ticket.status)}>
                              {ticket.status === "open" ? "🔴 Aberto" :
                               ticket.status === "investigating" ? "🔍 Em Análise" : "✅ Resolvido"}
                            </Badge>
                            <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                              {ticket.priority === "high" ? "🔴 Alta" :
                               ticket.priority === "medium" ? "🟡 Média" : "🟢 Baixa"}
                            </Badge>
                          </div>
                          
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                              <UserIcon className="w-6 h-6 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-bold">{ticket.user}</p>
                              <p className="text-sm text-gray-600 capitalize mb-1">{ticket.userType}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Mail className="w-4 h-4" />
                                  <span>{ticket.email}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Phone className="w-4 h-4" />
                                  <span>{ticket.phone}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Criado: {ticket.createdAt}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>Última resposta: {ticket.lastReply}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Headphones className="w-4 h-4" />
                              <span>Atribuído: {ticket.assignedTo}</span>
                            </div>
                          </div>

                          <div className="p-3 bg-gray-50 rounded-lg mb-4">
                            <Badge variant="outline" className="mb-2 capitalize">
                              {ticket.category === "verification" ? "📋 Verificação" :
                               ticket.category === "payment" ? "💳 Pagamento" : "❓ Tutorial"}
                            </Badge>
                            <p className="text-sm text-gray-700">
                              Categoria: {ticket.category}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Responder
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="w-4 h-4 mr-2" />
                          Ligar
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="w-4 h-4 mr-2" />
                          Email
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Resolver
                        </Button>
                        <Button size="sm" variant="outline">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Transferir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* User Reports Tab */}
          <TabsContent value="reports">
            <div className="space-y-4">
              {userReports.map((report) => {
                const ReportedIcon = getTypeIcon(report.reportedUserType);
                return (
                  <Card key={report.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <h3 className="text-xl font-bold text-gray-900">Report de Usuário</h3>
                            <Badge className={getStatusColor(report.status)}>
                              {report.status === "pending" ? "⏳ Pendente" : "🔍 Investigando"}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                              <div className="flex items-center gap-2 mb-2">
                                <ReportedIcon className="w-4 h-4 text-red-600" />
                                <span className="font-medium text-red-900">Usuário Reportado</span>
                              </div>
                              <p className="font-bold">{report.reportedUser}</p>
                              <p className="text-sm text-gray-600 capitalize">{report.reportedUserType}</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-center gap-2 mb-2">
                                <Users className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-blue-900">Reportado por</span>
                              </div>
                              <p className="font-bold">{report.reporterUser}</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="font-medium text-gray-900 mb-2">Motivo: {report.reason}</p>
                            <p className="text-gray-700 text-sm">{report.details}</p>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Criado: {report.createdAt}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              <span>Evidências: {report.evidence.join(", ")}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Evidências
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Contactar Usuário
                        </Button>
                        <Button size="sm" variant="outline" className="text-orange-600">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Advertir
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <Ban className="w-4 h-4 mr-2" />
                          Suspender
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Resolver
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Global Notifications Tab */}
          <TabsContent value="notifications">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Send New Notification */}
              <Card className="xl:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    📢 Enviar Notificação Global
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título da Notificação
                    </label>
                    <Input placeholder="Ex: Manutenção Programada do Sistema" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mensagem
                    </label>
                    <Textarea
                      placeholder="Digite a mensagem que será enviada para os usuários..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Notificação
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="info">📋 Informativa</option>
                        <option value="warning">⚠️ Aviso</option>
                        <option value="maintenance">🛠️ Manutenção</option>
                        <option value="feature">🎉 Nova Funcionalidade</option>
                        <option value="urgent">🚨 Urgente</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Público Alvo
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="all">👥 Todos os usuários</option>
                        <option value="drivers">🚗 Motoristas</option>
                        <option value="hotels">🏨 Hotéis</option>
                        <option value="events">🎉 Organizadores</option>
                        <option value="clients">👤 Clientes</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="email" className="rounded" defaultChecked />
                      <label htmlFor="email" className="text-sm">Email</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="sms" className="rounded" />
                      <label htmlFor="sms" className="text-sm">SMS</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="push" className="rounded" defaultChecked />
                      <label htmlFor="push" className="text-sm">Push Notification</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="app" className="rounded" defaultChecked />
                      <label htmlFor="app" className="text-sm">In-App</label>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Agora
                    </Button>
                    <Button variant="outline">
                      <Calendar className="w-4 h-4 mr-2" />
                      Agendar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Notification Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>📊 Estatísticas de Notificações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">12,547</p>
                    <p className="text-sm text-gray-600">Usuários Ativos</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Taxa de Entrega</span>
                      <span className="font-bold text-green-600">98.5%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Taxa de Abertura</span>
                      <span className="font-bold text-blue-600">76.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Notificações Hoje</span>
                      <span className="font-bold text-purple-600">5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Notifications */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>📋 Notificações Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {globalNotifications.map((notification) => (
                    <div key={notification.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-lg">{notification.title}</h4>
                          <p className="text-gray-700 text-sm mb-2">{notification.message}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Público: {notification.targetAudience === "all" ? "Todos" : notification.targetAudience}</span>
                            <span>Enviado para: {notification.sentTo.toLocaleString()}</span>
                            <span>Data: {notification.createdAt}</span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(notification.status)}>
                          {notification.status === "active" ? "✅ Enviada" : "📝 Rascunho"}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                        {notification.status === "draft" && (
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Send className="w-4 h-4 mr-1" />
                            Enviar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}