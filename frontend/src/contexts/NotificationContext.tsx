import React, { createContext, useContext } from 'react';
import type { NotificationItem } from '../components/NotificationDropdown';
import { useNotifications } from '../hooks/useNotifications';

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

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notifications = useNotifications();

  return (
    <NotificationContext.Provider value={notifications}>{children}</NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};
