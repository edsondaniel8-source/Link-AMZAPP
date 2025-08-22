import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

// Enhanced Mozambican locations with neighborhoods, reference points and detailed descriptions
const mozambiqueLocations = [
  // Maputo Cidade - Neighborhoods and Reference Points
  { name: "Maputo", province: "Maputo Cidade", country: "Moçambique", fullName: "Maputo, Maputo Cidade, Moçambique", type: "city" },
  { name: "Polana", province: "Maputo Cidade", country: "Moçambique", fullName: "Polana, Maputo, Maputo Cidade, Moçambique", type: "neighborhood", parentCity: "Maputo" },
  { name: "Baixa", province: "Maputo Cidade", country: "Moçambique", fullName: "Baixa, Maputo, Maputo Cidade, Moçambique", type: "neighborhood", parentCity: "Maputo" },
  { name: "Sommerschield", province: "Maputo Cidade", country: "Moçambique", fullName: "Sommerschield, Maputo, Maputo Cidade, Moçambique", type: "neighborhood", parentCity: "Maputo" },
  { name: "Coop", province: "Maputo Cidade", country: "Moçambique", fullName: "Coop, Maputo, Maputo Cidade, Moçambique", type: "neighborhood", parentCity: "Maputo" },
  { name: "Costa do Sol", province: "Maputo Cidade", country: "Moçambique", fullName: "Costa do Sol, Maputo, Maputo Cidade, Moçambique", type: "neighborhood", parentCity: "Maputo" },
  { name: "Aeroporto Internacional de Maputo", province: "Maputo Cidade", country: "Moçambique", fullName: "Aeroporto Internacional de Maputo, Maputo Cidade, Moçambique", type: "transport_hub", parentCity: "Maputo" },
  { name: "Mercado Central", province: "Maputo Cidade", country: "Moçambique", fullName: "Mercado Central, Maputo, Maputo Cidade, Moçambique", type: "landmark", parentCity: "Maputo" },
  { name: "Praia da Costa do Sol", province: "Maputo Cidade", country: "Moçambique", fullName: "Praia da Costa do Sol, Maputo, Maputo Cidade, Moçambique", type: "beach", parentCity: "Maputo" },
  { name: "Hospital Central de Maputo", province: "Maputo Cidade", country: "Moçambique", fullName: "Hospital Central de Maputo, Maputo, Maputo Cidade, Moçambique", type: "landmark", parentCity: "Maputo" },
  { name: "Universidade Eduardo Mondlane", province: "Maputo Cidade", country: "Moçambique", fullName: "Universidade Eduardo Mondlane, Maputo, Maputo Cidade, Moçambique", type: "landmark", parentCity: "Maputo" },
  
  // Maputo Província  
  { name: "Matola", province: "Maputo Província", country: "Moçambique", fullName: "Matola, Maputo Província, Moçambique", type: "city" },
  { name: "Machava", province: "Maputo Província", country: "Moçambique", fullName: "Machava, Matola, Maputo Província, Moçambique", type: "neighborhood", parentCity: "Matola" },
  { name: "Liberdade", province: "Maputo Província", country: "Moçambique", fullName: "Liberdade, Matola, Maputo Província, Moçambique", type: "neighborhood", parentCity: "Matola" },
  { name: "Boane", province: "Maputo Província", country: "Moçambique", fullName: "Boane, Maputo Província, Moçambique", type: "city" },
  { name: "Manhiça", province: "Maputo Província", country: "Moçambique", fullName: "Manhiça, Maputo Província, Moçambique", type: "city" },
  { name: "Baião", province: "Maputo Província", country: "Moçambique", fullName: "Baião, Maputo Província, Moçambique", type: "city" },
  
  // Gaza
  { name: "Xai-Xai", province: "Gaza", country: "Moçambique", fullName: "Xai-Xai, Gaza, Moçambique", type: "city" },
  { name: "Praia de Xai-Xai", province: "Gaza", country: "Moçambique", fullName: "Praia de Xai-Xai, Xai-Xai, Gaza, Moçambique", type: "beach", parentCity: "Xai-Xai" },
  { name: "Chokwé", province: "Gaza", country: "Moçambique", fullName: "Chokwé, Gaza, Moçambique", type: "city" },
  { name: "Chibuto", province: "Gaza", country: "Moçambique", fullName: "Chibuto, Gaza, Moçambique", type: "city" },
  { name: "Mandlakaze", province: "Gaza", country: "Moçambique", fullName: "Mandlakaze, Gaza, Moçambique", type: "city" },
  
  // Inhambane - Tourism hotspots with beaches and reference points
  { name: "Inhambane", province: "Inhambane", country: "Moçambique", fullName: "Inhambane, Inhambane, Moçambique", type: "city" },
  { name: "Maxixe", province: "Inhambane", country: "Moçambique", fullName: "Maxixe, Inhambane, Moçambique", type: "city" },
  { name: "Vilanculos", province: "Inhambane", country: "Moçambique", fullName: "Vilanculos, Inhambane, Moçambique", type: "city" },
  { name: "Praia de Vilanculos", province: "Inhambane", country: "Moçambique", fullName: "Praia de Vilanculos, Vilanculos, Inhambane, Moçambique", type: "beach", parentCity: "Vilanculos" },
  { name: "Aeroporto de Vilanculos", province: "Inhambane", country: "Moçambique", fullName: "Aeroporto de Vilanculos, Vilanculos, Inhambane, Moçambique", type: "transport_hub", parentCity: "Vilanculos" },
  { name: "Tofo", province: "Inhambane", country: "Moçambique", fullName: "Tofo, Inhambane, Inhambane, Moçambique", type: "beach", parentCity: "Inhambane" },
  { name: "Barra", province: "Inhambane", country: "Moçambique", fullName: "Barra, Inhambane, Inhambane, Moçambique", type: "beach", parentCity: "Inhambane" },
  { name: "Massinga", province: "Inhambane", country: "Moçambique", fullName: "Massinga, Inhambane, Moçambique", type: "city" },
  
  // Sofala - Commercial hub
  { name: "Beira", province: "Sofala", country: "Moçambique", fullName: "Beira, Sofala, Moçambique", type: "city" },
  { name: "Aeroporto de Beira", province: "Sofala", country: "Moçambique", fullName: "Aeroporto de Beira, Beira, Sofala, Moçambique", type: "transport_hub", parentCity: "Beira" },
  { name: "Porto da Beira", province: "Sofala", country: "Moçambique", fullName: "Porto da Beira, Beira, Sofala, Moçambique", type: "transport_hub", parentCity: "Beira" },
  { name: "Chaimite", province: "Sofala", country: "Moçambique", fullName: "Chaimite, Beira, Sofala, Moçambique", type: "neighborhood", parentCity: "Beira" },
  { name: "Munhava", province: "Sofala", country: "Moçambique", fullName: "Munhava, Beira, Sofala, Moçambique", type: "neighborhood", parentCity: "Beira" },
  { name: "Dondo", province: "Sofala", country: "Moçambique", fullName: "Dondo, Sofala, Moçambique", type: "city" },
  { name: "Gorongosa", province: "Sofala", country: "Moçambique", fullName: "Gorongosa, Sofala, Moçambique", type: "city" },
  { name: "Parque Nacional da Gorongosa", province: "Sofala", country: "Moçambique", fullName: "Parque Nacional da Gorongosa, Gorongosa, Sofala, Moçambique", type: "landmark", parentCity: "Gorongosa" },
  
  // Manica
  { name: "Chimoio", province: "Manica", country: "Moçambique", fullName: "Chimoio, Manica, Moçambique", type: "city" },
  { name: "Aeroporto de Chimoio", province: "Manica", country: "Moçambique", fullName: "Aeroporto de Chimoio, Chimoio, Manica, Moçambique", type: "transport_hub", parentCity: "Chimoio" },
  { name: "Gondola", province: "Manica", country: "Moçambique", fullName: "Gondola, Manica, Moçambique", type: "city" },
  { name: "Sussundenga", province: "Manica", country: "Moçambique", fullName: "Sussundenga, Manica, Moçambique", type: "city" },
  
  // Tete
  { name: "Tete", province: "Tete", country: "Moçambique", fullName: "Tete, Tete, Moçambique", type: "city" },
  { name: "Moatize", province: "Tete", country: "Moçambique", fullName: "Moatize, Tete, Moçambique", type: "city" },
  { name: "Cahora Bassa", province: "Tete", country: "Moçambique", fullName: "Cahora Bassa, Tete, Moçambique", type: "landmark" },
  
  // Zambézia
  { name: "Quelimane", province: "Zambézia", country: "Moçambique", fullName: "Quelimane, Zambézia, Moçambique", type: "city" },
  { name: "Mocuba", province: "Zambézia", country: "Moçambique", fullName: "Mocuba, Zambézia, Moçambique", type: "city" },
  { name: "Milange", province: "Zambézia", country: "Moçambique", fullName: "Milange, Zambézia, Moçambique", type: "city" },
  { name: "Caia", province: "Zambézia", country: "Moçambique", fullName: "Caia, Zambézia, Moçambique", type: "city" },
  
  // Nampula
  { name: "Nampula", province: "Nampula", country: "Moçambique", fullName: "Nampula, Nampula, Moçambique", type: "city" },
  { name: "Aeroporto de Nampula", province: "Nampula", country: "Moçambique", fullName: "Aeroporto de Nampula, Nampula, Nampula, Moçambique", type: "transport_hub", parentCity: "Nampula" },
  { name: "Nacala", province: "Nampula", country: "Moçambique", fullName: "Nacala, Nampula, Moçambique", type: "city" },
  { name: "Porto de Nacala", province: "Nampula", country: "Moçambique", fullName: "Porto de Nacala, Nacala, Nampula, Moçambique", type: "transport_hub", parentCity: "Nacala" },
  { name: "Angoche", province: "Nampula", country: "Moçambique", fullName: "Angoche, Nampula, Moçambique", type: "city" },
  { name: "Ilha de Moçambique", province: "Nampula", country: "Moçambique", fullName: "Ilha de Moçambique, Nampula, Moçambique", type: "landmark" },
  
  // Cabo Delgado
  { name: "Pemba", province: "Cabo Delgado", country: "Moçambique", fullName: "Pemba, Cabo Delgado, Moçambique", type: "city" },
  { name: "Aeroporto de Pemba", province: "Cabo Delgado", country: "Moçambique", fullName: "Aeroporto de Pemba, Pemba, Cabo Delgado, Moçambique", type: "transport_hub", parentCity: "Pemba" },
  { name: "Montepuez", province: "Cabo Delgado", country: "Moçambique", fullName: "Montepuez, Cabo Delgado, Moçambique", type: "city" },
  { name: "Mocímboa da Praia", province: "Cabo Delgado", country: "Moçambique", fullName: "Mocímboa da Praia, Cabo Delgado, Moçambique", type: "city" },
  
  // Niassa
  { name: "Lichinga", province: "Niassa", country: "Moçambique", fullName: "Lichinga, Niassa, Moçambique", type: "city" },
  { name: "Cuamba", province: "Niassa", country: "Moçambique", fullName: "Cuamba, Niassa, Moçambique", type: "city" },
  { name: "Mandimba", province: "Niassa", country: "Moçambique", fullName: "Mandimba, Niassa, Moçambique", type: "city" },
] as LocationItem[];

