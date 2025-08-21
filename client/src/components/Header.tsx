import { useState } from "react";
import { Link } from "wouter";
import logoPath from "@assets/link-a-logo.png";

interface HeaderProps {
  activeService: "rides" | "stays";
  onServiceChange: (service: "rides" | "stays") => void;
}

export default function Header({ activeService, onServiceChange }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

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
                  className="h-10 w-10 mr-3"
                />
                <h1 className="text-2xl font-bold text-primary">Link-A Mz</h1>
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
            <button className="hidden md:block text-gray-medium hover:text-dark font-medium">
              Torne-se anfitrião
            </button>
            <div className="relative">
              <button
                data-testid="user-menu-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 border border-gray-300 rounded-full py-2 px-4 hover:shadow-md transition-shadow"
              >
                <i className="fas fa-bars text-gray-medium"></i>
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <i className="fas fa-user text-gray-600 text-sm"></i>
                </div>
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
          </div>
        </div>
      </div>
    </header>
  );
}