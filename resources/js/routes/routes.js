import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Register from '../pages/Register';
import Resource from '../pages/Resource';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Archive from '../pages/Archive';
import NoMatch from '../pages/NoMatch';

const routes = [
  {
    path: '/',
    exact: true,
    auth: true,
    component: Dashboard,
    fallback: Home,
  },
  {
    path: '/resource/:resource',
    exact: true,
    auth: true,
    component: Resource,
    fallback: Home,
  },
  {
    path: '/register',
    exact: true,
    auth: false,
    component: Register,
  },
  {
    path: '/forgot-password',
    exact: true,
    auth: false,
    component: ForgotPassword,
  },
  {
    path: '/reset-password',
    exact: true,
    auth: false,
    component: ResetPassword,
  },
  {
    path: '/archive',
    exact: true,
    auth: true,
    component: Archive,
  },
  {
    path: '',
    exact: false,
    auth: false,
    component: NoMatch,
  },
];

export default routes;
