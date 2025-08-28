import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { 
  User,
  Car,
  FileText,
  Star,
  Clock,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Upload,
  CheckCircle,
  AlertCircle,
  XCircle,
  Settings,
  Shield
} from "lucide-react";
import { Link } from "wouter";

export default function DriverProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "João",
    lastName: "Silva",
    phone: "+258 84 123 4567",
    email: "joao.silva@example.com",
    city: "Maputo",
    address: "Av. Julius Nyerere, 123",
    emergencyContact: "+258 82 987 6543"
  });

  const [availability, setAvailability] = useState({
    monday: { active: true, start: "06:00", end: "22:00" },
    tuesday: { active: true, start: "06:00", end: "22:00" },
    wednesday: { active: true, start: "06:00", end: "22:00" },
    thursday: { active: true, start: "06:00", end: "22:00" },
    friday: { active: true, start: "06:00", end: "23:00" },
    saturday: { active: true, start: "07:00", end: "23:00" },
    sunday: { active: false, start: "08:00", end: "20:00" }
  });

  // Mock data for documents
  const documents = [
    {
      id: "1",
      type: "license",
      name: "Carta de Condução",
      status: "verified",
      expiryDate: "2026-08-15",
      uploadDate: "2024-01-15"
    },
    {
      id: "2", 
      type: "registration",
      name: "Registo do Veículo",
      status: "verified",
      expiryDate: "2025-12-20",
      uploadDate: "2024-01-15"
    },
    {
      id: "3",
      type: "insurance",
      name: "Seguro do Veículo",
      status: "pending",
      expiryDate: "2025-06-10",
      uploadDate: "2024-12-01"
    },
    {
      id: "4",
      type: "criminal_record",
      name: "Registo Criminal",
      status: "verified",
      expiryDate: "2025-03-30",
      uploadDate: "2024-01-15"
    }
  ];

  const vehicleInfo = {
    make: "Toyota",
    model: "Corolla",
    year: 2020,
    plate: "ADM-123-MP",
    color: "Prata",
    capacity: 4,
    features: ["Ar Condicionado", "GPS", "Wi-Fi", "Carregador USB"]
  };

  const stats = {
    totalRides: 1247,
    rating: 4.8,
    completionRate: 98.5,
    cancellationRate: 1.5,
    responseTime: 1.2,
    yearsActive: 2.5
  };

  const recentReviews = [
    {
      id: "1",
      passenger: "Maria Silva",
      rating: 5,
      comment: "Motorista muito profissional e pontual. Veículo limpo e confortável.",
      date: "25 Jan 2025"
    },
    {
      id: "2",
      passenger: "João Santos", 
      rating: 5,
      comment: "Excelente serviço! Chegou no horário e foi muito atencioso.",
      date: "24 Jan 2025"
    },
    {
      id: "3",
      passenger: "Ana Costa",
      rating: 4,
      comment: "Boa viagem, motorista simpático. Apenas o veículo podia estar mais limpo.",
      date: "23 Jan 2025"
    }
  ];

  const handleSave = () => {
    console.log("Saving profile:", profileData);
    setIsEditing(false);
  };

  const handleDocumentUpload = (documentType: string) => {
    console.log("Uploading document:", documentType);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'verified': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'verified': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const weekDays = [
    { key: 'monday', label: 'Segunda' },
    { key: 'tuesday', label: 'Terça' },
    { key: 'wednesday', label: 'Quarta' },
    { key: 'thursday', label: 'Quinta' },
    { key: 'friday', label: 'Sexta' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">← Dashboard</Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Perfil Profissional</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-600">Verificado</Badge>
              <Badge variant="outline">Premium</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">
              <User className="w-4 h-4 mr-2" />
              Pessoal
            </TabsTrigger>
            <TabsTrigger value="documents">
              <FileText className="w-4 h-4 mr-2" />
              Documentos
            </TabsTrigger>
            <TabsTrigger value="vehicle">
              <Car className="w-4 h-4 mr-2" />
              Veículo
            </TabsTrigger>
            <TabsTrigger value="reviews">
              <Star className="w-4 h-4 mr-2" />
              Avaliações
            </TabsTrigger>
            <TabsTrigger value="schedule">
              <Clock className="w-4 h-4 mr-2" />
              Horários
            </TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Pessoais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Profile Photo */}
                    <div className="flex items-center space-x-6">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-2xl">
                          {profileData.firstName?.charAt(0)}{profileData.lastName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Button variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
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
                        <Label htmlFor="phone">Telefone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="phone"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                            disabled={!isEditing}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="email"
                            value={profileData.email}
                            disabled={true}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="city"
                            value={profileData.city}
                            onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                            disabled={!isEditing}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact">Contacto de Emergência</Label>
                        <Input
                          id="emergencyContact"
                          value={profileData.emergencyContact}
                          onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                          disabled={!isEditing}
                          placeholder="+258..."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Endereço</Label>
                      <Input
                        id="address"
                        value={profileData.address}
                        onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                        disabled={!isEditing}
                        placeholder="Endereço completo..."
                      />
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
              </div>

              {/* Stats Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Estatísticas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">{stats.rating}</p>
                      <div className="flex items-center justify-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(stats.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">Avaliação Média</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total de Corridas</span>
                        <span className="font-semibold">{stats.totalRides}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Taxa de Conclusão</span>
                        <span className="font-semibold text-green-600">{stats.completionRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Taxa de Cancelamento</span>
                        <span className="font-semibold text-red-600">{stats.cancellationRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Tempo de Resposta</span>
                        <span className="font-semibold">{stats.responseTime} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Anos Ativo</span>
                        <span className="font-semibold">{stats.yearsActive}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Documentos Profissionais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {documents.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{doc.name}</h4>
                        <Badge className={getStatusColor(doc.status)}>
                          {getStatusIcon(doc.status)}
                          <span className="ml-1">
                            {doc.status === 'verified' ? 'Verificado' :
                             doc.status === 'pending' ? 'Pendente' : 'Rejeitado'}
                          </span>
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Data de Envio:</span>
                          <span>{doc.uploadDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Validade:</span>
                          <span className={new Date(doc.expiryDate) < new Date(Date.now() + 30*24*60*60*1000) ? 'text-red-600 font-semibold' : ''}>
                            {doc.expiryDate}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDocumentUpload(doc.type)}
                        >
                          <Upload className="w-4 h-4 mr-1" />
                          Actualizar
                        </Button>
                        <Button variant="ghost" size="sm">
                          Ver Documento
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vehicle Tab */}
          <TabsContent value="vehicle">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Veículo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Marca</Label>
                    <Input value={vehicleInfo.make} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Modelo</Label>
                    <Input value={vehicleInfo.model} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Ano</Label>
                    <Input value={vehicleInfo.year} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Matrícula</Label>
                    <Input value={vehicleInfo.plate} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Cor</Label>
                    <Input value={vehicleInfo.color} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Capacidade</Label>
                    <Input value={`${vehicleInfo.capacity} passageiros`} disabled />
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold">Características do Veículo</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                    {vehicleInfo.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="justify-center p-2">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Avaliações dos Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{review.passenger}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-sm text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Disponibilidade Semanal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weekDays.map((day) => (
                    <div key={day.key} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-24">
                        <span className="font-medium">{day.label}</span>
                      </div>
                      <Switch 
                        checked={availability[day.key as keyof typeof availability].active}
                        onCheckedChange={(checked) => 
                          setAvailability({
                            ...availability,
                            [day.key]: {...availability[day.key as keyof typeof availability], active: checked}
                          })
                        }
                      />
                      {availability[day.key as keyof typeof availability].active && (
                        <div className="flex items-center space-x-2">
                          <Input 
                            type="time"
                            value={availability[day.key as keyof typeof availability].start}
                            onChange={(e) => 
                              setAvailability({
                                ...availability,
                                [day.key]: {...availability[day.key as keyof typeof availability], start: e.target.value}
                              })
                            }
                            className="w-32"
                          />
                          <span>até</span>
                          <Input 
                            type="time"
                            value={availability[day.key as keyof typeof availability].end}
                            onChange={(e) => 
                              setAvailability({
                                ...availability,
                                [day.key]: {...availability[day.key as keyof typeof availability], end: e.target.value}
                              })
                            }
                            className="w-32"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button>
                    Guardar Horários
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}