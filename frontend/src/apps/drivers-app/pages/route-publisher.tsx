import { useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  DollarSign,
  Car,
  Plus,
} from "lucide-react";
// Usando API simplificada diretamente

export default function RoutePublisher() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // 2. Especificar o tipo como string | null
  const [success, setSuccess] = useState(false);

  // 3. CORREÇÃO: Adicione os campos 'date' e 'time' ao estado
  const [formData, setFormData] = useState({
    fromAddress: "",
    toAddress: "",
    date: "", // Campo separado para data
    time: "", // Campo separado para hora
    departureDate: "", // Isto será combinado de date + time
    price: 0,
    maxPassengers: 4,
    vehicleType: "",
    description: "",
    pickupPoint: "",
    dropoffPoint: "",
    vehiclePhoto: null as File | null, // Foto do veículo
  });
  
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        vehiclePhoto: file,
      }));
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async () => {
    if (!user) {
      setError("Deve estar autenticado para publicar uma rota.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 4. Combine date e time para criar departureDate
      const departureDate = `${formData.date}T${formData.time}:00`;

      const rideData = {
        type: formData.vehicleType || "UberX", // Mapeando vehicleType para type
        fromAddress: formData.fromAddress,
        toAddress: formData.toAddress,
        departureDate: departureDate,
        price: Number(formData.price),
        maxPassengers: Number(formData.maxPassengers),
        allowNegotiation: false,
        isRoundTrip: false,
        vehiclePhoto: formData.vehiclePhoto, // Incluir foto do veículo
        description: formData.description,
      };

      console.log("A publicar rota:", rideData);

      // TODO: Implementar usando nova API simplificada
      const response = await fetch('/api/rides-simple/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rideData)
      });
      const result = await response.json();

      console.log("✅ Rota publicada com sucesso na base de dados!", result);
      setSuccess(true);

      // Reset form
      setFormData({
        fromAddress: "",
        toAddress: "",
        date: "",
        time: "",
        departureDate: "",
        price: 0,
        maxPassengers: 4,
        vehicleType: "",
        description: "",
        pickupPoint: "",
        dropoffPoint: "",
        vehiclePhoto: null,
      });
      setPhotoPreview(null);
    } catch (error) {
      // 5. CORREÇÃO: Tratar o erro desconhecido
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao publicar a rota. Tente novamente.";
      console.error("❌ Erro ao publicar rota:", error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const cities = [
    "Maputo",
    "Matola",
    "Beira",
    "Nampula",
    "Chimoio",
    "Nacala",
    "Quelimane",
    "Tete",
    "Xai-Xai",
    "Inhambane",
    "Pemba",
    "Lichinga",
    "Angoche",
    "Maxixe",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Publicar Nova Rota
          </h1>
          <p className="text-gray-600">
            Ofereça lugares na sua viagem e ganhe dinheiro
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-4">
            Rota publicada com sucesso!
          </div>
        )}

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
                <Select
                  onValueChange={(value) =>
                    handleInputChange("fromAddress", value)
                  }
                >
                  <SelectTrigger data-testid="select-from">
                    <SelectValue placeholder="Cidade de origem" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="to" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Para onde
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleInputChange("toAddress", value)
                  }
                >
                  <SelectTrigger data-testid="select-to">
                    <SelectValue placeholder="Cidade de destino" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
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
                  min={new Date().toISOString().split("T")[0]}
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
                <Select
                  onValueChange={(value) =>
                    handleInputChange("maxPassengers", parseInt(value))
                  }
                >
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
                <Select
                  onValueChange={(value) =>
                    handleInputChange("vehicleType", value)
                  }
                >
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
                  onChange={(e) =>
                    handleInputChange("pickupPoint", e.target.value)
                  }
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
                  onChange={(e) =>
                    handleInputChange("dropoffPoint", e.target.value)
                  }
                  data-testid="input-dropoff"
                />
              </div>
            </div>

            {/* Foto do Veículo */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Car className="w-4 h-4 text-blue-600" />
                Foto do Veículo
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                {photoPreview ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <img 
                        src={photoPreview} 
                        alt="Preview do veículo" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setPhotoPreview(null);
                          setFormData(prev => ({ ...prev, vehiclePhoto: null }));
                        }}
                        data-testid="button-remove-photo"
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Car className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <Label htmlFor="vehicle-photo" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Clique para adicionar uma foto do seu veículo
                        </span>
                        <span className="mt-1 block text-xs text-gray-500">
                          PNG, JPG até 5MB
                        </span>
                      </Label>
                      <Input
                        id="vehicle-photo"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                        data-testid="input-vehicle-photo"
                      />
                    </div>
                  </div>
                )}
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
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
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
                disabled={
                  !formData.fromAddress ||
                  !formData.toAddress ||
                  !formData.date ||
                  !formData.time ||
                  !formData.price ||
                  isLoading
                }
                data-testid="button-publish"
              >
                {isLoading ? "A Publicar..." : "Publicar Rota"}
                {!isLoading && <Plus className="w-4 h-4 ml-2" />}
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
              <h3 className="font-medium text-blue-900 mb-2">
                💡 Dicas para uma boa oferta:
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • Defina pontos de encontro conhecidos e de fácil acesso
                </li>
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
