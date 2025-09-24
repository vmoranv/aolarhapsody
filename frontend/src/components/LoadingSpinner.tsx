import React from 'react';
import { Spin } from 'antd';
import { motion } from 'framer-motion';

/**
 * @description LoadingSpinner 组件的 props 接口
 * @interface LoadingSpinnerProps
 * @property {string} [text] - 加载文本
 * @property {'small' | 'default' | 'large'} [size] - 加载指示器的大小
 */
interface LoadingSpinnerProps {
  text?: string;
  size?: 'small' | 'default' | 'large';
}

/**
 * @description 加载指示器组件
 * @param {LoadingSpinnerProps} props - 组件 props
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text = '正在加载...',
  size = 'large',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        gap: '16px',
      }}
    >
      <Spin size={size} />
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          color: '#666',
          fontSize: '16px',
          margin: 0,
        }}
      >
        {text}
      </motion.p>
    </motion.div>
  );
};

export default LoadingSpinner;
