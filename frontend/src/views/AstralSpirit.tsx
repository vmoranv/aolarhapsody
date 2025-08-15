import { Tag, Typography } from 'antd';
import { motion } from 'framer-motion';
import { Crown, Zap } from 'lucide-react';
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import DataView from '../components/DataView';
import ItemCard from '../components/ItemCard';
import Layout from '../components/Layout';
import type { AstralSpirit, AstralSpiritSuit } from '../types/astralSpirit';
import { getAstralSpiritImageUrl, getAstralSpiritSuitImageUrl } from '../utils/image-helper';

const { Title, Paragraph, Text } = Typography;

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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title
          level={1}
          style={{
            margin: 0,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '32px',
          }}
        >
          {t('page_title_spirits')}
        </Title>
        <Paragraph style={{ fontSize: '16px', color: 'var(--text-secondary-dark)', marginTop: 8 }}>
          {t('page_subtitle_spirits')}
        </Paragraph>
      </motion.div>
      {viewMode === 'spirits' ? (
        <DataView<AstralSpirit>
          queryKey={['astral-spirits']}
          dataUrl="astral-spirits"
          renderCard={(spirit, index) => (
            <ItemCard
              item={spirit}
              index={index}
              imageUrl={getAstralSpiritImageUrl(spirit.id)}
              icon={<Zap size={48} color="white" />}
            />
          )}
          getSearchableFields={(item) => [item.name]}
          getQuality={(item) => item.quality}
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
          queryKey={['astral-spirit-suits']}
          dataUrl="astral-spirit-suits"
          renderCard={(suit, index) => (
            <ItemCard
              item={suit}
              index={index}
              imageUrl={getAstralSpiritSuitImageUrl(suit.id)}
              icon={<Crown size={48} color="white" />}
            >
              <Text style={{ fontSize: '12px' }}>
                {t('includes_spirits', {
                  count: Array.isArray(suit.astralSpiritIdList)
                    ? suit.astralSpiritIdList.length
                    : 0,
                })}
              </Text>
            </ItemCard>
          )}
          getSearchableFields={(item) => [item.name]}
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
