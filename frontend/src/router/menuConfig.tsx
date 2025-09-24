import React from 'react';
import { Database, Home, Package, Settings, Users } from 'lucide-react';

/**
 * @file menuConfig.tsx
 * @description
 * 菜单配置文件，定义了应用的完整导航菜单结构。
 * 包含主菜单项和子菜单项，按功能模块组织，便于用户快速找到所需功能。
 * 菜单项支持国际化标签、图标、路由路径和状态（发布/开发中）。
 */

/**
 * @description 菜单项配置接口
 * 定义了应用导航菜单项的数据结构
 * @property {string} key - 菜单项的唯一标识
 * @property {string} path - 菜单项的路由地址
 * @property {string} label - 菜单项的显示文本（支持国际化）
 * @property {'release' | 'dev'} status - 菜单项的状态，'release' 为已发布，'dev' 为开发中
 * @property {React.ReactNode} [icon] - 菜单项的图标（仅主菜单项需要）
 * @property {MenuItemConfig[]} [children] - 子菜单项数组
 * @property {string} [parentKey] - 父菜单项的 key（仅子菜单项需要）
 */
export interface MenuItemConfig {
  key: string;
  path: string;
  label: string;
  status: 'release' | 'dev';
  icon?: React.ReactNode;
  children?: MenuItemConfig[];
  parentKey?: string;
}

/**
 * @description 菜单配置
 * 定义了应用的完整导航菜单结构，包括主菜单和子菜单
 * 菜单结构按照功能模块进行组织，便于用户快速找到所需功能
 *
 * 菜单结构说明：
 * 1. 首页 - 应用主页面
 * 2. 核心系统 - 包含属性克制、宠物图鉴、星灵系统等核心游戏数据
 * 3. 封包分析 - 包含现有封包、伤害计算器、宠物ID提取器等功能
 * 4. 杂项数据 - 包含数据总览、图片工具、角色分析器等辅助工具
 * 5. 社区 - 社交相关功能
 */
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
        status: 'release',
        parentKey: '2',
      },
      {
        key: '2-4',
        path: '/app/crystalkey',
        label: 'menu.crystal_key_system',
        status: 'release',
        parentKey: '2',
      },
      {
        key: '2-5',
        path: '/app/godcard',
        label: 'menu.god_card_system',
        status: 'release',
        parentKey: '2',
      },
      {
        key: '2-6',
        path: '/app/hk',
        label: 'menu.soul_card_system',
        status: 'release',
        parentKey: '2',
      },
      {
        key: '2-7',
        path: '/app/inscription',
        label: 'menu.inscription_system',
        status: 'release',
        parentKey: '2',
      },
      {
        key: '2-8',
        path: '/app/petcard',
        label: 'menu.pet_card_system',
        status: 'release',
        parentKey: '2',
      },
      {
        key: '2-9',
        path: '/app/petcard2',
        label: 'menu.feature_gem',
        status: 'release',
        parentKey: '2',
      },
      {
        key: '2-11',
        path: '/app/tote',
        label: 'menu.tote_system',
        status: 'release',
        parentKey: '2',
      },
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
      {
        key: '3-2',
        path: '/app/packet-analysis/multi-point-burst',
        label: 'menu.multi_point_burst',
        status: 'dev',
        parentKey: '3',
      },
      {
        key: '3-3',
        path: '/app/packet-analysis/damage-calculator',
        label: 'menu.damage_calculator',
        status: 'release',
        parentKey: '3',
      },
      {
        key: '3-4',
        path: '/app/petexchange',
        label: 'menu.pet_id_extractor',
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
      {
        key: '4-5',
        path: '/app/miscellaneous/badword-check',
        label: 'menu.bad_word_check',
        status: 'dev',
        parentKey: '4',
      },
      {
        key: '4-6',
        path: '/app/miscellaneous/exp-calculator',
        label: 'menu.exp_calculator',
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
