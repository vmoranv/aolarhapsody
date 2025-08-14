import { useQuery } from '@tanstack/react-query';
import { Card, Col, Empty, Pagination, Row, Space, Statistic, Typography } from 'antd';
import { motion } from 'framer-motion';
import { Database, PackageSearch, Star, TrendingUp } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTheme } from '../hooks/useTheme';
import { fetchData, filterBySearch, filterByType, paginateData } from '../utils/api';
import ErrorDisplay from './ErrorDisplay';
import Layout from './Layout';
import LoadingSpinner from './LoadingSpinner';
import SearchAndFilter, { FilterType } from './SearchAndFilter';

const { Title, Paragraph } = Typography;

// Generic data type constraint
export interface DataItem {
  id: number | string;
  name: string;
  quality?: number;
  [key: string]: any;
}

// Props for the DataView component
interface DataViewProps<T extends DataItem> {
  pageTitle: string;
  pageSubtitle: string;
  queryKey: (string | number)[];
  dataUrl: string;
  renderCard: (item: T, index: number) => React.ReactNode;
  getSearchableFields: (item: T) => string[];
  getQuality?: (item: T) => number;
  statsCalculators?: {
    [key: string]: (data: T[]) => { value: number | string; icon: string };
  };
  titleGradient: string;
  searchPlaceholder?: string;
  noLayout?: boolean;
  loadingText: string;
  errorText: string;
  paginationTotalText: (start: number, end: number, total: number) => string;
  noResultsText: string;
  noDataText: string;
  filterOptions?: { label: string; value: FilterType }[];
  resetText: string;
  showingText: (filteredCount: number, totalCount: number) => React.ReactNode;
  children?: React.ReactNode;
}

const DataView = <T extends DataItem>({
  pageTitle,
  pageSubtitle,
  queryKey,
  dataUrl,
  renderCard,
  getSearchableFields,
  getQuality,
  statsCalculators,
  titleGradient,
  searchPlaceholder,
  noLayout = false,
  loadingText,
  errorText,
  paginationTotalText,
  noResultsText,
  noDataText,
  filterOptions,
  resetText,
  showingText,
  children,
}: DataViewProps<T>) => {
  const { colors } = useTheme()!;
  const [searchValue, setSearchValue] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;

  const {
    data: items = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchData<T>(dataUrl),
  });

  React.useEffect(() => {
    if (error) {
      toast.error(errorText);
    }
  }, [error, errorText]);

  const filteredItems = useMemo(() => {
    let filtered = [...items];
    if (getQuality) {
      filtered = filterByType(filtered, filterType as 'all' | 'super' | 'normal', 'quality');
    }
    filtered = filterBySearch(filtered, searchValue, getSearchableFields) as T[];
    return filtered;
  }, [items, searchValue, filterType, getQuality, getSearchableFields]);

  const paginatedItems = useMemo(() => {
    return paginateData(filteredItems, currentPage, pageSize);
  }, [filteredItems, currentPage, pageSize]);

  const handleReset = () => {
    setSearchValue('');
    setFilterType('all');
    setCurrentPage(1);
  };

  const ICONS: { [key: string]: React.ReactNode } = {
    database: <Database size={20} color={colors.info} />,
    star: <Star size={20} color={colors.warning} />,
    package: <PackageSearch size={20} color={colors.success} />,
    trending: <TrendingUp size={20} color={colors.secondary} />,
  };

  const stats = useMemo(() => {
    if (!statsCalculators) {
      return null;
    }
    return Object.entries(statsCalculators).map(([key, calculator]) => {
      const stat = calculator(items);
      return {
        key,
        value: stat.value,
        icon: ICONS[stat.icon] || null,
      };
    });
  }, [items, statsCalculators, colors]);

  const content = (
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
            background: titleGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '32px',
          }}
        >
          {pageTitle}
        </Title>
        <Paragraph style={{ fontSize: '16px', color: colors.textSecondary, marginTop: 8 }}>
          {pageSubtitle}
        </Paragraph>
      </motion.div>

      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Row gutter={[16, 16]}>
            {stats.map((stat) => (
              <Col xs={24} sm={12} md={6} key={stat.key}>
                <Card style={{ borderRadius: 12 }}>
                  <Statistic
                    title={stat.key}
                    value={stat.value as any}
                    prefix={stat.icon}
                    valueStyle={{ color: colors.info, fontSize: '18px' }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </motion.div>
      )}
      {children}
      <SearchAndFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterType={filterType}
        onFilterChange={setFilterType}
        onReset={handleReset}
        filterOptions={filterOptions}
        searchPlaceholder={searchPlaceholder}
        resetText={resetText}
        showingText={showingText(filteredItems.length, items.length)}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {paginatedItems.length > 0 ? (
          <>
            <Row gutter={[16, 16]}>
              {paginatedItems.map((item, index) => (
                <Col xs={24} sm={12} md={8} lg={6} xl={4} key={item.id}>
                  {renderCard(item, index)}
                </Col>
              ))}
            </Row>

            {filteredItems.length > pageSize && (
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
                  total={filteredItems.length}
                  pageSize={pageSize}
                  onChange={setCurrentPage}
                  showSizeChanger={false}
                  showQuickJumper
                  showTotal={(total, range) => paginationTotalText(range[0], range[1], total)}
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
              image={<PackageSearch size={64} color={colors.textSecondary} />}
              description={
                <span style={{ color: colors.textSecondary }}>
                  {searchValue || filterType !== 'all' ? noResultsText : noDataText}
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
  );

  if (noLayout) {
    return content;
  }

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner text={loadingText} />
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

  return <Layout>{content}</Layout>;
};

export default DataView;
