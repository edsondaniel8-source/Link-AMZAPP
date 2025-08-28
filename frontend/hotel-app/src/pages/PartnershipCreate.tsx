import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  MessageSquare,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Clock,
  Car,
  Star,
  Gift,
  Settings,
  ArrowLeft,
  Plus,
  Minus,
  Info,
  CheckCircle
} from "lucide-react";
import { Link } from "wouter";

export default function PartnershipCreate() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    proposalType: "transfer",
    targetRegions: [],
    minimumDriverLevel: "bronze",
    startDate: "",
    endDate: "",
    timeSlots: [],
    basePayment: "",
    bonusPayment: "",
    premiumRate: "",
    maxDriversNeeded: "",
    minimumRides: "",
    estimatedEarnings: "",
    offerFreeAccommodation: false,
    offerMeals: false,
    offerFuel: false,
    additionalBenefits: [],
    requiresInterview: false
  });

  const [newTimeSlot, setNewTimeSlot] = useState("");
  const [newBenefit, setNewBenefit] = useState("");

  const regionOptions = [
    "Maputo Cidade", "Matola", "Marracuene", "Boane", "Namaacha",
    "Inhaca", "KaTembe", "Costa do Sol", "Catembe", "Mavalane"
  ];

  const proposalTypes = [
    { value: "transfer", label: "Transfer de Hóspedes", description: "Transporte direto para clientes do hotel" },
    { value: "event_transport", label: "Transporte para Eventos", description: "Transporte para eventos organizados pelo hotel" },
    { value: "guest_shuttle", label: "Shuttle Service", description: "Serviço regular de transporte para hóspedes" },
    { value: "airport_transfer", label: "Transfer Aeroporto", description: "Transporte específico para aeroporto" }
  ];

  const driverLevels = [
    { value: "bronze", label: "Bronze", color: "orange" },
    { value: "silver", label: "Prata", color: "gray" },
    { value: "gold", label: "Ouro", color: "yellow" },
    { value: "platinum", label: "Platina", color: "purple" }
  ];

  const addTimeSlot = () => {
    if (newTimeSlot.trim()) {
      setFormData(prev => ({
        ...prev,
        timeSlots: [...prev.timeSlots, newTimeSlot.trim()]
      }));
      setNewTimeSlot("");
    }
  };

  const removeTimeSlot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((_, i) => i !== index)
    }));
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setFormData(prev => ({
        ...prev,
        additionalBenefits: [...prev.additionalBenefits, newBenefit.trim()]
      }));
      setNewBenefit("");
    }
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalBenefits: prev.additionalBenefits.filter((_, i) => i !== index)
    }));
  };

  const toggleRegion = (region: string) => {
    setFormData(prev => ({
      ...prev,
      targetRegions: prev.targetRegions.includes(region)
        ? prev.targetRegions.filter(r => r !== region)
        : [...prev.targetRegions, region]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui seria enviado para a API
    console.log("Proposta criada:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Criar Proposta para Motoristas
              </h1>
              <p className="text-gray-600 mt-1">
                Publique ofertas atrativas para motoristas da sua região
              </p>
            </div>
          </div>

          {/* Info Alert */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900">Como funciona?</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Suas propostas aparecerão em destaque no app dos motoristas. Eles podem se candidatar 
                    e você escolhe os melhores parceiros para seu hotel. É uma forma excelente de aumentar 
                    suas reservas através de motoristas que trazem passageiros!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título da Proposta *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Transfer VIP Weekend"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição Detalhada *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva sua proposta de forma atrativa..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label>Tipo de Proposta *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {proposalTypes.map((type) => (
                    <Card 
                      key={type.value}
                      className={`cursor-pointer transition-colors ${
                        formData.proposalType === type.value 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, proposalType: type.value }))}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-3 h-3 rounded-full ${
                            formData.proposalType === type.value ? 'bg-blue-500' : 'bg-gray-300'
                          }`} />
                          <h4 className="font-medium">{type.label}</h4>
                        </div>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Target Audience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Público Alvo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Regiões Alvo *</Label>
                <p className="text-sm text-gray-600 mb-3">
                  Selecione as regiões onde os motoristas devem atuar:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {regionOptions.map((region) => (
                    <div
                      key={region}
                      onClick={() => toggleRegion(region)}
                      className={`cursor-pointer p-3 rounded-lg border transition-colors ${
                        formData.targetRegions.includes(region)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded border ${
                          formData.targetRegions.includes(region)
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-300'
                        } flex items-center justify-center`}>
                          {formData.targetRegions.includes(region) && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className="text-sm font-medium">{region}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Nível Mínimo do Motorista</Label>
                <div className="flex gap-2 mt-2">
                  {driverLevels.map((level) => (
                    <Button
                      key={level.value}
                      type="button"
                      variant={formData.minimumDriverLevel === level.value ? "default" : "outline"}
                      onClick={() => setFormData(prev => ({ ...prev, minimumDriverLevel: level.value }))}
                      className={`${
                        formData.minimumDriverLevel === level.value 
                          ? `bg-${level.color}-500 hover:bg-${level.color}-600` 
                          : ''
                      }`}
                    >
                      <Star className="w-4 h-4 mr-1" />
                      {level.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule & Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Datas e Horários
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Data de Início *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Data de Fim *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Horários de Trabalho</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                    placeholder="Ex: 06:00-10:00"
                  />
                  <Button type="button" onClick={addTimeSlot}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.timeSlots.map((slot, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {slot}
                      <button
                        type="button"
                        onClick={() => removeTimeSlot(index)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compensation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Compensação e Benefícios
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="basePayment">Pagamento Base (MZN) *</Label>
                  <Input
                    id="basePayment"
                    type="number"
                    value={formData.basePayment}
                    onChange={(e) => setFormData(prev => ({ ...prev, basePayment: e.target.value }))}
                    placeholder="500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="bonusPayment">Bónus (MZN)</Label>
                  <Input
                    id="bonusPayment"
                    type="number"
                    value={formData.bonusPayment}
                    onChange={(e) => setFormData(prev => ({ ...prev, bonusPayment: e.target.value }))}
                    placeholder="200"
                  />
                </div>
                <div>
                  <Label htmlFor="premiumRate">Taxa Premium (%)</Label>
                  <Input
                    id="premiumRate"
                    type="number"
                    value={formData.premiumRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, premiumRate: e.target.value }))}
                    placeholder="40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxDriversNeeded">Número de Motoristas *</Label>
                  <Input
                    id="maxDriversNeeded"
                    type="number"
                    value={formData.maxDriversNeeded}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxDriversNeeded: e.target.value }))}
                    placeholder="10"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="estimatedEarnings">Ganhos Estimados</Label>
                  <Input
                    id="estimatedEarnings"
                    value={formData.estimatedEarnings}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimatedEarnings: e.target.value }))}
                    placeholder="500-800 MZN/dia"
                  />
                </div>
              </div>

              {/* Special Offers */}
              <div className="space-y-3">
                <Label>Ofertas Especiais</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="freeAccommodation"
                      checked={formData.offerFreeAccommodation}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, offerFreeAccommodation: checked }))
                      }
                    />
                    <Label htmlFor="freeAccommodation" className="flex items-center gap-2">
                      <Car className="w-4 h-4" />
                      Alojamento grátis
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="meals"
                      checked={formData.offerMeals}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, offerMeals: checked }))
                      }
                    />
                    <Label htmlFor="meals" className="flex items-center gap-2">
                      <Gift className="w-4 h-4" />
                      Refeições grátis
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fuel"
                      checked={formData.offerFuel}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, offerFuel: checked }))
                      }
                    />
                    <Label htmlFor="fuel" className="flex items-center gap-2">
                      <Car className="w-4 h-4" />
                      Combustível grátis
                    </Label>
                  </div>
                </div>
              </div>

              {/* Additional Benefits */}
              <div>
                <Label>Benefícios Adicionais</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    placeholder="Ex: Gorjetas generosas, Certificado VIP"
                  />
                  <Button type="button" onClick={addBenefit}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.additionalBenefits.map((benefit, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      <Gift className="w-3 h-3" />
                      {benefit}
                      <button
                        type="button"
                        onClick={() => removeBenefit(index)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações Adicionais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="requiresInterview"
                  checked={formData.requiresInterview}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, requiresInterview: checked }))
                  }
                />
                <Label htmlFor="requiresInterview">Requer entrevista antes da aprovação</Label>
              </div>

              <div>
                <Label htmlFor="minimumRides">Mínimo de Viagens (para bónus)</Label>
                <Input
                  id="minimumRides"
                  type="number"
                  value={formData.minimumRides}
                  onChange={(e) => setFormData(prev => ({ ...prev, minimumRides: e.target.value }))}
                  placeholder="5"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Link to="/dashboard" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700">
              <MessageSquare className="w-4 h-4 mr-2" />
              Publicar Proposta
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}