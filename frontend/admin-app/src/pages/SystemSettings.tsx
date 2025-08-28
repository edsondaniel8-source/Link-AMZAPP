import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings,
  DollarSign,
  Shield,
  Database,
  Server,
  Globe,
  Lock,
  Bell,
  CreditCard,
  Smartphone,
  Mail,
  Save,
  RefreshCw,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity
} from "lucide-react";

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState("platform");
  const [settings, setSettings] = useState({
    // Platform settings
    rideCommission: 15,
    hotelCommission: 10,
    eventCommission: 5,
    minimumBalance: 100,
    withdrawalFee: 25,
    verificationRequired: true,
    autoApproval: false,
    
    // Payment settings
    mpesaEnabled: true,
    emolaEnabled: true,
    creditCardEnabled: false,
    bankTransferEnabled: true,
    
    // Security settings
    twoFactorRequired: true,
    passwordMinLength: 8,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    
    // Notification settings
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    marketingEmails: false
  });

  const systemStatus = {
    uptime: "99.8%",
    apiResponse: "145ms",
    serverLoad: "67%",
    storage: "45%",
    database: "Connected",
    lastBackup: "2 horas atrás",
    version: "v2.1.3",
    environment: "Production"
  };

  const paymentProviders = [
    { 
      name: "M-Pesa", 
      status: "active", 
      commission: "2.5%", 
      transactions: "8,945",
      enabled: settings.mpesaEnabled 
    },
    { 
      name: "E-Mola", 
      status: "active", 
      commission: "2.8%", 
      transactions: "3,456",
      enabled: settings.emolaEnabled 
    },
    { 
      name: "Cartão de Crédito", 
      status: "testing", 
      commission: "3.2%", 
      transactions: "234",
      enabled: settings.creditCardEnabled 
    },
    { 
      name: "Transferência Bancária", 
      status: "active", 
      commission: "1.5%", 
      transactions: "1,234",
      enabled: settings.bankTransferEnabled 
    }
  ];

  const securityLogs = [
    {
      id: "1",
      type: "login",
      user: "admin@link-a.co.mz",
      action: "Login bem-sucedido",
      timestamp: "2024-01-28 14:30:15",
      ip: "41.220.*.***",
      status: "success"
    },
    {
      id: "2",
      type: "config",
      user: "admin@link-a.co.mz",
      action: "Alteração na taxa de comissão",
      timestamp: "2024-01-28 11:20:30",
      ip: "41.220.*.***",
      status: "success"
    },
    {
      id: "3",
      type: "failed_login",
      user: "unknown@email.com",
      action: "Tentativa de login falhada",
      timestamp: "2024-01-28 09:15:45",
      ip: "102.*.*.***",
      status: "failed"
    }
  ];

  const maintenanceSchedule = [
    {
      id: "1",
      type: "backup",
      description: "Backup automático diário",
      schedule: "02:00 (diário)",
      status: "active",
      lastRun: "Hoje às 02:00"
    },
    {
      id: "2",
      type: "update",
      description: "Atualizações de segurança",
      schedule: "Domingos às 03:00",
      status: "scheduled",
      lastRun: "Dom, 21 Jan"
    },
    {
      id: "3",
      type: "cleanup",
      description: "Limpeza de logs antigos",
      schedule: "Mensal (1º dia)",
      status: "active",
      lastRun: "1 Jan 2024"
    }
  ];

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    // Aqui faria o save das configurações
    console.log("Salvando configurações:", settings);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      testing: "bg-yellow-100 text-yellow-800",
      inactive: "bg-red-100 text-red-800",
      scheduled: "bg-blue-100 text-blue-800",
      success: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800"
    };
    return colors[status] || colors.active;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                ⚙️ Configurações do Sistema
              </h1>
              <p className="text-gray-600 mt-1">
                Gerir taxas, políticas, segurança e configurações da plataforma
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-600 text-white px-4 py-2">
                <Server className="w-4 h-4 mr-2" />
                Sistema Online
              </Badge>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveSettings}>
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>

        {/* System Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="p-4">
              <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Uptime</p>
              <p className="font-bold text-green-600">{systemStatus.uptime}</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">API Response</p>
              <p className="font-bold text-blue-600">{systemStatus.apiResponse}</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Server className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Server Load</p>
              <p className="font-bold text-orange-600">{systemStatus.serverLoad}</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Database className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Storage</p>
              <p className="font-bold text-purple-600">{systemStatus.storage}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="platform">💰 Taxas da Plataforma</TabsTrigger>
            <TabsTrigger value="payments">💳 Pagamentos</TabsTrigger>
            <TabsTrigger value="security">🔒 Segurança</TabsTrigger>
            <TabsTrigger value="maintenance">🛠️ Manutenção</TabsTrigger>
          </TabsList>

          {/* Platform Fees Tab */}
          <TabsContent value="platform">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    💰 Configuração de Taxas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Taxa de Comissão - Transportes (%)
                    </label>
                    <Input
                      type="number"
                      value={settings.rideCommission}
                      onChange={(e) => handleSettingChange('rideCommission', Number(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Comissão cobrada sobre cada corrida
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Taxa de Comissão - Hotéis (%)
                    </label>
                    <Input
                      type="number"
                      value={settings.hotelCommission}
                      onChange={(e) => handleSettingChange('hotelCommission', Number(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Comissão cobrada sobre cada reserva de hotel
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Taxa de Comissão - Eventos (%)
                    </label>
                    <Input
                      type="number"
                      value={settings.eventCommission}
                      onChange={(e) => handleSettingChange('eventCommission', Number(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Comissão cobrada sobre venda de ingressos
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Saldo Mínimo para Levantamento (MZN)
                    </label>
                    <Input
                      type="number"
                      value={settings.minimumBalance}
                      onChange={(e) => handleSettingChange('minimumBalance', Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Taxa de Levantamento (MZN)
                    </label>
                    <Input
                      type="number"
                      value={settings.withdrawalFee}
                      onChange={(e) => handleSettingChange('withdrawalFee', Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🎯 Políticas de Uso</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Verificação Obrigatória</p>
                      <p className="text-sm text-gray-600">
                        Requer verificação de documentos para novos usuários
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.verificationRequired}
                        onChange={(e) => handleSettingChange('verificationRequired', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Aprovação Automática</p>
                      <p className="text-sm text-gray-600">
                        Aprovar automaticamente usuários com documentos válidos
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoApproval}
                        onChange={(e) => handleSettingChange('autoApproval', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Termos de Uso
                    </label>
                    <Textarea
                      placeholder="Defina os termos de uso da plataforma..."
                      rows={8}
                      className="w-full"
                    />
                  </div>

                  <Button variant="outline" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Atualizar Política de Privacidade
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Payment Settings Tab */}
          <TabsContent value="payments">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    💳 Provedores de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {paymentProviders.map((provider, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Smartphone className="w-6 h-6 text-blue-600" />
                            <div>
                              <h4 className="font-bold">{provider.name}</h4>
                              <p className="text-sm text-gray-600">
                                Comissão: {provider.commission}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(provider.status)}>
                              {provider.status === "active" ? "🟢 Ativo" : 
                               provider.status === "testing" ? "🟡 Teste" : "🔴 Inativo"}
                            </Badge>
                            <p className="text-sm text-gray-600">
                              {provider.transactions} transações
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={provider.enabled}
                              onChange={(e) => {
                                // Handle provider toggle
                              }}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                          <Button size="sm" variant="outline">
                            <Settings className="w-4 h-4 mr-2" />
                            Configurar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>💰 Configurações Financeiras</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Moeda Principal
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option value="MZN">Metical (MZN)</option>
                      <option value="USD">Dólar Americano (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Limite Diário por Transação (MZN)
                    </label>
                    <Input
                      type="number"
                      defaultValue="50000"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Limite Mensal por Usuário (MZN)
                    </label>
                    <Input
                      type="number"
                      defaultValue="500000"
                      className="w-full"
                    />
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">📊 Estatísticas de Pagamento</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Volume Mensal:</span>
                        <span className="font-bold">487.5K MZN</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transações Hoje:</span>
                        <span className="font-bold">234</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxa de Sucesso:</span>
                        <span className="font-bold text-green-600">98.5%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    🔒 Configurações de Segurança
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">2FA Obrigatório para Admins</p>
                      <p className="text-sm text-gray-600">
                        Requer autenticação de dois fatores
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.twoFactorRequired}
                        onChange={(e) => handleSettingChange('twoFactorRequired', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comprimento Mínimo da Senha
                    </label>
                    <Input
                      type="number"
                      value={settings.passwordMinLength}
                      onChange={(e) => handleSettingChange('passwordMinLength', Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timeout de Sessão (minutos)
                    </label>
                    <Input
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleSettingChange('sessionTimeout', Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Máximo de Tentativas de Login
                    </label>
                    <Input
                      type="number"
                      value={settings.maxLoginAttempts}
                      onChange={(e) => handleSettingChange('maxLoginAttempts', Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <h4 className="font-medium text-red-900">Zona de Perigo</h4>
                    </div>
                    <Button variant="outline" className="w-full text-red-600 border-red-300 hover:bg-red-50">
                      <Lock className="w-4 h-4 mr-2" />
                      Forçar Logout de Todos os Usuários
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>📋 Logs de Segurança</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {securityLogs.map((log) => (
                      <div key={log.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-sm">{log.action}</p>
                            <p className="text-xs text-gray-600">{log.user}</p>
                          </div>
                          <Badge className={getStatusColor(log.status)}>
                            {log.status === "success" ? "✅" : "❌"}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">
                          <p>{log.timestamp}</p>
                          <p>IP: {log.ip}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Logs Completos
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    🛠️ Manutenção & Backup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-green-900">Estado do Sistema</h4>
                      <Badge className="bg-green-100 text-green-800">🟢 Operacional</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-green-700">Versão: {systemStatus.version}</p>
                        <p className="text-green-700">Ambiente: {systemStatus.environment}</p>
                      </div>
                      <div>
                        <p className="text-green-700">Último Backup: {systemStatus.lastBackup}</p>
                        <p className="text-green-700">Base de Dados: {systemStatus.database}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Ações de Manutenção</h4>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Database className="w-4 h-4 mr-2" />
                      Fazer Backup Agora
                    </Button>
                    <Button variant="outline" className="w-full">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reiniciar Serviços
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Baixar Logs do Sistema
                    </Button>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <h4 className="font-medium text-yellow-900">Próxima Manutenção</h4>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Domingo, 4 de Fevereiro às 03:00 - Atualizações de segurança
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>📅 Cronograma de Manutenção</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {maintenanceSchedule.map((task) => (
                      <div key={task.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{task.description}</h4>
                            <p className="text-sm text-gray-600">{task.schedule}</p>
                          </div>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status === "active" ? "🟢 Ativo" : 
                             task.status === "scheduled" ? "📅 Agendado" : "⏸️ Pausado"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">
                            Última execução: {task.lastRun}
                          </p>
                          <Button size="sm" variant="outline">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
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