import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Collapse,
  Empty,
  List,
  Row,
  Space,
  Spin,
  Tag,
  Typography,
} from 'antd';
import { motion } from 'framer-motion';
import {
  Award,
  BrainCircuit,
  Calculator,
  CheckSquare,
  Crop,
  Gem,
  Image,
  Link,
  MessageCircle,
  MessageSquare,
  Package,
  Shirt,
  Sparkles,
  Swords,
  Zap,
} from 'lucide-react';
// import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { fetchData } from '../utils/api';

const { Title, Paragraph, Text } = Typography;

// 这些接口定义在运行时通过any类型处理，不需要具体的TypeScript接口定义

/**
 * @file Miscellaneous.tsx
 * @description
 * 这是一个"杂项"页面，用于展示和浏览各种游戏内的零散数据，
 * 例如聊天框、服装、称号、头像框等。
 * 同时，它也作为入口，链接到一些独立的功能性工具页面，如图片压缩器、经验计算器等。
 * 页面通过可折叠的面板来分类展示数据，并显示每个分类的数据总数。
 * 
 * 页面主要功能：
 * 1. 展示各种游戏数据（聊天框、服装、称号等）
 * 2. 提供数据统计概览
 * 3. 链接到专用工具页面（图片压缩器、角色分析器等）
 * 
 * 技术实现：
 * - 使用React Query进行数据获取和状态管理
 * - 使用Framer Motion实现页面动画效果
 * - 使用Ant Design组件构建用户界面
 * - 使用Lucide React图标库提供图标
 */

/**
 * 获取所有杂项数据和工具的配置数组。
 * 
 * 该函数返回一个配置对象数组，每个对象定义了一种数据类型或工具的展示方式。
 * 包括显示标题、图标、颜色主题、API端点和描述信息。
 * 
 * @param t - i18next的翻译函数，用于国际化文本显示
 * @returns 返回一个包含所有数据/工具配置对象的数组。每个对象都定义了其唯一的key、标题、图标、颜色、API端点和描述。
 * 
 * 配置对象结构说明：
 * - key: 唯一标识符，用于React列表渲染和状态管理
 * - title: 显示标题，通过t函数进行国际化
 * - icon: 图标组件，使用Lucide React图标
 * - color: 主题颜色，用于图标和标签着色
 * - endpoint: API端点路径，空字符串表示工具链接
 * - description: 数据简要描述，通过t函数进行国际化
 */
const getDataConfigs = (t: (key: string) => string) => [
  {
    key: 'chatframes',
    title: t('chat_frames'),
    icon: MessageCircle,
    color: '#1890ff',
    endpoint: 'chatframes',
    description: t('chat_frames_desc'),
  },
  {
    key: 'clothes',
    title: t('clothes'),
    icon: Shirt,
    color: '#722ed1',
    endpoint: 'clothes',
    description: t('clothes_desc'),
  },
  {
    key: 'galaxyfleetmarks',
    title: t('galaxy_fleet_marks'),
    icon: Award,
    color: '#fa8c16',
    endpoint: 'galaxyfleetmarks',
    description: t('galaxy_fleet_marks_desc'),
  },
  {
    key: 'headframes',
    title: t('head_frames'),
    icon: Image,
    color: '#52c41a',
    endpoint: 'headframes',
    description: t('head_frames_desc'),
  },
  {
    key: 'icondata',
    title: t('icon_data'),
    icon: Package,
    color: '#13c2c2',
    endpoint: 'headicons',
    description: t('icon_data_desc'),
  },
  {
    key: 'items',
    title: t('items'),
    icon: Sparkles,
    color: '#eb2f96',
    endpoint: 'items',
    description: t('items_desc'),
  },
  {
    key: 'miracles',
    title: t('miracles'),
    icon: Gem,
    color: '#f5222d',
    endpoint: 'miracle/awake',
    description: t('miracles_desc'),
  },
  {
    key: 'petstones',
    title: t('pet_stones'),
    icon: Gem,
    color: '#faad14',
    endpoint: 'evolutionstones',
    description: t('pet_stones_desc'),
  },
  {
    key: 'pettalks',
    title: t('pet_talks'),
    icon: MessageSquare,
    color: '#a0d911',
    endpoint: 'pettalks',
    description: t('pet_talks_desc'),
  },
  {
    key: 'petterritoryfights',
    title: t('pet_territory_fights'),
    icon: Swords,
    color: '#ff4d4f',
    endpoint: 'petterritoryfights',
    description: t('pet_territory_fights_desc'),
  },
  {
    key: 'pmevolinks',
    title: t('pmevo_links'),
    icon: Link,
    color: '#9254de',
    endpoint: 'spevo',
    description: t('pmevo_links_desc'),
  },
  {
    key: 'summoners',
    title: t('summoners'),
    icon: Zap,
    color: '#ff7a45',
    endpoint: 'summonerskills',
    description: t('summoners_desc'),
  },
  {
    key: 'tasks',
    title: t('tasks'),
    icon: CheckSquare,
    color: '#36cfc9',
    endpoint: 'tasks/starters',
    description: t('tasks_desc'),
  },
  {
    key: 'image-compressor',
    title: t('image_compressor'),
    icon: Crop,
    color: '#f759ab',
    endpoint: '', // No endpoint for this tool
    description: t('image_compressor_desc'),
  },
  {
    key: 'character-analyzer',
    title: t('character_analyzer'),
    icon: BrainCircuit,
    color: '#13a8a8',
    endpoint: '', // No endpoint for this tool
    description: t('character_analyzer_desc'),
  },
  {
    key: 'poster',
    title: t('poster'),
    icon: Image,
    color: '#d4380d',
    endpoint: '', // No endpoint for this tool
    description: t('poster_desc'),
  },
  {
    key: 'exp-calculator',
    title: t('exp_calculator'),
    icon: Calculator,
    color: '#389e0d',
    endpoint: '', // No endpoint for this tool
    description: t('exp_calculator_desc'),
  },
  {
    key: 'abbbuffs',
    title: t('abb_buffs'),
    icon: Zap,
    color: '#1890ff',
    endpoint: 'abbbuffs',
    description: t('abb_buffs_desc'),
  },
];

