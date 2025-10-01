/**
 * @file 魂卡（HK）数据展示页面
 * @description 该页面用于展示游戏中的魂卡数据。它利用通用的 DataView 组件来处理数据的获取、
 * 分页、搜索和网格布局显示。当用户点击单个魂卡时，会进一步获取并展示该魂卡关联的
 * Buff 效果的详细信息。
 *
 * @module views/HK
 * @requires antd
 * @requires framer-motion
 * @requires lucide-react
 * @requires react
 * @requires react-i18next
 * @requires ../components/DataView
 * @requires ../components/ItemCard
 * @requires ../components/Layout
 * @requires ../types/hk
 * @requires ../utils/api
 * @requires ../utils/hk-utils
 * @requires ../utils/image-helper
 */
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import { Divider, Spin, Typography } from 'antd';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import DataView from '../components/DataView';
import ItemCard from '../components/ItemCard';
import Layout from '../components/Layout';
import { useSearchStore } from '../store/search';
import type { HKBuff, HKData } from '../types/hk';
import { fetchDataItem } from '../utils/api';
import { fetchHKBuffDetail, parseWordBar } from '../utils/hk-utils';
import { getHKImageUrl } from '../utils/image-helper';

const { Title, Paragraph, Text } = Typography;

/**
 * 魂卡（HK）数据展示页面组件。
 *
 * 该组件负责渲染魂卡数据的展示界面。
 * - 使用 `useState` 管理当前选中魂卡的详细信息、加载状态以及关联的 Buff 详情。
 * - 封装了 `handleCardClick` 方法，用于在用户点击卡片时异步获取魂卡及其关联 Buff 的详细数据。
 * - 依赖 `DataView` 组件处理通用的数据展示逻辑。
 * - 提供了 `parseHtmlTags` 和 `getProduceTypeText` 等辅助函数用于格式化显示。
 *
 * @component
 * @returns {React.ReactElement} 渲染后的魂卡页面。
 */
