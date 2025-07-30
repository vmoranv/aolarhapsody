import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import React from 'react';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle: React.FC = React.memo(() => {
  const { theme, colors, toggleTheme } = useTheme()!;

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
