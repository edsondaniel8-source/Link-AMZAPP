import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Map from "./Map";
import BookingModal from "./BookingModal";
import PreBookingChat from "./PreBookingChat";
import UserRatings from "./UserRatings";
import PaymentModal from "./PaymentModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatPriceStringAsMzn } from "@/lib/currency";
import type { Ride } from "@shared/schema";

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

  const { data: rides = [], isLoading } = useQuery<Ride[]>({
    queryKey: ["/api/rides/search", searchParams.from, searchParams.to],
    enabled: !!searchParams.from && !!searchParams.to,
  });

  const handleBookRide = (ride: Ride) => {
    setSelectedRide(ride);
    setShowBookingModal(true);
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
                          details: `${ride.driverName} - ${ride.vehicleType} - ${ride.departureTime}`,
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
    </>
  );
}