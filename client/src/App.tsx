import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "./hooks/useAuth";
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
console.log("App.tsx loaded");
console.log(
  "Firebase project ID:",
  import.meta.env.VITE_FIREBASE_PROJECT_ID || "NOT SET",
);
function Landing() {
  const handleFirebaseLogin = async () => {
    const { loginWithGoogle, isFirebaseConfigured } = await import(
      "./lib/firebaseSafe"
    );
    if (isFirebaseConfigured) {
      await loginWithGoogle();
    } else {
      alert("Firebase não configurado. Configure as variáveis de ambiente.");
    }
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
              onClick={handleFirebaseLogin}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              data-testid="button-login-google"
            >
              Entrar com Google
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Entre com sua conta Google para acessar a plataforma
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
        <Route path="*" component={Landing} />
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
          <Route component={NotFound} />
        </>
      )}
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
