import { Route, Switch } from 'wouter';

// Importar componentes das aplicações
import MainApp from './apps/main-app/App';
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
      
      {/* Todas as outras rotas vão para a aplicação principal */}
      <Route path="/:rest*" component={MainApp} />
      <Route path="/" component={MainApp} />
      
      {/* Rota 404 */}
      <Route component={NotFoundPage} />
    </Switch>
  );
}

export default AppRouter;