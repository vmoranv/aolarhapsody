import type { RouteObject } from 'react-router-dom';
import Home from '@/views/Home';
import PetDictionary from '@/views/PetDictionary';

/**
 * Defines the constant (public) routes for the application.
 * These routes are accessible to all users.
 *
 * @type {RouteObject[]}
 */
export const constantRoutes: RouteObject[] = [
  {
    path: '/app',
    id: 'Home',
    element: <Home />,
  },
  {
    path: '/app/pets',
    id: 'PetDictionary',
    element: <PetDictionary />,
  },
];
