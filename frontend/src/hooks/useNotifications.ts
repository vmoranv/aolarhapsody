import { useCallback, useState } from 'react';
import type { NotificationItem } from '../components/NotificationDropdown';

/**
 * @description 自定义 Hook，用于管理通知状态
 * @returns {{
 *   notifications: NotificationItem[],
 *   addNotification: (type: NotificationItem['type'], title: string, message: string) => string,
 *   markAsRead: (id: string) => void,
 *   markAllAsRead: () => void,
 *   removeNotification: (id: string) => void,
 *   clearAll: () => void,
 *   success: (title: string, message: string) => string,
 *   error: (title: string, message: string) => string,
 *   warning: (title: string, message: string) => string,
 *   info: (title: string, message: string) => string
 * }} 通知管理对象
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  /**
   * @description 添加一条新通知
   * @param {NotificationItem['type']} type - 通知类型
   * @param {string} title - 通知标题
   * @param {string} message - 通知消息
   * @returns {string} 新通知的 ID
   */
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

  /**
   * @description 将指定 ID 的通知标记为已读
   * @param {string} id - 通知 ID
   */
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  /**
   * @description 将所有通知标记为已读
   */
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
  }, []);

  /**
   * @description 移除指定 ID 的通知
   * @param {string} id - 通知 ID
   */
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  /**
   * @description 清空所有通知
   */
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  /**
   * @description 添加一条成功类型的通知
   * @param {string} title - 标题
   * @param {string} message - 消息
   * @returns {string} 通知 ID
   */
  const success = useCallback(
    (title: string, message: string) => {
      return addNotification('success', title, message);
    },
    [addNotification]
  );

  /**
   * @description 添加一条错误类型的通知
   * @param {string} title - 标题
   * @param {string} message - 消息
   * @returns {string} 通知 ID
   */
  const error = useCallback(
    (title: string, message: string) => {
      return addNotification('error', title, message);
    },
    [addNotification]
  );

  /**
   * @description 添加一条警告类型的通知
   * @param {string} title - 标题
   * @param {string} message - 消息
   * @returns {string} 通知 ID
   */
  const warning = useCallback(
    (title: string, message: string) => {
      return addNotification('warning', title, message);
    },
    [addNotification]
  );

  /**
   * @description 添加一条信息类型的通知
   * @param {string} title - 标题
   * @param {string} message - 消息
   * @returns {string} 通知 ID
   */
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
