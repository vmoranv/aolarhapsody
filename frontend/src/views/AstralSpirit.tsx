import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import { Col, Divider, Row, Spin, Tag, Typography } from 'antd';
import { motion } from 'framer-motion';
import { Crown, Zap } from 'lucide-react';
import DataView from '../components/DataView';
import ItemCard from '../components/ItemCard';
import Layout from '../components/Layout';
import { useSearchStore } from '../store/search';
import type { AstralSpirit, AstralSpiritSuit } from '../types/astralSpirit';
import { fetchDataItem } from '../utils/api';
import { getAstralSpiritImageUrl, getAstralSpiritSuitImageUrl } from '../utils/image-helper';

const { Title, Paragraph, Text } = Typography;

/**
 * @file AstralSpirit.tsx
 * @description
 * 星灵展示页面组件，用于展示游戏中的星灵和星灵套装信息。
 * 支持两种视图模式：星灵视图和套装视图，用户可以在两者之间切换。
 * 组件使用DataView进行数据展示和交互处理，并提供详情弹窗功能。
 */

/**
 * @description 星灵展示页面组件
 * @returns {JSX.Element} 星灵展示页面
 */
const AstralSpiritPage: React.FC = () => {
  // 国际化翻译函数
  const { t } = useTranslation('astralSpirit');

  /**
   * @description 视图模式状态，'spirits' 为星灵视图，'suits' 为套装视图
   */
  const [viewMode, setViewMode] = useState<'spirits' | 'suits'>('spirits');
  const { setSearchValue, setFilterType } = useSearchStore();

  useCopilotReadable({
    description: '当前星灵页面视图模式',
    value: `当前正在查看${viewMode === 'spirits' ? '星灵' : '套装'}`,
  });

  useCopilotAction({
    name: 'searchAstralSpirits',
    description: '在星灵或套装中搜索',
    parameters: [
      {
        name: 'query',
        type: 'string',
        description: '要搜索的关键词',
      },
    ],
    handler: async ({ query }) => {
      setSearchValue(query);
    },
  });

  useCopilotAction({
    name: 'filterAstralSpirits',
    description: '筛选星灵或套装',
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
    name: 'toggleAstralSpiritView',
    description: '切换星灵或套装视图',
    parameters: [
      {
        name: 'view',
        type: 'string',
        description: '要切换到的视图',
        enum: ['spirits', 'suits'],
      },
    ],
    handler: async ({ view }) => {
      setViewMode(view);
    },
  });

  /**
   * @description 详情弹窗中显示的星灵或套装数据
   */
  const [detail, setDetail] = useState<AstralSpirit | AstralSpiritSuit | null>(null);

  /**
   * @description 详情数据加载状态
   */
  const [loadingDetail, setLoadingDetail] = useState(false);

  /**
   * @description 处理卡牌点击事件，获取并显示详情
   * 当用户点击星灵或套装卡片时，调用API获取详细信息并在弹窗中显示
   * @param {AstralSpirit | AstralSpiritSuit} item - 被点击的星灵或套装
   */
  const handleCardClick = async (item: AstralSpirit | AstralSpiritSuit) => {
    // 设置加载状态
    setLoadingDetail(true);
    try {
      // 根据当前视图模式确定API端点
      const endpoint = viewMode === 'suits' ? 'astral-spirit-suit' : 'astral-spirit';
      // 调用API获取详细信息
      const data = await fetchDataItem<AstralSpirit | AstralSpiritSuit>(endpoint, String(item.id));
      // 设置详情数据状态
      setDetail(data);
    } catch (error) {
      // 错误处理
      console.error('Failed to fetch astral spirit detail', error);
    } finally {
      // 重置加载状态
      setLoadingDetail(false);
    }
  };

  /**
   * @description 渲染详情弹窗内容
   * 根据详情数据类型（星灵或套装）渲染不同的详情内容
   * @returns {JSX.Element | null} 详情弹窗内容
   */
  const renderDetailDialog = () => {
    // 如果正在加载，显示加载指示器
    if (loadingDetail) {
      return (
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
      );
    }

    // 如果没有详情数据，返回null
    if (!detail) {
      return null;
    }

    // 根据数据类型渲染不同的详情内容
    if ('surIds' in detail) {
      // Render AstralSpiritSuit detail
      const suit = detail as AstralSpiritSuit;
      return (
        <div style={{ padding: '16px' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* 显示组成套装的所有星灵图片 */}
            {suit.surIds && suit.surIds.length > 0 && (
              <div
                style={{
                  width: '100%',
                  marginTop: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Text strong style={{ marginBottom: 12, fontSize: '16px' }}>
                  {t('included_spirits')}:
                </Text>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '12px',
                    maxWidth: '100%',
                  }}
                >
                  {suit.surIds.map((spiritId) => (
                    <div
                      key={spiritId}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <img
                        src={getAstralSpiritImageUrl(spiritId)}
                        alt={`Spirit ${spiritId}`}
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: 'contain',
                          borderRadius: 6,
                          border: '1px solid #ddd',
                        }}
                      />
                      <Text style={{ fontSize: '14px', marginTop: '6px', fontWeight: '500' }}>
                        {spiritId}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 24, width: '100%' }}>
              <Divider style={{ margin: '16px 0' }} />

              <div style={{ paddingLeft: 24, paddingRight: 24 }}>
                <Paragraph style={{ fontSize: '15px', marginBottom: '12px' }}>
                  <Text strong>{t('suit_effect')}:</Text> {suit.suitEffectDes}
                </Paragraph>
                <Paragraph style={{ fontSize: '15px', marginBottom: '12px' }}>
                  <Text strong>{t('one_shenhua_effect')}:</Text> {suit.oneShenhuaSuitEffectDes}
                </Paragraph>
                <Paragraph style={{ fontSize: '15px', marginBottom: '12px' }}>
                  <Text strong>{t('three_shenhua_effect')}:</Text> {suit.threeShenHuaSuitEffectDes}
                </Paragraph>
                <Paragraph style={{ fontSize: '15px' }}>
                  <Text strong>{t('active_need')}:</Text> {suit.activeNeed} {t('spirits_text')}
                </Paragraph>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      // Render AstralSpirit detail
      const spirit = detail as AstralSpirit;
      return (
        <div style={{ display: 'flex', gap: '24px' }}>
          <img
            src={getAstralSpiritImageUrl(spirit.id, spirit.level)}
            alt={spirit.name}
            style={{ width: 200, height: 200, objectFit: 'contain', borderRadius: 8 }}
          />
          <div style={{ flex: 1 }}>
            <Paragraph>{spirit.desc}</Paragraph>
            <Divider />
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Text strong>HP:</Text> {spirit.hp}
              </Col>
              <Col span={8}>
                <Text strong>速度:</Text> {spirit.speed}
              </Col>
              <Col span={8}>
                <Text strong>攻击:</Text> {spirit.attack}
              </Col>
              <Col span={8}>
                <Text strong>防御:</Text> {spirit.defend}
              </Col>
              <Col span={8}>
                <Text strong>特攻:</Text> {spirit.sAttack}
              </Col>
              <Col span={8}>
                <Text strong>特防:</Text> {spirit.sDefend}
              </Col>
            </Row>
          </div>
        </div>
      );
    }
  };

  /**
   * @description 视图切换器组件
   * 允许用户在星灵视图和套装视图之间切换
   */
  const viewSwitcher = (
    <div style={{ marginBottom: 24, display: 'flex', gap: 16 }}>
      <Tag.CheckableTag
        checked={viewMode === 'spirits'}
        onChange={() => setViewMode('spirits')}
        style={{ padding: '8px 16px', borderRadius: 20, fontSize: '16px' }}
      >
        {t('view_spirits')}
      </Tag.CheckableTag>
      <Tag.CheckableTag
        checked={viewMode === 'suits'}
        onChange={() => setViewMode('suits')}
        style={{ padding: '8px 16px', borderRadius: 20, fontSize: '16px' }}
      >
        {t('view_suits')}
      </Tag.CheckableTag>
    </div>
  );

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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '32px',
          }}
        >
          {t('page_title_spirits')}
        </Title>
        <Paragraph style={{ fontSize: '16px', color: 'var(--text-secondary-dark)', marginTop: 8 }}>
          {t('page_subtitle_spirits')}
        </Paragraph>
      </motion.div>
      {viewMode === 'spirits' ? (
        <DataView<AstralSpirit>
          queryKey={['astral-spirits']}
          dataUrl="astral-spirits"
          onCardClick={handleCardClick}
          renderCard={(spirit, index) => (
            <ItemCard
              item={spirit}
              index={index}
              imageUrl={getAstralSpiritImageUrl(spirit.id)}
              icon={<Zap size={48} color="white" />}
            />
          )}
          renderDetailDialog={renderDetailDialog}
          getSearchableFields={(item) => [item.name]}
          getQuality={(item) => item.quality}
          noLayout
          loadingText={t('loading_spirits')}
          errorText={t('load_failed')}
          paginationTotalText={(start, end, total) => t('pagination_total', { start, end, total })}
          noResultsText={t('empty_description_spirits')}
          noDataText={t('empty_button_spirits')}
          searchPlaceholder={t('search_placeholder')}
          filterOptions={[
            { value: 'all', label: t('filter_all') },
            { value: 'super', label: t('filter_super') },
            { value: 'normal', label: t('filter_normal') },
          ]}
          resetText={t('reset')}
          showingText={(filteredCount, totalCount) => (
            <Trans
              i18nKey="showing_items"
              ns="astralSpirit"
              values={{
                filteredCount,
                totalCount,
                unit: t('unit_text_spirit'),
              }}
              components={{ 1: <span style={{ fontWeight: 600 }} /> }}
            />
          )}
        >
          {viewSwitcher}
        </DataView>
      ) : (
        <DataView<AstralSpiritSuit>
          queryKey={['astral-spirit-suits']}
          dataUrl="astral-spirit-suits"
          onCardClick={handleCardClick}
          renderCard={(suit, index) => (
            <ItemCard
              item={suit}
              index={index}
              imageUrl={getAstralSpiritSuitImageUrl(suit.id)}
              icon={<Crown size={48} color="white" />}
              imageStyle={{ height: '150px', maxHeight: '150px' }}
            />
          )}
          renderDetailDialog={renderDetailDialog}
          getSearchableFields={(item) => [item.name]}
          noLayout
          loadingText={t('loading_suits')}
          errorText={t('load_failed')}
          paginationTotalText={(start, end, total) => t('pagination_total', { start, end, total })}
          noResultsText={t('empty_description_suits')}
          noDataText={t('empty_button_suits')}
          resetText={t('reset')}
          searchPlaceholder={t('search_placeholder')}
          showingText={(filteredCount, totalCount) => (
            <Trans
              i18nKey="showing_items"
              ns="astralSpirit"
              values={{
                filteredCount,
                totalCount,
                unit: t('unit_text_suit'),
              }}
              components={{ 1: <span style={{ fontWeight: 600 }} /> }}
            />
          )}
        >
          {viewSwitcher}
        </DataView>
      )}
    </Layout>
  );
};

export default AstralSpiritPage;
