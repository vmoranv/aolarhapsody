import { Divider, Spin, Typography } from 'antd';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import DataView from '../components/DataView';
import ItemCard from '../components/ItemCard';
import Layout from '../components/Layout';
import { Tote, ToteDetail, ToteEntry } from '../types/tote';
import { fetchDataItem } from '../utils/api';
import { getToteImageUrl } from '../utils/image-helper';

const { Title, Paragraph, Text } = Typography;

const TotePage = () => {
  const { t } = useTranslation('tote');
  const [detail, setDetail] = useState<ToteDetail | null>(null);
  const [specialEffectDescription, setSpecialEffectDescription] = useState<string>('');
  const [loadingDetail, setLoadingDetail] = useState(false);

  const handleCardClick = async (tote: Tote) => {
    setLoadingDetail(true);
    setSpecialEffectDescription('');
    setDetail(null);
    try {
      const data = await fetchDataItem<ToteDetail>('totes/data', tote.id.toString());
      setDetail(data);
      const { type, effectValue } = data;

      // type: 0 (技巧) -> 解析 effectValue
      if (type === 0) {
        const entryId = parseInt(effectValue, 10);
        if (!isNaN(entryId) && entryId.toString() === effectValue) {
          try {
            const entryData = await fetchDataItem<ToteEntry>('totes/entries', entryId.toString());
            setSpecialEffectDescription(entryData.des);
          } catch (entryError) {
            console.error(`Failed to fetch tote entry ${entryId}`, entryError);
            setSpecialEffectDescription(effectValue); // Fallback
          }
        } else {
          setSpecialEffectDescription(effectValue);
        }
      }
      // type: 1 (强力) -> 不需要额外操作，直接使用 baseValue 和 advantageValue
    } catch (error) {
      console.error('Failed to fetch tote detail', error);
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
        onCardClick={handleCardClick}
        renderDetailDialog={(tote) =>
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
                src={getToteImageUrl(tote.id, true)}
                alt={tote.name}
                style={{ width: 200, height: 200, objectFit: 'contain', borderRadius: 8 }}
              />
              <div style={{ flex: 1 }}>
                <Paragraph>{detail.tujianDes}</Paragraph>
                <Divider />
                <Paragraph>
                  <Text strong>{t('quality')}: </Text>
                  <Text>{detail.color === 0 ? t('quality_legendary') : t('quality_epic')}</Text>
                </Paragraph>
                {detail.type === 1 ? (
                  <>
                    <Paragraph>
                      <Text strong>{t('attribute_bonus')}: </Text>
                      <Text>{detail.baseValue}</Text>
                    </Paragraph>
                    <Paragraph>
                      <Text strong>{t('applicable_attribute')}: </Text>
                      <Text>{detail.advantageValue}</Text>
                    </Paragraph>
                  </>
                ) : (
                  <Paragraph>
                    <Text strong>{t('special_effect')}: </Text>
                    <Text>{specialEffectDescription}</Text>
                  </Paragraph>
                )}
              </div>
            </div>
          ) : null
        }
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
