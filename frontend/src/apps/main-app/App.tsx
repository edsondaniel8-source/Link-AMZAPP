import { Switch, Route } from 'wouter';
import { queryClient } from '@/shared/lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/shared/components/ui/toaster';
import { TooltipProvider } from '@/shared/components/ui/tooltip';
import Header from '@/shared/components/Header';
import MobileNavigation from '@/shared/components/MobileNavigation';
import Home from './pages/home';
import Events from './pages/events';
import Bookings from './pages/bookings';
import Loyalty from './pages/loyalty';
import Chat from './pages/chat';
import Notifications from './pages/notifications';
import Profile from './pages/profile';
import RideSearch from './pages/Rides/search';
import RideBook from './pages/Rides/book';
import HotelSearch from './pages/Hotels/search';
import ProtectedRoute from '@/shared/components/ProtectedRoute';
import NotFound from './pages/not-found';

function MainApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50">
          <Header activeService="rides" onServiceChange={() => {}} />
          <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/eventos" component={Events} />
              <Route path="/rides/search" component={RideSearch} />
              <Route path="/rides/:rideId/book" component={RideBook} />
              <Route path="/hotels/search" component={HotelSearch} />
              <Route path="/stays/search" component={HotelSearch} />
              <Route path="/reservas">
                <ProtectedRoute>
                  <Bookings />
                </ProtectedRoute>
              </Route>
              <Route path="/fidelidade">
                <ProtectedRoute>
                  <Loyalty />
                </ProtectedRoute>
              </Route>
              <Route path="/chat">
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              </Route>
              <Route path="/notificacoes">
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              </Route>
              <Route path="/perfil">
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              </Route>
              <Route component={NotFound} />
            </Switch>
          </main>
          <MobileNavigation />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default MainApp;