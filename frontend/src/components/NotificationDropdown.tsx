import { Badge, Button, Dropdown, Empty, List, Space, Typography } from 'antd';
import { motion } from 'framer-motion';
import { Bell, Check, X } from 'lucide-react';
import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';

const { Text } = Typography;

export interface NotificationItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationDropdownProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onRemove,
  onClearAll,
}) => {
  const [open, setOpen] = useState(false);
  const { colors } = useTheme()!;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeColor = (type: NotificationItem['type']) => {
    switch (type) {
      case 'success':
        return '#52c41a';
      case 'error':
        return '#ff4d4f';
      case 'warning':
        return '#faad14';
      case 'info':
        return '#1890ff';
      default:
        return colors.textSecondary;
    }
  };

  const getTypeIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '•';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) {
      return '刚刚';
    }
    if (minutes < 60) {
      return `${minutes}分钟前`;
    }
    if (hours < 24) {
      return `${hours}小时前`;
    }
    return `${days}天前`;
  };

  const dropdownContent = (
    <div
      style={{
        width: 360,
        maxHeight: 480,
        background: colors.surface,
        borderRadius: 8,
        boxShadow: `0 4px 12px ${colors.shadow}`,
        border: `1px solid ${colors.borderSecondary}`,
      }}
    >
      {/* 头部 */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: `1px solid ${colors.borderSecondary}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text strong style={{ fontSize: '16px', color: colors.text }}>
          通知 {unreadCount > 0 && `(${unreadCount})`}
        </Text>
        <Space size={8}>
          {unreadCount > 0 && (
            <Button
              type="text"
              size="small"
              onClick={onMarkAllAsRead}
              style={{ fontSize: '12px', color: colors.primary }}
            >
              全部已读
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              type="text"
              size="small"
              onClick={onClearAll}
              style={{ fontSize: '12px', color: colors.textSecondary }}
            >
              清空全部
            </Button>
          )}
        </Space>
      </div>

      {/* 通知列表 */}
      <div style={{ maxHeight: 400, overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无通知"
            style={{ padding: '40px 20px' }}
          />
        ) : (
          <List
            dataSource={notifications}
            renderItem={(item) => (
              <List.Item
                style={{
                  padding: '12px 16px',
                  borderBottom: `1px solid ${colors.borderSecondary}`,
                  background: item.read ? 'transparent' : `${colors.primary}08`,
                  cursor: 'pointer',
                }}
                onClick={() => !item.read && onMarkAsRead(item.id)}
              >
                <div style={{ width: '100%' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 4,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                      <span
                        style={{
                          color: getTypeColor(item.type),
                          fontSize: '14px',
                          fontWeight: 'bold',
                        }}
                      >
                        {getTypeIcon(item.type)}
                      </span>
                      <Text
                        strong={!item.read}
                        style={{
                          fontSize: '14px',
                          color: colors.text,
                          opacity: item.read ? 0.7 : 1,
                        }}
                      >
                        {item.title}
                      </Text>
                      {!item.read && (
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: colors.primary,
                          }}
                        />
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {!item.read && (
                        <Button
                          type="text"
                          size="small"
                          icon={<Check size={12} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            onMarkAsRead(item.id);
                          }}
                          style={{ padding: '2px 4px', minWidth: 'auto' }}
                        />
                      )}
                      <Button
                        type="text"
                        size="small"
                        icon={<X size={12} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove(item.id);
                        }}
                        style={{ padding: '2px 4px', minWidth: 'auto' }}
                      />
                    </div>
                  </div>
                  <Text
                    style={{
                      fontSize: '13px',
                      color: colors.textSecondary,
                      display: 'block',
                      marginBottom: 4,
                      opacity: item.read ? 0.6 : 1,
                    }}
                  >
                    {item.message}
                  </Text>
                  <Text
                    style={{
                      fontSize: '12px',
                      color: colors.textSecondary,
                      opacity: 0.6,
                    }}
                  >
                    {formatTime(item.timestamp)}
                  </Text>
                </div>
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      popupRender={() => dropdownContent}
      placement="bottomRight"
      trigger={['click']}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          cursor: 'pointer',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 36,
          height: 36,
        }}
      >
        <Badge
          count={unreadCount}
          size="small"
          offset={[4, -4]}
          styles={{
            indicator: {
              backgroundColor: '#ff4d4f',
              color: '#fff',
              border: `2px solid ${colors.surface}`,
              boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
              fontSize: '10px',
              minWidth: '16px',
              height: '16px',
              lineHeight: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
            },
          }}
        >
          <Bell
            size={20}
            color={colors.textSecondary}
            style={{
              transition: 'color 0.2s',
            }}
          />
        </Badge>
      </motion.div>
    </Dropdown>
  );
};

export default NotificationDropdown;
