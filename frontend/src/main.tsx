/**
 * @file 应用程序的主入口点。
 * @description
 * 该文件负责初始化整个 React 应用程序。它执行以下关键任务：
 * 1. 初始化主题系统以防止内容闪烁 (FOUC)。
 * 2. 配置并提供 React Query 客户端用于数据获取和缓存。
 * 3. 设置全局上下文提供者 (Providers)，包括主题、React Query 和 Ant Design。
 * 4. 将根组件 `App` 渲染到 DOM 中。
 * 5. 导入全局 CSS 样式和国际化 (i18n) 配置。
 * @module main
 */

// --- Suppress specific console warnings ---
/**
 * @description 覆盖原始的 `console.warn` 方法，以过滤掉由某些库（如 Ant Design）
 * 在特定浏览器模式下产生的、与 `-ms-high-contrast` 相关的无害警告，保持开发控制台的整洁。
 */
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  if (typeof args[0] === 'string' && args[0].includes('-ms-high-contrast')) {
    return;
  }
  originalWarn.apply(console, args);
};

import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntdApp } from 'antd';
import { ThemeProvider } from './theme/ThemeContext';
import { themePrerender } from './utils/themePrerender';
import App from './App';
import './theme/palette.css';
import './index.css';
import './i18n';

/**
 * @description 调用主题预渲染脚本，在 React 应用挂载前应用初始主题，防止主题闪烁。
 */
themePrerender.warmup();

/**
 * @description 创建并配置 React Query 客户端实例。
 * @property {object} defaultOptions - 查询的全局默认选项。
 * @property {number} staleTime - 数据在被视为“陈旧”之前保持新鲜的时间（毫秒）。
 * @property {number} retry - 查询失败时的自动重试次数。
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 分钟
      retry: 1,
    },
  },
});

/**
 * @description 初始化 React 应用程序的根节点，并渲染整个组件树。
 * 组件树被多个上下文提供者包裹，以便在整个应用中共享状态和功能。
 */
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 提供主题切换和颜色变量 */}
    <ThemeProvider>
      {/* 提供 React Query 的数据获取和缓存能力 */}
      <QueryClientProvider client={queryClient}>
        {/* Ant Design 的顶层 App 组件，用于支持 message, notification 等静态方法 */}
        <AntdApp>
          <App />
        </AntdApp>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);
