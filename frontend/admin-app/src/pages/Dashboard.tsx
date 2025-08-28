import { Users, Building, Calendar, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
        <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-green-700 font-medium">Sistema Operacional</span>
        </div>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Usuários</p>
              <p className="text-2xl font-bold text-gray-900">12.456</p>
              <p className="text-xs text-green-600">+8% este mês</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Transações Hoje</p>
              <p className="text-2xl font-bold text-gray-900">1.234</p>
              <p className="text-xs text-blue-600">+15% vs ontem</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Receita Total</p>
              <p className="text-2xl font-bold text-gray-900">2.5M MZN</p>
              <p className="text-xs text-green-600">+22% este mês</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taxa Crescimento</p>
              <p className="text-2xl font-bold text-gray-900">18.5%</p>
              <p className="text-xs text-orange-600">Mensal</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Visão Geral por Setor */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-500" />
              Transportes
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Motoristas Ativos</span>
              <span className="font-semibold">1.245</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Viagens Hoje</span>
              <span className="font-semibold">3.456</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Receita</span>
              <span className="font-semibold text-green-600">850K MZN</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Building className="h-5 w-5 mr-2 text-purple-500" />
              Acomodações
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Hotéis Parceiros</span>
              <span className="font-semibold">156</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Reservas Hoje</span>
              <span className="font-semibold">234</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Receita</span>
              <span className="font-semibold text-green-600">1.2M MZN</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-orange-500" />
              Eventos
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Organizadores</span>
              <span className="font-semibold">89</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Eventos Ativos</span>
              <span className="font-semibold">67</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Receita</span>
              <span className="font-semibold text-green-600">450K MZN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Atividade Recente */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Atividade Recente do Sistema</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Novo hotel aprovado</p>
                <p className="text-sm text-gray-600">Hotel Maputo Plaza foi aprovado e está ativo</p>
                <p className="text-xs text-gray-500">há 15 minutos</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Novo motorista verificado</p>
                <p className="text-sm text-gray-600">João Silva completou a verificação</p>
                <p className="text-xs text-gray-500">há 32 minutos</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-orange-50 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-orange-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Relatório de problema</p>
                <p className="text-sm text-gray-600">Usuário reportou problema com pagamento</p>
                <p className="text-xs text-gray-500">há 1 hora</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg">
              <Calendar className="h-8 w-8 text-purple-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Novo evento criado</p>
                <p className="text-sm text-gray-600">Festival de Música foi agendado para setembro</p>
                <p className="text-xs text-gray-500">há 2 horas</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pendências Administrativas */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Pendências Administrativas</h2>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium text-gray-900">5 verificações de motorista pendentes</p>
                  <p className="text-sm text-gray-600">Documentos aguardando análise</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-orange-500 text-white text-sm rounded hover:bg-orange-600">
                Revisar
              </button>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-medium text-gray-900">3 disputas de pagamento</p>
                  <p className="text-sm text-gray-600">Requer intervenção administrativa</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600">
                Urgente
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <Building className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900">2 hotéis aguardando aprovação</p>
                  <p className="text-sm text-gray-600">Novos parceiros para análise</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                Analisar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}