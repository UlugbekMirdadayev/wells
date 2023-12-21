import Wells from 'screens/wells';
import Home from 'screens/home';
import Login from 'screens/login';
import WellSingle from 'screens/wells/single';
import { NotFound } from 'screens/404';

const routes = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/wells',
    element: <Wells />
  },
  {
    path: '/wells/:id',
    element: <WellSingle />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '*',
    element: <NotFound />
  }
];

export default routes;
