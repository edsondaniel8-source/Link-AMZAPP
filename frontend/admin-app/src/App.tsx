import { Router, Route, Switch } from 'wouter';
import { AuthProvider } from '../shared/hooks/useAuth';
import { AuthRedirect } from '../shared/components/AuthRedirect';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import PlatformAnalytics from './pages/PlatformAnalytics';
import SystemSettings from './pages/SystemSettings';
import ModerationSupport from './pages/ModerationSupport';
import Navigation from './components/Navigation';

function App() {
  return (
    <AuthProvider>
      <AuthRedirect requiredRole="admin">
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <Router>
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/users" component={UserManagement} />
              <Route path="/analytics" component={PlatformAnalytics} />
              <Route path="/settings" component={SystemSettings} />
              <Route path="/moderation" component={ModerationSupport} />
              <Route>
                <div className="text-center py-20">
                  <h2 className="text-2xl font-bold text-gray-800">Página não encontrada</h2>
                </div>
              </Route>
            </Switch>
          </Router>
        </div>
      </AuthRedirect>
    </AuthProvider>
  );
}

export default App;