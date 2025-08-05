import { useQuery } from '@tanstack/react-query';
import { Card, Empty, Space, Typography } from 'antd';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ErrorDisplay from '../components/ErrorDisplay';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNotificationContext } from '../hooks/useNotificationContext';
import { useTheme } from '../hooks/useTheme';
import {
  damageColors,
  damageDescription,
  getAttributeIconUrl,
  isSuperAttribute,
  parseRelation,
} from '../utils/attribute-helper';
import './Attribute.css';

const { Title } = Typography;

// 属性数据类型定义
interface AttributeInfo {
  id: number;
  name: string;
}

interface AttributeRelations {
  [targetId: string]: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  timestamp: string;
}

// 定义关系类型
type RelationType = 'immune' | 'weak' | 'strong' | 'super' | 'superOrImmune';

// 从工具函数导入，不要重复定义

// 获取属性列表
const fetchAttributes = async (): Promise<AttributeInfo[]> => {
  const response = await fetch('/api/skill-attributes');
  if (!response.ok) {
    throw new Error('获取属性列表失败');
  }
  const result: ApiResponse<AttributeInfo[]> = await response.json();
  if (!result.success) {
    throw new Error('获取属性列表失败');
  }
  return result.data;
};

// 获取特定属性的克制关系
const fetchAttributeRelations = async (id: number): Promise<AttributeRelations> => {
  const response = await fetch(`/api/attribute-relations/${id}`);
  if (!response.ok) {
    throw new Error('获取属性关系失败');
  }
  const result: ApiResponse<AttributeRelations> = await response.json();
  if (!result.success) {
    throw new Error('获取属性关系失败');
  }
  return result.data;
};

