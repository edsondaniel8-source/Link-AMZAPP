import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Star,
  TrendingUp,
  MessageSquare,
  ThumbsUp,
  AlertCircle,
  Filter,
  Search,
  Reply,
  Flag,
  Award,
  Users,
  Calendar,
  BarChart3
} from "lucide-react";

export default function Reviews() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showReplyForm, setShowReplyForm] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // Mock data - seria substituído por dados reais da API
  const reviewStats = {
    averageRating: 4.6,
    totalReviews: 342,
    distribution: {
      5: 198,
      4: 89,
      3: 34,
      2: 15,
      1: 6
    },
    monthlyGrowth: 8.5,
    responseRate: 92,
    averageResponseTime: "2h 15m"
  };

  const reviews = [
    {
      id: "R001",
      guestName: "Maria Santos",
      rating: 5,
      title: "Experiência excepcional!",
      comment: "Fiquei hospedada por 3 noites e foi simplesmente perfeito. O quarto era espaçoso, limpo e com vista deslumbrante para o mar. O atendimento da equipe foi impecável, sempre prontos a ajudar. O pequeno-almoço era variado e delicioso. Recomendo vivamente!",
      date: "2024-01-25",
      roomType: "Suite Deluxe",
      stayDuration: 3,
      verified: true,
      helpful: 12,
      hotelResponse: null,
      categories: {
        cleanliness: 5,
        service: 5,
        location: 5,
        value: 4,
        amenities: 5
      }
    },
    {
      id: "R002",
      guestName: "João Pedro",
      rating: 4,
      title: "Muito bom, mas pode melhorar",
      comment: "Hotel com boa localização e quartos confortáveis. O atendimento foi cordial e profissional. Apenas o Wi-Fi estava um pouco instável durante a minha estadia. No geral, uma experiência positiva e voltaria novamente.",
      date: "2024-01-22",
      roomType: "Quarto Standard",
      stayDuration: 2,
      verified: true,
      helpful: 8,
      hotelResponse: {
        text: "Obrigado pelo seu feedback, João! Ficamos felizes que tenha gostado da sua estadia. Já resolvemos o problema do Wi-Fi e esperamos recebê-lo novamente em breve!",
        date: "2024-01-23",
        respondent: "Gestão do Hotel"
      },
      categories: {
        cleanliness: 4,
        service: 4,
        location: 5,
        value: 4,
        amenities: 3
      }
    },
    {
      id: "R003",
      guestName: "Ana Costa",
      rating: 2,
      title: "Experiência abaixo das expectativas",
      comment: "Infelizmente, a minha estadia não foi como esperava. O quarto tinha alguns problemas de manutenção (torneira a pingar, ar condicionado barulhento) e o serviço de quarto demorou muito. O pequeno-almoço também estava limitado. Espero que melhorem estes aspetos.",
      date: "2024-01-20",
      roomType: "Quarto Deluxe",
      stayDuration: 1,
      verified: true,
      helpful: 5,
      hotelResponse: null,
      categories: {
        cleanliness: 2,
        service: 2,
        location: 4,
        value: 2,
        amenities: 2
      }
    },
    {
      id: "R004",
      guestName: "Carlos Silva",
      rating: 5,
      title: "Perfect para negócios",
      comment: "Excelente hotel para viagens de negócios. WiFi rápido, secretária confortável no quarto, e localização central. O serviço de business center funcionou perfeitamente. Equipe muito profissional e eficiente.",
      date: "2024-01-18",
      roomType: "Suite Premium",
      stayDuration: 4,
      verified: true,
      helpful: 15,
      hotelResponse: {
        text: "Muito obrigado, Carlos! É um prazer receber hóspedes como você. Ficamos felizes que os nossos serviços de negócios tenham atendido às suas necessidades. Esperamos vê-lo novamente!",
        date: "2024-01-19",
        respondent: "Gestão do Hotel"
      },
      categories: {
        cleanliness: 5,
        service: 5,
        location: 5,
        value: 5,
        amenities: 5
      }
    }
  ];

  const filteredReviews = reviews.filter(review => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "positive") return review.rating >= 4;
    if (selectedFilter === "negative") return review.rating <= 2;
    if (selectedFilter === "unanswered") return !review.hotelResponse;
    return true;
  });

  const getStarArray = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const handleReply = (reviewId: string) => {
    // Aqui seria enviado para a API
    console.log(`Reply to review ${reviewId}: ${replyText}`);
    setShowReplyForm(null);
    setReplyText("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Avaliações & Reputação</h1>
              <p className="text-gray-600 mt-1">
                Acompanhe o feedback dos hóspedes e gerencie sua reputação online
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">
                <Award className="w-4 h-4 mr-1" />
                Hotel Recomendado
              </Badge>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-700">Avaliação Média</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-3xl font-bold text-yellow-900">
                      {reviewStats.averageRating}
                    </p>
                    <div className="flex">
                      {getStarArray(Math.round(reviewStats.averageRating))}
                    </div>
                  </div>
                  <p className="text-xs text-yellow-600 mt-1">
                    {reviewStats.totalReviews} avaliações
                  </p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Reviews</p>
                  <p className="text-3xl font-bold text-gray-900">{reviewStats.totalReviews}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">+{reviewStats.monthlyGrowth}%</span>
                  </div>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taxa de Resposta</p>
                  <p className="text-3xl font-bold text-gray-900">{reviewStats.responseRate}%</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Tempo médio: {reviewStats.averageResponseTime}
                  </p>
                </div>
                <Reply className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Sem Resposta</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {reviews.filter(r => !r.hotelResponse).length}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">Requer atenção</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mb-8">
          {/* Rating Distribution */}
          <Card className="xl:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Distribuição das Avaliações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium w-3">{rating}</span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${(reviewStats.distribution[rating] / reviewStats.totalReviews) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">
                      {reviewStats.distribution[rating]}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <div className="xl:col-span-3 space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-2">
                  {[
                    { key: "all", label: "Todas", count: reviews.length },
                    { key: "positive", label: "Positivas", count: reviews.filter(r => r.rating >= 4).length },
                    { key: "negative", label: "Negativas", count: reviews.filter(r => r.rating <= 2).length },
                    { key: "unanswered", label: "Sem Resposta", count: reviews.filter(r => !r.hotelResponse).length }
                  ].map((filter) => (
                    <Button
                      key={filter.key}
                      variant={selectedFilter === filter.key ? "default" : "outline"}
                      onClick={() => setSelectedFilter(filter.key)}
                      size="sm"
                    >
                      {filter.label} ({filter.count})
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews List */}
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Review Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{review.guestName}</h4>
                              {review.verified && (
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  Verificado
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                              <div className="flex">
                                {getStarArray(review.rating)}
                              </div>
                              <span className="text-sm text-gray-600">
                                • {review.roomType} • {review.stayDuration} noites
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(review.date).toLocaleDateString('pt-MZ')}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="outline">
                            <Flag className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Review Content */}
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
                        <p className="text-gray-700 mb-3">{review.comment}</p>
                        
                        {/* Category Ratings */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
                          {Object.entries(review.categories).map(([category, rating]) => (
                            <div key={category} className="text-xs">
                              <p className="text-gray-500 mb-1 capitalize">
                                {category === "cleanliness" ? "Limpeza" :
                                 category === "service" ? "Serviço" :
                                 category === "location" ? "Localização" :
                                 category === "value" ? "Valor" : "Comodidades"}
                              </p>
                              <div className="flex">
                                {getStarArray(rating)}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            Útil ({review.helpful})
                          </Button>
                        </div>
                      </div>

                      {/* Hotel Response */}
                      {review.hotelResponse && (
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Reply className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium text-blue-900">
                                  {review.hotelResponse.respondent}
                                </span>
                                <span className="text-xs text-blue-600">
                                  {new Date(review.hotelResponse.date).toLocaleDateString('pt-MZ')}
                                </span>
                              </div>
                              <p className="text-blue-800">{review.hotelResponse.text}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Reply Form or Button */}
                      {!review.hotelResponse && (
                        <div>
                          {showReplyForm === review.id ? (
                            <div className="space-y-3">
                              <Textarea
                                placeholder="Escreva a sua resposta..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                rows={3}
                              />
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  onClick={() => handleReply(review.id)}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  Enviar Resposta
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setShowReplyForm(null)}
                                >
                                  Cancelar
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setShowReplyForm(review.id)}
                            >
                              <Reply className="w-4 h-4 mr-2" />
                              Responder
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}