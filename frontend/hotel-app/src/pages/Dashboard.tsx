import { Calendar, DollarSign, Users, BedDouble, CheckCircle, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Painel do Hotel</h1>
        <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-green-700 font-medium">Ativo</span>
        </div>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ocupação Hoje</p>
              <p className="text-2xl font-bold text-gray-900">85%</p>
              <p className="text-xs text-green-600">34 de 40 quartos</p>
            </div>
            <BedDouble className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Receita Hoje</p>
              <p className="text-2xl font-bold text-gray-900">12.450 MZN</p>
              <p className="text-xs text-green-600">+15% vs ontem</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Check-ins Hoje</p>
              <p className="text-2xl font-bold text-gray-900">18</p>
              <p className="text-xs text-blue-600">6 pendentes</p>
            </div>
            <Users className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avaliação Média</p>
              <p className="text-2xl font-bold text-gray-900">4.7</p>
              <p className="text-xs text-yellow-600">128 avaliações</p>
            </div>
            <CheckCircle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Check-ins de Hoje */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Check-ins de Hoje</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Maria Santos</p>
                <p className="text-sm text-gray-600">Quarto Duplo Superior • 3 noites</p>
                <p className="text-sm text-blue-600">Check-in: 14:00 - Confirmado</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">1.250 MZN/noite</p>
              <div className="flex space-x-2 mt-2">
                <button className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600">
                  Check-in
                </button>
                <button className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400">
                  Detalhes
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">João Pedro</p>
                <p className="text-sm text-gray-600">Suite Executiva • 2 noites</p>
                <p className="text-sm text-orange-600">Check-in: 15:30 - Pendente</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">2.100 MZN/noite</p>
              <div className="flex space-x-2 mt-2">
                <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                  Preparar
                </button>
                <button className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400">
                  Contato
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ocupação Semanal */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Ocupação Semanal</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-7 gap-4">
            {[
              { day: 'Dom', date: '25', occupancy: 78, rooms: '31/40' },
              { day: 'Seg', date: '26', occupancy: 65, rooms: '26/40' },
              { day: 'Ter', date: '27', occupancy: 82, rooms: '33/40' },
              { day: 'Qua', date: '28', occupancy: 85, rooms: '34/40' },
              { day: 'Qui', date: '29', occupancy: 92, rooms: '37/40' },
              { day: 'Sex', date: '30', occupancy: 95, rooms: '38/40' },
              { day: 'Sáb', date: '31', occupancy: 88, rooms: '35/40' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <p className="text-sm font-medium text-gray-600">{item.day}</p>
                <p className="text-lg font-bold text-gray-900">{item.date}</p>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${item.occupancy}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{item.occupancy}%</p>
                  <p className="text-xs text-gray-500">{item.rooms}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tarefas Pendentes */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Tarefas Pendentes</h2>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium text-gray-900">Limpeza urgente - Quarto 205</p>
                  <p className="text-sm text-gray-600">Check-in às 15:00</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-orange-500 text-white text-sm rounded hover:bg-orange-600">
                Urgente
              </button>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900">Confirmar reserva - Ana Costa</p>
                  <p className="text-sm text-gray-600">Check-in amanhã</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                Confirmar
              </button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900">Atualizar preços fim de semana</p>
                  <p className="text-sm text-gray-600">Aplicar desconto 15%</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600">
                Aplicar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}