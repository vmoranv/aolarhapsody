import { useQuery } from '@tanstack/react-query';
import {
  Card,
  Col,
  Empty,
  Pagination,
  Row,
  Space,
  Tag,
  theme,
  Tooltip,
  Typography,
  Divider,
  Button,
} from 'antd';
import { motion } from 'framer-motion';
import { Scroll, ArrowUp, ArrowDown, DollarSign, Coins } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import ErrorDisplay from '../components/ErrorDisplay';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchAndFilter from '../components/SearchAndFilter';

const { Title, Paragraph, Text } = Typography;

// 铭文数据类型
interface Inscription {
  id: number;
  name: string;
  price: number;
  rmb: number;
  inscriptionType: number;
  level: number;
  preLevelId: number;
  nextLevelId: number;
  desc: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
  timestamp: string;
}

const fetchInscriptions = async (): Promise<Inscription[]> => {
  const response = await fetch('/api/inscriptions');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result: ApiResponse<Inscription[]> = await response.json();
  if (result.success && Array.isArray(result.data)) {
    return result.data;
  } else {
    throw new Error(result.error || '获取铭文数据失败');
  }
};

const getTypeColor = (type: number) => {
  const colors = {
    1: '#52c41a', // 绿色
    2: '#1890ff', // 蓝色
    3: '#722ed1', // 紫色
    4: '#fa8c16', // 橙色
    5: '#f5222d', // 红色
  };
  return colors[type as keyof typeof colors] || '#d9d9d9';
};

const getTypeText = (type: number) => {
  const texts = {
    1: '基础铭文',
    2: '进阶铭文',
    3: '高级铭文',
    4: '史诗铭文',
    5: '传说铭文',
  };
  return texts[type as keyof typeof texts] || '未知类型';
};

