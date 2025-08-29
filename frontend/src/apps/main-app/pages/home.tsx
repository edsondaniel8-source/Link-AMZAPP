import { useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { Link } from "wouter";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { CalendarDays, MapPin, Users, Star, Car, Hotel, Calendar, Search, TrendingUp } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const [searchType, setSearchType] = useState<"rides" | "stays" | "events">("rides");
  const [searchQuery, setSearchQuery] = useState({ from: "", to: "", date: "" });

  const handleSearch = () => {
    console.log('Busca:', { type: searchType, ...searchQuery });
    // TODO: Implementar busca
  };

  // Ofertas em destaque da semana
  const weeklyHighlights = {
    rides: [
      { from: "Maputo", to: "Beira", price: 1500, date: "2024-01-15", driver: "João M.", rating: 4.8 },
      { from: "Nampula", to: "Nacala", price: 800, date: "2024-01-16", driver: "Maria S.", rating: 4.9 },
      { from: "Tete", to: "Chimoio", price: 1200, date: "2024-01-17", driver: "Carlos A.", rating: 4.7 }
    ],
    stays: [
      { name: "Hotel Marisol", location: "Maputo", price: 3500, rating: 4.6, image: "🏨" },
      { name: "Pensão Oceano", location: "Beira", price: 2200, rating: 4.4, image: "🏖️" },
      { name: "Lodge Safari", location: "Gorongosa", price: 4800, rating: 4.9, image: "🦁" }
    ],
    events: [
      { name: "Festival de Marrabenta", location: "Maputo", date: "2024-02-10", price: 500 },
      { name: "Feira Artesanal", location: "Beira", date: "2024-02-15", price: 200 },
      { name: "Concerto de Música", location: "Nampula", date: "2024-02-20", price: 750 }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-orange-600">Link-A</h1>
            <span className="text-gray-500">Clientes</span>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/bookings" data-testid="link-bookings">
                  <Button variant="ghost">📋 Minhas Reservas</Button>
                </Link>
                <Link href="/chat" data-testid="link-chat">
                  <Button variant="ghost">💬 Chat</Button>
                </Link>
                <span className="text-sm text-gray-600">Olá, {user.email}</span>
              </>
            ) : (
              <Link href="/login" data-testid="link-login">
                <Button>Entrar</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Encontrar Ofertas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant={searchType === "rides" ? "default" : "outline"}
                onClick={() => setSearchType("rides")}
                data-testid="button-search-rides"
              >
                <Car className="w-4 h-4 mr-2" />
                Boleias
              </Button>
              <Button
                variant={searchType === "stays" ? "default" : "outline"}
                onClick={() => setSearchType("stays")}
                data-testid="button-search-stays"
              >
                <Hotel className="w-4 h-4 mr-2" />
                Alojamentos
              </Button>
              <Button
                variant={searchType === "events" ? "default" : "outline"}
                onClick={() => setSearchType("events")}
                data-testid="button-search-events"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Eventos
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {searchType === "rides" ? "De onde" : searchType === "stays" ? "Destino" : "Localização"}
                </label>
                <Input
                  placeholder={searchType === "rides" ? "Cidade de origem" : "Onde quer ficar"}
                  value={searchQuery.from}
                  onChange={(e) => setSearchQuery({...searchQuery, from: e.target.value})}
                  data-testid="input-from"
                />
              </div>
              {searchType === "rides" && (
                <div>
                  <label className="block text-sm font-medium mb-2">Para onde</label>
                  <Input
                    placeholder="Cidade de destino"
                    value={searchQuery.to}
                    onChange={(e) => setSearchQuery({...searchQuery, to: e.target.value})}
                    data-testid="input-to"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-2">Data</label>
                <Input
                  type="date"
                  value={searchQuery.date}
                  onChange={(e) => setSearchQuery({...searchQuery, date: e.target.value})}
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

        {/* Weekly Highlights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Destaques da Semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {searchType === "rides" && (
                <>
                  {weeklyHighlights.rides.map((ride, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Car className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{ride.from} → {ride.to}</span>
                        </div>
                        <p className="text-2xl font-bold text-green-600 mb-2">{ride.price} MZN</p>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>📅 {ride.date}</p>
                          <p>👨‍💼 {ride.driver}</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{ride.rating}</span>
                          </div>
                        </div>
                        <Button className="w-full mt-4" size="sm" data-testid={`button-book-ride-${index}`}>
                          Reservar Boleia
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}

              {searchType === "stays" && (
                <>
                  {weeklyHighlights.stays.map((stay, index) => (
                    <Card key={index} className="border-l-4 border-l-green-500">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{stay.image}</span>
                          <span className="font-medium">{stay.name}</span>
                        </div>
                        <p className="text-2xl font-bold text-green-600 mb-2">{stay.price} MZN/noite</p>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>📍 {stay.location}</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{stay.rating}</span>
                          </div>
                        </div>
                        <Button className="w-full mt-4" size="sm" data-testid={`button-book-stay-${index}`}>
                          Reservar Estadia
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}

              {searchType === "events" && (
                <>
                  {weeklyHighlights.events.map((event, index) => (
                    <Card key={index} className="border-l-4 border-l-purple-500">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-purple-600" />
                          <span className="font-medium">{event.name}</span>
                        </div>
                        <p className="text-2xl font-bold text-green-600 mb-2">{event.price} MZN</p>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>📍 {event.location}</p>
                          <p>📅 {event.date}</p>
                        </div>
                        <Button className="w-full mt-4" size="sm" data-testid={`button-book-event-${index}`}>
                          Reservar Ingresso
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}