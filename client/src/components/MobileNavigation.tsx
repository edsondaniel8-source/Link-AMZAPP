import { useLocation } from "wouter";

interface MobileNavigationProps {
  onOfferRide?: () => void;
}

export default function MobileNavigation({ onOfferRide }: MobileNavigationProps) {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="grid grid-cols-5 h-16">
        <button
          data-testid="mobile-nav-home"
          onClick={() => window.location.href = "/"}
          className={`flex flex-col items-center justify-center ${
            isActive("/") ? "text-primary" : "text-gray-medium"
          }`}
        >
          <i className="fas fa-home text-lg mb-1"></i>
          <span className="text-xs">Início</span>
        </button>
        
        <button
          data-testid="mobile-nav-offer-ride"
          onClick={() => onOfferRide ? onOfferRide() : window.location.href = "/?offer=true"}
          className="flex flex-col items-center justify-center text-gray-medium active:text-primary"
        >
          <i className="fas fa-plus-circle text-lg mb-1"></i>
          <span className="text-xs">Oferecer</span>
        </button>
        
        <button
          data-testid="mobile-nav-events"
          onClick={() => window.location.href = "/events"}
          className={`flex flex-col items-center justify-center ${
            isActive("/events") ? "text-primary" : "text-gray-medium"
          }`}
        >
          <i className="fas fa-calendar text-lg mb-1"></i>
          <span className="text-xs">Eventos</span>
        </button>
        
        <button
          data-testid="mobile-nav-bookings"
          onClick={() => window.location.href = "/bookings"}
          className={`flex flex-col items-center justify-center ${
            isActive("/bookings") ? "text-primary" : "text-gray-medium"
          }`}
        >
          <i className="fas fa-clipboard-list text-lg mb-1"></i>
          <span className="text-xs">Reservas</span>
        </button>
        
        <button
          data-testid="mobile-nav-profile"
          onClick={() => window.location.href = "/dashboard"}
          className={`flex flex-col items-center justify-center ${
            isActive("/profile") ? "text-primary" : "text-gray-medium"
          }`}
        >
          <i className="fas fa-user text-lg mb-1"></i>
          <span className="text-xs">Perfil</span>
        </button>
      </div>
    </div>
  );
}