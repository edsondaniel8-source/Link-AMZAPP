import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, MapPin, Users, Star, Car as CarIcon, Hotel, Calendar, TrendingUp, ArrowRight } from "lucide-react";
import DealsOfTheDay from "@/components/DealsOfTheDay";

export default function Home() {
  const {} = useAuth();
  const [activeModule, setActiveModule] = useState<"transport" | "accommodation" | "events">("transport");

  // Dados mockados para demonstração
  const stats = {
    transport: { daily: 24, active: 12, destinations: 8 },
    accommodation: { active: 45, rating: 4.2, available: 18 },
    events: { monthly: 28, participants: 1200, upcoming: 5 }
  };

  const quickActions = [
    {
      module: "transport",
      title: "Transporte",
      subtitle: "Viagens e boleias",
      icon: CarIcon,
      color: "bg-blue-500",
      description: "Encontre ou ofereça boleias por todo Moçambique",
      link: "/transport"
    },
    {
      module: "accommodation", 
      title: "Hospedagem",
      subtitle: "Alojamentos",
      icon: Hotel,
      color: "bg-green-500",
      description: "Reserve ou gerir propriedades em destinos únicos",
      link: "/accommodation"
    },
    {
      module: "events",
      title: "Eventos",
      subtitle: "Experiências",
      icon: Calendar,
      color: "bg-purple-500", 
      description: "Descubra eventos culturais e sociais",
      link: "/events"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header será adicionado posteriormente */}

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Viaje por todo Moçambique
          </h1>
          <p className="text-xl mb-8">
            Viagens, hospedagem e eventos numa só plataforma
          </p>

          {/* Quick Module Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {quickActions.map((action) => (
              <Link key={action.module} href={action.link}>
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <action.icon className="w-12 h-12 mx-auto mb-4 text-white" />
                    <h3 className="text-xl font-semibold mb-2">{action.title}</h3>
                    <p className="text-white/80 text-sm mb-4">{action.description}</p>
                    <div className="flex items-center justify-center text-sm font-medium">
                      Explorar <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {/* Módulos em Destaque */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Explore Nossa Plataforma
          </h2>
          
          <Tabs value={activeModule} onValueChange={(value) => setActiveModule(value as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="transport" className="flex items-center">
                <CarIcon className="w-4 h-4 mr-2" />
                Transporte
              </TabsTrigger>
              <TabsTrigger value="accommodation" className="flex items-center">
                <Hotel className="w-4 h-4 mr-2" />
                Hospedagem
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Eventos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transport" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Users className="w-8 h-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Viagens Hoje</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.transport.daily}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <CarIcon className="w-8 h-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Motoristas Ativos</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.transport.active}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <MapPin className="w-8 h-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Destinos</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.transport.destinations}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="text-center">
                <Link href="/transport">
                  <Button size="lg">Explorar Transporte</Button>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="accommodation" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Hotel className="w-8 h-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Propriedades</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.accommodation.active}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Star className="w-8 h-8 text-yellow-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Avaliação Média</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.accommodation.rating}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <TrendingUp className="w-8 h-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Disponíveis</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.accommodation.available}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="text-center">
                <Link href="/accommodation">
                  <Button size="lg">Explorar Hospedagem</Button>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Calendar className="w-8 h-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Eventos Este Mês</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.events.monthly}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Users className="w-8 h-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Participantes</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.events.participants}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <CalendarDays className="w-8 h-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Próximos 7 Dias</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.events.upcoming}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="text-center">
                <Link href="/events">
                  <Button size="lg">Explorar Eventos</Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Ofertas do Dia */}
        <DealsOfTheDay />
      </section>
    </div>
  );
}