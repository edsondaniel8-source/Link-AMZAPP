import { useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { MapPin, Calendar, Clock, Users, DollarSign, Car, Plus } from "lucide-react";

export default function RoutePublisher() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    totalSeats: 4,
    price: "",
    vehicleType: "",
    description: "",
    pickupPoint: "",
    dropoffPoint: ""
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePublish = () => {
    console.log("Publicar rota:", formData);
    // TODO: Implementar publicação da rota
    alert("Rota publicada com sucesso!");
  };

  const cities = [
    "Maputo", "Matola", "Beira", "Nampula", "Chimoio", "Nacala", "Quelimane", 
    "Tete", "Xai-Xai", "Inhambane", "Pemba", "Lichinga", "Angoche", "Maxixe"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Publicar Nova Rota</h1>
          <p className="text-gray-600">Ofereça lugares na sua viagem e ganhe dinheiro</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Detalhes da Viagem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Origem e Destino */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  De onde
                </Label>
                <Select onValueChange={(value) => handleInputChange("from", value)}>
                  <SelectTrigger data-testid="select-from">
                    <SelectValue placeholder="Cidade de origem" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="to" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Para onde
                </Label>
                <Select onValueChange={(value) => handleInputChange("to", value)}>
                  <SelectTrigger data-testid="select-to">
                    <SelectValue placeholder="Cidade de destino" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Data e Hora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  Data da Viagem
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  data-testid="input-date"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  Hora de Partida
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                  data-testid="input-time"
                />
              </div>
            </div>

            {/* Lugares e Preço */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="seats" className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  Lugares Disponíveis
                </Label>
                <Select onValueChange={(value) => handleInputChange("totalSeats", parseInt(value))}>
                  <SelectTrigger data-testid="select-seats">
                    <SelectValue placeholder="Quantos lugares" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 lugar</SelectItem>
                    <SelectItem value="2">2 lugares</SelectItem>
                    <SelectItem value="3">3 lugares</SelectItem>
                    <SelectItem value="4">4 lugares</SelectItem>
                    <SelectItem value="5">5 lugares</SelectItem>
                    <SelectItem value="6">6+ lugares</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  Preço por Pessoa (MZN)
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="ex: 1500"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  data-testid="input-price"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle" className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-red-600" />
                  Tipo de Veículo
                </Label>
                <Select onValueChange={(value) => handleInputChange("vehicleType", value)}>
                  <SelectTrigger data-testid="select-vehicle">
                    <SelectValue placeholder="Seu veículo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedan">Sedan</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="hatchback">Hatchback</SelectItem>
                    <SelectItem value="pickup">Pick-up</SelectItem>
                    <SelectItem value="van">Van/Minibus</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Pontos de Encontro */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pickup" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  Ponto de Encontro (Origem)
                </Label>
                <Input
                  id="pickup"
                  placeholder="Ex: Shopping Maputo Sul, entrada principal"
                  value={formData.pickupPoint}
                  onChange={(e) => handleInputChange("pickupPoint", e.target.value)}
                  data-testid="input-pickup"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dropoff" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Ponto de Chegada (Destino)
                </Label>
                <Input
                  id="dropoff"
                  placeholder="Ex: Terminal Rodoviário de Beira"
                  value={formData.dropoffPoint}
                  onChange={(e) => handleInputChange("dropoffPoint", e.target.value)}
                  data-testid="input-dropoff"
                />
              </div>
            </div>

            {/* Observações */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Observações Adicionais (Opcional)
              </Label>
              <Textarea
                id="description"
                placeholder="Ex: Aceito bagagem extra por 100 MZN, não fumadores, etc."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
                data-testid="textarea-description"
              />
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={handlePublish}
                className="flex-1"
                size="lg"
                disabled={!formData.from || !formData.to || !formData.date || !formData.time || !formData.price}
                data-testid="button-publish"
              >
                <Plus className="w-4 h-4 mr-2" />
                Publicar Rota
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.history.back()}
                data-testid="button-cancel"
              >
                Cancelar
              </Button>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">💡 Dicas para uma boa oferta:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Defina pontos de encontro conhecidos e de fácil acesso</li>
                <li>• Seja claro sobre regras (bagagem, fumar, etc.)</li>
                <li>• Defina preços justos e competitivos</li>
                <li>• Mantenha seu perfil e avaliações atualizadas</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}