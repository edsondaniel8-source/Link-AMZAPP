import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import BookingStatusCard from "@/components/BookingStatusCard";
import PageHeader from "@/components/PageHeader";
import { Calendar, Clock, User, Car as CarIcon, Bed, CalendarDays } from "lucide-react";

// Mock current user - in real app this would come from auth context
const mockCurrentUser = {
  id: "user-1",
  isProvider: true, // Can be driver, host, or event organizer
  providerTypes: ['driver', 'host', 'organizer'] // ['driver', 'host', 'organizer']
};

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("customer");

  // Fetch user bookings (as customer)
  const { data: customerBookings, isLoading: isLoadingCustomer } = useQuery({
    queryKey: ["/api/bookings/user", mockCurrentUser.id],
    enabled: true,
  });

  // Fetch provider bookings (if user is a provider)
  const { data: providerBookings, isLoading: isLoadingProvider } = useQuery({
    queryKey: ["/api/bookings/provider", mockCurrentUser.id],
    enabled: mockCurrentUser.isProvider,
  });

  // Type-safe arrays with fallback
  const customerBookingsList = Array.isArray(customerBookings) ? customerBookings : [];
  const providerBookingsList = Array.isArray(providerBookings) ? providerBookings : [];

  const getStatusCounts = (bookings: any[]) => {
    return {
      pending: bookings.filter(b => b.status === "pending_approval").length,
      approved: bookings.filter(b => b.status === "approved").length,
      confirmed: bookings.filter(b => b.status === "confirmed").length,
      completed: bookings.filter(b => b.status === "completed").length,
      rejected: bookings.filter(b => b.status === "rejected").length,
    };
  };

  const customerStats = getStatusCounts(customerBookingsList);
  const providerStats = getStatusCounts(providerBookingsList);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader title="Minhas Reservas" />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gerencie todas as suas reservas e solicitações
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="customer" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Como Cliente
            </TabsTrigger>
            <TabsTrigger value="provider" className="flex items-center gap-2">
              <CarIcon className="w-4 h-4" />
              Como Prestador
            </TabsTrigger>
          </TabsList>

          {/* Customer Bookings Tab */}
          <TabsContent value="customer" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full mx-auto mb-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                  </div>
                  <p className="text-2xl font-bold text-yellow-600">{customerStats.pending}</p>
                  <p className="text-xs text-gray-600">Pendentes</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mx-auto mb-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">{customerStats.approved}</p>
                  <p className="text-xs text-gray-600">Aprovadas</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mx-auto mb-2">
                    <CalendarDays className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{customerStats.confirmed}</p>
                  <p className="text-xs text-gray-600">Confirmadas</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full mx-auto mb-2">
                    <CalendarDays className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{customerStats.completed}</p>
                  <p className="text-xs text-gray-600">Concluídas</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full mx-auto mb-2">
                    <CalendarDays className="w-4 h-4 text-red-600" />
                  </div>
                  <p className="text-2xl font-bold text-red-600">{customerStats.rejected}</p>
                  <p className="text-xs text-gray-600">Rejeitadas</p>
                </CardContent>
              </Card>
            </div>

            {/* Customer Bookings List */}
            <div className="space-y-4">
              {isLoadingCustomer ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-gray-600 mt-2">Carregando suas reservas...</p>
                </div>
              ) : customerBookingsList.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <CalendarDays className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Nenhuma reserva encontrada
                    </h3>
                    <p className="text-gray-500">
                      Você ainda não fez nenhuma reserva. Explore nossos serviços e faça sua primeira reserva!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                customerBookingsList.map((booking: any) => (
                  <BookingStatusCard 
                    key={booking.id} 
                    booking={booking} 
                    isProvider={false}
                    currentUserId={mockCurrentUser.id}
                  />
                ))
              )}
            </div>
          </TabsContent>

          {/* Provider Bookings Tab */}
          <TabsContent value="provider" className="space-y-6">
            {!mockCurrentUser.isProvider ? (
              <Card>
                <CardContent className="text-center py-8">
                  <CarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Torne-se um Prestador de Serviços
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Para receber e gerenciar solicitações de reserva, você precisa se registrar como motorista, hospedeiro ou organizador de eventos.
                  </p>
                  <p className="text-sm text-gray-400">
                    Entre em contato com nosso suporte para mais informações sobre como se tornar um prestador verificado.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Provider Statistics */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full mx-auto mb-2">
                        <Clock className="w-4 h-4 text-yellow-600" />
                      </div>
                      <p className="text-2xl font-bold text-yellow-600">{providerStats.pending}</p>
                      <p className="text-xs text-gray-600">Aguardando</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mx-auto mb-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-2xl font-bold text-green-600">{providerStats.approved}</p>
                      <p className="text-xs text-gray-600">Aprovadas</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mx-auto mb-2">
                        <CalendarDays className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold text-blue-600">{providerStats.confirmed}</p>
                      <p className="text-xs text-gray-600">Confirmadas</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full mx-auto mb-2">
                        <CalendarDays className="w-4 h-4 text-purple-600" />
                      </div>
                      <p className="text-2xl font-bold text-purple-600">{providerStats.completed}</p>
                      <p className="text-xs text-gray-600">Concluídas</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full mx-auto mb-2">
                        <CalendarDays className="w-4 h-4 text-red-600" />
                      </div>
                      <p className="text-2xl font-bold text-red-600">{providerStats.rejected}</p>
                      <p className="text-xs text-gray-600">Rejeitadas</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Provider Bookings List */}
                <div className="space-y-4">
                  {isLoadingProvider ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                      <p className="text-gray-600 mt-2">Carregando solicitações...</p>
                    </div>
                  ) : providerBookingsList.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-8">
                        <Bed className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">
                          Nenhuma solicitação pendente
                        </h3>
                        <p className="text-gray-500">
                          Não há solicitações de reserva para seus serviços no momento.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    providerBookingsList.map((booking: any) => (
                      <BookingStatusCard 
                        key={booking.id} 
                        booking={booking} 
                        isProvider={true}
                        currentUserId={mockCurrentUser.id}
                      />
                    ))
                  )}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}