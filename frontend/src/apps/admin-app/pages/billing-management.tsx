import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { DollarSign, TrendingUp, Users, CreditCard, Settings, Calculator } from "lucide-react";

interface FinancialReport {
  totalTransactions: number;
  totalRevenue: number;
  totalFees: number;
  totalPendingPayouts: number;
  profitMargin: string;
}

interface PendingFee {
  id: string;
  bookingId: string;
  amount: string;
  status: string;
  createdAt: string;
}

export default function BillingManagement() {
  const [feePercentage, setFeePercentage] = useState<number>(11);
  const [newFeePercentage, setNewFeePercentage] = useState<string>('11');
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [pendingFees, setPendingFees] = useState<PendingFee[]>([]);
  const [calculationAmount, setCalculationAmount] = useState<string>('');
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Carregar taxa actual
      const feeResponse = await apiRequest('GET', '/api/billing/fee-percentage');
      setFeePercentage(feeResponse.feePercentage);
      setNewFeePercentage(feeResponse.feePercentage.toString());

      // Carregar relatório financeiro
      const reportResponse = await apiRequest('GET', '/api/billing/financial-report');
      setReport(reportResponse);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados de facturação",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFeePercentage = async () => {
    try {
      const percentage = parseFloat(newFeePercentage);
      
      if (isNaN(percentage) || percentage < 0 || percentage > 50) {
        toast({
          title: "Erro",
          description: "Percentual deve ser entre 0 e 50",
          variant: "destructive",
        });
        return;
      }

      await apiRequest('PUT', '/api/billing/fee-percentage', { percentage });
      
      setFeePercentage(percentage);
      toast({
        title: "Sucesso",
        description: "Taxa da plataforma actualizada com sucesso",
      });
      
      // Recarregar dados
      loadData();
    } catch (error) {
      console.error('Erro ao actualizar taxa:', error);
      toast({
        title: "Erro",
        description: "Erro ao actualizar taxa da plataforma",
        variant: "destructive",
      });
    }
  };

  const calculateBilling = async () => {
    try {
      const amount = parseFloat(calculationAmount);
      
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Erro",
          description: "Valor deve ser maior que zero",
          variant: "destructive",
        });
        return;
      }

      const result = await apiRequest('POST', '/api/billing/calculate', { amount });
      setCalculationResult(result);
    } catch (error) {
      console.error('Erro ao calcular facturação:', error);
      toast({
        title: "Erro",
        description: "Erro ao calcular facturação",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Gestão de Facturação</h1>
      </div>

      {/* Estatísticas Financeiras */}
      {report && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Transacções</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{report.totalTransactions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-MZ', {
                  style: 'currency',
                  currency: 'MZN'
                }).format(report.totalRevenue)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxas Cobradas</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-MZ', {
                  style: 'currency',
                  currency: 'MZN'
                }).format(report.totalFees)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Margem de Lucro</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{report.profitMargin}%</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuração de Taxa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configuração de Taxa
            </CardTitle>
            <CardDescription>
              Configure a taxa percentual cobrada pela plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Taxa Actual: {feePercentage}%</Badge>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fee-percentage">Nova Taxa (%)</Label>
              <div className="flex gap-2">
                <Input
                  id="fee-percentage"
                  type="number"
                  min="0"
                  max="50"
                  step="0.1"
                  value={newFeePercentage}
                  onChange={(e) => setNewFeePercentage(e.target.value)}
                  placeholder="11.0"
                  data-testid="input-fee-percentage"
                />
                <Button 
                  onClick={updateFeePercentage}
                  data-testid="button-update-fee"
                >
                  Actualizar
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              A taxa será aplicada a todas as novas transacções. 
              Recomendamos manter entre 8% e 15%.
            </div>
          </CardContent>
        </Card>

        {/* Calculadora de Facturação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Calculadora de Facturação
            </CardTitle>
            <CardDescription>
              Calcule taxas para valores específicos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="calculation-amount">Valor da Transacção (MZN)</Label>
              <div className="flex gap-2">
                <Input
                  id="calculation-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={calculationAmount}
                  onChange={(e) => setCalculationAmount(e.target.value)}
                  placeholder="1000.00"
                  data-testid="input-calculation-amount"
                />
                <Button 
                  onClick={calculateBilling}
                  data-testid="button-calculate"
                >
                  Calcular
                </Button>
              </div>
            </div>

            {calculationResult && (
              <div className="space-y-2 p-4 bg-muted rounded-lg">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('pt-MZ', {
                      style: 'currency',
                      currency: 'MZN'
                    }).format(calculationResult.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa da Plataforma ({calculationResult.feePercentage}%):</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('pt-MZ', {
                      style: 'currency',
                      currency: 'MZN'
                    }).format(calculationResult.platformFee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Valor do Provedor:</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('pt-MZ', {
                      style: 'currency',
                      currency: 'MZN'
                    }).format(calculationResult.providerAmount)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold">
                    {new Intl.NumberFormat('pt-MZ', {
                      style: 'currency',
                      currency: 'MZN'
                    }).format(calculationResult.total)}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}