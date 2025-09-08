import { Divider, Spin, Typography } from 'antd';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import DataView from '../components/DataView';
import ItemCard from '../components/ItemCard';
import Layout from '../components/Layout';
import type { HKBuff, HKData } from '../types/hk';
import { fetchDataItem } from '../utils/api';
import { fetchHKBuffDetail, parseWordBar } from '../utils/hk-utils';
import { getHKImageUrl } from '../utils/image-helper';

const { Title, Paragraph, Text } = Typography;

const HKPage = () => {
  const { t } = useTranslation('hk');
  const [detail, setDetail] = useState<HKData | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [buffDetails, setBuffDetails] = useState<Record<number, HKBuff>>({});

  const handleCardClick = async (hk: HKData) => {
    setLoadingDetail(true);
    try {
      const data = await fetchDataItem<HKData>('hkdata', hk.id.toString());
      setDetail(data);

      // 解析wordBar并获取对应的Buff详情
      const buffItems = parseWordBar(data.wordBar);
      const buffDetailsMap: Record<number, HKBuff> = {};

      // 获取所有相关的buff详情
      await Promise.all(
        buffItems.map(async ({ buffId }) => {
          try {
            // 检查是否已经获取过这个buffId的信息，避免重复请求
            if (!buffDetailsMap[buffId]) {
              const buffDetail = await fetchHKBuffDetail(buffId);
              buffDetailsMap[buffId] = buffDetail;
            }
          } catch (error) {
            console.error(`Failed to fetch buff detail for ID ${buffId}`, error);
            // 即使某个buff获取失败，也不影响其他buff的显示
          }
        })
      );

      setBuffDetails(buffDetailsMap);
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

  // 解析HTML标签，特别是font标签
  const parseHtmlTags = (html: string): React.ReactElement => {
    // 简单的HTML解析器，处理font标签
    if (!html) return <>{html}</>;

    // 匹配font标签
    const fontTagRegex = /<font\s+color=['"]([^'"]*)['"]>([^<]*)<\/font>/i;
    const match = html.match(fontTagRegex);

    if (match) {
      const [, color, text] = match;
      return <span style={{ color: color }}>{text}</span>;
    }

    // 如果没有匹配到font标签，直接返回文本
    return <>{html}</>;
  };

  // 获取产出类型文本
  const getProduceTypeText = (produceType: number) => {
    switch (produceType) {
      case 0:
        return t('produce_type_common');
      case 1:
        return t('produce_type_rare');
      case 2:
        return t('produce_type_special');
      case 3:
        return t('produce_type_limited');
      default:
        return t('produce_type_unknown');
    }
  };

  // 渲染单个buff信息（简化版本）
  const renderBuffInfo = (buffId: number, level: number, index: number, isMainBuff: boolean) => {
    const buff = buffDetails[buffId];
    if (!buff) {
      // 显示基础信息，即使详细信息获取失败
      return (
        <div key={`${buffId}-${index}`} style={{ marginBottom: 8 }}>
          <Paragraph style={{ margin: 0 }}>
            <Text type="secondary">Buff {buffId}</Text>
            <Text type="secondary"> LV.{level}</Text>
          </Paragraph>
        </div>
      );
    }

    // 确保等级在有效范围内
    const validLevel = Math.max(1, Math.min(level, buff.decs.length));

    return (
      <div key={`${buffId}-${index}`} style={{ marginBottom: 8 }}>
        <Paragraph style={{ margin: 0 }}>
          {parseHtmlTags(buff.fontColor)} {/* 使用fontColor作为关键字显示 */}
          <Text> LV.{validLevel}</Text>
        </Paragraph>
        {isMainBuff && buff.decs && buff.decs.length > 0 && (
          <Paragraph style={{ margin: '4px 0 0 0' }}>
            <Text type="secondary">{buff.decs[0]}</Text>
          </Paragraph>
        )}
      </div>
    );
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
                <div style={{ maxWidth: 400 }}>
                  {/* 显示解析后的buff信息 */}
                  {parseWordBar(detail.wordBar).map(({ buffId, level }, index, array) =>
                    renderBuffInfo(buffId, level, index, index === array.length - 1)
                  )}
                  <Divider />
                  <Paragraph>
                    <Text strong>{t('color')}: </Text>
                    <Text>{detail.color}</Text>
                  </Paragraph>
                  <Paragraph>
                    <Text strong>{t('produce_type_common')}: </Text>
                    <Text>{getProduceTypeText(detail.produceType)}</Text>
                  </Paragraph>
                </div>
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
