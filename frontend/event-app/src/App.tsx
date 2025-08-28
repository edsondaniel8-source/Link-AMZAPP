import { Router, Route, Switch } from 'wouter';
import { AuthProvider } from '../shared/hooks/useAuth';
import { AuthRedirect } from '../shared/components/AuthRedirect';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Bookings from './pages/Bookings';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Navigation from './components/Navigation';

function App() {
  return (
    <AuthProvider>
      <AuthRedirect requiredRole="event">
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <Router>
              <Switch>
                <Route path="/" component={Dashboard} />
                <Route path="/events" component={Events} />
                <Route path="/bookings" component={Bookings} />
                <Route path="/analytics" component={Analytics} />
                <Route path="/profile" component={Profile} />
                <Route>
                  <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-gray-800">Página não encontrada</h2>
                  </div>
                </Route>
              </Switch>
            </Router>
          </main>
        </div>
      </AuthRedirect>
    </AuthProvider>
  );
}

export default App;