import { useTheme } from '../hooks/useTheme';

// 统一的主题调色盘
export const lightTheme = {
  // 主色调
  primary: 'var(--primary-light)',
  secondary: 'var(--secondary-light)',

  // 背景色
  background: 'var(--background-light)',
  surface: 'var(--surface-light)',
  elevated: 'var(--elevated-light)',

  // 文字色
  text: 'var(--text-light)',
  textSecondary: 'var(--text-secondary-light)',
  textTertiary: 'var(--text-tertiary-light)',
  textDisabled: 'var(--text-disabled-light)',

  // 边框色
  border: 'var(--border-light)',
  borderSecondary: 'var(--border-secondary-light)',

  // 状态色
  success: 'var(--success-light)',
  warning: 'var(--warning-light)',
  error: 'var(--error-light)',
  info: 'var(--info-light)',

  // 填充色
  fill: 'var(--fill-light)',
  fillSecondary: 'var(--fill-secondary-light)',
  fillTertiary: 'var(--fill-tertiary-light)',
  fillQuaternary: 'var(--fill-quaternary-light)',

  // 阴影
  shadow: 'var(--shadow-light)',
  shadowSecondary: 'var(--shadow-secondary-light)',
} as const;

export const darkTheme = {
  // 主色调
  primary: 'var(--primary-dark)',
  secondary: 'var(--secondary-dark)',

  // 背景色
  background: 'var(--background-dark)',
  surface: 'var(--surface-dark)',
  elevated: 'var(--elevated-dark)',

  // 文字色
  text: 'var(--text-dark)',
  textSecondary: 'var(--text-secondary-dark)',
  textTertiary: 'var(--text-tertiary-dark)',
  textDisabled: 'var(--text-disabled-dark)',

  // 边框色
  border: 'var(--border-dark)',
  borderSecondary: 'var(--border-secondary-dark)',

  // 状态色
  success: 'var(--success-dark)',
  warning: 'var(--warning-dark)',
  error: 'var(--error-dark)',
  info: 'var(--info-dark)',

  // 填充色
  fill: 'var(--fill-dark)',
  fillSecondary: 'var(--fill-secondary-dark)',
  fillTertiary: 'var(--fill-tertiary-dark)',
  fillQuaternary: 'var(--fill-quaternary-dark)',

  // 阴影
  shadow: 'var(--shadow-dark)',
  shadowSecondary: 'var(--shadow-secondary-dark)',
} as const;

export type ThemeColors = {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  elevated: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  textDisabled: string;
  border: string;
  borderSecondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  fill: string;
  fillSecondary: string;
  fillTertiary: string;
  fillQuaternary: string;
  shadow: string;
  shadowSecondary: string;
};

export const transitionColors = {
  // 从浅色模式切换到深色模式时，中间色为浅蓝紫（参考暗色模式主色）
  lightToDark: '#aed6f1',
  // 从深色模式切换到浅色模式时，中间色为深蓝紫（参考亮色模式主色）
  darkToLight: '#6C3483',
} as const;

// 品质等级颜色映射
export const getQualityColor = (quality: number, isDark = false) => {
  const theme = isDark ? 'dark' : 'light';
  if (quality >= 1 && quality <= 5) {
    return `var(--quality-${quality}-${theme})`;
  }
  return 'var(--surface-light)';
};

import { StatKey } from '../utils/pet-dictionary-helper';

// 属性统计颜色映射
export const getStatColor = (stat: StatKey, isDark = false) => {
  const theme = isDark ? 'dark' : 'light';
  // 将驼峰命名转换为 kebab-case，例如 spAtk -> sp-attack
  const statName = stat.replace(/([A-Z])/g, '-$1').toLowerCase();
  return `var(--stat-${statName}-${theme})`;
};

// 状态颜色映射
export const getStatusColor = (
  status: 'success' | 'warning' | 'error' | 'info',
  isDark = false
) => {
  const theme = isDark ? 'dark' : 'light';
  return `var(--status-${status}-${theme})`;
};

// Hook 版本的颜色获取函数
export const useQualityColor = (quality: number) => {
  const { theme } = useTheme()!;
  return getQualityColor(quality, theme === 'dark');
};

export const useStatColor = (stat: StatKey) => {
  const { theme } = useTheme()!;
  return getStatColor(stat, theme === 'dark');
};

export const useStatusColor = (status: 'success' | 'warning' | 'error' | 'info') => {
  const { theme } = useTheme()!;
  return getStatusColor(status, theme === 'dark');
};
