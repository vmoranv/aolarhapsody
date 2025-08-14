import { Divider, Tag, theme, Tooltip, Typography } from 'antd';
import { Crown, Sword } from 'lucide-react';
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import DataView from '../components/DataView';
import ItemCard from '../components/ItemCard';
import Layout from '../components/Layout';
import { useStatusColor } from '../theme/colors';
import type { GodCard, GodCardSuit } from '../types/godcard';

const { Text } = Typography;

const GodCardPage = () => {
  const { t } = useTranslation('godCard');
  const { token } = theme.useToken();
  const suitColor = useStatusColor('warning');
  const [viewMode, setViewMode] = useState<'cards' | 'suits'>('cards');

  const filterOptions = [
    { value: 'all', label: t('filter_all') },
    { value: 'super', label: t('filter_super') },
    { value: 'normal', label: t('filter_normal') },
  ];

  const viewSwitcher = (
    <div style={{ marginBottom: 24, display: 'flex', gap: 16 }}>
      <Tag.CheckableTag
        checked={viewMode === 'cards'}
        onChange={() => setViewMode('cards')}
        style={{ padding: '8px 16px', borderRadius: 20, fontSize: '16px' }}
      >
        {t('view_cards')}
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
      {viewMode === 'cards' ? (
        <DataView<GodCard>
          pageTitle={t('page_title_cards')}
          pageSubtitle={t('page_subtitle_cards')}
          queryKey={['god-cards-view']}
          dataUrl="godcards"
          renderCard={(godCard, index) => (
            <ItemCard item={godCard} index={index} icon={<Sword size={48} color="white" />} />
          )}
          getSearchableFields={(card) => [card.name, card.id.toString()]}
          getQuality={(card) => card.quality}
          titleGradient="linear-gradient(135deg, #fa8c16 0%, #ff7875 100%)"
          noLayout
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
              ns="godCard"
              values={{
                filteredCount,
                totalCount,
                unit: t('unit_text_card'),
              }}
              components={{ 1: <span style={{ fontWeight: 600 }} /> }}
            />
          )}
        >
          {viewSwitcher}
        </DataView>
      ) : (
        <DataView<GodCardSuit>
          pageTitle={t('page_title_suits')}
          pageSubtitle={t('page_subtitle_suits')}
          queryKey={['god-card-suits-view']}
          dataUrl="godcardsuits"
          renderCard={(suit, index) => (
            <ItemCard
              item={{ ...suit, quality: 5 }}
              index={index}
              icon={<Crown size={48} color="white" />}
            >
              <div style={{ textAlign: 'left', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 12 }}>
                  <Tag color={suitColor} style={{ borderRadius: 12 }}>
                    {t('suit_type')}: {suit.suitType}
                  </Tag>
                </div>
                <Divider style={{ margin: '8px 0' }} />
                <div>
                  <Text style={{ fontSize: '12px', fontWeight: 'bold', color: token.colorText }}>
                    {t('includes_cards', { count: suit.godCardidList.length })}
                  </Text>
                  <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {suit.godCardidList.map((id) => (
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
          titleGradient="linear-gradient(135deg, #722ed1 0%, #9254de 100%)"
          noLayout
          loadingText={t('loading_data')}
          errorText={t('load_error')}
          paginationTotalText={(start, end, total) =>
            t('pagination_total', { rangeStart: start, rangeEnd: end, total })
          }
          noResultsText={t('no_results')}
          noDataText={t('no_data')}
          resetText={t('reset')}
          showingText={(filteredCount, totalCount) => (
            <Trans
              i18nKey="showing_items"
              ns="godCard"
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

export default GodCardPage;
