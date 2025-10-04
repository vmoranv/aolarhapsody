/**
 * @file Attribute.tsx
 * @description 属性克制关系展示页面。
 * 该页面负责从API获取所有属性信息及其克制关系，
 * 并通过交互式UI展示选定属性的攻击和防御关系。
 * 支持通过URL参数直接定位到特定属性。
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import { useQuery } from '@tanstack/react-query';
import { Card, Empty, Space, Typography } from 'antd';
import { motion } from 'framer-motion';
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

/**
 * 单个属性的基本信息。
 * @interface AttributeInfo
 * @property {number} id - 属性的唯一标识符。
 * @property {string} name - 属性的名称。
 */
interface AttributeInfo {
  id: number;
  name: string;
}

/**
 * 属性克制关系集合，键为目标属性ID，值为关系描述字符串。
 * @interface AttributeRelations
 */
interface AttributeRelations {
  [targetId: string]: string;
}

/**
 * API响应的通用结构。
 * @interface ApiResponse
 * @template T - 响应数据的类型。
 * @property {boolean} success - 请求是否成功。
 * @property {T} data - 响应的核心数据。
 * @property {number} [count] - 数据项的数量（可选）。
 * @property {string} timestamp - 服务器响应的时间戳。
 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  timestamp: string;
}

/**
 * 定义了伤害关系的类型。
 * 'immune': 免疫 (伤害-1)
 * 'weak': 抵抗 (伤害0.5)
 * 'strong': 克制 (伤害2)
 * 'super': 超克制 (伤害3)
 * 'superOrImmune': 一个临时的聚合类型，用于UI渲染，代表免疫或超克制。
 */
type RelationType = 'immune' | 'weak' | 'strong' | 'super' | 'superOrImmune';

/**
 * 从API异步获取所有属性的列表。
 * @returns {Promise<AttributeInfo[]>} 属性信息数组的Promise。
 * @throws {Error} 当网络请求或API响应失败时抛出错误。
 */
const fetchAttributes = async (): Promise<AttributeInfo[]> => {
  const baseUrl = import.meta.env.VITE_API_URL || '';
  const response = await fetch(`${baseUrl}/api/skill-attributes`);
  if (!response.ok) {
    throw new Error('Failed to fetch attribute list');
  }
  const result: ApiResponse<AttributeInfo[]> = await response.json();
  if (!result.success) {
    throw new Error('Failed to fetch attribute list');
  }
  return result.data;
};

/**
 * 根据给定的属性ID，从API异步获取其克制关系。
 * @param {number} id - 要查询的属性ID。
 * @returns {Promise<AttributeRelations>} 该属性的克制关系对象的Promise。
 * @throws {Error} 当网络请求或API响应失败时抛出错误。
 */
