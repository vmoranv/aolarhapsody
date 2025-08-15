import { Divider, Tag, theme, Tooltip, Typography } from 'antd';
import { motion } from 'framer-motion';
import { Crown, Scroll } from 'lucide-react';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import DataView from '../components/DataView';
import ItemCard from '../components/ItemCard';
import Layout from '../components/Layout';
import { useStatusColor } from '../theme/colors';
import type { Inscription, InscriptionSuit } from '../types/inscription';
import { getInscriptionImageUrl } from '../utils/image-helper';

const { Title, Paragraph, Text } = Typography;

const InscriptionPage = () => {
  const { t } = useTranslation('inscription');
  const { token } = theme.useToken();
  const suitColor = useStatusColor('warning');
  const [viewMode, setViewMode] = useState<'inscriptions' | 'suits'>('inscriptions');

  const filterOptions = [
    { value: 'all', label: t('filter_all') },
    { value: 'super', label: t('filter_super') },
    { value: 'normal', label: t('filter_normal') },
  ];

  const viewSwitcher = (
    <div style={{ marginBottom: 24, display: 'flex', gap: 16 }}>
      <Tag.CheckableTag
        checked={viewMode === 'inscriptions'}
        onChange={() => setViewMode('inscriptions')}
        style={{ padding: '8px 16px', borderRadius: 20, fontSize: '16px' }}
      >
        {t('view_inscriptions')}
      </Tag.CheckableTag>
      <Tag.CheckableTag
        checked={viewMode === 'suits'}
        onChange={() => setViewMode('suits')}
        style={{ padding: '8px 16px', borderRadius: 20, fontSize: '16px' }}
      >
        {t('view_suits')}
      </Tag.CheckableTag>
    </div>
  );

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
            background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '32px',
          }}
        >
          {viewMode === 'inscriptions' ? t('page_title_inscriptions') : t('page_title_suits')}
        </Title>
        <Paragraph style={{ fontSize: '16px', color: 'var(--text-secondary-dark)', marginTop: 8 }}>
          {viewMode === 'inscriptions' ? t('page_subtitle_inscriptions') : t('page_subtitle_suits')}
        </Paragraph>
      </motion.div>
      {viewMode === 'inscriptions' ? (
        <DataView<Inscription>
          queryKey={['inscriptions-view']}
          dataUrl="inscriptions"
          renderCard={(inscription, index) => (
            <ItemCard
              item={inscription}
              index={index}
              imageUrl={getInscriptionImageUrl(inscription.id)}
              icon={<Scroll size={48} color="white" />}
            />
          )}
          getSearchableFields={(inscription) => [
            inscription.name,
            inscription.id.toString(),
            inscription.desc,
          ]}
          getQuality={(inscription) => inscription.level}
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
              ns="inscription"
              values={{
                filteredCount,
                totalCount,
                unit: t('unit_text_inscription'),
              }}
              components={{ 1: <span style={{ fontWeight: 600 }} /> }}
            />
          )}
        >
          {viewSwitcher}
        </DataView>
      ) : (
        <DataView<InscriptionSuit>
          queryKey={['inscription-suits-view']}
          dataUrl="inscriptionsuits"
          renderCard={(suit, index) => (
            <ItemCard
              item={{ ...suit, quality: 5 }}
              index={index}
              icon={<Crown size={48} color="white" />}
            >
              <div style={{ textAlign: 'left', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 12 }}>
                  <Tag color={suitColor} style={{ borderRadius: 12 }}>
                    {t('suit_type')}: {suit.name}
                  </Tag>
                </div>
                <Divider style={{ margin: '8px 0' }} />
                <div>
                  <Text style={{ fontSize: '12px', fontWeight: 'bold', color: token.colorText }}>
                    {t('includes_inscriptions', { count: suit.inscriptionIdList.length })}
                  </Text>
                  <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {suit.inscriptionIdList.map((id) => (
                      <Tag key={id} style={{ margin: 0, fontSize: '12px' }}>
                        {id}
                      </Tag>
                    ))}
                  </div>
                </div>
                {suit.dec && (
                  <>
                    <Divider style={{ margin: '8px 0' }} />
                    <Tooltip title={suit.dec}>
                      <Text
                        style={{
                          fontSize: '12px',
                          color: token.colorTextTertiary,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {suit.dec}
                      </Text>
                    </Tooltip>
                  </>
                )}
              </div>
            </ItemCard>
          )}
          getSearchableFields={(suit) => [suit.name, suit.id.toString()]}
          noLayout
          loadingText={t('loading_data')}
          errorText={t('load_failed')}
          paginationTotalText={(start, end, total) =>
            t('pagination_total', { rangeStart: start, rangeEnd: end, total })
          }
          noResultsText={t('no_results')}
          noDataText={t('no_data')}
          resetText={t('reset')}
          searchPlaceholder={t('search_placeholder')}
          showingText={(filteredCount, totalCount) => (
            <Trans
              i18nKey="showing_items"
              ns="inscription"
              values={{
                filteredCount,
                totalCount,
                unit: t('unit_text_suit'),
              }}
              components={{ 1: <span style={{ fontWeight: 600 }} /> }}
            />
          )}
        >
          {viewSwitcher}
        </DataView>
      )}
    </Layout>
  );
};

export default InscriptionPage;
