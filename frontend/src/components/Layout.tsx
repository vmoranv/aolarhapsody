import type { MenuProps } from 'antd';
import { Avatar, Dropdown, Layout as AntLayout, Menu, Space } from 'antd';
import { motion } from 'framer-motion';
import { Bell, Database, Home, Search, Settings, User, Users } from 'lucide-react';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import ThemeToggle from './ThemeToggle';

const { Header, Sider, Content } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { colors } = useTheme()!;

  // 根据当前路径确定选中的菜单项
  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path === '/app') {
      return ['1'];
    }
    if (path === '/app/pets') {
      return ['2-1'];
    }
    return ['1'];
  };

  const getOpenKeys = () => {
    const path = location.pathname;
    if (
      path.startsWith('/app/pets') ||
      path.includes('skills') ||
      path.includes('items') ||
      path.includes('inscription')
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
      label: '数据查询',
      children: [
        {
          key: '2-1',
          label: '亚比图鉴',
        },
        {
          key: '2-2',
          label: '技能数据',
        },
        {
          key: '2-3',
          label: '道具信息',
        },
        {
          key: '2-4',
          label: '铭文系统',
        },
      ],
    },
    {
      key: '3',
      icon: <Users size={18} />,
      label: '社区',
    },
    {
      key: '4',
      icon: <Settings size={18} />,
      label: '设置',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case '1':
        navigate('/app');
        break;
      case '2-1':
        navigate('/app/pets');
        break;
      case '2-2':
        // 技能数据页面 - 暂时导航到首页
        navigate('/app');
        break;
      case '2-3':
        // 道具信息页面 - 暂时导航到首页
        navigate('/app');
        break;
      case '2-4':
        // 铭文系统页面 - 暂时导航到首页
        navigate('/app');
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

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Bell size={20} color={colors.textSecondary} style={{ cursor: 'pointer' }} />
            </motion.div>

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
