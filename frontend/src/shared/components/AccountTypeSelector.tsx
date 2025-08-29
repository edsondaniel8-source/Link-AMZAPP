import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { 
  Calendar, 
  Users, 
  ShieldCheck,
  ArrowRight,
  CheckCircle
} from "lucide-react";

interface AccountTypeSelectorProps {
  onComplete: (selectedRoles: string[]) => void;
  userEmail: string;
}

const accountTypes = [
  {
    id: "client",
    title: "🧳 Cliente",
    description: "Quero reservar viagens, hospedagem e eventos",
    features: [
      "Reservar transportes",
      "Booking de hotéis", 
      "Comprar bilhetes para eventos",
      "Programa de fidelidade"
    ],
    icon: Users,
    color: "bg-blue-500",
    recommended: true
  },
  {
    id: "event",
    title: "🎭 Organizador de Eventos",
    description: "Quero criar e gerir eventos",
    features: [
      "Criar eventos",
      "Venda de bilhetes",
      "Gestão de participantes",
      "Analytics de eventos"
    ],
    icon: Calendar,
    color: "bg-orange-500",
    requiresVerification: true
  }
];

export default function AccountTypeSelector({ onComplete, userEmail }: AccountTypeSelectorProps) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(["client"]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleToggle = (roleId: string) => {
    if (roleId === "client") return; // Cliente sempre selecionado
    
    setSelectedRoles(prev => 
      prev.includes(roleId) 
        ? prev.filter(r => r !== roleId)
        : [...prev, roleId]
    );
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      await onComplete(selectedRoles);
    } catch (error) {
      console.error("Erro ao configurar conta:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasBusinessRoles = selectedRoles.some(role => 
    ["event"].includes(role)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Bem-vindo ao Link-A! 🇲🇿
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            {userEmail}
          </p>
          <p className="text-gray-500">
            Selecione o tipo de conta que pretende criar. Pode escolher múltiplas opções.
          </p>
        </div>

        {/* Account Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
          {accountTypes.map((type) => {
            const isSelected = selectedRoles.includes(type.id);
            const isClient = type.id === "client";
            const Icon = type.icon;

            return (
              <Card 
                key={type.id}
                className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                  isSelected 
                    ? "border-orange-500 bg-orange-50" 
                    : "border-gray-200 hover:border-orange-300"
                } ${isClient ? "ring-2 ring-orange-200" : ""}`}
                onClick={() => handleRoleToggle(type.id)}
              >
                {type.recommended && (
                  <Badge className="absolute -top-2 -right-2 bg-orange-500">
                    Recomendado
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-3">
                  <div className={`w-16 h-16 rounded-full ${type.color} flex items-center justify-center mx-auto mb-3`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{type.title}</CardTitle>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {type.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between">
                    <Checkbox 
                      checked={isSelected}
                      disabled={isClient}
                      className="data-[state=checked]:bg-orange-500"
                    />
                    
                    {type.requiresVerification && (
                      <div className="flex items-center gap-1 text-xs text-amber-600">
                        <ShieldCheck className="w-3 h-3" />
                        Requer verificação
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info sobre verificação */}
        {hasBusinessRoles && (
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-800 mb-1">
                    Verificação Necessária
                  </h3>
                  <p className="text-sm text-amber-700">
                    Para contas de negócio (Motorista, Hotel, Eventos), precisará de verificar 
                    a sua identidade enviando documentos. Este processo garante a segurança 
                    da plataforma para todos os utilizadores.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botão de continuar */}
        <div className="text-center">
          <Button 
            onClick={handleComplete}
            disabled={isSubmitting}
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg"
          >
            {isSubmitting ? (
              "Configurando conta..."
            ) : (
              <>
                Continuar
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
          
          <p className="text-sm text-gray-500 mt-3">
            Pode sempre adicionar mais tipos de conta mais tarde nas configurações
          </p>
        </div>
      </div>
    </div>
  );
}