import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "./hooks/useAuth";
import { useUserSetup } from "./hooks/useUserSetup";
import ProtectedRoute from "@/components/ProtectedRoute";
import SimpleRoleSelector from "@/components/SimpleRoleSelector";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Profile from "@/pages/profile";
import Chat from "@/pages/chat";
import Notifications from "@/pages/notifications";
import BookingsPage from "@/pages/bookings";
import Events from "@/pages/events";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
function Router() {
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

  return (
    <Switch>
      {/* Public Routes - accessible to everyone */}
      <Route path="/" component={Home} />
      <Route path="/events" component={Events} />
      <Route path="/partnerships">
        {() => import("@/pages/partnerships").then((m) => ({ default: m.default }))}
      </Route>
      <Route path="/blog">
        {() => import("@/pages/blog").then((m) => ({ default: m.default }))}
      </Route>
      <Route
        path="/blog/:id"
        component={() =>
          import("@/pages/blog-post").then((m) => ({ default: m.default }))
        }
      />
      <Route path="/login" component={LoginPage} />
      
      {/* Protected Routes - require authentication */}
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>

      <Route path="/bookings">
        <ProtectedRoute>
          <BookingsPage />
        </ProtectedRoute>
      </Route>

      <Route path="/profile">
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      </Route>

      <Route path="/chat" component={Chat} />
      <Route path="/chat/:chatId" component={Chat} />

      <Route path="/notifications">
        <ProtectedRoute>
          <Notifications />
        </ProtectedRoute>
      </Route>

      {/* Catch all - 404 */}
      <Route component={NotFound} />
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
