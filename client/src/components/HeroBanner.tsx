import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Users, Search } from 'lucide-react';
import logoPath from "@assets/link-a-logo.png";

interface HeroBannerProps {
  activeService: "rides" | "stays";
  onServiceChange: (service: "rides" | "stays") => void;
  onSearch: (params: any) => void;
}

export default function HeroBanner({ activeService, onServiceChange, onSearch }: HeroBannerProps) {
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchData);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Hero Background with Gradient */}
      <div 
        className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 min-h-[500px] flex items-center"
        style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%)'
        }}
      >
        {/* Background Pattern/Texture */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white/20"></div>
          <div className="absolute top-32 right-20 w-32 h-32 rounded-full bg-white/10"></div>
          <div className="absolute bottom-20 left-32 w-16 h-16 rounded-full bg-white/15"></div>
          <div className="absolute bottom-32 right-10 w-24 h-24 rounded-full bg-white/10"></div>
        </div>
        
        {/* Transportation Icons Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 opacity-5">
            <i className="fas fa-car text-8xl text-white"></i>
          </div>
          <div className="absolute top-1/3 right-1/4 opacity-5">
            <i className="fas fa-bed text-6xl text-white"></i>
          </div>
          <div className="absolute bottom-1/4 left-1/3 opacity-5">
            <i className="fas fa-map-marked-alt text-7xl text-white"></i>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-8">
            {/* Logo and Title */}
            <div className="flex items-center justify-center mb-6">
              <img 
                src={logoPath} 
                alt="Link-A" 
                className="h-16 w-16 mr-4"
              />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Link-A
              </h1>
            </div>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              {activeService === "rides" 
                ? "Viagens com preços baixos para você" 
                : "Hospedagem confortável em Moçambique"
              }
            </h2>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
              Trazendo o Futuro do turismo para Moçambique
            </p>
          </div>

          {/* Service Selector */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-1 inline-flex">
              <button
                onClick={() => onServiceChange("rides")}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  activeService === "rides"
                    ? "bg-white text-primary shadow-md"
                    : "text-white hover:bg-white/10"
                }`}
                data-testid="hero-service-rides"
              >
                <i className="fas fa-car mr-2"></i>Viagens
              </button>
              <button
                onClick={() => onServiceChange("stays")}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  activeService === "stays"
                    ? "bg-white text-primary shadow-md"
                    : "text-white hover:bg-white/10"
                }`}
                data-testid="hero-service-stays"
              >
                <i className="fas fa-bed mr-2"></i>Hospedagem
              </button>
            </div>
          </div>

          {/* Search Form */}
          <Card className="bg-white shadow-xl max-w-4xl mx-auto">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* From Location */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {activeService === "rides" ? "Saindo de" : "Localização"}
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder={activeService === "rides" ? "Cidade de origem" : "Onde deseja ficar?"}
                        value={searchData.from}
                        onChange={(e) => setSearchData(prev => ({ ...prev, from: e.target.value }))}
                        className="pl-10 h-12 border-gray-300 focus:border-primary"
                        data-testid="search-from"
                      />
                    </div>
                  </div>

                  {/* To Location (only for rides) */}
                  {activeService === "rides" && (
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Indo para
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Cidade de destino"
                          value={searchData.to}
                          onChange={(e) => setSearchData(prev => ({ ...prev, to: e.target.value }))}
                          className="pl-10 h-12 border-gray-300 focus:border-primary"
                          data-testid="search-to"
                        />
                      </div>
                    </div>
                  )}

                  {/* Date */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {activeService === "rides" ? "Data da viagem" : "Check-in"}
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="date"
                        value={searchData.date}
                        onChange={(e) => setSearchData(prev => ({ ...prev, date: e.target.value }))}
                        className="pl-10 h-12 border-gray-300 focus:border-primary"
                        data-testid="search-date"
                      />
                    </div>
                  </div>

                  {/* Passengers/Guests */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {activeService === "rides" ? "Passageiros" : "Hóspedes"}
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <select
                        value={searchData.passengers}
                        onChange={(e) => setSearchData(prev => ({ ...prev, passengers: Number(e.target.value) }))}
                        className="pl-10 h-12 w-full border border-gray-300 rounded-md focus:border-primary focus:ring-1 focus:ring-primary bg-white"
                        data-testid="search-passengers"
                      >
                        {[1,2,3,4,5,6,7,8].map(num => (
                          <option key={num} value={num}>
                            {num} {activeService === "rides" ? 
                              (num === 1 ? "passageiro" : "passageiros") : 
                              (num === 1 ? "hóspede" : "hóspedes")
                            }
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Search Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    data-testid="search-submit"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Procurar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}