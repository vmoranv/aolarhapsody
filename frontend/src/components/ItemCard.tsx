import React from 'react';
import { Card, Image, Space, theme, Typography } from 'antd';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useQualityColor } from '../theme/colors';
import { DataItem } from '../types/DataItem';

const { Title, Text } = Typography;

/**
 * ItemCard 组件的 props 接口定义
 *
 * 该组件用于显示单个物品的信息卡片
 * 支持图片、图标、品质等级等多种展示方式
 *
 * @interface ItemCardProps
 * @property {DataItem} item - 要显示的物品数据对象
 * @property {number} index - 物品在列表中的索引，用于动画延迟计算
 * @property {React.ReactNode} [children] - 子组件，显示在卡片底部
 * @property {string} [imageUrl] - 物品图片的 URL 地址
 * @property {React.ReactElement} [icon] - 物品图标元素（当没有图片时显示）
 * @property {React.CSSProperties} [imageStyle] - 物品图片的样式覆盖
 */
interface ItemCardProps {
  item: DataItem;
  index: number;
  children?: React.ReactNode;
  imageUrl?: string;
  icon?: React.ReactElement;
  imageStyle?: React.CSSProperties;
}

/**
 * 物品卡片组件
 *
 * 用于显示单个物品的信息，具有以下特性：
 * 1. 响应式设计，适配不同屏幕尺寸
 * 2. 品质等级颜色边框和背景
 * 3. 动画效果（进入动画和悬停动画）
 * 4. 图片加载失败处理
 * 5. 品质星级显示
 * 6. 名称和ID展示
 *
 * 设计亮点：
 * - 使用 Framer Motion 实现流畅动画
 * - 根据物品品质动态设置颜色主题
 * - 支持图片和图标两种展示模式
 * - 自适应高度设计
 *
 * @param {ItemCardProps} props - 组件 props
 * @returns {React.ReactElement} - 渲染的物品卡片组件
 */
const ItemCard: React.FC<ItemCardProps> = ({
  item,
  index,
  children,
  imageUrl,
  icon,
  imageStyle,
}) => {
  const { token } = theme.useToken();
  const qualityColor = useQualityColor(item.quality);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05, // 根据索引设置动画延迟，创建交错效果
        ease: 'easeOut',
      }}
      whileHover={{
        y: -8, // 悬停时上移8像素
        transition: { duration: 0.2 },
      }}
    >
      <Card
        hoverable
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          border: `2px solid ${qualityColor}`, // 品质颜色边框
          background: `linear-gradient(135deg, ${qualityColor}10 0%, ${qualityColor}05 100%)`, // 浅色渐变背景
          boxShadow: `0 4px 12px ${qualityColor}30`, // 品质颜色阴影
          height: '100%',
        }}
        cover={
          <div
            style={{
              height: 180,
              background: `linear-gradient(135deg, ${qualityColor} 0%, ${qualityColor}dd 100%)`, // 品质颜色渐变背景
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.3 }}>
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={item.name}
                  preview={false}
                  style={{
                    width: 'auto',
                    height: '80%',
                    maxHeight: '100px',
                    objectFit: 'contain',
                    ...imageStyle,
                  }}
                  onError={(e) => {
                    // 图片加载失败时隐藏图片元素
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                icon &&
                React.isValidElement(icon) && (
                  <div style={{ fontSize: 64, color: 'white' }}>{icon}</div>
                )
              )}
            </motion.div>

            {/* 品质星级显示 */}
            {item.quality && item.quality > 0 ? (
              <div style={{ position: 'absolute', top: 10, right: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {Array.from({ length: item.quality }, (_, i) => (
                    <Star key={i} size={12} color="white" fill="white" />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        }
      >
        <Space direction="vertical" size="small" style={{ width: '100%', padding: '0 12px 12px' }}>
          <div style={{ textAlign: 'center' }}>
            <Title
              level={5}
              style={{
                margin: 0,
                color: token.colorText,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={item.name} // 鼠标悬停时显示完整名称
            >
              {item.name}
            </Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              ID: {item.id}
            </Text>
          </div>
          {children}
        </Space>
      </Card>
    </motion.div>
  );
};

export default ItemCard;
