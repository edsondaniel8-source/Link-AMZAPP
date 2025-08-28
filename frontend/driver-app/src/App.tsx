import { Router, Route, Switch } from 'wouter';
import { AuthRedirect } from '../shared/components/AuthRedirect';
import { AuthProvider } from '../shared/hooks/useAuth';
import Dashboard from './pages/Dashboard';
import Rides from './pages/Rides';
import Earnings from './pages/Earnings';
import Profile from './pages/Profile';
import Navigation from './components/Navigation';

function App() {
  return (
    <AuthProvider>
      <AuthRedirect requiredRole="driver">
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <Router>
              <Switch>
                <Route path="/" component={Dashboard} />
                <Route path="/rides" component={Rides} />
                <Route path="/earnings" component={Earnings} />
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