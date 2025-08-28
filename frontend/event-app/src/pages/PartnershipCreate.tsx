import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare,
  Users,
  DollarSign,
  MapPin,
  Calendar,
  Clock,
  Car,
  Plus,
  Eye,
  Edit3,
  Target,
  TrendingUp,
  Zap
} from "lucide-react";
import { Link } from "wouter";

export default function PartnershipCreate() {
  const [formData, setFormData] = useState({
    title: "",
    eventId: "",
    description: "",
    targetCities: [],
    maxDrivers: "",
    budget: "",
    serviceType: "transfer",
    requirements: "",
    duration: "event_duration",
    urgency: "normal"
  });

  // Mock data - seria substituído por dados reais da API
  const myEvents = [
    {
      id: "1",
      title: "Festival de Música Maputo 2024",
      date: "2024-02-15",
      venue: "Costa do Sol",
      expectedAttendees: 500,
      status: "active"
    },
    {
      id: "2",
      title: "Workshop de Fotografia Digital",
      date: "2024-02-08",
      venue: "Centro Cultural Franco-Moçambicano",
      expectedAttendees: 50,
      status: "active"
    },
    {
      id: "3",
      title: "Feira de Artesanato Tradicional",
      date: "2024-02-20",
      venue: "Praça da Independência",
      expectedAttendees: 200,
      status: "active"
    }
  ];

  const availableCities = [
    "Maputo", "Matola", "Beira", "Nampula", "Quelimane", 
    "Tete", "Xai-Xai", "Inhambane", "Pemba", "Chimoio"
  ];

  const existingProposals = [
    {
      id: "1",
      title: "Transfer VIP Festival",
      event: "Festival de Música Maputo 2024",
      targetCities: ["Maputo", "Matola"],
      maxDrivers: 25,
      applicants: 18,
      budget: 12500,
      status: "active",
      responseRate: 72,
      createdAt: "2024-01-25"
    },
    {
      id: "2",
      title: "Shuttle Workshop Fotografia",
      event: "Workshop de Fotografia Digital",
      targetCities: ["Maputo"],
      maxDrivers: 8,
      applicants: 6,
      budget: 3200,
      status: "active", 
      responseRate: 75,
      createdAt: "2024-01-24"
    },
    {
      id: "3",
      title: "Transport Feira Artesanato",
      event: "Feira de Artesanato Tradicional",
      targetCities: ["Maputo", "Matola", "Beira"],
      maxDrivers: 15,
      applicants: 12,
      budget: 8000,
      status: "completed",
      responseRate: 80,
      createdAt: "2024-01-20"
    }
  ];

  const handleCityToggle = (city: string) => {
    setFormData(prev => ({
      ...prev,
      targetCities: prev.targetCities.includes(city)
        ? prev.targetCities.filter(c => c !== city)
        : [...prev.targetCities, city]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui faria a submissão da proposta
    console.log("Proposta submetida:", formData);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      paused: "bg-orange-100 text-orange-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return colors[status] || colors.active;
  };

  const getStatusText = (status: string) => {
    const texts = {
      active: "Ativo",
      completed: "Concluído",
      paused: "Pausado",
      cancelled: "Cancelado"
    };
    return texts[status] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Propostas para Motoristas
              </h1>
              <p className="text-gray-600 mt-1">
                Crie ofertas de transporte para seus eventos e conecte-se com motoristas qualificados
              </p>
            </div>
            <Badge className="bg-orange-600 text-white px-4 py-2">
              🚀 Sistema Inovador!
            </Badge>
          </div>
        </div>

        {/* Benefits Banner */}
        <Card className="mb-8 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-orange-900 mb-2">
                  Conecte seu evento com motoristas profissionais!
                </h3>
                <p className="text-orange-700 text-sm">
                  Publique ofertas direcionadas para motoristas específicos de cidades à sua escolha. 
                  Aumente a acessibilidade dos seus eventos oferecendo transporte seguro e confiável.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Create Proposal Form */}
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Criar Nova Proposta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título da Proposta
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ex: Transfer VIP para Festival"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Evento Relacionado
                    </label>
                    <select
                      value={formData.eventId}
                      onChange={(e) => setFormData(prev => ({ ...prev, eventId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Selecione um evento</option>
                      {myEvents.map((event) => (
                        <option key={event.id} value={event.id}>
                          {event.title} - {new Date(event.date).toLocaleDateString('pt-MZ')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição da Proposta
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descreva detalhes do serviço de transporte necessário, rotas principais, horários aproximados..."
                    rows={4}
                    required
                  />
                </div>

                {/* Service Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tipo de Serviço
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { value: "transfer", label: "Transfer Direto" },
                      { value: "shuttle", label: "Shuttle Contínuo" },
                      { value: "vip", label: "Transporte VIP" },
                      { value: "group", label: "Transporte em Grupo" }
                    ].map((type) => (
                      <label key={type.value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="serviceType"
                          value={type.value}
                          checked={formData.serviceType === type.value}
                          onChange={(e) => setFormData(prev => ({ ...prev, serviceType: e.target.value }))}
                          className="text-orange-600"
                        />
                        <span className="text-sm">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Target Cities */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Cidades Alvo (selecione múltiplas)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {availableCities.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => handleCityToggle(city)}
                        className={`px-3 py-2 text-sm rounded-full border-2 transition-colors ${
                          formData.targetCities.includes(city)
                            ? 'bg-orange-100 border-orange-300 text-orange-800'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-orange-200'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                  {formData.targetCities.length > 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      Selecionado: {formData.targetCities.join(", ")}
                    </p>
                  )}
                </div>

                {/* Budget and Drivers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Máximo de Motoristas
                    </label>
                    <Input
                      type="number"
                      value={formData.maxDrivers}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxDrivers: e.target.value }))}
                      placeholder="Ex: 20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Orçamento Total (MZN)
                    </label>
                    <Input
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                      placeholder="Ex: 15000"
                      required
                    />
                  </div>
                </div>

                {/* Duration and Urgency */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duração do Serviço
                    </label>
                    <select
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="event_duration">Durante todo o evento</option>
                      <option value="arrival_only">Apenas ida</option>
                      <option value="departure_only">Apenas volta</option>
                      <option value="custom">Horários personalizados</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Urgência
                    </label>
                    <select
                      value={formData.urgency}
                      onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="normal">Normal</option>
                      <option value="urgent">Urgente</option>
                      <option value="very_urgent">Muito Urgente</option>
                    </select>
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requisitos Especiais
                  </label>
                  <Textarea
                    value={formData.requirements}
                    onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                    placeholder="Ex: Veículos com ar condicionado, capacidade mínima, documentação específica..."
                    rows={3}
                  />
                </div>

                <Button type="submit" className="bg-orange-600 hover:bg-orange-700 w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Publicar Proposta
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Stats and Tips */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Estatísticas Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Propostas Ativas</span>
                  <span className="font-bold text-green-600">
                    {existingProposals.filter(p => p.status === "active").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total de Candidatos</span>
                  <span className="font-bold text-blue-600">
                    {existingProposals.reduce((acc, p) => acc + p.applicants, 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Taxa Média de Resposta</span>
                  <span className="font-bold text-purple-600">
                    {Math.round(existingProposals.reduce((acc, p) => acc + p.responseRate, 0) / existingProposals.length)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Orçamento Total</span>
                  <span className="font-bold text-orange-600">
                    {existingProposals.filter(p => p.status === "active")
                      .reduce((acc, p) => acc + p.budget, 0).toLocaleString()} MZN
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800 text-lg">💡 Dicas para Sucesso</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-700 text-sm space-y-3">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5" />
                  <p><strong>Seja específico:</strong> Descreva claramente rotas, horários e requisitos</p>
                </div>
                <div className="flex items-start gap-2">
                  <DollarSign className="w-4 h-4 text-blue-600 mt-0.5" />
                  <p><strong>Orçamento justo:</strong> Ofertas competitivas atraem mais motoristas</p>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
                  <p><strong>Antecedência:</strong> Publique com pelo menos 7 dias de antecedência</p>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                  <p><strong>Múltiplas cidades:</strong> Amplie o alcance para mais candidatos</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Existing Proposals */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Minhas Propostas Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {existingProposals.map((proposal) => (
                <div key={proposal.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{proposal.title}</h3>
                      <p className="text-sm text-gray-600">{proposal.event}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{proposal.targetCities.join(", ")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{proposal.applicants}/{proposal.maxDrivers} candidatos</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{proposal.budget.toLocaleString()} MZN</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(proposal.status)}>
                        {getStatusText(proposal.status)}
                      </Badge>
                      <p className="text-sm text-gray-500 mt-1">
                        Taxa de resposta: {proposal.responseRate}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      Ver Candidatos
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit3 className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}