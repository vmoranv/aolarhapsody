/**
 * @file 晶钥系统页面
 * @description 该页面用于展示游戏中的晶钥数据。
 * 它利用通用的 DataView 组件来处理数据的获取、分页、搜索和网格布局显示。
 * 用户可以点击单个晶钥卡片查看其详细描述。
 *
 * @module views/CrystalKey
 * @requires antd
 * @requires framer-motion
 * @requires lucide-react
 * @requires react
 * @requires react-i18next
 * @requires ../components/DataView
 * @requires ../components/ItemCard
 * @requires ../components/Layout
 * @requires ../utils/api
 * @requires ../utils/image-helper
 */
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Spin, Typography } from 'antd';
import { motion } from 'framer-motion';
import { Key } from 'lucide-react';
import DataView, { DataItem } from '../components/DataView';
import ItemCard from '../components/ItemCard';
import Layout from '../components/Layout';
import { fetchDataItem } from '../utils/api';
import { getCrystalKeyImageUrl } from '../utils/image-helper';

const { Title, Paragraph } = Typography;

/**
 * @interface CrystalKeyType
 * @description 扩展了通用的 DataItem 类型，增加了晶钥特有的 `description` 字段。
 * @extends DataItem
 * @property {string} description - 晶钥的详细描述文本。
 */
interface CrystalKeyType extends DataItem {
  description: string;
}

/**
 * 晶钥系统页面组件。
 *
 * 该组件负责渲染晶钥数据的展示界面。
 * - 使用 `useState` 来管理当前选中晶钥的详细信息和加载状态。
 * - 封装了 `handleCardClick` 方法，用于在用户点击卡片时异步获取并显示详细数据。
 * - 依赖 `DataView` 组件来处理大部分的通用数据展示逻辑，如数据获取、搜索、分页等。
 * - 自定义了卡片和详情弹窗的渲染逻辑。
 *
 * @component
 * @returns {React.ReactElement} 渲染后的晶钥页面。
 */
const CrystalKey = () => {
  const { t } = useTranslation('crystalKey');
  const [detail, setDetail] = useState<CrystalKeyType | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  /**
   * 处理晶钥卡片点击事件。
   * 当用户点击一个晶钥卡片时，该函数会异步获取该晶钥的详细数据并更新状态。
   * @async
   * @param {CrystalKeyType} key - 被点击的晶钥对象。
   */
  const handleCardClick = async (key: CrystalKeyType) => {
    setLoadingDetail(true);
    try {
      const data = await fetchDataItem<CrystalKeyType>('crystalkeys', key.id.toString());
      setDetail(data);
    } catch (error) {
      console.error('Failed to fetch crystal key detail', error);
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
            background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '32px',
          }}
        >
          {t('title')}
        </Title>
        <Paragraph style={{ fontSize: '16px', color: 'var(--text-secondary-dark)', marginTop: 8 }}>
          {t('subtitle')}
        </Paragraph>
      </motion.div>
      <DataView<CrystalKeyType>
        queryKey={['crystalkeys']}
        dataUrl="crystalkeys"
        onCardClick={handleCardClick}
        renderCard={(key, index) => (
          <ItemCard
            item={key}
            index={index}
            imageUrl={getCrystalKeyImageUrl(key.id)}
            icon={<Key size={48} color="white" />}
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
                src={getCrystalKeyImageUrl(detail.id)}
                alt={detail.name}
                style={{ width: 200, height: 200, objectFit: 'contain', borderRadius: 8 }}
              />
              <div style={{ flex: 1 }}>
                <Paragraph>{detail.description}</Paragraph>
              </div>
            </div>
          ) : null
        }
        getSearchableFields={(key) => [key.name, key.description]}
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
    </Layout>
  );
};

export default CrystalKey;
