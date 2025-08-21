import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Star } from "lucide-react";
import { format } from "date-fns";
import { formatMzn } from "@/lib/currency";
import type { Event, EventPartnership } from "@shared/schema";

// Mock featured events for demonstration
const mockFeaturedEvents: (Event & { partnerships: EventPartnership[] })[] = [
  {
    id: "1",
    managerId: "mgr-1",
    title: "Festival de Música de Maputo 2024",
    description: "O maior festival de música do país",
    eventType: "festival",
    category: "cultura",
    venue: "Estádio Nacional do Zimpeto",
    address: "Zimpeto, Maputo",
    lat: "-25.9324",
    lng: "32.4532",
    startDate: new Date("2024-09-15T18:00:00"),
    endDate: new Date("2024-09-17T23:00:00"),
    startTime: "18:00",
    endTime: "23:00",
    images: ["https://images.unsplash.com/photo-1514525253161-7a46d19cd819"],
    ticketPrice: "1500.00",
    maxAttendees: 15000,
    currentAttendees: 8500,
    status: "upcoming",
    isPublic: true,
    isFeatured: true,
    hasPartnerships: true,
    websiteUrl: "https://festivalmaputo.mz",
    socialMediaLinks: ["@festivalmaputo"],
    tags: ["musica", "festival", "cultura"],
    createdAt: new Date(),
    updatedAt: new Date(),
    partnerships: [
      {
        id: "p1",
        eventId: "1",
        partnerType: "hotel",
        partnerId: "hotel-1",
        partnerName: "Hotel Polana Serena",
        discountPercentage: "20.00",
        specialOffer: "20% desconto + pequeno-almoço incluído",
        minEventTickets: 1,
        isActive: true,
        validFrom: new Date(),
        validUntil: new Date("2024-09-17"),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  },
  {
    id: "2",
    managerId: "mgr-2", 
    title: "Feira de Negócios EXPO Maputo",
    description: "Feira de oportunidades de negócio e investimento",
    eventType: "feira",
    category: "negocios",
    venue: "Centro Internacional de Feiras de Maputo",
    address: "Maputo, Marracuene",
    lat: "-25.8897",
    lng: "32.6074",
    startDate: new Date("2024-10-05T09:00:00"),
    endDate: new Date("2024-10-07T18:00:00"),
    startTime: "09:00",
    endTime: "18:00",
    images: ["https://images.unsplash.com/photo-1591115765373-5207764f72e7"],
    ticketPrice: "500.00",
    maxAttendees: 5000,
    currentAttendees: 2100,
    status: "upcoming",
    isPublic: true,
    isFeatured: true,
    hasPartnerships: true,
    websiteUrl: null,
    socialMediaLinks: null,
    tags: ["negocios", "networking", "expo"],
    createdAt: new Date(),
    updatedAt: new Date(),
    partnerships: [
      {
        id: "p2",
        eventId: "2",
        partnerType: "driver",
        partnerId: "driver-1",
        partnerName: "Link-A Motoristas",
        discountPercentage: "15.00",
        specialOffer: "15% desconto em viagens para o evento",
        minEventTickets: 1,
        isActive: true,
        validFrom: new Date(),
        validUntil: new Date("2024-10-07"),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  }
];

interface FeaturedEventsProps {
  onViewEvent?: (eventId: string) => void;
}

export default function FeaturedEvents({ onViewEvent }: FeaturedEventsProps) {
  const { data: events = [], isLoading } = useQuery<(Event & { partnerships: EventPartnership[] })[]>({
    queryKey: ["/api/events/featured"],
    initialData: mockFeaturedEvents,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-gray-200 rounded-xl h-64 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return null;
  }

  const getEventTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      feira: "🏪",
      festival: "🎪",
      concerto: "🎵",
      conferencia: "🎤",
      workshop: "🔧",
      exposicao: "🖼️"
    };
    return icons[type] || "📅";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Eventos em Destaque</h2>
          <p className="text-gray-600">Descubra os melhores eventos com ofertas especiais</p>
        </div>
        
        <Button 
          variant="outline"
          onClick={() => window.location.href = '/events'}
          data-testid="view-all-events"
        >
          Ver Todos os Eventos
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <Card 
            key={event.id} 
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => onViewEvent?.(event.id)}
            data-testid={`featured-event-${event.id}`}
          >
            <div className="relative">
              <img
                src={event.images?.[0] || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"}
                alt={event.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Featured badge */}
              <Badge className="absolute top-3 left-3 bg-yellow-500 text-white">
                <Star className="w-3 h-3 mr-1" />
                Destaque
              </Badge>

              {/* Partnership badge */}
              {event.hasPartnerships && event.partnerships?.length > 0 && (
                <Badge className="absolute top-3 right-3 bg-green-600 text-white">
                  <i className="fas fa-handshake mr-1"></i>
                  Parcerias
                </Badge>
              )}
              
              <div className="absolute bottom-3 left-3">
                <span className="text-3xl">{getEventTypeIcon(event.eventType)}</span>
              </div>
            </div>

            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {event.description}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>
                    {format(new Date(event.startDate), "dd/MM/yyyy")} às {event.startTime}
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="line-clamp-1">{event.venue}</span>
                </div>
              </div>

              {/* Price and partnerships preview */}
              <div className="flex items-center justify-between">
                <div>
                  {event.ticketPrice && (
                    <div>
                      <span className="text-xl font-bold text-purple-600">
                        {formatMzn(parseFloat(event.ticketPrice))}
                      </span>
                      <p className="text-xs text-gray-500">por bilhete</p>
                    </div>
                  )}
                </div>
                
                {event.partnerships && event.partnerships.length > 0 && (
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">
                      Até {Math.max(...event.partnerships.map(p => parseFloat(p.discountPercentage)))}% desconto
                    </div>
                    <div className="text-xs text-gray-500">
                      {event.partnerships.length} parceria{event.partnerships.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick partnership preview */}
              {event.partnerships && event.partnerships.length > 0 && (
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <h4 className="text-sm font-medium text-green-800 mb-1">Ofertas Especiais:</h4>
                  <div className="space-y-1">
                    {event.partnerships.slice(0, 2).map((partnership) => (
                      <div key={partnership.id} className="text-xs text-green-700 flex items-center">
                        <i className={`fas fa-${partnership.partnerType === 'hotel' ? 'bed' : partnership.partnerType === 'driver' ? 'car' : 'utensils'} mr-2`}></i>
                        {partnership.partnerName}: {partnership.discountPercentage}% desconto
                      </div>
                    ))}
                    {event.partnerships.length > 2 && (
                      <div className="text-xs text-green-600 font-medium">
                        +{event.partnerships.length - 2} mais parcerias
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700" 
                onClick={(e) => {
                  e.stopPropagation();
                  onViewEvent?.(event.id);
                }}
                data-testid={`view-event-${event.id}`}
              >
                <i className="fas fa-ticket-alt mr-2"></i>
                Ver Detalhes & Reservar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}