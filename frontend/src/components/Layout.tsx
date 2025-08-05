import type { MenuProps } from 'antd';
import { Avatar, Dropdown, Layout as AntLayout, Menu, Space } from 'antd';
import { motion } from 'framer-motion';
import { Database, Home, Search, Settings, User, Users } from 'lucide-react';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNotificationContext } from '../hooks/useNotificationContext';
import { useTheme } from '../hooks/useTheme';
import NotificationDropdown from './NotificationDropdown';
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

  /**
   * 根据当前URL路径确定侧边栏中应选中的菜单项。
   * @returns 返回一个包含选中菜单项key的数组。
   */
  const getSelectedKeys = () => {
    const path = location.pathname;
    switch (path) {
      case '/app':
        return ['1'];
      case '/app/attribute':
        return ['2-1'];
      case '/app/pets':
        return ['2-2'];
      case '/app/astralspirit':
        return ['2-3'];
      case '/app/crystalkey':
        return ['2-4'];
      case '/app/godcard':
        return ['2-5'];
      case '/app/hk':
        return ['2-6'];
      case '/app/inscription':
        return ['2-7'];
      case '/app/petcard':
        return ['2-8'];
      case '/app/petcard2':
        return ['2-9'];
      case '/app/pmdatalist':
        return ['2-10'];
      case '/app/tote':
        return ['2-11'];
      case '/app/miscellaneous':
        return ['3'];
      default:
        return ['1'];
    }
  };

  /**
   * 根据当前URL路径确定侧边栏中应展开的子菜单。
   * @returns 返回一个包含展开子菜单key的数组。
   */
  const getOpenKeys = () => {
    const path = location.pathname;
    if (
      path.startsWith('/app/attribute') ||
      path.startsWith('/app/pets') ||
      path.startsWith('/app/astralspirit') ||
      path.startsWith('/app/crystalkey') ||
      path.startsWith('/app/godcard') ||
      path.startsWith('/app/hk') ||
      path.startsWith('/app/inscription') ||
      path.startsWith('/app/petcard') ||
      path.startsWith('/app/pmdatalist') ||
      path.startsWith('/app/tote')
    ) {
      return ['2'];
    }
    return [];
  };

  const menuItems: MenuProps['items'] = [
    {
      key: '1',
      icon: <Home size={18} />,
      label: '首页',
    },
    {
      key: '2',
      icon: <Database size={18} />,
      label: '核心系统',
      children: [
        {
          key: '2-1',
          label: '系别克制',
        },
        {
          key: '2-2',
          label: '亚比图鉴',
        },
        {
          key: '2-3',
          label: '星灵系统',
        },
        {
          key: '2-4',
          label: '晶钥系统',
        },
        {
          key: '2-5',
          label: '神兵系统',
        },
        {
          key: '2-6',
          label: '魂卡系统',
        },
        {
          key: '2-7',
          label: '铭文系统',
        },
        {
          key: '2-8',
          label: '宠物卡系统',
        },
        {
          key: '2-9',
          label: '特性晶石',
        },
        {
          key: '2-10',
          label: 'PM数据列表',
        },
        {
          key: '2-11',
          label: 'Tote系统',
        },
      ],
    },
    {
      key: '3',
      icon: <Settings size={18} />,
      label: '杂项数据',
    },
    {
      key: '4',
      icon: <Users size={18} />,
      label: '社区',
    },
  ];

  /**
   * 处理侧边栏菜单的点击事件，根据点击的菜单项key导航到对应的页面。
   * @param key - 被点击的菜单项的key。
   */
  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case '1':
        navigate('/app');
        break;
      case '2-1':
        navigate('/app/attribute');
        break;
      case '2-2':
        navigate('/app/pets');
        break;
      case '2-3':
        navigate('/app/astralspirit');
        break;
      case '2-4':
        navigate('/app/crystalkey');
        break;
      case '2-5':
        navigate('/app/godcard');
        break;
      case '2-6':
        navigate('/app/hk');
        break;
      case '2-7':
        navigate('/app/inscription');
        break;
      case '2-8':
        navigate('/app/petcard');
        break;
      case '2-9':
        navigate('/app/petcard2');
        break;
      case '2-10':
        navigate('/app/pmdatalist');
        break;
      case '2-11':
        navigate('/app/tote');
        break;
      case '3':
        navigate('/app/miscellaneous');
        break;
      default:
        break;
    }
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: '个人资料',
      icon: <User size={16} />,
    },
    {
      key: 'settings',
      label: '设置',
      icon: <Settings size={16} />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: '退出登录',
    },
  ];

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
          }}
        >
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
            奥拉狂想曲
          </h2>
        </motion.div>

        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
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
            <span style={{ color: colors.textSecondary, fontSize: '16px' }}>探索奥拉世界</span>
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

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
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
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
