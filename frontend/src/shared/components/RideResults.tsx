import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Map from "./Map";
import BookingModal from "./BookingModal";
import PreBookingChat from "./PreBookingChat";
import UserRatings from "./UserRatings";
import PaymentModal from "./PaymentModal";
import PriceNegotiationModal from "./PriceNegotiationModal";
import EnRoutePickupModal from "./EnRoutePickupModal";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { formatPriceStringAsMzn } from "@/shared/lib/currency";
// import type { Ride } from "@shared/schema";
interface Ride {
  id: string;
  type: string;
  price: string;
  availableIn?: number;
  driverName?: string;
  availableSeats?: number;
  estimatedDuration?: number;
  estimatedDistance?: string;
  allowNegotiation?: boolean;
  allowPickupEnRoute?: boolean;
  isRoundTrip?: boolean;
  route?: string[];
  returnDate?: string;
  returnDepartureTime?: string;
  vehicleInfo?: string;
  departureDate?: string;
  fromLat?: string;
  fromLng?: string;
}

interface RideResultsProps {
  searchParams: {
    from: string;
    to: string;
    when: string;
  };
}

export default function RideResults({ searchParams }: RideResultsProps) {
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentBooking, setPaymentBooking] = useState<any>(null);
  const [showNegotiationModal, setShowNegotiationModal] = useState(false);
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [negotiationRide, setNegotiationRide] = useState<Ride | null>(null);
  const [pickupRide, setPickupRide] = useState<Ride | null>(null);

  const { data: rides = [], isLoading } = useQuery<Ride[]>({
    queryKey: ["/api/rides-simple/search", searchParams.from, searchParams.to],
    enabled: !!searchParams.from && !!searchParams.to,
  });

  const handleBookRide = (ride: Ride) => {
    setSelectedRide(ride);
    setShowBookingModal(true);
  };

  const handleNegotiatePrice = (ride: Ride) => {
    setNegotiationRide(ride);
    setShowNegotiationModal(true);
  };

  const handleEnRoutePickup = (ride: Ride) => {
    setPickupRide(ride);
    setShowPickupModal(true);
  };

  const submitNegotiation = (negotiationData: any) => {
    console.log('Price negotiation submitted:', negotiationData);
    // TODO: Implement API call to submit negotiation
  };

  const submitPickupRequest = (pickupData: any) => {
    console.log('Pickup request submitted:', pickupData);
    // TODO: Implement API call to submit pickup request
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-gray-200 rounded-xl h-96 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Section */}
        <div className="lg:col-span-2">
          <Map
            type="ride"
            from={searchParams.from}
            to={searchParams.to}
            markers={rides.map(ride => ({
              lat: parseFloat(ride.fromLat || "40.7128"),
              lng: parseFloat(ride.fromLng || "-74.0060"),
              popup: `${ride.type} - ${formatPriceStringAsMzn(ride.price)}`,
            }))}
          />
        </div>

        {/* Ride Options */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-dark">Viagens Disponíveis</h3>
          
          {rides.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-car text-gray-400 text-2xl"></i>
              </div>
              <p className="text-gray-medium">Nenhuma viagem disponível para esta rota</p>
              <p className="text-sm text-gray-medium mt-2">Tente ajustar seu local de recolha ou destino</p>
            </div>
          ) : (
            rides.map((ride) => (
              <div
                key={ride.id}
                data-testid={`ride-option-${ride.id}`}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleBookRide(ride)}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-light rounded-full flex items-center justify-center">
                        <i className="fas fa-car text-gray-600"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-dark">{ride.type}</h4>
                        <p className="text-sm text-gray-medium">
                          {ride.availableIn} min de distância
                        </p>
                        {ride.driverName && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-medium">{ride.driverName}</span>
                            <div className="flex items-center gap-1">
                              <i className="fas fa-star text-yellow-500 text-xs"></i>
                              <span className="text-xs">4.8</span>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            <i className="fas fa-users mr-1"></i>
                            {ride.availableSeats || 4} lugares disponíveis
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-dark">{formatPriceStringAsMzn(ride.price)}</p>
                      <p className="text-xs text-gray-medium">
                        {ride.estimatedDuration} min de viagem
                      </p>
                      {ride.estimatedDistance && (
                        <p className="text-xs text-gray-medium">
                          {ride.estimatedDistance} km
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Advanced Features Badges */}
                  <div className="flex gap-2 mb-3">
                    {ride.allowNegotiation && (
                      <Badge variant="secondary" className="text-xs">
                        <i className="fas fa-handshake mr-1"></i>
                        Aceita negociação
                      </Badge>
                    )}
                    {ride.allowPickupEnRoute && (
                      <Badge variant="secondary" className="text-xs">
                        <i className="fas fa-route mr-1"></i>
                        Apanha na rota
                      </Badge>
                    )}
                    {ride.isRoundTrip && (
                      <Badge variant="secondary" className="text-xs">
                        <i className="fas fa-exchange-alt mr-1"></i>
                        Ida e volta
                      </Badge>
                    )}
                  </div>

                  {/* Route Information */}
                  {ride.route && ride.route.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-medium mb-1">Rota:</p>
                      <div className="flex flex-wrap gap-1">
                        {ride.route.map((stop: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {stop}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Round Trip Information */}
                  {ride.isRoundTrip && ride.returnDate && (
                    <div className="mb-3 p-2 bg-blue-50 rounded-lg">
                      <p className="text-xs font-semibold text-blue-800 mb-1">Retorno:</p>
                      <p className="text-xs text-blue-600">
                        {(() => {
                          const date = new Date(ride.returnDate);
                          const day = date.getDate().toString().padStart(2, '0');
                          const month = (date.getMonth() + 1).toString().padStart(2, '0');
                          const year = date.getFullYear();
                          return `${day}/${month}/${year}`;
                        })()}
                        {ride.returnDepartureTime && ` às ${new Date(ride.returnDepartureTime).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', hour12: false })}`}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 border-t">
                    <PreBookingChat
                      recipientId={ride.id}
                      recipientName={ride.driverName || "Motorista"}
                      recipientType="driver"
                      recipientAvatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                      recipientRating={4.8}
                      isOnline={true}
                      responseTime="~15 min"
                      serviceDetails={{
                        type: 'ride',
                        from: searchParams.from,
                        to: searchParams.to,
                        date: searchParams.when,
                        price: formatPriceStringAsMzn(ride.price)
                      }}
                    />

                    {/* New Advanced Feature Buttons */}
                    {ride.allowNegotiation && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleNegotiatePrice(ride)}
                        data-testid={`negotiate-price-${ride.id}`}
                      >
                        <i className="fas fa-handshake mr-1"></i>
                        Negociar
                      </Button>
                    )}

                    {ride.allowPickupEnRoute && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEnRoutePickup(ride)}
                        data-testid={`pickup-enroute-${ride.id}`}
                      >
                        <i className="fas fa-route mr-1"></i>
                        Apanhar
                      </Button>
                    )}
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <i className="fas fa-star mr-2"></i>
                          Ver Avaliações
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Avaliações do Motorista</DialogTitle>
                        </DialogHeader>
                        <UserRatings 
                          userId={ride.id}
                          userType="driver"
                        />
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      size="sm" 
                      onClick={() => {
                        // Show payment modal directly with 10% platform fee
                        const subtotal = parseInt(ride.price.replace(/[^\d]/g, ''));
                        setPaymentBooking({
                          id: ride.id,
                          serviceType: 'ride',
                          serviceName: `${searchParams.from} → ${searchParams.to}`,
                          subtotal,
                          details: `${ride.driverName} - ${ride.vehicleInfo} - ${ride.departureDate ? new Date(ride.departureDate).toLocaleString() : 'Disponível'}`,
                        });
                        setShowPaymentModal(true);
                      }}
                      className="ml-auto"
                      data-testid={`book-ride-${ride.id}`}
                    >
                      <i className="fas fa-calendar-check mr-2"></i>
                      Reservar
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedRide && (
        <BookingModal
          type="ride"
          item={selectedRide}
          searchParams={searchParams}
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedRide(null);
          }}
        />
      )}

      {paymentBooking && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setPaymentBooking(null);
          }}
          booking={paymentBooking}
          onPaymentSuccess={() => {
            // Redirect to dashboard or show success message
            console.log('Payment successful for booking:', paymentBooking.id);
          }}
        />
      )}

      {/* Price Negotiation Modal */}
      {negotiationRide && (
        <PriceNegotiationModal
          isOpen={showNegotiationModal}
          onClose={() => {
            setShowNegotiationModal(false);
            setNegotiationRide(null);
          }}
          ride={negotiationRide}
          onSubmit={submitNegotiation}
        />
      )}

      {/* En-Route Pickup Modal */}
      {pickupRide && (
        <EnRoutePickupModal
          isOpen={showPickupModal}
          onClose={() => {
            setShowPickupModal(false);
            setPickupRide(null);
          }}
          ride={pickupRide}
          onSubmit={submitPickupRequest}
        />
      )}
    </>
  );
}