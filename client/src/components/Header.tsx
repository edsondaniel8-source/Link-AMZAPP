import { useState } from "react";
import { Link } from "wouter";
import NotificationCenter from "./NotificationCenter";
import EventSearchModal, { type EventSearchParams } from "./EventSearchModal";
import LoginModal from "./LoginModal";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import logoPath from "@assets/link-a-logo.png";

interface HeaderProps {
  activeService: "rides" | "stays";
  onServiceChange: (service: "rides" | "stays") => void;
  onOfferRide?: () => void;
}

export default function Header({ activeService, onServiceChange, onOfferRide }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showServicesMenu, setShowServicesMenu] = useState(false);
  const [showEventSearch, setShowEventSearch] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Mock authentication state - replace with actual auth logic
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    isVerified: boolean;
  } | null>(null);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <img 
                  src={logoPath} 
                  alt="Link-A" 
                  className="h-12 w-12 mr-3"
                />
                <h1 className="text-2xl font-bold text-primary">Link-A</h1>
              </div>
            </Link>
          </div>
          
          {/* Service Toggle */}
          <div className="hidden md:flex bg-gray-light rounded-full p-1">
            <button
              data-testid="service-toggle-rides"
              onClick={() => onServiceChange("rides")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeService === "rides"
                  ? "bg-white shadow-sm text-dark"
                  : "text-gray-medium hover:text-dark"
              }`}
            >
              <i className="fas fa-car mr-2"></i>Viagens
            </button>
            <button
              data-testid="service-toggle-stays"
              onClick={() => onServiceChange("stays")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeService === "stays"
                  ? "bg-white shadow-sm text-dark"
                  : "text-gray-medium hover:text-dark"
              }`}
            >
              <i className="fas fa-bed mr-2"></i>Hospedagem
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowEventSearch(true)}
              className="hidden md:flex items-center text-gray-medium hover:text-dark font-medium transition-colors"
              data-testid="button-event-search"
            >
              <i className="fas fa-calendar-search mr-2"></i>
              Eventos
            </button>
            
            {/* Services Menu Button */}
            <div className="relative">
              <button
                data-testid="services-menu-button"
                onClick={() => setShowServicesMenu(!showServicesMenu)}
                className="hidden md:flex items-center text-gray-medium hover:text-dark font-medium transition-colors"
              >
                <i className="fas fa-briefcase mr-2"></i>
                Serviços
                <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </button>
              
              {showServicesMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  {onOfferRide && (
                    <button 
                      onClick={() => {
                        // Check if user is verified first
                        const isVerified = false; // This would come from user context
                        if (!isVerified) {
                          window.location.href = "/profile/verification";
                          return;
                        }
                        onOfferRide();
                        setShowServicesMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-dark hover:bg-gray-50 flex items-center"
                      data-testid="offer-ride-button"
                    >
                      <i className="fas fa-plus mr-3 text-primary"></i>
                      <div>
                        <div className="font-medium">Oferecer Viagem</div>
                        <div className="text-xs text-gray-500">Ganhe dinheiro como motorista</div>
                        <div className="text-xs text-red-500">
                          <i className="fas fa-shield-alt mr-1"></i>Verificação obrigatória
                        </div>
                      </div>
                    </button>
                  )}
                  <button 
                    className="w-full text-left px-4 py-3 text-sm text-dark hover:bg-gray-50 flex items-center"
                    onClick={() => {
                      // Check if user is verified first
                      const isVerified = false; // This would come from user context
                      if (!isVerified) {
                        window.location.href = "/profile/verification";
                        return;
                      }
                      setShowServicesMenu(false);
                    }}
                  >
                    <i className="fas fa-home mr-3 text-primary"></i>
                    <div>
                      <div className="font-medium">Torne-se Anfitrião</div>
                      <div className="text-xs text-gray-500">Alugue o seu espaço</div>
                      <div className="text-xs text-red-500">
                        <i className="fas fa-shield-alt mr-1"></i>Verificação obrigatória
                      </div>
                    </div>
                  </button>
                  <hr className="my-2" />
                  <button 
                    className="w-full text-left px-4 py-3 text-sm text-dark hover:bg-gray-50 flex items-center"
                    onClick={() => {
                      // Check if user is verified first
                      const isVerified = false; // This would come from user context
                      if (!isVerified) {
                        window.location.href = "/profile/verification";
                        return;
                      }
                      window.location.href = "/events/create";
                      setShowServicesMenu(false);
                    }}
                  >
                    <i className="fas fa-calendar-plus mr-3 text-primary"></i>
                    <div>
                      <div className="font-medium">Gestor de Eventos</div>
                      <div className="text-xs text-gray-500">Criar e gerir eventos e feiras</div>
                      <div className="text-xs text-red-500">
                        <i className="fas fa-shield-alt mr-1"></i>Verificação obrigatória
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
            
            {/* Authentication Section */}
            {isAuthenticated ? (
              <>
                <NotificationCenter />
                
                {/* User Menu */}
                <div className="relative">
                  <button
                    data-testid="user-menu-button"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-medium hover:text-dark transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden md:inline font-medium">{user?.name || "Utilizador"}</span>
                    <i className="fas fa-chevron-down text-xs"></i>
                  </button>
                
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <Link href="/dashboard">
                    <button
                      data-testid="nav-dashboard"
                      className="w-full text-left px-4 py-2 text-sm text-dark hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <i className="fas fa-calendar-alt mr-2"></i>Minhas Reservas
                    </button>
                  </Link>
                  <Link href="/partnerships">
                    <button
                      data-testid="nav-partnerships"
                      className="w-full text-left px-4 py-2 text-sm text-dark hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <i className="fas fa-handshake mr-2"></i>Parcerias
                    </button>
                  </Link>

                  <Link href="/loyalty">
                    <button
                      data-testid="nav-loyalty"
                      className="w-full text-left px-4 py-2 text-sm text-dark hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <i className="fas fa-crown mr-2"></i>Programa Fidelidade
                    </button>
                  </Link>
                  <hr className="my-2" />
                  <Link href="/profile/verification">
                    <button
                      data-testid="nav-verification"
                      className="w-full text-left px-4 py-2 text-sm text-dark hover:bg-gray-50 flex items-center"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <i className="fas fa-shield-alt mr-2 text-blue-600"></i>
                      <div>
                        <div className="font-medium">Verificar Perfil</div>
                        <div className="text-xs text-gray-500">Obrigatório para oferecer serviços</div>
                      </div>
                    </button>
                  </Link>
                  <Link href="/admin">
                    <button
                      data-testid="nav-admin"
                      className="w-full text-left px-4 py-2 text-sm text-dark hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <i className="fas fa-shield-alt mr-2"></i>Painel Admin
                    </button>
                  </Link>
                  <button
                    data-testid="nav-profile"
                    className="w-full text-left px-4 py-2 text-sm text-dark hover:bg-gray-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <i className="fas fa-user mr-2"></i>Perfil
                  </button>
                  <button
                    data-testid="nav-help"
                    className="w-full text-left px-4 py-2 text-sm text-dark hover:bg-gray-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <i className="fas fa-question-circle mr-2"></i>Ajuda
                  </button>
                  <hr className="my-2" />
                  <button
                    data-testid="nav-logout"
                    className="w-full text-left px-4 py-2 text-sm text-dark hover:bg-gray-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i>Sair
                  </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Button
                onClick={() => setShowLoginModal(true)}
                className="bg-primary hover:bg-primary-dark"
                data-testid="button-login"
              >
                <User className="w-4 h-4 mr-2" />
                Entrar
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Event Search Modal */}
      <EventSearchModal
        isOpen={showEventSearch}
        onClose={() => setShowEventSearch(false)}
        onSearch={(params: EventSearchParams) => {
          console.log('Searching events:', params);
        }}
      />
      
      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={(userData: any) => {
          setIsAuthenticated(true);
          setUser(userData);
        }}
      />
    </header>
  );
}