import { Link, useLocation } from 'wouter';
import { LayoutDashboard, Users, BarChart, Settings, LogOut, Shield, AlertTriangle } from 'lucide-react';

export default function Navigation() {
  const [location] = useLocation();
  
  // Mock user data for display
  const user = { firstName: 'Admin', lastName: 'Sistema' };
  const logout = () => {
    window.location.href = '/login';
  };

  const navigation = [
    { name: '👥 Gestão Utilizadores', href: '/users', icon: Users },
    { name: '📈 Analytics Plataforma', href: '/analytics', icon: BarChart },
    { name: '⚙️ Configurações Sistema', href: '/settings', icon: Settings },
    { name: '🚨 Moderação & Suporte', href: '/moderation', icon: AlertTriangle },
  ];

  return (
    <nav className="bg-gradient-to-r from-red-600 to-red-700 shadow-lg border-b border-red-800">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">Link-A</span>
                <span className="text-red-200 text-sm block leading-none">Painel Administrativo</span>
              </div>
            </div>
            
            <div className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                        : 'text-red-100 hover:text-white hover:bg-white/10 backdrop-blur-sm'
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
            <div className="hidden sm:block">
              <div className="text-sm text-red-100">Administrador</div>
              <div className="text-xs text-red-200">
                {user?.firstName} {user?.lastName}
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-red-100 hover:text-white hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
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