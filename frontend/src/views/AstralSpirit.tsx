import { Tag, Typography } from 'antd';
import { Crown, Zap } from 'lucide-react';
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import DataView from '../components/DataView';
import ItemCard from '../components/ItemCard';
import Layout from '../components/Layout';
import type { AstralSpirit, AstralSpiritSuit } from '../types/astralSpirit';

const { Text } = Typography;

const AstralSpiritPage: React.FC = () => {
  const { t } = useTranslation('astralSpirit');
  const [viewMode, setViewMode] = useState<'spirits' | 'suits'>('spirits');

  const viewSwitcher = (
    <div style={{ marginBottom: 24, display: 'flex', gap: 16 }}>
      <Tag.CheckableTag
        checked={viewMode === 'spirits'}
        onChange={() => setViewMode('spirits')}
        style={{ padding: '8px 16px', borderRadius: 20, fontSize: '16px' }}
      >
        {t('view_spirits')}
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
      {viewMode === 'spirits' ? (
        <DataView<AstralSpirit>
          pageTitle={t('page_title_spirits')}
          pageSubtitle={t('page_subtitle_spirits')}
          queryKey={['astral-spirits']}
          dataUrl="astral-spirits"
          renderCard={(spirit, index) => (
            <ItemCard item={spirit} index={index} icon={<Zap size={48} color="white" />} />
          )}
          getSearchableFields={(item) => [item.name]}
          getQuality={(item) => item.quality}
          titleGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          noLayout
          loadingText={t('loading_spirits')}
          errorText={t('load_failed')}
          paginationTotalText={(start, end, total) => t('pagination_total', { start, end, total })}
          noResultsText={t('empty_description_spirits')}
          noDataText={t('empty_button_spirits')}
          filterOptions={[
            { value: 'all', label: t('filter_all') },
            { value: 'super', label: t('filter_super') },
            { value: 'normal', label: t('filter_normal') },
          ]}
          resetText={t('reset')}
          showingText={(filteredCount, totalCount) => (
            <Trans
              i18nKey="showing_items"
              ns="astralSpirit"
              values={{
                filteredCount,
                totalCount,
                unit: t('unit_text_spirit'),
              }}
              components={{ 1: <span style={{ fontWeight: 600 }} /> }}
            />
          )}
        >
          {viewSwitcher}
        </DataView>
      ) : (
        <DataView<AstralSpiritSuit>
          pageTitle={t('page_title_suits')}
          pageSubtitle={t('page_subtitle_suits')}
          queryKey={['astral-spirit-suits']}
          dataUrl="astral-spirit-suits"
          renderCard={(suit, index) => (
            <ItemCard item={suit} index={index} icon={<Crown size={48} color="white" />}>
              <Text style={{ fontSize: '12px' }}>
                {t('includes_spirits', { count: suit.astralSpiritIdList.length })}
              </Text>
            </ItemCard>
          )}
          getSearchableFields={(item) => [item.name]}
          titleGradient="linear-gradient(135deg, #f7971e 0%, #ffd200 100%)"
          noLayout
          loadingText={t('loading_suits')}
          errorText={t('load_failed')}
          paginationTotalText={(start, end, total) => t('pagination_total', { start, end, total })}
          noResultsText={t('empty_description_suits')}
          noDataText={t('empty_button_suits')}
          resetText={t('reset')}
          showingText={(filteredCount, totalCount) => (
            <Trans
              i18nKey="showing_items"
              ns="astralSpirit"
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

export default AstralSpiritPage;
