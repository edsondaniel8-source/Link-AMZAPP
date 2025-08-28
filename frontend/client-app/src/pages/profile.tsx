import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, CreditCard, Star, MapPin, Phone, Mail, Camera } from "lucide-react";
import { Link } from "wouter";

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: "",
    email: user?.email || "",
    city: "",
    preferences: {
      language: "pt",
      currency: "MZN",
      notifications: true,
      emailMarketing: false
    }
  });

  const handleSave = () => {
    // TODO: Implementar salvamento do perfil
    console.log("Saving profile:", profileData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">← Voltar</Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Pessoal
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Preferências
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Pagamento
            </TabsTrigger>
            <TabsTrigger value="points" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Pontos
            </TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Photo */}
                <div className="flex items-center space-x-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={user?.profileImageUrl || ""} />
                    <AvatarFallback className="text-2xl">
                      {user?.firstName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      Alterar Foto
                    </Button>
                    <p className="text-sm text-gray-500 mt-1">JPG, PNG até 5MB</p>
                  </div>
                </div>

                {/* Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nome</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apelido</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        disabled={true}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        disabled={!isEditing}
                        className="pl-10"
                        placeholder="+258..."
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="city">Cidade</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="city"
                        value={profileData.city}
                        onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                        disabled={!isEditing}
                        className="pl-10"
                        placeholder="Maputo, Beira, Nampula..."
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSave}>
                        Guardar Alterações
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      Editar Perfil
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Travel Preferences Tab */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Viagem</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Idioma Preferido</Label>
                    <select 
                      className="w-full p-2 border rounded-lg"
                      value={profileData.preferences.language}
                      onChange={(e) => setProfileData({
                        ...profileData, 
                        preferences: {...profileData.preferences, language: e.target.value}
                      })}
                    >
                      <option value="pt">Português</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Moeda</Label>
                    <select 
                      className="w-full p-2 border rounded-lg"
                      value={profileData.preferences.currency}
                      onChange={(e) => setProfileData({
                        ...profileData, 
                        preferences: {...profileData.preferences, currency: e.target.value}
                      })}
                    >
                      <option value="MZN">Metical (MZN)</option>
                      <option value="USD">Dólar (USD)</option>
                    </select>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Notificações</h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input 
                        type="checkbox" 
                        checked={profileData.preferences.notifications}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          preferences: {...profileData.preferences, notifications: e.target.checked}
                        })}
                        className="rounded"
                      />
                      <span>Notificações de reservas e viagens</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input 
                        type="checkbox"
                        checked={profileData.preferences.emailMarketing}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          preferences: {...profileData.preferences, emailMarketing: e.target.checked}
                        })}
                        className="rounded"
                      />
                      <span>Ofertas promocionais por email</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave}>
                    Guardar Preferências
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">Adicione seus métodos de pagamento preferidos para reservas mais rápidas.</p>
                  
                  {/* Existing Payment Methods */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-6 h-6 text-gray-400" />
                        <div>
                          <p className="font-medium">M-Pesa</p>
                          <p className="text-sm text-gray-500">+258 84 *** ****</p>
                        </div>
                      </div>
                      <Badge>Principal</Badge>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    + Adicionar Método de Pagamento
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Loyalty Points Tab */}
          <TabsContent value="points">
            <Card>
              <CardHeader>
                <CardTitle>Programa de Pontos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Points Balance */}
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-2">Seus Pontos</h3>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bold">1,250</span>
                      <span className="text-orange-100">pontos disponíveis</span>
                    </div>
                    <p className="text-orange-100 text-sm mt-2">Nível: Bronze</p>
                  </div>

                  {/* How to Earn Points */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Como Ganhar Pontos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <Car className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                        <p className="font-medium">Viagens</p>
                        <p className="text-sm text-gray-600">10 pontos por viagem</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <Hotel className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                        <p className="font-medium">Hospedagem</p>
                        <p className="text-sm text-gray-600">50 pontos por noite</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <Star className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                        <p className="font-medium">Avaliações</p>
                        <p className="text-sm text-gray-600">5 pontos por review</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Actividade Recente</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 text-sm">+</span>
                          </div>
                          <div>
                            <p className="font-medium">Viagem Maputo → Xai-Xai</p>
                            <p className="text-sm text-gray-500">Há 2 dias</p>
                          </div>
                        </div>
                        <span className="text-green-600 font-medium">+10 pontos</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 text-sm">+</span>
                          </div>
                          <div>
                            <p className="font-medium">Avaliação do motorista</p>
                            <p className="text-sm text-gray-500">Há 3 dias</p>
                          </div>
                        </div>
                        <span className="text-green-600 font-medium">+5 pontos</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}