import Wells from 'screens/wells';
import Home from 'screens/home';
import Login from 'screens/login';
import WellSingle from 'screens/wells/single';
import { NotFound } from 'screens/404';
import ProfileSuperUser from 'screens/profile';

const routes = [
  {
    index: true,
    path: '/',
    element: <Home />
  },
  {
    path: '/wells',
    element: <Wells />
  },
  {
    path: '/well/:id',
    element: <WellSingle />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/super-user-profile',
    element: <ProfileSuperUser />
  },

  {
    path: '*',
    element: <NotFound />
  }
];

export default routes;
