import { createContext } from 'react';
import type { NotificationItem } from '../components/NotificationDropdown';

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
