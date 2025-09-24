import React from 'react';
import { Card, Tag, Tooltip } from 'antd';
import { motion } from 'framer-motion';
import { Star, Zap } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

/**
 * 属性卡片组件的属性
 */
interface AttributeCardProps {
  attribute: {
    id: number; // 属性ID
    name: string; // 属性名称
    isSuper: boolean; // 是否为超系
  };
  imageUrl: string; // 属性图片URL
  index: number; // 在列表中的索引，用于动画
}

/**
 * 属性卡片组件
 * 用于展示单个属性的信息，包括名称、图片和是否为超系。
 * 组件包含动画效果和主题适配功能。
 * @param attribute - 属性数据对象，包含ID、名称和是否为超系的标识
 * @param imageUrl - 属性的图片URL
 * @param index - 卡片在列表中的索引，用于实现交错动画效果
 */
const AttributeCard: React.FC<AttributeCardProps> = ({ attribute, imageUrl, index }) => {
  // 获取当前主题颜色配置
  const { colors } = useTheme()!;

  // 根据主题调整超系的颜色配置
  const superBorderColor = colors.warning;
  // 超系背景渐变色
  const superBgGradient = attribute.isSuper
    ? 'linear-gradient(135deg, #fff9e6 0%, #fff2cc 100%)'
    : undefined;
  // 超系封面渐变色
  const superCoverGradient = attribute.isSuper
    ? 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)'
    : `linear-gradient(135deg, ${colors.fillSecondary} 0%, ${colors.fillTertiary} 100%)`;

  return (
    // Motion动画容器，实现进入和悬停动画效果
    <motion.div
      initial={{ opacity: 0, y: 20 }} // 初始状态：透明且向下偏移
      animate={{ opacity: 1, y: 0 }} // 动画结束状态：不透明且位置正常
      transition={{
        duration: 0.4, // 动画持续时间
        delay: index * 0.05, // 延迟时间，实现交错动画效果
        ease: 'easeOut', // 缓动函数
      }}
      whileHover={{
        y: -8, // 悬停时向上偏移
        transition: { duration: 0.2 }, // 悬停动画持续时间
      }}
    >
      {/* Ant Design卡片组件 */}
      <Card
        hoverable // 启用悬停效果
        style={{
          borderRadius: 12, // 圆角
          overflow: 'hidden', // 隐藏溢出内容
          border: attribute.isSuper
            ? `2px solid ${superBorderColor}` // 超系边框样式
            : `1px solid ${colors.borderSecondary}`, // 普通边框样式
          background: superBgGradient || colors.surface, // 背景渐变色
          boxShadow: `0 2px 8px ${colors.shadow}`, // 阴影效果
          transition: 'all 0.3s ease', // 过渡动画
        }}
        styles={{
          body: {
            padding: '16px', // 内边距
            display: 'flex', // 弹性布局
            flexDirection: 'column', // 垂直排列
            alignItems: 'center', // 水平居中
            gap: '12px', // 间距
            background: superBgGradient || colors.surface, // 背景色
          },
        }}
        // 卡片封面部分
        cover={
          <div
            style={{
              height: 80, // 高度
              display: 'flex', // 弹性布局
              alignItems: 'center', // 垂直居中
              justifyContent: 'center', // 水平居中
              background: superCoverGradient, // 背景渐变色
              position: 'relative', // 相对定位
            }}
          >
            {/* 属性图片 */}
            <motion.img
              src={imageUrl} // 图片源
              alt={attribute.name} // 替代文本
              style={{
                width: 48, // 宽度
                height: 48, // 高度
                objectFit: 'contain', // 保持图片比例
              }}
              whileHover={{ scale: 1.1 }} // 悬停时放大
              transition={{ duration: 0.2 }} // 悬停动画持续时间
              // 图片加载失败时的处理
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0iI0Y1RjVGNSIvPgo8cGF0aCBkPSJNMjQgMTZDMjAuNjg2MyAxNiAxOCAxOC42ODYzIDE4IDIyQzE4IDI1LjMxMzcgMjAuNjg2MyAyOCAyNCAyOEMyNy4zMTM3IDI4IDMwIDI1LjMxMzcgMzAgMjJDMzAgMTguNjg2MyAyNy4zMTM3IDE2IDI0IDE2WiIgZmlsbD0iI0Q5RDlEOSIvPgo8L3N2Zz4K';
              }}
            />
            {/* 超系标识星标 */}
            {attribute.isSuper && (
              <motion.div
                initial={{ scale: 0 }} // 初始状态：缩放为0
                animate={{ scale: 1 }} // 动画结束状态：正常缩放
                transition={{ delay: 0.3, type: 'spring' }} // 动画配置
                style={{
                  position: 'absolute', // 绝对定位
                  top: 8, // 距离顶部
                  right: 8, // 距离右侧
                }}
              >
                <Star size={16} fill="#ffd700" color="#ffd700" /> // 金色星标图标
              </motion.div>
            )}
          </div>
        }
      >
        {/* 卡片内容部分 */}
        <div style={{ textAlign: 'center', width: '100%' }}>
          {/* 属性名称，带工具提示显示ID */}
          <Tooltip title={`属性ID: ${attribute.id}`}>
            <h4
              style={{
                margin: 0, // 外边距
                fontSize: '16px', // 字体大小
                fontWeight: 600, // 字体粗细
                color: attribute.isSuper ? colors.warning : colors.text, // 颜色（超系使用警告色）
              }}
            >
              {attribute.name}
            </h4>
          </Tooltip>

          {/* 属性标签 */}
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center', gap: 4 }}>
            <Tag
              color={attribute.isSuper ? 'gold' : 'blue'} // 标签颜色（超系为金色，普通为蓝色）
              style={{
                borderRadius: 12, // 圆角
                fontSize: '12px', // 字体大小
                display: 'flex', // 弹性布局
                alignItems: 'center', // 垂直居中
                gap: 4, // 间距
              }}
            >
              {attribute.isSuper && <Zap size={12} />} // 超系时显示闪电图标
              {attribute.isSuper ? '超系' : '原系'} // 标签文本
            </Tag>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default AttributeCard;
