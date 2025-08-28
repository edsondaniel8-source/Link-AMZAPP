import { Car, Clock, DollarSign, Star, MapPin } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Painel do Motorista</h1>
        <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-green-700 font-medium">Online</span>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Viagens Hoje</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <Car className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ganhos Hoje</p>
              <p className="text-2xl font-bold text-gray-900">2.450 MZN</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Horas Online</p>
              <p className="text-2xl font-bold text-gray-900">8h 30m</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avaliação</p>
              <p className="text-2xl font-bold text-gray-900">4.8</p>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Solicitações Pendentes */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Solicitações Pendentes</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Maputo → Beira</p>
                <p className="text-sm text-gray-600">Maria Silva • 2 passageiros</p>
                <p className="text-sm text-orange-600">Saída: 30/08 às 08:00</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">1.250 MZN</p>
              <div className="flex space-x-2 mt-2">
                <button className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600">
                  Aceitar
                </button>
                <button className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400">
                  Recusar
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Maputo → Xai-Xai</p>
                <p className="text-sm text-gray-600">João Pedro • 1 passageiro</p>
                <p className="text-sm text-blue-600">Saída: 30/08 às 14:00</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">450 MZN</p>
              <div className="flex space-x-2 mt-2">
                <button className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600">
                  Aceitar
                </button>
                <button className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400">
                  Recusar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Viagens de Hoje */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Viagens de Hoje</h2>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium text-gray-900">Maputo Centro → Aeroporto</p>
                <p className="text-sm text-gray-600">Ana Costa • Concluída às 09:30</p>
              </div>
              <p className="font-semibold text-green-600">150 MZN</p>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium text-gray-900">Matola → Polana</p>
                <p className="text-sm text-gray-600">Carlos Silva • Concluída às 11:15</p>
              </div>
              <p className="font-semibold text-green-600">180 MZN</p>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Baixa → Costa do Sol</p>
                <p className="text-sm text-gray-600">Sofia Machel • Concluída às 15:45</p>
              </div>
              <p className="font-semibold text-green-600">220 MZN</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}