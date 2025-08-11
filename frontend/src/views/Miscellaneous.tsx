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
import React, { useState } from 'react';
// import toast from 'react-hot-toast';
import Layout from '../components/Layout';

const { Title, Paragraph, Text } = Typography;

// 通用API响应类型
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
  timestamp: string;
}

// 这些接口定义在运行时通过any类型处理，不需要具体的TypeScript接口定义

// 数据获取函数
const createFetcher =
  <T,>(endpoint: string) =>
  async (): Promise<T[]> => {
    const response = await fetch(`/api/${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result: ApiResponse<T[]> = await response.json();
    if (result.success && Array.isArray(result.data)) {
      return result.data;
    } else {
      throw new Error(result.error || `获取${endpoint}数据失败`);
    }
  };

// 数据配置
const dataConfigs = [
  {
    key: 'chatframes',
    title: '聊天框',
    icon: MessageCircle,
    color: '#1890ff',
    endpoint: 'chatframes',
    description: '各种聊天框装饰',
  },
  {
    key: 'clothes',
    title: '服装',
    icon: Shirt,
    color: '#722ed1',
    endpoint: 'clothes',
    description: '亚比服装装扮',
  },
  {
    key: 'galaxyfleetmarks',
    title: '银河舰队徽章',
    icon: Award,
    color: '#fa8c16',
    endpoint: 'galaxyfleetmarks',
    description: '银河舰队专属徽章',
  },
  {
    key: 'headframes',
    title: '头像框',
    icon: Image,
    color: '#52c41a',
    endpoint: 'headframes',
    description: '个性化头像框',
  },
  {
    key: 'icondata',
    title: '图标数据',
    icon: Package,
    color: '#13c2c2',
    endpoint: 'headicons',
    description: '游戏内图标资源',
  },
  {
    key: 'items',
    title: '道具',
    icon: Sparkles,
    color: '#eb2f96',
    endpoint: 'items',
    description: '各种游戏道具',
  },
  {
    key: 'miracles',
    title: '奇迹',
    icon: Gem,
    color: '#f5222d',
    endpoint: 'miracle/awake',
    description: '神秘的奇迹力量',
  },
  {
    key: 'petstones',
    title: '宠物石',
    icon: Gem,
    color: '#faad14',
    endpoint: 'evolutionstones',
    description: '亚比进化石头',
  },
  {
    key: 'pettalks',
    title: '宠物对话',
    icon: MessageSquare,
    color: '#a0d911',
    endpoint: 'pettalks',
    description: '亚比的对话内容',
  },
  {
    key: 'petterritoryfights',
    title: '宠物领地战',
    icon: Swords,
    color: '#ff4d4f',
    endpoint: 'petterritoryfights',
    description: '领地争夺战数据',
  },
  {
    key: 'pmevolinks',
    title: '进化链接',
    icon: Link,
    color: '#9254de',
    endpoint: 'spevo',
    description: '亚比进化关联',
  },
  {
    key: 'summoners',
    title: '召唤师技能',
    icon: Zap,
    color: '#ff7a45',
    endpoint: 'summonerskills',
    description: '召唤师专属技能',
  },
  {
    key: 'tasks',
    title: '任务',
    icon: CheckSquare,
    color: '#36cfc9',
    endpoint: 'tasks/starters',
    description: '游戏任务系统',
  },
  {
    key: 'image-compressor',
    title: '图片裁剪压缩',
    icon: Crop,
    color: '#f759ab',
    endpoint: '', // No endpoint for this tool
    description: '一个用于裁剪和压缩图片的前端工具',
  },
  {
    key: 'character-analyzer',
    title: '性格解析',
    icon: BrainCircuit,
    color: '#13a8a8',
    endpoint: '', // No endpoint for this tool
    description: '分析宠物性格对战斗属性的影响',
  },
];

// 数据展示组件
const DataSection: React.FC<{
  config: (typeof dataConfigs)[0];
  data: any[];
  loading: boolean;
  error: any;
}> = ({ config, data, loading, error }) => {
  const IconComponent = config.icon;

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
            <Text type="secondary">正在加载{config.title}数据...</Text>
          </div>
        </div>
      </Card>
    );
  }

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
          message="加载失败"
          description={error instanceof Error ? error.message : String(error)}
          type="error"
          showIcon
        />
      </Card>
    );
  }

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
                        金币: {item.price}
                      </Tag>
                      {item.rmb && (
                        <Tag color="red" style={{ fontSize: '12px' }}>
                          RMB: {item.rmb}
                        </Tag>
                      )}
                    </div>
                  )}
                  {item.cost && (
                    <Tag color="purple" style={{ fontSize: '12px' }}>
                      消耗: {item.cost}
                    </Tag>
                  )}
                  {item.levelLimit && (
                    <Tag color="green" style={{ fontSize: '12px' }}>
                      等级限制: {item.levelLimit}
                    </Tag>
                  )}
                </div>
              }
            />
          </List.Item>
        )}
        locale={{
          emptyText: (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={`暂无${config.title}数据`} />
          ),
        }}
      />
      {data.length > 10 && (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text type="secondary">还有 {data.length - 10} 条数据未显示...</Text>
        </div>
      )}
    </Card>
  );
};

const Miscellaneous = () => {
  const [activeKeys, setActiveKeys] = useState<string[]>(['chatframes']);

  // 为每个数据类型创建查询
  const queries = dataConfigs.map((config) => {
    if (!config.endpoint) {
      return { data: [], isLoading: false, error: null };
    }
    const fetcher = createFetcher(config.endpoint);
    return useQuery({
      queryKey: [config.key],
      queryFn: fetcher,
      // 移除懒加载限制，页面加载时就获取所有数据的条数
    });
  });

  // 处理面板变化
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
            杂项数据
          </Title>
          <Paragraph style={{ fontSize: '16px', color: 'var(--text-color)', marginTop: 8 }}>
            探索奥拉星世界中的各种辅助数据和系统信息
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
                          {query.data?.length || 0} 条数据
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
                        <Button type="primary">打开图片裁剪压缩工具</Button>
                      </a>
                    </div>
                  ) : config.key === 'character-analyzer' ? (
                    <div style={{ padding: '16px' }}>
                      <a href="/app/miscellaneous/character-analyzer" target="_blank" rel="noopener noreferrer">
                        <Button type="primary">打开性格解析工具</Button>
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
