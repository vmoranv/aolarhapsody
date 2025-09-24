import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { App, Button, Empty, List, Pagination, Space, Typography } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { motion } from 'framer-motion';
import { Copy, Package } from 'lucide-react';
import ErrorDisplay from '../components/ErrorDisplay';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchAndFilter from '../components/SearchAndFilter';
import { useTheme } from '../hooks/useTheme';
import { useSearchStore } from '../store/search';
import { fetchData } from '../utils/api';

const { Title, Paragraph, Text } = Typography;

/**
 * 现有封包数据类型定义
 * 用于描述游戏中现有的封包数据结构
 */
interface ExistingPacket {
  name: string; // 封包名称 - 描述封包用途的文本
  packet: string; // 封包内容 - 实际的封包数据字符串
}

/**
 * 现有封包列表项组件
 * 负责渲染单个封包数据项，提供复制功能
 * @param packet - 单个封包的数据
 */
const ExistingPacketItem: React.FC<{ packet: ExistingPacket }> = ({ packet }) => {
  const { t } = useTranslation('existingPackets');
  const { colors } = useTheme()!;
  const { message } = App.useApp();

  /**
   * 复制封包内容到剪贴板
   * 使用现代浏览器的Clipboard API实现
   */
  const handleCopyPackage = async () => {
    try {
      // 将封包内容写入剪贴板
      await navigator.clipboard.writeText(packet.packet);
      // 显示成功提示
      message.success(t('copy_success'));
    } catch {
      // 复制失败时显示错误提示
      message.error(t('copy_failed'));
    }
  };

  return (
    <List.Item
      style={{
        padding: '16px 24px',
        background: colors.surface,
        borderRadius: 8,
        border: `1px solid ${colors.borderSecondary}`,
        marginBottom: 8,
        boxShadow: `0 4px 12px ${colors.shadow || 'rgba(0, 0, 0, 0.08)'}`,
        transition: 'box-shadow 0.3s ease',
      }}
      actions={[
        <Button
          key="copy"
          type="primary"
          icon={<Copy size={16} />}
          onClick={handleCopyPackage}
          size="small"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.primary,
            color: colors.primary,
          }}
        >
          {t('copy_packet')}
        </Button>,
      ]}
    >
      <List.Item.Meta
        avatar={
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary}dd 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Package size={20} color="white" />
          </div>
        }
        title={
          <Text strong style={{ fontSize: '16px', color: colors.text }}>
            {packet.name}
          </Text>
        }
        description={
          <div style={{ marginTop: 8 }}>
            <Text
              style={{
                fontSize: '12px',
                color: colors.textSecondary,
                marginBottom: 4,
                display: 'block',
              }}
            >
              {t('packet_content')}:
            </Text>
            <div
              style={{
                padding: '8px 12px',
                background: colors.fillSecondary || '#f5f5f5',
                borderRadius: 6,
                border: `1px solid ${colors.borderSecondary}`,
                wordBreak: 'break-all',
                fontSize: '12px',
                fontFamily: 'monospace',
                color: colors.textSecondary,
                lineHeight: '1.4',
              }}
            >
              {packet.packet}
            </div>
          </div>
        }
      />
    </List.Item>
  );
};

/**
 * 现有封包页面组件内部实现
 * - 使用 React Query 获取现有封包数据
 * - 实现搜索和分页功能
 * - 提供用户友好的界面展示封包数据
 */
const ExistingPacketsContent = () => {
  const { t } = useTranslation(['existingPackets', 'common']);
  const { colors } = useTheme()!;
  // 获取全局搜索状态管理
  const { searchValue, setResultCount } = useSearchStore();
  // 当前页码状态
  const [currentPage, setCurrentPage] = useState(1);
  // 每页显示的数据条数
  const pageSize = 10;

  // 使用React Query获取封包数据
  const {
    data: packets = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['existing-packets'],
    queryFn: () => fetchData<ExistingPacket>('existing-activities'),
  });

  // 筛选和搜索逻辑 - 根据搜索关键词过滤封包数据
  const filteredData = useMemo(() => {
    let filtered = packets;

    // 按名称或封包内容搜索
    if (searchValue.trim()) {
      filtered = filtered.filter(
        (packet) =>
          packet.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          packet.packet.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    return filtered;
  }, [packets, searchValue]);

  // 分页数据 - 根据当前页码和页面大小计算需要显示的数据
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // 更新搜索结果计数
  useEffect(() => {
    setResultCount(filteredData.length);
  }, [filteredData.length, setResultCount]);

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
          onRetry={refetch}
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
              background: 'linear-gradient(135deg, #722ed1 0%, #b37feb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '32px',
            }}
          >
            {t('title')}
          </Title>
          <Paragraph style={{ fontSize: '16px', color: colors.textSecondary, marginTop: 8 }}>
            {t('subtitle')}
          </Paragraph>
        </motion.div>

        {/* 搜索和筛选 */}
        <SearchAndFilter
          hideFilter={true}
          searchPlaceholder={t('search_placeholder')}
          showingText={
            <Trans
              i18nKey="showing_packets"
              ns="existingPackets"
              values={{
                filteredCount: filteredData.length,
                totalCount: packets.length,
              }}
              components={{ 1: <span style={{ fontWeight: 600, color: colors.primary }} /> }}
            />
          }
          resetText={t('reset')}
        />

        {/* 数据列表 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {paginatedData.length > 0 ? (
            <>
              <List
                dataSource={paginatedData}
                renderItem={(packet) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ExistingPacketItem packet={packet} />
                  </motion.div>
                )}
                style={{
                  background: 'transparent',
                }}
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
                      t('pagination_total', { start: range[0], end: range[1], total })
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
                    {searchValue ? t('no_match_found') : t('no_data')}
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

/**
 * 现有封包页面的主组件。
 *
 * 该组件作为容器，使用 Ant Design 的 `<App>` 组件包裹 `ExistingPacketsContent`，
 * 以便在子组件中能够使用 `message`、`notification` 等上下文相关的API。
 * @component
 * @returns {React.ReactElement} 渲染后的现有封包页面。
 */
const ExistingPackets = () => {
  return (
    <App>
      <ExistingPacketsContent />
    </App>
  );
};

export default ExistingPackets;
