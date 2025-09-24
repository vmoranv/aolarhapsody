import React from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationContext } from './NotificationContextValue';

/**
 * @description 通知上下文的提供者组件
 * @param {{ children: React.ReactNode }} props - 组件 props
 * @property {React.ReactNode} children - 子组件
 * @returns {React.ReactElement} - 渲染的组件
 */
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notifications = useNotifications();

  return (
    <NotificationContext.Provider value={notifications}>{children}</NotificationContext.Provider>
  );
};
