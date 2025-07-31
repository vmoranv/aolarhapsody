import { useQuery } from '@tanstack/react-query';
import {
  Card,
  Col,
  Empty,
  Pagination,
  Row,
  Space,
  Statistic,
  Tag,
  theme,
  Tooltip,
  Typography,
} from 'antd';
import { motion } from 'framer-motion';
import { Database, Package, Star, TrendingUp } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import ErrorDisplay from '../components/ErrorDisplay';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchAndFilter from '../components/SearchAndFilter';
import { useTheme } from '../hooks/useTheme';
import { useQualityColor, useStatusColor } from '../theme/colors';
import { fetchData, filterBySearch, filterByType, paginateData } from '../utils/api';

const { Title, Paragraph, Text } = Typography;

// Tote数据类型
interface Tote {
  id: number;
  name: string;
  type: number;
  quality: number;
  price: number;
  rmb: number;
  level: number;
  desc: string;
  category: string;
  rarity: number;
}

const getQualityText = (quality: number) => {
  const texts = {
    1: '普通',
    2: '优秀',
    3: '稀有',
    4: '史诗',
    5: '传说',
  };
  return texts[quality as keyof typeof texts] || '未知';
};

const getRarityText = (rarity: number) => {
  const texts = {
    1: '常见',
    2: '少见',
    3: '稀有',
    4: '极稀有',
    5: '传说',
  };
  return texts[rarity as keyof typeof texts] || '未知';
};

const ToteCard: React.FC<{ tote: Tote; index: number }> = ({ tote, index }) => {
  const { token } = theme.useToken();
  const qualityColor = useQualityColor(tote.quality);

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
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.3 }}>
              <Package size={48} color="white" />
            </motion.div>

            {/* 品质标识 */}
            <div style={{ position: 'absolute', top: 10, right: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {Array.from({ length: tote.quality }, (_, i) => (
                  <Star key={i} size={12} color="white" fill="white" />
                ))}
              </div>
            </div>

            {/* 类型标识 */}
            <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
              <Tag
                color="white"
                style={{ color: qualityColor, fontWeight: 'bold', fontSize: '10px' }}
              >
                类型 {tote.type}
              </Tag>
            </div>
          </div>
        }
      >
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={4} style={{ margin: 0, color: token.colorText }}>
              {tote.name}
            </Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              ID: {tote.id}
            </Text>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 8 }}>
            <Tag color={qualityColor} style={{ borderRadius: 12 }}>
              <Star size={12} style={{ marginRight: 4 }} />
              {getQualityText(tote.quality)}
            </Tag>
            <Tag color="blue" style={{ borderRadius: 12 }}>
              {getRarityText(tote.rarity)}
            </Tag>
          </div>

          {/* 价格和等级信息 */}
          <Row gutter={[8, 8]} style={{ marginTop: 12 }}>
            <Col span={12}>
              <Statistic
                title="金币"
                value={tote.price}
                valueStyle={{ fontSize: '14px', color: useStatusColor('warning') }}
                prefix="💰"
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="RMB"
                value={tote.rmb}
                valueStyle={{ fontSize: '14px', color: useStatusColor('error') }}
                prefix="¥"
              />
            </Col>
          </Row>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: '12px', color: token.colorTextSecondary }}>
              等级: {tote.level}
            </Text>
            {tote.category && (
              <Tag color="geekblue" style={{ fontSize: '12px' }}>
                {tote.category}
              </Tag>
            )}
          </div>

          {tote.desc && (
            <Tooltip title={tote.desc}>
              <Text
                style={{
                  fontSize: '12px',
                  color: token.colorTextTertiary,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {tote.desc}
              </Text>
            </Tooltip>
          )}
        </Space>
      </Card>
    </motion.div>
  );
};

const Tote = () => {
  const { colors } = useTheme()!;
  const [searchValue, setSearchValue] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'super' | 'normal'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;

  const {
    data: totes = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['totes'],
    queryFn: () => fetchData<Tote>('totes/data'),
  });

  // Handle success and error states
  React.useEffect(() => {
    if (error) {
      toast.error(`加载失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [error]);

  React.useEffect(() => {
    if (totes.length > 0) {
      toast.success('Tote数据加载成功！');
    }
  }, [totes]);

  // 筛选和搜索逻辑
  const filteredTotes = useMemo(() => {
    let filtered = totes;

    // 按品质筛选
    filtered = filterByType(filtered, filterType, 'quality');

    // 按名称搜索
    filtered = filterBySearch(filtered, searchValue, (tote) => [
      tote.desc || '',
      tote.category || '',
    ]);

    return filtered;
  }, [totes, searchValue, filterType]);

  // 分页数据
  const paginatedTotes = useMemo(() => {
    return paginateData(filteredTotes, currentPage, pageSize);
  }, [filteredTotes, currentPage, pageSize]);

  // 重置搜索和筛选
  const handleReset = () => {
    setSearchValue('');
    setFilterType('all');
    setCurrentPage(1);
  };

  // 统计数据
  const stats = useMemo(() => {
    const superTotes = totes.filter((tote) => tote.quality >= 4);
    const normalTotes = totes.filter((tote) => tote.quality < 4);
    const avgPrice =
      totes.length > 0
        ? Math.round(totes.reduce((sum, tote) => sum + tote.price, 0) / totes.length)
        : 0;

    return {
      total: totes.length,
      super: superTotes.length,
      normal: normalTotes.length,
      avgPrice,
    };
  }, [totes]);

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner text="正在加载Tote数据..." />
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
              background: 'linear-gradient(135deg, #eb2f96 0%, #f759ab 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '32px',
            }}
          >
            Tote系统
          </Title>
          <Paragraph style={{ fontSize: '16px', color: colors.textSecondary, marginTop: 8 }}>
            收集各种珍贵的Tote物品，丰富你的收藏
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
                  title="总数量"
                  value={stats.total}
                  prefix={<Database size={20} color={colors.info} />}
                  valueStyle={{ color: colors.info }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ borderRadius: 12 }}>
                <Statistic
                  title="高品质"
                  value={stats.super}
                  prefix={<Star size={20} color={colors.warning} />}
                  valueStyle={{ color: colors.warning }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ borderRadius: 12 }}>
                <Statistic
                  title="普通品质"
                  value={stats.normal}
                  prefix={<Package size={20} color={colors.success} />}
                  valueStyle={{ color: colors.success }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ borderRadius: 12 }}>
                <Statistic
                  title="平均价格"
                  value={stats.avgPrice}
                  prefix={<TrendingUp size={20} color={colors.secondary} />}
                  valueStyle={{ color: colors.secondary }}
                  suffix="金币"
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
          totalCount={totes.length}
          filteredCount={filteredTotes.length}
        />

        {/* Tote网格 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {paginatedTotes.length > 0 ? (
            <>
              <Row gutter={[16, 16]}>
                {paginatedTotes.map((tote, index) => (
                  <Col xs={24} sm={12} md={8} lg={6} xl={4} key={tote.id}>
                    <ToteCard tote={tote} index={index} />
                  </Col>
                ))}
              </Row>

              {filteredTotes.length > pageSize && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 32,
                  }}
                >
                  <Pagination
                    current={currentPage}
                    total={filteredTotes.length}
                    pageSize={pageSize}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total, range) =>
                      `第 ${range[0]}-${range[1]} 条，共 ${total} 个Tote`
                    }
                  />
                </motion.div>
              )}
            </>
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
                    {searchValue || filterType !== 'all' ? '没有找到匹配的Tote' : '暂无Tote数据'}
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

export default Tote;
