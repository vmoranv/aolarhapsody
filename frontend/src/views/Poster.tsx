import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import { useQuery } from '@tanstack/react-query';
import { App, Button, Card, Empty, Image, List, Pagination, Space, Typography } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { motion } from 'framer-motion';
import { Download, Image as ImageIcon } from 'lucide-react';
import ErrorDisplay from '../components/ErrorDisplay';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchAndFilter from '../components/SearchAndFilter';
import { useTheme } from '../hooks/useTheme';
import { useSearchStore } from '../store/search';
import { SimplifiedPoster as Poster } from '../types/poster';
import { fetchData } from '../utils/api';

const { Title, Paragraph, Text } = Typography;

/**
 * @file Poster.tsx
 * @description
 * 该文件实现了海报展示页面。用户可以浏览、搜索、预览和下载游戏内的各种海报。
 * 页面使用网格布局展示海报，并支持分页功能。
 */

/**
 * 渲染单个海报卡片的组件。
 * 包含海报图片预览、名称、标签和下载功能。
 * 使用motion组件实现进入动画效果。
 * @param {object} props - 组件属性。
 * @param {Poster} props.poster - 要展示的海报数据对象。
 * @returns {React.ReactElement} 渲染的海报卡片。
 */
const PosterItem: React.FC<{ poster: Poster }> = ({ poster }) => {
  // 国际化翻译函数
  const { t } = useTranslation('poster');
  // 获取当前主题颜色配置
  const { colors } = useTheme()!;
  // 获取Ant Design的消息提示功能
  const { message } = App.useApp();
  // 构造海报图片URL
  const imageUrl = `/proxy/h5/pet/petskin/background/bg/img_petskinbackground_${poster.id}.png`;

  /**
   * 处理海报下载功能
   * 通过fetch获取图片数据，创建Blob对象并触发浏览器下载
   */
  const handleDownload = async () => {
    try {
      // 获取图片数据
      const response = await fetch(imageUrl);
      // 转换为Blob对象
      const blob = await response.blob();
      // 创建对象URL
      const url = window.URL.createObjectURL(blob);
      // 创建下载链接
      const link = document.createElement('a');
      link.href = url;
      link.download = `${poster.name}.png`;
      // 触发下载
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // 释放对象URL
      window.URL.revokeObjectURL(url);
      // 显示成功消息
      message.success(t('download_start'));
    } catch (error) {
      // 显示错误消息
      message.error(t('download_error'));
      // 输出错误日志
      console.error('下载海报时出错:', error);
    }
  };

  return (
    // Motion动画容器，实现进入动画效果
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 海报卡片 */}
      <Card
        hoverable // 启用悬停效果
        style={{
          borderRadius: 12, // 圆角
          overflow: 'hidden', // 隐藏溢出内容
          border: `1px solid ${colors.borderSecondary}`, // 边框样式
          boxShadow: `0 4px 12px ${colors.shadow || 'rgba(0, 0, 0, 0.08)'}`, // 阴影效果
        }}
        // 卡片封面，显示海报图片
        cover={
          <Image
            alt={poster.name} // 替代文本
            src={imageUrl} // 图片源
            // 预览配置
            preview={{
              mask: (
                <div
                  style={{
                    background: 'rgba(0,0,0,0.4)', // 遮罩背景
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
            style={{ height: 200, objectFit: 'cover' }} // 图片样式
            // 占位符，图片加载前显示
            placeholder={
              <div
                style={{
                  height: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: colors.fillSecondary, // 背景色
                }}
              >
                <ImageIcon size={48} color={colors.textSecondary} />
              </div>
            }
          />
        }
        // 操作按钮，提供下载功能
        actions={[
          <Button
            key="download"
            type="text"
            icon={<Download size={16} />} // 下载图标
            onClick={handleDownload} // 点击事件处理
            style={{ color: colors.textSecondary }} // 按钮样式
          >
            {t('download')}
          </Button>,
        ]}
      >
        {/* 卡片元数据，显示海报名称和标签 */}
        <Card.Meta
          title={
            <Text strong style={{ color: colors.text }} ellipsis>
              {poster.name} {/* 海报名称 */}
            </Text>
          }
          description={<Text style={{ color: colors.textSecondary }}>{poster.labelName}</Text>} // 海报标签
        />
      </Card>
    </motion.div>
  );
};

/**
 * 海报页面的核心内容组件。
 * 负责获取所有海报数据，处理搜索筛选、分页逻辑，并渲染整个页面布局。
 * 使用React Query进行数据获取和状态管理。
 * @returns {React.ReactElement} 渲染的海报页面内容。
 */
const PosterContent = () => {
  // 国际化翻译函数
  const { t } = useTranslation('poster');
  // 获取当前主题颜色配置
  const { colors } = useTheme()!;
  // 获取搜索状态管理
  const { searchValue, setResultCount, setSearchValue } = useSearchStore();
  // 当前页码状态
  const [currentPage, setCurrentPage] = useState(1);
  // 每页显示的海报数量
  const pageSize = 12;

  /**
   * 使用React Query获取海报数据
   * queryKey用于缓存和更新数据
   * queryFn定义数据获取方法
   */
  const {
    data: posters = [], // 海报数据
    isLoading, // 加载状态
    error, // 错误状态
    refetch, // 重新获取数据方法
  } = useQuery({
    queryKey: ['posters'], // 查询键
    queryFn: () => fetchData<Poster>('posters'), // 查询函数
  });

  // 添加 CopilotKit 操作
  useCopilotReadable({
    description: '当前海报页面搜索状态',
    value: `当前搜索关键词: ${searchValue}`,
  });

  useCopilotAction({
    name: 'searchPosters',
    description: '搜索海报',
    parameters: [
      {
        name: 'query',
        type: 'string',
        description: '搜索关键词',
      },
    ],
    handler: async ({ query }) => {
      setSearchValue(query);
    },
  });

  /**
   * 根据搜索值筛选海报数据
   * 使用useMemo优化性能，仅在依赖项变化时重新计算
   */
  const filteredData = useMemo(() => {
    return posters.filter(
      (p) =>
        p.name.toLowerCase().includes(searchValue.toLowerCase()) || // 按名称筛选
        p.labelName.toLowerCase().includes(searchValue.toLowerCase()) // 按标签筛选
    );
  }, [posters, searchValue]);

  /**
   * 根据当前页码和每页数量计算分页数据
   * 使用useMemo优化性能，仅在依赖项变化时重新计算
   */
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize; // 起始索引
    return filteredData.slice(startIndex, startIndex + pageSize); // 截取数据
  }, [filteredData, currentPage, pageSize]);

  /**
   * 更新搜索结果计数
   * 当筛选数据变化时更新计数
   */
  useEffect(() => {
    setResultCount(filteredData.length);
  }, [filteredData.length, setResultCount]);

  // 处理加载状态
  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner text={t('loading_posters')} /> {/* 显示加载指示器 */}
      </Layout>
    );
  }

  // 处理错误状态
  if (error) {
    return (
      <Layout>
        {/* 显示错误信息和重试按钮 */}
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
          hideFilter={true}
          searchPlaceholder={t('search_placeholder')}
          showingText={`${filteredData.length} / ${posters.length} ${t('unit_text')}`}
          resetText={t('reset')}
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

/**
 * 海报页面的顶层包裹组件。
 * 主要作用是提供 Ant Design 的 `App` context，以便 `PosterContent` 组件
 * 及其子组件可以使用 `message`、`notification` 等全局提示功能。
 * @returns {React.ReactElement} 包含 App Provider 的海报页面。
 */
const PosterPage = () => {
  return (
    <App>
      <PosterContent />
    </App>
  );
};

export default PosterPage;
