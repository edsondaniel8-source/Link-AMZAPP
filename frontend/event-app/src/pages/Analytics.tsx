import { useState } from "react";
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
  Calendar,
  Clock,
  MapPin,
  Eye,
  Download,
  Filter,
  Target,
  Star,
  Ticket,
  PieChart,
  Activity
} from "lucide-react";

export default function Analytics() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Mock data - seria substituído por dados reais da API
  const overviewStats = {
    totalRevenue: 1456780,
    revenueGrowth: 23.5,
    totalTicketsSold: 2847,
    ticketsGrowth: 18.2,
    averageTicketPrice: 512,
    priceGrowth: 5.3,
    totalEvents: 12,
    eventsGrowth: 50.0
  };

  const eventPerformance = [
    {
      id: "1",
      title: "Festival de Música Maputo 2024",
      category: "Festival",
      date: "2024-02-15",
      capacity: 500,
      soldTickets: 387,
      revenue: 96750,
      occupancyRate: 77.4,
      avgTicketPrice: 250,
      customerSatisfaction: 4.8,
      status: "active"
    },
    {
      id: "2", 
      title: "Workshop de Fotografia",
      category: "Workshop",
      date: "2024-02-08",
      capacity: 50,
      soldTickets: 42,
      revenue: 8400,
      occupancyRate: 84.0,
      avgTicketPrice: 200,
      customerSatisfaction: 4.9,
      status: "active"
    },
    {
      id: "3",
      title: "Concerto de Jazz",
      category: "Show",
      date: "2024-01-30",
      capacity: 120,
      soldTickets: 120,
      revenue: 36000,
      occupancyRate: 100.0,
      avgTicketPrice: 300,
      customerSatisfaction: 4.7,
      status: "completed"
    },
    {
      id: "4",
      title: "Feira de Artesanato",
      category: "Feira",
      date: "2024-02-20",
      capacity: 200,
      soldTickets: 89,
      revenue: 17800,
      occupancyRate: 44.5,
      avgTicketPrice: 200,
      customerSatisfaction: 4.2,
      status: "active"
    }
  ];

  const salesByBatch = [
    { batch: "Lote 1", sold: 245, total: 300, revenue: 49000, percentage: 81.7 },
    { batch: "Lote 2", sold: 189, total: 250, revenue: 47250, percentage: 75.6 },
    { batch: "VIP", sold: 78, total: 100, revenue: 31200, percentage: 78.0 },
    { batch: "Estudante", sold: 156, total: 200, revenue: 15600, percentage: 78.0 }
  ];

  const audienceInsights = {
    ageGroups: [
      { range: "18-25", percentage: 35, count: 1247 },
      { range: "26-35", percentage: 42, count: 1496 },
      { range: "36-45", percentage: 18, count: 641 },
      { range: "46+", percentage: 5, count: 178 }
    ],
    paymentMethods: [
      { method: "MPesa", percentage: 45, count: 1275 },
      { method: "Cartão", percentage: 35, count: 992 },
      { method: "Transferência", percentage: 20, count: 566 }
    ],
    locations: [
      { city: "Maputo", percentage: 68, count: 1926 },
      { city: "Matola", percentage: 15, count: 425 },
      { city: "Beira", percentage: 12, count: 340 },
      { city: "Outras", percentage: 5, count: 142 }
    ]
  };

  const revenueComparison = [
    { month: "Out", current: 125000, previous: 98000 },
    { month: "Nov", current: 142000, previous: 108000 },
    { month: "Dez", current: 168000, previous: 135000 },
    { month: "Jan", current: 195000, previous: 145000 },
    { month: "Fev", current: 178000, previous: 152000 }
  ];

  const topPerformingEvents = eventPerformance
    .sort((a, b) => b.occupancyRate - a.occupancyRate)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics de Eventos</h1>
              <p className="text-gray-600 mt-1">
                Acompanhe performance, vendas e insights de audiência
              </p>
            </div>
            <div className="flex gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="week">Esta Semana</option>
                <option value="month">Este Mês</option>
                <option value="quarter">Este Trimestre</option>
                <option value="year">Este Ano</option>
              </select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>

        {/* Key Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Receita Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {overviewStats.totalRevenue.toLocaleString()} MZN
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">
                      +{overviewStats.revenueGrowth}%
                    </span>
                  </div>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ingressos Vendidos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {overviewStats.totalTicketsSold.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">
                      +{overviewStats.ticketsGrowth}%
                    </span>
                  </div>
                </div>
                <Ticket className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Preço Médio</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {overviewStats.averageTicketPrice} MZN
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">
                      +{overviewStats.priceGrowth}%
                    </span>
                  </div>
                </div>
                <Target className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Eventos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {overviewStats.totalEvents}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">
                      +{overviewStats.eventsGrowth}%
                    </span>
                  </div>
                </div>
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="events">Performance de Eventos</TabsTrigger>
            <TabsTrigger value="sales">Vendas por Lote</TabsTrigger>
            <TabsTrigger value="audience">Perfil de Audiência</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Revenue Trend */}
              <Card className="xl:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Comparação de Receitas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {revenueComparison.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="font-medium w-8">{item.month}</span>
                          <div className="flex gap-2">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <span className="text-sm text-gray-600">
                                {item.current.toLocaleString()} MZN
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                              <span className="text-sm text-gray-500">
                                {item.previous.toLocaleString()} MZN
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {item.current > item.previous ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                          <span className={`text-sm ${
                            item.current > item.previous ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {Math.round(((item.current - item.previous) / item.previous) * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Melhores Eventos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPerformingEvents.map((event, index) => (
                      <div key={event.id} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-600' :
                          'bg-orange-100 text-orange-600'
                        }`}>
                          <span className="text-sm font-bold">#{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{event.title}</h4>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500">
                              {event.occupancyRate.toFixed(1)}% ocupação
                            </span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-xs">{event.customerSatisfaction}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Events Performance Tab */}
          <TabsContent value="events">
            <div className="space-y-6">
              {eventPerformance.map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{event.category}</Badge>
                          <Badge className={event.status === 'completed' ? 
                            'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                            {event.status === 'completed' ? 'Realizado' : 'Ativo'}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-bold">{event.customerSatisfaction}</span>
                        </div>
                        <p className="text-sm text-gray-500">Satisfação</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                      <div>
                        <p className="text-sm text-gray-500">Data</p>
                        <p className="font-medium">
                          {new Date(event.date).toLocaleDateString('pt-MZ')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ocupação</p>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{event.occupancyRate.toFixed(1)}%</p>
                          <div className="w-16 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-purple-600 rounded-full"
                              style={{ width: `${event.occupancyRate}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ingressos</p>
                        <p className="font-medium">{event.soldTickets}/{event.capacity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Preço Médio</p>
                        <p className="font-medium">{event.avgTicketPrice} MZN</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Receita</p>
                        <p className="font-bold text-green-600">
                          {event.revenue.toLocaleString()} MZN
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Sales by Batch Tab */}
          <TabsContent value="sales">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {salesByBatch.map((batch, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">{batch.batch}</h3>
                      <Badge className="bg-purple-100 text-purple-800">
                        {batch.percentage.toFixed(1)}%
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Vendidos</span>
                        <span className="font-medium">{batch.sold}/{batch.total}</span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                          style={{ width: `${batch.percentage}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Receita</span>
                        <span className="font-bold text-green-600">
                          {batch.revenue.toLocaleString()} MZN
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Audience Tab */}
          <TabsContent value="audience">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Age Groups */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Faixa Etária
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {audienceInsights.ageGroups.map((group, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">{group.range} anos</span>
                          <span className="text-sm text-gray-600">{group.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${group.percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {group.count} participantes
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Métodos de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {audienceInsights.paymentMethods.map((method, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">{method.method}</span>
                          <span className="text-sm text-gray-600">{method.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${method.percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {method.count} transações
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Geographic Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Distribuição Geográfica
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {audienceInsights.locations.map((location, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">{location.city}</span>
                          <span className="text-sm text-gray-600">{location.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${location.percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {location.count} participantes
                        </p>
                      </div>
                    ))}
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