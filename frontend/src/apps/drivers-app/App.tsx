import { Route, Switch } from "wouter";
import { Toaster } from "@/shared/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/shared/hooks/useAuth";
import Header from "@/shared/components/Header";
import MobileNavigation from "@/shared/components/MobileNavigation";
import NotFound from "./pages/not-found";
import Dashboard from "./pages/dashboard";
import RoutePublisher from "./pages/route-publisher";
import MyOffers from "./pages/my-offers";
import Partnerships from "./pages/partnerships";
import Chat from "./pages/chat";

const queryClient = new QueryClient();

export default function DriversApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Header appType="drivers" />
          
          <main className="pb-20 md:pb-0">
            <Switch>
              <Route path="/drivers" component={Dashboard} />
              <Route path="/drivers/publish" component={RoutePublisher} />
              <Route path="/drivers/offers" component={MyOffers} />
              <Route path="/drivers/partnerships" component={Partnerships} />
              <Route path="/drivers/chat" component={Chat} />
              <Route component={NotFound} />
            </Switch>
          </main>
          
          <MobileNavigation appType="drivers" />
          <Toaster />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}