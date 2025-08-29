import { useLocation } from 'wouter';
import { useAuth } from '@/shared/hooks/useAuth';
import { useUserSetup } from '@/shared/hooks/useUserSetup';
import SimpleRoleSelector from '@/shared/components/SimpleRoleSelector';
import MainApp from './apps/main-app/App';
import ProviderApp from './apps/provider-app/App';

function AppRouter() {
  const [location] = useLocation();
  const { loading, user } = useAuth();
  const { needsRoleSetup, setupUserRoles, userEmail, loading: setupLoading } = useUserSetup();

  // Se usuário logado precisa configurar roles
  if (user && needsRoleSetup && !setupLoading) {
    return (
      <SimpleRoleSelector
        userEmail={userEmail}
        onRoleSelected={setupUserRoles}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Verificar se é rota de provider
  if (location.startsWith('/provider')) {
    return <ProviderApp />;
  }

  // Caso contrário, usar app principal
  return <MainApp />;
}

export default AppRouter;