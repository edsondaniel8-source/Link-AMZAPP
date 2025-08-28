import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Download,
  Smartphone,
  CreditCard,
  PieChart,
  BarChart3,
  Receipt,
  Wallet,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Link } from "wouter";

export default function Financial() {
  const [selectedPeriod, setSelectedPeriod] = useState("today");

  // Mock financial data
  const todayEarnings = {
    gross: 2450,
    platformFee: 245, // 10%
    net: 2205,
    rides: 8,
    tips: 40,
    bonuses: 100
  };

  const monthlyStats = {
    gross: 48500,
    platformFee: 4850,
    net: 43650,
    rides: 142,
    tips: 850,
    bonuses: 1200,
    averagePerRide: 342
  };

  const recentTransactions = [
    {
      id: "1",
      type: "ride",
      description: "Corrida - Aeroporto → Hotel Polana",
      amount: 350,
      fee: 35,
      net: 315,
      time: "14:30",
      passenger: "Maria Silva"
    },
    {
      id: "2", 
      type: "ride",
      description: "Corrida - Shopping → Universidade",
      amount: 220,
      fee: 22,
      net: 198,
      time: "13:45",
      passenger: "João Santos"
    },
    {
      id: "3",
      type: "bonus",
      description: "Bónus de Performance Semanal",
      amount: 500,
      fee: 0,
      net: 500,
      time: "00:01"
    },
    {
      id: "4",
      type: "tip",
      description: "Gorjeta - Ana Costa",
      amount: 20,
      fee: 0,
      net: 20,
      time: "12:30"
    }
  ];

  const weeklyChart = [
    { day: "Seg", earnings: 380 },
    { day: "Ter", earnings: 450 },
    { day: "Qua", earnings: 520 },
    { day: "Qui", earnings: 380 },
    { day: "Sex", earnings: 680 },
    { day: "Sáb", earnings: 750 },
    { day: "Dom", earnings: 420 }
  ];

  const withdrawalHistory = [
    {
      id: "1",
      amount: 12000,
      method: "M-Pesa",
      status: "completed",
      date: "22 Jan 2025",
      reference: "MP123456789"
    },
    {
      id: "2",
      amount: 8500,
      method: "M-Pesa", 
      status: "pending",
      date: "25 Jan 2025",
      reference: "MP987654321"
    }
  ];

  const handleWithdraw = (amount: number, method: string) => {
    console.log("Withdrawing:", amount, "via", method);
  };

  const handleDownloadReport = () => {
    console.log("Downloading financial report");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">← Dashboard</Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Gestão Financeira</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border rounded px-3 py-2"
              >
                <option value="today">Hoje</option>
                <option value="week">Esta Semana</option>
                <option value="month">Este Mês</option>
                <option value="year">Este Ano</option>
              </select>
              <Button variant="outline" onClick={handleDownloadReport}>
                <Download className="w-4 h-4 mr-2" />
                Relatório
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Earnings Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold text-green-600">{todayEarnings.net}</p>
                      <p className="text-sm text-gray-600">MZN Hoje (Líquido)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{todayEarnings.gross}</p>
                      <p className="text-sm text-gray-600">MZN Bruto</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Receipt className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">{todayEarnings.rides}</p>
                      <p className="text-sm text-gray-600">Corridas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Wallet className="w-8 h-8 text-orange-600" />
                    <div>
                      <p className="text-2xl font-bold">{todayEarnings.tips}</p>
                      <p className="text-sm text-gray-600">MZN Gorjetas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Rendimentos da Semana
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyChart.map((day) => (
                    <div key={day.day} className="flex items-center space-x-4">
                      <div className="w-12 text-sm font-medium">{day.day}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                        <div 
                          className="bg-green-600 h-6 rounded-full"
                          style={{width: `${(day.earnings / 750) * 100}%`}}
                        ></div>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                          {day.earnings} MZN
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Transações Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          transaction.type === 'ride' ? 'bg-blue-100' :
                          transaction.type === 'bonus' ? 'bg-green-100' : 'bg-yellow-100'
                        }`}>
                          {transaction.type === 'ride' ? 
                            <DollarSign className={`w-4 h-4 text-blue-600`} /> :
                            transaction.type === 'bonus' ?
                            <TrendingUp className={`w-4 h-4 text-green-600`} /> :
                            <Wallet className={`w-4 h-4 text-yellow-600`} />
                          }
                        </div>
                        <div>
                          <p className="font-medium text-sm">{transaction.description}</p>
                          <p className="text-xs text-gray-600">{transaction.time}</p>
                          {transaction.passenger && (
                            <p className="text-xs text-gray-500">Cliente: {transaction.passenger}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">+{transaction.net} MZN</p>
                        {transaction.fee > 0 && (
                          <p className="text-xs text-gray-500">Taxa: -{transaction.fee} MZN</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            
            {/* Balance & Withdrawal */}
            <Card>
              <CardHeader>
                <CardTitle>Saldo Disponível</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">15,420 MZN</p>
                  <p className="text-sm text-gray-600">Disponível para saque</p>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleWithdraw(15420, "M-Pesa")}
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    Sacar via M-Pesa
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleWithdraw(15420, "Banco")}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Transferir para Banco
                  </Button>
                </div>

                <div className="text-xs text-gray-500 text-center">
                  Saques processados em até 24h úteis
                </div>
              </CardContent>
            </Card>

            {/* Monthly Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo Mensal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rendimento Bruto</span>
                    <span className="font-semibold">{monthlyStats.gross} MZN</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxas da Plataforma</span>
                    <span className="text-red-600">-{monthlyStats.platformFee} MZN</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Gorjetas</span>
                    <span className="text-green-600">+{monthlyStats.tips} MZN</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Bónus</span>
                    <span className="text-green-600">+{monthlyStats.bonuses} MZN</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold">
                    <span>Total Líquido</span>
                    <span className="text-green-600">{monthlyStats.net} MZN</span>
                  </div>
                </div>

                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Média por Corrida</p>
                  <p className="text-lg font-bold">{monthlyStats.averagePerRide} MZN</p>
                </div>
              </CardContent>
            </Card>

            {/* Withdrawal History */}
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Saques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {withdrawalHistory.map((withdrawal) => (
                    <div key={withdrawal.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{withdrawal.amount} MZN</p>
                        <p className="text-xs text-gray-600">{withdrawal.method}</p>
                        <p className="text-xs text-gray-500">{withdrawal.date}</p>
                      </div>
                      <Badge variant={
                        withdrawal.status === 'completed' ? 'default' : 'secondary'
                      }>
                        {withdrawal.status === 'completed' ? 'Concluído' : 'Pendente'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">vs. Semana Passada</span>
                    <div className="flex items-center text-green-600">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="text-sm font-medium">+15%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Melhor Dia da Semana</span>
                    <span className="text-sm font-medium">Sábado</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Horário Peak</span>
                    <span className="text-sm font-medium">17h-19h</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}