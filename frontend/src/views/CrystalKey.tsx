import { Key } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import DataView, { DataItem } from '../components/DataView';
import ItemCard from '../components/ItemCard';
import { getCrystalKeyImageUrl } from '../utils/image-helper';

/**
 * 晶钥数据类型定义
 */
interface CrystalKeyType extends DataItem {
  description: string; // 晶钥描述
}

/**
 * 晶钥系统页面组件
 */
const CrystalKey = () => {
  const { t } = useTranslation('crystalKey');

  return (
    <DataView<CrystalKeyType>
      pageTitle={t('title')}
      pageSubtitle={t('subtitle')}
      queryKey={['crystal-keys']}
      dataUrl="crystalkeys"
      renderCard={(key, index) => (
        <ItemCard
          item={key}
          index={index}
          imageUrl={getCrystalKeyImageUrl(key.id)}
          icon={<Key size={48} color="white" />}
        />
      )}
      getSearchableFields={(key) => [key.name, key.description]}
      titleGradient="linear-gradient(135deg, #722ed1 0%, #9254de 100%)"
      loadingText={t('loading_data')}
      errorText={t('load_failed')}
      paginationTotalText={(start, end, total) =>
        t('pagination_total', { rangeStart: start, rangeEnd: end, total })
      }
      noResultsText={t('no_results')}
      noDataText={t('no_data')}
      resetText={t('reset')}
      showingText={(filteredCount, totalCount) => (
        <Trans
          i18nKey="showing_items"
          ns="crystalKey"
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

export default CrystalKey;
