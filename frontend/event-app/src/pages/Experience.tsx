import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star,
  MapPin,
  Clock,
  Users,
  Calendar,
  MessageSquare,
  Send,
  Edit3,
  Eye,
  Plus,
  Image,
  Music,
  Utensils,
  Car,
  Wifi,
  Camera,
  Gift,
  Heart,
  Share,
  Bell
} from "lucide-react";

export default function Experience() {
  const [activeTab, setActiveTab] = useState("info");
  const [selectedEvent, setSelectedEvent] = useState("1");

  // Mock data - seria substituído por dados reais da API
  const events = [
    {
      id: "1",
      title: "Festival de Música Maputo 2024",
      type: "Festival",
      date: "2024-02-15T19:00",
      venue: "Costa do Sol",
      description: "O maior festival de música de Moçambique com artistas nacionais e internacionais. Uma experiência única na praia mais bonita de Maputo.",
      fullDescription: "Prepare-se para uma noite inesquecível na Costa do Sol! O Festival de Música Maputo 2024 traz os melhores artistas nacionais e internacionais para celebrar a rica cultura musical moçambicana. Com múltiplos palcos, food trucks gourmet, e atividades interativas para toda a família.",
      status: "active",
      features: [
        { icon: Music, name: "3 Palcos Principais", description: "Música ao vivo simultânea" },
        { icon: Utensils, name: "Food Trucks", description: "Gastronomia diversificada" },
        { icon: Car, name: "Estacionamento Gratuito", description: "Seguro e próximo" },
        { icon: Wifi, name: "WiFi Gratuito", description: "Conexão de alta velocidade" }
      ],
      schedule: [
        { time: "19:00", activity: "Abertura dos Portões", details: "Check-in e welcome drink" },
        { time: "20:00", activity: "DJ Set", details: "Aquecimento com DJs locais" },
        { time: "21:00", activity: "Banda Principal", details: "404 - Rock Moçambicano" },
        { time: "22:30", activity: "Headliner Internacional", details: "Artista especial surpresa" },
        { time: "00:00", activity: "After Party", details: "Música eletrônica até 2h" }
      ],
      location: {
        venue: "Costa do Sol",
        address: "Avenida Marginal, Maputo",
        coordinates: "-25.9692, 32.5837",
        parking: "Disponível",
        publicTransport: "Linha 3 do Tpolis"
      }
    },
    {
      id: "2",
      title: "Workshop de Fotografia Digital",
      type: "Workshop",
      date: "2024-02-08T14:00",
      venue: "Centro Cultural Franco-Moçambicano",
      description: "Aprenda técnicas avançadas de fotografia digital com profissionais renomados.",
      fullDescription: "Um workshop intensivo de 4 horas com fotógrafos profissionais. Aprenda composição, uso da luz, edição básica e técnicas avançadas para melhorar suas fotos.",
      status: "active",
      features: [
        { icon: Camera, name: "Equipamento Incluído", description: "Câmeras profissionais disponíveis" },
        { icon: Gift, name: "Material Gratuito", description: "Guias e recursos digitais" },
        { icon: Users, name: "Grupos Pequenos", description: "Máximo 15 participantes" },
        { icon: Star, name: "Certificado", description: "Certificado de participação" }
      ],
      schedule: [
        { time: "14:00", activity: "Boas-vindas", details: "Apresentação e coffee break" },
        { time: "14:30", activity: "Teoria Básica", details: "Composição e regra dos terços" },
        { time: "15:30", activity: "Prática Externa", details: "Sessão fotográfica no jardim" },
        { time: "16:30", activity: "Edição Digital", details: "Lightroom e Photoshop básico" },
        { time: "17:30", activity: "Apresentação Final", details: "Avaliação dos trabalhos" }
      ],
      location: {
        venue: "Centro Cultural Franco-Moçambicano",
        address: "Rua Timor Leste, Maputo",
        coordinates: "-25.9655, 32.5832",
        parking: "Limitado",
        publicTransport: "Paragem Central"
      }
    }
  ];

  const selectedEventData = events.find(e => e.id === selectedEvent) || events[0];

  const participantFeedback = [
    {
      id: "1",
      name: "Maria Santos",
      rating: 5,
      comment: "Experiência incrível! Organização perfeita e artistas fantásticos. Já estou aguardando o próximo evento!",
      date: "2024-01-28",
      event: "Festival de Música Maputo 2024",
      verified: true
    },
    {
      id: "2", 
      name: "João Pedro",
      rating: 5,
      comment: "Workshop muito bem estruturado. Aprendi muito e os instrutores são excelentes. Recomendo!",
      date: "2024-01-27",
      event: "Workshop de Fotografia Digital",
      verified: true
    },
    {
      id: "3",
      name: "Ana Costa",
      rating: 4,
      comment: "Bom evento, mas acho que poderia ter mais opções vegetarianas na praça de alimentação.",
      date: "2024-01-26",
      event: "Festival de Música Maputo 2024",
      verified: true
    }
  ];

  const notifications = [
    {
      id: "1",
      title: "Lembrete: Festival em 3 dias!",
      message: "Não esqueça de chegar 30 minutos antes. Verifique o local e horário.",
      time: "Há 2 horas",
      type: "reminder",
      event: "Festival de Música Maputo 2024"
    },
    {
      id: "2",
      title: "Mudança na programação",
      message: "O horário da banda principal foi alterado para 21:30h.",
      time: "Há 1 dia",
      type: "update",
      event: "Festival de Música Maputo 2024"
    }
  ];

  const [messageText, setMessageText] = useState("");

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Aqui enviaria a mensagem
      setMessageText("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Experiência do Participante</h1>
              <p className="text-gray-600 mt-1">
                Crie experiências memoráveis e mantenha comunicação direta
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                {events.map((event) => (
                  <option key={event.id} value={event.id}>{event.title}</option>
                ))}
              </select>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Edit3 className="w-4 h-4 mr-2" />
                Editar Experiência
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="info">Informações do Evento</TabsTrigger>
            <TabsTrigger value="schedule">Programação</TabsTrigger>
            <TabsTrigger value="communication">Comunicação</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          {/* Event Info Tab */}
          <TabsContent value="info">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Main Event Info */}
              <Card className="xl:col-span-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2">
                        {selectedEventData.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="outline">{selectedEventData.type}</Badge>
                        <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Share className="w-4 h-4 mr-2" />
                      Compartilhar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Event Details */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-600">Data</p>
                          <p className="font-medium">
                            {new Date(selectedEventData.date).toLocaleDateString('pt-MZ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-600">Horário</p>
                          <p className="font-medium">
                            {new Date(selectedEventData.date).toLocaleTimeString('pt-MZ', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-600">Local</p>
                          <p className="font-medium">{selectedEventData.venue}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-600">Tipo</p>
                          <p className="font-medium">{selectedEventData.type}</p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Sobre o Evento</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedEventData.fullDescription}
                      </p>
                    </div>

                    {/* Features */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">O que está incluído</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedEventData.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                            <feature.icon className="w-5 h-5 text-purple-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-900">{feature.name}</p>
                              <p className="text-sm text-gray-600">{feature.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location & Access */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Localização & Acesso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium text-gray-900">{selectedEventData.location.venue}</p>
                      <p className="text-sm text-gray-600">{selectedEventData.location.address}</p>
                    </div>
                    
                    <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-gray-400" />
                      <span className="ml-2 text-gray-500">Mapa Interativo</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Estacionamento</p>
                        <p className="text-sm text-gray-600">{selectedEventData.location.parking}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Transporte Público</p>
                        <p className="text-sm text-gray-600">{selectedEventData.location.publicTransport}</p>
                      </div>
                    </div>

                    <Button className="w-full" variant="outline">
                      <Car className="w-4 h-4 mr-2" />
                      Como Chegar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Programação Detalhada - {selectedEventData.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedEventData.schedule.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-lg">
                      <div className="bg-purple-600 text-white rounded-lg px-3 py-2 text-sm font-bold min-w-[80px] text-center">
                        {item.time}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{item.activity}</h4>
                        <p className="text-gray-600 text-sm">{item.details}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Bell className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communication Tab */}
          <TabsContent value="communication">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Send Message */}
              <Card className="xl:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Comunicar com Participantes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título da Mensagem
                      </label>
                      <Input placeholder="Assunto da comunicação..." />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mensagem
                      </label>
                      <Textarea
                        placeholder="Digite sua mensagem para os participantes..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        rows={6}
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="sms" className="rounded" />
                        <label htmlFor="sms" className="text-sm">Enviar por SMS</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="email" className="rounded" defaultChecked />
                        <label htmlFor="email" className="text-sm">Enviar por Email</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="app" className="rounded" defaultChecked />
                        <label htmlFor="app" className="text-sm">Notificação no App</label>
                      </div>
                    </div>

                    <Button onClick={handleSendMessage} className="bg-purple-600 hover:bg-purple-700">
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Mensagem
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notificações Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm text-gray-900">
                            {notification.title}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {notification.type === 'reminder' ? 'Lembrete' : 'Atualização'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Feedback List */}
              <Card className="xl:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Avaliações dos Participantes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {participantFeedback.map((feedback) => (
                      <div key={feedback.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-gray-900">{feedback.name}</p>
                                {feedback.verified && (
                                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                                    Verificado
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{feedback.event}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-1">
                              {[...Array(feedback.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                              ))}
                            </div>
                            <p className="text-xs text-gray-500">
                              {new Date(feedback.date).toLocaleDateString('pt-MZ')}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {feedback.comment}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <Button size="sm" variant="outline">
                            <Heart className="w-4 h-4 mr-1" />
                            Útil
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Responder
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Feedback Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Estatísticas de Satisfação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-1">4.8</div>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">Baseado em 127 avaliações</p>
                    </div>

                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-3">
                          <div className="flex items-center gap-1 w-12">
                            <span className="text-sm">{rating}</span>
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-500 h-2 rounded-full"
                              style={{ 
                                width: `${rating === 5 ? 78 : rating === 4 ? 15 : rating === 3 ? 4 : rating === 2 ? 2 : 1}%` 
                              }}
                            />
                          </div>
                          <span className="text-sm text-gray-500 w-8">
                            {rating === 5 ? 78 : rating === 4 ? 15 : rating === 3 ? 4 : rating === 2 ? 2 : 1}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}