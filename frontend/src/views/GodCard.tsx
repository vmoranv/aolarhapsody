import { useQuery } from '@tanstack/react-query';
import {
  Avatar,
  Card,
  Col,
  Divider,
  Empty,
  Pagination,
  Row,
  Space,
  Tag,
  theme,
  Tooltip,
  Typography,
} from 'antd';
import { motion } from 'framer-motion';
import { Crown, Shield, Star, Sword, Zap } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import ErrorDisplay from '../components/ErrorDisplay';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchAndFilter from '../components/SearchAndFilter';
import { useTheme } from '../hooks/useTheme';
import { useQualityColor, useStatColor, useStatusColor } from '../theme/colors';

const { Title, Paragraph, Text } = Typography;

// 神兵卡数据类型
interface GodCard {
  cardId: number;
  name: string;
  quality: number;
  hp: number;
  speed: number;
  attack: number;
  defend: number;
  sAttack: number;
  sDefend: number;
  desc: string;
  limitRaceId: number[];
  viewId: number;
  level: number;
  levelUpId: number;
  synthesisType: number;
  limitExtAppend: null;
  originCardId: number;
}

interface GodCardSuit {
  id: number;
  suitType: number;
  name: string;
  godCardidList: number[];
  dec: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
  timestamp: string;
}

const fetchGodCards = async (): Promise<GodCard[]> => {
  const response = await fetch('/api/godcards');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result: ApiResponse<GodCard[]> = await response.json();
  if (result.success && Array.isArray(result.data)) {
    return result.data;
  } else {
    throw new Error(result.error || 'Failed to fetch god card data');
  }
};

const fetchGodCardSuits = async (): Promise<GodCardSuit[]> => {
  const response = await fetch('/api/godcardsuits');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result: ApiResponse<GodCardSuit[]> = await response.json();
  if (result.success && Array.isArray(result.data)) {
    return result.data;
  } else {
    throw new Error(result.error || 'Failed to fetch god card suit data');
  }
};

/**
 * 根据品质值获取对应的文本描述
 * @param quality - 品质值 (1-5)
 * @returns 返回品质的文本描述
 */
const getQualityText = (quality: number, t: (key: string) => string) => {
  const texts: { [key: number]: string } = {
    1: t('quality_common'),
    2: t('quality_uncommon'),
    3: t('quality_rare'),
    4: t('quality_epic'),
    5: t('quality_legendary'),
  };
  return texts[quality] || t('quality_unknown');
};

/**
 * 神兵卡片组件
 * @param godCard - 单个神兵的数据
 * @param index - 卡片在列表中的索引，用于动画延迟
 */
