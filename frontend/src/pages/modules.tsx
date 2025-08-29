import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car as CarIcon, Hotel, Calendar, Users, CheckCircle } from "lucide-react";

export default function ModulesPage() {
  const modules = [
    {
      id: "transport",
      title: "Módulo de Transporte",
      description: "Sistema completo de boleias e viagens",
      icon: CarIcon,
      color: "bg-blue-500",
      link: "/transport",
      features: [
        "Buscar viagens disponíveis",
        "Oferecer boleias",
        "Histórico de viagens",
        "Negociação de preços",
        "Chat com motoristas/passageiros"
      ],
      components: ["RideSearch", "RideOfferForm", "RideResults", "RideOfferModal"]
    },
    {
      id: "accommodation",
      title: "Módulo de Hospedagem", 
      description: "Gestão de alojamentos e reservas",
      icon: Hotel,
      color: "bg-green-500",
      link: "/accommodation",
      features: [
        "Buscar alojamentos",
        "Gerir propriedades",
        "Sistema de reservas",
        "Avaliações e reviews",
        "Calendário de disponibilidade"
      ],
      components: ["StaySearch", "AccommodationManager", "StayResults"]
    },
    {
      id: "events",
      title: "Módulo de Eventos",
      description: "Descobrir e organizar eventos",
      icon: Calendar,
      color: "bg-purple-500",
      link: "/events-hub",
      features: [
        "Explorar eventos",
        "Criar eventos",
        "Eventos em destaque",
        "Sistema de inscrições",
        "Notificações de eventos"
      ],
      components: ["EventSearch", "EventResults", "FeaturedEvents", "EventSearchModal"]
    },
    {
      id: "partnerships",
      title: "Módulo de Parcerias",
      description: "Sistema de parcerias e colaborações",
      icon: Users,
      color: "bg-orange-500",
      link: "/partnerships",
      features: [
        "Parcerias de motoristas",
        "Configuração de anfitriões",
        "Gestão de colaborações",
        "Programa de benefícios",
        "Rede de parceiros"
      ],
      components: ["DriverPartnerships", "HostPartnershipSetup", "DriverPartnershipCard"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Estrutura Modular - Link-A
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A plataforma está organizada em módulos funcionais independentes, 
            cada um com suas próprias funcionalidades e componentes especializados.
          </p>
        </div>

        {/* Módulos Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {modules.map((module) => (
            <Card key={module.id} className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <div className={`p-3 rounded-lg ${module.color} mr-4`}>
                    <module.icon className="w-6 h-6 text-white" />
                  </div>
                  {module.title}
                </CardTitle>
                <p className="text-gray-600">{module.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Funcionalidades */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Funcionalidades Principais:</h4>
                  <ul className="space-y-2">
                    {module.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Componentes */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Componentes:</h4>
                  <div className="flex flex-wrap gap-2">
                    {module.components.map((component, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                      >
                        {component}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Link para o módulo */}
                <div className="pt-4">
                  <Link href={module.link}>
                    <button className={`w-full py-3 px-4 rounded-lg ${module.color} text-white font-medium hover:opacity-90 transition-opacity`}>
                      Explorar {module.title}
                    </button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Resumo da Estrutura */}
        <div className="mt-12 bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Benefícios da Estrutura Modular</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Organização Clara</h3>
              <p className="text-sm text-gray-600">
                Cada módulo tem responsabilidades bem definidas e componentes organizados
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Manutenção Fácil</h3>
              <p className="text-sm text-gray-600">
                Código modular facilita atualizações e correções independentes
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Escalabilidade</h3>
              <p className="text-sm text-gray-600">
                Novos módulos podem ser adicionados sem afetar os existentes
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Back */}
        <div className="mt-8 text-center">
          <Link href="/">
            <button className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Voltar à Página Principal
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}