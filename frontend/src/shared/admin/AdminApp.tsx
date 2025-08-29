import { Route, Switch } from "wouter";
import { Toaster } from "@/shared/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "./pages/dashboard";
import Users from "./pages/users";

const queryClient = new QueryClient();

export default function AdminApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <main className="pb-4">
          <Switch>
            <Route path="/admin" component={Dashboard} />
            <Route path="/admin/users" component={Users} />
            <Route component={Dashboard} />
          </Switch>
        </main>
        
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}