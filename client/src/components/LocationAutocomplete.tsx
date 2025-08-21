import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

// Mozambican provinces and major cities
const mozambiqueLocations = [
  // Maputo Cidade
  { name: "Maputo", province: "Maputo Cidade", country: "Moçambique", fullName: "Maputo, Maputo Cidade, Moçambique" },
  
  // Maputo Província  
  { name: "Matola", province: "Maputo Província", country: "Moçambique", fullName: "Matola, Maputo Província, Moçambique" },
  { name: "Boane", province: "Maputo Província", country: "Moçambique", fullName: "Boane, Maputo Província, Moçambique" },
  { name: "Manhiça", province: "Maputo Província", country: "Moçambique", fullName: "Manhiça, Maputo Província, Moçambique" },
  { name: "Baião", province: "Maputo Província", country: "Moçambique", fullName: "Baião, Maputo Província, Moçambique" },
  
  // Gaza
  { name: "Xai-Xai", province: "Gaza", country: "Moçambique", fullName: "Xai-Xai, Gaza, Moçambique" },
  { name: "Chokwé", province: "Gaza", country: "Moçambique", fullName: "Chokwé, Gaza, Moçambique" },
  { name: "Chibuto", province: "Gaza", country: "Moçambique", fullName: "Chibuto, Gaza, Moçambique" },
  
  // Inhambane
  { name: "Inhambane", province: "Inhambane", country: "Moçambique", fullName: "Inhambane, Inhambane, Moçambique" },
  { name: "Maxixe", province: "Inhambane", country: "Moçambique", fullName: "Maxixe, Inhambane, Moçambique" },
  { name: "Vilanculos", province: "Inhambane", country: "Moçambique", fullName: "Vilanculos, Inhambane, Moçambique" },
  { name: "Massinga", province: "Inhambane", country: "Moçambique", fullName: "Massinga, Inhambane, Moçambique" },
  
  // Sofala
  { name: "Beira", province: "Sofala", country: "Moçambique", fullName: "Beira, Sofala, Moçambique" },
  { name: "Dondo", province: "Sofala", country: "Moçambique", fullName: "Dondo, Sofala, Moçambique" },
  { name: "Gorongosa", province: "Sofala", country: "Moçambique", fullName: "Gorongosa, Sofala, Moçambique" },
  
  // Manica
  { name: "Chimoio", province: "Manica", country: "Moçambique", fullName: "Chimoio, Manica, Moçambique" },
  { name: "Gondola", province: "Manica", country: "Moçambique", fullName: "Gondola, Manica, Moçambique" },
  { name: "Sussundenga", province: "Manica", country: "Moçambique", fullName: "Sussundenga, Manica, Moçambique" },
  
  // Tete
  { name: "Tete", province: "Tete", country: "Moçambique", fullName: "Tete, Tete, Moçambique" },
  { name: "Moatize", province: "Tete", country: "Moçambique", fullName: "Moatize, Tete, Moçambique" },
  { name: "Cahora Bassa", province: "Tete", country: "Moçambique", fullName: "Cahora Bassa, Tete, Moçambique" },
  
  // Zambézia
  { name: "Quelimane", province: "Zambézia", country: "Moçambique", fullName: "Quelimane, Zambézia, Moçambique" },
  { name: "Mocuba", province: "Zambézia", country: "Moçambique", fullName: "Mocuba, Zambézia, Moçambique" },
  { name: "Milange", province: "Zambézia", country: "Moçambique", fullName: "Milange, Zambézia, Moçambique" },
  { name: "Caia", province: "Zambézia", country: "Moçambique", fullName: "Caia, Zambézia, Moçambique" },
  
  // Nampula
  { name: "Nampula", province: "Nampula", country: "Moçambique", fullName: "Nampula, Nampula, Moçambique" },
  { name: "Nacala", province: "Nampula", country: "Moçambique", fullName: "Nacala, Nampula, Moçambique" },
  { name: "Angoche", province: "Nampula", country: "Moçambique", fullName: "Angoche, Nampula, Moçambique" },
  { name: "Ilha de Moçambique", province: "Nampula", country: "Moçambique", fullName: "Ilha de Moçambique, Nampula, Moçambique" },
  
  // Cabo Delgado
  { name: "Pemba", province: "Cabo Delgado", country: "Moçambique", fullName: "Pemba, Cabo Delgado, Moçambique" },
  { name: "Montepuez", province: "Cabo Delgado", country: "Moçambique", fullName: "Montepuez, Cabo Delgado, Moçambique" },
  { name: "Mocímboa da Praia", province: "Cabo Delgado", country: "Moçambique", fullName: "Mocímboa da Praia, Cabo Delgado, Moçambique" },
  
  // Niassa
  { name: "Lichinga", province: "Niassa", country: "Moçambique", fullName: "Lichinga, Niassa, Moçambique" },
  { name: "Cuamba", province: "Niassa", country: "Moçambique", fullName: "Cuamba, Niassa, Moçambique" },
  { name: "Mandimba", province: "Niassa", country: "Moçambique", fullName: "Mandimba, Niassa, Moçambique" },
];

interface LocationAutocompleteProps {
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onLocationSelect?: (location: typeof mozambiqueLocations[0]) => void;
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
  const [filteredLocations, setFilteredLocations] = useState<typeof mozambiqueLocations>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length >= 2) {
      const filtered = mozambiqueLocations.filter(location =>
        location.name.toLowerCase().includes(value.toLowerCase()) ||
        location.province.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8); // Limit to 8 suggestions
      
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

  const handleLocationClick = (location: typeof mozambiqueLocations[0]) => {
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
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredLocations.map((location, index) => (
            <div
              key={`${location.name}-${location.province}`}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => handleLocationClick(location)}
              data-testid={`suggestion-${index}`}
            >
              <div className="flex items-center">
                <i className="fas fa-map-marker-alt text-primary mr-3"></i>
                <div>
                  <div className="font-medium text-gray-900">{location.name}</div>
                  <div className="text-sm text-gray-500">{location.province}, {location.country}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}