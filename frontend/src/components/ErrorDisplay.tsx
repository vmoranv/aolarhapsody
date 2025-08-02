import { Button, Result } from 'antd';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import React from 'react';

/**
 * 错误显示组件的属性
 */
interface ErrorDisplayProps {
  error: string; // 要显示的错误信息
  onRetry?: () => void; // 点击重试按钮时的回调函数
}

/**
 * 错误显示组件
 * 用于在数据加载失败时向用户展示错误信息，并提供重试选项。
 * @param error - 要显示的错误信息。
 * @param onRetry - 点击重试按钮时触发的回调函数。
 */
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Result
        icon={<AlertCircle size={64} color="#ff4d4f" />}
        title="加载失败"
        subTitle={error}
        extra={
          onRetry && (
            <Button
              type="primary"
              onClick={onRetry}
              icon={<RefreshCw size={16} />}
              style={{
                borderRadius: 8,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              重试
            </Button>
          )
        }
      />
    </motion.div>
  );
};

export default ErrorDisplay;
