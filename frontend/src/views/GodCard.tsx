import { useQuery } from '@tanstack/react-query';
import { Typography } from 'antd';
import { motion } from 'framer-motion';
import { Sword } from 'lucide-react';
import { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import DataView from '../components/DataView';
import ItemCard from '../components/ItemCard';
import Layout from '../components/Layout';
import type { GodCard } from '../types/godcard';
import { fetchData } from '../utils/api';
import { getGodCardImageUrl } from '../utils/image-helper';

const { Title, Paragraph } = Typography;

const GodCardPage = () => {
  const { t } = useTranslation('godCard');

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
        renderCard={(godCard, index) => (
          <ItemCard
            item={godCard}
            index={index}
            imageUrl={getGodCardImageUrl(godCard, allCards)}
            icon={<Sword size={48} color="white" />}
          />
        )}
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
