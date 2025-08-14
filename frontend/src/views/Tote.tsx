import { Package } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import DataView from '../components/DataView';
import ItemCard from '../components/ItemCard';
import { Tote } from '../types/tote';

const TotePage = () => {
  const { t } = useTranslation('tote');

  const filterOptions = [
    { value: 'all', label: t('filter_all') },
    { value: 'super', label: t('filter_super') },
    { value: 'normal', label: t('filter_normal') },
  ];

  return (
    <DataView<Tote>
      pageTitle={t('page_title')}
      pageSubtitle={t('page_subtitle')}
      queryKey={['totes']}
      dataUrl="totes/data"
      renderCard={(tote, index) => (
        <ItemCard item={tote} index={index} icon={<Package size={48} color="white" />} />
      )}
      getSearchableFields={(tote) => [tote.name, tote.desc || '', tote.category || '']}
      getQuality={(tote) => tote.quality}
      titleGradient="linear-gradient(135deg, #eb2f96 0%, #f759ab 100%)"
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
  );
};

export default TotePage;
