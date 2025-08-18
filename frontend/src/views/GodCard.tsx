import { useQuery } from '@tanstack/react-query';
import { Col, Divider, Row, Spin, Typography } from 'antd';
import { motion } from 'framer-motion';
import { Sword } from 'lucide-react';
import { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import DataView from '../components/DataView';
import ItemCard from '../components/ItemCard';
import Layout from '../components/Layout';
import { useDialogStore } from '../store/dialog';
import type { GodCard } from '../types/godcard';
import { fetchData, fetchDataItem } from '../utils/api';
import { getGodCardImageUrl } from '../utils/image-helper';

const { Title, Paragraph, Text } = Typography;

const GodCardPage = () => {
  const { t } = useTranslation('godCard');
  const { showDetail, detailItem: detail, setIsLoading, isLoading } = useDialogStore();

  const handleCardClick = async (card: GodCard) => {
    setIsLoading(true);
    try {
      const data = await fetchDataItem<any>('godcards', card.id.toString());
      showDetail({ ...data, id: data.cardId });
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
        renderDetailDialog={() =>
          isLoading ? (
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
                src={detail ? getGodCardImageUrl(detail, allCards) : ''}
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
      />
    </Layout>
  );
};

export default GodCardPage;
