import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContextValue';

/**
 * @description 用于在组件中使用通知上下文的自定义 Hook
 * @returns {object} - 通知上下文
 * @throws {Error} - 如果在 NotificationProvider 外部使用，则抛出错误
 */
export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};
