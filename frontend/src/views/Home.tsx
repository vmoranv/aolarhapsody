import { useQuery } from '@tanstack/react-query';
import { Card, Col, Empty, Row, Space, Statistic, Typography } from 'antd';
import { motion } from 'framer-motion';
import { Database, Star, TrendingUp, Zap } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import AttributeCard from '../components/AttributeCard';
import ErrorDisplay from '../components/ErrorDisplay';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchAndFilter from '../components/SearchAndFilter';
import { useTheme } from '../hooks/useTheme';
import { getAttributeIconUrl } from '../utils/attribute-helper';
import { getPetImageUrls } from '../utils/pet-helper';

const { Title, Paragraph } = Typography;

// 与后端 ProcessedAttribute 类型匹配
type Attribute = {
  id: number;
  name: string;
  isSuper: boolean;
};

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
  timestamp: string;
}

const fetchAttributes = async (): Promise<Attribute[]> => {
  const response = await fetch('/api/skill-attributes');

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result: ApiResponse<Attribute[]> = await response.json();

  if (result.success && Array.isArray(result.data)) {
    return result.data;
  } else {
    throw new Error(result.error || '获取数据失败或数据格式不正确');
  }
};

const Home = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'super' | 'normal'>('all');
  const { colors } = useTheme()!;

  const {
    data: attributes = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['attributes'],
    queryFn: fetchAttributes,
  });

  // Handle success and error states
  React.useEffect(() => {
    if (error) {
      toast.error(`加载失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [error]);

  React.useEffect(() => {
    if (attributes.length > 0) {
      toast.success('数据加载成功！');
    }
  }, [attributes]);

  // 筛选和搜索逻辑
  const filteredAttributes = useMemo(() => {
    let filtered = attributes;

    // 按类型筛选
    if (filterType === 'super') {
      filtered = filtered.filter((attr) => attr.isSuper);
    } else if (filterType === 'normal') {
      filtered = filtered.filter((attr) => !attr.isSuper);
    }

    // 按名称搜索
    if (searchValue.trim()) {
      filtered = filtered.filter(
        (attr) =>
          attr.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          attr.id.toString().includes(searchValue)
      );
    }

    return filtered;
  }, [attributes, searchValue, filterType]);

  // 统计数据
  const superAttributes = attributes.filter((attr) => attr.isSuper);
  const normalAttributes = attributes.filter((attr) => !attr.isSuper);

  // 重置搜索和筛选
  const handleReset = () => {
    setSearchValue('');
    setFilterType('all');
  };

  // 调试代码
  React.useEffect(() => {
    console.log('--- 调试图片URL生成 ---');
    console.log('亚比ID为 1 的图片URL:', getPetImageUrls(1));
    console.log('亚比ID为 4399 的图片URL:', getPetImageUrls(4399));
    console.log('----------------------');
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner text="正在加载技能属性数据..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorDisplay
          error={error instanceof Error ? error.message : String(error)}
          onRetry={() => refetch()}
        />
      </Layout>
    );
  }

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
            奥拉星属性系统
          </Title>
          <Paragraph style={{ fontSize: '16px', color: colors.textSecondary, marginTop: 8 }}>
            探索奥拉星世界中丰富多彩的属性系统，了解每个属性的独特特征
          </Paragraph>
        </motion.div>

        {/* 统计卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ borderRadius: 12 }}>
                <Statistic
                  title="总属性数量"
                  value={attributes.length}
                  prefix={<Database size={20} color={colors.primary} />}
                  valueStyle={{ color: colors.primary }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ borderRadius: 12 }}>
                <Statistic
                  title="超级属性"
                  value={superAttributes.length}
                  prefix={<Star size={20} color="#faad14" />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ borderRadius: 12 }}>
                <Statistic
                  title="普通属性"
                  value={normalAttributes.length}
                  prefix={<Zap size={20} color="#52c41a" />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ borderRadius: 12 }}>
                <Statistic
                  title="覆盖率"
                  value={((superAttributes.length / attributes.length) * 100).toFixed(1)}
                  suffix="%"
                  prefix={<TrendingUp size={20} color="#722ed1" />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
          </Row>
        </motion.div>

        {/* 搜索和筛选 */}
        <SearchAndFilter
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filterType={filterType}
          onFilterChange={setFilterType}
          onReset={handleReset}
          totalCount={attributes.length}
          filteredCount={filteredAttributes.length}
        />

        {/* 属性网格 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Title level={3} style={{ marginBottom: 24, color: colors.text }}>
            属性列表
          </Title>

          {filteredAttributes.length > 0 ? (
            <Row gutter={[16, 16]}>
              {filteredAttributes.map((attr, index) => (
                <Col xs={24} sm={12} md={8} lg={6} xl={4} key={attr.id}>
                  <AttributeCard
                    attribute={attr}
                    imageUrl={getAttributeIconUrl(attr.id)}
                    index={index}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span style={{ color: colors.textSecondary }}>
                    {searchValue || filterType !== 'all' ? '没有找到匹配的属性' : '暂无属性数据'}
                  </span>
                }
                style={{
                  padding: '60px 20px',
                  background: colors.surface,
                  borderRadius: 12,
                  border: `1px solid ${colors.borderSecondary}`,
                }}
              />
            </motion.div>
          )}
        </motion.div>
      </Space>
    </Layout>
  );
};

export default Home;
