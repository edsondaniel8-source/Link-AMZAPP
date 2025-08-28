import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Hotel, 
  Plus,
  Edit3,
  Trash2,
  Search,
  Filter,
  Bed,
  Wifi,
  Car,
  Coffee,
  Tv,
  Wind,
  Bath,
  Mountain,
  DollarSign,
  Users,
  Settings,
  Eye
} from "lucide-react";

export default function Rooms() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data - seria substituído por dados reais da API
  const rooms = [
    {
      id: "1",
      roomNumber: "101",
      roomType: "Standard", 
      description: "Quarto confortável com vista para o jardim",
      images: ["room1.jpg"],
      basePrice: 1200,
      weekendPrice: 1400,
      holidayPrice: 1600,
      maxOccupancy: 2,
      bedType: "Queen",
      bedCount: 1,
      hasPrivateBathroom: true,
      hasAirConditioning: true,
      hasWifi: true,
      hasTV: true,
      hasBalcony: false,
      hasKitchen: false,
      isAvailable: true,
      amenities: ["Wi-Fi gratuito", "Ar condicionado", "TV LCD", "Cofre"]
    },
    {
      id: "2",
      roomNumber: "205",
      roomType: "Deluxe",
      description: "Suite espaçosa com varanda e vista para o mar",
      images: ["room2.jpg"],
      basePrice: 2100,
      weekendPrice: 2500,
      holidayPrice: 2800,
      maxOccupancy: 4,
      bedType: "King",
      bedCount: 1,
      hasPrivateBathroom: true,
      hasAirConditioning: true,
      hasWifi: true,
      hasTV: true,
      hasBalcony: true,
      hasKitchen: false,
      isAvailable: false,
      amenities: ["Wi-Fi gratuito", "Ar condicionado", "TV LCD", "Varanda", "Minibar", "Cofre"]
    },
    {
      id: "3",
      roomNumber: "301",
      roomType: "Suite Premium",
      description: "Suite de luxo com kitchenette e sala de estar",
      images: ["room3.jpg"],
      basePrice: 3200,
      weekendPrice: 3800,
      holidayPrice: 4200,
      maxOccupancy: 6,
      bedType: "King",
      bedCount: 2,
      hasPrivateBathroom: true,
      hasAirConditioning: true,
      hasWifi: true,
      hasTV: true,
      hasBalcony: true,
      hasKitchen: true,
      isAvailable: true,
      amenities: ["Wi-Fi gratuito", "Ar condicionado", "TV LCD", "Kitchenette", "Varanda", "Sala de estar", "Minibar", "Cofre"]
    }
  ];

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.roomType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || 
                         (filterStatus === "available" && room.isAvailable) ||
                         (filterStatus === "occupied" && !room.isAvailable);
    return matchesSearch && matchesFilter;
  });

  const getAmenityIcon = (amenity: string) => {
    const amenityMap: { [key: string]: any } = {
      "Wi-Fi gratuito": Wifi,
      "Ar condicionado": Wind,
      "TV LCD": Tv,
      "Varanda": Mountain,
      "Kitchenette": Coffee,
      "Cofre": Settings,
      "Minibar": Coffee,
      "Sala de estar": Users
    };
    return amenityMap[amenity] || Settings;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestão de Quartos</h1>
              <p className="text-gray-600 mt-1">
                Gerencie quartos, preços e disponibilidade do seu hotel
              </p>
            </div>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Quarto
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Quartos</p>
                  <p className="text-2xl font-bold text-gray-900">40</p>
                </div>
                <Hotel className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Disponíveis</p>
                  <p className="text-2xl font-bold text-green-600">6</p>
                </div>
                <Bed className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ocupados</p>
                  <p className="text-2xl font-bold text-red-600">34</p>
                </div>
                <Users className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Preço Médio</p>
                  <p className="text-2xl font-bold text-purple-600">1,850 MZN</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por número ou tipo de quarto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                >
                  Todos
                </Button>
                <Button
                  variant={filterStatus === "available" ? "default" : "outline"}
                  onClick={() => setFilterStatus("available")}
                >
                  Disponíveis
                </Button>
                <Button
                  variant={filterStatus === "occupied" ? "default" : "outline"}
                  onClick={() => setFilterStatus("occupied")}
                >
                  Ocupados
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <Card key={room.id} className="overflow-hidden">
              <div className="relative">
                <div className="h-48 bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                  <Hotel className="w-16 h-16 text-gray-400" />
                </div>
                <Badge 
                  className={`absolute top-4 right-4 ${
                    room.isAvailable 
                      ? 'bg-green-600 text-white' 
                      : 'bg-red-600 text-white'
                  }`}
                >
                  {room.isAvailable ? 'Disponível' : 'Ocupado'}
                </Badge>
              </div>

              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      Quarto {room.roomNumber}
                    </h3>
                    <Badge variant="outline">{room.roomType}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{room.description}</p>
                </div>

                {/* Pricing */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Padrão</p>
                      <p className="font-bold text-green-600">
                        {room.basePrice.toLocaleString()} MZN
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Fim de semana</p>
                      <p className="font-bold text-orange-600">
                        {room.weekendPrice.toLocaleString()} MZN
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Feriado</p>
                      <p className="font-bold text-red-600">
                        {room.holidayPrice.toLocaleString()} MZN
                      </p>
                    </div>
                  </div>
                </div>

                {/* Room Details */}
                <div className="mb-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>{room.maxOccupancy} pessoas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bed className="w-4 h-4 text-gray-500" />
                      <span>{room.bedCount} {room.bedType}</span>
                    </div>
                    {room.hasPrivateBathroom && (
                      <div className="flex items-center gap-2">
                        <Bath className="w-4 h-4 text-blue-500" />
                        <span>Banheiro privativo</span>
                      </div>
                    )}
                    {room.hasBalcony && (
                      <div className="flex items-center gap-2">
                        <Mountain className="w-4 h-4 text-green-500" />
                        <span>Varanda</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Comodidades:</p>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.slice(0, 4).map((amenity, index) => {
                      const IconComponent = getAmenityIcon(amenity);
                      return (
                        <div key={index} className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded">
                          <IconComponent className="w-3 h-3" />
                          <span>{amenity}</span>
                        </div>
                      );
                    })}
                    {room.amenities.length > 4 && (
                      <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                        +{room.amenities.length - 4} mais
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    Ver Detalhes
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Room Form Modal (simplified version) */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Adicionar Novo Quarto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="roomNumber">Número do Quarto</Label>
                    <Input id="roomNumber" placeholder="Ex: 101" />
                  </div>
                  <div>
                    <Label htmlFor="roomType">Tipo de Quarto</Label>
                    <Input id="roomType" placeholder="Ex: Standard" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea id="description" placeholder="Descreva o quarto..." />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="basePrice">Preço Base (MZN)</Label>
                    <Input id="basePrice" type="number" placeholder="1200" />
                  </div>
                  <div>
                    <Label htmlFor="weekendPrice">Preço Fim de Semana (MZN)</Label>
                    <Input id="weekendPrice" type="number" placeholder="1400" />
                  </div>
                  <div>
                    <Label htmlFor="holidayPrice">Preço Feriado (MZN)</Label>
                    <Input id="holidayPrice" type="number" placeholder="1600" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxOccupancy">Capacidade Máxima</Label>
                    <Input id="maxOccupancy" type="number" placeholder="2" />
                  </div>
                  <div>
                    <Label htmlFor="bedType">Tipo de Cama</Label>
                    <Input id="bedType" placeholder="Queen" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Comodidades</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Switch id="privateBathroom" />
                      <Label htmlFor="privateBathroom">Banheiro privativo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="airConditioning" />
                      <Label htmlFor="airConditioning">Ar condicionado</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="wifi" />
                      <Label htmlFor="wifi">Wi-Fi</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="tv" />
                      <Label htmlFor="tv">TV</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="balcony" />
                      <Label htmlFor="balcony">Varanda</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="kitchen" />
                      <Label htmlFor="kitchen">Kitchenette</Label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={() => setShowAddForm(false)}
                    variant="outline" 
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Adicionar Quarto
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}