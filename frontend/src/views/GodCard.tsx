import { useQuery } from '@tanstack/react-query';
import { Col, Divider, Row, Spin, Tag, Typography } from 'antd';
import { motion } from 'framer-motion';
import { Sword } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import DataView from '../components/DataView';
import ItemCard from '../components/ItemCard';
import Layout from '../components/Layout';
import type { GodCard, GodCardSuit } from '../types/godcard';
import { fetchData, fetchDataItem } from '../utils/api';
import { getGodCardImageUrl, getGodCardSuitImageUrl } from '../utils/image-helper';

const { Title, Paragraph, Text } = Typography;

const GodCardPage = () => {
  const { t } = useTranslation('godCard');
  const [viewMode, setViewMode] = useState<'cards' | 'suits'>('cards');
  const [detail, setDetail] = useState<GodCard | GodCardSuit | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCardClick = async (item: GodCard | GodCardSuit) => {
    setIsLoading(true);
    try {
      const endpoint = 'godCardidList' in item ? 'godcardsuits' : 'godcards';
      const data = await fetchDataItem<GodCard | GodCardSuit>(endpoint, String(item.id));
      // 确保正确设置detail状态，对于神兵卡牌需要包含cardId作为id
      setDetail('godCardidList' in data ? data : { ...data, id: data.cardId || data.id });
    } catch (error) {
      console.error('Failed to fetch god card detail', error);
    } finally {
      setIsLoading(false);
    }
  };

  const { data: allCards = [] } = useQuery<GodCard[]>({
    queryKey: ['god-cards-all'],
    queryFn: () => fetchData<GodCard>('godcards'),
  });

  const filteredCards = useMemo(
    () => allCards.filter((card) => !card.name.includes('LV')),
    [allCards]
  );

  const renderDetailDialog = (item: GodCard | GodCardSuit) => {
    if (isLoading) {
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

    if ('godCardidList' in item) {
      const suit = detail as GodCardSuit;
      return (
        <div>
          <Title level={4}>{suit.name}</Title>
          <Paragraph>{suit.dec}</Paragraph>
        </div>
      );
    } else {
      const card = detail as GodCard;
      const imageUrl = card && card.id ? getGodCardImageUrl(card, allCards) : '';

      return (
        <div style={{ display: 'flex', gap: '24px' }}>
          {imageUrl && (
            <img
              src={imageUrl}
              alt={card.name}
              style={{ width: 200, height: 200, objectFit: 'contain', borderRadius: 8 }}
            />
          )}
          <div style={{ flex: 1 }}>
            <Divider />
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Text strong>HP:</Text> {card.hp}
              </Col>
              <Col span={8}>
                <Text strong>速度:</Text> {card.speed}
              </Col>
              <Col span={8}>
                <Text strong>攻击:</Text> {card.attack}
              </Col>
              <Col span={8}>
                <Text strong>防御:</Text> {card.defend}
              </Col>
              <Col span={8}>
                <Text strong>特攻:</Text> {card.sAttack}
              </Col>
              <Col span={8}>
                <Text strong>特防:</Text> {card.sDefend}
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
        checked={viewMode === 'cards'}
        onChange={() => setViewMode('cards')}
        style={{ padding: '8px 16px', borderRadius: 20, fontSize: '16px' }}
      >
        {t('view_cards')}
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
            background: 'linear-gradient(135deg, #fa8c16 0%, #ff7875 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '32px',
          }}
        >
          {t('page_title_cards')}
        </Title>
        <Paragraph style={{ fontSize: '16px', color: 'var(--text-secondary-dark)', marginTop: 8 }}>
          {t('page_subtitle_cards')}
        </Paragraph>
      </motion.div>
      {viewMode === 'cards' ? (
        <DataView<GodCard>
          queryKey={['god-cards-view']}
          data={filteredCards}
          onCardClick={handleCardClick}
          renderCard={(godCard, index) => (
            <ItemCard
              item={godCard}
              index={index}
              imageUrl={getGodCardImageUrl(godCard, allCards)}
              icon={<Sword size={48} color="white" />}
            />
          )}
          renderDetailDialog={renderDetailDialog}
          getSearchableFields={(card) => [card.name, card.id.toString()]}
          getQuality={(card) => card.quality}
          noLayout
          loadingText={t('loading_data')}
          errorText={t('load_error')}
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
              ns="godCard"
              values={{
                filteredCount,
                totalCount,
                unit: t('unit_text_card'),
              }}
              components={{ 1: <span style={{ fontWeight: 600 }} /> }}
            />
          )}
        >
          {viewSwitcher}
        </DataView>
      ) : (
        <DataView<GodCardSuit>
          queryKey={['god-card-suits']}
          dataUrl="godcardsuits"
          onCardClick={handleCardClick}
          renderCard={(suit, index) => {
            const firstGodCardId = suit.godCardidList?.[0];
            const imageUrl = getGodCardSuitImageUrl(suit.id, firstGodCardId);

            return <ItemCard item={suit} index={index} imageUrl={imageUrl} />;
          }}
          renderDetailDialog={renderDetailDialog}
          getSearchableFields={(item) => [item.name]}
          noLayout
          loadingText={t('loading_suits')}
          errorText={t('load_failed')}
          paginationTotalText={(start, end, total) =>
            t('pagination_total', { rangeStart: start, rangeEnd: end, total })
          }
          noResultsText={t('empty_description_suits')}
          noDataText={t('empty_button_suits')}
          resetText={t('reset')}
          searchPlaceholder={t('search_placeholder')}
          showingText={(filteredCount, totalCount) => (
            <Trans
              i18nKey="showing_items"
              ns="godCard"
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

export default GodCardPage;
