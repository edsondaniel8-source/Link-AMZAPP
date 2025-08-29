import { useLocation } from 'wouter';

function AppRouter() {
  const [location] = useLocation();

  console.log('Current location:', location);

  // Route to admin app
  if (location.startsWith('/admin')) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-blue-600">Painel Administrativo</h1>
        <p>Aplicação admin em {location}</p>
      </div>
    );
  }
  
  // Route to hotels app
  if (location.startsWith('/hotels')) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-green-600">Aplicação Alojamentos</h1>
        <p>Aplicação hotéis em {location}</p>
      </div>
    );
  }
  
  // Route to drivers app
  if (location.startsWith('/drivers')) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-purple-600">Aplicação Motoristas</h1>
        <p>Aplicação condutores em {location}</p>
      </div>
    );
  }
  
  // Default to main app (clients)
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-orange-600">Aplicação Clientes - Link-A</h1>
      <p>Localização atual: {location}</p>
      <div className="mt-4 space-x-4">
        <a href="/drivers" className="text-blue-500 underline">Ir para Motoristas</a>
        <a href="/hotels" className="text-blue-500 underline">Ir para Alojamentos</a>
        <a href="/admin" className="text-blue-500 underline">Ir para Admin</a>
      </div>
      <div className="mt-8 bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Funcionalidades dos Clientes:</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>🔍 Buscar transportes e alojamentos</li>
          <li>📅 Fazer reservas</li>
          <li>❌ Cancelar reservas</li>
          <li>💬 Chat básico com prestadores</li>
        </ul>
      </div>
    </div>
  );
}

export default AppRouter;