import { Link, useLocation } from 'wouter';
import { LayoutDashboard, Calendar, Users, BarChart3, Star, MessageSquare, LogOut, Music } from 'lucide-react';
import { useAuth } from '../../shared/hooks/useAuth';

export default function Navigation() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Eventos', href: '/events', icon: Calendar },
    { name: 'Ingressos', href: '/tickets', icon: Users },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Experiência', href: '/experience', icon: Star },
    { name: 'Parcerias', href: '/partnerships/create', icon: MessageSquare },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">Link-A Events</span>
            </div>
            
            <div className="hidden md:flex space-x-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href || 
                  (item.href !== '/dashboard' && location.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {user?.firstName} {user?.lastName}
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}