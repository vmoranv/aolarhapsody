import { useQuery } from '@tanstack/react-query';
import { App, Button, Card, Empty, Image, List, Pagination, Space, Typography } from 'antd';
import { motion } from 'framer-motion';
import { Download, Image as ImageIcon } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorDisplay from '../components/ErrorDisplay';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchAndFilter from '../components/SearchAndFilter';
import { useTheme } from '../hooks/useTheme';
import { SimplifiedPoster as Poster } from '../types/poster';
import { fetchData } from '../utils/api';

const { Title, Paragraph, Text } = Typography;

/**
 * 海报列表项组件
 * @param poster - 单个海报的数据
 */
const PosterItem: React.FC<{ poster: Poster }> = ({ poster }) => {
  const { t } = useTranslation('poster');
  const { colors } = useTheme()!;
  const { message } = App.useApp();
  const baseUrl = import.meta.env.VITE_API_URL || '';
  const imageUrl = `${baseUrl}/proxy/h5/pet/petskin/background/bg/img_petskinbackground_${poster.id}.png`;

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${poster.name}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      message.success(t('download_start'));
    } catch (error) {
      message.error(t('download_error'));
      console.error('下载海报时出错:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        hoverable
        style={{
          borderRadius: 12,
          overflow: 'hidden',
          border: `1px solid ${colors.borderSecondary}`,
          boxShadow: `0 4px 12px ${colors.shadow || 'rgba(0, 0, 0, 0.08)'}`,
        }}
        cover={
          <Image
            alt={poster.name}
            src={imageUrl}
            preview={{
              mask: (
                <div
                  style={{
                    background: 'rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                  }}
                >
                  {t('preview')}
                </div>
              ),
            }}
            style={{ height: 200, objectFit: 'cover' }}
            placeholder={
              <div
                style={{
                  height: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: colors.fillSecondary,
                }}
              >
                <ImageIcon size={48} color={colors.textSecondary} />
              </div>
            }
          />
        }
        actions={[
          <Button
            key="download"
            type="text"
            icon={<Download size={16} />}
            onClick={handleDownload}
            style={{ color: colors.textSecondary }}
          >
            {t('download')}
          </Button>,
        ]}
      >
        <Card.Meta
          title={
            <Text strong style={{ color: colors.text }} ellipsis>
              {poster.name}
            </Text>
          }
          description={<Text style={{ color: colors.textSecondary }}>{poster.labelName}</Text>}
        />
      </Card>
    </motion.div>
  );
};

/**
 * 海报页面组件内部实现
 */
const PosterContent = () => {
  const { t } = useTranslation('poster');
  const { colors } = useTheme()!;
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const {
    data: posters = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['posters'],
    queryFn: () => fetchData<Poster>('posters'),
  });

  const filteredData = useMemo(() => {
    return posters.filter(
      (p) =>
        p.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        p.labelName.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [posters, searchValue]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const handleReset = () => {
    setSearchValue('');
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner text={t('loading_posters')} />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorDisplay
          error={error instanceof Error ? error.message : String(error)}
          onRetry={refetch}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
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
            {t('page_title')}
          </Title>
          <Paragraph style={{ fontSize: '16px', color: colors.textSecondary, marginTop: 8 }}>
            {t('page_subtitle')}
          </Paragraph>
        </motion.div>

        <SearchAndFilter
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filterType="all"
          onFilterChange={() => {}}
          onReset={handleReset}
          totalCount={posters.length}
          filteredCount={filteredData.length}
          hideFilter={true}
          searchPlaceholder={t('search_placeholder')}
          unitText={t('unit_text')}
        />

        {paginatedData.length > 0 ? (
          <>
            <List
              grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 3,
                lg: 4,
                xl: 4,
                xxl: 6,
              }}
              dataSource={paginatedData}
              renderItem={(poster) => (
                <List.Item>
                  <PosterItem poster={poster} />
                </List.Item>
              )}
            />

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
                    t('pagination_total', { rangeStart: range[0], rangeEnd: range[1], total })
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
                  {searchValue ? t('no_results') : t('no_data')}
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
      </Space>
    </Layout>
  );
};

const PosterPage = () => {
  return (
    <App>
      <PosterContent />
    </App>
  );
};

export default PosterPage;
