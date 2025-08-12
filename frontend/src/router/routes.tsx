import type { RouteObject } from 'react-router-dom';
import AstralSpirit from '@/views/AstralSpirit';
import Attribute from '@/views/Attribute';
import CharacterAnalyzer from '@/views/CharacterAnalyzer';
import CrystalKey from '@/views/CrystalKey';
import ExistingPackets from '@/views/ExistingPackets';
import GodCard from '@/views/GodCard';
import HK from '@/views/HK';
import Home from '@/views/Home';
import ImageCompressor from '@/views/ImageCompressor';
import Inscription from '@/views/Inscription';
import Miscellaneous from '@/views/Miscellaneous';
import PetCard from '@/views/PetCard';
import PetCard2 from '@/views/PetCard2';
import PetDictionary from '@/views/PetDictionary';
import PMDataList from '@/views/PMDataList';
import PosterPage from '@/views/Poster';
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
    path: '/app/attribute',
    id: 'Attribute',
    element: <Attribute />,
  },
  {
    path: '/app/pets',
    id: 'PetDictionary',
    element: <PetDictionary />,
  },
  {
    path: '/app/astralspirit',
    id: 'AstralSpirit',
    element: <AstralSpirit />,
  },
  {
    path: '/app/crystalkey',
    id: 'CrystalKey',
    element: <CrystalKey />,
  },
  {
    path: '/app/godcard',
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
    path: '/app/petcard',
    id: 'PetCard',
    element: <PetCard />,
  },
  {
    path: '/app/petcard2',
    id: 'PetCard2',
    element: <PetCard2 />,
  },
  {
    path: '/app/pmdatalist',
    id: 'PMDataList',
    element: <PMDataList />,
  },
  {
    path: '/app/tote',
    id: 'Tote',
    element: <Tote />,
  },
  {
    path: '/app/existing-packets',
    id: 'ExistingPackets',
    element: <ExistingPackets />,
  },
  {
    path: '/app/miscellaneous',
    id: 'Miscellaneous',
    element: <Miscellaneous />,
  },
  {
    path: '/app/miscellaneous/character-analyzer',
    id: 'CharacterAnalyzer',
    element: <CharacterAnalyzer />,
  },
  {
    path: '/app/miscellaneous/poster',
    id: 'Poster',
    element: <PosterPage />,
  },
  {
    path: '/app/image-compressor',
    id: 'ImageCompressor',
    element: <ImageCompressor />,
  },
];
