import { Col, Divider, Row, Spin, Tag, Typography } from 'antd';
import { motion } from 'framer-motion';
import { Crown, Zap } from 'lucide-react';
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import DataView from '../components/DataView';
import ItemCard from '../components/ItemCard';
import Layout from '../components/Layout';
import type { AstralSpirit, AstralSpiritSuit } from '../types/astralSpirit';
import { fetchDataItem } from '../utils/api';
import { getAstralSpiritImageUrl, getAstralSpiritSuitImageUrl } from '../utils/image-helper';

const { Title, Paragraph, Text } = Typography;

const AstralSpiritPage: React.FC = () => {
  const { t } = useTranslation('astralSpirit');
  const [viewMode, setViewMode] = useState<'spirits' | 'suits'>('spirits');
  const [detail, setDetail] = useState<AstralSpirit | AstralSpiritSuit | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const handleCardClick = async (item: AstralSpirit | AstralSpiritSuit) => {
    setLoadingDetail(true);
    try {
      const endpoint = 'astralSpiritIdList' in item ? 'astral-spirit-suit' : 'astral-spirit';
      const data = await fetchDataItem<AstralSpirit | AstralSpiritSuit>(endpoint, String(item.id));
      setDetail(data);
    } catch (error) {
      console.error('Failed to fetch astral spirit detail', error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const renderDetailDialog = (item: AstralSpirit | AstralSpiritSuit) => {
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

    if (!detail) {
      return null;
    }

    if ('astralSpiritIdList' in item) {
      // Render AstralSpiritSuit detail
      const suit = detail as AstralSpiritSuit;
      return (
        <div>
          <Title level={4}>{suit.name}</Title>
          <Paragraph>{suit.dec}</Paragraph>
          <Divider />
          <Paragraph>
            <Text strong>{t('suit_effect')}:</Text> {suit.suitEffectDes}
          </Paragraph>
          <Paragraph>
            <Text strong>{t('one_shenhua_effect')}:</Text> {suit.oneShenhuaSuitEffectDes}
          </Paragraph>
          <Paragraph>
            <Text strong>{t('three_shenhua_effect')}:</Text> {suit.threeShenHuaSuitEffectDes}
          </Paragraph>
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
            >
              <Text style={{ fontSize: '12px' }}>
                {t('includes_spirits', {
                  count: Array.isArray(suit.astralSpiritIdList)
                    ? suit.astralSpiritIdList.length
                    : 0,
                })}
              </Text>
            </ItemCard>
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
