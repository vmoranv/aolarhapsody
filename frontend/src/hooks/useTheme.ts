import { createContext, useContext } from 'react';
import type { ThemeContextType } from '../theme/ThemeContext';

/**
 * @description 主题上下文
 */
export const ThemeContext = createContext<ThemeContextType | null>(null);

/**
 * @description 用于在组件中使用主题上下文的自定义 Hook
 * @returns {ThemeContextType} - 主题上下文
 * @throws {Error} - 如果在 ThemeProvider 外部使用，则抛出错误
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
