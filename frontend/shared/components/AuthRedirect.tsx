import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

// Configuração dos domínios das apps
const APP_DOMAINS = {
  client: 'https://link-aturismomoz.com',
  driver: 'https://driver.link-aturismomoz.com', 
  hotel: 'https://hotel.link-aturismomoz.com',
  event: 'https://event.link-aturismomoz.com',
  admin: 'https://admin.link-aturismomoz.com'
};

interface AuthRedirectProps {
  children: React.ReactNode;
  requiredRole?: 'client' | 'driver' | 'hotel' | 'event' | 'admin';
}

export function AuthRedirect({ children, requiredRole }: AuthRedirectProps) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && requiredRole) {
      // Se o usuário está logado mas não tem o papel necessário
      if (!user.roles?.includes(requiredRole)) {
        // Redireciona para a app principal do usuário
        const primaryRole = user.roles?.[0] || 'client';
        const targetDomain = APP_DOMAINS[primaryRole as keyof typeof APP_DOMAINS];
        
        if (window.location.origin !== targetDomain) {
          window.location.href = targetDomain;
          return;
        }
      }
    }

    // Se não está logado e não está na app principal
    if (!loading && !user && window.location.origin !== APP_DOMAINS.client) {
      window.location.href = APP_DOMAINS.client;
    }
  }, [user, loading, requiredRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Se requer papel específico e usuário não tem
  if (requiredRole && (!user?.roles?.includes(requiredRole))) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Acesso Negado</h2>
          <p className="mb-4">Você não tem permissão para acessar esta área.</p>
          <button 
            onClick={() => window.location.href = APP_DOMAINS.client}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}