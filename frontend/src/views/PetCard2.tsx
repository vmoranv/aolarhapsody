import { useQuery } from '@tanstack/react-query';
import {
  Card,
  Col,
  Divider,
  Empty,
  Pagination,
  Row,
  Space,
  Switch,
  Tag,
  theme,
  Tooltip,
  Typography,
} from 'antd';
import { motion } from 'framer-motion';
import { Clock, Coins, DollarSign, Gem, Star, Users } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import ErrorDisplay from '../components/ErrorDisplay';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchAndFilter from '../components/SearchAndFilter';
import { useTheme } from '../hooks/useTheme';
import { useQualityColor, useStatusColor } from '../theme/colors';

const { Title, Paragraph, Text } = Typography;

// 特性晶石数据类型
interface PetCard2 {
  cardId: number;
  name: string;
  trade: boolean;
  vip: number;
  isLimitedTime: boolean;
  price: number;
  rmb: number;
  level: number;
  applyId: number;
  baseExp: number;
  levelExpArea: number[];
  raceList: number[];
  viewId: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
  timestamp: string;
}

const fetchPetCard2s = async (): Promise<PetCard2[]> => {
  const response = await fetch('/api/petcard2s');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result: ApiResponse<PetCard2[]> = await response.json();
  if (result.success && Array.isArray(result.data)) {
    return result.data;
  } else {
    throw new Error(result.error || '获取特性晶石数据失败');
  }
};

const getVipText = (vip: number) => {
  if (vip === 0) {
    return '普通';
  }
  return `VIP${vip}`;
};

/**
 * 特性晶石卡片组件
 * @param petCard2 - 单个特性晶石的数据
 * @param index - 卡片在列表中的索引，用于动画延迟
 */
