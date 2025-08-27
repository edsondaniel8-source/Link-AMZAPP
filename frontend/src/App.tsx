import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import AdminPanel from "@/pages/admin";
import Partnerships from "@/pages/partnerships";
import Events from "@/pages/events";
import Blog from "@/pages/blog";
import Loyalty from "@/pages/loyalty";
import ProfileVerification from "@/pages/profile-verification";
import CreateEvent from "@/pages/create-event";
import BookingsPage from "@/pages/bookings";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
import TestBooking from "./components/TestBooking";
function Router() {
  const { loading } = useAuth();

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
      <Route path="/partnerships" component={Partnerships} />
      <Route path="/blog" component={Blog} />
      <Route
        path="/blog/:id"
        component={() => {
          const BlogPost = React.lazy(() => import("@/pages/blog-post"));
          return <React.Suspense fallback={<div className="p-4">Loading...</div>}><BlogPost /></React.Suspense>;
        }}
      />
      <Route path="/login" component={LoginPage} />
      <Route path="/test-booking" component={TestBooking} />
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

      <Route path="/profile/verification">
        <ProtectedRoute>
          <ProfileVerification />
        </ProtectedRoute>
      </Route>

      <Route path="/admin">
        <ProtectedRoute>
          <AdminPanel />
        </ProtectedRoute>
      </Route>

      <Route path="/loyalty">
        <ProtectedRoute>
          <Loyalty />
        </ProtectedRoute>
      </Route>

      <Route path="/events/create">
        <ProtectedRoute requireVerification>
          <CreateEvent />
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
