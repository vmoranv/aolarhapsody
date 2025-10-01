import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import { Divider, Spin, Typography } from 'antd';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import DataView from '../components/DataView';
import ItemCard from '../components/ItemCard';
import Layout from '../components/Layout';
import { useSearchStore } from '../store/search';
import { Tote, ToteDetail, ToteEntry } from '../types/tote';
import { fetchDataItem } from '../utils/api';
import { getToteImageUrl } from '../utils/image-helper';

const { Title, Paragraph, Text } = Typography;

/**
 * @description 背包物品展示页面组件
 * @returns {JSX.Element} 背包页面
 */
const TotePage = () => {
  const { t } = useTranslation('tote');
  const { setSearchValue, setFilterType } = useSearchStore();

  /**
   * @description 存储当前选中物品的详细信息
   */
  const [detail, setDetail] = useState<ToteDetail | null>(null);
  /**
   * @description 存储"技巧"类物品的特殊效果描述
   */
  const [specialEffectDescription, setSpecialEffectDescription] = useState<string>('');
  /**
   * @description 详情数据加载状态
   */
  const [loadingDetail, setLoadingDetail] = useState(false);

  useCopilotReadable({
    description: '当前背包物品页面筛选状态',
    value: '背包物品页面支持筛选和搜索功能',
  });

  useCopilotAction({
    name: 'searchTote',
    description: '搜索背包物品',
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
    name: 'filterTote',
    description: '筛选背包物品',
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
    name: 'showToteDetails',
    description: '显示特定背包物品的详细信息',
    parameters: [
      {
        name: 'name',
        type: 'string',
        description: '要显示详细信息的背包物品名称',
        required: true,
      },
    ],
    handler: async ({ name }) => {
      // 在实际应用中，这会查找并显示特定背包物品的详细信息
      // 临时使用name变量以避免TypeScript警告
      console.warn(`Searching for Tote with name: ${name}`);
    },
  });

  /**
   * @description 处理物品卡片点击事件，获取并显示详细信息
   * @param {Tote} tote - 被点击的物品
   */
  const handleCardClick = async (tote: Tote) => {
    setLoadingDetail(true);
    setSpecialEffectDescription('');
    setDetail(null);
    try {
      const data = await fetchDataItem<ToteDetail>('totes/data', tote.id.toString());
      setDetail(data);
      const { type, effectValue } = data;

      // type: 0 (技巧) -> 解析 effectValue
      if (type === 0) {
        const entryId = parseInt(effectValue, 10);
        if (!isNaN(entryId) && entryId.toString() === effectValue) {
          try {
            const entryData = await fetchDataItem<ToteEntry>('totes/entries', entryId.toString());
            setSpecialEffectDescription(entryData.des);
          } catch (entryError) {
            console.error(`Failed to fetch tote entry ${entryId}`, entryError);
            setSpecialEffectDescription(effectValue); // Fallback
          }
        } else {
          setSpecialEffectDescription(effectValue);
        }
      }
      // type: 1 (强力) -> 不需要额外操作，直接使用 baseValue 和 advantageValue
    } catch (error) {
      console.error('Failed to fetch tote detail', error);
    } finally {
      setLoadingDetail(false);
    }
  };

  /**
   * @description 筛选选项
   */
  const filterOptions = [
    { value: 'all', label: t('filter_all') },
    { value: 'super', label: t('filter_super') },
    { value: 'normal', label: t('filter_normal') },
  ];

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
            background: 'linear-gradient(135deg, #eb2f96 0%, #f759ab 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '32px',
          }}
        >
          {t('page_title')}
        </Title>
        <Paragraph style={{ fontSize: '16px', color: 'var(--text-secondary-dark)', marginTop: 8 }}>
          {t('page_subtitle')}
        </Paragraph>
      </motion.div>
      <DataView<Tote>
        queryKey={['totes']}
        dataUrl="totes/data"
        renderCard={(tote, index) => (
          <ItemCard
            item={tote}
            index={index}
            imageUrl={getToteImageUrl(tote.id)}
            icon={<Package size={48} color="white" />}
          />
        )}
        onCardClick={handleCardClick}
        renderDetailDialog={(tote) =>
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
                src={getToteImageUrl(tote.id, true)}
                alt={tote.name}
                style={{ width: 200, height: 200, objectFit: 'contain', borderRadius: 8 }}
              />
              <div style={{ flex: 1 }}>
                <Paragraph>{detail.tujianDes}</Paragraph>
                <Divider />
                <Paragraph>
                  <Text strong>{t('quality')}: </Text>
                  <Text>{detail.color === 0 ? t('quality_legendary') : t('quality_epic')}</Text>
                </Paragraph>
                {detail.type === 1 ? (
                  <>
                    <Paragraph>
                      <Text strong>{t('attribute_bonus')}: </Text>
                      <Text>{detail.baseValue}</Text>
                    </Paragraph>
                    <Paragraph>
                      <Text strong>{t('applicable_attribute')}: </Text>
                      <Text>{detail.advantageValue}</Text>
                    </Paragraph>
                  </>
                ) : (
                  <Paragraph>
                    <Text strong>{t('special_effect')}: </Text>
                    <Text>{specialEffectDescription}</Text>
                  </Paragraph>
                )}
              </div>
            </div>
          ) : null
        }
        getSearchableFields={(tote) => [tote.name, tote.desc || '', tote.category || '']}
        getQuality={(tote) => tote.quality}
        noLayout
        searchPlaceholder={t('search_placeholder')}
        loadingText={t('loading_data')}
        errorText={t('load_error')}
        paginationTotalText={(start, end, total) =>
          t('pagination_total', { rangeStart: start, rangeEnd: end, total })
        }
        noResultsText={t('no_results')}
        noDataText={t('no_data')}
        filterOptions={filterOptions}
        resetText={t('reset')}
        showingText={(filteredCount, totalCount) => (
          <Trans
            i18nKey="showing_items"
            ns="tote"
            values={{
              filteredCount,
              totalCount,
              unit: t('unit_text'),
            }}
            components={{ 1: <span style={{ fontWeight: 600 }} /> }}
          />
        )}
      />
    </Layout>
  );
};

export default TotePage;
