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
import ErrorDisplay from '../components/ErrorDisplay';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchAndFilter from '../components/SearchAndFilter';
import { fetchData, filterBySearch, filterByType, paginateData } from '../utils/api';

const { Title, Paragraph, Text } = Typography;

// PMDataList数据类型
interface PMDataListItem {
  id: number;
  name: string;
  type: number;
  level: number;
  hp: number;
  attack: number;
  defend: number;
  sAttack: number;
  sDefend: number;
  speed: number;
  rarity: number;
  element: string;
  category: string;
  desc: string;
}

const getRarityColor = (rarity: number) => {
  const colors = {
    1: '#52c41a', // 绿色
    2: '#1890ff', // 蓝色
    3: '#722ed1', // 紫色
    4: '#fa8c16', // 橙色
    5: '#f5222d', // 红色
  };
  return colors[rarity as keyof typeof colors] || '#d9d9d9';
};

const getRarityText = (rarity: number) => {
  const texts = {
    1: '普通',
    2: '优秀',
    3: '稀有',
    4: '史诗',
    5: '传说',
  };
  return texts[rarity as keyof typeof texts] || '未知';
};

const getElementColor = (element: string) => {
  const colors: { [key: string]: string } = {
    火: '#f5222d',
    水: '#1890ff',
    草: '#52c41a',
    电: '#faad14',
    冰: '#13c2c2',
    地: '#fa8c16',
    飞: '#722ed1',
    虫: '#a0d911',
    毒: '#eb2f96',
    超能: '#9254de',
    格斗: '#fa541c',
    岩石: '#8c8c8c',
    钢: '#595959',
    龙: '#2f54eb',
    恶: '#434343',
    妖精: '#f759ab',
  };
  return colors[element] || '#d9d9d9';
};

const PMDataListCard: React.FC<{ pmData: PMDataListItem; index: number }> = ({ pmData, index }) => {
  const { token } = theme.useToken();
  const rarityColor = getRarityColor(pmData.rarity);
  const elementColor = getElementColor(pmData.element);

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
              {getRarityText(pmData.rarity)}
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
                <Avatar size={14} style={{ backgroundColor: '#f5222d', fontSize: '8px' }}>
                  HP
                </Avatar>
                <Text style={{ fontSize: '11px' }}>{pmData.hp}</Text>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar size={14} style={{ backgroundColor: '#fa8c16', fontSize: '8px' }}>
                  <Zap size={8} />
                </Avatar>
                <Text style={{ fontSize: '11px' }}>{pmData.attack}</Text>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar size={14} style={{ backgroundColor: '#52c41a', fontSize: '8px' }}>
                  <Shield size={8} />
                </Avatar>
                <Text style={{ fontSize: '11px' }}>{pmData.defend}</Text>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar size={14} style={{ backgroundColor: '#722ed1', fontSize: '8px' }}>
                  SA
                </Avatar>
                <Text style={{ fontSize: '11px' }}>{pmData.sAttack}</Text>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar size={14} style={{ backgroundColor: '#1890ff', fontSize: '8px' }}>
                  SD
                </Avatar>
                <Text style={{ fontSize: '11px' }}>{pmData.sDefend}</Text>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar size={14} style={{ backgroundColor: '#13c2c2', fontSize: '8px' }}>
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
              总战力: {totalPower}
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

const PMDataList = () => {
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
    queryFn: () => fetchData<PMDataListItem>('pmdatalist'),
  });

  // Handle success and error states
  React.useEffect(() => {
    if (error) {
      toast.error(`加载失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [error]);

  React.useEffect(() => {
    if (pmDataList.length > 0) {
      toast.success('PM数据列表加载成功！');
    }
  }, [pmDataList]);

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
        <LoadingSpinner text="正在加载PM数据列表..." />
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
            PM数据列表
          </Title>
          <Paragraph style={{ fontSize: '16px', color: 'var(--text-color)', marginTop: 8 }}>
            探索完整的PM数据库，了解每个PM的详细属性
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
                  prefix={<Database size={20} color="#1890ff" />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ borderRadius: 12 }}>
                <Statistic
                  title="高稀有度"
                  value={stats.super}
                  prefix={<Star size={20} color="#faad14" />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ borderRadius: 12 }}>
                <Statistic
                  title="平均战力"
                  value={stats.avgPower}
                  prefix={<TrendingUp size={20} color="#722ed1" />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ borderRadius: 12 }}>
                <Statistic
                  title="属性种类"
                  value={stats.elements}
                  prefix={<Users size={20} color="#52c41a" />}
                  valueStyle={{ color: '#52c41a' }}
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
                    showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 个PM`}
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
                    {searchValue || filterType !== 'all' ? '没有找到匹配的PM数据' : '暂无PM数据'}
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

export default PMDataList;
