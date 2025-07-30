import { useQuery } from '@tanstack/react-query';
import {
  Avatar,
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
} from 'antd';
import { motion } from 'framer-motion';
import { Gift, Heart, MapPin } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import ErrorDisplay from '../components/ErrorDisplay';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchAndFilter from '../components/SearchAndFilter';
import { getPetImageUrls } from '../utils/pet-helper';

const { Title, Paragraph, Text } = Typography;

// 亚比图鉴数据类型
interface PetDictionaryItem {
  petID: number;
  petName: string;
  petHeight: string;
  petWeight: string;
  defAttribute: string;
  attAttribute: string;
  evolutionLevel: string;
  isNew: string;
  isRare: string;
  loc: string;
  getWay: string;
  petFavourite: string;
  petIntro: string;
  locations: string;
  securable: string;
  isHotPet: string;
  isKingPet: string;
  canComment: string;
  isPetSkin: string;
  skinRaceId: string;
  taskId: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
  timestamp: string;
}

const fetchPetDictionary = async (): Promise<PetDictionaryItem[]> => {
  const response = await fetch('/api/pet-dictionary');

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result: ApiResponse<PetDictionaryItem[]> = await response.json();

  if (result.success && Array.isArray(result.data)) {
    return result.data;
  } else {
    throw new Error(result.error || '获取亚比图鉴数据失败');
  }
};

