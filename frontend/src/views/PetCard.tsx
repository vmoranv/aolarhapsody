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
import { CreditCard, Crown, Shield, Star, Zap } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import ErrorDisplay from '../components/ErrorDisplay';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchAndFilter from '../components/SearchAndFilter';

const { Title, Paragraph, Text } = Typography;

// 宠物卡数据类型
interface PetCard {
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

interface PetCardSuit {
  id: number;
  suitType: number;
  name: string;
  petCardIdList: number[];
  dec: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
  timestamp: string;
}

const fetchPetCards = async (): Promise<PetCard[]> => {
  const response = await fetch('/api/petcards');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result: ApiResponse<PetCard[]> = await response.json();
  if (result.success && Array.isArray(result.data)) {
    return result.data;
  } else {
    throw new Error(result.error || '获取宠物卡数据失败');
  }
};

const fetchPetCardSuits = async (): Promise<PetCardSuit[]> => {
  const response = await fetch('/api/petcardsuits');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result: ApiResponse<PetCardSuit[]> = await response.json();
  if (result.success && Array.isArray(result.data)) {
    return result.data;
  } else {
    throw new Error(result.error || '获取宠物卡套装数据失败');
  }
};

const getQualityColor = (quality: number) => {
  const colors = {
    1: '#52c41a', // 绿色
    2: '#1890ff', // 蓝色
    3: '#722ed1', // 紫色
    4: '#fa8c16', // 橙色
    5: '#f5222d', // 红色
  };
  return colors[quality as keyof typeof colors] || '#d9d9d9';
};

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

const PetCardCard: React.FC<{ petCard: PetCard; index: number }> = ({ petCard, index }) => {
  const { token } = theme.useToken();
  const qualityColor = getQualityColor(petCard.quality);

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
              <CreditCard size={48} color="white" />
            </motion.div>

            {/* 品质标识 */}
            <div style={{ position: 'absolute', top: 10, right: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {Array.from({ length: petCard.quality }, (_, i) => (
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
              {petCard.name}
            </Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              ID: {petCard.cardId}
            </Text>
            <div style={{ marginTop: 8 }}>
              <Tag color={qualityColor} style={{ borderRadius: 12 }}>
                <Star size={12} style={{ marginRight: 4 }} />
                {getQualityText(petCard.quality)}
              </Tag>
            </div>
          </div>

          <Divider style={{ margin: '12px 0' }} />

          {/* 属性展示 */}
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Avatar size={16} style={{ backgroundColor: '#f5222d' }}>
                  <Zap size={10} />
                </Avatar>
                <Text style={{ fontSize: '12px' }}>攻击: {petCard.attack}</Text>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Avatar size={16} style={{ backgroundColor: '#52c41a' }}>
                  <Shield size={10} />
                </Avatar>
                <Text style={{ fontSize: '12px' }}>防御: {petCard.defend}</Text>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Avatar size={16} style={{ backgroundColor: '#722ed1' }}>
                  <Zap size={10} />
                </Avatar>
                <Text style={{ fontSize: '12px' }}>特攻: {petCard.sAttack}</Text>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Avatar size={16} style={{ backgroundColor: '#1890ff' }}>
                  <Shield size={10} />
                </Avatar>
                <Text style={{ fontSize: '12px' }}>特防: {petCard.sDefend}</Text>
              </div>
            </Col>
          </Row>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: '12px', color: token.colorTextSecondary }}>
              生命: {petCard.hp}
            </Text>
            <Text style={{ fontSize: '12px', color: token.colorTextSecondary }}>
              速度: {petCard.speed}
            </Text>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: '12px', color: token.colorTextSecondary }}>
              等级: {petCard.level}
            </Text>
            <Text style={{ fontSize: '12px', color: token.colorTextSecondary }}>
              视图: {petCard.viewId}
            </Text>
          </div>

          {petCard.limitRaceId.length > 0 && (
            <div>
              <Text style={{ fontSize: '12px', fontWeight: 'bold', color: token.colorText }}>
                限制种族:
              </Text>
              <div style={{ marginTop: 4 }}>
                {petCard.limitRaceId.slice(0, 3).map((raceId) => (
                  <Tag key={raceId} style={{ margin: '2px', fontSize: '12px' }}>
                    {raceId}
                  </Tag>
                ))}
                {petCard.limitRaceId.length > 3 && (
                  <Tag style={{ margin: '2px', fontSize: '12px' }}>
                    +{petCard.limitRaceId.length - 3}
                  </Tag>
                )}
              </div>
            </div>
          )}

          {petCard.desc && (
            <Tooltip title={petCard.desc}>
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
                {petCard.desc}
              </Text>
            </Tooltip>
          )}
        </Space>
      </Card>
    </motion.div>
  );
};

const PetCardSuitCard: React.FC<{ suit: PetCardSuit; index: number }> = ({ suit, index }) => {
  const { token } = theme.useToken();

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
          border: `2px solid #fa8c16`,
          background: 'linear-gradient(135deg, #fa8c1610 0%, #fa8c1605 100%)',
          boxShadow: '0 4px 12px #fa8c1630',
          height: '100%',
        }}
      >
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={4} style={{ margin: 0, color: token.colorText }}>
              <Crown size={16} style={{ marginRight: 8, color: '#fa8c16' }} />
              {suit.name}
            </Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              套装ID: {suit.id}
            </Text>
            <div style={{ marginTop: 8 }}>
              <Tag color="#fa8c16" style={{ borderRadius: 12 }}>
                类型: {suit.suitType}
              </Tag>
            </div>
          </div>

          <Divider style={{ margin: '12px 0' }} />

          <div>
            <Text style={{ fontSize: '12px', fontWeight: 'bold', color: token.colorText }}>
              包含卡牌: {suit.petCardIdList.length} 张
            </Text>
            <div style={{ marginTop: 8 }}>
              {suit.petCardIdList.map((id) => (
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

const PetCard = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'super' | 'normal'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'cards' | 'suits'>('cards');
  const pageSize = 24;

  const {
    data: petCards = [],
    isLoading: cardsLoading,
    error: cardsError,
    refetch: refetchCards,
  } = useQuery({
    queryKey: ['pet-cards'],
    queryFn: fetchPetCards,
  });

  const {
    data: suits = [],
    isLoading: suitsLoading,
    error: suitsError,
    refetch: refetchSuits,
  } = useQuery({
    queryKey: ['pet-card-suits'],
    queryFn: fetchPetCardSuits,
  });

  const isLoading = cardsLoading || suitsLoading;
  const error = cardsError || suitsError;

  // Handle success and error states
  React.useEffect(() => {
    if (error) {
      toast.error(`加载失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [error]);

  React.useEffect(() => {
    if (petCards.length > 0 || suits.length > 0) {
      toast.success('宠物卡数据加载成功！');
    }
  }, [petCards, suits]);

  // 筛选和搜索逻辑
  const filteredData = useMemo(() => {
    if (viewMode === 'cards') {
      let filtered = petCards;

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
  }, [petCards, suits, searchValue, filterType, viewMode]);

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
        <LoadingSpinner text="正在加载宠物卡数据..." />
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
              background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '32px',
            }}
          >
            宠物卡系统
          </Title>
          <Paragraph style={{ fontSize: '16px', color: 'var(--text-color)', marginTop: 8 }}>
            收集强大的宠物卡牌，组建完美套装
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
            宠物卡牌 ({petCards.length})
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
          onFilterChange={setFilterType}
          onReset={handleReset}
          totalCount={viewMode === 'cards' ? petCards.length : suits.length}
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
                {paginatedData.map((item, index) => (
                  <Col
                    xs={24}
                    sm={12}
                    md={8}
                    lg={6}
                    xl={4}
                    key={viewMode === 'cards' ? (item as PetCard).cardId : (item as PetCardSuit).id}
                  >
                    {viewMode === 'cards' ? (
                      <PetCardCard petCard={item as PetCard} index={index} />
                    ) : (
                      <PetCardSuitCard suit={item as PetCardSuit} index={index} />
                    )}
                  </Col>
                ))}
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
                      `第 ${range[0]}-${range[1]} 条，共 ${total} 个${viewMode === 'cards' ? '卡牌' : '套装'}`
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
                  <span style={{ color: '#666' }}>
                    {searchValue || filterType !== 'all' ? '没有找到匹配的数据' : '暂无数据'}
                  </span>
                }
                style={{
                  padding: '60px 20px',
                  background: '#ffffff',
                  borderRadius: 12,
                  border: '1px solid #f0f0f0',
                }}
              />
            </motion.div>
          )}
        </motion.div>
      </Space>
    </Layout>
  );
};

export default PetCard;