const Attribute = () => {
  const [selectedAttribute, setSelectedAttribute] = useState<number | null>(null);
  const [showSuper, setShowSuper] = useState(false);
  const { colors } = useTheme()!;
  const notifications = useNotificationContext();
  const navigate = useNavigate();
  const location = useLocation();

  // 从URL获取属性ID
  const searchParams = new URLSearchParams(location.search);
  const attrIdFromUrl = searchParams.get('attrId');

  // 获取属性列表
  const {
    data: attributes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['attributes'],
    queryFn: fetchAttributes,
  });

  // 获取选中属性的关系数据
  const { data: relations, isLoading: isLoadingRelations } = useQuery({
    queryKey: ['attribute-relations', selectedAttribute],
    queryFn: () => fetchAttributeRelations(selectedAttribute!),
    enabled: !!selectedAttribute,
  });

  // 获取所有属性的关系数据用于计算受击关系
  const { data: allRelations } = useQuery({
    queryKey: ['all-attribute-relations', attributes],
    queryFn: async () => {
      if (!attributes) {
        return;
      }
      const relationPromises = attributes.map((attr) =>
        fetchAttributeRelations(attr.id).then((relations) => ({ id: attr.id, relations }))
      );
      const results = await Promise.all(relationPromises);
      const relationMap: { [key: number]: AttributeRelations } = {};
      results.forEach((result) => {
        relationMap[result.id] = result.relations;
      });
      return relationMap;
    },
    enabled: !!attributes && attributes.length > 0,
  });

  // 处理URL参数和默认选择
  useEffect(() => {
    if (attributes && attrIdFromUrl) {
      const attrId = parseInt(attrIdFromUrl);
      if (!isNaN(attrId)) {
        const attribute = attributes.find((attr) => attr.id === attrId);
        if (attribute) {
          setShowSuper(isSuperAttribute(attribute.id));
          setSelectedAttribute(attrId);
        }
      }
    } else if (attributes && attributes.length > 0) {
      // 默认选择第一个原系属性
      const firstOrigin = attributes.find((attr) => !isSuperAttribute(attr.id));
      if (firstOrigin) {
        setSelectedAttribute(firstOrigin.id);
      }
    }
  }, [attributes, attrIdFromUrl]);

  // 处理错误
  useEffect(() => {
    if (error) {
      notifications.error('数据加载失败', '获取属性数据失败，请稍后重试');
    }
  }, [error, notifications.error]);

  // 处理属性选择
  const handleAttributeSelect = (id: number) => {
    if (id === selectedAttribute) {
      return;
    }

    const newParams = new URLSearchParams(searchParams);
    newParams.set('attrId', id.toString());
    navigate(`${location.pathname}?${newParams.toString()}`);
    setSelectedAttribute(id);
  };

  // 渲染关系区域
  const renderRelationArea = () => {
    if (!selectedAttribute || !attributes || !relations) {
      return null;
    }

    const groups = {
      attack: {
        immune: [] as AttributeInfo[],
        weak: [] as AttributeInfo[],
        strong: [] as AttributeInfo[],
        super: [] as AttributeInfo[],
        superOrImmune: [] as AttributeInfo[],
      },
      defend: {
        immune: [] as AttributeInfo[],
        weak: [] as AttributeInfo[],
        strong: [] as AttributeInfo[],
        super: [] as AttributeInfo[],
        superOrImmune: [] as AttributeInfo[],
      },
    };

    const isCurrentOrigin = !isSuperAttribute(selectedAttribute);
    const isCurrentSuper = isSuperAttribute(selectedAttribute);

    // 处理攻击关系 - 当前属性对其他属性的伤害
    Object.entries(relations).forEach(([targetId, value]) => {
      const damage = parseRelation(value);
      const id = parseInt(targetId, 10);
      const targetAttr = attributes.find((attr) => attr.id === id);
      if (!targetAttr) {
        return;
      }

      const isTargetSuper = isSuperAttribute(id);
      const isTargetOrigin = !isSuperAttribute(id);

      // 如果当前是原系，对超系的关系统一处理
      if (isCurrentOrigin && isTargetSuper) {
        // 原系攻击超系固定是1/2倍伤害，统一归为weak类别
        const superIcon = { id: 999, name: '超系' }; // 使用特殊ID表示超系图标
        if (!groups.attack.weak.find((attr) => attr.id === 999)) {
          groups.attack.weak.push(superIcon);
        }
        return;
      }

      // 如果当前是超系，对原系的关系统一处理
      if (isCurrentSuper && isTargetOrigin) {
        // 超系攻击原系固定是2倍伤害，统一归为strong类别
        const originIcon = { id: 1000, name: '原系' }; // 使用特殊ID表示原系图标
        if (!groups.attack.strong.find((attr) => attr.id === 1000)) {
          groups.attack.strong.push(originIcon);
        }
        return;
      }

      // 其他正常关系处理
      switch (damage) {
        case -1: {
          groups.attack.immune.push(targetAttr);
          groups.attack.superOrImmune.push(targetAttr);
          break;
        }
        case 0.5: {
          groups.attack.weak.push(targetAttr);
          break;
        }
        case 2: {
          groups.attack.strong.push(targetAttr);
          break;
        }
        case 3: {
          groups.attack.super.push(targetAttr);
          groups.attack.superOrImmune.push(targetAttr);
          break;
        }
      }
    });

    // 处理受击关系 - 其他属性对当前属性的伤害
    if (allRelations) {
      Object.entries(allRelations).forEach(([sourceId, sourceRelations]) => {
        const id = parseInt(sourceId, 10);
        if (id === selectedAttribute) {
          return; // 跳过自己
        }

        const sourceAttr = attributes.find((attr) => attr.id === id);
        if (!sourceAttr) {
          return;
        }

        const isSourceSuper = isSuperAttribute(id);
        const isSourceOrigin = !isSuperAttribute(id);

        // 如果当前是原系，被超系攻击的关系统一处理
        if (isCurrentOrigin && isSourceSuper) {
          // 超系攻击原系固定是2倍伤害，统一归为strong类别
          const superIcon = { id: 999, name: '超系' }; // 使用特殊ID表示超系图标
          if (!groups.defend.strong.find((attr) => attr.id === 999)) {
            groups.defend.strong.push(superIcon);
          }
          return;
        }

        // 如果当前是超系，被原系攻击的关系统一处理
        if (isCurrentSuper && isSourceOrigin) {
          // 原系攻击超系固定是1/2倍伤害，统一归为weak类别
          const originIcon = { id: 1000, name: '原系' }; // 使用特殊ID表示原系图标
          if (!groups.defend.weak.find((attr) => attr.id === 1000)) {
            groups.defend.weak.push(originIcon);
          }
          return;
        }

        const damageToMe = parseRelation(sourceRelations[selectedAttribute.toString()]);

        // 其他正常关系处理
        switch (damageToMe) {
          case -1: {
            groups.defend.immune.push(sourceAttr);
            groups.defend.superOrImmune.push(sourceAttr);
            break;
          }
          case 0.5: {
            groups.defend.weak.push(sourceAttr);
            break;
          }
          case 2: {
            groups.defend.strong.push(sourceAttr);
            break;
          }
          case 3: {
            groups.defend.super.push(sourceAttr);
            groups.defend.superOrImmune.push(sourceAttr);
            break;
          }
        }
      });
    }

    return (
      <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 30 }}>
        {renderRelationBox('攻击', groups.attack)}
        {renderRelationBox('防御', groups.defend)}
        {(isLoadingRelations || !allRelations) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 200,
            }}
          >
            <LoadingSpinner text="加载关系数据..." />
          </div>
        )}
      </div>
    );
  };

  // 渲染关系框
  const renderRelationBox = (title: string, relations: Record<RelationType, AttributeInfo[]>) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Card
        title={title}
        className="relation-box"
        style={{
          flex: 1,
          maxWidth: 500,
          borderRadius: 15,
          background: colors.surface,
          boxShadow: `0 4px 20px ${colors.shadow}10`,
        }}
        styles={{
          header: {
            textAlign: 'center',
            color: colors.primary,
            fontSize: '1.2em',
          },
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {(Object.entries(relations) as [RelationType, AttributeInfo[]][])
            .filter(([type]) => type !== 'immune' && type !== 'super') // 过滤掉旧的
            .map(([type, typeRelations], typeIndex) => {
              if (type === 'superOrImmune' && typeRelations.length === 0) {
                return null;
              }

              const isSuper = relations.super.length > 0;
              const dynamicType = type === 'superOrImmune' ? (isSuper ? 'super' : 'immune') : type;

              return (
                <motion.div
                  key={type}
                  className="relation-type"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: typeIndex * 0.1,
                    ease: 'easeOut',
                  }}
                  style={{
                    borderLeft: `4px solid ${damageColors[dynamicType]}`,
                    paddingLeft: 15,
                  }}
                >
                  <div
                    className="box-title"
                    style={{
                      fontWeight: 'bold',
                      marginBottom: 10,
                      color: colors.text,
                    }}
                  >
                    {damageDescription[dynamicType]}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 16,
                      padding: 12,
                    }}
                  >
                    {typeRelations.map((attr, index) => (
                      <motion.div
                        key={`${type}-${attr.id}-${index}`}
                        className="attribute-item clickable"
                        onClick={() => {
                          // 特殊图标不可点击跳转
                          if (attr.id === 999 || attr.id === 1000) return;
                          handleAttributeSelect(attr.id);
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: typeIndex * 0.1 + index * 0.05,
                          ease: 'easeOut',
                        }}
                        whileHover={{
                          scale: 1.12,
                          transition: { duration: 0.2, ease: 'easeOut' },
                        }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          position: 'relative',
                          padding: 8,
                          borderRadius: '50%',
                          cursor: attr.id === 999 || attr.id === 1000 ? 'default' : 'pointer',
                          background: colors.elevated,
                          transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow: `0 2px 8px ${colors.shadow}15, 0 1px 3px ${colors.shadow}10`,
                        }}
                      >
                        <img
                          src={getAttributeIconUrl(attr.id)}
                          alt={attr.name}
                          className="relation-icon"
                        />
                        {/* 悬停提示 */}
                        <div className="attribute-tooltip">{attr.name}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
        </div>
      </Card>
    </motion.div>
  );

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner text="正在加载属性数据..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorDisplay
          error={error instanceof Error ? error.message : String(error)}
          onRetry={() => window.location.reload()}
        />
      </Layout>
    );
  }

  if (!attributes) {
    return (
      <Layout>
        <Empty description="暂无属性数据" />
      </Layout>
    );
  }

  // 后端已经返回排除过的列表，前端不需要再过滤，但需要去重
  const originAttributes = attributes
    .filter((attr) => !isSuperAttribute(attr.id))
    .filter((attr, index, arr) => arr.findIndex((a) => a.id === attr.id) === index); // 去重
  const superAttributes = attributes
    .filter((attr) => isSuperAttribute(attr.id))
    .filter((attr, index, arr) => arr.findIndex((a) => a.id === attr.id) === index); // 去重

  return (
    <Layout>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 页面头部 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title
            level={1}
            style={{
              margin: 0,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '32px',
            }}
          >
            奥拉星系别克制查询
          </Title>

          {/* 标签切换 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 32,
              margin: '20px 0',
            }}
          >
            <motion.div
              className={`tab ${!showSuper ? 'active' : ''}`}
              onClick={() => setShowSuper(false)}
              whileHover={{ y: -2 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: 12,
                cursor: 'pointer',
                background: !showSuper ? `${colors.primary}20` : 'transparent',
                transition: 'all 0.3s ease',
                position: 'relative',
              }}
            >
              <img
                src={getAttributeIconUrl('origin-tab')}
                alt="原系"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  objectFit: 'contain',
                }}
              />
              {!showSuper && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: -4,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 24,
                    height: 3,
                    background: colors.primary,
                    borderRadius: 2,
                  }}
                />
              )}
            </motion.div>

            <motion.div
              className={`tab ${showSuper ? 'active' : ''}`}
              onClick={() => setShowSuper(true)}
              whileHover={{ y: -2 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: 12,
                cursor: 'pointer',
                background: showSuper ? `${colors.primary}20` : 'transparent',
                transition: 'all 0.3s ease',
                position: 'relative',
              }}
            >
              <img
                src={getAttributeIconUrl('super-tab')}
                alt="超系"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  objectFit: 'contain',
                }}
              />
              {showSuper && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: -4,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 24,
                    height: 3,
                    background: colors.primary,
                    borderRadius: 2,
                  }}
                />
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* 属性选择区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="attribute-icons"
        >
          {(showSuper ? superAttributes : originAttributes).map((attribute) => (
            <motion.div
              key={`${showSuper ? 'super' : 'origin'}-${attribute.id}`}
              className={`attribute-button ${selectedAttribute === attribute.id ? 'selected' : ''}`}
              onClick={() => handleAttributeSelect(attribute.id)}
              whileTap={{ scale: 0.98 }}
            >
              <div className="attribute-icon">
                <img src={getAttributeIconUrl(attribute.id)} alt={attribute.name} />
              </div>

              <span>{attribute.name}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* 克制关系显示区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {renderRelationArea()}
        </motion.div>
      </Space>
    </Layout>
  );
};

export default Attribute;
