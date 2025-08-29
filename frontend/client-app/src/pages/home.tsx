import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CalendarDays, MapPin, Users, Star, Car, Hotel, Calendar } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const [searchType, setSearchType] = useState<"rides" | "stays" | "events">("rides");
  const [searchQuery, setSearchQuery] = useState({ from: "", to: "", date: "" });
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [activeService, setActiveService] = useState<'rides' | 'stays'>('rides');
  
  const handleSubmitOffer = () => {
    console.log('Oferecer viagem');
    setShowOfferModal(false);
  };

  const handleSearch = () => {
    console.log('Search:', { type: searchType, ...searchQuery });
    // TODO: Implementar busca
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
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Link href="/bookings">
                  <Button variant="ghost">Minhas Reservas</Button>
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
                <Link href="/login">
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
