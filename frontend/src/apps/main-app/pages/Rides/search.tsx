import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { useToast } from "@/shared/hooks/use-toast";
import { ArrowLeft, Calendar, Search, Phone, Mail, CreditCard, Car, ArrowRight, User } from "lucide-react";
import { rideService, type Ride } from "@/shared/lib/rideService";
import { useQuery, useMutation } from "@tanstack/react-query";
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
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [bookingModal, setBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    passengers: 1,
    phone: "",
    email: "",
    notes: ""
  });
  
  const { toast } = useToast();

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
    setSelectedRide(ride);
    setBookingModal(true);
  };

  // Mutation para criar reserva
  const bookingMutation = useMutation({
    mutationFn: async (_data: any) => {
      // Simular chamada de API para criar reserva
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, bookingId: Date.now().toString() });
        }, 1500);
      });
    },
    onSuccess: () => {
      // Atualizar a lista após reserva
      if (selectedRide) {
        refetch();
      }
      
      toast({
        title: "Reserva confirmada!",
        description: "Sua reserva foi criada com sucesso. Você receberá mais detalhes por email.",
      });
      setBookingModal(false);
      setSelectedRide(null);
      setBookingData({
        passengers: 1,
        phone: "",
        email: "",
        notes: ""
      });
    },
    onError: () => {
      toast({
        title: "Erro na reserva",
        description: "Não foi possível processar sua reserva. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  const handleConfirmBooking = () => {
    if (!selectedRide) return;
    
    // Validação básica
    if (!bookingData.phone || !bookingData.email) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha telefone e email.",
        variant: "destructive",
      });
      return;
    }

    const reservationData = {
      rideId: selectedRide.id,
      passengers: bookingData.passengers,
      phone: bookingData.phone,
      email: bookingData.email,
      notes: bookingData.notes,
      totalPrice: selectedRide.price * bookingData.passengers
    };

    bookingMutation.mutate(reservationData);
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `${numPrice.toFixed(2)} MT`;
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
              <Card key={ride.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
                    {/* Foto do Veículo e Informações do Tipo */}
                    <div className="lg:col-span-1">
                      <div className="relative">
                        {ride.vehiclePhoto ? (
                          <img 
                            src={ride.vehiclePhoto} 
                            alt={`Veículo ${ride.type}`}
                            className="w-full h-28 object-cover rounded-xl"
                          />
                        ) : (
                          <div className="w-full h-28 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                            <div className="text-center">
                              <Car className="w-8 h-8 text-blue-600 mx-auto mb-1" />
                              <div className="text-xs font-medium text-blue-700">{ride.type}</div>
                            </div>
                          </div>
                        )}
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          {ride.maxPassengers - ride.currentPassengers} lugares
                        </div>
                      </div>
                    </div>

                    {/* Informações da Rota */}
                    <div className="lg:col-span-2">
                      <div className="space-y-4">
                        {/* Rota Visual */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="font-bold text-lg text-gray-800">{ride.fromAddress}</div>
                            <div className="text-sm text-gray-500">Saída</div>
                          </div>
                          <div className="flex flex-col items-center px-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                              <ArrowRight className="w-4 h-4 text-white" />
                            </div>
                            <div className="text-xs text-gray-400 mt-1">direto</div>
                          </div>
                          <div className="flex-1 text-right">
                            <div className="font-bold text-lg text-gray-800">{ride.toAddress}</div>
                            <div className="text-sm text-gray-500">Chegada</div>
                          </div>
                        </div>
                        
                        {/* Detalhes da Viagem */}
                        <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">{formatDate(ride.departureDate)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                            <User className="w-4 h-4 text-green-500" />
                            <span className="font-medium">{ride.driverName}</span>
                          </div>
                        </div>
                        
                        {ride.description && (
                          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg italic">
                            "{ride.description}"
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Preço Destacado */}
                    <div className="text-center lg:text-left">
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                        <div className="text-3xl font-bold text-green-700">
                          {formatPrice(ride.price)}
                        </div>
                        <div className="text-sm text-green-600 font-medium">por pessoa</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Total: {formatPrice((parseFloat(ride.price) * searchParams.passengers).toString())}
                        </div>
                      </div>
                    </div>

                    {/* Botão de Reserva */}
                    <div className="text-center">
                      <Button 
                        onClick={() => handleBookRide(ride)}
                        className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300"
                        data-testid={`button-book-ride-${ride.id}`}
                      >
                        <Calendar className="w-5 h-5 mr-2" />
                        Reservar Agora
                      </Button>
                      <div className="text-xs text-gray-500 mt-2">
                        Confirmação instantânea
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Reserva */}
      <Dialog open={bookingModal} onOpenChange={setBookingModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Reserva</DialogTitle>
            <DialogDescription>
              Complete os dados para confirmar sua reserva de viagem.
            </DialogDescription>
          </DialogHeader>
          
          {selectedRide && (
            <div className="space-y-6">
              {/* Resumo da viagem */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-4 mb-2">
                  <div className="text-sm">
                    <span className="font-semibold">{selectedRide.fromAddress}</span>
                    <span className="mx-2">→</span>
                    <span className="font-semibold">{selectedRide.toAddress}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {formatDate(selectedRide.departureDate)}
                </div>
                <div className="text-sm text-gray-600">
                  Motorista: {selectedRide.driverName}
                </div>
                {selectedRide.vehiclePhoto && (
                  <img 
                    src={selectedRide.vehiclePhoto} 
                    alt="Veículo" 
                    className="w-full h-20 object-cover rounded mt-2"
                  />
                )}
              </div>

              {/* Formulário de reserva */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="passengers">Número de Passageiros</Label>
                  <Input
                    id="passengers"
                    type="number"
                    min="1"
                    max={selectedRide.maxPassengers - selectedRide.currentPassengers}
                    value={bookingData.passengers}
                    onChange={(e) => setBookingData({...bookingData, passengers: parseInt(e.target.value)})}
                    data-testid="input-passengers"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="phone"
                      placeholder="84 123 4567"
                      value={bookingData.phone}
                      onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                      className="pl-10"
                      data-testid="input-phone"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={bookingData.email}
                      onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                      className="pl-10"
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Observações (opcional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Alguma observação especial..."
                    value={bookingData.notes}
                    onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                    rows={3}
                    data-testid="textarea-notes"
                  />
                </div>

                {/* Resumo do preço */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span>Total ({bookingData.passengers} passageiro{bookingData.passengers > 1 ? 's' : ''})</span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatPrice((parseFloat(selectedRide.price) * bookingData.passengers).toString())}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setBookingModal(false)}
                  className="flex-1"
                  data-testid="button-cancel-booking"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleConfirmBooking}
                  disabled={bookingMutation.isPending}
                  className="flex-1"
                  data-testid="button-confirm-booking"
                >
                  {bookingMutation.isPending ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Confirmar Reserva
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <MobileNavigation />
    </div>
  );
}