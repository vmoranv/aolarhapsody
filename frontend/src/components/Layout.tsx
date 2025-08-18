import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import { useQuery } from '@tanstack/react-query';
import type { MenuProps } from 'antd';
import { Avatar, Dropdown, Layout as AntLayout, Menu, Space } from 'antd';
import { motion } from 'framer-motion';
import { Search, Settings, User } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
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
 * 布局组件的属性
 */
interface LayoutProps {
  children: React.ReactNode; // 子组件
}

/**
 * 主布局组件
 * 包含侧边栏、头部和内容区域，为应用提供统一的页面结构。
 * @param children - 要在内容区域渲染的子组件。
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { colors } = useTheme()!;
  const notifications = useNotificationContext();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { betaMode, performanceMonitoring, kimiMode } = useSettingStore();
  const { t } = useTranslation('common');
  const { searchValue, filterType, resultCount, setSearchValue, setFilterType } = useSearchStore();
  const { showDetail, setIsLoading } = useDialogStore();

  const { data: allGodCards = [] } = useQuery<GodCard[]>({
    queryKey: ['god-cards-all'],
    queryFn: () => fetchData<GodCard>('godcards'),
  });

  useCopilotReadable({
    description: 'List of all God Cards (神兵)',
    value: allGodCards.map((card: GodCard) => card.name),
  });

  useCopilotReadable({
    description: 'Total number of God Cards (神兵)',
    value: allGodCards.length,
  });

  useCopilotReadable({
    description: 'Current search value',
    value: searchValue,
  });

  useCopilotReadable({
    description: 'Current filter type',
    value: filterType,
  });

  useCopilotReadable({
    description: 'Number of search results',
    value: resultCount,
  });

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
      const card = allGodCards.find((c) => c.name === name);
      if (card) {
        setIsLoading(true);
        try {
          const data = await fetchDataItem<GodCard>('godcards', card.id.toString());
          const cardDetails = { ...data, id: data.cardId };
          showDetail(cardDetails);
          // Return a detailed string for the Copilot to "speak"
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

  const { menuItems, selectedKeys, openKeys, currentPageStatus } = useMemo(() => {
    const path = location.pathname;
    let currentItem = menuConfig
      .flatMap((item) => item.children || item)
      .find((item) => item.path === path);
    if (!currentItem) {
      const fallbackItem = menuConfig.find((item) => item.key === '1');
      currentItem = fallbackItem!;
    }

    const selectedKeys = [currentItem.key];
    const openKeys = currentItem.parentKey ? [currentItem.parentKey] : [];
    const currentPageStatus = currentItem.status;

    const transformMenuItems = (items: any[]): MenuProps['items'] => {
      return items
        .filter((item) => betaMode || item.status !== 'dev')
        .map((item) => {
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

  const handleMenuClick = ({ key }: { key: string }) => {
    const targetItem = menuConfig
      .flatMap((item) => item.children || item)
      .find((item) => item.key === key);
    if (targetItem && targetItem.path !== '#') {
      navigate(targetItem.path);
    }
  };

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'settings') {
      setSettingsOpen(true);
    }
  };

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
