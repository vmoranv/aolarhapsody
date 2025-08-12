import { useQuery } from '@tanstack/react-query';
import { Card, Col, Empty, Pagination, Row, Space, Tag, theme, Tooltip, Typography } from 'antd';
import { motion } from 'framer-motion';
import { Key, Sparkles } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import ErrorDisplay from '../components/ErrorDisplay';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchAndFilter from '../components/SearchAndFilter';

const { Title, Paragraph, Text } = Typography;

/**
 * 晶钥数据类型定义
 */
interface CrystalKey {
  id: number; // 晶钥ID
  name: string; // 晶钥名称
  description: string; // 晶钥描述
}

/**
 * 通用API响应结构
 * @template T 响应数据的类型
 */
interface ApiResponse<T> {
  success: boolean; // 请求是否成功
  data?: T; // 响应数据
  error?: string; // 错误信息
  count?: number; // 数据总数
  timestamp: string; // 服务器时间戳
}

/**
 * 异步获取所有晶钥数据
 * @returns 返回一个包含所有晶钥的Promise数组
 * @throws 当网络请求失败或API返回错误时抛出异常
 */
const fetchCrystalKeys = async (): Promise<CrystalKey[]> => {
  const response = await fetch('/api/crystalkeys');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result: ApiResponse<CrystalKey[]> = await response.json();
  if (result.success && Array.isArray(result.data)) {
    return result.data;
  } else {
    throw new Error(result.error || 'Failed to fetch crystal key data');
  }
};

/**
 * 异步获取单个晶钥的详细信息
 * @param id - 晶钥的ID
 * @returns 返回单个晶钥的Promise对象
 * @throws 当网络请求失败或API返回错误时抛出异常
 */
