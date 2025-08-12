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
    label: 'menu.home',
    icon: <Home size={18} />,
    status: 'release',
  },
  {
    key: '2',
    path: '#',
    label: 'menu.core_system',
    icon: <Database size={18} />,
    status: 'release',
    children: [
      {
        key: '2-1',
        path: '/app/attribute',
        label: 'menu.attribute_restraint',
        status: 'release',
        parentKey: '2',
      },
      {
        key: '2-2',
        path: '/app/pets',
        label: 'menu.pet_handbook',
        status: 'release',
        parentKey: '2',
      },
      {
        key: '2-3',
        path: '/app/astralspirit',
        label: 'menu.astral_spirit_system',
        status: 'dev',
        parentKey: '2',
      },
      {
        key: '2-4',
        path: '/app/crystalkey',
        label: 'menu.crystal_key_system',
        status: 'dev',
        parentKey: '2',
      },
      {
        key: '2-5',
        path: '/app/godcard',
        label: 'menu.god_card_system',
        status: 'dev',
        parentKey: '2',
      },
      {
        key: '2-6',
        path: '/app/hk',
        label: 'menu.soul_card_system',
        status: 'dev',
        parentKey: '2',
      },
      {
        key: '2-7',
        path: '/app/inscription',
        label: 'menu.inscription_system',
        status: 'dev',
        parentKey: '2',
      },
      {
        key: '2-8',
        path: '/app/petcard',
        label: 'menu.pet_card_system',
        status: 'dev',
        parentKey: '2',
      },
      {
        key: '2-9',
        path: '/app/petcard2',
        label: 'menu.feature_gem',
        status: 'dev',
        parentKey: '2',
      },
      {
        key: '2-10',
        path: '/app/pmdatalist',
        label: 'menu.pm_data_list',
        status: 'dev',
        parentKey: '2',
      },
      { key: '2-11', path: '/app/tote', label: 'menu.tote_system', status: 'dev', parentKey: '2' },
    ],
  },
  {
    key: '3',
    path: '#',
    label: 'menu.packet_analysis',
    icon: <Package size={18} />,
    status: 'release',
    children: [
      {
        key: '3-1',
        path: '/app/existing-packets',
        label: 'menu.existing_packets',
        status: 'release',
        parentKey: '3',
      },
    ],
  },
  {
    key: '4',
    path: '#',
    label: 'menu.misc_data',
    icon: <Settings size={18} />,
    status: 'release',
    children: [
      {
        key: '4-1',
        path: '/app/miscellaneous',
        label: 'menu.data_overview',
        status: 'release',
        parentKey: '4',
      },
      {
        key: '4-2',
        path: '/app/image-compressor',
        label: 'menu.image_tools',
        status: 'release',
        parentKey: '4',
      },
      {
        key: '4-3',
        path: '/app/miscellaneous/character-analyzer',
        label: 'menu.character_analyzer',
        status: 'release',
        parentKey: '4',
      },
      {
        key: '4-4',
        path: '/app/miscellaneous/poster',
        label: 'menu.poster_analysis',
        status: 'release',
        parentKey: '4',
      },
    ],
  },
  {
    key: '5',
    path: '#',
    label: 'menu.community',
    icon: <Users size={18} />,
    status: 'release',
  },
];
