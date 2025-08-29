import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Car as CarIcon, Clock, Users } from "lucide-react";
import RideOfferForm from "../components/RideOfferForm";
import RideSearch from "../components/RideSearch";
import RideResults from "../components/RideResults";

export default function TransportHub() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"search" | "offer" | "history">("search");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (searchData: any) => {
    console.log('Buscar viagens:', searchData);
    // TODO: Implementar busca real
    setSearchResults([]);
  };

  const handleOfferSubmit = (offerData: any) => {
    console.log('Nova oferta:', offerData);
    // TODO: Implementar submissão real
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <CarIcon className="w-8 h-8 mr-3 text-orange-600" />
            Central de Transporte
          </h1>
          <p className="text-gray-600">Encontre ou ofereça boleias por todo Moçambique</p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search" className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Buscar Viagem
            </TabsTrigger>
            <TabsTrigger value="offer" disabled={!user} className="flex items-center">
              <CarIcon className="w-4 h-4 mr-2" />
              Oferecer Boleia
            </TabsTrigger>
            <TabsTrigger value="history" disabled={!user} className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Histórico
            </TabsTrigger>
          </TabsList>

          {/* Buscar Viagem */}
          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Encontrar uma Viagem</CardTitle>
              </CardHeader>
              <CardContent>
                <RideSearch onSearch={handleSearch} />
              </CardContent>
            </Card>
            
            {searchResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Resultados da Busca</CardTitle>
                </CardHeader>
                <CardContent>
                  <RideResults />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Oferecer Boleia */}
          <TabsContent value="offer" className="space-y-6">
            {user ? (
              <RideOfferForm onSubmit={handleOfferSubmit} />
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-600 mb-4">Precisa fazer login para oferecer boleias</p>
                  <Button>Fazer Login</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Histórico */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Suas Viagens</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Histórico de viagens aparecerá aqui</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Viagens Hoje</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
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
                  <p className="text-2xl font-bold text-gray-900">12</p>
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
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}