const InscriptionCard: React.FC<{ 
  inscription: Inscription; 
  index: number; 
  onViewEvolution: (inscription: Inscription) => void;
}> = ({ inscription, index, onViewEvolution }) => {
  const { token } = theme.useToken();
  const typeColor = getTypeColor(inscription.inscriptionType);

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
          border: `2px solid ${typeColor}`,
          background: `linear-gradient(135deg, ${typeColor}10 0%, ${typeColor}05 100%)`,
          boxShadow: `0 4px 12px ${typeColor}30`,
          height: '100%',
        }}
        cover={
          <div
            style={{
              height: 120,
              background: `linear-gradient(135deg, ${typeColor} 0%, ${typeColor}dd 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <Scroll size={48} color="white" />
            </motion.div>
            
            {/* 等级标识 */}
            <div style={{ position: 'absolute', top: 10, right: 10 }}>
              <Tag color="white" style={{ color: typeColor, fontWeight: 'bold' }}>
                Lv.{inscription.level}
              </Tag>
            </div>
          </div>
        }
        actions={[
          <Button 
            key="evolution" 
            type="text" 
            size="small" 
            onClick={() => onViewEvolution(inscription)}
            disabled={inscription.preLevelId === 0 && inscription.nextLevelId === 0}
          >
            进化链
          </Button>
        ]}
      >
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={4} style={{ margin: 0, color: token.colorText }}>
              {inscription.name}
            </Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              ID: {inscription.id}
            </Text>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
            <Tag color={typeColor} style={{ borderRadius: 12 }}>
              {getTypeText(inscription.inscriptionType)}
            </Tag>
          </div>

          <Divider style={{ margin: '12px 0' }} />

          {/* 价格信息 */}
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Coins size={14} color="#faad14" />
                <Text style={{ fontSize: '12px' }}>金币: {inscription.price}</Text>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <DollarSign size={14} color="#f5222d" />
                <Text style={{ fontSize: '12px' }}>RMB: {inscription.rmb}</Text>
              </div>
            </Col>
          </Row>

          {/* 进化信息 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {inscription.preLevelId > 0 ? (
                <>
                  <ArrowUp size={12} color="#52c41a" />
                  <Text style={{ fontSize: '11px', color: token.colorTextSecondary }}>
                    前置: {inscription.preLevelId}
                  </Text>
                </>
              ) : (
                <Text style={{ fontSize: '11px', color: token.colorTextTertiary }}>
                  基础铭文
                </Text>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {inscription.nextLevelId > 0 ? (
                <>
                  <ArrowDown size={12} color="#1890ff" />
                  <Text style={{ fontSize: '11px', color: token.colorTextSecondary }}>
                    进化: {inscription.nextLevelId}
                  </Text>
                </>
              ) : (
                <Text style={{ fontSize: '11px', color: token.colorTextTertiary }}>
                  最高级
                </Text>
              )}
            </div>
          </div>

          {inscription.desc && (
            <Tooltip title={inscription.desc}>
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
                {inscription.desc}
              </Text>
            </Tooltip>
          )}
        </Space>
      </Card>
    </motion.div>
  );
};

const Inscription = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'super' | 'normal'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInscription, setSelectedInscription] = useState<Inscription | null>(null);
  const [evolutionChain, setEvolutionChain] = useState<Inscription[]>([]);
  const pageSize = 24;

  const {
    data: inscriptions = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['inscriptions'],
    queryFn: fetchInscriptions,
  });

  // Handle success and error states
  React.useEffect(() => {
    if (error) {
      toast.error(`加载失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [error]);

  React.useEffect(() => {
    if (inscriptions.length > 0) {
      toast.success('铭文数据加载成功！');
    }
  }, [inscriptions]);

  // 筛选和搜索逻辑
  const filteredInscriptions = useMemo(() => {
    let filtered = inscriptions;

    // 按类型筛选
    if (filterType === 'super') {
      filtered = filtered.filter((inscription) => inscription.inscriptionType >= 4);
    } else if (filterType === 'normal') {
      filtered = filtered.filter((inscription) => inscription.inscriptionType < 4);
    }

    // 按名称搜索
    if (searchValue.trim()) {
      filtered = filtered.filter(
        (inscription) =>
          inscription.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          inscription.id.toString().includes(searchValue) ||
          (inscription.desc && inscription.desc.toLowerCase().includes(searchValue.toLowerCase()))
      );
    }

    return filtered;
  }, [inscriptions, searchValue, filterType]);

  // 分页数据
  const paginatedInscriptions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredInscriptions.slice(startIndex, startIndex + pageSize);
  }, [filteredInscriptions, currentPage, pageSize]);

  // 重置搜索和筛选
  const handleReset = () => {
    setSearchValue('');
    setFilterType('all');
    setCurrentPage(1);
  };

  // 查看进化链
  const handleViewEvolution = (inscription: Inscription) => {
    const chain: Inscription[] = [];
    const visited = new Set<number>();
    
    // 构建进化链
    const buildChain = (current: Inscription, direction: 'up' | 'down') => {
      if (visited.has(current.id)) return;
      visited.add(current.id);
      
      if (direction === 'up') {
        chain.unshift(current);
        // 查找前置铭文
        if (current.preLevelId > 0) {
          const preInscription = inscriptions.find(i => i.id === current.preLevelId);
          if (preInscription) {
            buildChain(preInscription, 'up');
          }
        }
      } else {
        chain.push(current);
        // 查找后续铭文
        if (current.nextLevelId > 0) {
          const nextInscription = inscriptions.find(i => i.id === current.nextLevelId);
          if (nextInscription) {
            buildChain(nextInscription, 'down');
          }
        }
      }
    };

    // 从当前铭文开始构建完整进化链
    buildChain(inscription, 'up');
    
    // 如果当前铭文有后续进化，添加后续部分
    if (inscription.nextLevelId > 0) {
      const nextInscription = inscriptions.find(i => i.id === inscription.nextLevelId);
      if (nextInscription) {
        buildChain(nextInscription, 'down');
      }
    }

    setEvolutionChain(chain);
    setSelectedInscription(inscription);
  };

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner text="正在加载铭文数据..." />
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
            铭文系统
          </Title>
          <Paragraph style={{ fontSize: '16px', color: 'var(--text-color)', marginTop: 8 }}>
            收集强大的铭文，提升亚比的战斗能力
          </Paragraph>
        </motion.div>

        {/* 搜索和筛选 */}
        <SearchAndFilter
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filterType={filterType}
          onFilterChange={setFilterType}
          onReset={handleReset}
          totalCount={inscriptions.length}
          filteredCount={filteredInscriptions.length}
        />

        {/* 进化链展示 */}
        {selectedInscription && evolutionChain.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Scroll size={20} color="#722ed1" />
                  <span>{selectedInscription.name} 的进化链</span>
                </div>
              }
              extra={
                <Button onClick={() => setSelectedInscription(null)}>
                  关闭
                </Button>
              }
              style={{
                borderRadius: 12,
                border: '2px solid #722ed1',
                background: 'linear-gradient(135deg, #722ed110 0%, #722ed105 100%)',
              }}
            >
              <Row gutter={[16, 16]}>
                {evolutionChain.map((inscription, index) => (
                  <Col key={inscription.id} xs={24} sm={12} md={8} lg={6}>
                    <Card
                      size="small"
                      style={{
                        borderRadius: 8,
                        border: inscription.id === selectedInscription.id ? '2px solid #722ed1' : '1px solid #d9d9d9',
                        background: inscription.id === selectedInscription.id ? '#722ed110' : '#ffffff',
                      }}
                    >
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <div style={{ textAlign: 'center' }}>
                          <Text strong>{inscription.name}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            Lv.{inscription.level}
                          </Text>
                        </div>
                        <Tag color={getTypeColor(inscription.inscriptionType)} style={{ alignSelf: 'center' }}>
                          {getTypeText(inscription.inscriptionType)}
                        </Tag>
                        {index < evolutionChain.length - 1 && (
                          <div style={{ textAlign: 'center', marginTop: 8 }}>
                            <ArrowDown size={16} color="#1890ff" />
                          </div>
                        )}
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          </motion.div>
        )}

        {/* 铭文网格 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {paginatedInscriptions.length > 0 ? (
            <>
              <Row gutter={[16, 16]}>
                {paginatedInscriptions.map((inscription, index) => (
                  <Col xs={24} sm={12} md={8} lg={6} xl={4} key={inscription.id}>
                    <InscriptionCard 
                      inscription={inscription} 
                      index={index} 
                      onViewEvolution={handleViewEvolution}
                    />
                  </Col>
                ))}
              </Row>

              {filteredInscriptions.length > pageSize && (
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
                    total={filteredInscriptions.length}
                    pageSize={pageSize}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total, range) =>
                      `第 ${range[0]}-${range[1]} 条，共 ${total} 个铭文`
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
                    {searchValue || filterType !== 'all' ? '没有找到匹配的铭文' : '暂无铭文数据'}
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

export default Inscription;