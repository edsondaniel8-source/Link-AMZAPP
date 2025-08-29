import { useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { Link } from "wouter";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import RideOfferForm from "@/shared/components/RideOfferForm";
import AccommodationManager from "@/shared/components/AccommodationManager";
import { CalendarDays, MapPin, Users, Star, Car, Hotel, Calendar } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const [searchType, setSearchType] = useState<"rides" | "stays" | "events">("rides");
  const [searchQuery, setSearchQuery] = useState({ from: "", to: "", date: "" });
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [activeService, setActiveService] = useState<'rides' | 'stays'>('rides');
  const [showAccommodationManager, setShowAccommodationManager] = useState(false);
  

  const handleSearch = () => {
    console.log('Search:', { type: searchType, ...searchQuery });
    // TODO: Implementar busca
  };

  const handleOfferRide = () => {
    if (!user) {
      alert('Precisa fazer login para oferecer boleia');
      return;
    }
    setShowOfferModal(true);
  };

  const handleRideOfferSubmit = (rideData: any) => {
    console.log('Nova oferta de boleia:', rideData);
    setShowOfferModal(false);
    alert('Oferta de boleia publicada com sucesso!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-orange-600">Link-A</h1>
            <span className="text-gray-500">Moçambique</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Button variant="ghost" onClick={handleOfferRide}>
                  🚗 Oferecer Boleia
                </Button>
                <Button variant="ghost" onClick={() => setShowAccommodationManager(true)}>
                  🏨 Gerir Alojamento
                </Button>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Link href="/profile">
                  <Button variant="outline">Perfil</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Entrar</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="default">Registar</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Viaje por todo Moçambique</h2>
          <p className="text-xl mb-8">Viagens, hospedagem e eventos numa só plataforma</p>
          
          {/* Search Tabs */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex justify-center mb-6">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setSearchType("rides")}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    searchType === "rides"
                      ? "bg-white text-orange-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Car className="w-4 h-4 mr-2" />
                  Viagens
                </button>
                <button
                  onClick={() => setSearchType("stays")}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    searchType === "stays"
                      ? "bg-white text-orange-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Hotel className="w-4 h-4 mr-2" />
                  Hospedagem
                </button>
                <button
                  onClick={() => setSearchType("events")}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    searchType === "events"
                      ? "bg-white text-orange-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Eventos
                </button>
              </div>
            </div>

            {/* Search Form */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {searchType === "rides" ? (
                <>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="De onde?"
                      value={searchQuery.from}
                      onChange={(e) => setSearchQuery({...searchQuery, from: e.target.value})}
                      className="pl-10 text-gray-900"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Para onde?"
                      value={searchQuery.to}
                      onChange={(e) => setSearchQuery({...searchQuery, to: e.target.value})}
                      className="pl-10 text-gray-900"
                    />
                  </div>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="date"
                      value={searchQuery.date}
                      onChange={(e) => setSearchQuery({...searchQuery, date: e.target.value})}
                      className="pl-10 text-gray-900"
                    />
                  </div>
                </>
              ) : searchType === "stays" ? (
                <>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Destino"
                      value={searchQuery.from}
                      onChange={(e) => setSearchQuery({...searchQuery, from: e.target.value})}
                      className="pl-10 text-gray-900"
                    />
                  </div>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="date"
                      placeholder="Check-in"
                      value={searchQuery.date}
                      onChange={(e) => setSearchQuery({...searchQuery, date: e.target.value})}
                      className="pl-10 text-gray-900"
                    />
                  </div>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Hóspedes"
                      value={searchQuery.to}
                      onChange={(e) => setSearchQuery({...searchQuery, to: e.target.value})}
                      className="pl-10 text-gray-900"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Cidade ou evento"
                      value={searchQuery.from}
                      onChange={(e) => setSearchQuery({...searchQuery, from: e.target.value})}
                      className="pl-10 text-gray-900"
                    />
                  </div>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="date"
                      placeholder="Data"
                      value={searchQuery.date}
                      onChange={(e) => setSearchQuery({...searchQuery, date: e.target.value})}
                      className="pl-10 text-gray-900"
                    />
                  </div>
                  <div className="relative">
                    <Input
                      placeholder="Tipo de evento"
                      value={searchQuery.to}
                      onChange={(e) => setSearchQuery({...searchQuery, to: e.target.value})}
                      className="text-gray-900"
                    />
                  </div>
                </>
              )}
              <Button onClick={handleSearch} className="bg-orange-600 hover:bg-orange-700">
                Buscar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Ofertas do Dia Section */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">🔥 Ofertas do Dia</h2>
            <p className="text-lg text-gray-600">As melhores promoções disponíveis hoje</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Oferta de Boleia */}
            <Card className="bg-white border-2 border-orange-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-sm font-medium">
                    🚗 Boleia
                  </div>
                  <div className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                    -25%
                  </div>
                </div>
                <CardTitle className="text-lg">Maputo → Beira</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    Hoje, 14:00
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    2 lugares disponíveis
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <span className="text-lg font-bold text-orange-600">900 MT</span>
                      <span className="text-sm text-gray-500 line-through ml-2">1200 MT</span>
                    </div>
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                      Reservar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Oferta de Hotel */}
            <Card className="bg-white border-2 border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm font-medium">
                    🏨 Hotel
                  </div>
                  <div className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                    -30%
                  </div>
                </div>
                <CardTitle className="text-lg">Hotel Polana</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    Maputo Centro
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
                    4.8 (124 avaliações)
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <span className="text-lg font-bold text-blue-600">2800 MT</span>
                      <span className="text-sm text-gray-500 line-through ml-2">4000 MT</span>
                      <div className="text-xs text-gray-500">por noite</div>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Ver Mais
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Oferta de Evento */}
            <Card className="bg-white border-2 border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-green-100 text-green-600 px-2 py-1 rounded text-sm font-medium">
                    🎉 Evento
                  </div>
                  <div className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                    Últimos ingressos
                  </div>
                </div>
                <CardTitle className="text-lg">Festival de Marrabenta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    15 Set, 19:00
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    Centro Cultural Franco-Moçambicano
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <span className="text-lg font-bold text-green-600">350 MT</span>
                      <div className="text-xs text-gray-500">ingresso</div>
                    </div>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Comprar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Por que escolher Link-A?</h2>
            <p className="text-lg text-gray-600">A melhor forma de viajar e descobrir Moçambique</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Car className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Viagens Seguras</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">Motoristas verificados e veículos inspeccionados para sua segurança</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Hotel className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Hospedagem Quality</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">Hotéis e casas verificadas com as melhores avaliações</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Programa de Pontos</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">Ganhe pontos a cada reserva e troque por descontos</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Modais */}
      {/* Modal para Oferta de Boleia */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <RideOfferForm 
              onSubmit={handleRideOfferSubmit}
              onCancel={() => setShowOfferModal(false)}
            />
          </div>
        </div>
      )}

      {/* Modal para Gestão de Alojamentos */}
      {showAccommodationManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white rounded-lg">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Gestão de Alojamentos</h2>
              <Button 
                variant="outline" 
                onClick={() => setShowAccommodationManager(false)}
              >
                ✕ Fechar
              </Button>
            </div>
            <div className="p-4">
              <AccommodationManager />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation - Home specific with service toggle */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="grid grid-cols-5 h-16">
          <button
            data-testid="mobile-nav-rides"
            onClick={() => setActiveService("rides")}
            className={`flex flex-col items-center justify-center ${
              activeService === "rides" ? "text-primary" : "text-gray-medium"
            }`}
          >
            <i className="fas fa-car text-lg mb-1"></i>
            <span className="text-xs">Viagens</span>
          </button>
          <button
            data-testid="mobile-nav-stays"
            onClick={() => setActiveService("stays")}
            className={`flex flex-col items-center justify-center ${
              activeService === "stays" ? "text-primary" : "text-gray-medium"
            }`}
          >
            <i className="fas fa-bed text-lg mb-1"></i>
            <span className="text-xs">Hospedagem</span>
          </button>
          <button
            data-testid="mobile-nav-offer-ride"
            onClick={() => setShowOfferModal(true)}
            className="flex flex-col items-center justify-center text-gray-medium active:text-primary"
          >
            <i className="fas fa-plus-circle text-lg mb-1"></i>
            <span className="text-xs">Oferecer</span>
          </button>
          <button
            data-testid="mobile-nav-events"
            onClick={() => window.location.href = "/events"}
            className="flex flex-col items-center justify-center text-gray-medium active:text-primary"
          >
            <i className="fas fa-calendar text-lg mb-1"></i>
            <span className="text-xs">Eventos</span>
          </button>
          <button
            data-testid="mobile-nav-bookings"
            onClick={() => window.location.href = "/dashboard"}
            className="flex flex-col items-center justify-center text-gray-medium active:text-primary"
          >
            <i className="fas fa-user text-lg mb-1"></i>
            <span className="text-xs">Perfil</span>
          </button>
        </div>
      </div>

      {/* Ride Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Oferecer Viagem</h3>
            <p className="text-gray-600 mb-4">Esta funcionalidade será implementada em breve.</p>
            <Button onClick={() => setShowOfferModal(false)}>Fechar</Button>
          </div>
        </div>
      )}
    </div>
  );
}
