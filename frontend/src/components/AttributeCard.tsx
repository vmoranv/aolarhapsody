import { Card, Tag, Tooltip } from 'antd';
import { motion } from 'framer-motion';
import { Star, Zap } from 'lucide-react';
import React from 'react';
import { useTheme } from '../hooks/useTheme';

interface AttributeCardProps {
  attribute: {
    id: number;
    name: string;
    isSuper: boolean;
  };
  imageUrl: string;
  index: number;
}

const AttributeCard: React.FC<AttributeCardProps> = ({ attribute, imageUrl, index }) => {
  const { colors } = useTheme()!;

  // 根据主题调整超级属性的颜色
  const superBorderColor = colors.warning;
  const superBgGradient = attribute.isSuper
    ? 'linear-gradient(135deg, #fff9e6 0%, #fff2cc 100%)'
    : undefined;
  const superCoverGradient = attribute.isSuper
    ? 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)'
    : `linear-gradient(135deg, ${colors.fillSecondary} 0%, ${colors.fillTertiary} 100%)`;

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
          borderRadius: 12,
          overflow: 'hidden',
          border: attribute.isSuper
            ? `2px solid ${superBorderColor}`
            : `1px solid ${colors.borderSecondary}`,
          background: superBgGradient || colors.surface,
          boxShadow: `0 2px 8px ${colors.shadow}`,
          transition: 'all 0.3s ease',
        }}
        styles={{
          body: {
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            background: superBgGradient || colors.surface,
          },
        }}
        cover={
          <div
            style={{
              height: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: superCoverGradient,
              position: 'relative',
            }}
          >
            <motion.img
              src={imageUrl}
              alt={attribute.name}
              style={{
                width: 48,
                height: 48,
                objectFit: 'contain',
              }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0iI0Y1RjVGNSIvPgo8cGF0aCBkPSJNMjQgMTZDMjAuNjg2MyAxNiAxOCAxOC42ODYzIDE4IDIyQzE4IDI1LjMxMzcgMjAuNjg2MyAyOCAyNCAyOEMyNy4zMTM3IDI4IDMwIDI1LjMxMzcgMzAgMjJDMzAgMTguNjg2MyAyNy4zMTM3IDE2IDI0IDE2WiIgZmlsbD0iI0Q5RDlEOSIvPgo8L3N2Zz4K';
              }}
            />
            {attribute.isSuper && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                }}
              >
                <Star size={16} fill="#ffd700" color="#ffd700" />
              </motion.div>
            )}
          </div>
        }
      >
        <div style={{ textAlign: 'center', width: '100%' }}>
          <Tooltip title={`属性ID: ${attribute.id}`}>
            <h4
              style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: 600,
                color: attribute.isSuper ? colors.warning : colors.text,
              }}
            >
              {attribute.name}
            </h4>
          </Tooltip>

          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center', gap: 4 }}>
            <Tag
              color={attribute.isSuper ? 'gold' : 'blue'}
              style={{
                borderRadius: 12,
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              {attribute.isSuper && <Zap size={12} />}
              {attribute.isSuper ? '超级属性' : '普通属性'}
            </Tag>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default AttributeCard;
