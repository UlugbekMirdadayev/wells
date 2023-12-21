import Wells from 'screens/wells';
import Home from 'screens/home';
import Login from 'screens/login';

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
    path: '/login',
    element: <Login />
  }
];

export default routes;
