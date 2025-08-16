import { Divider, Spin, Typography } from 'antd';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import DataView from '../components/DataView';
import ItemCard from '../components/ItemCard';
import Layout from '../components/Layout';
import type { HKData } from '../types/hk';
import { fetchDataItem } from '../utils/api';
import { getHKImageUrl } from '../utils/image-helper';

const { Title, Paragraph, Text } = Typography;

const HKPage = () => {
  const { t } = useTranslation('hk');
  const [detail, setDetail] = useState<HKData | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const handleCardClick = async (hk: HKData) => {
    setLoadingDetail(true);
    try {
      const data = await fetchDataItem<HKData>('hkdata', hk.id.toString());
      setDetail(data);
    } catch (error) {
      console.error('Failed to fetch hk detail', error);
    } finally {
      setLoadingDetail(false);
    }
  };

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
            background: 'linear-gradient(135deg, #f5222d 0%, #ff7875 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '32px',
          }}
        >
          {t('page_title_hks')}
        </Title>
        <Paragraph style={{ fontSize: '16px', color: 'var(--text-secondary-dark)', marginTop: 8 }}>
          {t('page_subtitle_hks')}
        </Paragraph>
      </motion.div>
      <DataView<HKData>
        queryKey={['hk-data-view']}
        dataUrl="hkdata"
        onCardClick={handleCardClick}
        renderCard={(hk, index) => (
          <ItemCard
            item={hk}
            index={index}
            imageUrl={getHKImageUrl(hk.id)}
            icon={<Heart size={48} color="white" />}
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
                src={getHKImageUrl(detail.id)}
                alt={detail.name}
                style={{ width: 200, height: 200, objectFit: 'contain', borderRadius: 8 }}
              />
              <div style={{ flex: 1 }}>
                <Paragraph>
                  <Text strong>词条: </Text>
                  {detail.wordBar}
                </Paragraph>
                <Divider />
                <Paragraph>
                  <Text strong>产出类型: </Text>
                  {detail.produceType}
                </Paragraph>
              </div>
            </div>
          ) : null
        }
        getSearchableFields={(hk) => [hk.name, hk.id.toString(), hk.wordBar]}
        getQuality={(hk) => hk.color}
        noLayout
        loadingText={t('loading_data')}
        errorText={t('load_failed')}
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
            ns="hk"
            values={{
              filteredCount,
              totalCount,
              unit: t('unit_text_hk'),
            }}
            components={{ 1: <span style={{ fontWeight: 600 }} /> }}
          />
        )}
      />
    </Layout>
  );
};

export default HKPage;
