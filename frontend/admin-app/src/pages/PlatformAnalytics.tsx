import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Car,
  Building,
  Calendar,
  MapPin,
  Globe,
  Target,
  Zap,
  Activity,
  PieChart,
  LineChart,
  Download,
  RefreshCw,
  Filter
} from "lucide-react";

export default function PlatformAnalytics() {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("30d");

  // Hook para buscar dados reais da API de analytics
  const { data: analyticsData, isLoading, error } = useQuery({
    queryKey: ['/api/admin/analytics'],
    refetchInterval: 60000, // Atualizar a cada minuto
    staleTime: 30000 // Dados frescos por 30 segundos
  });

  // Usar dados da API ou fallback
  const platformMetrics = analyticsData?.analytics || {
    userGrowth: {
      total: 0,
      monthlyGrowth: 0,
      weeklyGrowth: 0,
      newThisMonth: 0,
      newThisWeek: 0
    },
    revenueGrowth: {
      total: 0,
      monthlyGrowth: 0,
      thisMonth: 0,
      averagePerTransaction: 0
    },
    transactionVolume: {
      totalRides: 0,
      ridesThisMonth: 0,
      totalBookings: 0,
      bookingsThisMonth: 0
    },
    sectorPerformance: [],
    geographicDistribution: []
  };

  const revenueByService = [
    { service: "Transportes", amount: 245000, percentage: 50.2, color: "bg-purple-600" },
    { service: "Acomodações", amount: 180000, percentage: 36.9, color: "bg-orange-600" },
    { service: "Eventos", amount: 62500, percentage: 12.9, color: "bg-blue-600" }
  ];

  const geographicData = [
    { city: "Maputo", users: 5623, revenue: 219750, growth: 15.2, percentage: 45 },
    { city: "Beira", users: 2134, revenue: 121875, growth: 12.8, percentage: 25 },
    { city: "Nampula", users: 1892, revenue: 73125, growth: 8.5, percentage: 18 },
    { city: "Quelimane", users: 978, revenue: 36562, growth: 6.2, percentage: 8 },
    { city: "Tete", users: 634, revenue: 24375, growth: 4.1, percentage: 4 }
  ];

  const monthlyData = [
    { month: "Set", users: 8450, revenue: 345000, transactions: 6234 },
    { month: "Out", users: 9123, revenue: 378000, transactions: 6891 },
    { month: "Nov", users: 10567, revenue: 423000, transactions: 7456 },
    { month: "Dez", users: 11234, revenue: 456000, transactions: 8123 },
    { month: "Jan", users: 12547, revenue: 487500, transactions: 8945 }
  ];

  const userSegmentation = [
    { segment: "Clientes Frequentes", count: 3456, percentage: 27.5, value: "Alto" },
    { segment: "Ocasionais", count: 4567, percentage: 36.4, value: "Médio" },
    { segment: "Novos Usuários", count: 2890, percentage: 23.0, value: "Baixo" },
    { segment: "Inativos", count: 1634, percentage: 13.1, value: "Muito Baixo" }
  ];

  const topPerformers = {
    drivers: [
      { name: "João Silva", city: "Maputo", rating: 4.9, rides: 456, earnings: 23500 },
      { name: "Maria Santos", city: "Beira", rating: 4.8, rides: 389, earnings: 19750 },
      { name: "Carlos Mazive", city: "Maputo", rating: 4.8, rides: 367, earnings: 18900 }
    ],
    hotels: [
      { name: "Hotel Polana Serena", city: "Maputo", rating: 4.9, bookings: 234, earnings: 89750 },
      { name: "Hotel VIP Grand", city: "Beira", rating: 4.7, bookings: 189, earnings: 67200 },
      { name: "Residencial Alvorada", city: "Nampula", rating: 4.6, bookings: 156, earnings: 45600 }
    ],
    events: [
      { name: "Festival de Música Maputo", organizer: "Maputo Music", tickets: 1250, earnings: 62500 },
      { name: "Workshop Fotografia", organizer: "Creative Hub", tickets: 89, earnings: 8900 },
      { name: "Feira de Artesanato", organizer: "Arte Moçambique", tickets: 234, earnings: 11700 }
    ]
  };

  const timeRangeOptions = [
    { value: "7d", label: "7 dias" },
    { value: "30d", label: "30 dias" },
    { value: "90d", label: "90 dias" },
    { value: "1y", label: "1 ano" }
  ];

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? TrendingUp : TrendingDown;
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                📈 Analytics da Plataforma
              </h1>
              <p className="text-gray-600 mt-1">
                Métricas detalhadas, insights de crescimento e análise de performance
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                {timeRangeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">💰 Receita Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(platformMetrics.revenueGrowth.total / 1000).toFixed(0)}K MZN
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+{platformMetrics.revenueGrowth.monthlyGrowth}%</span>
                  </div>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">👥 Total Usuários</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {platformMetrics.userGrowth.total.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+{platformMetrics.userGrowth.monthlyGrowth}%</span>
                  </div>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">📊 Transações</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {platformMetrics.totalTransactions.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+{platformMetrics.transactionGrowth}%</span>
                  </div>
                </div>
                <Activity className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">💳 Ticket Médio</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {platformMetrics.averageOrderValue} MZN
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+5.4%</span>
                  </div>
                </div>
                <Target className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">📊 Visão Geral</TabsTrigger>
            <TabsTrigger value="revenue">💰 Receita</TabsTrigger>
            <TabsTrigger value="geographic">🗺️ Geografia</TabsTrigger>
            <TabsTrigger value="performance">🏆 Performance</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Growth Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="w-5 h-5" />
                    📈 Crescimento Mensal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200">
                    <div className="text-center">
                      <LineChart className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                      <span className="text-blue-600 font-medium">Gráfico de Linha - Crescimento</span>
                      <p className="text-sm text-gray-500 mt-1">Usuários, Receita, Transações</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {monthlyData.slice(-3).map((data, index) => (
                      <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-bold text-gray-900">{data.month}</p>
                        <p className="text-xs text-gray-600">{data.users} usuários</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* User Segmentation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    👥 Segmentação de Usuários
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userSegmentation.map((segment, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{segment.segment}</span>
                            <span className="text-sm text-gray-600">{segment.count.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                index === 0 ? 'bg-green-500' :
                                index === 1 ? 'bg-blue-500' :
                                index === 2 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${segment.percentage}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500">{segment.percentage}%</span>
                            <Badge variant="outline" className="text-xs">
                              Valor: {segment.value}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Service Usage */}
              <Card>
                <CardHeader>
                  <CardTitle>🎯 Uso por Serviço</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {revenueByService.map((service, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{service.service}</span>
                          <span className="text-sm text-gray-600">
                            {(service.amount / 1000).toFixed(0)}K MZN
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${service.color}`}
                            style={{ width: `${service.percentage}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">{service.percentage}%</span>
                          <span className="text-xs text-green-600">+12% vs mês anterior</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Real-time Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    ⚡ Atividade em Tempo Real
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm">Usuários Online</span>
                      </div>
                      <span className="font-bold text-green-600">1,247</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                        <span className="text-sm">Corridas Ativas</span>
                      </div>
                      <span className="font-bold text-blue-600">89</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
                        <span className="text-sm">Reservas Hoje</span>
                      </div>
                      <span className="font-bold text-purple-600">156</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
                        <span className="text-sm">Eventos Hoje</span>
                      </div>
                      <span className="font-bold text-orange-600">12</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>💰 Receita por Serviço</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center border-2 border-dashed border-green-200">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-green-400 mx-auto mb-2" />
                      <span className="text-green-600 font-medium">Gráfico de Barras - Receita</span>
                      <p className="text-sm text-gray-500 mt-1">Por categoria de serviço</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {revenueByService.map((service, index) => (
                      <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-bold">{service.service}</p>
                        <p className="text-xs text-gray-600">{(service.amount / 1000).toFixed(0)}K</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>📊 Métricas de Receita</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Receita Mensal</p>
                        <p className="text-xl font-bold text-gray-900">487.5K MZN</p>
                      </div>
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Comissão Total</p>
                        <p className="text-xl font-bold text-gray-900">73.1K MZN</p>
                      </div>
                      <DollarSign className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">RPU (Receita por Usuário)</p>
                        <p className="text-xl font-bold text-gray-900">38.8 MZN</p>
                      </div>
                      <Target className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Taxa de Conversão</p>
                        <p className="text-xl font-bold text-gray-900">12.4%</p>
                      </div>
                      <Zap className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Geographic Tab */}
          <TabsContent value="geographic">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    🗺️ Distribuição Geográfica
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200">
                    <div className="text-center">
                      <Globe className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                      <span className="text-blue-600 font-medium">Mapa Interativo de Moçambique</span>
                      <p className="text-sm text-gray-500 mt-1">Atividade por província</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🏙️ Top Cidades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {geographicData.map((city, index) => (
                      <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-lg">{city.city}</h4>
                            <p className="text-sm text-gray-600">
                              {city.users.toLocaleString()} usuários
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">
                              {(city.revenue / 1000).toFixed(0)}K MZN
                            </p>
                            <div className="flex items-center">
                              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                              <span className="text-sm text-green-600">+{city.growth}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${city.percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{city.percentage}% do total</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance">
            <div className="space-y-6">
              {/* Top Drivers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="w-5 h-5" />
                    🏆 Top Motoristas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Nome</th>
                          <th className="text-left p-3">Cidade</th>
                          <th className="text-left p-3">Avaliação</th>
                          <th className="text-left p-3">Corridas</th>
                          <th className="text-left p-3">Ganhos</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topPerformers.drivers.map((driver, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium">{driver.name}</td>
                            <td className="p-3 text-gray-600">{driver.city}</td>
                            <td className="p-3">
                              <Badge className="bg-yellow-100 text-yellow-800">
                                ⭐ {driver.rating}
                              </Badge>
                            </td>
                            <td className="p-3">{driver.rides}</td>
                            <td className="p-3 font-bold text-green-600">
                              {(driver.earnings / 1000).toFixed(1)}K MZN
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Top Hotels */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    🏨 Top Hotéis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Nome</th>
                          <th className="text-left p-3">Cidade</th>
                          <th className="text-left p-3">Avaliação</th>
                          <th className="text-left p-3">Reservas</th>
                          <th className="text-left p-3">Receita</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topPerformers.hotels.map((hotel, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium">{hotel.name}</td>
                            <td className="p-3 text-gray-600">{hotel.city}</td>
                            <td className="p-3">
                              <Badge className="bg-yellow-100 text-yellow-800">
                                ⭐ {hotel.rating}
                              </Badge>
                            </td>
                            <td className="p-3">{hotel.bookings}</td>
                            <td className="p-3 font-bold text-green-600">
                              {(hotel.earnings / 1000).toFixed(1)}K MZN
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Top Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    🎉 Top Eventos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Evento</th>
                          <th className="text-left p-3">Organizador</th>
                          <th className="text-left p-3">Ingressos</th>
                          <th className="text-left p-3">Receita</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topPerformers.events.map((event, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium">{event.name}</td>
                            <td className="p-3 text-gray-600">{event.organizer}</td>
                            <td className="p-3">{event.tickets}</td>
                            <td className="p-3 font-bold text-green-600">
                              {(event.earnings / 1000).toFixed(1)}K MZN
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}