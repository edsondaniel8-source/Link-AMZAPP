import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatMzn } from "@/lib/currency";

interface Restaurant {
  id: string;
  name: string;
  location: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  image: string;
  coordinates: { lat: number; lng: number };
  distance?: string;
  specialties: string[];
  isOpen: boolean;
  menu: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image?: string;
  }>;
  dailySpecials: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
  }>;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  type: 'user' | 'restaurant';
}

interface RestaurantStopsProps {
  routeCoordinates?: Array<{ lat: number; lng: number }>;
}

export default function RestaurantStops({ routeCoordinates = [] }: RestaurantStopsProps) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [orderItems, setOrderItems] = useState<Array<{ menuId: string; quantity: number }>>([]);
  
  // Mock restaurant data - would come from API
  const restaurants: Restaurant[] = [
    {
      id: "rest-1",
      name: "Restaurante Maputo Bay",
      location: "Maputo Centro",
      cuisine: "Moçambicana",
      rating: 4.5,
      priceRange: "$$",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
      coordinates: { lat: -25.9692, lng: 32.5732 },
      distance: "2.5 km",
      specialties: ["Matapa", "Piri-piri", "Camarão"],
      isOpen: true,
      menu: [
        {
          id: "m1",
          name: "Matapa com Camarão",
          description: "Prato tradicional moçambicano com folhas de mandioca e camarão",
          price: 45000,
          category: "Pratos Principais"
        },
        {
          id: "m2", 
          name: "Frango Piri-Piri",
          description: "Frango grelhado com molho piri-piri tradicional",
          price: 35000,
          category: "Pratos Principais"
        }
      ],
      dailySpecials: [
        {
          id: "d1",
          name: "Prato do Dia - Xima com Peixe",
          description: "Xima acompanhada com peixe grelhado e vegetais",
          price: 28000
        }
      ]
    },
    {
      id: "rest-2",
      name: "Costa do Sol",
      location: "Costa do Sol",
      cuisine: "Frutos do Mar",
      rating: 4.8,
      priceRange: "$$$",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947",
      coordinates: { lat: -25.9435, lng: 32.6147 },
      distance: "8.2 km",
      specialties: ["Lagosta", "Caril de Camarão", "Peixe Grelhado"],
      isOpen: true,
      menu: [
        {
          id: "m3",
          name: "Lagosta Grelhada",
          description: "Lagosta fresca grelhada com manteiga de alho",
          price: 95000,
          category: "Frutos do Mar"
        }
      ],
      dailySpecials: [
        {
          id: "d2",
          name: "Caril de Camarão",
          description: "Camarão ao curry com arroz de coco",
          price: 55000
        }
      ]
    }
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedRestaurant) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: "user-1",
      senderName: "Você",
      message: newMessage,
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      type: 'user'
    };
    
    setChatMessages([...chatMessages, message]);
    setNewMessage("");
    
    // Simulate restaurant response
    setTimeout(() => {
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: selectedRestaurant.id,
        senderName: selectedRestaurant.name,
        message: "Obrigado pela sua mensagem! Como podemos ajudá-lo?",
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        type: 'restaurant'
      };
      setChatMessages(prev => [...prev, response]);
    }, 1000);
  };

  const addToOrder = (menuId: string) => {
    const existingItem = orderItems.find(item => item.menuId === menuId);
    if (existingItem) {
      setOrderItems(orderItems.map(item => 
        item.menuId === menuId 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setOrderItems([...orderItems, { menuId, quantity: 1 }]);
    }
  };

  const getOrderTotal = () => {
    if (!selectedRestaurant) return 0;
    return orderItems.reduce((total, item) => {
      const menuItem = selectedRestaurant.menu.find(m => m.id === item.menuId) ||
                     selectedRestaurant.dailySpecials.find(d => d.id === item.menuId);
      return total + (menuItem ? menuItem.price * item.quantity : 0);
    }, 0);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-dark">Paragens para Refeições</h2>
        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
          <i className="fas fa-utensils mr-1"></i>
          {restaurants.length} restaurantes próximos
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge className={restaurant.isOpen ? "bg-green-500" : "bg-red-500"}>
                  {restaurant.isOpen ? "Aberto" : "Fechado"}
                </Badge>
              </div>
              <div className="absolute top-2 left-2">
                <Badge className="bg-black/70 text-white">
                  <i className="fas fa-star mr-1"></i>
                  {restaurant.rating}
                </Badge>
              </div>
            </div>
            
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{restaurant.name}</span>
                <span className="text-sm text-gray-medium">{restaurant.priceRange}</span>
              </CardTitle>
              <div className="space-y-2">
                <p className="text-sm text-gray-medium">
                  <i className="fas fa-map-marker-alt mr-1"></i>
                  {restaurant.location} ({restaurant.distance})
                </p>
                <p className="text-sm text-gray-600">
                  <i className="fas fa-utensils mr-1"></i>
                  {restaurant.cuisine}
                </p>
                <div className="flex flex-wrap gap-1">
                  {restaurant.specialties.map((specialty, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full"
                    onClick={() => setSelectedRestaurant(restaurant)}
                    data-testid={`view-restaurant-${restaurant.id}`}
                  >
                    <i className="fas fa-eye mr-2"></i>
                    Ver Menu & Chat
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                  <DialogHeader>
                    <DialogTitle>{restaurant.name}</DialogTitle>
                  </DialogHeader>
                  
                  <Tabs defaultValue="menu" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="menu">Menu</TabsTrigger>
                      <TabsTrigger value="specials">Pratos do Dia</TabsTrigger>
                      <TabsTrigger value="chat">Chat</TabsTrigger>
                      <TabsTrigger value="order">Pedido</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="menu" className="space-y-4">
                      <ScrollArea className="h-96">
                        <div className="space-y-4">
                          {restaurant.menu.map((item) => (
                            <Card key={item.id} className="p-4">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-semibold">{item.name}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                  <p className="text-lg font-bold text-primary mt-2">
                                    {formatMzn(item.price)}
                                  </p>
                                </div>
                                <Button 
                                  onClick={() => addToOrder(item.id)}
                                  data-testid={`add-to-order-${item.id}`}
                                >
                                  <i className="fas fa-plus mr-2"></i>
                                  Adicionar
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    
                    <TabsContent value="specials" className="space-y-4">
                      <div className="space-y-4">
                        {restaurant.dailySpecials.map((special) => (
                          <Card key={special.id} className="p-4 border-orange-200">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold">{special.name}</h4>
                                  <Badge className="bg-orange-500">Especial</Badge>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{special.description}</p>
                                <p className="text-lg font-bold text-orange-600 mt-2">
                                  {formatMzn(special.price)}
                                </p>
                              </div>
                              <Button 
                                onClick={() => addToOrder(special.id)}
                                className="bg-orange-500 hover:bg-orange-600"
                                data-testid={`add-special-${special.id}`}
                              >
                                <i className="fas fa-plus mr-2"></i>
                                Adicionar
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="chat" className="space-y-4">
                      <div className="space-y-4">
                        <ScrollArea className="h-64 border rounded p-4">
                          <div className="space-y-3">
                            {chatMessages.length === 0 ? (
                              <p className="text-gray-500 text-center">
                                Inicie uma conversa com o restaurante
                              </p>
                            ) : (
                              chatMessages.map((msg) => (
                                <div 
                                  key={msg.id} 
                                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                  <div className={`max-w-xs p-3 rounded-lg ${
                                    msg.type === 'user' 
                                      ? 'bg-primary text-primary-foreground' 
                                      : 'bg-gray-200'
                                  }`}>
                                    <p className="text-sm">{msg.message}</p>
                                    <p className="text-xs opacity-70 mt-1">
                                      {msg.senderName} • {msg.timestamp}
                                    </p>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </ScrollArea>
                        
                        <div className="flex gap-2">
                          <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Digite sua mensagem..."
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            data-testid="chat-input"
                          />
                          <Button 
                            onClick={handleSendMessage}
                            data-testid="send-message"
                          >
                            <i className="fas fa-paper-plane"></i>
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="order" className="space-y-4">
                      <div className="space-y-4">
                        <h4 className="font-semibold">Seu Pedido</h4>
                        
                        {orderItems.length === 0 ? (
                          <p className="text-gray-500 text-center py-8">
                            Nenhum item no pedido
                          </p>
                        ) : (
                          <>
                            <div className="space-y-2">
                              {orderItems.map((item) => {
                                const menuItem = restaurant.menu.find(m => m.id === item.menuId) ||
                                               restaurant.dailySpecials.find(d => d.id === item.menuId);
                                if (!menuItem) return null;
                                
                                return (
                                  <div key={item.menuId} className="flex justify-between items-center p-2 border rounded">
                                    <div>
                                      <span className="font-medium">{menuItem.name}</span>
                                      <span className="text-gray-500 ml-2">x{item.quantity}</span>
                                    </div>
                                    <span className="font-semibold">
                                      {formatMzn(menuItem.price * item.quantity)}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                            
                            <div className="border-t pt-4">
                              <div className="flex justify-between text-lg font-bold">
                                <span>Total:</span>
                                <span>{formatMzn(getOrderTotal())}</span>
                              </div>
                            </div>
                            
                            <Button className="w-full" data-testid="confirm-order">
                              <i className="fas fa-check mr-2"></i>
                              Confirmar Pedido Antecipado
                            </Button>
                          </>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}