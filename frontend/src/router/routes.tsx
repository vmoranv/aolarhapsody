import type { RouteObject } from 'react-router-dom';
import AstralSpirit from '@/views/AstralSpirit';
import Attribute from '@/views/Attribute';
import BadwordCheck from '@/views/BadwordCheck';
import CharacterAnalyzer from '@/views/CharacterAnalyzer';
import CrystalKey from '@/views/CrystalKey';
import DamageCalculator from '@/views/DamageCalculator';
import ExistingPackets from '@/views/ExistingPackets';
import ExpCalculator from '@/views/ExpCalculator';
import GodCard from '@/views/GodCard';
import HK from '@/views/HK';
import Home from '@/views/Home';
import ImageCompressor from '@/views/ImageCompressor';
import Inscription from '@/views/Inscription';
import Miscellaneous from '@/views/Miscellaneous';
import MultiPointBurstPage from '@/views/MultiPointBurst';
import PetCard from '@/views/PetCard';
import PetCard2 from '@/views/PetCard2';
import PetDictionary from '@/views/PetDictionary';
import PetExchange from '@/views/PetExchange';
import PosterPage from '@/views/Poster';
import Tote from '@/views/Tote';

/**
 * @file 应用的静态路由配置文件
 * @description 该文件定义了应用中所有无需动态加载或权限控制的公共路由。
 * 每个路由对象都遵循 `react-router-dom` 的 `RouteObject` 格式，
 * 将一个特定的 URL 路径映射到一个 React 组件。
 *
 * @module router/routes
 * @requires react-router-dom
 * @requires @/views/* - 导入所有页面级组件
 */

/**
 * 应用的常量（公共）路由数组。
 * 这些路由对所有用户开放，构成了应用的基础导航结构。
 *
 * @type {RouteObject[]}
 * @property {string} path - 路由的 URL 路径。
 * @property {string} id - 路由的唯一标识符，可用于链接生成或路由查找。
 * @property {React.ReactElement} element - 当路由匹配时要渲染的 React 元素。
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
  {
    path: '/app/packet-analysis/multi-point-burst',
    id: 'MultiPointBurst',
    element: <MultiPointBurstPage />,
  },
  {
    path: '/app/packet-analysis/damage-calculator',
    id: 'DamageCalculator',
    element: <DamageCalculator />,
  },
  {
    path: '/app/petexchange',
    id: 'PetExchange',
    element: <PetExchange />,
  },
  {
    path: '/app/miscellaneous/badword-check',
    id: 'BadwordCheck',
    element: <BadwordCheck />,
  },
  {
    path: '/app/miscellaneous/exp-calculator',
    id: 'ExpCalculator',
    element: <ExpCalculator />,
  },
];
