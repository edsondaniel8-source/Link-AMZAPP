import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "./hooks/useAuth";
import AuthHandler from "./components/AuthHandler";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import AdminPanel from "@/pages/admin";
import Partnerships from "@/pages/partnerships";
import Events from "@/pages/events";
import Loyalty from "@/pages/loyalty";
import ProfileVerification from "@/pages/profile-verification";
import CreateEvent from "@/pages/create-event";
import BookingsPage from "@/pages/bookings";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";

function Landing() {
  const handleGoogleLogin = () => {
    // Always redirect to login page - let it handle Firebase or manual login
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-6">
            Bem-vindo ao Link-A
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Trazendo o Futuro do turismo para Moçambique
          </p>
          <div className="space-y-4 max-w-md mx-auto">
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              data-testid="button-login-google"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Iniciar Sessão
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Acesse sua conta ou crie uma nova
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/login" component={LoginPage} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/bookings" component={BookingsPage} />
          <Route path="/partnerships" component={Partnerships} />
          <Route path="/events" component={Events} />
          <Route path="/events/create" component={CreateEvent} />
          <Route path="/loyalty" component={Loyalty} />
          <Route path="/profile/verification" component={ProfileVerification} />
          <Route path="/admin" component={AdminPanel} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AuthHandler>
          <Router />
        </AuthHandler>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
