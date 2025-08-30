import { Route, Switch } from 'wouter';

// Importar componentes das aplicações
import MainAppHome from './apps/main-app/pages/home';
import BookingsPage from './apps/main-app/pages/bookings';
import ProfilePage from './apps/main-app/pages/profile';
import BlogPage from './apps/main-app/pages/blog';
import DriversApp from './apps/drivers-app/App';
import HotelsApp from './apps/hotels-app/App';
import AdminApp from './apps/admin-app/App';

// Importar páginas individuais
import LoginPage from './pages/login';
import SignupPage from './pages/signup';
import NotFoundPage from './pages/not-found';

function AppRouter() {
  return (
    <Switch>
      {/* Rotas da aplicação principal (clientes) */}
      <Route path="/" component={MainAppHome} />
      <Route path="/home" component={MainAppHome} />
      <Route path="/bookings" component={BookingsPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/blog" component={BlogPage} />
      
      {/* Rotas de autenticação */}
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      
      {/* Rotas das outras aplicações */}
      <Route path="/drivers" component={DriversApp} />
      <Route path="/drivers/:rest*" component={DriversApp} />
      
      <Route path="/hotels" component={HotelsApp} />
      <Route path="/hotels/:rest*" component={HotelsApp} />
      
      <Route path="/admin" component={AdminApp} />
      <Route path="/admin/:rest*" component={AdminApp} />
      
      {/* Rota 404 */}
      <Route component={NotFoundPage} />
    </Switch>
  );
}

export default AppRouter;