const HKPage = () => {
  const { t } = useTranslation('hk');
  const [detail, setDetail] = useState<HKData | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [buffDetails, setBuffDetails] = useState<Record<number, HKBuff>>({});
  const { setSearchValue, setFilterType } = useSearchStore();

  /**
   * 处理魂卡卡片点击事件。
   * 当用户点击一个魂卡时，该函数会：
   * 1. 异步获取该魂卡的详细数据。
   * 2. 解析 `wordBar` 字段以提取关联的 Buff ID 和等级。
   * 3. 并行获取所有关联 Buff 的详细信息。
   * 4. 更新组件状态以显示详细信息。
   * @async
   * @param {HKData} hk - 被点击的魂卡对象。
   */
  const handleCardClick = async (hk: HKData) => {
    setLoadingDetail(true);
    try {
      const data = await fetchDataItem<HKData>('hkdata', hk.id.toString());
      setDetail(data);

      const buffItems = parseWordBar(data.wordBar);
      const buffDetailsMap: Record<number, HKBuff> = {};

      await Promise.all(
        buffItems.map(async ({ buffId }) => {
          try {
            if (!buffDetailsMap[buffId]) {
              const buffDetail = await fetchHKBuffDetail(buffId);
              buffDetailsMap[buffId] = buffDetail;
            }
          } catch (error) {
            console.error(`Failed to fetch buff detail for ID ${buffId}`, error);
          }
        })
      );

      setBuffDetails(buffDetailsMap);
    } catch (error) {
      console.error('Failed to fetch hk detail', error);
    } finally {
      setLoadingDetail(false);
    }
  };

  // 添加 CopilotKit 操作
  useCopilotReadable({
    description: '当前魂卡页面筛选状态',
    value: '魂卡页面支持筛选和搜索功能',
  });

  useCopilotAction({
    name: 'searchHK',
    description: '搜索魂卡',
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

  useCopilotAction({
    name: 'filterHK',
    description: '筛选魂卡',
    parameters: [
      {
        name: 'filterType',
        type: 'string',
        description: '筛选类型',
        enum: ['all', 'super', 'normal'],
      },
    ],
    handler: async ({ filterType }) => {
      setFilterType(filterType);
    },
  });

  useCopilotAction({
    name: 'showHKDetails',
    description: '显示特定魂卡的详细信息',
    parameters: [
      {
        name: 'name',
        type: 'string',
        description: '要显示详细信息的魂卡名称',
        required: true,
      },
    ],
    handler: async ({ name }) => {
      // 在实际应用中，这会查找并显示特定HK的详细信息
      // 临时使用name变量以避免TypeScript警告
      console.warn(`Searching for HK with name: ${name}`);
    },
  });

  /**
   * 用于 `DataView` 组件的筛选器选项。
   * @type {Array<{value: string, label: string}>}
   */
  const filterOptions = [
    { value: 'all', label: t('filter_all') },
    { value: 'super', label: t('filter_super') },
    { value: 'normal', label: t('filter_normal') },
  ];

  /**
   * 一个简单的 HTML 解析器，用于将包含 `<font>` 标签的字符串转换为 React 元素。
   * @param {string} html - 包含 HTML 标签的字符串。
   * @returns {React.ReactElement} 渲染后的 React 元素。
   */
  const parseHtmlTags = (html: string): React.ReactElement => {
    if (!html) return <>{html}</>;

    const fontTagRegex = /<font\s+color=['"]([^'"]*)['"]>([^<]*)<\/font>/i;
    const match = html.match(fontTagRegex);

    if (match) {
      const [, color, text] = match;
      return <span style={{ color }}>{text}</span>;
    }

    return <>{html}</>;
  };

  /**
   * 根据产出类型代码返回对应的本地化文本。
   * @param {number} produceType - 产出类型的数字代码。
   * @returns {string} 本地化的产出类型名称。
   */
  const getProduceTypeText = (produceType: number) => {
    switch (produceType) {
      case 0:
        return t('produce_type_common');
      case 1:
        return t('produce_type_rare');
      case 2:
        return t('produce_type_special');
      case 3:
        return t('produce_type_limited');
      default:
        return t('produce_type_unknown');
    }
  };

  /**
   * 渲染单个 Buff 的信息。
   * @param {number} buffId - Buff 的 ID。
   * @param {number} level - Buff 的等级。
   * @param {number} index - 在列表中的索引，用于 key。
   * @param {boolean} isMainBuff - 是否为主要 Buff（用于决定是否显示描述）。
   * @returns {React.ReactElement} 渲染后的 Buff 信息元素。
   */
  const renderBuffInfo = (buffId: number, level: number, index: number, isMainBuff: boolean) => {
    const buff = buffDetails[buffId];
    if (!buff) {
      return (
        <div key={`${buffId}-${index}`} style={{ marginBottom: 8 }}>
          <Paragraph style={{ margin: 0 }}>
            <Text type="secondary">Buff {buffId}</Text>
            <Text type="secondary"> LV.{level}</Text>
          </Paragraph>
        </div>
      );
    }

    const validLevel = Math.max(1, Math.min(level, buff.decs.length));

    return (
      <div key={`${buffId}-${index}`} style={{ marginBottom: 8 }}>
        <Paragraph style={{ margin: 0 }}>
          {parseHtmlTags(buff.fontColor)}
          <Text> LV.{validLevel}</Text>
        </Paragraph>
        {isMainBuff && buff.decs && buff.decs.length > 0 && (
          <Paragraph style={{ margin: '4px 0 0 0' }}>
            <Text type="secondary">{buff.decs[0]}</Text>
          </Paragraph>
        )}
      </div>
    );
  };

  return (
    <Layout>
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
          {t('page_title_hks')}
        </Title>
        <Paragraph style={{ fontSize: '16px', color: 'var(--text-secondary-dark)', marginTop: 8 }}>
          {t('page_subtitle_hks')}
        </Paragraph>
      </motion.div>
      <DataView<HKData>
        queryKey={['hk-data-view']}
        dataUrl="hkdata"
        onCardClick={handleCardClick}
        renderCard={(hk, index) => (
          <ItemCard
            item={hk}
            index={index}
            imageUrl={getHKImageUrl(hk.id)}
            icon={<Heart size={48} color="white" />}
          />
        )}
        renderDetailDialog={() =>
          loadingDetail ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 200,
              }}
            >
              <Spin size="large" />
            </div>
          ) : detail ? (
            <div style={{ display: 'flex', gap: '24px' }}>
              <img
                src={getHKImageUrl(detail.id)}
                alt={detail.name}
                style={{ width: 200, height: 200, objectFit: 'contain', borderRadius: 8 }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ maxWidth: 400 }}>
                  {parseWordBar(detail.wordBar).map(({ buffId, level }, index, array) =>
                    renderBuffInfo(buffId, level, index, index === array.length - 1)
                  )}
                  <Divider />
                  <Paragraph>
                    <Text strong>{t('color')}: </Text>
                    <Text>{detail.color}</Text>
                  </Paragraph>
                  <Paragraph>
                    <Text strong>{t('produce_type_common')}: </Text>
                    <Text>{getProduceTypeText(detail.produceType)}</Text>
                  </Paragraph>
                </div>
              </div>
            </div>
          ) : null
        }
        getSearchableFields={(hk) => [hk.name, hk.id.toString(), hk.wordBar]}
        getQuality={(hk) => hk.color}
        noLayout
        loadingText={t('loading_data')}
        errorText={t('load_failed')}
        paginationTotalText={(start, end, total) =>
          t('pagination_total', { rangeStart: start, rangeEnd: end, total })
        }
        noResultsText={t('no_results')}
        noDataText={t('no_data')}
        searchPlaceholder={t('search_placeholder')}
        filterOptions={filterOptions}
        resetText={t('reset')}
        showingText={(filteredCount, totalCount) => (
          <Trans
            i18nKey="showing_items"
            ns="hk"
            values={{
              filteredCount,
              totalCount,
              unit: t('unit_text_hk'),
            }}
            components={{ 1: <span style={{ fontWeight: 600 }} /> }}
          />
        )}
      />
    </Layout>
  );
};

export default HKPage;