/**
 * 用于显示单个数据类别的组件
 * 
 * 该组件负责：
 * 1. 处理数据加载状态显示
 * 2. 处理数据加载错误显示
 * 3. 渲染数据内容列表
 * 4. 显示数据总数标签
 * 5. 提供数据预览（前10条）
 * 
 * @param props - 组件属性
 * @param props.config - 当前数据分区的配置对象
 * @param props.data - 从API获取的数据数组
 * @param props.loading - 指示数据是否正在加载的布尔值
 * @param props.error - 加载数据时发生的错误对象
 * @returns 渲染的数据分区或加载/错误状态
 */
const DataSection: React.FC<{
  config: ReturnType<typeof getDataConfigs>[0];
  data: any[];
  loading: boolean;
  error: any;
}> = ({ config, data, loading, error }) => {
  const { t } = useTranslation('miscellaneous');
  // 获取当前配置的图标组件
  const IconComponent = config.icon;

  // 处理数据加载状态
  if (loading) {
    return (
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconComponent size={20} color={config.color} />
            <span>{config.title}</span>
          </div>
        }
        style={{ marginBottom: 16 }}
      >
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">{t('loading_data', { title: config.title })}</Text>
          </div>
        </div>
      </Card>
    );
  }

  // 处理错误状态
  if (error) {
    return (
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconComponent size={20} color={config.color} />
            <span>{config.title}</span>
          </div>
        }
        style={{ marginBottom: 16 }}
      >
        <Alert
          message={t('load_failed')}
          description={error instanceof Error ? error.message : String(error)}
          type="error"
          showIcon
        />
      </Card>
    );
  }

  // 渲染数据内容
  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconComponent size={20} color={config.color} />
          <span>{config.title}</span>
          <Tag color={config.color} style={{ marginLeft: 8 }}>
            {data.length}
          </Tag>
        </div>
      }
      extra={
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {config.description}
        </Text>
      }
      style={{ marginBottom: 16 }}
    >
      <List
        dataSource={data.slice(0, 10)} // 只显示前10条
        renderItem={(item: any, index: number) => (
          <List.Item key={index}>
            <List.Item.Meta
              avatar={
                <Avatar
                  style={{ backgroundColor: config.color }}
                  icon={<IconComponent size={16} />}
                />
              }
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Text strong>
                    {item.name ||
                      item.taskname ||
                      `${config.title} ${item.id || item.viewId || item.raceId}`}
                  </Text>
                  {item.id && (
                    <Tag color="blue" style={{ fontSize: '12px' }}>
                      ID: {item.id}
                    </Tag>
                  )}
                </div>
              }
              description={
                <div>
                  {item.desc && (
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {item.desc.length > 50 ? `${item.desc.substring(0, 50)}...` : item.desc}
                    </Text>
                  )}
                  {item.talk && (
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {item.talk.length > 50 ? `${item.talk.substring(0, 50)}...` : item.talk}
                    </Text>
                  )}
                  {item.price && (
                    <div style={{ marginTop: 4 }}>
                      <Tag color="gold" style={{ fontSize: '12px' }}>
                        {t('price')}: {item.price}
                      </Tag>
                      {item.rmb && (
                        <Tag color="red" style={{ fontSize: '12px' }}>
                          {t('rmb')}: {item.rmb}
                        </Tag>
                      )}
                    </div>
                  )}
                  {item.cost && (
                    <Tag color="purple" style={{ fontSize: '12px' }}>
                      {t('cost')}: {item.cost}
                    </Tag>
                  )}
                  {item.levelLimit && (
                    <Tag color="green" style={{ fontSize: '12px' }}>
                      {t('level_limit')}: {item.levelLimit}
                    </Tag>
                  )}
                </div>
              }
            />
          </List.Item>
        )}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={t('no_data', { title: config.title })}
            />
          ),
        }}
      />
      {data.length > 10 && (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text type="secondary">{t('more_data_hidden', { count: data.length - 10 })}</Text>
        </div>
      )}
    </Card>
  );
};

