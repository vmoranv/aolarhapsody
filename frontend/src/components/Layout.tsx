import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import { useQuery } from '@tanstack/react-query';
import type { MenuProps } from 'antd';
import { Avatar, Dropdown, Layout as AntLayout, Menu, Space } from 'antd';
import { motion } from 'framer-motion';
import { BookOpen, Search, Settings, User } from 'lucide-react';
import { useNotificationContext } from '../hooks/useNotificationContext';
import { useTheme } from '../hooks/useTheme';
import { menuConfig } from '../router/menuConfig';
import { useDialogStore } from '../store/dialog';
import { useSearchStore } from '../store/search';
import { useSettingStore } from '../store/setting';
import type { GodCard } from '../types/godcard';
import { fetchData, fetchDataItem } from '../utils/api';
import NotificationDropdown from './NotificationDropdown';
import PerformanceMonitor from './PerformanceMonitor';
import SettingsDrawer from './SettingsDrawer';
import ThemeToggle from './ThemeToggle';

const { Header, Sider, Content } = AntLayout;

/**
 * @file Layout.tsx
 * @description
 * 应用的主布局组件，负责构建页面的整体框架，包括侧边栏导航、顶部标题栏和内容区域。
 * 该组件还集成了 Copilot Kit，允许通过自然语言与应用进行交互。
 */

/**
 * 布图组件的属性接口。
 */
interface LayoutProps {
  /**
   * 需要在布局内容区域中渲染的子组件。
   * @type {React.ReactNode}
   */
  children: React.ReactNode;
}

