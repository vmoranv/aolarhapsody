import { useQuery } from '@tanstack/react-query';
import {
  Avatar,
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
import { Database, Shield, Star, TrendingUp, Users, Zap } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import ErrorDisplay from '../components/ErrorDisplay';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchAndFilter from '../components/SearchAndFilter';
import { useTheme } from '../hooks/useTheme';
import { useQualityColor, useStatColor } from '../theme/colors';
import { fetchData, filterBySearch, filterByType, paginateData } from '../utils/api';

const { Title, Paragraph, Text } = Typography;

/**
 * PM数据列表项的数据类型定义
 */
interface PMDataListItem {
  id: number; // ID
  name: string; // 名称
  type: number; // 类型
  level: number; // 等级
  hp: number; // 生命值
  attack: number; // 攻击
  defend: number; // 防御
  sAttack: number; // 特殊攻击
  sDefend: number; // 特殊防御
  speed: number; // 速度
  rarity: number; // 稀有度
  element: string; // 属性
  category: string; // 类别
  desc: string; // 描述
}

/**
 * 根据稀有度值获取对应的文本描述
 * @param rarity - 稀有度值 (1-5)
 * @returns 返回稀有度的文本描述
 */
const getRarityText = (rarity: number, t: (key: string) => string) => {
  const texts: { [key: number]: string } = {
    1: t('rarity_common'),
    2: t('rarity_excellent'),
    3: t('rarity_rare'),
    4: t('rarity_epic'),
    5: t('rarity_legendary'),
  };
  return texts[rarity] || t('rarity_unknown');
};

const PMDataListCard: React.FC<{ pmData: PMDataListItem; index: number }> = ({ pmData, index }) => {
  const { t } = useTranslation('pmDataList');
  const { token } = theme.useToken();
  const rarityColor = useQualityColor(pmData.rarity);
  const elementColor = 'transparent';
  const hpColor = useStatColor('hp');
  const attackColor = useStatColor('attack');
  const defenseColor = useStatColor('defense');
  const spAttackColor = useStatColor('spAttack');
  const spDefenseColor = useStatColor('spDefense');
  const speedColor = useStatColor('speed');

  // 计算总战力
  const totalPower =
    pmData.hp + pmData.attack + pmData.defend + pmData.sAttack + pmData.sDefend + pmData.speed;

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
          border: `2px solid ${rarityColor}`,
          background: `linear-gradient(135deg, ${rarityColor}10 0%, ${rarityColor}05 100%)`,
          boxShadow: `0 4px 12px ${rarityColor}30`,
          height: '100%',
        }}
        cover={
          <div
            style={{
              height: 120,
              background: `linear-gradient(135deg, ${rarityColor} 0%, ${rarityColor}dd 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.3 }}>
              <Database size={48} color="white" />
            </motion.div>

            {/* 稀有度标识 */}
            <div style={{ position: 'absolute', top: 10, right: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {Array.from({ length: pmData.rarity }, (_, i) => (
                  <Star key={i} size={12} color="white" fill="white" />
                ))}
              </div>
            </div>

            {/* 等级标识 */}
            <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
              <Tag
                color="white"
                style={{ color: rarityColor, fontWeight: 'bold', fontSize: '10px' }}
              >
                Lv.{pmData.level}
              </Tag>
            </div>
          </div>
        }
      >
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={4} style={{ margin: 0, color: token.colorText }}>
              {pmData.name}
            </Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              ID: {pmData.id}
            </Text>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 8 }}>
            <Tag color={rarityColor} style={{ borderRadius: 12 }}>
              <Star size={12} style={{ marginRight: 4 }} />
              {getRarityText(pmData.rarity, t)}
            </Tag>
            {pmData.element && (
              <Tag color={elementColor} style={{ borderRadius: 12 }}>
                {pmData.element}
              </Tag>
            )}
          </div>

          {/* 属性展示 */}
          <Row gutter={[4, 4]} style={{ marginTop: 12 }}>
            <Col span={8}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar size={14} style={{ backgroundColor: hpColor, fontSize: '8px' }}>
                  HP
                </Avatar>
                <Text style={{ fontSize: '11px' }}>{pmData.hp}</Text>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar size={14} style={{ backgroundColor: attackColor, fontSize: '8px' }}>
                  <Zap size={8} />
                </Avatar>
                <Text style={{ fontSize: '11px' }}>{pmData.attack}</Text>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar size={14} style={{ backgroundColor: defenseColor, fontSize: '8px' }}>
                  <Shield size={8} />
                </Avatar>
                <Text style={{ fontSize: '11px' }}>{pmData.defend}</Text>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar size={14} style={{ backgroundColor: spAttackColor, fontSize: '8px' }}>
                  SA
                </Avatar>
                <Text style={{ fontSize: '11px' }}>{pmData.sAttack}</Text>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar size={14} style={{ backgroundColor: spDefenseColor, fontSize: '8px' }}>
                  SD
                </Avatar>
                <Text style={{ fontSize: '11px' }}>{pmData.sDefend}</Text>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar size={14} style={{ backgroundColor: speedColor, fontSize: '8px' }}>
                  SP
                </Avatar>
                <Text style={{ fontSize: '11px' }}>{pmData.speed}</Text>
              </div>
            </Col>
          </Row>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 8,
            }}
          >
            <Text style={{ fontSize: '12px', color: token.colorTextSecondary }}>
              {t('total_power')}: {totalPower}
            </Text>
            {pmData.category && (
              <Tag color="geekblue" style={{ fontSize: '12px' }}>
                {pmData.category}
              </Tag>
            )}
          </div>

          {pmData.desc && (
            <Tooltip title={pmData.desc}>
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
                {pmData.desc}
              </Text>
            </Tooltip>
          )}
        </Space>
      </Card>
    </motion.div>
  );
};

/**
 * PM数据列表页面组件
 * - 使用 React Query 获取数据
 * - 展示PM数据的统计信息
 * - 实现搜索、筛选和分页功能
 */
const PMDataList = () => {
  const { t } = useTranslation('pmDataList');
  const { colors } = useTheme()!;
  const [searchValue, setSearchValue] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'super' | 'normal'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;

  const {
    data: pmDataList = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['pm-data-list'],
    queryFn: () => fetchData<PMDataListItem>('pets'),
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
    if (pmDataList.length > 0) {
      toast.success(t('load_success'));
    }
  }, [pmDataList, t]);

  // 筛选和搜索逻辑
  const filteredPMData = useMemo(() => {
    let filtered = pmDataList;

    // 按稀有度筛选
    filtered = filterByType(filtered, filterType, 'rarity');

    // 按名称搜索
    filtered = filterBySearch(filtered, searchValue, (pmData) => [
      pmData.desc || '',
      pmData.element || '',
      pmData.category || '',
    ]);

    return filtered;
  }, [pmDataList, searchValue, filterType]);

  // 分页数据
  const paginatedPMData = useMemo(() => {
    return paginateData(filteredPMData, currentPage, pageSize);
  }, [filteredPMData, currentPage, pageSize]);

  // 重置搜索和筛选
  const handleReset = () => {
    setSearchValue('');
    setFilterType('all');
    setCurrentPage(1);
  };

  // 统计数据
  const stats = useMemo(() => {
    const superPM = pmDataList.filter((pm) => pm.rarity >= 4);
    const normalPM = pmDataList.filter((pm) => pm.rarity < 4);
    const avgPower =
      pmDataList.length > 0
        ? Math.round(
            pmDataList.reduce(
              (sum, pm) => sum + pm.hp + pm.attack + pm.defend + pm.sAttack + pm.sDefend + pm.speed,
              0
            ) / pmDataList.length
          )
        : 0;
    const elements = [...new Set(pmDataList.map((pm) => pm.element).filter(Boolean))];

    return {
      total: pmDataList.length,
      super: superPM.length,
      normal: normalPM.length,
      avgPower,
      elements: elements.length,
    };
  }, [pmDataList]);

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
              background: 'linear-gradient(135deg, #2f54eb 0%, #40a9ff 100%)',
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
                  title={t('stat_high_rarity')}
                  value={stats.super}
                  prefix={<Star size={20} color={colors.warning} />}
                  valueStyle={{ color: colors.warning }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ borderRadius: 12 }}>
                <Statistic
                  title={t('stat_avg_power')}
                  value={stats.avgPower}
                  prefix={<TrendingUp size={20} color={colors.secondary} />}
                  valueStyle={{ color: colors.secondary }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ borderRadius: 12 }}>
                <Statistic
                  title={t('stat_element_types')}
                  value={stats.elements}
                  prefix={<Users size={20} color={colors.success} />}
                  valueStyle={{ color: colors.success }}
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
          totalCount={pmDataList.length}
          filteredCount={filteredPMData.length}
        />

        {/* PM数据网格 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {paginatedPMData.length > 0 ? (
            <>
              <Row gutter={[16, 16]}>
                {paginatedPMData.map((pmData, index) => (
                  <Col xs={24} sm={12} md={8} lg={6} xl={4} key={pmData.id}>
                    <PMDataListCard pmData={pmData} index={index} />
                  </Col>
                ))}
              </Row>

              {filteredPMData.length > pageSize && (
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
                    total={filteredPMData.length}
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

export default PMDataList;
