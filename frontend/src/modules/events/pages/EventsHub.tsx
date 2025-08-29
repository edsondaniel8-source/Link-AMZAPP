import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Plus, Star, Users, Clock } from "lucide-react";
import EventSearch from "../components/EventSearch";
import EventResults from "../components/EventResults";
import FeaturedEvents from "../components/FeaturedEvents";

export default function EventsHub() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"browse" | "create" | "my-events">("browse");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (searchData: any) => {
    console.log('Buscar eventos:', searchData);
    // TODO: Implementar busca real
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Calendar className="w-8 h-8 mr-3 text-orange-600" />
            Central de Eventos
          </h1>
          <p className="text-gray-600">Descubra e organize eventos em Moçambique</p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse" className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Explorar Eventos
            </TabsTrigger>
            <TabsTrigger value="create" disabled={!user} className="flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Criar Evento
            </TabsTrigger>
            <TabsTrigger value="my-events" disabled={!user} className="flex items-center">
              <Star className="w-4 h-4 mr-2" />
              Meus Eventos
            </TabsTrigger>
          </TabsList>

          {/* Explorar Eventos */}
          <TabsContent value="browse" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Eventos em Destaque</CardTitle>
              </CardHeader>
              <CardContent>
                <FeaturedEvents />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Buscar Eventos</CardTitle>
              </CardHeader>
              <CardContent>
                <EventSearch onSearch={handleSearch} />
              </CardContent>
            </Card>
            
            {searchResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Resultados da Busca</CardTitle>
                </CardHeader>
                <CardContent>
                  <EventResults />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Criar Evento */}
          <TabsContent value="create" className="space-y-6">
            {user ? (
              <Card>
                <CardHeader>
                  <CardTitle>Criar Novo Evento</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Formulário de criação de eventos aparecerá aqui</p>
                  <Button>Começar a Criar</Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-600 mb-4">Precisa fazer login para criar eventos</p>
                  <Button>Fazer Login</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Meus Eventos */}
          <TabsContent value="my-events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Eventos que Organizou</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Seus eventos aparecerão aqui</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Eventos Este Mês</p>
                  <p className="text-2xl font-bold text-gray-900">28</p>
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
                  <p className="text-2xl font-bold text-gray-900">1.2k</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Próximos 7 Dias</p>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}