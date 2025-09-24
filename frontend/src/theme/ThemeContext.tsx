import React, { useCallback, useEffect, useState } from 'react';
import { ThemeContext } from '../hooks/useTheme';
import { themePrerender } from '../utils/themePrerender';
import { darkTheme, lightTheme, type ThemeColors, transitionColors } from './colors';
import './LoadingMask.css';

/**
 * @file 全局主题管理组件 (ThemeProvider)
 * @description 该文件提供了 `ThemeProvider` 组件，用于管理整个应用的亮色/暗色主题。
 * 它通过 React Context 将主题状态和切换函数提供给所有子组件，并实现了高性能、
 * 平滑的主题切换动画，优先使用 View Transitions API，并为不支持的浏览器提供 CSS 动画降级方案。
 * @module theme/ThemeContext
 */

/**
 * @typedef {'light' | 'dark'} Theme
 * @description 定义了应用支持的主题类型。
 */
export type Theme = 'light' | 'dark';

/**
 * @interface ThemeContextType
 * @description 定义了通过 `ThemeContext` 提供的上下文对象结构。
 */
export interface ThemeContextType {
  /** @property {Theme} theme - 当前激活的主题 ('light' 或 'dark')。 */
  theme: Theme;
  /** @property {ThemeColors} colors - 与当前主题对应的颜色对象。 */
  colors: ThemeColors;
  /** @property {() => void} toggleTheme - 切换亮色/暗色主题的函数。 */
  toggleTheme: () => void;
  /** @property {(theme: Theme) => void} setTheme - 直接设置特定主题的函数。 */
  setTheme: (theme: Theme) => void;
}

/**
 * @interface ThemeProviderProps
 * @description `ThemeProvider` 组件的 Props 类型定义。
 */
interface ThemeProviderProps {
  /** @property {React.ReactNode} children - 需要被 `ThemeProvider` 包裹的子组件。 */
  children: React.ReactNode;
}

/**
 * `ThemeProvider` 是一个 React 组件，它为整个应用程序提供主题管理能力。
 *
 * @param {ThemeProviderProps} props - 组件的 props。
 * @returns {React.ReactElement} `ThemeContext.Provider` 包裹的子组件。
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  /**
   * 从 localStorage 同步获取初始主题，以避免首次渲染时的闪烁。
   * @returns {Theme} 初始主题。
   */
  const getInitialTheme = (): Theme => {
    if (typeof window === 'undefined') {
      return 'dark'; // SSR 或构建时默认为深色
    }
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';
  };

  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const colors = theme === 'dark' ? darkTheme : lightTheme;

  /**
   * 将指定主题的样式应用到 DOM，并通知全局。
   * 此函数利用预渲染脚本来快速应用基础样式，减少闪烁。
   * @param {Theme} newTheme - 要应用的新主题。
   */
  const applyTheme = useCallback((newTheme: Theme) => {
    themePrerender.applyPrerenderedTheme(newTheme);
    const themeColors = newTheme === 'dark' ? darkTheme : lightTheme;
    // 派发全局事件，以便非 React 部分也能响应主题变化
    window.dispatchEvent(
      new CustomEvent('themeChange', {
        detail: { theme: newTheme, colors: themeColors },
      })
    );
  }, []);

  // 监听主题状态变化，并在变化时应用新主题
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  /**
   * 直接设置新主题。
   * @param {Theme} newTheme - 要设置的新主题。
   */
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  /**
   * 切换当前主题，并触发一个平滑的过渡动画。
   * 优先使用 View Transitions API，否则回退到 CSS 动画遮罩。
   */
  const toggleTheme = useCallback(() => {
    const newTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    const intermediateColor =
      theme === 'dark' ? transitionColors.darkToLight : transitionColors.lightToDark;

    /**
     * 创建并显示一个全屏的 CSS 渐变动画遮罩。
     * @returns {HTMLElement} 创建的遮罩元素。
     */
    const showLoadingMask = (): HTMLElement => {
      const mask = document.createElement('div');
      const fromColor = theme === 'dark' ? darkTheme.background : lightTheme.background;
      const toColor = newTheme === 'dark' ? darkTheme.background : lightTheme.background;
      mask.style.setProperty('--mask-from-color', fromColor);
      mask.style.setProperty('--mask-intermediate-color', intermediateColor);
      mask.style.setProperty('--mask-to-color', toColor);
      mask.className = 'loading-mask show';
      document.body.appendChild(mask);
      return mask;
    };

    /**
     * 隐藏并移除遮罩元素。
     * @param {HTMLElement} mask - 要隐藏的遮罩元素。
     */
    const hideLoadingMask = (mask: HTMLElement) => {
      mask.classList.remove('show');
      mask.classList.add('hide');
      mask.addEventListener('animationend', () => mask.remove(), { once: true });
    };

    const mask = showLoadingMask();

    /**
     * 在遮罩动画结束后，开始页面内容的渲染和过渡。
     */
    const startPageRender = () => {
      if (document.startViewTransition) {
        // 使用 View Transitions API 实现平滑过渡
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
          setTimeout(() => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
          }, 500); // 动画完成后恢复滚动条
        });
      } else {
        // 不支持 View Transitions 时的降级方案
        setThemeState(newTheme);
        setTimeout(() => hideLoadingMask(mask), 50);
      }
    };

    // 确保在遮罩入场动画完成后再开始切换内容
    mask.addEventListener('animationend', startPageRender, { once: true });
  }, [theme]);

  // 构造要通过 Context 传递的值
  const value: ThemeContextType = {
    theme,
    colors,
    toggleTheme,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
