import React from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationContext } from './NotificationContextValue';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notifications = useNotifications();

  return (
    <NotificationContext.Provider value={notifications}>{children}</NotificationContext.Provider>
  );
};
