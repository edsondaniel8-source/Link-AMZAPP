import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Calendar, MapPin, Users, Star, Car } from 'lucide-react';
import { LocationAutocomplete } from '@/shared/components/LocationAutocomplete';
import apiService from '@/services/api';
import { useToast } from '@/shared/hooks/use-toast';

interface RideSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Ride {
  id: string;
  fromAddress: string;
  toAddress: string;
  departureDate: string;
  price: string;
  maxPassengers: number;
  currentPassengers: number;
  type: string;
  driverName: string;
  driverRating: string;
  description: string;
}

export default function RideSearchModal({ isOpen, onClose }: RideSearchModalProps) {
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1
  });
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const { toast } = useToast();

  // Buscar rides
  const { data: rides, isLoading, refetch } = useQuery({
    queryKey: ['search-rides', searchParams],
    queryFn: () => apiService.searchRides(searchParams),
    enabled: false // Só buscar quando o usuário pesquisar
  });

  const handleSearch = () => {
    if (!searchParams.from || !searchParams.to) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha origem e destino.",
        variant: "destructive"
      });
      return;
    }
    refetch();
  };

  const handleBookRide = (ride: Ride) => {
    setSelectedRide(ride);
    setShowBookingModal(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Buscar Viagens
            </DialogTitle>
          </DialogHeader>

          {/* Formulário de Busca */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label htmlFor="from">Origem</Label>
              <LocationAutocomplete
                id="from"
                placeholder="De onde?"
                value={searchParams.from}
                onLocationSelect={(location) => 
                  setSearchParams(prev => ({ ...prev, from: location }))
                }
                data-testid="input-origin"
              />
            </div>
            
            <div>
              <Label htmlFor="to">Destino</Label>
              <LocationAutocomplete
                id="to"
                placeholder="Para onde?"
                value={searchParams.to}
                onLocationSelect={(location) => 
                  setSearchParams(prev => ({ ...prev, to: location }))
                }
                data-testid="input-destination"
              />
            </div>
            
            <div>
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={searchParams.date}
                onChange={(e) => setSearchParams(prev => ({ ...prev, date: e.target.value }))}
                data-testid="input-date"
              />
            </div>
            
            <div>
              <Label htmlFor="passengers">Passageiros</Label>
              <Input
                id="passengers"
                type="number"
                min="1"
                max="8"
                value={searchParams.passengers}
                onChange={(e) => setSearchParams(prev => ({ ...prev, passengers: parseInt(e.target.value) }))}
                data-testid="input-passengers"
              />
            </div>
          </div>

          <Button 
            onClick={handleSearch} 
            className="w-full"
            disabled={isLoading}
            data-testid="button-search"
          >
            {isLoading ? "Buscando..." : "Buscar Viagens"}
          </Button>

          {/* Resultados */}
          {rides && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {rides.length} viagens encontradas
              </h3>
              
              {rides.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma viagem encontrada para os critérios selecionados.</p>
                  <p className="text-sm">Tente alterar as datas ou locais da busca.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {rides.map((ride: Ride) => (
                    <Card key={ride.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="h-4 w-4 text-blue-600" />
                              <span className="font-medium">{ride.fromAddress}</span>
                              <span className="text-gray-400">→</span>
                              <span className="font-medium">{ride.toAddress}</span>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(ride.departureDate).toLocaleDateString('pt-MZ')}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {ride.maxPassengers - ride.currentPassengers} lugares
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500" />
                                {ride.driverRating}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{ride.type}</Badge>
                              <span className="text-sm text-gray-600">{ride.driverName}</span>
                            </div>
                            
                            {ride.description && (
                              <p className="text-sm text-gray-600 mt-2">{ride.description}</p>
                            )}
                          </div>
                          
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600 mb-2">
                              {ride.price} MT
                            </div>
                            <Button 
                              onClick={() => handleBookRide(ride)}
                              disabled={ride.maxPassengers - ride.currentPassengers < searchParams.passengers}
                              data-testid={`button-book-${ride.id}`}
                            >
                              {ride.maxPassengers - ride.currentPassengers < searchParams.passengers 
                                ? "Sem lugares" 
                                : "Reservar"
                              }
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Reserva */}
      {selectedRide && (
        <BookingModal 
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedRide(null);
          }}
          ride={selectedRide}
          passengers={searchParams.passengers}
          onBookingComplete={() => {
            setShowBookingModal(false);
            setSelectedRide(null);
            onClose();
            toast({
              title: "Reserva confirmada!",
              description: "Sua viagem foi reservada com sucesso.",
              variant: "default"
            });
          }}
        />
      )}
    </>
  );
}

// Modal de Reserva
interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  ride: Ride;
  passengers: number;
  onBookingComplete: () => void;
}

function BookingModal({ isOpen, onClose, ride, passengers, onBookingComplete }: BookingModalProps) {
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isBooking, setIsBooking] = useState(false);
  const { toast } = useToast();

  const totalAmount = parseFloat(ride.price) * passengers;

  const handleBooking = async () => {
    if (!guestInfo.name || !guestInfo.email || !guestInfo.phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    setIsBooking(true);
    try {
      await apiService.createBooking({
        rideId: ride.id,
        type: 'ride',
        guestInfo,
        details: {
          passengers,
          totalAmount
        }
      });
      
      onBookingComplete();
    } catch (error) {
      toast({
        title: "Erro na reserva",
        description: "Não foi possível completar a reserva. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar Reserva</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Detalhes da Viagem */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Detalhes da Viagem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><strong>Rota:</strong> {ride.fromAddress} → {ride.toAddress}</div>
              <div><strong>Data:</strong> {new Date(ride.departureDate).toLocaleDateString('pt-MZ')}</div>
              <div><strong>Motorista:</strong> {ride.driverName}</div>
              <div><strong>Passageiros:</strong> {passengers}</div>
              <div><strong>Valor total:</strong> <span className="text-green-600 font-bold">{totalAmount} MT</span></div>
            </CardContent>
          </Card>

          {/* Informações do Passageiro */}
          <div className="space-y-3">
            <h4 className="font-medium">Informações do Passageiro</h4>
            
            <div>
              <Label htmlFor="guest-name">Nome completo</Label>
              <Input
                id="guest-name"
                value={guestInfo.name}
                onChange={(e) => setGuestInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Seu nome completo"
                data-testid="input-guest-name"
              />
            </div>
            
            <div>
              <Label htmlFor="guest-email">Email</Label>
              <Input
                id="guest-email"
                type="email"
                value={guestInfo.email}
                onChange={(e) => setGuestInfo(prev => ({ ...prev, email: e.target.value }))}
                placeholder="seu@email.com"
                data-testid="input-guest-email"
              />
            </div>
            
            <div>
              <Label htmlFor="guest-phone">Telefone</Label>
              <Input
                id="guest-phone"
                value={guestInfo.phone}
                onChange={(e) => setGuestInfo(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+258 XX XXX XXXX"
                data-testid="input-guest-phone"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button 
              onClick={handleBooking} 
              disabled={isBooking}
              className="flex-1"
              data-testid="button-confirm-booking"
            >
              {isBooking ? "Reservando..." : "Confirmar Reserva"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}