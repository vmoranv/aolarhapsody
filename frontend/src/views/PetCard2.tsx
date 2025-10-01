// 导入React及相关库
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import { Spin, Typography } from 'antd';
import { motion } from 'framer-motion';
// 导入自定义组件
import DataView from '../components/DataView';
import ItemCard from '../components/ItemCard';
import Layout from '../components/Layout';
import { useSearchStore } from '../store/search';
// 导入类型定义
import type { PetCard2, PetCard2DescriptionsResponse, PetCard2Detail } from '../types/petCard2';
// 导入API和图像帮助函数
import { fetchDataItem } from '../utils/api';
import { getPetCard2ImageUrl } from '../utils/image-helper';

// 从Typography中解构出Title, Paragraph, Text组件
const { Title, Paragraph, Text } = Typography;

/**
 * 宠物卡片2页面组件
 * @returns {JSX.Element} 渲染一个展示宠物卡片2信息的页面
 */
const PetCard2Page = () => {
  // 使用i18next的useTranslation hook来进行国际化
  const { t } = useTranslation('petCard2');
  // 定义状态，用于存储当前选中的宠物卡片2的详细信息
  const [detail, setDetail] = useState<PetCard2Detail | null>(null);
  // 定义状态，用于存储宠物卡片2的描述信息
  const [descriptions, setDescriptions] = useState<PetCard2DescriptionsResponse | null>(null);
  // 定义状态，用于控制加载详细信息时的加载状态
  const [loadingDetail, setLoadingDetail] = useState(false);
  const { setSearchValue, setFilterType } = useSearchStore();

  /**
   * 处理卡片点击事件
   * @param {PetCard2} petCard2 - 被点击的宠物卡片2对象
   */
  const handleCardClick = async (petCard2: PetCard2) => {
    setLoadingDetail(true); // 开始加载，设置loading为true
    try {
      // 并行获取宠物卡片2的详细信息和描述信息
      const [detailData, descriptionsData] = await Promise.all([
        fetchDataItem<PetCard2Detail>('petcard2s', petCard2.id.toString()),
        fetchDataItem<PetCard2DescriptionsResponse>(
          'petcard2s/descriptions',
          petCard2.id.toString()
        ),
      ]);
      // 更新状态
      setDetail(detailData);
      setDescriptions(descriptionsData);
    } catch (error) {
      // 如果获取失败，在控制台打印错误信息
      console.error('Failed to fetch petCard2 detail', error);
    } finally {
      // 加载结束，设置loading为false
      setLoadingDetail(false);
    }
  };

  // 添加 CopilotKit 操作
  useCopilotReadable({
    description: '当前宠物卡片2页面筛选状态',
    value: '宠物卡片2页面支持筛选和搜索功能',
  });

  useCopilotAction({
    name: 'searchPetCard2',
    description: '搜索宠物卡片2',
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
    name: 'filterPetCard2',
    description: '筛选宠物卡片2',
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
    name: 'showPetCard2Details',
    description: '显示特定宠物卡片2的详细信息',
    parameters: [
      {
        name: 'name',
        type: 'string',
        description: '要显示详细信息的宠物卡片2名称',
        required: true,
      },
    ],
    handler: async ({ name }) => {
      // 在实际应用中，这会查找并显示特定PetCard2的详细信息
      // 临时使用name变量以避免TypeScript警告
      console.warn(`Searching for PetCard2 with name: ${name}`);
    },
  });

  return (
    <Layout>
      {/* 页面标题和副标题，使用framer-motion实现动画效果 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title
          level={1}
          style={{
            margin: 0,
            background: 'linear-gradient(135deg, #13c2c2 0%, #36cfc9 100%)',
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
      {/* 使用DataView组件来展示宠物卡片2列表 */}
      <DataView<PetCard2>
        queryKey={['pet-card2s-view']} // React Query的查询键
        dataUrl="petcard2s" // 数据获取的URL
        // 自定义卡片渲染逻辑
        renderCard={(petCard2, index) => (
          <ItemCard
            item={petCard2}
            index={index}
            imageUrl={getPetCard2ImageUrl(petCard2.id)}
            icon={<div />}
          />
        )}
        onCardClick={handleCardClick} // 卡片点击事件处理函数
        // 自定义详情弹窗渲染逻辑
        renderDetailDialog={(petCard2) =>
          loadingDetail ? (
            // 加载中，显示Spin组件
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
            // 加载完成且有数据，显示详情
            <div style={{ display: 'flex', gap: '24px' }}>
              <img
                src={getPetCard2ImageUrl(petCard2.id)}
                alt={petCard2.name}
                style={{ width: 200, height: 200, objectFit: 'contain', borderRadius: 8 }}
              />
              <div style={{ flex: 1 }}>
                <Paragraph>
                  <Text strong>
                    {t('detail_apply_id_and_descriptions', { applyId: detail.applyId })}
                  </Text>
                </Paragraph>
                {/* 渲染描述信息 */}
                {descriptions &&
                  descriptions.descriptions.map((desc) => (
                    <Paragraph key={desc.level}>
                      <Text>
                        {t('level_description', {
                          level: desc.level,
                          description: desc.description,
                        })}
                      </Text>
                    </Paragraph>
                  ))}
              </div>
            </div>
          ) : null
        }
        // 定义可搜索的字段
        getSearchableFields={(card) => [
          card.name,
          card.id.toString(),
          ...card.raceList.map((r) => r.toString()),
        ]}
        getQuality={(card) => card.vip} // 定义卡片品质
        noLayout // 不使用DataView的默认布局
        // 国际化文本
        loadingText={t('loading_data')}
        errorText={t('load_error')}
        paginationTotalText={(start, end, total) =>
          t('pagination_total', { rangeStart: start, rangeEnd: end, total })
        }
        noResultsText={t('no_results')}
        noDataText={t('no_data')}
        searchPlaceholder={t('search_placeholder')}
        // 筛选选项
        filterOptions={[
          { value: 'all', label: t('filter_all') },
          { value: 'super', label: t('filter_super') },
          { value: 'normal', label: t('filter_normal') },
        ]}
        resetText={t('reset')}
        // “显示中”文本的渲染
        showingText={(filteredCount, totalCount) => (
          <Trans
            i18nKey="showing_items"
            ns="petCard2"
            values={{
              filteredCount,
              totalCount,
            }}
            components={{ 1: <span style={{ fontWeight: 600 }} /> }}
          />
        )}
      />
    </Layout>
  );
};

export default PetCard2Page;