const PetCard2Card: React.FC<{ petCard2: PetCard2; index: number }> = ({ petCard2, index }) => {
  const { token } = theme.useToken();
  const vipColor = useQualityColor(petCard2.vip);

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
          border: `2px solid ${vipColor}`,
          background: `linear-gradient(135deg, ${vipColor}10 0%, ${vipColor}05 100%)`,
          boxShadow: `0 4px 12px ${vipColor}30`,
          height: '100%',
        }}
        cover={
          <div
            style={{
              height: 120,
              background: `linear-gradient(135deg, ${vipColor} 0%, ${vipColor}dd 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <motion.div whileHover={{ scale: 1.1, rotate: 10 }} transition={{ duration: 0.3 }}>
              <Gem size={48} color="white" />
            </motion.div>

            {/* VIP标识 */}
            <div style={{ position: 'absolute', top: 10, right: 10 }}>
              <Tag color="white" style={{ color: vipColor, fontWeight: 'bold' }}>
                {getVipText(petCard2.vip)}
              </Tag>
            </div>

            {/* 限时标识 */}
            {petCard2.isLimitedTime && (
              <div style={{ position: 'absolute', top: 10, left: 10 }}>
                <Tag color="red" style={{ fontSize: '10px' }}>
                  <Clock size={10} style={{ marginRight: 2 }} />
                  限时
                </Tag>
              </div>
            )}
          </div>
        }
      >
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={4} style={{ margin: 0, color: token.colorText }}>
              {petCard2.name}
            </Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              ID: {petCard2.cardId}
            </Text>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 8 }}>
            <Tag color={vipColor} style={{ borderRadius: 12 }}>
              <Star size={12} style={{ marginRight: 4 }} />
              等级 {petCard2.level}
            </Tag>
            {petCard2.trade && (
              <Tag color="green" style={{ borderRadius: 12 }}>
                可交易
              </Tag>
            )}
          </div>

          <Divider style={{ margin: '12px 0' }} />

          {/* 价格信息 */}
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Coins size={14} color={useStatusColor('warning')} />
                <Text style={{ fontSize: '12px' }}>金币: {petCard2.price}</Text>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <DollarSign size={14} color={useStatusColor('error')} />
                <Text style={{ fontSize: '12px' }}>RMB: {petCard2.rmb}</Text>
              </div>
            </Col>
          </Row>

          {/* 经验信息 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: '12px', color: token.colorTextSecondary }}>
              基础经验: {petCard2.baseExp}
            </Text>
            <Text style={{ fontSize: '12px', color: token.colorTextSecondary }}>
              应用ID: {petCard2.applyId}
            </Text>
          </div>

          {/* 种族限制 */}
          {petCard2.raceList && petCard2.raceList.length > 0 && (
            <div>
              <Text style={{ fontSize: '12px', fontWeight: 'bold', color: token.colorText }}>
                <Users size={12} style={{ marginRight: 4 }} />
                适用种族: {petCard2.raceList.length} 个
              </Text>
              <div style={{ marginTop: 4 }}>
                {petCard2.raceList.slice(0, 5).map((raceId) => (
                  <Tag key={raceId} style={{ margin: '2px', fontSize: '12px' }}>
                    {raceId}
                  </Tag>
                ))}
                {petCard2.raceList.length > 5 && (
                  <Tag style={{ margin: '2px', fontSize: '12px' }}>
                    +{petCard2.raceList.length - 5}
                  </Tag>
                )}
              </div>
            </div>
          )}

          {/* 经验区间 */}
          {petCard2.levelExpArea && petCard2.levelExpArea.length > 0 && (
            <Tooltip title={`经验区间: ${petCard2.levelExpArea.join(', ')}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Text style={{ fontSize: '12px', color: token.colorTextTertiary }}>
                  经验区间: {petCard2.levelExpArea.length} 个等级
                </Text>
              </div>
            </Tooltip>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
            <Text style={{ fontSize: '11px', color: token.colorTextTertiary }}>
              视图ID: {petCard2.viewId}
            </Text>
          </div>
        </Space>
      </Card>
    </motion.div>
  );
};

const PetCard2 = () => {
  const { colors } = useTheme()!;
  const [searchValue, setSearchValue] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'super' | 'normal'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showTradeableOnly, setShowTradeableOnly] = useState(false);
  const [showLimitedTimeOnly, setShowLimitedTimeOnly] = useState(false);
  const pageSize = 24;

  const {
    data: petCard2s = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['pet-card2s'],
    queryFn: fetchPetCard2s,
  });

  // Handle success and error states
  React.useEffect(() => {
    if (error) {
      toast.error(`加载失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [error]);

  React.useEffect(() => {
    if (petCard2s.length > 0) {
      toast.success('特性晶石数据加载成功！');
    }
  }, [petCard2s]);

  // 筛选和搜索逻辑
  const filteredPetCard2s = useMemo(() => {
    let filtered = petCard2s;

    // 按VIP等级筛选
    if (filterType === 'super') {
      filtered = filtered.filter((card) => card.vip >= 3);
    } else if (filterType === 'normal') {
      filtered = filtered.filter((card) => card.vip < 3);
    }

    // 可交易筛选
    if (showTradeableOnly) {
      filtered = filtered.filter((card) => card.trade);
    }

    // 限时筛选
    if (showLimitedTimeOnly) {
      filtered = filtered.filter((card) => card.isLimitedTime);
    }

    // 按名称搜索
    if (searchValue.trim()) {
      filtered = filtered.filter(
        (card) =>
          card.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          card.cardId.toString().includes(searchValue) ||
          card.raceList.some((raceId) => raceId.toString().includes(searchValue))
      );
    }

    return filtered;
  }, [petCard2s, searchValue, filterType, showTradeableOnly, showLimitedTimeOnly]);

  // 分页数据
  const paginatedPetCard2s = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredPetCard2s.slice(startIndex, startIndex + pageSize);
  }, [filteredPetCard2s, currentPage, pageSize]);

  // 重置搜索和筛选
  const handleReset = () => {
    setSearchValue('');
    setFilterType('all');
    setShowTradeableOnly(false);
    setShowLimitedTimeOnly(false);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner text="正在加载特性晶石数据..." />
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
              background: 'linear-gradient(135deg, #13c2c2 0%, #36cfc9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '32px',
            }}
          >
            特性晶石系统
          </Title>
          <Paragraph style={{ fontSize: '16px', color: colors.textSecondary, marginTop: 8 }}>
            收集珍贵的特性晶石，提升亚比的特殊能力
          </Paragraph>
        </motion.div>

        {/* 额外筛选选项 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card style={{ borderRadius: 12 }}>
            <Space wrap>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Text>仅显示可交易:</Text>
                <Switch checked={showTradeableOnly} onChange={setShowTradeableOnly} size="small" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Text>仅显示限时:</Text>
                <Switch
                  checked={showLimitedTimeOnly}
                  onChange={setShowLimitedTimeOnly}
                  size="small"
                />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  可交易: {petCard2s.filter((c) => c.trade).length} | 限时:{' '}
                  {petCard2s.filter((c) => c.isLimitedTime).length}
                </Text>
              </div>
            </Space>
          </Card>
        </motion.div>

        {/* 搜索和筛选 */}
        <SearchAndFilter
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filterType={filterType}
          onFilterChange={setFilterType}
          onReset={handleReset}
          totalCount={petCard2s.length}
          filteredCount={filteredPetCard2s.length}
        />

        {/* 特性晶石网格 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {paginatedPetCard2s.length > 0 ? (
            <>
              <Row gutter={[16, 16]}>
                {paginatedPetCard2s.map((petCard2, index) => (
                  <Col xs={24} sm={12} md={8} lg={6} xl={4} key={petCard2.cardId}>
                    <PetCard2Card petCard2={petCard2} index={index} />
                  </Col>
                ))}
              </Row>

              {filteredPetCard2s.length > pageSize && (
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
                    total={filteredPetCard2s.length}
                    pageSize={pageSize}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total, range) =>
                      `第 ${range[0]}-${range[1]} 条，共 ${total} 个特性晶石`
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
                    {searchValue || filterType !== 'all' || showTradeableOnly || showLimitedTimeOnly
                      ? '没有找到匹配的特性晶石'
                      : '暂无特性晶石数据'}
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

export default PetCard2;
