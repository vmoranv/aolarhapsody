import type { RouteObject } from 'react-router-dom';
import Home from '@/views/Home';
import React from 'react';

/**
 * 公共路由
 */
export const constantRoutes: RouteObject[] = [
  {
    path: '/',
    id: 'Home',
    element: React.createElement(Home),
  },
];
