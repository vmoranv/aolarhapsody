import React, { useCallback, useEffect, useState } from 'react';
import { ThemeContext } from '../hooks/useTheme';
import { themePrerender } from '../utils/themePrerender';
import { darkTheme, lightTheme, type ThemeColors, transitionColors } from './colors';
import './LoadingMask.css';

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // 立即从 localStorage 读取主题
  const getInitialTheme = (): Theme => {
    if (typeof window === 'undefined') {
      return 'light';
    }

    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const colors = theme === 'dark' ? darkTheme : lightTheme;

  // 应用主题到 DOM - 使用预渲染优化
  const applyTheme = useCallback((newTheme: Theme) => {
    // 使用预渲染的快速应用方法
    themePrerender.applyPrerenderedTheme(newTheme);

    const themeColors = newTheme === 'dark' ? darkTheme : lightTheme;

    // 触发自定义事件，通知其他组件
    window.dispatchEvent(
      new CustomEvent('themeChange', {
        detail: { theme: newTheme, colors: themeColors },
      })
    );
  }, []);

  // 初始化和主题变化时应用主题
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme: Theme = theme === 'dark' ? 'light' : 'dark';

    const intermediateColor =
      theme === 'dark' ? transitionColors.darkToLight : transitionColors.lightToDark;

    const showLoadingMask = () => {
      console.log('遮罩开始进入');
      const mask = document.createElement('div');

      // 设置颜色渐变的起始、中间和结束颜色
      const fromColor = theme === 'dark' ? darkTheme.background : lightTheme.background;
      const toColor = newTheme === 'dark' ? darkTheme.background : lightTheme.background;
      mask.style.setProperty('--mask-from-color', fromColor);
      mask.style.setProperty('--mask-intermediate-color', intermediateColor);
      mask.style.setProperty('--mask-to-color', toColor);

      mask.className = 'loading-mask show';

      document.body.appendChild(mask);
      return mask;
    };

    const hideLoadingMask = (mask: HTMLElement) => {
      console.log('遮罩开始离开');
      mask.classList.remove('show');
      mask.classList.add('hide');
      mask.addEventListener(
        'animationend',
        () => {
          mask.remove();
        },
        { once: true }
      );
    };

    const mask = showLoadingMask();

    const startPageRender = () => {
      console.log('底层渲染开始');
      // 如果浏览器支持 View Transition API，使用动画切换
      if (document.startViewTransition) {
        // 最终方案：在视图过渡前后，通过 JS 精确控制布局，防止抖动
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = 'hidden';
        if (scrollbarWidth > 0) {
          document.body.style.paddingRight = `${scrollbarWidth}px`;
        }

        const transition = document.startViewTransition(() => {
          setThemeState(newTheme);
        });

        transition.finished.finally(() => {
          hideLoadingMask(mask);
          // 确保在所有动画结束后恢复
          setTimeout(() => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
          }, 500); // 留出足够的时间让 hideLoadingMask 动画完成
        });
      } else {
        // Fallback for browsers without View Transition API
        setThemeState(newTheme);
        setTimeout(() => hideLoadingMask(mask), 50); // 确保有时间渲染
      }
    };

    // 监听遮罩进入动画的结束事件，然后才开始渲染
    mask.addEventListener('animationend', startPageRender, { once: true });
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    colors,
    toggleTheme,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
