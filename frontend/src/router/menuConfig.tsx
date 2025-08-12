import { Database, Home, Package, Settings, Users } from 'lucide-react';
import React from 'react';

export interface MenuItemConfig {
  key: string;
  path: string;
  label: string;
  status: 'release' | 'dev';
  icon?: React.ReactNode;
  children?: MenuItemConfig[];
  parentKey?: string;
}

export const menuConfig: MenuItemConfig[] = [
  {
    key: '1',
    path: '/app',
    label: '首页',
    icon: <Home size={18} />,
    status: 'release',
  },
  {
    key: '2',
    path: '#',
    label: '核心系统',
    icon: <Database size={18} />,
    status: 'release',
    children: [
      { key: '2-1', path: '/app/attribute', label: '系别克制', status: 'release', parentKey: '2' },
      { key: '2-2', path: '/app/pets', label: '亚比图鉴', status: 'release', parentKey: '2' },
      { key: '2-3', path: '/app/astralspirit', label: '星灵系统', status: 'dev', parentKey: '2' },
      { key: '2-4', path: '/app/crystalkey', label: '晶钥系统', status: 'dev', parentKey: '2' },
      { key: '2-5', path: '/app/godcard', label: '神兵系统', status: 'dev', parentKey: '2' },
      { key: '2-6', path: '/app/hk', label: '魂卡系统', status: 'dev', parentKey: '2' },
      { key: '2-7', path: '/app/inscription', label: '铭文系统', status: 'dev', parentKey: '2' },
      { key: '2-8', path: '/app/petcard', label: '宠物卡系统', status: 'dev', parentKey: '2' },
      { key: '2-9', path: '/app/petcard2', label: '特性晶石', status: 'dev', parentKey: '2' },
      { key: '2-10', path: '/app/pmdatalist', label: 'PM数据列表', status: 'dev', parentKey: '2' },
      { key: '2-11', path: '/app/tote', label: 'Tote系统', status: 'dev', parentKey: '2' },
    ],
  },
  {
    key: '3',
    path: '#',
    label: '封包解析',
    icon: <Package size={18} />,
    status: 'release',
    children: [
      {
        key: '3-1',
        path: '/app/existing-packets',
        label: '现有封包',
        status: 'release',
        parentKey: '3',
      },
    ],
  },
  {
    key: '4',
    path: '#',
    label: '杂项数据',
    icon: <Settings size={18} />,
    status: 'release',
    children: [
      {
        key: '4-1',
        path: '/app/miscellaneous',
        label: '数据总览',
        status: 'release',
        parentKey: '4',
      },
      {
        key: '4-2',
        path: '/app/image-compressor',
        label: '图片工具',
        status: 'release',
        parentKey: '4',
      },
      {
        key: '4-3',
        path: '/app/miscellaneous/character-analyzer',
        label: '性格解析',
        status: 'release',
        parentKey: '4',
      },
      {
        key: '4-4',
        path: '/app/miscellaneous/poster',
        label: '海报解析',
        status: 'release',
        parentKey: '4',
      },
    ],
  },
  {
    key: '5',
    path: '#',
    label: '社区',
    icon: <Users size={18} />,
    status: 'release',
  },
];