/**
 * 主布局组件。
 * 该组件提供了一个包含侧边栏、头部和内容区域的响应式布局。
 * 它还处理：
 * - 动态生成和管理导航菜单。
 * - 用户设置、主题切换和通知中心。
 * - 与 Copilot Kit 的集成，以支持自然语言命令。
 * @param {LayoutProps} props - 组件属性，包含子组件。
 * @returns {React.ReactElement} 渲染的布局组件。
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  // 路由导航钩子
  const navigate = useNavigate();
  // 当前路由位置信息
  const location = useLocation();
  // 获取主题颜色配置
  const { colors } = useTheme()!;
  // 获取通知上下文
  const notifications = useNotificationContext();
  // 设置抽屉打开状态
  const [settingsOpen, setSettingsOpen] = useState(false);
  // 获取全局设置状态
  const { betaMode, performanceMonitoring, kimiMode } = useSettingStore();
  // 国际化翻译函数
  const { t } = useTranslation('common');
  // 获取搜索状态管理
  const { searchValue, filterType, resultCount, setSearchValue, setFilterType } = useSearchStore();
  // 获取对话框状态管理
  const { showDetail, setIsLoading } = useDialogStore();

  // 获取所有神兵卡片数据
  const { data: allGodCards = [] } = useQuery<GodCard[]>({
    queryKey: ['god-cards-all'],
    queryFn: () => fetchData<GodCard>('godcards'),
  });

  // 向Copilot提供可读的神兵卡片列表信息
  useCopilotReadable({
    description: 'List of all God Cards (神兵)',
    value: allGodCards.map((card: GodCard) => card.name),
  });

  // 向Copilot提供神兵卡片总数信息
  useCopilotReadable({
    description: 'Total number of God Cards (神兵)',
    value: allGodCards.length,
  });

  // 向Copilot提供当前搜索值信息
  useCopilotReadable({
    description: 'Current search value',
    value: searchValue,
  });

  // 向Copilot提供当前筛选类型信息
  useCopilotReadable({
    description: 'Current filter type',
    value: filterType,
  });

  // 向Copilot提供搜索结果数量信息
  useCopilotReadable({
    description: 'Number of search results',
    value: resultCount,
  });

  // 定义Copilot可执行的搜索操作
  useCopilotAction({
    name: 'search',
    description: 'Search for items.',
    parameters: [
      {
        name: 'query',
        type: 'string',
        description: 'The search query.',
        required: true,
      },
    ],
    handler: async ({ query }) => {
      setSearchValue(query);
    },
  });

  // 定义Copilot可执行的筛选操作
  useCopilotAction({
    name: 'filter',
    description: 'Filter items.',
    parameters: [
      {
        name: 'filterType',
        type: 'string',
        description: 'The filter type.',
        required: true,
      },
    ],
    handler: async ({ filterType }) => {
      setFilterType(filterType);
    },
  });

  // 定义Copilot可执行的显示神兵详情操作
  useCopilotAction({
    name: 'showGodCardDetails',
    description: 'Show the details of a specific God Card (神兵).',
    parameters: [
      {
        name: 'name',
        type: 'string',
        description: 'The name of the God Card to show details for.',
        required: true,
      },
    ],
    handler: async ({ name }) => {
      // 查找指定名称的神兵卡片
      const card = allGodCards.find((c) => c.name === name);
      if (card) {
        setIsLoading(true);
        try {
          // 获取神兵卡片详细信息
          const data = await fetchDataItem<GodCard>('godcards', card.id.toString());
          const cardDetails = { ...data, id: data.cardId };
          showDetail(cardDetails);
          // 返回详细信息供Copilot"朗读"
          return `
            ${cardDetails.name} 的效果是:
            - 描述: ${cardDetails.desc}
            - HP: ${cardDetails.hp}
            - 速度: ${cardDetails.speed}
            - 攻击: ${cardDetails.attack}
            - 防御: ${cardDetails.defend}
            - 特攻: ${cardDetails.sAttack}
            - 特防: ${cardDetails.sDefend}
          `;
        } catch (error) {
          console.error('Failed to fetch god card detail', error);
          return `Failed to fetch details for ${name}.`;
        } finally {
          setIsLoading(false);
        }
      } else {
        return `God Card with name "${name}" not found.`;
      }
    },
  });

  // 定义通用导航操作
  useCopilotAction({
    name: 'navigateToAttributePage',
    description: 'Navigate to the attribute克制关系 page',
    handler: async () => {
      navigate('/app/attribute');
    },
  });

  useCopilotAction({
    name: 'navigateToPetDictionary',
    description: 'Navigate to the pet dictionary page',
    handler: async () => {
      navigate('/app/pets');
    },
  });

  useCopilotAction({
    name: 'navigateToAstralSpirit',
    description: 'Navigate to the astral spirit page',
    handler: async () => {
      navigate('/app/astralspirit');
    },
  });

  useCopilotAction({
    name: 'navigateToCrystalKey',
    description: 'Navigate to the crystal key page',
    handler: async () => {
      navigate('/app/crystalkey');
    },
  });

  useCopilotAction({
    name: 'navigateToGodCard',
    description: 'Navigate to the god card page',
    handler: async () => {
      navigate('/app/godcard');
    },
  });

  useCopilotAction({
    name: 'navigateToHK',
    description: 'Navigate to the HK (魂卡) page',
    handler: async () => {
      navigate('/app/hk');
    },
  });

  useCopilotAction({
    name: 'navigateToInscription',
    description: 'Navigate to the inscription page',
    handler: async () => {
      navigate('/app/inscription');
    },
  });

  useCopilotAction({
    name: 'navigateToPetCard',
    description: 'Navigate to the pet card page',
    handler: async () => {
      navigate('/app/petcard');
    },
  });

  useCopilotAction({
    name: 'navigateToPetCard2',
    description: 'Navigate to the pet card 2 page',
    handler: async () => {
      navigate('/app/petcard2');
    },
  });

  useCopilotAction({
    name: 'navigateToTote',
    description: 'Navigate to the tote page',
    handler: async () => {
      navigate('/app/tote');
    },
  });

  useCopilotAction({
    name: 'navigateToExistingPackets',
    description: 'Navigate to the existing packets page',
    handler: async () => {
      navigate('/app/existing-packets');
    },
  });

  useCopilotAction({
    name: 'navigateToPoster',
    description: 'Navigate to the poster page',
    handler: async () => {
      navigate('/app/miscellaneous/poster');
    },
  });

  useCopilotAction({
    name: 'navigateToDamageCalculator',
    description: 'Navigate to the damage calculator page',
    handler: async () => {
      navigate('/app/packet-analysis/damage-calculator');
    },
  });

  // 菜单配置和状态计算 - 根据当前路由和设置动态生成菜单项
  const { menuItems, selectedKeys, openKeys, currentPageStatus } = useMemo(() => {
    const path = location.pathname;
    // 查找当前路由对应的菜单项
    let currentItem = menuConfig
      .flatMap((item) => item.children || item)
      .find((item) => item.path === path);
    // 如果未找到匹配项，使用默认首页项
    if (!currentItem) {
      const fallbackItem = menuConfig.find((item) => item.key === '1');
      currentItem = fallbackItem!;
    }

    // 设置当前选中项和展开项
    const selectedKeys = [currentItem.key];
    const openKeys = currentItem.parentKey ? [currentItem.parentKey] : [];
    const currentPageStatus = currentItem.status;

    // 转换菜单项结构的函数
    const transformMenuItems = (items: any[]): MenuProps['items'] => {
      return items
        .filter((item) => betaMode || item.status !== 'dev')
        .map((item) => {
          // 处理子菜单项
          if (item.children) {
            const filteredChildren = item.children.filter(
              (child: any) => betaMode || child.status !== 'dev'
            );
            if (filteredChildren.length > 0) {
              return {
                key: item.key,
                icon: item.icon,
                label: t(item.label),
                children: transformMenuItems(filteredChildren),
              };
            }
            return null;
          }
          // 处理普通菜单项
          return {
            key: item.key,
            icon: item.icon,
            label: t(item.label),
          };
        })
        .filter(Boolean);
    };

    const menuItems = transformMenuItems(menuConfig);

    return { menuItems, selectedKeys, openKeys, currentPageStatus };
  }, [location.pathname, betaMode, t, kimiMode]);

  // 菜单点击处理函数 - 处理菜单项点击事件并导航到对应页面
  const handleMenuClick = ({ key }: { key: string }) => {
    const targetItem = menuConfig
      .flatMap((item) => item.children || item)
      .find((item) => item.key === key);
    if (targetItem && targetItem.path !== '#') {
      navigate(targetItem.path);
    }
  };

  // 用户菜单点击处理函数 - 处理用户头像下拉菜单的点击事件
  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'settings') {
      setSettingsOpen(true);
    }
  };

  // 用户菜单项配置
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: t('profile'),
      icon: <User size={16} />,
    },
    {
      key: 'settings',
      label: t('settings'),
      icon: <Settings size={16} />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: t('logout'),
    },
  ];

  // Beta模式权限检查 - 如果当前页面是开发中页面且用户未开启Beta模式，则重定向到首页
  useEffect(() => {
    if (!betaMode && (currentPageStatus as string) === 'dev') {
      navigate('/app');
    }
  }, [betaMode, currentPageStatus, navigate]);

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider
        theme="light"
        width={240}
        style={{
          background: colors.surface,
          borderRight: `1px solid ${colors.borderSecondary}`,
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: `1px solid ${colors.borderSecondary}`,
            marginBottom: 16,
            gap: '12px',
          }}
        >
          <img
            src={kimiMode ? '/favicon_maodie/favicon.ico' : '/favicon-64x64.ico'}
            alt="logo"
            style={{ width: '32px', height: '32px' }}
          />
          <h2
            style={{
              margin: 0,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '20px',
              fontWeight: 'bold',
            }}
          >
            {t('aola_rhapsody')}
          </h2>
        </motion.div>

        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          defaultOpenKeys={openKeys}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ border: 'none' }}
        />
      </Sider>

      <AntLayout>
        <Header
          style={{
            padding: '0 24px',
            background: colors.surface,
            borderBottom: `1px solid ${colors.borderSecondary}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', alignItems: 'center', gap: 16 }}
          >
            <Search size={20} color={colors.textSecondary} />
            <span style={{ color: colors.textSecondary, fontSize: '16px' }}>{t('explore')}</span>
          </motion.div>

          <Space size={16}>
            {/* 添加文档图标链接 */}
            <motion.a
              href="https://ardocs.614447.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            >
              <BookOpen size={20} color={colors.textSecondary} />
            </motion.a>

            <ThemeToggle />

            <NotificationDropdown
              notifications={notifications.notifications}
              onMarkAsRead={notifications.markAsRead}
              onMarkAllAsRead={notifications.markAllAsRead}
              onRemove={notifications.removeNotification}
              onClearAll={notifications.clearAll}
            />

            <Dropdown
              menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
              placement="bottomRight"
            >
              <motion.div whileHover={{ scale: 1.05 }} style={{ cursor: 'pointer' }}>
                <Avatar
                  size={36}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  U
                </Avatar>
              </motion.div>
            </Dropdown>
          </Space>
        </Header>

        <Content
          style={{
            margin: '24px',
            padding: '24px',
            minHeight: 280,
            background: colors.surface,
            borderRadius: 12,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {children}
          </motion.div>
        </Content>
        <SettingsDrawer
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          currentPageStatus={currentPageStatus}
        />
        {performanceMonitoring && <PerformanceMonitor />}
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
