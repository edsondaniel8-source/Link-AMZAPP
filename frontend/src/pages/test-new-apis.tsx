import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { 
  clientRidesApi, 
  driverRidesApi, 
  hotelAvailabilityApi, 
  adminDashboardApi, 
  sharedHealthApi 
} from "@/api";

export default function TestNewAPIsPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setLoading(prev => ({ ...prev, [testName]: true }));
    try {
      const result = await testFn();
      setResults((prev: any) => ({ ...prev, [testName]: { success: true, data: result } }));
      console.log(`✅ [${testName}] Sucesso:`, result);
    } catch (error) {
      setResults((prev: any) => ({ ...prev, [testName]: { success: false, error: error.message } }));
      console.error(`❌ [${testName}] Erro:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [testName]: false }));
    }
  };

  const tests = [
    {
      name: 'client-rides-search',
      title: 'CLIENT: Buscar Viagens',
      fn: () => clientRidesApi.search({ from: 'Maputo', to: 'Matola', passengers: 2 })
    },
    {
      name: 'driver-rides-my-rides',
      title: 'DRIVER: Minhas Viagens',
      fn: () => driverRidesApi.getMyRides('test-driver-id')
    },
    {
      name: 'hotel-my-properties',
      title: 'HOTEL: Minhas Propriedades',
      fn: () => hotelAvailabilityApi.getMyProperties('test-host-id')
    },
    {
      name: 'admin-dashboard-stats',
      title: 'ADMIN: Estatísticas',
      fn: () => adminDashboardApi.getStats()
    },
    {
      name: 'shared-health-basic',
      title: 'SHARED: Health Check',
      fn: () => sharedHealthApi.basic()
    },
    {
      name: 'shared-health-detailed',
      title: 'SHARED: Health Detalhado',
      fn: () => sharedHealthApi.detailed()
    }
  ];

  const runAllTests = async () => {
    for (const test of tests) {
      await runTest(test.name, test.fn);
      // Pequena pausa entre testes
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const getStatusBadge = (testName: string) => {
    if (loading[testName]) {
      return <Badge variant="outline">🔄 Testando...</Badge>;
    }
    
    const result = results[testName];
    if (!result) {
      return <Badge variant="secondary">⏳ Pendente</Badge>;
    }
    
    return result.success 
      ? <Badge variant="default" className="bg-green-500">✅ Sucesso</Badge>
      : <Badge variant="destructive">❌ Erro</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="container mx-auto max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">🧪 Teste das Novas APIs Organizadas por Roles</CardTitle>
            <p className="text-gray-600">
              Testando a nova estrutura organizacional do frontend por contexto de usuário
            </p>
          </CardHeader>
          <CardContent>
            <Button onClick={runAllTests} className="w-full" data-testid="button-run-all-tests">
              Executar Todos os Testes
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {tests.map((test) => (
            <Card key={test.name}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{test.title}</CardTitle>
                  {getStatusBadge(test.name)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {test.name}
                  </code>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => runTest(test.name, test.fn)}
                    disabled={loading[test.name]}
                    data-testid={`button-test-${test.name}`}
                  >
                    {loading[test.name] ? 'Testando...' : 'Testar'}
                  </Button>
                </div>

                {results[test.name] && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Resultado:</h4>
                    <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                      {JSON.stringify(results[test.name], null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>📊 Resumo dos Testes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {tests.length}
                </div>
                <div className="text-sm text-gray-600">Total de Testes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {Object.values(results).filter((r: any) => r?.success).length}
                </div>
                <div className="text-sm text-gray-600">Sucessos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {Object.values(results).filter((r: any) => r && !r.success).length}
                </div>
                <div className="text-sm text-gray-600">Erros</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {tests.length - Object.keys(results).length}
                </div>
                <div className="text-sm text-gray-600">Pendentes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}