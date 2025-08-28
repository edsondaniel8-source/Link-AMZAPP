import { Calendar, Users, DollarSign, Clock, Ticket, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Painel de Eventos</h1>
        <div className="flex items-center space-x-2 bg-purple-100 px-3 py-1 rounded-full">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span className="text-purple-700 font-medium">Ativo</span>
        </div>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Eventos Ativos</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
              <p className="text-xs text-green-600">3 este mês</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Participantes</p>
              <p className="text-2xl font-bold text-gray-900">1.245</p>
              <p className="text-xs text-blue-600">+25% vs mês passado</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Receita Total</p>
              <p className="text-2xl font-bold text-gray-900">85.500 MZN</p>
              <p className="text-xs text-green-600">+18% vs mês passado</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taxa Ocupação</p>
              <p className="text-2xl font-bold text-gray-900">87%</p>
              <p className="text-xs text-orange-600">Média geral</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Próximos Eventos */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Próximos Eventos</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Festival de Música Moçambicana</p>
                <p className="text-sm text-gray-600">Centro de Conferências • 500 lugares</p>
                <p className="text-sm text-purple-600">30 Agosto, 19:00 - 23:00</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">450/500 ingressos</p>
              <p className="text-sm text-green-600">90% vendidos</p>
              <div className="flex space-x-2 mt-2">
                <button className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600">
                  Gerenciar
                </button>
                <button className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400">
                  Relatório
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Workshop de Fotografia</p>
                <p className="text-sm text-gray-600">Estúdio Arte • 25 lugares</p>
                <p className="text-sm text-blue-600">02 Setembro, 09:00 - 17:00</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">18/25 ingressos</p>
              <p className="text-sm text-orange-600">72% vendidos</p>
              <div className="flex space-x-2 mt-2">
                <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                  Promover
                </button>
                <button className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400">
                  Editar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vendas Recentes */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Vendas Recentes</h2>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center space-x-3">
                <Ticket className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium text-gray-900">Festival de Música - 3 ingressos</p>
                  <p className="text-sm text-gray-600">Ana Silva • há 5 minutos</p>
                </div>
              </div>
              <p className="font-semibold text-green-600">750 MZN</p>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center space-x-3">
                <Ticket className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900">Workshop Fotografia - 1 ingresso</p>
                  <p className="text-sm text-gray-600">Carlos Santos • há 12 minutos</p>
                </div>
              </div>
              <p className="font-semibold text-green-600">450 MZN</p>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center space-x-3">
                <Ticket className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900">Concerto Jazz - 2 ingressos</p>
                  <p className="text-sm text-gray-600">Maria Costa • há 25 minutos</p>
                </div>
              </div>
              <p className="font-semibold text-green-600">600 MZN</p>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <Ticket className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium text-gray-900">Palestra Empreendedorismo - 1 ingresso</p>
                  <p className="text-sm text-gray-600">João Pereira • há 45 minutos</p>
                </div>
              </div>
              <p className="font-semibold text-green-600">150 MZN</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Semanal */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Performance Semanal</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-7 gap-4">
            {[
              { day: 'Dom', date: '25', sales: 12, revenue: '2.450' },
              { day: 'Seg', date: '26', sales: 8, revenue: '1.800' },
              { day: 'Ter', date: '27', sales: 15, revenue: '3.200' },
              { day: 'Qua', date: '28', sales: 22, revenue: '4.750' },
              { day: 'Qui', date: '29', sales: 18, revenue: '3.900' },
              { day: 'Sex', date: '30', sales: 35, revenue: '7.500' },
              { day: 'Sáb', date: '31', sales: 28, revenue: '6.100' },
            ].map((item, index) => (
              <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600">{item.day}</p>
                <p className="text-lg font-bold text-gray-900">{item.date}</p>
                <div className="mt-2">
                  <p className="text-sm font-semibold text-purple-600">{item.sales} vendas</p>
                  <p className="text-xs text-gray-500">{item.revenue} MZN</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}