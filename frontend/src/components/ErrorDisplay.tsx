import { Button, Result } from 'antd';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import React from 'react';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
}

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
