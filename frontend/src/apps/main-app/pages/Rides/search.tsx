import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Separator } from "@/shared/components/ui/separator";
import { MapPin, Clock, Users, Star, ArrowLeft, Calendar, Search } from "lucide-react";
import { rideService, type Ride } from "@/shared/lib/rideService";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/shared/components/PageHeader";
import MobileNavigation from "@/shared/components/MobileNavigation";

export default function RideSearchPage() {
  const [, setLocation] = useLocation();
  const [searchParams, setSearchParams] = useState({
    from: "",
    to: "",
    date: "",
    passengers: 1
  });
  const [hasSearched, setHasSearched] = useState(false);

  // Parse URL parameters on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const from = params.get('from') || '';
    const to = params.get('to') || '';
    const date = params.get('date') || '';
    const passengers = parseInt(params.get('passengers') || '1');
    
    if (from || to) {
      setSearchParams({ from, to, date, passengers });
      setHasSearched(true);
    }
  }, []);

  // Buscar viagens quando hasSearched muda
  const { data: rides, isLoading, error } = useQuery({
    queryKey: ['rides-search', searchParams],
    queryFn: () => rideService.searchRides({
      from: searchParams.from,
      to: searchParams.to,
      passengers: searchParams.passengers
    }),
    enabled: hasSearched && (!!searchParams.from || !!searchParams.to)
  });

  const handleSearch = () => {
    setHasSearched(true);
    // Atualizar URL com novos parâmetros
    const newParams = new URLSearchParams({
      from: searchParams.from,
      to: searchParams.to,
      date: searchParams.date,
      passengers: searchParams.passengers.toString()
    }).toString();
    window.history.pushState({}, '', `/rides/search?${newParams}`);
  };

  const handleBookRide = (ride: Ride) => {
    console.log('Reservar viagem:', ride);
    // Implementar navegação para página de reserva
    setLocation(`/rides/${ride.id}/book`);
  };

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} MT`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader title="Buscar Viagens" />
      
      <div className="container mx-auto px-4 max-w-7xl py-6">
        {/* Botão voltar */}
        <Button 
          variant="ghost" 
          onClick={() => setLocation('/')}
          className="mb-6"
          data-testid="button-back-home"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Início
        </Button>

        {/* Formulário de busca */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Buscar Viagens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">De onde</label>
                <Input
                  placeholder="Cidade de origem"
                  value={searchParams.from}
                  onChange={(e) => setSearchParams({...searchParams, from: e.target.value})}
                  data-testid="input-from"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Para onde</label>
                <Input
                  placeholder="Cidade de destino"
                  value={searchParams.to}
                  onChange={(e) => setSearchParams({...searchParams, to: e.target.value})}
                  data-testid="input-to"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Data</label>
                <Input
                  type="date"
                  value={searchParams.date}
                  onChange={(e) => setSearchParams({...searchParams, date: e.target.value})}
                  data-testid="input-date"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch} className="w-full" data-testid="button-search">
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        {hasSearched && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Viagens Disponíveis</h2>
              {rides && (
                <Badge variant="secondary">
                  {rides.length} viagem{rides.length !== 1 ? 'ns' : ''} encontrada{rides.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>

            {isLoading && (
              <div className="flex justify-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            )}

            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <p className="text-red-600">Erro ao buscar viagens. Tente novamente.</p>
                </CardContent>
              </Card>
            )}

            {rides && rides.length === 0 && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6 text-center">
                  <p className="text-yellow-800">Nenhuma viagem encontrada para os critérios especificados.</p>
                  <p className="text-yellow-600 text-sm mt-2">Tente alterar suas opções de busca.</p>
                </CardContent>
              </Card>
            )}

            {rides && rides.map((ride) => (
              <Card key={ride.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    {/* Informações da rota */}
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="text-center">
                          <div className="font-semibold text-lg">{ride.fromAddress}</div>
                          <div className="text-sm text-gray-500">Origem</div>
                        </div>
                        <div className="flex-1 relative">
                          <Separator className="w-full" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white px-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-lg">{ride.toAddress}</div>
                          <div className="text-sm text-gray-500">Destino</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(ride.departureDate)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {ride.maxPassengers - ride.currentPassengers} lugares disponíveis
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {ride.type}
                        </div>
                      </div>
                    </div>

                    {/* Preço */}
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {formatPrice(ride.price)}
                      </div>
                      <div className="text-sm text-gray-500">por pessoa</div>
                    </div>

                    {/* Ação */}
                    <div className="text-center">
                      <Button 
                        onClick={() => handleBookRide(ride)}
                        className="w-full"
                        data-testid={`button-book-ride-${ride.id}`}
                      >
                        Reservar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <MobileNavigation />
    </div>
  );
}