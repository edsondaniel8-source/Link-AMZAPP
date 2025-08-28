import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  PieChart,
  Download,
  Filter,
  CreditCard,
  Wallet,
  Building,
  Users,
  Percent,
  Eye
} from "lucide-react";

export default function Financial() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  // Mock data - seria substituído por dados reais da API
  const financialSummary = {
    totalRevenue: 456780,
    netRevenue: 410200,
    platformFees: 46580,
    growth: 12.5,
    occupancyRate: 78,
    averageDailyRate: 1850,
    revPAR: 1443, // Revenue Per Available Room
    totalBookings: 247,
    averageStay: 2.4
  };

  const monthlyData = [
    { month: "Jan", revenue: 380000, bookings: 201, occupancy: 72 },
    { month: "Fev", revenue: 420000, bookings: 234, occupancy: 75 },
    { month: "Mar", revenue: 456780, bookings: 247, occupancy: 78 },
    { month: "Abr", revenue: 510000, bookings: 268, occupancy: 82 },
    { month: "Mai", revenue: 489000, bookings: 255, occupancy: 79 },
    { month: "Jun", revenue: 523000, bookings: 275, occupancy: 85 },
  ];

  const revenueBreakdown = [
    { category: "Quartos Standard", revenue: 180000, percentage: 39.4, bookings: 156 },
    { category: "Quartos Deluxe", revenue: 152000, percentage: 33.3, bookings: 87 },
    { category: "Suites Premium", revenue: 98000, percentage: 21.5, bookings: 42 },
    { category: "Serviços Extras", revenue: 26780, percentage: 5.8, bookings: 89 }
  ];

  const recentTransactions = [
    {
      id: "1",
      date: "2024-01-28",
      guest: "Maria Santos",
      roomType: "Suite Deluxe",
      amount: 4500,
      nights: 3,
      status: "completed",
      paymentMethod: "card"
    },
    {
      id: "2",
      date: "2024-01-28", 
      guest: "João Pedro",
      roomType: "Quarto Standard",
      amount: 2800,
      nights: 2,
      status: "pending",
      paymentMethod: "mpesa"
    },
    {
      id: "3",
      date: "2024-01-27",
      guest: "Ana Costa", 
      roomType: "Suite Premium",
      amount: 6400,
      nights: 2,
      status: "completed",
      paymentMethod: "bank_transfer"
    }
  ];

  const keyMetrics = [
    {
      title: "Receita Total",
      value: `${financialSummary.totalRevenue.toLocaleString()} MZN`,
      change: `+${financialSummary.growth}%`,
      trend: "up",
      icon: DollarSign,
      color: "green"
    },
    {
      title: "Receita Líquida", 
      value: `${financialSummary.netRevenue.toLocaleString()} MZN`,
      change: "+8.2%",
      trend: "up", 
      icon: Wallet,
      color: "blue"
    },
    {
      title: "Taxa de Ocupação",
      value: `${financialSummary.occupancyRate}%`,
      change: "+5.3%",
      trend: "up",
      icon: Users,
      color: "purple"
    },
    {
      title: "RevPAR",
      value: `${financialSummary.revPAR.toLocaleString()} MZN`,
      change: "+15.7%", 
      trend: "up",
      icon: TrendingUp,
      color: "orange"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestão Financeira</h1>
              <p className="text-gray-600 mt-1">
                Acompanhe receitas, ocupação e performance do seu hotel
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4 mr-2" />
                Exportar Relatório
              </Button>
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {[
                  { key: "week", label: "Esta Semana" },
                  { key: "month", label: "Este Mês" },
                  { key: "quarter", label: "Trimestre" },
                  { key: "year", label: "Ano" }
                ].map((period) => (
                  <Button
                    key={period.key}
                    variant={selectedPeriod === period.key ? "default" : "outline"}
                    onClick={() => setSelectedPeriod(period.key)}
                    size="sm"
                  >
                    {period.label}
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Janeiro 2024</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {keyMetrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {metric.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <span className={`text-sm ${
                        metric.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  <metric.icon className={`w-8 h-8 text-${metric.color}-600`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          {/* Revenue Chart */}
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Evolução da Receita
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((data, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 text-sm font-medium text-gray-600">
                      {data.month}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-900">
                          {data.revenue.toLocaleString()} MZN
                        </span>
                        <span className="text-xs text-gray-500">
                          {data.bookings} reservas
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${(data.revenue / Math.max(...monthlyData.map(d => d.revenue))) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {data.occupancy}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Revenue Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Receita por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueBreakdown.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {item.category}
                      </span>
                      <span className="text-sm text-gray-600">
                        {item.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-green-500' :
                          index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{item.revenue.toLocaleString()} MZN</span>
                      <span>{item.bookings} reservas</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Transações Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div 
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.status === 'completed' ? 'bg-green-100' : 'bg-orange-100'
                    }`}>
                      {transaction.paymentMethod === 'card' ? (
                        <CreditCard className={`w-5 h-5 ${
                          transaction.status === 'completed' ? 'text-green-600' : 'text-orange-600'
                        }`} />
                      ) : transaction.paymentMethod === 'mpesa' ? (
                        <Wallet className={`w-5 h-5 ${
                          transaction.status === 'completed' ? 'text-green-600' : 'text-orange-600'
                        }`} />
                      ) : (
                        <Building className={`w-5 h-5 ${
                          transaction.status === 'completed' ? 'text-green-600' : 'text-orange-600'
                        }`} />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{transaction.guest}</h4>
                      <p className="text-sm text-gray-600">
                        {transaction.roomType} • {transaction.nights} noites
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.date).toLocaleDateString('pt-MZ')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {transaction.amount.toLocaleString()} MZN
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={
                          transaction.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }
                      >
                        {transaction.status === 'completed' ? 'Pago' : 'Pendente'}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Platform Fees & Commissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="w-5 h-5" />
              Taxas e Comissões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Taxa da Plataforma</p>
                <p className="text-2xl font-bold text-gray-900">10.2%</p>
                <p className="text-sm text-red-600">
                  {financialSummary.platformFees.toLocaleString()} MZN este mês
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Receita Bruta</p>
                <p className="text-2xl font-bold text-gray-900">
                  {financialSummary.totalRevenue.toLocaleString()} MZN
                </p>
                <p className="text-sm text-green-600">
                  +{financialSummary.growth}% vs mês anterior
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Receita Líquida</p>
                <p className="text-2xl font-bold text-green-600">
                  {financialSummary.netRevenue.toLocaleString()} MZN
                </p>
                <p className="text-sm text-gray-600">
                  Após taxas da plataforma
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}