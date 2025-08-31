import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Separator } from "@/shared/components/ui/separator";
import { Badge } from "@/shared/components/ui/badge";
import { ArrowLeft, MapPin, Clock, Users, Calendar, CreditCard, User, Phone, Mail } from "lucide-react";
import { rideService, type Ride } from "@/shared/lib/rideService";
import { ApiClient } from "@/lib/apiClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/shared/hooks/use-toast";
import PageHeader from "@/shared/components/PageHeader";
import MobileNavigation from "@/shared/components/MobileNavigation";

export default function RideBookPage() {
  const { rideId } = useParams<{ rideId: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [bookingData, setBookingData] = useState({
    passengers: 1,
    fullName: "",
    email: "",
    phone: "",
    notes: ""
  });

  // Buscar detalhes da viagem
  const { data: ride, isLoading } = useQuery({
    queryKey: ['ride-details', rideId],
    queryFn: () => rideService.getRideDetails(rideId!),
    enabled: !!rideId
  });

  // Mutation para criar reserva
  const bookingMutation = useMutation({
    mutationFn: async (bookingDetails: any) => {
      return await ApiClient.createBooking({
        type: 'ride',
        itemId: rideId,
        totalPrice: (ride!.price * bookingData.passengers).toString(),
        details: bookingDetails
      });
    },
    onSuccess: (result) => {
      toast({
        title: "Reserva confirmada!",
        description: "Sua viagem foi reservada com sucesso. Você receberá os detalhes por email.",
        variant: "default"
      });
      queryClient.invalidateQueries({ queryKey: ['rides-search'] });
      setLocation('/reservas');
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao fazer reserva",
        description: error.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  const handleBooking = async () => {
    if (!bookingData.fullName || !bookingData.email || !bookingData.phone) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    if (bookingData.passengers > (ride!.maxPassengers - ride!.currentPassengers)) {
      toast({
        title: "Não há lugares suficientes",
        description: `Apenas ${ride!.maxPassengers - ride!.currentPassengers} lugar(es) disponível(eis).`,
        variant: "destructive"
      });
      return;
    }

    const bookingDetails = {
      passengers: bookingData.passengers,
      fullName: bookingData.fullName,
      email: bookingData.email,
      phone: bookingData.phone,
      notes: bookingData.notes,
      departureDate: ride!.departureDate
    };

    bookingMutation.mutate(bookingDetails);
  };

  const formatPrice = (price: number) => `${price.toFixed(2)} MT`;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalPrice = ride ? ride.price * bookingData.passengers : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <PageHeader title="Viagem não encontrada" />
        <div className="container mx-auto px-4 max-w-7xl py-6">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6 text-center">
              <p className="text-red-600">Viagem não encontrada.</p>
              <Button onClick={() => setLocation('/rides/search')} className="mt-4">
                Buscar outras viagens
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader title="Reservar Viagem" />
      
      <div className="container mx-auto px-4 max-w-4xl py-6">
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()}
          className="mb-6"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Detalhes da viagem */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes da Viagem</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">Data e hora</div>
                        <div className="font-medium">{formatDate(ride.departureDate)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">Lugares disponíveis</div>
                        <div className="font-medium">{ride.maxPassengers - ride.currentPassengers}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">Tipo</div>
                        <Badge variant="outline">{ride.type}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Formulário de reserva */}
            <Card>
              <CardHeader>
                <CardTitle>Informações do Passageiro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Número de passageiros</label>
                  <Input
                    type="number"
                    min="1"
                    max={ride.maxPassengers - ride.currentPassengers}
                    value={bookingData.passengers}
                    onChange={(e) => setBookingData({...bookingData, passengers: parseInt(e.target.value) || 1})}
                    data-testid="input-passengers"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Nome completo *</label>
                  <Input
                    placeholder="Seu nome completo"
                    value={bookingData.fullName}
                    onChange={(e) => setBookingData({...bookingData, fullName: e.target.value})}
                    data-testid="input-fullname"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={bookingData.email}
                    onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                    data-testid="input-email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Telefone *</label>
                  <Input
                    placeholder="+258 XXX XXX XXX"
                    value={bookingData.phone}
                    onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                    data-testid="input-phone"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Observações (opcional)</label>
                  <Input
                    placeholder="Informações adicionais..."
                    value={bookingData.notes}
                    onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                    data-testid="input-notes"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumo da reserva */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Resumo da Reserva</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Preço por pessoa</span>
                    <span>{formatPrice(ride.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Passageiros</span>
                    <span>×{bookingData.passengers}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleBooking}
                  disabled={bookingMutation.isPending}
                  className="w-full"
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
                
                <p className="text-xs text-gray-500 text-center">
                  Ao confirmar, você concorda com nossos termos de serviço
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <MobileNavigation />
    </div>
  );
}