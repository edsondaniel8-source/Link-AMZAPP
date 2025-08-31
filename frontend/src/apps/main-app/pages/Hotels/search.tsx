import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { ArrowLeft, Calendar, Search, Star, MapPin, Wifi, Car, Coffee, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/shared/components/PageHeader";
import MobileNavigation from "@/shared/components/MobileNavigation";

type Accommodation = {
  id: string;
  name: string;
  type: string;
  location: string;
  price: number;
  rating: number;
  description?: string;
  amenities?: string[];
  images?: string[];
  availableRooms: number;
  createdAt: string;
  updatedAt?: string;
};

export default function HotelSearchPage() {
  const [, setLocation] = useLocation();
  const [searchParams, setSearchParams] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: 2,
    maxPrice: "",
    type: ""
  });
  const [hasSearched, setHasSearched] = useState(false);

  // Parse URL parameters on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const location = params.get('location') || '';
    const checkIn = params.get('checkIn') || '';
    const checkOut = params.get('checkOut') || '';
    const guests = parseInt(params.get('guests') || '2');
    const maxPrice = params.get('maxPrice') || '';
    const type = params.get('type') || '';
    
    if (location) {
      setSearchParams({ location, checkIn, checkOut, guests, maxPrice, type });
      setHasSearched(true);
    }
  }, []);

  // Real implementation needed - currently disabled
  const accommodationsQuery = useQuery({
    queryKey: ['accommodations', searchParams],
    queryFn: () => Promise.resolve([]),
    enabled: false,
  });

  const handleSearch = () => {
    console.log('Searching accommodations with:', searchParams);
    setHasSearched(true);
    // Real search implementation needed
  };

  const handleBookNow = (accommodation: Accommodation) => {
    console.log('Booking accommodation:', accommodation);
    // Real booking implementation needed
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader title="Buscar Alojamentos" />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar Alojamentos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Localização</label>
                <Input
                  placeholder="Ex: Maputo, Beira..."
                  value={searchParams.location}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Check-in</label>
                <Input
                  type="date"
                  value={searchParams.checkIn}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, checkIn: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Check-out</label>
                <Input
                  type="date"
                  value={searchParams.checkOut}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, checkOut: e.target.value }))}
                />
              </div>
            </div>
            
            <Button onClick={handleSearch} className="w-full">
              <Search className="mr-2 h-4 w-4" />
              Buscar Alojamentos
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {hasSearched && (
          <Card className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">Sistema de Alojamentos</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              A funcionalidade de busca de alojamentos requer implementação com dados reais.
            </p>
            <p className="text-sm text-gray-500">
              Funcionalidades planejadas: busca por localização, filtros por preço e tipo, reservas online.
            </p>
          </Card>
        )}
      </div>
      
      <MobileNavigation />
    </div>
  );
}