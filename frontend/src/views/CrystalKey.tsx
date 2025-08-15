import { Typography } from 'antd';
import { motion } from 'framer-motion';
import { Key } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import DataView, { DataItem } from '../components/DataView';
import ItemCard from '../components/ItemCard';
import Layout from '../components/Layout';
import { getCrystalKeyImageUrl } from '../utils/image-helper';

const { Title, Paragraph } = Typography;

/**
 * 晶钥数据类型定义
 */
interface CrystalKeyType extends DataItem {
  description: string; // 晶钥描述
}

/**
 * 晶钥系统页面组件
 */
const CrystalKey = () => {
  const { t } = useTranslation('crystalKey');

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
        queryKey={['crystal-keys']}
        dataUrl="crystal-keys"
        renderCard={(key, index) => (
          <ItemCard
            item={key}
            index={index}
            imageUrl={getCrystalKeyImageUrl(key.id)}
            icon={<Key size={48} color="white" />}
          />
        )}
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
            i18nKey="showing_keys"
            count={filteredCount}
            total={totalCount}
            components={{
              icon: <Key size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />,
            }}
          />
        )}
      />
    </Layout>
  );
};

export default CrystalKey;