const fetchCrystalKeyDetail = async (id: string): Promise<CrystalKey> => {
  const response = await fetch(`/api/crystalkeys/${id}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result: ApiResponse<CrystalKey> = await response.json();
  if (result.success && result.data) {
    return result.data;
  } else {
    throw new Error(result.error || 'Failed to fetch crystal key detail');
  }
};

/**
 * 晶钥卡片组件
 * @param crystalKey - 单个晶钥的数据
 * @param index - 晶钥在列表中的索引，用于动画延迟
 * @param onDetail - 点击卡片时触发的回调，用于显示详情
 */
const CrystalKeyCard: React.FC<{
  crystalKey: CrystalKey;
  index: number;
  onDetail: (id: number) => void;
}> = ({ crystalKey, index, onDetail }) => {
  const { t } = useTranslation('crystalKey');
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
        onClick={() => onDetail(crystalKey.id)}
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          border: `2px solid #722ed1`,
          background: 'linear-gradient(135deg, #722ed110 0%, #722ed105 100%)',
          boxShadow: '0 4px 12px #722ed130',
          height: '100%',
          cursor: 'pointer',
        }}
        cover={
          <div
            style={{
              height: 120,
              background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <motion.div whileHover={{ scale: 1.1, rotate: 10 }} transition={{ duration: 0.3 }}>
              <Key size={48} color="white" />
            </motion.div>

            {/* 装饰性星星 */}
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
              {crystalKey.name}
            </Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {t('id', { id: crystalKey.id })}
            </Text>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
            <Tag color="#722ed1" style={{ borderRadius: 12 }}>
              <Key size={12} style={{ marginRight: 4 }} />
              {t('crystal_key')}
            </Tag>
          </div>

          {crystalKey.description && (
            <Tooltip title={crystalKey.description}>
              <Text
                style={{
                  fontSize: '12px',
                  color: token.colorTextTertiary,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textAlign: 'center',
                }}
              >
                {crystalKey.description}
              </Text>
            </Tooltip>
          )}
        </Space>
      </Card>
    </motion.div>
  );
};

/**
 * 晶钥系统页面组件
 * - 使用 React Query 获取晶钥列表和详情
 * - 实现搜索和分页功能
 * - 点击卡片可查看晶钥详情
 */
const CrystalKey = () => {
  const { t } = useTranslation('crystalKey');
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKey, setSelectedKey] = useState<CrystalKey | null>(null);
  const pageSize = 24;

  const {
    data: crystalKeys = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['crystal-keys'],
    queryFn: fetchCrystalKeys,
  });

  // Handle success and error states
  React.useEffect(() => {
    if (error) {
      toast.error(`${t('load_failed')}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [error, t]);

  React.useEffect(() => {
    if (crystalKeys.length > 0) {
      toast.success(t('load_success'));
    }
  }, [crystalKeys, t]);

  // 筛选和搜索逻辑
  const filteredKeys = useMemo(() => {
    let filtered = crystalKeys;

    // 按名称搜索
    if (searchValue.trim()) {
      filtered = filtered.filter(
        (key) =>
          key.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          key.id.toString().includes(searchValue) ||
          (key.description && key.description.toLowerCase().includes(searchValue.toLowerCase()))
      );
    }

    return filtered;
  }, [crystalKeys, searchValue]);

  // 分页数据
  const paginatedKeys = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredKeys.slice(startIndex, startIndex + pageSize);
  }, [filteredKeys, currentPage, pageSize]);

  // 重置搜索和筛选
  const handleReset = () => {
    setSearchValue('');
    setCurrentPage(1);
  };

  // 查看详情
  const handleDetail = async (id: number) => {
    try {
      const detail = await fetchCrystalKeyDetail(id.toString());
      setSelectedKey(detail);
      toast.success(t('detail_load_success'));
    } catch (error) {
      toast.error(
        `${t('detail_load_failed')}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
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
              background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '32px',
            }}
          >
            {t('title')}
          </Title>
          <Paragraph style={{ fontSize: '16px', color: 'var(--text-color)', marginTop: 8 }}>
            {t('subtitle')}
          </Paragraph>
        </motion.div>

        {/* 搜索和筛选 */}
        <SearchAndFilter
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filterType="all"
          onFilterChange={() => {}}
          onReset={handleReset}
          totalCount={crystalKeys.length}
          filteredCount={filteredKeys.length}
          hideFilter
        />

        {/* 选中的晶钥详情 */}
        {selectedKey && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Key size={20} color="#722ed1" />
                  <span>{t('key_details')}</span>
                </div>
              }
              extra={
                <Tag
                  color="#722ed1"
                  onClick={() => setSelectedKey(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {t('close')}
                </Tag>
              }
              style={{
                borderRadius: 12,
                border: '2px solid #722ed1',
                background: 'linear-gradient(135deg, #722ed110 0%, #722ed105 100%)',
              }}
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Text strong style={{ fontSize: '16px' }}>
                    {selectedKey.name}
                  </Text>
                  <Text type="secondary" style={{ marginLeft: 12 }}>
                    {t('id', { id: selectedKey.id })}
                  </Text>
                </div>
                {selectedKey.description && (
                  <div>
                    <Text strong>{t('description')}:</Text>
                    <Paragraph style={{ marginTop: 8, marginBottom: 0 }}>
                      {selectedKey.description}
                    </Paragraph>
                  </div>
                )}
              </Space>
            </Card>
          </motion.div>
        )}

        {/* 晶钥网格 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {paginatedKeys.length > 0 ? (
            <>
              <Row gutter={[16, 16]}>
                {paginatedKeys.map((key, index) => (
                  <Col xs={24} sm={12} md={8} lg={6} xl={4} key={key.id}>
                    <CrystalKeyCard crystalKey={key} index={index} onDetail={handleDetail} />
                  </Col>
                ))}
              </Row>

              {filteredKeys.length > pageSize && (
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
                    total={filteredKeys.length}
                    pageSize={pageSize}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total, range) =>
                      t('pagination_total', { start: range[0], end: range[1], total })
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
                    {searchValue ? t('no_match_found') : t('no_data')}
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

export default CrystalKey;
