import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { Card, Col, Empty, Pagination, Row, Space, Statistic } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { motion } from 'framer-motion';
import { Database, PackageSearch, Star, TrendingUp } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useDialogStore } from '../store/dialog';
import { useSearchStore } from '../store/search';
import { fetchData, filterBySearch, filterByType, paginateData } from '../utils/api';
import DetailDialog from './DetailDialog';
import ErrorDisplay from './ErrorDisplay';
import Layout from './Layout';
import LoadingSpinner from './LoadingSpinner';
import SearchAndFilter, { FilterType } from './SearchAndFilter';

/**
 * @description 通用数据项约束
 * @interface DataItem
 * @property {(number | string)} id - 唯一标识符
 * @property {string} name - 名称
 * @property {number} [quality] - 品质
 */
export interface DataItem {
  id: number | string;
  name: string;
  quality?: number;
  [key: string]: any;
}

/**
 * @description DataView 组件的属性
 * @interface DataViewProps
 * @template T - 继承自 DataItem 的数据类型
 * @property {(string | number)[]} queryKey - react-query 的查询键
 * @property {string} [dataUrl] - 获取数据的 API 地址
 * @property {T[]} [data] - 直接传入的数据
 * @property {(item: T, index: number) => React.ReactNode} renderCard - 渲染卡片的函数
 * @property {(item: T) => React.ReactNode} [renderDetailDialog] - 渲染详情弹窗内容的函数
 * @property {(item: T) => Promise<void>} [onCardClick] - 卡片点击事件处理函数
 * @property {(item: T) => string[]} getSearchableFields - 获取可搜索字段的函数
 * @property {(item: T) => number} [getQuality] - 获取品质的函数
 * @property {{ [key: string]: (data: T[]) => { value: number | string; icon: string } }} [statsCalculators] - 统计数据计算器
 * @property {string} [searchPlaceholder] - 搜索框占位符
 * @property {boolean} [noLayout] - 是否不使用默认布局
 * @property {string} loadingText - 加载时显示的文本
 * @property {string} errorText - 错误时显示的文本
 * @property {(start: number, end: number, total: number) => string} paginationTotalText - 分页总数文本
 * @property {string} noResultsText - 无搜索结果时显示的文本
 * @property {string} noDataText - 无数据时显示的文本
 * @property {{ label: string; value: FilterType }[]} [filterOptions] - 筛选选项
 * @property {string} resetText - 重置按钮文本
 * @property {(filteredCount: number, totalCount: number) => React.ReactNode} showingText - 显示条目数文本
 * @property {React.ReactNode} [children] - 子组件
 */
interface DataViewProps<T extends DataItem> {
  queryKey: (string | number)[];
  dataUrl?: string;
  data?: T[];
  renderCard: (item: T, index: number) => React.ReactNode;
  renderDetailDialog?: (item: T) => React.ReactNode;
  onCardClick?: (item: T) => Promise<void>;
  getSearchableFields: (item: T) => string[];
  getQuality?: (item: T) => number;
  statsCalculators?: {
    [key: string]: (data: T[]) => { value: number | string; icon: string };
  };
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

/**
 * @description 通用数据展示组件，用于获取、筛选、分页和展示数据
 * @template T - 继承自 DataItem 的数据类型
 * @param {DataViewProps<T>} props - 组件属性
 * @returns {JSX.Element} 数据展示组件
 */
const DataView = <T extends DataItem>({
  queryKey,
  dataUrl,
  data,
  renderCard,
  renderDetailDialog,
  onCardClick,
  getSearchableFields,
  getQuality,
  statsCalculators,
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
  const { searchValue, filterType } = useSearchStore();
  const [currentPage, setCurrentPage] = useState(1);
  const {
    detailItem: selectedItem,
    isDetailVisible,
    hideDetail: handleCloseDetail,
    showDetail,
  } = useDialogStore();
  const pageSize = 24;

  const {
    data: fetchedData = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKey,
    queryFn: () => (dataUrl ? fetchData<T>(dataUrl) : Promise.resolve([])),
    enabled: !data, // Only fetch if data is not provided
  });

  const items = data || fetchedData;

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

  const handleCardClick = async (item: T) => {
    if (onCardClick) {
      await onCardClick(item);
    }
    showDetail(item);
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
                  <div onClick={() => handleCardClick(item)} style={{ cursor: 'pointer' }}>
                    {renderCard(item, index)}
                  </div>
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
                  locale={zhCN.Pagination}
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
      {renderDetailDialog && (
        <DetailDialog
          item={selectedItem as T | null}
          visible={isDetailVisible}
          onClose={handleCloseDetail}
          renderContent={renderDetailDialog as (item: T) => React.ReactNode}
        />
      )}
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
