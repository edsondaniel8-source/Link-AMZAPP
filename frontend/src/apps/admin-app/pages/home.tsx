import React from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { 
  Shield, 
  Users, 
  Car, 
  Hotel, 
  Calendar,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Settings,
  UserCheck,
  Activity,
  Globe
} from 'lucide-react';

export default function AdminHome() {
  const { user } = useAuth();

  // Buscar estatísticas do sistema
  const { data: systemStats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => fetch('/api/admin/stats').then(res => res.json()),
    // Dados mock por enquanto
    initialData: {
      totalUsers: 1250,
      totalRides: 89,
      totalHotels: 23,
      totalEvents: 12,
      pendingApprovals: 5,
      monthlyRevenue: 450000,
      activeBookings: 156,
      systemHealth: 'healthy',
      platformFees: 45000
    }
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
            <p className="text-gray-600 mb-4">
              Esta área é exclusiva para administradores do sistema.
            </p>
            <Link href="/login">
              <Button className="w-full">Fazer Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Link-A Admin
            </h1>
            <Badge className="bg-red-100 text-red-700 hover:bg-red-200">
              Painel Administrativo
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/" data-testid="link-main-app">
              <Button variant="outline">
                🏠 App Principal
              </Button>
            </Link>
            <Button variant="ghost" data-testid="button-user-menu">
              <UserCheck className="w-4 h-4 mr-2" />
              Admin: {user.email?.split('@')[0]}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Alertas do sistema */}
        {systemStats.pendingApprovals > 0 && (
          <Card className="mb-8 border-l-4 border-l-yellow-500">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="font-medium">
                  {systemStats.pendingApprovals} aprovações pendentes que requerem atenção
                </span>
                <Button size="sm" variant="outline" data-testid="button-view-approvals">
                  Ver Pendências
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estatísticas principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Utilizadores</p>
                  <p className="text-2xl font-bold">{systemStats.totalUsers.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Car className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Viagens Ativas</p>
                  <p className="text-2xl font-bold">{systemStats.totalRides}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Hotel className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Hotéis Parceiros</p>
                  <p className="text-2xl font-bold">{systemStats.totalHotels}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Receita Mensal</p>
                  <p className="text-2xl font-bold">{(systemStats.monthlyRevenue / 1000).toFixed(0)}k MT</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Métricas de negócio */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Reservas Ativas</p>
                  <p className="text-2xl font-bold">{systemStats.activeBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Taxa Plataforma</p>
                  <p className="text-2xl font-bold">{(systemStats.platformFees / 1000).toFixed(0)}k MT</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Sistema</p>
                  <p className="text-lg font-bold flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Operacional
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações rápidas */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Ações Administrativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" data-testid="button-manage-users">
                <Users className="w-4 h-4 mr-2" />
                Gerir Utilizadores
              </Button>
              
              <Button variant="outline" data-testid="button-approve-content">
                <CheckCircle className="w-4 h-4 mr-2" />
                Aprovar Conteúdo
              </Button>
              
              <Button variant="outline" data-testid="button-view-reports">
                <BarChart3 className="w-4 h-4 mr-2" />
                Relatórios
              </Button>
              
              <Button variant="outline" data-testid="button-system-settings">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Gestão de aplicações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Gestão de Aplicações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="clients">App Clientes</TabsTrigger>
                <TabsTrigger value="drivers">App Motoristas</TabsTrigger>
                <TabsTrigger value="hotels">App Hotéis</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">App Clientes</h3>
                          <p className="text-sm text-gray-600">Busca e reservas</p>
                          <p className="text-2xl font-bold text-blue-600">{systemStats.totalUsers} utilizadores</p>
                        </div>
                        <Link href="/" data-testid="link-view-clients-app">
                          <Button size="sm" variant="outline">Ver App</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-green-500">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">App Motoristas</h3>
                          <p className="text-sm text-gray-600">Gestão de viagens</p>
                          <p className="text-2xl font-bold text-green-600">{systemStats.totalRides} viagens</p>
                        </div>
                        <Link href="/drivers" data-testid="link-view-drivers-app">
                          <Button size="sm" variant="outline">Ver App</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">App Hotéis</h3>
                          <p className="text-sm text-gray-600">Gestão de alojamentos</p>
                          <p className="text-2xl font-bold text-purple-600">{systemStats.totalHotels} hotéis</p>
                        </div>
                        <Link href="/hotels" data-testid="link-view-hotels-app">
                          <Button size="sm" variant="outline">Ver App</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="clients">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{systemStats.activeBookings}</p>
                      <p className="text-sm text-gray-600">Reservas Ativas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">89%</p>
                      <p className="text-sm text-gray-600">Taxa Satisfação</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">4.7</p>
                      <p className="text-sm text-gray-600">Avaliação Média</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">24</p>
                      <p className="text-sm text-gray-600">Novos Hoje</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="drivers">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{systemStats.totalRides}</p>
                      <p className="text-sm text-gray-600">Viagens Ativas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">92%</p>
                      <p className="text-sm text-gray-600">Taxa Conclusão</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">4.8</p>
                      <p className="text-sm text-gray-600">Avaliação Motoristas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">7</p>
                      <p className="text-sm text-gray-600">Novos Esta Semana</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="hotels">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{systemStats.totalHotels}</p>
                      <p className="text-sm text-gray-600">Hotéis Parceiros</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">78%</p>
                      <p className="text-sm text-gray-600">Taxa Ocupação</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">4.6</p>
                      <p className="text-sm text-gray-600">Avaliação Hotéis</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">3</p>
                      <p className="text-sm text-gray-600">Pendentes Aprovação</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}