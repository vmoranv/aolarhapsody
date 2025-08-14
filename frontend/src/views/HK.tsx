import { Divider, Tag, theme, Typography } from 'antd';
import { Crown, Heart } from 'lucide-react';
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import DataView from '../components/DataView';
import ItemCard from '../components/ItemCard';
import Layout from '../components/Layout';
import { useStatusColor } from '../theme/colors';
import type { HKBuff, HKData } from '../types/hk';

const { Text } = Typography;

const HKPage = () => {
  const { t } = useTranslation('hk');
  const { token } = theme.useToken();
  const suitColor = useStatusColor('warning');
  const [viewMode, setViewMode] = useState<'hks' | 'buffs'>('hks');

  const filterOptions = [
    { value: 'all', label: t('filter_all') },
    { value: 'super', label: t('filter_super') },
    { value: 'normal', label: t('filter_normal') },
  ];

  const viewSwitcher = (
    <div style={{ marginBottom: 24, display: 'flex', gap: 16 }}>
      <Tag.CheckableTag
        checked={viewMode === 'hks'}
        onChange={() => setViewMode('hks')}
        style={{ padding: '8px 16px', borderRadius: 20, fontSize: '16px' }}
      >
        {t('view_hks')}
      </Tag.CheckableTag>
      <Tag.CheckableTag
        checked={viewMode === 'buffs'}
        onChange={() => setViewMode('buffs')}
        style={{ padding: '8px 16px', borderRadius: 20, fontSize: '16px' }}
      >
        {t('view_buffs')}
      </Tag.CheckableTag>
    </div>
  );

  return (
    <Layout>
      {viewMode === 'hks' ? (
        <DataView<HKData>
          pageTitle={t('page_title_hks')}
          pageSubtitle={t('page_subtitle_hks')}
          queryKey={['hk-data-view']}
          dataUrl="hkdata"
          renderCard={(hk, index) => (
            <ItemCard item={hk} index={index} icon={<Heart size={48} color="white" />} />
          )}
          getSearchableFields={(hk) => [hk.name, hk.id.toString(), hk.wordBar]}
          getQuality={(hk) => hk.color}
          titleGradient="linear-gradient(135deg, #f5222d 0%, #ff7875 100%)"
          noLayout
          loadingText={t('loading_data')}
          errorText={t('load_failed')}
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
              ns="hk"
              values={{
                filteredCount,
                totalCount,
                unit: t('unit_text_hk'),
              }}
              components={{ 1: <span style={{ fontWeight: 600 }} /> }}
            />
          )}
        >
          {viewSwitcher}
        </DataView>
      ) : (
        <DataView<HKBuff>
          pageTitle={t('page_title_buffs')}
          pageSubtitle={t('page_subtitle_buffs')}
          queryKey={['hk-buffs-view']}
          dataUrl="hkbuffs"
          renderCard={(buff, index) => (
            <ItemCard
              item={{ ...buff, quality: buff.color }}
              index={index}
              icon={<Crown size={48} color="white" />}
            >
              <div style={{ textAlign: 'left', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 12 }}>
                  <Tag color={suitColor} style={{ borderRadius: 12 }}>
                    {t('buff_name')}: {buff.name}
                  </Tag>
                </div>
                <Divider style={{ margin: '8px 0' }} />
                <div>
                  <Text style={{ fontSize: '12px', fontWeight: 'bold', color: token.colorText }}>
                    {t('effect_description')}:
                  </Text>
                  <div style={{ marginTop: 4 }}>
                    {buff.decs.map((desc, idx) => (
                      <div key={idx} style={{ marginBottom: 4 }}>
                        <Text style={{ fontSize: '11px', color: token.colorTextSecondary }}>
                          • {desc}
                        </Text>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ItemCard>
          )}
          getSearchableFields={(buff) => [buff.name, buff.id.toString(), ...buff.decs]}
          titleGradient="linear-gradient(135deg, #f5222d 0%, #ff7875 100%)"
          noLayout
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
              ns="hk"
              values={{
                filteredCount,
                totalCount,
                unit: t('unit_text_buff'),
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

export default HKPage;
