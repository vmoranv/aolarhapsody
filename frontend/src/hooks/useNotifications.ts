import { useCallback,useState } from 'react';
import type { NotificationItem } from '../components/NotificationDropdown';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = useCallback(
    (type: NotificationItem['type'], title: string, message: string) => {
      const newNotification: NotificationItem = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type,
        title,
        message,
        timestamp: new Date(),
        read: false,
      };

      setNotifications((prev) => [newNotification, ...prev]);
      return newNotification.id;
    },
    []
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // 便捷方法
  const success = useCallback(
    (title: string, message: string) => {
      return addNotification('success', title, message);
    },
    [addNotification]
  );

  const error = useCallback(
    (title: string, message: string) => {
      return addNotification('error', title, message);
    },
    [addNotification]
  );

  const warning = useCallback(
    (title: string, message: string) => {
      return addNotification('warning', title, message);
    },
    [addNotification]
  );

  const info = useCallback(
    (title: string, message: string) => {
      return addNotification('info', title, message);
    },
    [addNotification]
  );

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
  };
};