const GodCardCard: React.FC<{ godCard: GodCard; index: number }> = ({ godCard, index }) => {
  const { t } = useTranslation('godCard');
  const { token } = theme.useToken();
  const qualityColor = useQualityColor(godCard.quality);
  const attackColor = useStatColor('attack');
  const defenseColor = useStatColor('defense');
  const spAttackColor = useStatColor('spAttack');
  const spDefenseColor = useStatColor('spDefense');

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
              <Sword size={48} color="white" />
            </motion.div>

            {/* 品质标识 */}
            <div style={{ position: 'absolute', top: 10, right: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {Array.from({ length: godCard.quality }, (_, i) => (
                  <Star key={i} size={12} color="white" fill="white" />
                ))}
              </div>
            </div>
          </div>
        }
      >
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={4} style={{ margin: 0, color: token.colorText }}>
              {godCard.name}
            </Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              ID: {godCard.cardId}
            </Text>
            <div style={{ marginTop: 8 }}>
              <Tag color={qualityColor} style={{ borderRadius: 12 }}>
                <Star size={12} style={{ marginRight: 4 }} />
                {getQualityText(godCard.quality, t)}
              </Tag>
            </div>
          </div>

          <Divider style={{ margin: '12px 0' }} />

          {/* 属性展示 */}
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Avatar size={16} style={{ backgroundColor: attackColor }}>
                  <Zap size={10} />
                </Avatar>
                <Text style={{ fontSize: '12px' }}>
                  {t('attack')}: {godCard.attack}
                </Text>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Avatar size={16} style={{ backgroundColor: defenseColor }}>
                  <Shield size={10} />
                </Avatar>
                <Text style={{ fontSize: '12px' }}>
                  {t('defense')}: {godCard.defend}
                </Text>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Avatar size={16} style={{ backgroundColor: spAttackColor }}>
                  <Zap size={10} />
                </Avatar>
                <Text style={{ fontSize: '12px' }}>
                  {t('special_attack')}: {godCard.sAttack}
                </Text>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Avatar size={16} style={{ backgroundColor: spDefenseColor }}>
                  <Shield size={10} />
                </Avatar>
                <Text style={{ fontSize: '12px' }}>
                  {t('special_defense')}: {godCard.sDefend}
                </Text>
              </div>
            </Col>
          </Row>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: '12px', color: token.colorTextSecondary }}>
              {t('hp')}: {godCard.hp}
            </Text>
            <Text style={{ fontSize: '12px', color: token.colorTextSecondary }}>
              {t('speed')}: {godCard.speed}
            </Text>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: '12px', color: token.colorTextSecondary }}>
              {t('level')}: {godCard.level}
            </Text>
            <Text style={{ fontSize: '12px', color: token.colorTextSecondary }}>
              {t('view_id')}: {godCard.viewId}
            </Text>
          </div>

          {godCard.limitRaceId && godCard.limitRaceId.length > 0 && (
            <div>
              <Text style={{ fontSize: '12px', fontWeight: 'bold', color: token.colorText }}>
                {t('limit_race')}:
              </Text>
              <div style={{ marginTop: 4 }}>
                {godCard.limitRaceId.slice(0, 3).map((raceId) => (
                  <Tag key={raceId} style={{ margin: '2px', fontSize: '12px' }}>
                    {raceId}
                  </Tag>
                ))}
                {godCard.limitRaceId.length > 3 && (
                  <Tag style={{ margin: '2px', fontSize: '12px' }}>
                    +{godCard.limitRaceId.length - 3}
                  </Tag>
                )}
              </div>
            </div>
          )}

          {godCard.desc && (
            <Tooltip title={godCard.desc}>
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
                {godCard.desc}
              </Text>
            </Tooltip>
          )}
        </Space>
      </Card>
    </motion.div>
  );
};

const GodCardSuitCard: React.FC<{ suit: GodCardSuit; index: number }> = ({ suit, index }) => {
  const { t } = useTranslation('godCard');
  const { token } = theme.useToken();
  const suitColor = useStatusColor('warning'); // 使用警告色作为套装颜色

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
          border: `2px solid ${suitColor}`,
          background: `linear-gradient(135deg, ${suitColor}10 0%, ${suitColor}05 100%)`,
          boxShadow: `0 4px 12px ${suitColor}30`,
          height: '100%',
        }}
      >
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={4} style={{ margin: 0, color: token.colorText }}>
              <Crown size={16} style={{ marginRight: 8, color: suitColor }} />
              {suit.name}
            </Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {t('suit_id')}: {suit.id}
            </Text>
            <div style={{ marginTop: 8 }}>
              <Tag color={suitColor} style={{ borderRadius: 12 }}>
                {t('suit_type')}: {suit.suitType}
              </Tag>
            </div>
          </div>

          <Divider style={{ margin: '12px 0' }} />

          <div>
            <Text style={{ fontSize: '12px', fontWeight: 'bold', color: token.colorText }}>
              {t('includes_cards', { count: suit.godCardidList.length })}
            </Text>
            <div style={{ marginTop: 8 }}>
              {suit.godCardidList.map((id) => (
                <Tag key={id} style={{ margin: '2px', fontSize: '12px' }}>
                  {id}
                </Tag>
              ))}
            </div>
          </div>

          {suit.dec && (
            <Tooltip title={suit.dec}>
              <Text
                style={{
                  fontSize: '12px',
                  color: token.colorTextTertiary,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {suit.dec}
              </Text>
            </Tooltip>
          )}
        </Space>
      </Card>
    </motion.div>
  );
};

