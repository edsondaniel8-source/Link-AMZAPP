import { useState } from "react";
import { Link } from "wouter";
import NotificationCenter from "./NotificationCenter";
import LoginModal from "./LoginModal";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import logoPath from "@assets/link-a-logo.png";

interface HeaderProps {
  activeService: "rides" | "stays";
  onServiceChange: (service: "rides" | "stays") => void;
  onOfferRide?: () => void;
}

export default function Header({ activeService, onServiceChange, onOfferRide }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated, user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <img 
                  src={logoPath} 
                  alt="Link-A" 
                  className="h-10 w-10 mr-3"
                />
                <h1 className="text-xl font-bold text-primary">Link-A</h1>
              </div>
            </Link>
          </div>
          
          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Início
            </Link>
            <Link href="/events" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Eventos
            </Link>
            <Link href="/partnerships" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Parcerias
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            
            {/* Search Button (placeholder) */}
            <button className="hidden md:flex items-center text-gray-500 hover:text-gray-700 transition-colors">
              <i className="fas fa-search mr-2"></i>
              Procurar
            </button>

            {/* Authentication Section */}
            {isAuthenticated ? (
              <>
                <div className="hidden md:block">
                  <NotificationCenter />
                </div>
                
                {/* User Menu */}
                <div className="relative">
                  <button
                    data-testid="user-menu-button"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
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
                    <span className="hidden lg:inline font-medium">{user?.displayName || user?.email?.split('@')[0] || "Utilizador"}</span>
                    <i className="fas fa-chevron-down text-xs"></i>
                  </button>
                
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <Link href="/dashboard">
                        <button
                          data-testid="nav-dashboard"
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <i className="fas fa-tachometer-alt mr-2 text-primary"></i>Dashboard
                        </button>
                      </Link>
                      <Link href="/bookings">
                        <button
                          data-testid="nav-bookings"
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <i className="fas fa-calendar-alt mr-2 text-primary"></i>Minhas Reservas
                        </button>
                      </Link>
                      <hr className="my-2" />
                      <button
                        data-testid="nav-logout"
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={async () => {
                          await signOut();
                          setShowUserMenu(false);
                        }}
                      >
                        <i className="fas fa-sign-out-alt mr-2 text-gray-500"></i>Sair
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
                  data-testid="button-login"
                >
                  Entrar
                </button>
                <Button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-full font-medium"
                  data-testid="button-signup"
                >
                  Oferecer Viagem
                </Button>
              </div>
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