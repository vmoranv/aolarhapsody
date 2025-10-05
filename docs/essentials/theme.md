# 主题

::: tip 说明

项目支持亮色和暗色主题,并提供了灵活的主题定制能力.

:::

## 主题系统架构

项目采用基于 CSS 变量的主题系统,支持动态切换和自定义主题.

### 主题配置结构

```ts
// frontend/src/theme/types.ts
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  textDisabled: string;
  border: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

export interface ThemeConfig {
  colors: ThemeColors;
  fontFamily: string;
  borderRadius: string;
  boxShadow: string;
}
```

### 主题上下文

```tsx
// frontend/src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ThemeColors, ThemeConfig } from '@/theme/types';

interface ThemeContextType {
  theme: 'light' | 'dark';
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [colors, setColors] = useState<ThemeColors>(darkTheme);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      setColors(savedTheme === 'light' ? lightTheme : darkTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setColors(newTheme === 'light' ? lightTheme : darkTheme);
    localStorage.setItem('theme', newTheme);
  };

  const setThemeMode = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    setColors(newTheme === 'light' ? lightTheme : darkTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, setTheme: setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

## 默认主题

### 暗色主题

```ts
// frontend/src/theme/dark.ts
export const darkTheme: ThemeColors = {
  primary: '#1677ff',
  secondary: '#93c5fd',
  background: '#0d1117',
  surface: '#161b22',
  text: '#f5f7fa',
  textSecondary: '#c9d1d9',
  textDisabled: '#6e7681',
  border: '#30363d',
  error: '#ff4d4f',
  warning: '#faad14',
  success: '#52c41a',
  info: '#1890ff',
};
```

### 亮色主题

```ts
// frontend/src/theme/light.ts
export const lightTheme: ThemeColors = {
  primary: '#1677ff',
  secondary: '#69b1ff',
  background: '#f5f7fa',
  surface: '#ffffff',
  text: '#1d1d1f',
  textSecondary: '#6e6e73',
  textDisabled: '#d2d2d7',
  border: '#d0d5dc',
  error: '#ff4d4f',
  warning: '#faad14',
  success: '#52c41a',
  info: '#1890ff',
};
```

## 主题切换

### 使用主题 Hook

```tsx
// frontend/src/hooks/useTheme.ts
import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

### 在组件中使用

```tsx
// frontend/src/components/ThemeToggle.tsx
import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label={theme === 'light' ? '切换到暗色主题' : '切换到亮色主题'}
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};

export default ThemeToggle;
```

## CSS 变量集成

### 根样式文件

```css
/* frontend/src/index.css */
:root {
  --theme-primary: #1677ff;
  --theme-secondary: #93c5fd;
  --theme-background: #0d1117;
  --theme-surface: #161b22;
  --theme-text: #f5f7fa;
  --theme-text-secondary: #c9d1d9;
  --theme-text-disabled: #6e7681;
  --theme-border: #30363d;
  --theme-error: #ff4d4f;
  --theme-warning: #faad14;
  --theme-success: #52c41a;
  --theme-info: #1890ff;
}

body.light-theme {
  --theme-background: #f5f7fa;
  --theme-surface: #ffffff;
  --theme-text: #1d1d1f;
  --theme-text-secondary: #6e6e73;
  --theme-text-disabled: #d2d2d7;
  --theme-border: #d0d5dc;
}

body {
  background-color: var(--theme-background);
  color: var(--theme-text);
  transition:
    background-color 0.3s,
    color 0.3s;
}
```

### 在组件中使用 CSS 变量

```tsx
// frontend/src/components/Card.tsx
import React from 'react';

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      className="rounded-lg p-6 shadow-md transition-all duration-300"
      style={{
        backgroundColor: 'var(--theme-surface)',
        border: '1px solid var(--theme-border)',
        color: 'var(--theme-text)',
      }}
    >
      {children}
    </div>
  );
};

export default Card;
```

## 自定义主题

### 创建自定义主题

```ts
// frontend/src/theme/custom.ts
import type { ThemeColors } from '@/theme/types';

export const customTheme: ThemeColors = {
  primary: '#8e44ad',
  secondary: '#9b59b6',
  background: '#ecf0f1',
  surface: '#ffffff',
  text: '#2c3e50',
  textSecondary: '#7f8c8d',
  textDisabled: '#bdc3c7',
  border: '#bdc3c7',
  error: '#e74c3c',
  warning: '#f39c12',
  success: '#27ae60',
  info: '#3498db',
};
```

### 应用自定义主题

```tsx
// frontend/src/theme/ThemeContext.tsx
// ... 在主题切换逻辑中添加自定义主题支持

const setCustomTheme = (customColors: ThemeColors) => {
  setColors(customColors);
  // 应用自定义颜色到 CSS 变量
  Object.entries(customColors).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--theme-${key}`, value);
  });
};
```

## 主题与 Ant Design 集成

### 动态主题配置

```tsx
// frontend/src/components/AntdConfigProvider.tsx
import React from 'react';
import { ConfigProvider } from 'antd';
import { useTheme } from '@/hooks/useTheme';

const AntdConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, colors } = useTheme();

  const antdTheme = {
    token: {
      colorPrimary: colors.primary,
      colorSuccess: colors.success,
      colorWarning: colors.warning,
      colorError: colors.error,
      colorInfo: colors.info,
      colorTextBase: colors.text,
      colorBgBase: colors.surface,
    },
    components: {
      Button: {
        colorPrimary: colors.primary,
        colorPrimaryHover: colors.secondary,
      },
    },
  };

  return (
    <ConfigProvider theme={antdTheme} componentSize="middle">
      {children}
    </ConfigProvider>
  );
};

export default AntdConfigProvider;
```
