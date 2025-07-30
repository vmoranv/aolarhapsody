// 统一的主题调色盘
export const lightTheme = {
  // 主色调
  primary: '#667eea',
  secondary: '#764ba2',

  // 背景色
  background: '#f5f7fa',
  surface: '#ffffff',
  elevated: '#ffffff',

  // 文字色
  text: '#262626',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textDisabled: '#bfbfbf',

  // 边框色
  border: '#d9d9d9',
  borderSecondary: '#f0f0f0',

  // 状态色
  success: '#52c41a',
  warning: '#faad14',
  error: '#ff4d4f',
  info: '#1890ff',

  // 填充色
  fill: '#f5f5f5',
  fillSecondary: '#fafafa',
  fillTertiary: '#f5f5f5',
  fillQuaternary: '#f0f0f0',

  // 阴影
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowSecondary: 'rgba(0, 0, 0, 0.06)',
} as const;

export const darkTheme = {
  // 主色调
  primary: '#58a6ff',
  secondary: '#3ddc84',

  // 背景色
  background: '#0d1117',
  surface: '#161b22',
  elevated: '#21262d',

  // 文字色
  text: '#c9d1d9',
  textSecondary: '#8b949e',
  textTertiary: '#6e7681',
  textDisabled: '#484f58',

  // 边框色
  border: '#30363d',
  borderSecondary: '#21262d',

  // 状态色
  success: '#3fb950',
  warning: '#d29922',
  error: '#f85149',
  info: '#58a6ff',

  // 填充色
  fill: '#21262d',
  fillSecondary: '#30363d',
  fillTertiary: '#21262d',
  fillQuaternary: '#161b22',

  // 阴影
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowSecondary: 'rgba(0, 0, 0, 0.2)',
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