const GodCard = () => {
  const { t } = useTranslation('godCard');
  const { colors } = useTheme()!;
  const [searchValue, setSearchValue] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'super' | 'normal'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'cards' | 'suits'>('cards');
  const pageSize = 24;

  const {
    data: godCards = [],
    isLoading: cardsLoading,
    error: cardsError,
    refetch: refetchCards,
  } = useQuery({
    queryKey: ['god-cards'],
    queryFn: fetchGodCards,
  });

  const {
    data: suits = [],
    isLoading: suitsLoading,
    error: suitsError,
    refetch: refetchSuits,
  } = useQuery({
    queryKey: ['god-card-suits'],
    queryFn: fetchGodCardSuits,
  });

  const isLoading = cardsLoading || suitsLoading;
  const error = cardsError || suitsError;

  // Handle success and error states
  React.useEffect(() => {
    if (error) {
      toast.error(`${t('load_failed')}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [error, t]);

  React.useEffect(() => {
    if (godCards.length > 0 || suits.length > 0) {
      toast.success(t('load_success'));
    }
  }, [godCards, suits, t]);

  // 筛选和搜索逻辑
  const filteredData = useMemo(() => {
    if (viewMode === 'cards') {
      let filtered = godCards;

      // 按品质筛选
      if (filterType === 'super') {
        filtered = filtered.filter((card) => card.quality >= 4);
      } else if (filterType === 'normal') {
        filtered = filtered.filter((card) => card.quality < 4);
      }

      // 按名称搜索
      if (searchValue.trim()) {
        filtered = filtered.filter(
          (card) =>
            card.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            card.cardId.toString().includes(searchValue)
        );
      }

      return filtered;
    } else {
      let filtered = suits;

      // 按名称搜索
      if (searchValue.trim()) {
        filtered = filtered.filter(
          (suit) =>
            suit.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            suit.id.toString().includes(searchValue)
        );
      }

      return filtered;
    }
  }, [godCards, suits, searchValue, filterType, viewMode]);

  // 分页数据
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // 重置搜索和筛选
  const handleReset = () => {
    setSearchValue('');
    setFilterType('all');
    setCurrentPage(1);
  };

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
          onRetry={() => {
            refetchCards();
            refetchSuits();
          }}
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
              background: 'linear-gradient(135deg, #fa8c16 0%, #ff7875 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '32px',
            }}
          >
            神兵系统
          </Title>
          <Paragraph style={{ fontSize: '16px', color: colors.textSecondary, marginTop: 8 }}>
            收集强大的神兵卡牌，组建无敌套装
          </Paragraph>
        </motion.div>

        {/* 视图切换 */}
        <div style={{ display: 'flex', gap: 16 }}>
          <Tag.CheckableTag
            checked={viewMode === 'cards'}
            onChange={() => {
              setViewMode('cards');
              setCurrentPage(1);
            }}
            style={{ padding: '8px 16px', borderRadius: 20 }}
          >
            神兵卡牌 ({godCards.length})
          </Tag.CheckableTag>
          <Tag.CheckableTag
            checked={viewMode === 'suits'}
            onChange={() => {
              setViewMode('suits');
              setCurrentPage(1);
            }}
            style={{ padding: '8px 16px', borderRadius: 20 }}
          >
            套装列表 ({suits.length})
          </Tag.CheckableTag>
        </div>

        {/* 搜索和筛选 */}
        <SearchAndFilter
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filterType={filterType}
          onFilterChange={(value) => setFilterType(value as 'all' | 'super' | 'normal')}
          onReset={handleReset}
          totalCount={viewMode === 'cards' ? godCards.length : suits.length}
          filteredCount={filteredData.length}
          hideFilter={viewMode === 'suits'}
        />

        {/* 数据网格 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {paginatedData.length > 0 ? (
            <>
              <Row gutter={[16, 16]}>
                {paginatedData.map((item, index) => {
                  const key =
                    viewMode === 'cards'
                      ? `card-${(item as GodCard).cardId || index}`
                      : `suit-${(item as GodCardSuit).id || index}`;
                  return (
                    <Col xs={24} sm={12} md={8} lg={6} xl={4} key={key}>
                      {viewMode === 'cards' ? (
                        <GodCardCard godCard={item as GodCard} index={index} />
                      ) : (
                        <GodCardSuitCard suit={item as GodCardSuit} index={index} />
                      )}
                    </Col>
                  );
                })}
              </Row>

              {filteredData.length > pageSize && (
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
                    total={filteredData.length}
                    pageSize={pageSize}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total, range) =>
                      `第 ${range[0]}-${range[1]} 条，共 ${total} 个${viewMode === 'cards' ? '神兵' : '套装'}`
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
                    {searchValue || filterType !== 'all' ? '没有找到匹配的数据' : '暂无数据'}
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

export default GodCard;
