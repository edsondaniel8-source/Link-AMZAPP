import { useState } from "react";
import { Link } from "wouter";
import NotificationCenter from "./NotificationCenter";
import LoginModal from "./LoginModal";
import RoleSwitcher from "./RoleSwitcher";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { useUserRoles } from "../hooks/useUserRoles";
import logoPath from "@assets/link-a-logo.png";

interface HeaderProps {
  activeService: "rides" | "stays";
  onServiceChange: (service: "rides" | "stays") => void;
  onOfferRide?: () => void;
}

export default function Header({ activeService, onServiceChange, onOfferRide }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showServicesMenu, setShowServicesMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated, user, signOut } = useAuth();
  const { canAccessFeature } = useUserRoles();

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
            
            {/* Community Menu Button */}
            <div className="relative">
              <button
                data-testid="community-menu-button"
                onClick={() => setShowServicesMenu(!showServicesMenu)}
                className="hidden md:flex items-center text-gray-medium hover:text-dark font-medium transition-colors"
              >
                <i className="fas fa-users mr-2"></i>
                Comunidade Link-A
                <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </button>
              
              {showServicesMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  {/* Blog Section */}
                  <Link href="/blog">
                    <button 
                      className="w-full text-left px-4 py-3 text-sm text-dark hover:bg-gray-50 flex items-center"
                      onClick={() => setShowServicesMenu(false)}
                      data-testid="blog-button"
                    >
                      <i className="fas fa-newspaper mr-3 text-primary"></i>
                      <div>
                        <div className="font-medium">Blog Link-A</div>
                        <div className="text-xs text-gray-500">Notícias, dicas e guias de viagem</div>
                      </div>
                    </button>
                  </Link>
                  
                  <hr className="my-2" />
                  
                  {/* Services Section */}
                  <div className="px-4 py-2">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Oferecer Serviços
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      // If user already has driver access, proceed directly
                      if (canAccessFeature('offer-ride') && onOfferRide) {
                        onOfferRide();
                        setShowServicesMenu(false);
                        return;
                      }
                      
                      // If user doesn't have driver role, redirect to driver registration
                      if (isAuthenticated) {
                        window.location.href = "/driver/register";
                      } else {
                        setShowLoginModal(true);
                      }
                      setShowServicesMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-dark hover:bg-gray-50 flex items-center"
                    data-testid="offer-ride-button"
                  >
                    <i className="fas fa-plus mr-3 text-primary"></i>
                    <div>
                      <div className="font-medium">
                        {canAccessFeature('offer-ride') ? 'Oferecer Viagem' : 'Torne-se Motorista'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {canAccessFeature('offer-ride') 
                          ? 'Publique suas viagens' 
                          : 'Registe-se como motorista'}
                      </div>
                      <div className={`text-xs ${canAccessFeature('offer-ride') ? 'text-green-500' : 'text-blue-500'}`}>
                        <i className={`fas ${canAccessFeature('offer-ride') ? 'fa-check-circle' : 'fa-user-plus'} mr-1`}></i>
                        {canAccessFeature('offer-ride') ? 'Verificado' : 'Registo necessário'}
                      </div>
                    </div>
                  </button>
                  <button 
                    className="w-full text-left px-4 py-3 text-sm text-dark hover:bg-gray-50 flex items-center"
                    onClick={() => {
                      // If user already has hotel manager access
                      if (canAccessFeature('accommodation-management')) {
                        window.location.href = "/accommodations/create";
                        setShowServicesMenu(false);
                        return;
                      }
                      
                      // If user doesn't have hotel manager role, redirect to registration
                      if (isAuthenticated) {
                        window.location.href = "/host/register";
                      } else {
                        setShowLoginModal(true);
                      }
                      setShowServicesMenu(false);
                    }}
                  >
                    <i className="fas fa-home mr-3 text-primary"></i>
                    <div>
                      <div className="font-medium">
                        {canAccessFeature('accommodation-management') ? 'Gerir Alojamentos' : 'Torne-se Anfitrião'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {canAccessFeature('accommodation-management') 
                          ? 'Publique seus alojamentos' 
                          : 'Registe-se como anfitrião'}
                      </div>
                      <div className={`text-xs ${canAccessFeature('accommodation-management') ? 'text-green-500' : 'text-blue-500'}`}>
                        <i className={`fas ${canAccessFeature('accommodation-management') ? 'fa-check-circle' : 'fa-user-plus'} mr-1`}></i>
                        {canAccessFeature('accommodation-management') ? 'Verificado' : 'Registo necessário'}
                      </div>
                    </div>
                  </button>
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
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center overflow-hidden">
                      {user?.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt="Perfil" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="hidden md:inline font-medium">{user?.displayName || user?.email || "Utilizador"}</span>
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
                  
                  {/* Role Switcher Integration */}
                  <div className="px-4 py-2">
                    <RoleSwitcher variant="compact" showBadge={true} />
                  </div>
                  
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
                  
                  {canAccessFeature('admin-panel') && (
                    <Link href="/admin">
                      <button
                        data-testid="nav-admin"
                        className="w-full text-left px-4 py-2 text-sm text-dark hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <i className="fas fa-shield-alt mr-2"></i>Painel Admin
                      </button>
                    </Link>
                  )}
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
                    onClick={async () => {
                      await signOut();
                      setShowUserMenu(false);
                    }}
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
      

      
      {/* Login Modal */}
      <LoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
      />
    </header>
  );
}