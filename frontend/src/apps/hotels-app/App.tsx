import { Route, Switch } from "wouter";
import { Toaster } from "@/shared/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "./pages/dashboard";
import CreateOffer from "./pages/create-offer";
import Partnerships from "./pages/partnerships";
import DriverChat from "./pages/driver-chat";

const queryClient = new QueryClient();

export default function HotelsApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <main className="pb-20 md:pb-0">
          <Switch>
            <Route path="/hotels" component={Dashboard} />
            <Route path="/hotels/create-offer" component={CreateOffer} />
            <Route path="/hotels/partnerships" component={Partnerships} />
            <Route path="/hotels/driver-chat" component={DriverChat} />
            <Route component={Dashboard} />
          </Switch>
        </main>
        
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}