import { Typography } from 'antd';
import { motion } from 'framer-motion';
import { Trans, useTranslation } from 'react-i18next';
import DataView from '../components/DataView';
import ItemCard from '../components/ItemCard';
import Layout from '../components/Layout';
import type { PetCard2 } from '../types/petCard2';
import { getPetCard2ImageUrl } from '../utils/image-helper';

const { Title, Paragraph } = Typography;

const PetCard2Page = () => {
  const { t } = useTranslation('petCard2');

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
      <DataView<PetCard2>
        queryKey={['pet-card2s-view']}
        dataUrl="petcard2s"
        renderCard={(petCard2, index) => (
          <ItemCard
            item={petCard2}
            index={index}
            imageUrl={getPetCard2ImageUrl(petCard2.id)}
            icon={<div />}
          />
        )}
        getSearchableFields={(card) => [
          card.name,
          card.id.toString(),
          ...card.raceList.map((r) => r.toString()),
        ]}
        getQuality={(card) => card.vip}
        noLayout
        loadingText={t('loading_data')}
        errorText={t('load_error')}
        paginationTotalText={(start, end, total) =>
          t('pagination_total', { rangeStart: start, rangeEnd: end, total })
        }
        noResultsText={t('no_results')}
        noDataText={t('no_data')}
        filterOptions={[
          { value: 'all', label: t('filter_all') },
          { value: 'super', label: t('filter_super') },
          { value: 'normal', label: t('filter_normal') },
        ]}
        resetText={t('reset')}
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
