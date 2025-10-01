/**
 * 性格解析组件
 * ---------------------------
 * 分析亚比性格对战斗属性的影响，提供直观的五边形图表展示
 *
 * @component CharacterAnalyzer
 *
 * 功能说明：
 * 1. 提供交互式属性选择界面
 * 2. 实时计算并显示对应的性格类型
 * 3. 通过雷达图可视化属性影响
 * 4. 提供完整的性格属性对照表
 *
 * 技术实现：
 * - 使用Chart.js绘制雷达图
 * - 使用Framer Motion实现动画效果
 * - 使用Zustand进行状态管理（通过useTheme hook）
 * - 国际化支持（react-i18next）
 */
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCopilotAction } from '@copilotkit/react-core';
import { Button, Card, Space, Typography } from 'antd';
import {
  Chart,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadarController,
  RadialLinearScale,
  Tooltip,
} from 'chart.js';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useTheme } from '../hooks/useTheme';
import { characterEffects } from '../utils/character-helper';

const { Title, Text } = Typography;

// 注册Chart.js组件
Chart.register(
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

/**
 * 属性键值类型定义
 *
 * 定义游戏中五大核心属性的键值
 */
type AttributeKey = 'attack' | 'special_attack' | 'defense' | 'special_defense' | 'speed';

/**
 * 属性对象接口定义
 *
 * 封装属性的键值和显示标签
 */
type Attribute = { key: AttributeKey; label: string };

/**
 * 性格分析器主组件
 *
 * 该组件提供完整的性格分析功能，包括：
 * 1. 属性选择界面
 * 2. 性格计算和显示
 * 3. 雷达图可视化
 * 4. 性格属性对照表
 *
 * 页面结构：
 * - 标题区域
 * - 当前性格显示区域
 * - 主要内容区域（雷达图和控制面板）
 * - 性格属性对照表
 */
const CharacterAnalyzer: React.FC = () => {
  // 国际化翻译函数
  const { t } = useTranslation('characterAnalyzer');
  // 图表canvas元素的引用
  const chartRef = useRef<HTMLCanvasElement>(null);
  // Chart.js实例的引用
  const chartInstance = useRef<Chart<'radar'> | null>(null);
  // 状态：当前选择的提升属性
  const [selectedIncrease, setSelectedIncrease] = useState<Attribute | null>(null);
  // 状态：当前选择的降低属性
  const [selectedDecrease, setSelectedDecrease] = useState<Attribute | null>(null);
  // 状态：根据选择计算出的当前性格
  const [currentCharacter, setCurrentCharacter] = useState(t('balanced'));

  // 定义游戏中的五大核心属性
  const attributes: Attribute[] = [
    { key: 'attack', label: t('attack') },
    { key: 'special_attack', label: t('special_attack') },
    { key: 'defense', label: t('defense') },
    { key: 'special_defense', label: t('special_defense') },
    { key: 'speed', label: t('speed') },
  ];

  useCopilotAction({
    name: 'analyzeCharacter',
    description: '分析亚比性格',
    parameters: [
      {
        name: 'increaseAttribute',
        type: 'string',
        description: '要提升的属性',
        enum: attributes.map((attr) => attr.label),
      },
      {
        name: 'decreaseAttribute',
        type: 'string',
        description: '要降低的属性',
        enum: attributes.map((attr) => attr.label),
      },
    ],
    handler: async ({ increaseAttribute, decreaseAttribute }) => {
      const increaseAttr = attributes.find((attr) => attr.label === increaseAttribute);
      const decreaseAttr = attributes.find((attr) => attr.label === decreaseAttribute);

      if (increaseAttr) {
        handleAttributeSelect(increaseAttr, 'increase');
      }
      if (decreaseAttr) {
        handleAttributeSelect(decreaseAttr, 'decrease');
      }
    },
  });

  /**
   * @description 处理用户选择提升或降低的属性。
   *
   * 实现单选逻辑：
   * - 点击已选中的属性会取消选择
   * - 点击未选中的属性会设置为当前选择
   * - 自动计算并更新对应的性格类型
   *
   * @param {Attribute} attribute - 用户点击的属性对象
   * @param {'increase' | 'decrease'} type - 操作类型，'increase'表示提升，'decrease'表示降低
   */
  const handleAttributeSelect = (attribute: Attribute, type: 'increase' | 'decrease') => {
    if (type === 'increase') {
      // 如果用户点击了已经选中的"提升"属性，则取消选择
      if (selectedIncrease?.key === attribute.key) {
        setSelectedIncrease(null);
        // 如果此时也没有选择"降低"属性，则性格重置为"平衡"
        if (!selectedDecrease) {
          setCurrentCharacter(t('balanced'));
        }
      } else {
        // 否则，设置新的"提升"属性
        setSelectedIncrease(attribute);
        // 如果此时已经选择了"降低"属性，则立即查找对应的性格
        if (selectedDecrease) {
          findCharacter(attribute, selectedDecrease);
        }
      }
    } else if (type === 'decrease') {
      // 对"降低"属性进行类似处理
      if (selectedDecrease?.key === attribute.key) {
        setSelectedDecrease(null);
        if (!selectedIncrease) {
          setCurrentCharacter(t('balanced'));
        }
      } else {
        setSelectedDecrease(attribute);
        if (selectedIncrease) {
          findCharacter(selectedIncrease, attribute);
        }
      }
    }
  };

  /**
   * @description 根据选择的提升和降低属性，查找并设置对应的性格名称。
   *
   * 查找逻辑：
   * 1. 如果提升和降低的是同一个属性，则性格为"平衡"
   * 2. 否则从预定义的性格效果表中查找对应的性格
   * 3. 如果找不到则显示"未知"
   *
   * @param {Attribute} increase - 提升的属性
   * @param {Attribute} decrease - 降低的属性
   */
  const findCharacter = (increase: Attribute, decrease: Attribute) => {
    // 如果提升和降低的是同一个属性，则性格为"平衡"
    if (increase.key === decrease.key) {
      setCurrentCharacter(t('balanced'));
      return;
    }

    // 从预定义的性格效果表中查找对应的性格
    const character = characterEffects[increase.key]?.[decrease.key];
    // 设置性格，如果找不到则显示"未知"
    setCurrentCharacter(character ? t(character) : t('unknown'));
  };

  // 从自定义hook中获取当前主题的颜色配置
  const { colors, theme } = useTheme()!;

  // 为Chart.js准备一个独立的颜色对象，因为它不支持CSS变量
  const chartColors = {
    primary: theme === 'dark' ? '#667eea' : '#667eea',
    error: theme === 'dark' ? '#ff7875' : '#ff4d4f',
    info: theme === 'dark' ? '#69c0ff' : '#1890ff',
    text: theme === 'dark' ? '#ffffff' : '#000000',
    textSecondary: theme === 'dark' ? '#a0a0a0' : '#666666',
    border: theme === 'dark' ? '#434343' : '#d9d9d9',
    surface: theme === 'dark' ? '#1f1f1f' : '#ffffff',
    elevated: theme === 'dark' ? '#2d2d2d' : '#fafafa',
  };

  /**
   * @description 根据当前选择的属性，生成雷达图所需的数据。
   *
   * 数据映射规则：
   * - 提升的属性值设为15（最大）
   * - 降低的属性值设为5（最小）
   * - 其他属性值为10（中间值）
   *
   * @returns {object} Chart.js雷达图的数据对象
   */
  const generateChartData = () => {
    return {
      labels: attributes.map((attr) => attr.label), // 图表的标签（攻击、特攻等）
      datasets: [
        {
          label: t('attribute_value'),
          data: attributes.map((attr) => {
            if (selectedIncrease?.key === attr.key) {
              return 15; // 提升的属性值设为最大
            } else if (selectedDecrease?.key === attr.key) {
              return 5; // 降低的属性值设为最小
            }
            return 10; // 其他属性值为中间值
          }),
          fill: true, // 填充区域
          backgroundColor: `${chartColors.primary}30`, // 填充颜色
          borderColor: chartColors.primary, // 边框颜色
          // 根据属性状态设置数据点的背景色
          pointBackgroundColor: attributes.map((attr) => {
            if (selectedIncrease?.key === attr.key) {
              return chartColors.error; // 提升属性为红色
            } else if (selectedDecrease?.key === attr.key) {
              return chartColors.info; // 降低属性为蓝色
            }
            return chartColors.primary; // 其他为主题色
          }),
          pointBorderColor: chartColors.surface,
          pointHoverBackgroundColor: chartColors.surface,
          pointHoverBorderColor: chartColors.primary,
          pointRadius: 8, // 数据点半径
        },
      ],
    };
  };

  /**
   * @description 使用useEffect hook来创建、更新和销毁Chart.js实例。
   *
   * 生命周期管理：
   * 1. 组件挂载时创建图表实例
   * 2. 依赖变化时更新图表数据
   * 3. 组件卸载时销毁图表实例
   *
   * 依赖项：
   * - selectedIncrease: 提升的属性
   * - selectedDecrease: 降低的属性
   * - chartColors: 图表颜色配置
   */
  useEffect(() => {
    // 如果已有图表实例，先销毁它
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // 确保canvas元素已挂载
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (!ctx) {
        return;
      }

      // 创建新的Chart.js雷达图实例
      chartInstance.current = new Chart(ctx, {
        type: 'radar',
        data: generateChartData(), // 使用生成的数据
        options: {
          scales: {
            r: {
              min: 0, // 最小值
              max: 15, // 最大值
              ticks: {
                stepSize: 5,
                display: false, // 不显示刻度值
                color: chartColors.textSecondary,
              },
              // 属性标签（攻击、特攻等）的样式
              pointLabels: {
                font: {
                  size: 14,
                  weight: 'bold',
                },
                // 根据属性状态设置标签颜色
                color: (context) => {
                  const attr = attributes[context.index];
                  if (selectedIncrease?.key === attr.key) {
                    return chartColors.error;
                  } else if (selectedDecrease?.key === attr.key) {
                    return chartColors.info;
                  }
                  return chartColors.text;
                },
              },
              grid: {
                color: `${chartColors.border}40`, // 网格线颜色
              },
              angleLines: {
                color: `${chartColors.border}60`, // 角度线颜色
              },
            },
          },
          plugins: {
            legend: {
              display: false, // 不显示图例
            },
            // 自定义提示框（Tooltip）
            tooltip: {
              backgroundColor: chartColors.elevated,
              titleColor: chartColors.text,
              bodyColor: chartColors.text,
              borderColor: chartColors.border,
              borderWidth: 1,
              callbacks: {
                label: function (context) {
                  const attr = attributes[context.dataIndex];
                  const value = context.raw as number;
                  let status = t('normal');

                  if (selectedIncrease?.key === attr.key) {
                    status = t('increase');
                  } else if (selectedDecrease?.key === attr.key) {
                    status = t('decrease');
                  }

                  return `${attr.label}: ${value} (${status})`;
                },
              },
            },
          },
          maintainAspectRatio: false, // 不保持宽高比，使其填充容器
        },
      });
    }

    // 组件卸载时销毁图表实例，防止内存泄漏
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [selectedIncrease, selectedDecrease, chartColors]); // 依赖项数组

  return (
    <Layout>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 页面头部 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            textAlign: 'center',
          }}
        >
          <div
            style={{
              margin: 0,
              fontSize: '32px',
              fontWeight: 'bold',
              fontFamily: 'inherit',
              lineHeight: 1.2,
              // 设置渐变文字效果
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              // 确保渐变生效
              display: 'inline-block',
              // 强制覆盖 Ant Design 样式
              color: 'transparent !important' as any,
            }}
          >
            {t('title')}
          </div>
        </motion.div>

        {/* 当前性格显示区域 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card
            style={{
              textAlign: 'center',
              background: colors.elevated,
              borderRadius: 12,
              boxShadow: `0 4px 20px ${colors.shadow}10`,
            }}
          >
            <Space direction="vertical" size="small">
              <Text style={{ color: colors.textSecondary, fontSize: '16px' }}>
                {t('current_character')}
              </Text>
              <Title
                level={2}
                style={{
                  margin: 0,
                  color: colors.primary,
                  fontSize: '28px',
                }}
              >
                {currentCharacter}
              </Title>
              {selectedIncrease && selectedDecrease && (
                <Space size="large">
                  <Text style={{ color: colors.error }}>
                    {t('increase')} {selectedIncrease.label}
                  </Text>
                  <Text style={{ color: colors.info }}>
                    {t('decrease')} {selectedDecrease.label}
                  </Text>
                </Space>
              )}
            </Space>
          </Card>
        </motion.div>

        {/* 主要内容区域 */}
        <div style={{ display: 'flex', gap: 24 }}>
          {/* 左侧图表区域 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ flex: 1 }}
          >
            <Card
              title={t('attribute_radar_chart')}
              style={{
                background: colors.surface,
                borderRadius: 12,
                boxShadow: `0 4px 20px ${colors.shadow}10`,
              }}
              styles={{
                header: {
                  color: colors.text,
                  fontSize: '18px',
                  fontWeight: 'bold',
                },
              }}
            >
              <div style={{ height: 300, marginBottom: 24 }}>
                <canvas ref={chartRef}></canvas>
              </div>

              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Text
                  style={{ color: colors.textSecondary, textAlign: 'center', display: 'block' }}
                >
                  {t('selection_helper_text')}
                </Text>

                <div>
                  <Text
                    style={{
                      color: colors.text,
                      fontWeight: 'bold',
                      marginBottom: 8,
                      display: 'block',
                    }}
                  >
                    {t('increase_attribute')}:
                  </Text>
                  <Space wrap>
                    {attributes.map((attribute) => (
                      <Button
                        key={`increase-${attribute.key}`}
                        type={selectedIncrease?.key === attribute.key ? 'primary' : 'default'}
                        danger={selectedIncrease?.key === attribute.key}
                        onClick={() => handleAttributeSelect(attribute, 'increase')}
                        style={{
                          borderRadius: 6,
                          backgroundColor:
                            selectedIncrease?.key === attribute.key ? colors.error : undefined,
                          borderColor:
                            selectedIncrease?.key === attribute.key ? colors.error : undefined,
                        }}
                      >
                        {attribute.label}
                      </Button>
                    ))}
                  </Space>
                </div>

                <div>
                  <Text
                    style={{
                      color: colors.text,
                      fontWeight: 'bold',
                      marginBottom: 8,
                      display: 'block',
                    }}
                  >
                    {t('decrease_attribute')}:
                  </Text>
                  <Space wrap>
                    {attributes.map((attribute) => (
                      <Button
                        key={`decrease-${attribute.key}`}
                        type={selectedDecrease?.key === attribute.key ? 'primary' : 'default'}
                        onClick={() => handleAttributeSelect(attribute, 'decrease')}
                        style={{
                          borderRadius: 6,
                          backgroundColor:
                            selectedDecrease?.key === attribute.key ? colors.info : undefined,
                          borderColor:
                            selectedDecrease?.key === attribute.key ? colors.info : undefined,
                        }}
                      >
                        {attribute.label}
                      </Button>
                    ))}
                  </Space>
                </div>
              </Space>
            </Card>
          </motion.div>

          {/* 右侧性格表格区域 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ flex: 1 }}
          >
            <Card
              title={t('character_attribute_table')}
              style={{
                background: colors.surface,
                borderRadius: 12,
                boxShadow: `0 4px 20px ${colors.shadow}10`,
              }}
              styles={{
                header: {
                  color: colors.text,
                  fontSize: '18px',
                  fontWeight: 'bold',
                },
              }}
            >
              <div style={{ overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '14px',
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          padding: '8px',
                          textAlign: 'center',
                          border: `1px solid ${colors.border}`,
                          background: `${colors.fill}`,
                          color: colors.text,
                          fontWeight: 'bold',
                        }}
                      ></th>
                      {attributes.map((attr) => (
                        <th
                          key={attr.key}
                          style={{
                            padding: '8px',
                            textAlign: 'center',
                            border: `1px solid ${colors.border}`,
                            background: `${colors.fill}`,
                            color: colors.text,
                            fontWeight: 'bold',
                          }}
                        >
                          {attr.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {attributes.map((increase) => (
                      <tr key={increase.key}>
                        <td
                          style={{
                            padding: '8px',
                            textAlign: 'center',
                            border: `1px solid ${colors.border}`,
                            background: `${colors.fill}`,
                            color: colors.text,
                            fontWeight: 'bold',
                          }}
                        >
                          {increase.label}
                        </td>
                        {attributes.map((decrease) => (
                          <td
                            key={`${increase.key}-${decrease.key}`}
                            onClick={() => {
                              if (increase !== decrease) {
                                setSelectedIncrease(increase);
                                setSelectedDecrease(decrease);
                                findCharacter(increase, decrease);
                              }
                            }}
                            style={{
                              padding: '8px',
                              textAlign: 'center',
                              border: `1px solid ${colors.border}`,
                              cursor: increase === decrease ? 'not-allowed' : 'pointer',
                              backgroundColor:
                                increase === decrease
                                  ? colors.fillSecondary
                                  : selectedIncrease === increase && selectedDecrease === decrease
                                    ? colors.primary
                                    : colors.surface,
                              color:
                                increase === decrease
                                  ? colors.textDisabled
                                  : selectedIncrease === increase && selectedDecrease === decrease
                                    ? colors.surface
                                    : colors.text,
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              if (increase !== decrease) {
                                e.currentTarget.style.backgroundColor = colors.fillTertiary;
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (increase !== decrease) {
                                e.currentTarget.style.backgroundColor =
                                  selectedIncrease === increase && selectedDecrease === decrease
                                    ? colors.primary
                                    : colors.surface;
                              }
                            }}
                          >
                            {characterEffects[increase.key]?.[decrease.key]
                              ? t(characterEffects[increase.key][decrease.key])
                              : '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: '12px',
                  marginTop: 16,
                  display: 'block',
                  textAlign: 'center',
                }}
              >
                {t('table_helper_text')}
              </Text>
            </Card>
          </motion.div>
        </div>
      </Space>
    </Layout>
  );
};

export default CharacterAnalyzer;
