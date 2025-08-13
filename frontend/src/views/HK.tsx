import { useQuery } from '@tanstack/react-query';
import { Card, Col, Divider, Empty, Pagination, Row, Space, Tag, theme, Typography } from 'antd';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Zap } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import ErrorDisplay from '../components/ErrorDisplay';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchAndFilter from '../components/SearchAndFilter';
import { useTheme } from '../hooks/useTheme';
import { useQualityColor } from '../theme/colors';
import { fetchData } from '../utils/api';

const { Title, Paragraph, Text } = Typography;

/**
 * 魂卡数据类型定义
 */
interface HKData {
  id: number; // 魂卡ID
  name: string; // 魂卡名称
  color: number; // 颜色/品质
  wordBar: string; // 词条
  produceType: number; // 产出类型
}

/**
 * 魂卡Buff数据类型定义
 */
interface HKBuff {
  id: number; // Buff ID
  name: string; // Buff名称
  decs: string[]; // 效果描述列表
  costs: number[]; // 消耗列表
  fontColor: string; // 字体颜色
  color: number; // 颜色/品质
  buffNames: string[]; // Buff名称列表
  values: string[]; // 数值列表
}

/**
 * 根据产出类型值获取对应的文本描述
 * @param type - 产出类型值
 * @returns 返回产出类型的文本描述
 */
const getProduceTypeText = (type: number, t: (key: string) => string) => {
  const types: { [key: number]: string } = {
    1: t('produce_type_common'),
    2: t('produce_type_rare'),
    3: t('produce_type_special'),
    4: t('produce_type_limited'),
  };
  return types[type] || t('produce_type_unknown');
};

/**
 * 魂卡数据卡片组件
 * @param hkData - 单个魂卡的数据
 * @param index - 卡片在列表中的索引，用于动画延迟
 */