interface LocationItem {
  name: string;
  province: string;
  country: string;
  fullName: string;
  type: 'city' | 'neighborhood' | 'transport_hub' | 'landmark' | 'beach';
  parentCity?: string;
}

interface LocationAutocompleteProps {
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onLocationSelect?: (location: LocationItem) => void;
  className?: string;
  "data-testid"?: string;
}

export default function LocationAutocomplete({
  id,
  placeholder,
  value,
  onChange,
  onLocationSelect,
  className,
  "data-testid": testId,
}: LocationAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<LocationItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const getLocationIcon = (type: LocationItem['type']) => {
    switch (type) {
      case 'city': return 'fas fa-city';
      case 'neighborhood': return 'fas fa-home';
      case 'transport_hub': return 'fas fa-plane';
      case 'landmark': return 'fas fa-landmark';
      case 'beach': return 'fas fa-umbrella-beach';
      default: return 'fas fa-map-marker-alt';
    }
  };

  const getLocationTypeLabel = (type: LocationItem['type']) => {
    switch (type) {
      case 'city': return 'Cidade';
      case 'neighborhood': return 'Bairro';
      case 'transport_hub': return 'Transporte';
      case 'landmark': return 'Ponto de Referência';
      case 'beach': return 'Praia';
      default: return '';
    }
  };

  useEffect(() => {
    if (value.length >= 2) {
      const filtered = (mozambiqueLocations as LocationItem[]).filter(location =>
        location.name.toLowerCase().includes(value.toLowerCase()) ||
        location.province.toLowerCase().includes(value.toLowerCase()) ||
        location.fullName.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 10); // Limit to 10 suggestions
      
      setFilteredLocations(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredLocations([]);
      setIsOpen(false);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocationClick = (location: LocationItem) => {
    onChange(location.name);
    onLocationSelect?.(location);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <i className="fas fa-map-marker-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        <Input
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          className={`pl-10 pr-4 py-3 ${className}`}
          data-testid={testId}
          autoComplete="off"
        />
      </div>
      
      {isOpen && filteredLocations.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {filteredLocations.map((location, index) => (
            <div
              key={`${location.name}-${location.province}`}
              className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-600 last:border-b-0 transition-colors"
              onClick={() => handleLocationClick(location)}
              data-testid={`suggestion-${index}`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <i className={`${getLocationIcon(location.type)} text-primary w-4 h-4`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 dark:text-gray-100">{location.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {location.parentCity && location.parentCity !== location.name && (
                      <span>{location.parentCity}, </span>
                    )}
                    {location.province}, {location.country}
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
                      {getLocationTypeLabel(location.type)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}