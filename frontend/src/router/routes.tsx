import type { RouteObject } from 'react-router-dom';
import Home from '@/views/Home';

/**
 * Defines the constant (public) routes for the application.
 * These routes are accessible to all users.
 *
 * @type {RouteObject[]}
 */
export const constantRoutes: RouteObject[] = [
  {
    path: '/',
    id: 'Home',
    element: <Home />,
  },
];
