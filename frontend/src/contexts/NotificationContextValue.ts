import { createContext } from 'react';
import type { NotificationItem } from '../components/NotificationDropdown';

/**
 * @description 通知上下文的类型定义
 * @interface NotificationContextType
 * @property {NotificationItem[]} notifications - 通知列表
 * @property {(type: NotificationItem['type'], title: string, message: string) => string} addNotification - 添加通知
 * @property {(id: string) => void} markAsRead - 标记为已读
 * @property {() => void} markAllAsRead - 全部标记为已读
 * @property {(id: string) => void} removeNotification - 删除通知
 * @property {() => void} clearAll - 清空通知
 * @property {(title: string, message: string) => string} success - 发送成功通知
 * @property {(title: string, message: string) => string} error - 发送错误通知
 * @property {(title: string, message: string) => string} warning - 发送警告通知
 * @property {(title: string, message: string) => string} info - 发送信息通知
 */
interface NotificationContextType {
  notifications: NotificationItem[];
  addNotification: (type: NotificationItem['type'], title: string, message: string) => string;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  success: (title: string, message: string) => string;
  error: (title: string, message: string) => string;
  warning: (title: string, message: string) => string;
  info: (title: string, message: string) => string;
}

export const NotificationContext = createContext<NotificationContextType | null>(null);
