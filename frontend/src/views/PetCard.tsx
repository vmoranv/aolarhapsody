import { useQuery } from '@tanstack/react-query';
import { Col, Divider, Row, Spin, Tag, theme, Tooltip, Typography } from 'antd';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import DataView from '../components/DataView';
import ItemCard from '../components/ItemCard';
import Layout from '../components/Layout';
import { useStatusColor } from '../theme/colors';
import type { PetCard, PetCardSuit } from '../types/petCard';
import { fetchData, fetchDataItem } from '../utils/api';
import { getPetCardImageUrl } from '../utils/image-helper';

const { Title, Paragraph, Text } = Typography;

const PetCardPage = () => {
  const { t } = useTranslation('petCard');
  const { token } = theme.useToken();
  const suitColor = useStatusColor('warning');
  const [viewMode, setViewMode] = useState<'cards' | 'suits'>('cards');
  const [detail, setDetail] = useState<PetCard | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const handleCardClick = async (card: PetCard) => {
    setLoadingDetail(true);
    try {
      const data = await fetchDataItem<any>('petcards', card.id.toString());
      setDetail({ ...data, id: data.cardId });
    } catch (error) {
      console.error('Failed to fetch pet card detail', error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const { data: allCards = [] } = useQuery<PetCard[]>({
    queryKey: ['pet-cards-all'],
    queryFn: () => fetchData<PetCard>('petcards'),
  });

  const filteredCards = useMemo(
    () => allCards.filter((card) => !card.name.includes('LV') && card.id <= 100000),
    [allCards]
  );

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
            background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '32px',
          }}
        >
          {viewMode === 'cards' ? t('page_title_cards') : t('page_title_suits')}
        </Title>
        <Paragraph style={{ fontSize: '16px', color: 'var(--text-secondary-dark)', marginTop: 8 }}>
          {viewMode === 'cards' ? t('page_subtitle_cards') : t('page_subtitle_suits')}
        </Paragraph>
      </motion.div>
      {viewMode === 'cards' ? (
        <DataView<PetCard>
          queryKey={['pet-cards-view']}
          data={filteredCards}
          onCardClick={handleCardClick}
          renderCard={(petCard, index) => (
            <ItemCard
              item={petCard}
              index={index}
              imageUrl={getPetCardImageUrl(petCard, allCards)}
              icon={<Crown size={48} color="white" />}
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
                  src={getPetCardImageUrl(detail, allCards)}
                  alt={detail.name}
                  style={{ width: 200, height: 200, objectFit: 'contain', borderRadius: 8 }}
                />
                <div style={{ flex: 1 }}>
                  <Paragraph>{detail.desc}</Paragraph>
                  <Divider />
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <Text strong>HP:</Text> {detail.hp}
                    </Col>
                    <Col span={8}>
                      <Text strong>速度:</Text> {detail.speed}
                    </Col>
                    <Col span={8}>
                      <Text strong>攻击:</Text> {detail.attack}
                    </Col>
                    <Col span={8}>
                      <Text strong>防御:</Text> {detail.defend}
                    </Col>
                    <Col span={8}>
                      <Text strong>特攻:</Text> {detail.sAttack}
                    </Col>
                    <Col span={8}>
                      <Text strong>特防:</Text> {detail.sDefend}
                    </Col>
                  </Row>
                </div>
              </div>
            ) : null
          }
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
          filterOptions={[
            { value: 'all', label: t('filter_all') },
            { value: 'super', label: t('filter_super') },
            { value: 'normal', label: t('filter_normal') },
          ]}
          resetText={t('reset')}
          showingText={(filteredCount, totalCount) => (
            <Trans
              i18nKey="showing_items"
              ns="petCard"
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
        <DataView<PetCardSuit>
          queryKey={['pet-card-suits-view']}
          dataUrl="petcardsuits"
          renderCard={(suit, index) => (
            <ItemCard
              item={{ ...suit, quality: 5, id: `${suit.id}-${index}` }}
              index={index}
              icon={<Crown size={48} color="white" />}
            >
              <div style={{ textAlign: 'left', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 12 }}>
                  <Tag color={suitColor} style={{ borderRadius: 12 }}>
                    {t('type')}: {suit.suitType}
                  </Tag>
                </div>
                <Divider style={{ margin: '8px 0' }} />
                <div>
                  <Text style={{ fontSize: '12px', fontWeight: 'bold', color: token.colorText }}>
                    {t('cards_included')}:{' '}
                    {Array.isArray(suit.petCardIdList) ? suit.petCardIdList.length : 0}{' '}
                    {t('cards_unit')}
                  </Text>
                  <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {Array.isArray(suit.petCardIdList) &&
                      suit.petCardIdList.map((id) => (
                        <Tag key={id} style={{ margin: 0, fontSize: '12px' }}>
                          {id}
                        </Tag>
                      ))}
                  </div>
                </div>
                {suit.dec && (
                  <>
                    <Divider style={{ margin: '8px 0' }} />
                    <Tooltip title={suit.dec}>
                      <Text
                        style={{
                          fontSize: '12px',
                          color: token.colorTextTertiary,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {suit.dec}
                      </Text>
                    </Tooltip>
                  </>
                )}
              </div>
            </ItemCard>
          )}
          getSearchableFields={(suit) => [suit.name, suit.id.toString()]}
          noLayout
          loadingText={t('loading_data')}
          errorText={t('load_error')}
          paginationTotalText={(start, end, total) =>
            t('pagination_total', { rangeStart: start, rangeEnd: end, total })
          }
          noResultsText={t('no_results')}
          noDataText={t('no_data')}
          resetText={t('reset')}
          searchPlaceholder={t('search_placeholder')}
          showingText={(filteredCount, totalCount) => (
            <Trans
              i18nKey="showing_items"
              ns="petCard"
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

export default PetCardPage;
