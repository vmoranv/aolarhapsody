import { Spin, Typography } from 'antd';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import DataView from '../components/DataView';
import ItemCard from '../components/ItemCard';
import Layout from '../components/Layout';
import type { PetCard2, PetCard2DescriptionsResponse,PetCard2Detail } from '../types/petCard2';
import { fetchDataItem } from '../utils/api';
import { getPetCard2ImageUrl } from '../utils/image-helper';

const { Title, Paragraph, Text } = Typography;

const PetCard2Page = () => {
  const { t } = useTranslation('petCard2');
  const [detail, setDetail] = useState<PetCard2Detail | null>(null);
  const [descriptions, setDescriptions] = useState<PetCard2DescriptionsResponse | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const handleCardClick = async (petCard2: PetCard2) => {
    setLoadingDetail(true);
    try {
      const [detailData, descriptionsData] = await Promise.all([
        fetchDataItem<PetCard2Detail>('petcard2s', petCard2.id.toString()),
        fetchDataItem<PetCard2DescriptionsResponse>(
          'petcard2s/descriptions',
          petCard2.id.toString()
        ),
      ]);
      setDetail(detailData);
      setDescriptions(descriptionsData);
    } catch (error) {
      console.error('Failed to fetch petCard2 detail', error);
    } finally {
      setLoadingDetail(false);
    }
  };

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
        onCardClick={handleCardClick}
        renderDetailDialog={(petCard2) =>
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
                src={getPetCard2ImageUrl(petCard2.id)}
                alt={petCard2.name}
                style={{ width: 200, height: 200, objectFit: 'contain', borderRadius: 8 }}
              />
              <div style={{ flex: 1 }}>
                <Paragraph>
                  <Text strong>
                    {t('detail_apply_id_and_descriptions', { applyId: detail.applyId })}
                  </Text>
                </Paragraph>
                {descriptions &&
                  descriptions.descriptions.map((desc) => (
                    <Paragraph key={desc.level}>
                      <Text>
                        {t('level_description', {
                          level: desc.level,
                          description: desc.description,
                        })}
                      </Text>
                    </Paragraph>
                  ))}
              </div>
            </div>
          ) : null
        }
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
