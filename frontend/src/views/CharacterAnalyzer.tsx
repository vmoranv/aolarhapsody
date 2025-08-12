/**
 * 性格解析组件
 * ---------------------------
 * 分析宠物性格对战斗属性的影响，提供直观的五边形图表展示
 *
 * @component CharacterAnalyzer
 */
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
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
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

type AttributeKey = 'attack' | 'special_attack' | 'defense' | 'special_defense' | 'speed';
type Attribute = { key: AttributeKey; label: string };

const CharacterAnalyzer: React.FC = () => {
  const { t } = useTranslation('characterAnalyzer');
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart<'radar'> | null>(null);
  const [selectedIncrease, setSelectedIncrease] = useState<Attribute | null>(null);
  const [selectedDecrease, setSelectedDecrease] = useState<Attribute | null>(null);
  const [currentCharacter, setCurrentCharacter] = useState(t('balanced'));

  // 游戏属性列表
  const attributes: Attribute[] = [
    { key: 'attack', label: t('attack') },
    { key: 'special_attack', label: t('special_attack') },
    { key: 'defense', label: t('defense') },
    { key: 'special_defense', label: t('special_defense') },
    { key: 'speed', label: t('speed') },
  ];

  // 处理属性选择
  const handleAttributeSelect = (attribute: Attribute, type: 'increase' | 'decrease') => {
    if (type === 'increase') {
      // 如果点击了已选中的属性，则取消选择
      if (selectedIncrease?.key === attribute.key) {
        setSelectedIncrease(null);
        // 如果没有降低属性被选中，则性格为平衡
        if (!selectedDecrease) {
          setCurrentCharacter(t('balanced'));
        }
      } else {
        setSelectedIncrease(attribute);
        // 如果已有降低属性，则查找对应性格
        if (selectedDecrease) {
          findCharacter(attribute, selectedDecrease);
        }
      }
    } else if (type === 'decrease') {
      // 如果点击了已选中的属性，则取消选择
      if (selectedDecrease?.key === attribute.key) {
        setSelectedDecrease(null);
        // 如果没有提高属性被选中，则性格为平衡
        if (!selectedIncrease) {
          setCurrentCharacter(t('balanced'));
        }
      } else {
        setSelectedDecrease(attribute);
        // 如果已有提高属性，则查找对应性格
        if (selectedIncrease) {
          findCharacter(selectedIncrease, attribute);
        }
      }
    }
  };

  // 查找对应性格
  const findCharacter = (increase: Attribute, decrease: Attribute) => {
    if (increase.key === decrease.key) {
      setCurrentCharacter(t('balanced'));
      return;
    }

    const character = characterEffects[increase.key]?.[decrease.key];
    setCurrentCharacter(character ? t(character) : t('unknown'));
  };

  // 使用项目的颜色系统
  const { colors, theme } = useTheme()!;

  // Chart.js 需要实际的颜色值，不能使用 CSS 变量
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

  // 生成五边形图表数据
  const generateChartData = () => {
    return {
      labels: attributes.map((attr) => attr.label),
      datasets: [
        {
          label: t('attribute_value'),
          data: attributes.map((attr) => {
            if (selectedIncrease?.key === attr.key) {
              return 15; // 直接到顶
            } else if (selectedDecrease?.key === attr.key) {
              return 5; // 缩回到底
            }
            return 10; // 保持中间
          }),
          fill: true,
          backgroundColor: `${chartColors.primary}30`,
          borderColor: chartColors.primary,
          pointBackgroundColor: attributes.map((attr) => {
            if (selectedIncrease?.key === attr.key) {
              return chartColors.error;
            } else if (selectedDecrease?.key === attr.key) {
              return chartColors.info;
            }
            return chartColors.primary;
          }),
          pointBorderColor: chartColors.surface,
          pointHoverBackgroundColor: chartColors.surface,
          pointHoverBorderColor: chartColors.primary,
          pointRadius: 8, // 统一大小
        },
      ],
    };
  };

  // 更新图表配置
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (!ctx) {
        return;
      }

      chartInstance.current = new Chart(ctx, {
        type: 'radar',
        data: generateChartData(),
        options: {
          scales: {
            r: {
              min: 0,
              max: 15,
              ticks: {
                stepSize: 5,
                display: false,
                color: chartColors.textSecondary,
              },
              pointLabels: {
                font: {
                  size: 14,
                  weight: 'bold',
                },
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
                color: `${chartColors.border}40`,
              },
              angleLines: {
                color: `${chartColors.border}60`,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
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
          maintainAspectRatio: false,
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [selectedIncrease, selectedDecrease, chartColors]);

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
