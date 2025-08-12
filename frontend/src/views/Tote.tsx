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
import { useTranslation } from 'react-i18next';
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

const getQualityText = (quality: number, t: (key: string) => string) => {
  const texts: { [key: number]: string } = {
    1: t('quality_common'),
    2: t('quality_excellent'),
    3: t('quality_rare'),
    4: t('quality_epic'),
    5: t('quality_legendary'),
  };
  return texts[quality] || t('quality_unknown');
};

const getRarityText = (rarity: number, t: (key: string) => string) => {
  const texts: { [key: number]: string } = {
    1: t('rarity_common'),
    2: t('rarity_uncommon'),
    3: t('rarity_rare'),
    4: t('rarity_very_rare'),
    5: t('rarity_legendary'),
  };
  return texts[rarity] || t('rarity_unknown');
};

const ToteCard: React.FC<{ tote: Tote; index: number }> = ({ tote, index }) => {
  const { t } = useTranslation('tote');
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
                {t('type', { type: tote.type })}
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
              {getQualityText(tote.quality, t)}
            </Tag>
            <Tag color="blue" style={{ borderRadius: 12 }}>
              {getRarityText(tote.rarity, t)}
            </Tag>
          </div>

          {/* 价格和等级信息 */}
          <Row gutter={[8, 8]} style={{ marginTop: 12 }}>
            <Col span={12}>
              <Statistic
                title={t('coins')}
                value={tote.price}
                valueStyle={{ fontSize: '14px', color: useStatusColor('warning') }}
                prefix="💰"
              />
            </Col>
            <Col span={12}>
              <Statistic
                title={t('rmb')}
                value={tote.rmb}
                valueStyle={{ fontSize: '14px', color: useStatusColor('error') }}
                prefix="¥"
              />
            </Col>
          </Row>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: '12px', color: token.colorTextSecondary }}>
              {t('level')}: {tote.level}
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
  const { t } = useTranslation('tote');
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
      toast.error(
        t('load_error', { message: error instanceof Error ? error.message : String(error) })
      );
    }
  }, [error, t]);

  React.useEffect(() => {
    if (totes.length > 0) {
      toast.success(t('load_success'));
    }
  }, [totes, t]);

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
        <LoadingSpinner text={t('loading_data')} />
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
            {t('page_title')}
          </Title>
          <Paragraph style={{ fontSize: '16px', color: colors.textSecondary, marginTop: 8 }}>
            {t('page_subtitle')}
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
                  title={t('stat_total')}
                  value={stats.total}
                  prefix={<Database size={20} color={colors.info} />}
                  valueStyle={{ color: colors.info }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ borderRadius: 12 }}>
                <Statistic
                  title={t('stat_high_quality')}
                  value={stats.super}
                  prefix={<Star size={20} color={colors.warning} />}
                  valueStyle={{ color: colors.warning }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ borderRadius: 12 }}>
                <Statistic
                  title={t('stat_normal_quality')}
                  value={stats.normal}
                  prefix={<Package size={20} color={colors.success} />}
                  valueStyle={{ color: colors.success }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ borderRadius: 12 }}>
                <Statistic
                  title={t('stat_avg_price')}
                  value={stats.avgPrice}
                  prefix={<TrendingUp size={20} color={colors.secondary} />}
                  valueStyle={{ color: colors.secondary }}
                  suffix={t('coins_suffix')}
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
          onFilterChange={(value) => setFilterType(value as 'all' | 'super' | 'normal')}
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
                      t('pagination_total', {
                        rangeStart: range[0],
                        rangeEnd: range[1],
                        total,
                      })
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
                    {searchValue || filterType !== 'all' ? t('no_results') : t('no_data')}
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
