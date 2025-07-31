import type { RouteObject } from 'react-router-dom';
import AstralSpirit from '@/views/AstralSpirit';
import CrystalKey from '@/views/CrystalKey';
import GodCard from '@/views/GodCard';
import HK from '@/views/HK';
import Home from '@/views/Home';
import Inscription from '@/views/Inscription';
import Miscellaneous from '@/views/Miscellaneous';
import PetCard from '@/views/PetCard';
import PetCard2 from '@/views/PetCard2';
import PetDictionary from '@/views/PetDictionary';
import PMDataList from '@/views/PMDataList';
import Tote from '@/views/Tote';

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
  {
    path: '/app/astral-spirit',
    id: 'AstralSpirit',
    element: <AstralSpirit />,
  },
  {
    path: '/app/crystal-key',
    id: 'CrystalKey',
    element: <CrystalKey />,
  },
  {
    path: '/app/god-card',
    id: 'GodCard',
    element: <GodCard />,
  },
  {
    path: '/app/hk',
    id: 'HK',
    element: <HK />,
  },
  {
    path: '/app/inscription',
    id: 'Inscription',
    element: <Inscription />,
  },
  {
    path: '/app/pet-card',
    id: 'PetCard',
    element: <PetCard />,
  },
  {
    path: '/app/pet-card2',
    id: 'PetCard2',
    element: <PetCard2 />,
  },
  {
    path: '/app/pm-data-list',
    id: 'PMDataList',
    element: <PMDataList />,
  },
  {
    path: '/app/tote',
    id: 'Tote',
    element: <Tote />,
  },
  {
    path: '/app/miscellaneous',
    id: 'Miscellaneous',
    element: <Miscellaneous />,
  },
];
