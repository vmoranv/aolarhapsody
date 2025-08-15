import { Trans, useTranslation } from 'react-i18next';
import DataView from '../components/DataView';
import ItemCard from '../components/ItemCard';
import type { PetCard2 } from '../types/petCard2';
import { getPetCard2ImageUrl } from '../utils/image-helper';

const PetCard2Page = () => {
  const { t } = useTranslation('petCard2');

  return (
    <DataView<PetCard2>
      pageTitle={t('page_title')}
      pageSubtitle={t('page_subtitle')}
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
      titleGradient="linear-gradient(135deg, #13c2c2 0%, #36cfc9 100%)"
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
  );
};

export default PetCard2Page;