const fetchAttributeRelations = async (id: number): Promise<AttributeRelations> => {
  const baseUrl = import.meta.env.VITE_API_URL || '';
  const response = await fetch(`${baseUrl}/api/attribute-relations/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch attribute relations');
  }
  const result: ApiResponse<AttributeRelations> = await response.json();
  if (!result.success) {
    throw new Error('Failed to fetch attribute relations');
  }
  return result.data;
};

/**
 * 属性克制关系页面组件。
 * @returns {JSX.Element} 渲染出的属性页面。
 */
const Attribute = () => {
  const { t } = useTranslation('attribute');
  const [selectedAttribute, setSelectedAttribute] = useState<number | null>(null);
  const [showSuper, setShowSuper] = useState(false); // 控制显示原系还是超系属性列表
  const { colors } = useTheme()!;
  const notifications = useNotificationContext();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const attrIdFromUrl = searchParams.get('attrId');

  // 使用 React Query 获取属性列表
  const {
    data: attributes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['attributes'],
    queryFn: fetchAttributes,
  });

  useCopilotReadable({
    description: '当前属性克制页面视图',
    value: `正在查看${showSuper ? '超系' : '原系'}属性列表`,
  });

  useCopilotAction({
    name: 'selectAttribute',
    description: '选择一个属性以查看其克制关系',
    parameters: [
      {
        name: 'attributeName',
        type: 'string',
        description: '要选择的属性名称',
      },
    ],
    handler: async ({ attributeName }) => {
      if (attributes) {
        // 使用通用的属性匹配函数
        const attribute = findAttributeByName(attributes, attributeName);
        if (attribute) {
          handleAttributeSelect(attribute.id);
        }
      }
    },
  });

  useCopilotAction({
    name: 'toggleAttributeView',
    description: '切换原系或超系属性视图',
    parameters: [
      {
        name: 'view',
        type: 'string',
        description: '要切换到的视图',
        enum: ['origin', 'super'],
      },
    ],
    handler: async ({ view }) => {
      setShowSuper(view === 'super');
    },
  });

  /**
   * 通过名称查找属性，支持模糊匹配和后缀处理
   * @param attributes 属性列表
   * @param attributeName 要查找的属性名称
   * @returns 匹配的属性或undefined
   */
  const findAttributeByName = (
    attributes: AttributeInfo[],
    attributeName: string
  ): AttributeInfo | undefined => {
    // 1. 精确匹配
    let attribute = attributes.find((attr) => attr.name === attributeName);
    if (attribute) {
      return attribute;
    }

    // 2. 特殊处理带"系"后缀的查询，避免匹配到子字符串
    if (attributeName.endsWith('系')) {
      // 不进行包含匹配，直接进入第3步处理"系"后缀
    } else {
      // 直接包含匹配（不带"系"后缀的常规查询）
      attribute = attributes.find(
        (attr) =>
          (attr.name.includes(attributeName) && attr.name !== attributeName) ||
          (attributeName.includes(attr.name) && attributeName !== attr.name)
      );
      if (attribute) {
        return attribute;
      }
    }

    // 3. 处理"系"后缀问题 - 如果用户查询包含"系"，尝试去掉"系"后再匹配
    if (attributeName.endsWith('系')) {
      const nameWithoutSuffix = attributeName.slice(0, -1); // 去掉"系"

      // 对于"超王系"这类名称，优先匹配超系属性
      if (attributeName.startsWith('超')) {
        const superAttributes = attributes.filter((attr) => isSuperAttribute(attr.id));
        // 精确匹配去掉"系"后缀的名称
        attribute = superAttributes.find((attr) => attr.name === nameWithoutSuffix);
        if (attribute) {
          return attribute;
        }

        // 如果没有精确匹配，尝试完整名称匹配
        attribute = superAttributes.find((attr) => attr.name === attributeName);
        if (attribute) {
          return attribute;
        }
      } else {
        // 普通属性的匹配
        attribute = attributes.find(
          (attr) => attr.name === nameWithoutSuffix || attr.name.includes(nameWithoutSuffix)
        );
        if (attribute) {
          return attribute;
        }
      }
    }

    // 4. 更宽松的匹配 - 去掉可能的后缀后匹配
    const normalizedQuery = attributeName
      .replace(/(系|属性)$/, '') // 去掉"系"或"属性"后缀
      .trim();

    if (normalizedQuery !== attributeName) {
      // 优先匹配超系属性
      if (attributeName.startsWith('超')) {
        const superAttributes = attributes.filter((attr) => isSuperAttribute(attr.id));
        attribute = superAttributes.find(
          (attr) => attr.name.includes(normalizedQuery) || attr.name === normalizedQuery
        );
        if (attribute) {
          return attribute;
        }
      }

      // 再匹配普通属性
      attribute = attributes.find(
        (attr) => attr.name.includes(normalizedQuery) || attr.name === normalizedQuery
      );
      if (attribute) {
        return attribute;
      }
    }

    // 5. 如果查询以"超"开头，尝试在所有超系属性中查找
    if (attributeName.startsWith('超')) {
      const superAttributes = attributes.filter((attr) => isSuperAttribute(attr.id));
      const queryWithoutChao = attributeName.substring(1); // 去掉"超"

      // 首先尝试精确匹配去掉"超"后的名称
      attribute = superAttributes.find((attr) => attr.name === queryWithoutChao);
      if (attribute) {
        return attribute;
      }

      // 然后尝试匹配完整名称
      attribute = superAttributes.find((attr) => attr.name === attributeName);
      if (attribute) {
        return attribute;
      }

      // 再尝试匹配去掉"系"后缀的名称
      if (attributeName.endsWith('系')) {
        const nameWithoutSuffix = attributeName.slice(0, -1);
        attribute = superAttributes.find((attr) => attr.name === nameWithoutSuffix);
        if (attribute) {
          return attribute;
        }
      }

      // 最后尝试包含匹配
      attribute = superAttributes.find(
        (attr) =>
          attr.name.includes(queryWithoutChao) ||
          attr.name.replace('超', '').includes(queryWithoutChao) ||
          queryWithoutChao.includes(attr.name.replace('超', ''))
      );
      if (attribute) {
        return attribute;
      }
    }

    return attribute;
  };

  useCopilotAction({
    name: 'getAttributeAdvantages',
    description: '获取指定属性的克制关系信息',
    parameters: [
      {
        name: 'attributeName',
        type: 'string',
        description: '要查询克制关系的属性名称',
      },
    ],
    handler: async ({ attributeName }) => {
      if (attributes) {
        // 使用通用的属性匹配函数
        const attribute = findAttributeByName(attributes, attributeName);

        if (attribute) {
          handleAttributeSelect(attribute.id);
          setShowSuper(isSuperAttribute(attribute.id));

          // 获取该属性的克制关系
          const attributeRelations = await fetchAttributeRelations(attribute.id);

          // 分析克制关系并生成自然语言描述
          const strongRelations: string[] = [];
          const superRelations: string[] = [];
          const weakRelations: string[] = [];

          Object.entries(attributeRelations).forEach(([targetId, value]) => {
            const damage = parseRelation(value);
            const id = parseInt(targetId, 10);
            const targetAttr = attributes.find((attr) => attr.id === id);
            if (!targetAttr) {
              return;
            }

            switch (damage) {
              case 2: {
                strongRelations.push(targetAttr.name);
                break;
              }
              case 3: {
                superRelations.push(targetAttr.name);
                break;
              }
              case 0.5: {
                weakRelations.push(targetAttr.name);
                break;
              }
            }
          });

          let response = '';
          if (superRelations.length > 0) {
            response += `${attribute.name}绝对克制${superRelations.join('、')}。`;
          }
          if (strongRelations.length > 0) {
            response += `${attribute.name}克制${strongRelations.join('、')}。`;
          }
          if (weakRelations.length > 0) {
            response += `${attribute.name}被${weakRelations.join('、')}所克制。`;
          }
          if (response === '') {
            response = `${attribute.name}没有明显的克制面。`;
          }

          return response;
        } else {
          return `我无法找到"${attributeName}"的克制关系。请确认您输入的属性名称是否正确。`;
        }
      }
    },
  });

  // 使用 React Query 获取当前选中属性的攻击关系
  const { data: relations, isLoading: isLoadingRelations } = useQuery({
    queryKey: ['attribute-relations', selectedAttribute],
    queryFn: () => fetchAttributeRelations(selectedAttribute!),
    enabled: !!selectedAttribute, // 仅在 selectedAttribute 有值时执行
  });

  // 使用 React Query 获取所有属性的关系数据，用于计算受击关系
  const { data: allRelations } = useQuery({
    queryKey: ['all-attribute-relations', attributes],
    queryFn: async () => {
      if (!attributes) {
        return;
      }
      // 并行获取所有属性的关系数据
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
    enabled: !!attributes && attributes.length > 0, // 仅在属性列表加载后执行
  });

  // Effect：处理URL参数和设置默认选中的属性
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
      // 如果没有URL参数，默认选择第一个非超能系（原系）属性
      const firstOrigin = attributes.find((attr) => !isSuperAttribute(attr.id));
      if (firstOrigin) {
        setSelectedAttribute(firstOrigin.id);
      }
    }
  }, [attributes, attrIdFromUrl]);

  // Effect：处理数据加载错误并显示通知
  useEffect(() => {
    if (error) {
      notifications.error(t('data_load_failed'), t('data_load_failed_desc'));
    }
  }, [error, notifications.error, t]);

  /**
   * 处理用户选择新属性的事件。
   * @param {number} id - 被选中的属性ID。
   */
  const handleAttributeSelect = (id: number) => {
    if (id === selectedAttribute) {
      return; // 如果点击的是当前已选中的属性，则不执行任何操作
    }

    // 更新URL参数以反映新的选择
    const newParams = new URLSearchParams(searchParams);
    newParams.set('attrId', id.toString());
    navigate(`${location.pathname}?${newParams.toString()}`);
    setSelectedAttribute(id);
  };

  /**
   * 渲染攻击和防御关系的核心区域。
   * @returns {JSX.Element | null} 渲染出的关系区域，或在数据未加载时返回 null。
   */
  const renderRelationArea = () => {
    if (!selectedAttribute || !attributes || !relations) {
      return null;
    }

    // 初始化攻击和防御关系的分组
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

    // 1. 计算攻击关系：当前选中属性对其他属性的伤害效果
    Object.entries(relations).forEach(([targetId, value]) => {
      const damage = parseRelation(value);
      const id = parseInt(targetId, 10);
      const targetAttr = attributes.find((attr) => attr.id === id);
      if (!targetAttr) {
        return;
      }

      const isTargetSuper = isSuperAttribute(id);
      const isTargetOrigin = !isSuperAttribute(id);

      // 特殊逻辑：原系对超系
      if (isCurrentOrigin && isTargetSuper) {
        // 原系攻击超系固定为0.5倍伤害，统一归为'weak'类别
        const superIcon = { id: 999, name: t('super_attribute') }; // 使用特殊ID表示“所有超系”
        if (!groups.attack.weak.find((attr) => attr.id === 999)) {
          groups.attack.weak.push(superIcon);
        }
        return;
      }

      // 特殊逻辑：超系对原系
      if (isCurrentSuper && isTargetOrigin) {
        // 超系攻击原系固定为2倍伤害，统一归为'strong'类别
        const originIcon = { id: 1000, name: t('origin_attribute') }; // 使用特殊ID表示“所有原系”
        if (!groups.attack.strong.find((attr) => attr.id === 1000)) {
          groups.attack.strong.push(originIcon);
        }
        return;
      }

      // 标准关系处理
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

    // 2. 计算受击关系：其他属性对当前选中属性的伤害效果
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

        // 特殊逻辑：被超系攻击
        if (isCurrentOrigin && isSourceSuper) {
          // 超系攻击原系固定为2倍伤害
          const superIcon = { id: 999, name: t('super_attribute') };
          if (!groups.defend.strong.find((attr) => attr.id === 999)) {
            groups.defend.strong.push(superIcon);
          }
          return;
        }

        // 特殊逻辑：被原系攻击
        if (isCurrentSuper && isSourceOrigin) {
          // 原系攻击超系固定为0.5倍伤害
          const originIcon = { id: 1000, name: t('origin_attribute') };
          if (!groups.defend.weak.find((attr) => attr.id === 1000)) {
            groups.defend.weak.push(originIcon);
          }
          return;
        }

        // 从攻击方的关系数据中找到对当前属性的伤害值
        const damageToMe = parseRelation(sourceRelations[selectedAttribute.toString()]);

        // 标准关系处理
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
        {renderRelationBox(t('attack'), groups.attack)}
        {renderRelationBox(t('defend'), groups.defend)}
        {(isLoadingRelations || !allRelations) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 200,
            }}
          >
            <LoadingSpinner text={t('loading_relations')} />
          </div>
        )}
      </div>
    );
  };

  /**
   * 渲染单个关系框（攻击或防御）。
   * @param {string} title - 关系框的标题（例如，“攻击”）。
   * @param {Record<RelationType, AttributeInfo[]>} relations - 该类型下的关系数据。
   * @returns {JSX.Element} 渲染出的关系卡片。
   */
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
            // 过滤掉临时的'immune'和'super'，因为它们已被合并到'superOrImmune'中进行统一渲染
            .filter(([type]) => type !== 'immune' && type !== 'super')
            .map(([type, typeRelations], typeIndex) => {
              // 如果'superOrImmune'类别没有内容，则不渲染
              if (type === 'superOrImmune' && typeRelations.length === 0) {
                return null;
              }

              // 动态决定'superOrImmune'应该显示为'super'还是'immune'的样式
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
                          // 特殊图标（代表所有原系/超系）不可点击
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
                        {/* 悬停时显示的属性名称提示 */}
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

  // 加载状态UI
  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner text={t('loading_attributes')} />
      </Layout>
    );
  }

  // 错误状态UI
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

  // 数据为空状态UI
  if (!attributes) {
    return (
      <Layout>
        <Empty description={t('no_attribute_data')} />
      </Layout>
    );
  }

  // 将属性列表分为原系和超系，并进行去重
  const originAttributes = attributes
    .filter((attr) => !isSuperAttribute(attr.id))
    .filter((attr, index, arr) => arr.findIndex((a) => a.id === attr.id) === index);
  const superAttributes = attributes
    .filter((attr) => isSuperAttribute(attr.id))
    .filter((attr, index, arr) => arr.findIndex((a) => a.id === attr.id) === index);

  return (
    <Layout>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 页面头部和标题 */}
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
            {t('title')}
          </Title>

          {/* 原系/超系标签切换 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 32,
              margin: '20px 0',
            }}
          >
            {/* 原系标签 */}
            <motion.div
              className={`tab ${showSuper ? '' : 'active'}`}
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
                alt={t('origin_attributes')}
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

            {/* 超系标签 */}
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
                alt={t('super_attributes')}
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

        {/* 属性图标选择区域 */}
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