const PetCard: React.FC<{ pet: PetDictionaryItem; index: number }> = ({ pet, index }) => {
  const petImages = getPetImageUrls(pet.petID);
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
          border:
            pet.isRare === '1' ? '2px solid #ff7875' : `1px solid ${token.colorBorderSecondary}`,
          background:
            pet.isRare === '1'
              ? 'linear-gradient(135deg, #fff2f0 0%, #ffece8 100%)'
              : token.colorBgContainer,
          boxShadow: `0 4px 12px ${token.colorBorderSecondary}`,
          height: '100%',
        }}
        cover={
          <div
            style={{
              height: 200,
              background: `linear-gradient(135deg, ${pet.isRare === '1' ? '#ff9c6e' : '#91d5ff'} 0%, ${pet.isRare === '1' ? '#ffc069' : '#bae7ff'} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <motion.img
              src={petImages.bigImage}
              alt={pet.petName}
              style={{
                maxWidth: '80%',
                maxHeight: '80%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
              }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMTIiIGZpbGw9IiNGNUY1RjUiLz4KPHN2ZyB4PSIzMCIgeT0iMzAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNEOUQ5RDkiIHN0cm9rZS13aWR0aD0iMiI+CjxwYXRoIGQ9Im0xNSAxOC0zLTMtMy0zIi8+CjxwYXRoIGQ9Ik05IDEyaDEydjkiLz4KPHN2Zz4KPC9zdmc+';
              }}
            />

            {/* 标签 */}
            <div
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              {pet.isNew === '1' && (
                <Tag color="green" style={{ margin: 0, borderRadius: 12 }}>
                  新
                </Tag>
              )}
              {pet.isRare === '1' && (
                <Tag color="red" style={{ margin: 0, borderRadius: 12 }}>
                  稀有
                </Tag>
              )}
              {pet.isHotPet === '1' && (
                <Tag color="orange" style={{ margin: 0, borderRadius: 12 }}>
                  热门
                </Tag>
              )}
              {pet.isKingPet === '1' && (
                <Tag color="gold" style={{ margin: 0, borderRadius: 12 }}>
                  王者
                </Tag>
              )}
            </div>
          </div>
        }
      >
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={4} style={{ margin: 0, color: token.colorText }}>
              {pet.petName}
            </Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              ID: {pet.petID}
            </Text>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space size={4}>
              <Avatar size={20} style={{ backgroundColor: token.colorPrimary }}>
                攻
              </Avatar>
              <Text style={{ fontSize: '12px', color: token.colorText }}>{pet.attAttribute}</Text>
            </Space>
            <Space size={4}>
              <Avatar size={20} style={{ backgroundColor: '#52c41a' }}>
                防
              </Avatar>
              <Text style={{ fontSize: '12px', color: token.colorText }}>{pet.defAttribute}</Text>
            </Space>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MapPin size={14} color={token.colorTextSecondary} />
            <Text style={{ fontSize: '12px', color: token.colorTextSecondary }} ellipsis>
              {pet.locations || pet.loc || '未知地点'}
            </Text>
          </div>

          {pet.getWay && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Gift size={14} color={token.colorTextSecondary} />
              <Text style={{ fontSize: '12px', color: token.colorTextSecondary }} ellipsis>
                {pet.getWay}
              </Text>
            </div>
          )}

          {pet.petFavourite && (
            <Tooltip title={pet.petFavourite}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Heart size={14} color="#ff4d4f" />
                <Text style={{ fontSize: '12px', color: token.colorTextSecondary }} ellipsis>
                  {pet.petFavourite}
                </Text>
              </div>
            </Tooltip>
          )}

          {pet.petIntro && (
            <Tooltip title={pet.petIntro}>
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
                {pet.petIntro}
              </Text>
            </Tooltip>
          )}
        </Space>
      </Card>
    </motion.div>
  );
};

const PetDictionary = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'super' | 'normal'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;

  const {
    data: pets = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['pet-dictionary'],
    queryFn: fetchPetDictionary,
  });

  // Handle success and error states
  React.useEffect(() => {
    if (error) {
      toast.error(`加载失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [error]);

  React.useEffect(() => {
    if (pets.length > 0) {
      toast.success('亚比图鉴加载成功！');
    }
  }, [pets]);

  // 筛选和搜索逻辑
  const filteredPets = useMemo(() => {
    let filtered = pets;

    // 按类型筛选
    if (filterType === 'super') {
      filtered = filtered.filter((pet) => pet.isRare === '1' || pet.isKingPet === '1');
    } else if (filterType === 'normal') {
      filtered = filtered.filter((pet) => pet.isRare !== '1' && pet.isKingPet !== '1');
    }

    // 按名称搜索
    if (searchValue.trim()) {
      filtered = filtered.filter(
        (pet) =>
          pet.petName.toLowerCase().includes(searchValue.toLowerCase()) ||
          pet.petID.toString().includes(searchValue) ||
          (pet.attAttribute &&
            pet.attAttribute.toLowerCase().includes(searchValue.toLowerCase())) ||
          (pet.defAttribute && pet.defAttribute.toLowerCase().includes(searchValue.toLowerCase()))
      );
    }

    return filtered;
  }, [pets, searchValue, filterType]);

  // 分页数据
  const paginatedPets = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredPets.slice(startIndex, startIndex + pageSize);
  }, [filteredPets, currentPage, pageSize]);

  // 重置搜索和筛选
  const handleReset = () => {
    setSearchValue('');
    setFilterType('all');
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner text="正在加载亚比图鉴数据..." />
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
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '32px',
            }}
          >
            亚比图鉴
          </Title>
          <Paragraph style={{ fontSize: '16px', color: 'var(--text-color)', marginTop: 8 }}>
            探索奥拉星世界中所有可爱的亚比伙伴，了解它们的属性和特征
          </Paragraph>
        </motion.div>

        {/* 搜索和筛选 */}
        <SearchAndFilter
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filterType={filterType}
          onFilterChange={setFilterType}
          onReset={handleReset}
          totalCount={pets.length}
          filteredCount={filteredPets.length}
        />

        {/* 亚比网格 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {paginatedPets.length > 0 ? (
            <>
              <Row gutter={[16, 16]}>
                {paginatedPets.map((pet, index) => (
                  <Col xs={24} sm={12} md={8} lg={6} xl={4} key={pet.petID}>
                    <PetCard pet={pet} index={index} />
                  </Col>
                ))}
              </Row>

              {filteredPets.length > pageSize && (
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
                    total={filteredPets.length}
                    pageSize={pageSize}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total, range) =>
                      `第 ${range[0]}-${range[1]} 条，共 ${total} 只亚比`
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
                    {searchValue || filterType !== 'all' ? '没有找到匹配的亚比' : '暂无亚比数据'}
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

export default PetDictionary;
