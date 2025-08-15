import { Typography } from 'antd';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import DataView from '../components/DataView';
import ItemCard from '../components/ItemCard';
import Layout from '../components/Layout';
import { Tote } from '../types/tote';
import { getToteImageUrl } from '../utils/image-helper';

const { Title, Paragraph } = Typography;

const TotePage = () => {
  const { t } = useTranslation('tote');

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
