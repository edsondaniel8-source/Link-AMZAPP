import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users,
  Car,
  Building,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  BarChart3,
  Shield,
  Settings,
  Bell,
  Eye,
  UserCheck,
  UserX,
  Activity,
  Globe,
  FileCheck,
  MessageSquare,
  Database,
  Lock,
  Server,
  RefreshCw
} from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock data - seria substituído por dados reais da API
  const platformStats = {
    totalUsers: 12547,
    activeDrivers: 1823,
    activeHotels: 245,
    totalEvents: 89,
    monthlyRevenue: 487500,
    totalRides: 8945,
    pendingApprovals: 23,
    activeDisputes: 7,
    systemHealth: 98.5
  };

  const recentActivity = [
    {
      id: "1",
      type: "user_registration",
      message: "Novo motorista registado: João Silva",
      timestamp: "Há 5 minutos",
      status: "pending",
      action: "approve"
    },
    {
      id: "2", 
      type: "dispute",
      message: "Disputa relatada: Corrida #8392",
      timestamp: "Há 12 minutos",
      status: "urgent",
      action: "resolve"
    },
    {
      id: "3",
      type: "payment",
      message: "Pagamento processado: 2.500 MZN",
      timestamp: "Há 18 minutos", 
      status: "completed",
      action: "view"
    },
    {
      id: "4",
      type: "hotel_approval",
      message: "Hotel pendente: Polana Serena Hotel",
      timestamp: "Há 25 minutos",
      status: "pending",
      action: "review"
    },
    {
      id: "5",
      type: "system",
      message: "Backup automático concluído",
      timestamp: "Há 1 hora",
      status: "completed",
      action: "view"
    }
  ];

  const monthlyGrowth = {
    users: 12.5,
    revenue: 8.3,
    rides: 15.2,
    hotels: 6.7
  };

  const pendingApprovals = [
    {
      id: "1",
      type: "driver",
      name: "Carlos Mazive",
      city: "Maputo",
      documentsStatus: "complete",
      registrationDate: "2024-01-28",
      vehicleType: "Sedan",
      phone: "+258 84 123 4567",
      email: "carlos.m@email.com"
    },
    {
      id: "2",
      type: "hotel",
      name: "Residencial Alvorada",
      city: "Beira",
      documentsStatus: "pending",
      registrationDate: "2024-01-27",
      category: "3 estrelas",
      phone: "+258 23 456 789",
      email: "alvorada@hotel.com"
    },
    {
      id: "3",
      type: "driver",
      name: "Ana Mondlane",
      city: "Nampula",
      documentsStatus: "complete",
      registrationDate: "2024-01-26",
      vehicleType: "SUV",
      phone: "+258 26 789 012",
      email: "ana.mondlane@email.com"
    }
  ];

  const systemMetrics = [
    { name: "Uptime", value: "99.8%", status: "good" },
    { name: "Resposta da API", value: "145ms", status: "good" },
    { name: "Uso do Servidor", value: "67%", status: "warning" },
    { name: "Armazenamento", value: "45%", status: "good" },
    { name: "Base de Dados", value: "Conectada", status: "good" },
    { name: "Backup", value: "Há 2h", status: "good" }
  ];

  const platformConfig = {
    rideCommission: 15,
    hotelCommission: 10,
    eventCommission: 5,
    minimumBalance: 100,
    withdrawalFee: 25,
    verificationRequired: true
  };

  const disputes = [
    {
      id: "1",
      type: "payment",
      title: "Disputa de Pagamento - Corrida #8392",
      user: "Maria Santos",
      driver: "João Pedro",
      amount: 850,
      status: "open",
      priority: "high",
      date: "2024-01-28"
    },
    {
      id: "2",
      type: "service",
      title: "Reclamação de Serviço - Hotel Plaza",
      user: "Carlos Silva",
      hotel: "Hotel Plaza",
      amount: 2500,
      status: "investigating",
      priority: "medium",
      date: "2024-01-27"
    }
  ];

  const getActivityIcon = (type: string) => {
    const icons = {
      user_registration: Users,
      dispute: AlertTriangle,
      payment: DollarSign,
      hotel_approval: Building,
      system: Settings
    };
    return icons[type] || Activity;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      urgent: "bg-red-100 text-red-800",
      completed: "bg-green-100 text-green-800",
      good: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800",
      error: "bg-red-100 text-red-800",
      open: "bg-red-100 text-red-800",
      investigating: "bg-yellow-100 text-yellow-800",
      resolved: "bg-green-100 text-green-800"
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🚀 Painel de Administração
              </h1>
              <p className="text-gray-600 mt-1">
                Controle total da plataforma Link-A - Insights e gestão completa
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-600 text-white px-4 py-2">
                <Globe className="w-4 h-4 mr-2" />
                Sistema Online
              </Badge>
              <Button className="bg-red-600 hover:bg-red-700">
                <Bell className="w-4 h-4 mr-2" />
                {platformStats.pendingApprovals} Pendentes
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">👥 Total de Usuários</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {platformStats.totalUsers.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+{monthlyGrowth.users}%</span>
                  </div>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">💰 Receita Mensal</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(platformStats.monthlyRevenue / 1000).toFixed(0)}K MZN
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+{monthlyGrowth.revenue}%</span>
                  </div>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">🚗 Motoristas Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {platformStats.activeDrivers.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+{monthlyGrowth.rides}%</span>
                  </div>
                </div>
                <Car className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">🏨 Hotéis Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {platformStats.activeHotels}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+{monthlyGrowth.hotels}%</span>
                  </div>
                </div>
                <Building className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">👥 Gestão de Utilizadores</TabsTrigger>
            <TabsTrigger value="analytics">📈 Analytics da Plataforma</TabsTrigger>
            <TabsTrigger value="system">⚙️ Configurações Sistema</TabsTrigger>
            <TabsTrigger value="moderation">🚨 Moderação & Suporte</TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Pending Approvals */}
              <Card className="xl:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    Aprovações Pendentes ({pendingApprovals.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingApprovals.map((approval) => (
                      <div key={approval.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-bold text-lg">{approval.name}</h3>
                              <Badge variant="outline">
                                {approval.type === "driver" ? "🚗 Motorista" : "🏨 Hotel"}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{approval.city}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>Registado em {new Date(approval.registrationDate).toLocaleDateString('pt-MZ')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Car className="w-4 h-4" />
                                <span>{approval.type === "driver" ? approval.vehicleType : approval.category}</span>
                              </div>
                              <div className="text-xs text-gray-500">
                                📞 {approval.phone} | 📧 {approval.email}
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(approval.documentsStatus)}>
                            {approval.documentsStatus === "complete" ? "✅ Documentos OK" : "📋 Pendente"}
                          </Badge>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Aprovar
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileCheck className="w-4 h-4 mr-1" />
                            Ver Documentos
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <UserX className="w-4 h-4 mr-1" />
                            Rejeitar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Ações Administrativas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <UserCheck className="w-4 h-4 mr-2" />
                      Verificar Motoristas ({platformStats.pendingApprovals})
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Building className="w-4 h-4 mr-2" />
                      Aprovar Hotéis (5)
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="w-4 h-4 mr-2" />
                      Gerir Permissões
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Suporte ao Cliente
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>📊 Estatísticas Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Aprovações Hoje</span>
                      <span className="font-bold text-green-600">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Rejeições Hoje</span>
                      <span className="font-bold text-red-600">3</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Taxa de Aprovação</span>
                      <span className="font-bold text-blue-600">80%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Platform Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    📈 Crescimento da Plataforma
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                      <span className="text-blue-600 font-medium">Gráfico de Crescimento Mensal</span>
                      <p className="text-sm text-gray-500 mt-1">Usuários, Receita, Transações</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">+{monthlyGrowth.revenue}%</p>
                      <p className="text-sm text-gray-600">Receita</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">+{monthlyGrowth.users}%</p>
                      <p className="text-sm text-gray-600">Usuários</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🗺️ Distribuição Geográfica</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center border-2 border-dashed border-green-200">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-green-400 mx-auto mb-2" />
                      <span className="text-green-600 font-medium">Mapa de Calor - Moçambique</span>
                      <p className="text-sm text-gray-500 mt-1">Atividade por região</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
                    <div className="text-center p-2 bg-red-50 rounded">
                      <p className="font-bold">Maputo</p>
                      <p className="text-red-600">45%</p>
                    </div>
                    <div className="text-center p-2 bg-orange-50 rounded">
                      <p className="font-bold">Beira</p>
                      <p className="text-orange-600">25%</p>
                    </div>
                    <div className="text-center p-2 bg-yellow-50 rounded">
                      <p className="font-bold">Nampula</p>
                      <p className="text-yellow-600">18%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>💰 Métricas de Receita</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Comissão Transportes</span>
                      <span className="font-bold text-green-600">245K MZN</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium">Comissão Hotéis</span>
                      <span className="font-bold text-blue-600">180K MZN</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium">Comissão Eventos</span>
                      <span className="font-bold text-purple-600">62K MZN</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                      <span className="text-sm font-bold">Total Mensal</span>
                      <span className="font-bold text-gray-900">487K MZN</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>📊 Uso da Plataforma</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>🚗 Transportes</span>
                        <span>60%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>🏨 Acomodações</span>
                        <span>25%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>🎉 Eventos</span>
                        <span>15%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Configuration Tab */}
          <TabsContent value="system">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    ⚙️ Configurações da Plataforma
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm font-medium">Taxa Transportes</span>
                    <span className="font-bold text-purple-600">{platformConfig.rideCommission}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm font-medium">Taxa Hotéis</span>
                    <span className="font-bold text-orange-600">{platformConfig.hotelCommission}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm font-medium">Taxa Eventos</span>
                    <span className="font-bold text-blue-600">{platformConfig.eventCommission}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm font-medium">Saldo Mínimo</span>
                    <span className="font-bold">{platformConfig.minimumBalance} MZN</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm font-medium">Taxa de Levantamento</span>
                    <span className="font-bold">{platformConfig.withdrawalFee} MZN</span>
                  </div>
                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                    <Settings className="w-4 h-4 mr-2" />
                    Alterar Configurações
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    🖥️ Estado do Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {systemMetrics.map((metric, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm text-gray-600">{metric.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{metric.value}</span>
                          <div className={`w-3 h-3 rounded-full ${
                            metric.status === "good" ? "bg-green-500" :
                            metric.status === "warning" ? "bg-yellow-500" : "bg-red-500"
                          }`} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <Button variant="outline" size="sm">
                      <Database className="w-4 h-4 mr-2" />
                      Backup
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Restart
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🔒 Políticas & Segurança</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Verificação Obrigatória</span>
                    <Badge className="bg-green-100 text-green-800">
                      {platformConfig.verificationRequired ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">2FA para Admins</span>
                    <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Logs de Auditoria</span>
                    <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Lock className="w-4 h-4 mr-2" />
                    Gerir Políticas
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>📱 Configurações de Pagamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">M-Pesa</span>
                    <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">E-Mola</span>
                    <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cartão de Crédito</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Em Teste</Badge>
                  </div>
                  <Button variant="outline" className="w-full">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Configurar Pagamentos
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Moderation & Support Tab */}
          <TabsContent value="moderation">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Active Disputes */}
              <Card className="xl:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    🚨 Disputas Ativas ({disputes.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {disputes.map((dispute) => (
                      <div key={dispute.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-lg mb-1">{dispute.title}</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>👤 Cliente: {dispute.user}</p>
                              <p>🏢 Prestador: {dispute.driver || dispute.hotel}</p>
                              <p>💰 Valor: {dispute.amount} MZN</p>
                              <p>📅 Data: {new Date(dispute.date).toLocaleDateString('pt-MZ')}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(dispute.status)}>
                              {dispute.status === "open" ? "🔴 Aberta" : 
                               dispute.status === "investigating" ? "🔍 Investigando" : "✅ Resolvida"}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">
                              Prioridade: {dispute.priority === "high" ? "🔴 Alta" : 
                                          dispute.priority === "medium" ? "🟡 Média" : "🟢 Baixa"}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Eye className="w-4 h-4 mr-1" />
                            Investigar
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Contactar Partes
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Resolver
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Support Actions */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      🎧 Centro de Suporte
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Tickets Urgentes (3)
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat ao Vivo (12 ativos)
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Bell className="w-4 h-4 mr-2" />
                      Notificação Global
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="w-4 h-4 mr-2" />
                      Reports de Usuários
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>🔧 Ferramentas de Moderação</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <UserX className="w-4 h-4 mr-2" />
                      Suspender Usuário
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Lock className="w-4 h-4 mr-2" />
                      Bloquear Conta
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reset Password
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Database className="w-4 h-4 mr-2" />
                      Logs de Atividade
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>📊 Estatísticas de Suporte</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Tickets Hoje</span>
                      <span className="font-bold text-blue-600">23</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Resolvidos</span>
                      <span className="font-bold text-green-600">18</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Tempo Médio</span>
                      <span className="font-bold text-orange-600">2.5h</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Satisfação</span>
                      <span className="font-bold text-purple-600">94%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}