// --- Suppress specific console warnings ---
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  if (typeof args[0] === 'string' && args[0].includes('-ms-high-contrast')) {
    return;
  }
  originalWarn.apply(console, args);
};

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntdApp } from 'antd';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './theme/ThemeContext';
import { themePrerender } from './utils/themePrerender';
import App from './App';
import './theme/palette.css';
import './index.css';
import './i18n';

// 预热主题系统
themePrerender.warmup();
// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Create a root and render the App component
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AntdApp>
          <App />
        </AntdApp>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);