const HKDataCard: React.FC<{ hkData: HKData; index: number }> = ({ hkData, index }) => {
  const { t } = useTranslation('hk');
  const { token } = theme.useToken();
  const cardColor = useQualityColor(hkData.color);

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
          border: `2px solid ${cardColor}`,
          background: `linear-gradient(135deg, ${cardColor}10 0%, ${cardColor}05 100%)`,
          boxShadow: `0 4px 12px ${cardColor}30`,
          height: '100%',
        }}
        cover={
          <div
            style={{
              height: 120,
              background: `linear-gradient(135deg, ${cardColor} 0%, ${cardColor}dd 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <motion.div whileHover={{ scale: 1.1, rotate: 10 }} transition={{ duration: 0.3 }}>
              <Heart size={48} color="white" />
            </motion.div>

            {/* 装饰性元素 */}
            <div style={{ position: 'absolute', top: 10, right: 10 }}>
              <Sparkles size={20} color="rgba(255,255,255,0.7)" />
            </div>
            <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
              <Sparkles size={16} color="rgba(255,255,255,0.5)" />
            </div>
          </div>
        }
      >
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={4} style={{ margin: 0, color: token.colorText }}>
              {hkData.name}
            </Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              ID: {hkData.id}
            </Text>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 8 }}>
            <Tag color={cardColor} style={{ borderRadius: 12 }}>
              {t('color')}: {hkData.color}
            </Tag>
            <Tag color="blue" style={{ borderRadius: 12 }}>
              {getProduceTypeText(hkData.produceType, t)}
            </Tag>
          </div>

          {hkData.wordBar && (
            <div style={{ textAlign: 'center' }}>
              <Text style={{ fontSize: '12px', fontWeight: 'bold', color: token.colorText }}>
                {t('word_bar')}:
              </Text>
              <div style={{ marginTop: 4 }}>
                <Tag color="geekblue" style={{ borderRadius: 8 }}>
                  {hkData.wordBar}
                </Tag>
              </div>
            </div>
          )}
        </Space>
      </Card>
    </motion.div>
  );
};

/**
 * 魂卡Buff卡片组件
 * @param hkBuff - 单个魂卡Buff的数据
 * @param index - 卡片在列表中的索引，用于动画延迟
 */
const HKBuffCard: React.FC<{ hkBuff: HKBuff; index: number }> = ({ hkBuff, index }) => {
  const { t } = useTranslation('hk');
  const { token } = theme.useToken();
  const buffColor = useQualityColor(hkBuff.color);

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
          border: `2px solid ${buffColor}`,
          background: `linear-gradient(135deg, ${buffColor}10 0%, ${buffColor}05 100%)`,
          boxShadow: `0 4px 12px ${buffColor}30`,
          height: '100%',
        }}
      >
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={4} style={{ margin: 0, color: hkBuff.fontColor || token.colorText }}>
              <Zap size={16} style={{ marginRight: 8, color: buffColor }} />
              {hkBuff.name}
            </Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Buff ID: {hkBuff.id}
            </Text>
          </div>

          <Divider style={{ margin: '12px 0' }} />

          {/* Buff描述 */}
          {hkBuff.decs.length > 0 && (
            <div>
              <Text style={{ fontSize: '12px', fontWeight: 'bold', color: token.colorText }}>
                {t('effect_description')}:
              </Text>
              <div style={{ marginTop: 4 }}>
                {hkBuff.decs.map((desc, idx) => (
                  <div key={idx} style={{ marginBottom: 4 }}>
                    <Text style={{ fontSize: '11px', color: token.colorTextSecondary }}>
                      • {desc}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 消耗 */}
          {hkBuff.costs.length > 0 && (
            <div>
              <Text style={{ fontSize: '12px', fontWeight: 'bold', color: token.colorText }}>
                {t('cost')}:
              </Text>
              <div style={{ marginTop: 4 }}>
                {hkBuff.costs.map((cost, idx) => (
                  <Tag key={idx} color="red" style={{ margin: '2px', fontSize: '12px' }}>
                    {cost}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {/* Buff名称 */}
          {hkBuff.buffNames.length > 0 && (
            <div>
              <Text style={{ fontSize: '12px', fontWeight: 'bold', color: token.colorText }}>
                {t('buff_name')}:
              </Text>
              <div style={{ marginTop: 4 }}>
                {hkBuff.buffNames.map((name, idx) => (
                  <Tag key={idx} color="blue" style={{ margin: '2px', fontSize: '12px' }}>
                    {name}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {/* 数值 */}
          {hkBuff.values.length > 0 && (
            <div>
              <Text style={{ fontSize: '12px', fontWeight: 'bold', color: token.colorText }}>
                {t('value')}:
              </Text>
              <div style={{ marginTop: 4 }}>
                {hkBuff.values.map((value, idx) => (
                  <Tag key={idx} color="green" style={{ margin: '2px', fontSize: '12px' }}>
                    {value}
                  </Tag>
                ))}
              </div>
            </div>
          )}
        </Space>
      </Card>
    </motion.div>
  );
};

/**
 * 魂卡系统页面组件
 * - 使用 React Query 获取魂卡和Buff数据
 * - 提供视图切换功能 (数据/Buff)
 * - 实现搜索、筛选和分页
 */
const HK = () => {
  const { t } = useTranslation('hk');
  const { colors } = useTheme()!;
  const [searchValue, setSearchValue] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'super' | 'normal'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'data' | 'buffs'>('data');
  const pageSize = 24;

  const {
    data: hkData = [],
    isLoading: dataLoading,
    error: dataError,
    refetch: refetchData,
  } = useQuery({
    queryKey: ['hk-data'],
    queryFn: () => fetchData<HKData>('hkdata'),
  });

  const {
    data: hkBuffs = [],
    isLoading: buffsLoading,
    error: buffsError,
    refetch: refetchBuffs,
  } = useQuery({
    queryKey: ['hk-buffs'],
    queryFn: () => fetchData<HKBuff>('hkbuffs'),
  });

  const isLoading = dataLoading || buffsLoading;
  const error = dataError || buffsError;

  // Handle success and error states
  React.useEffect(() => {
    if (error) {
      toast.error(`${t('load_failed')}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [error, t]);

  React.useEffect(() => {
    if (hkData.length > 0 || hkBuffs.length > 0) {
      toast.success(t('load_success'));
    }
  }, [hkData, hkBuffs, t]);

  // 筛选和搜索逻辑
  const filteredData = useMemo(() => {
    if (viewMode === 'data') {
      let filtered = hkData;

      // 按颜色筛选
      if (filterType === 'super') {
        filtered = filtered.filter((data) => data.color >= 4);
      } else if (filterType === 'normal') {
        filtered = filtered.filter((data) => data.color < 4);
      }

      // 按名称搜索
      if (searchValue.trim()) {
        filtered = filtered.filter(
          (data) =>
            data.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            data.id.toString().includes(searchValue) ||
            (data.wordBar && data.wordBar.toLowerCase().includes(searchValue.toLowerCase()))
        );
      }

      return filtered;
    } else {
      let filtered = hkBuffs;

      // 按名称搜索
      if (searchValue.trim()) {
        filtered = filtered.filter(
          (buff) =>
            buff.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            buff.id.toString().includes(searchValue) ||
            buff.buffNames.some((name) => name.toLowerCase().includes(searchValue.toLowerCase())) ||
            buff.decs.some((desc) => desc.toLowerCase().includes(searchValue.toLowerCase()))
        );
      }

      return filtered;
    }
  }, [hkData, hkBuffs, searchValue, filterType, viewMode]);

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
            refetchData();
            refetchBuffs();
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
              background: 'linear-gradient(135deg, #f5222d 0%, #ff7875 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '32px',
            }}
          >
            魂卡系统
          </Title>
          <Paragraph style={{ fontSize: '16px', color: colors.textSecondary, marginTop: 8 }}>
            探索神秘的魂卡力量，掌握强大的Buff效果
          </Paragraph>
        </motion.div>

        {/* 视图切换 */}
        <div style={{ display: 'flex', gap: 16 }}>
          <Tag.CheckableTag
            checked={viewMode === 'data'}
            onChange={() => {
              setViewMode('data');
              setCurrentPage(1);
            }}
            style={{ padding: '8px 16px', borderRadius: 20 }}
          >
            魂卡数据 ({hkData.length})
          </Tag.CheckableTag>
          <Tag.CheckableTag
            checked={viewMode === 'buffs'}
            onChange={() => {
              setViewMode('buffs');
              setCurrentPage(1);
            }}
            style={{ padding: '8px 16px', borderRadius: 20 }}
          >
            魂卡Buff ({hkBuffs.length})
          </Tag.CheckableTag>
        </div>

        {/* 搜索和筛选 */}
        <SearchAndFilter
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filterType={filterType}
          onFilterChange={(value) => setFilterType(value as 'all' | 'super' | 'normal')}
          onReset={handleReset}
          totalCount={viewMode === 'data' ? hkData.length : hkBuffs.length}
          filteredCount={filteredData.length}
          hideFilter={viewMode === 'buffs'}
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
                    key={viewMode === 'data' ? (item as HKData).id : (item as HKBuff).id}
                  >
                    {viewMode === 'data' ? (
                      <HKDataCard hkData={item as HKData} index={index} />
                    ) : (
                      <HKBuffCard hkBuff={item as HKBuff} index={index} />
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
                      `第 ${range[0]}-${range[1]} 条，共 ${total} 个${viewMode === 'data' ? '魂卡' : 'Buff'}`
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

export default HK;
