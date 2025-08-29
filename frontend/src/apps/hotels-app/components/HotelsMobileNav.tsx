import { Link, useLocation } from "wouter";
import { Button } from "@/shared/components/ui/button";
import { TrendingUp, Plus, MessageCircle, Home, Hotel } from "lucide-react";

export default function HotelsMobileNav() {
  const [location] = useLocation();

  const navItems = [
    {
      href: "/hotels",
      icon: TrendingUp,
      label: "Dashboard",
      active: location === "/hotels"
    },
    {
      href: "/hotels/create-offer",
      icon: Plus,
      label: "Criar",
      active: location.startsWith("/hotels/create-offer")
    },
    {
      href: "/hotels/partnerships",
      icon: Hotel,
      label: "Parcerias",
      active: location.startsWith("/hotels/partnerships")
    },
    {
      href: "/hotels/driver-chat",
      icon: MessageCircle,
      label: "Chat",
      active: location.startsWith("/hotels/driver-chat")
    },
    {
      href: "/",
      icon: Home,
      label: "Voltar",
      active: false
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                size="sm"
                className={`h-full w-full flex flex-col items-center justify-center space-y-1 rounded-none ${
                  item.active 
                    ? "text-emerald-600 bg-emerald-50" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}