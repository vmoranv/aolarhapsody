import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

/**
 * @file ThemeToggle.tsx
 * @description
 * 一个用于在亮色和暗色主题之间切换的按钮组件。
 * 它使用 `framer-motion` 库为主题图标的切换提供平滑的动画效果。
 */

/**
 * 主题切换按钮组件。
 * 点击时会调用 `useTheme` hook 提供的 `toggleTheme` 函数来改变全局主题。
 * 图标（太阳/月亮）的切换伴随着旋转和淡入淡出的动画。
 * @returns {React.ReactElement} 渲染的主题切换按钮。
 */
const ThemeToggle: React.FC = React.memo(() => {
  const { theme, colors, toggleTheme } = useTheme()!;

  /**
   * 定义了 framer-motion 使用的动画变体，
   * 用于图标的进入、显示和退出动画。
   */
  const iconVariants = {
    hidden: { opacity: 0, rotate: -90, scale: 0.8 },
    visible: { opacity: 1, rotate: 0, scale: 1 },
    exit: { opacity: 0, rotate: 90, scale: 0.8 },
  };

  // 使用 div 替代 antd Button，并手动控制样式和层级，以解决 framer-motion 创建新堆叠上下文导致的问题
  return (
    <div
      onClick={toggleTheme}
      role="button"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      style={{
        width: 40,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        position: 'relative', // 创建堆叠上下文的基准
        zIndex: 1, // 确保其层级不会异常高于其他导航栏元素
      }}
      className="theme-toggle-btn"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          variants={iconVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2 }}
          style={{
            // 将 transform 动画放在这里
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1) rotate(15deg)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1) rotate(0deg)')}
        >
          {theme === 'light' ? (
            <Sun size={24} color={colors.textSecondary} />
          ) : (
            <Moon size={24} color={colors.textSecondary} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

export default React.memo(ThemeToggle);
