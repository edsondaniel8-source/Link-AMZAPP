import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hotel, MapPin, Star, Plus, Eye, Calendar } from "lucide-react";
import AccommodationManager from "../components/AccommodationManager";
import StaySearch from "../components/StaySearch";
import StayResults from "../components/StayResults";

export default function AccommodationHub() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"search" | "manage" | "bookings">("search");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (searchData: any) => {
    console.log('Buscar alojamentos:', searchData);
    // TODO: Implementar busca real
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Hotel className="w-8 h-8 mr-3 text-orange-600" />
            Central de Hospedagem
          </h1>
          <p className="text-gray-600">Encontre ou gerir alojamentos em Moçambique</p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search" className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Buscar Alojamento
            </TabsTrigger>
            <TabsTrigger value="manage" disabled={!user} className="flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Gerir Propriedades
            </TabsTrigger>
            <TabsTrigger value="bookings" disabled={!user} className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Reservas
            </TabsTrigger>
          </TabsList>

          {/* Buscar Alojamento */}
          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Encontrar Alojamento</CardTitle>
              </CardHeader>
              <CardContent>
                <StaySearch onSearch={handleSearch} />
              </CardContent>
            </Card>
            
            {searchResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Resultados da Busca</CardTitle>
                </CardHeader>
                <CardContent>
                  <StayResults />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Gerir Propriedades */}
          <TabsContent value="manage" className="space-y-6">
            {user ? (
              <AccommodationManager />
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-600 mb-4">Precisa fazer login para gerir propriedades</p>
                  <Button>Fazer Login</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Reservas */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Suas Reservas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Histórico de reservas aparecerá aqui</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Hotel className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Propriedades Ativas</p>
                  <p className="text-2xl font-bold text-gray-900">45</p>
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
                  <p className="text-2xl font-bold text-gray-900">4.2</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Disponíveis Hoje</p>
                  <p className="text-2xl font-bold text-gray-900">18</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}