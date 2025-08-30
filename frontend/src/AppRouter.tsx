import { Route, Switch } from 'wouter';

// Importar componentes das aplicações
import MainAppHome from './apps/main-app/pages/home';
import BookingsPage from './apps/main-app/pages/bookings';
import ProfilePage from './apps/main-app/pages/profile';
import BlogPage from './apps/main-app/pages/blog';
import MapPage from './apps/main-app/pages/map';
import DriversApp from './apps/drivers-app/App';
import HotelsApp from './apps/hotels-app/App';
import AdminApp from './shared/admin/AdminApp';

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
      <Route path="/map" component={MapPage} />
      
      {/* Rotas de autenticação */}
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      
      {/* Rotas das outras aplicações */}
      <Route path="/drivers/:rest*">
        {() => <DriversApp />}
      </Route>
      
      <Route path="/hotels/:rest*">
        {() => <HotelsApp />}
      </Route>
      
      <Route path="/admin/:rest*">
        {() => <AdminApp />}
      </Route>
      
      {/* Rota 404 */}
      <Route component={NotFoundPage} />
    </Switch>
  );
}

export default AppRouter;