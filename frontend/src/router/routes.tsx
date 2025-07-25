import type { RouteObject } from 'react-router-dom';
import Home from '@/views/Home';

/**
 * 公共路由
 */
export const constantRoutes: RouteObject[] = [
  {
    path: '/',
    id: 'Home',
    element: <Home />,
  },
];