/**
 * "杂项"页面的主组件
 * 
 * 该组件负责：
 * 1. 获取并管理所有数据/工具的配置
 * 2. 使用 React Query 为每个数据端点发起并行的数据请求
 * 3. 渲染页面布局，包括标题、统计卡片和可折叠的数据面板
 * 4. 管理折叠面板的展开/收起状态
 * 5. 根据配置，为每个面板渲染对应的数据预览（使用 `DataSection`）或工具链接
 * 
 * 页面结构：
 * - 页面标题区域（带动画效果）
 * - 数据统计卡片区域（4个主要数据类别的数量统计）
 * - 可折叠数据面板区域（所有数据类别和工具的详细展示）
 * 
 * @returns 渲染的杂项页面
 */
const Miscellaneous = () => {
  const { t } = useTranslation('miscellaneous');
  // 控制折叠面板的展开状态
  const [activeKeys, setActiveKeys] = useState<string[]>(['chatframes']);
  // 获取所有数据配置
  const dataConfigs = getDataConfigs(t);

  // 为每个数据类型创建查询
  const queries = dataConfigs.map((config) => {
    // 对于工具类配置，不发起API请求
    if (!config.endpoint) {
      return { data: [], isLoading: false, error: null };
    }
    // 使用React Query获取数据
    return useQuery({
      queryKey: [config.key],
      queryFn: () => fetchData(config.endpoint),
      // 移除懒加载限制，页面加载时就获取所有数据的条数
    });
  });

  /**
   * 处理面板展开/收起状态变化
   * 
   * @param keys - 当前展开的面板key数组或单个key
   */
  const handlePanelChange = (keys: string | string[]) => {
    const newKeys = Array.isArray(keys) ? keys : [keys];
    setActiveKeys(newKeys);
  };

  return (
    <Layout>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title
            level={1}
            style={{
              margin: 0,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '32px',
            }}
          >
            {t('title')}
          </Title>
          <Paragraph style={{ fontSize: '16px', color: 'var(--text-color)', marginTop: 8 }}>
            {t('subtitle')}
          </Paragraph>
        </motion.div>

        {/* 数据统计 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Row gutter={[16, 16]}>
            {dataConfigs.slice(0, 4).map((config, index) => {
              const query = queries[index];
              const IconComponent = config.icon;

              return (
                <Col xs={24} sm={12} md={6} key={config.key}>
                  <Card style={{ borderRadius: 12, textAlign: 'center' }}>
                    <Space direction="vertical" size="small">
                      <Avatar
                        size={48}
                        style={{ backgroundColor: config.color }}
                        icon={<IconComponent size={24} />}
                      />
                      <div>
                        <Text strong style={{ fontSize: '16px' }}>
                          {config.title}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {t('data_count', { count: query.data?.length || 0 })}
                        </Text>
                      </div>
                    </Space>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </motion.div>

        {/* 数据展示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Collapse
            activeKey={activeKeys}
            onChange={handlePanelChange}
            size="large"
            style={{ background: 'transparent' }}
            items={dataConfigs.map((config, index) => {
              const query = queries[index];
              const IconComponent = config.icon;

              return {
                key: config.key,
                label: (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar
                      size={32}
                      style={{ backgroundColor: config.color }}
                      icon={<IconComponent size={16} />}
                    />
                    <div>
                      <Text strong style={{ fontSize: '16px' }}>
                        {config.title}
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {config.description}
                      </Text>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                      <Tag color={config.color}>{query.data?.length || 0} 条</Tag>
                    </div>
                  </div>
                ),
                children:
                  config.key === 'image-compressor' ? (
                    <div style={{ padding: '16px' }}>
                      <a href="/app/image-compressor" target="_blank" rel="noopener noreferrer">
                        <Button type="primary">{t('open_image_compressor')}</Button>
                      </a>
                    </div>
                  ) : config.key === 'character-analyzer' ? (
                    <div style={{ padding: '16px' }}>
                      <a
                        href="/app/miscellaneous/character-analyzer"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button type="primary">{t('open_character_analyzer')}</Button>
                      </a>
                    </div>
                  ) : config.key === 'poster' ? (
                    <div style={{ padding: '16px' }}>
                      <a href="/app/miscellaneous/poster" target="_blank" rel="noopener noreferrer">
                        <Button type="primary">{t('open_poster_analyzer')}</Button>
                      </a>
                    </div>
                  ) : config.key === 'exp-calculator' ? (
                    <div style={{ padding: '16px' }}>
                      <a
                        href="/app/miscellaneous/exp-calculator"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button type="primary">{t('open_exp_calculator')}</Button>
                      </a>
                    </div>
                  ) : (
                    <DataSection
                      config={config}
                      data={query.data || []}
                      loading={query.isLoading}
                      error={query.error}
                    />
                  ),
                style: {
                  marginBottom: 16,
                  borderRadius: 12,
                  border: `1px solid ${config.color}30`,
                  background: `${config.color}05`,
                },
              };
            })}
          />
        </motion.div>
      </Space>
    </Layout>
  );
};

export default Miscellaneous;