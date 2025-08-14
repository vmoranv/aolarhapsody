import { Card, Space, theme, Typography } from 'antd';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import React from 'react';
import { useQualityColor } from '../theme/colors';
import { DataItem } from '../types/DataItem';

const { Title, Text } = Typography;

interface ItemCardProps {
  item: DataItem;
  index: number;
  icon?: React.ReactNode;
  imageUrl?: string;
  children?: React.ReactNode;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, index, icon, imageUrl, children }) => {
  const { token } = theme.useToken();
  const qualityColor = useQualityColor(item.quality);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: 'easeOut',
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.2 },
      }}
    >
      <Card
        hoverable
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          border: `2px solid ${qualityColor}`,
          background: `linear-gradient(135deg, ${qualityColor}10 0%, ${qualityColor}05 100%)`,
          boxShadow: `0 4px 12px ${qualityColor}30`,
          height: '100%',
        }}
        cover={
          <div
            style={{
              height: 120,
              background: `linear-gradient(135deg, ${qualityColor} 0%, ${qualityColor}dd 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {imageUrl ? (
              <motion.img
                src={imageUrl}
                alt={item.name}
                style={{
                  width: 'auto',
                  height: '80%',
                  maxHeight: '100px',
                  objectFit: 'contain',
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.3 }}>
                {icon}
              </motion.div>
            )}

            {item.quality && item.quality > 0 && (
              <div style={{ position: 'absolute', top: 10, right: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {Array.from({ length: item.quality }, (_, i) => (
                    <Star key={i} size={12} color="white" fill="white" />
                  ))}
                </div>
              </div>
            )}
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
              title={item.name}
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
