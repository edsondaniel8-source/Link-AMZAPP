import { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/shared/hooks/use-toast';
import { Calendar, MapPin, Users, Search } from 'lucide-react';
import { RideSearchParams } from '@/shared/hooks/useModalState';
import RideResults from '@/shared/components/RideResults';

interface RideSearchModalProps {
  initialParams: RideSearchParams;
  onClose: () => void;
}

export default function RideSearchModal({ initialParams, onClose }: RideSearchModalProps) {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useState({
    from: initialParams.from || '',
    to: initialParams.to || '',
    date: initialParams.date || '',
    passengers: initialParams.passengers || 1,
  });

  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Query para buscar rides
  const { data: rides = [], refetch, isLoading } = useQuery({
    queryKey: ['/api/rides-simple/search', searchParams],
    enabled: false, // Só executa quando chamado manualmente
  });

  // Se tem parâmetros iniciais, fazer busca automaticamente
  useEffect(() => {
    if (initialParams.from && initialParams.to && initialParams.date) {
      handleSearch();
    }
  }, []);

  const handleSearch = async () => {
    if (!searchParams.from || !searchParams.to || !searchParams.date) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha origem, destino e data.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    
    try {
      await refetch();
      toast({
        title: "Busca realizada",
        description: `Encontramos ${rides?.length || 0} viagens disponíveis.`,
      });
    } catch (error) {
      console.error('Erro na busca:', error);
      toast({
        title: "Erro na busca",
        description: "Não foi possível buscar as viagens. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="p-6">
      {/* Formulário de Busca */}
      <div className="space-y-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="from" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Origem
            </Label>
            <Input
              id="from"
              value={searchParams.from}
              onChange={(e) => handleInputChange('from', e.target.value)}
              placeholder="De onde você sai?"
              data-testid="input-ride-from"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="to" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Destino
            </Label>
            <Input
              id="to"
              value={searchParams.to}
              onChange={(e) => handleInputChange('to', e.target.value)}
              placeholder="Para onde você vai?"
              data-testid="input-ride-to"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Data da viagem
            </Label>
            <Input
              id="date"
              type="date"
              value={searchParams.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              data-testid="input-ride-date"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="passengers" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Passageiros
            </Label>
            <Input
              id="passengers"
              type="number"
              min="1"
              max="8"
              value={searchParams.passengers}
              onChange={(e) => handleInputChange('passengers', parseInt(e.target.value) || 1)}
              data-testid="input-ride-passengers"
            />
          </div>
        </div>

        <Button 
          onClick={handleSearch} 
          disabled={isSearching || isLoading}
          className="w-full"
          data-testid="button-search-rides"
        >
          <Search className="w-4 h-4 mr-2" />
          {isSearching || isLoading ? 'Buscando...' : 'Buscar Viagens'}
        </Button>
      </div>

      {/* Resultados da Busca */}
      {hasSearched && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">
            Resultados da Busca
          </h3>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Buscando viagens...</p>
            </div>
          ) : rides.length > 0 ? (
            <div className="space-y-4">
              {rides.map((ride: any) => (
                <div key={ride.id} className="border rounded-lg p-4">
                  <p><strong>De:</strong> {ride.fromAddress}</p>
                  <p><strong>Para:</strong> {ride.toAddress}</p>
                  <p><strong>Data:</strong> {new Date(ride.departureDate).toLocaleDateString()}</p>
                  <p><strong>Preço:</strong> {ride.price} MT</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">
                Nenhuma viagem encontrada para os critérios selecionados.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Tente alterar as datas ou locais da busca.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}