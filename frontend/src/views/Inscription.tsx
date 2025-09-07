import { Col, Divider, Row, Spin, Typography } from 'antd';
import { motion } from 'framer-motion';
import { Scroll } from 'lucide-react';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import DataView from '../components/DataView';
import ItemCard from '../components/ItemCard';
import Layout from '../components/Layout';
import type { Inscription } from '../types/inscription';
import { fetchDataItem } from '../utils/api';
import { getInscriptionImageUrl } from '../utils/image-helper';

const { Title, Paragraph, Text } = Typography;

const InscriptionPage = () => {
  const { t } = useTranslation('inscription');
  const [detail, setDetail] = useState<Inscription | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const handleCardClick = async (inscription: Inscription) => {
    setLoadingDetail(true);
    try {
      const data = await fetchDataItem<Inscription>('inscriptions', inscription.id.toString());
      setDetail(data);
    } catch (error) {
      console.error('Failed to fetch inscription detail', error);
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
            background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '32px',
          }}
        >
          {t('page_title_inscriptions')}
        </Title>
        <Paragraph style={{ fontSize: '16px', color: 'var(--text-secondary-dark)', marginTop: 8 }}>
          {t('page_subtitle_inscriptions')}
        </Paragraph>
      </motion.div>
      <DataView<Inscription>
        queryKey={['inscriptions-view']}
        dataUrl="inscriptions"
        onCardClick={handleCardClick}
        renderCard={(inscription, index) => (
          <ItemCard
            item={inscription}
            index={index}
            imageUrl={getInscriptionImageUrl(inscription.id)}
            icon={<Scroll size={48} color="white" />}
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
                src={getInscriptionImageUrl(detail.id)}
                alt={detail.name}
                style={{ width: 200, height: 200, objectFit: 'contain', borderRadius: 8 }}
              />
              <div style={{ flex: 1 }}>
                <Paragraph>{detail.desc}</Paragraph>
                <Divider />
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Text strong>ID: </Text>
                    {detail.id}
                  </Col>
                  <Col span={12}>
                    <Text strong>名称: </Text>
                    {detail.name}
                  </Col>
                  <Col span={12}>
                    <Text strong>价格: </Text>
                    {detail.price}
                  </Col>
                  <Col span={12}>
                    <Text strong>RMB: </Text>
                    {detail.rmb}
                  </Col>
                  <Col span={12}>
                    <Text strong>类型: </Text>
                    {detail.inscriptionType}
                  </Col>
                  <Col span={12}>
                    <Text strong>等级: </Text>
                    {detail.level}
                  </Col>
                  <Col span={12}>
                    <Text strong>前一级ID: </Text>
                    {detail.preLevelId}
                  </Col>
                  <Col span={12}>
                    <Text strong>下一级ID: </Text>
                    {detail.nextLevelId}
                  </Col>
                </Row>
              </div>
            </div>
          ) : null
        }
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
      />
    </Layout>
  );
};

export default InscriptionPage;
