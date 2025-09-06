import { useQuery } from '@tanstack/react-query';
import { Col, Divider, Row, Spin, Tag, Typography } from 'antd';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import DataView from '../components/DataView';
import ItemCard from '../components/ItemCard';
import Layout from '../components/Layout';
import type { PetCard, PetCardSuit } from '../types/petCard';
import { fetchData, fetchDataItem } from '../utils/api';
import { getPetCardImageUrl } from '../utils/image-helper';

const { Title, Paragraph, Text } = Typography;

const PetCardPage = () => {
  const { t } = useTranslation('petCard');
  const [viewMode, setViewMode] = useState<'cards' | 'suits'>('cards');
  const [detail, setDetail] = useState<PetCard | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [suitDetail, setSuitDetail] = useState<PetCardSuit | null>(null);
  const [loadingSuitDetail, setLoadingSuitDetail] = useState(false);

  const handleCardClick = async (card: PetCard) => {
    setLoadingDetail(true);
    try {
      const data = await fetchDataItem<any>('petcards', card.id.toString());
      setDetail({ ...data, id: data.cardId });
    } catch (error) {
      console.error('Failed to fetch pet card detail', error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSuitClick = async (suit: PetCardSuit) => {
    setLoadingSuitDetail(true);
    try {
      const data = await fetchDataItem<any>('petcardsuits', suit.id.toString());
      setSuitDetail(data);
    } catch (error) {
      console.error('Failed to fetch pet card suit detail', error);
    } finally {
      setLoadingSuitDetail(false);
    }
  };

  const { data: allCards = [] } = useQuery<PetCard[]>({
    queryKey: ['pet-cards-all'],
    queryFn: () => fetchData<PetCard>('petcards'),
  });

  const filteredCards = useMemo(
    () => allCards.filter((card) => !card.name.includes('LV') && card.id <= 100000),
    [allCards]
  );

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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title
          level={1}
          style={{
            margin: 0,
            background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '32px',
          }}
        >
          {viewMode === 'cards' ? t('page_title_cards') : t('page_title_suits')}
        </Title>
        <Paragraph style={{ fontSize: '16px', color: 'var(--text-secondary-dark)', marginTop: 8 }}>
          {viewMode === 'cards' ? t('page_subtitle_cards') : t('page_subtitle_suits')}
        </Paragraph>
      </motion.div>
      {viewMode === 'cards' ? (
        <DataView<PetCard>
          queryKey={['pet-cards-view']}
          data={filteredCards}
          onCardClick={handleCardClick}
          renderCard={(petCard, index) => {
            const imageUrl = getPetCardImageUrl(petCard, allCards);

            return (
              <ItemCard
                item={petCard}
                index={index}
                imageUrl={imageUrl}
                icon={<Crown size={48} color="white" />}
              />
            );
          }}
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
                  src={getPetCardImageUrl(detail, allCards)}
                  alt={detail.name}
                  style={{ width: 200, height: 200, objectFit: 'contain', borderRadius: 8 }}
                />
                <div style={{ flex: 1 }}>
                  <Paragraph>{detail.desc}</Paragraph>
                  <Divider />
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <Text strong>HP:</Text> {detail.hp}
                    </Col>
                    <Col span={8}>
                      <Text strong>速度:</Text> {detail.speed}
                    </Col>
                    <Col span={8}>
                      <Text strong>攻击:</Text> {detail.attack}
                    </Col>
                    <Col span={8}>
                      <Text strong>防御:</Text> {detail.defend}
                    </Col>
                    <Col span={8}>
                      <Text strong>特攻:</Text> {detail.sAttack}
                    </Col>
                    <Col span={8}>
                      <Text strong>特防:</Text> {detail.sDefend}
                    </Col>
                  </Row>
                </div>
              </div>
            ) : null
          }
          getSearchableFields={(card) => [card.name, card.id.toString()]}
          getQuality={(card) => card.quality}
          noLayout
          loadingText={t('loading_data')}
          errorText={t('load_error')}
          paginationTotalText={(start, end, total) =>
            t('pagination_total', { rangeStart: start, rangeEnd: end, total })
          }
          noResultsText={t('no_results')}
          noDataText={t('no_data')}
          searchPlaceholder={t('search_placeholder')}
          filterOptions={[
            { value: 'all', label: t('filter_all') },
            { value: 'super', label: t('filter_super') },
            { value: 'normal', label: t('filter_normal') },
          ]}
          resetText={t('reset')}
          showingText={(filteredCount, totalCount) => (
            <Trans
              i18nKey="showing_items"
              ns="petCard"
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
        <DataView<PetCardSuit>
          queryKey={['pet-card-suits-view']}
          dataUrl="petcardsuits"
          onCardClick={handleSuitClick}
          renderCard={(suit, index) => {
            // 使用idList第一个装备的图片作为套装图片
            const firstCardId = suit.idList && suit.idList.length > 0 ? suit.idList[0] : null;
            let imageUrl: string | undefined = undefined;

            if (firstCardId) {
              // 查找第一个卡片的实际信息
              const firstCard = allCards.find((card) => card.id === firstCardId);

              if (firstCard) {
                imageUrl = getPetCardImageUrl(firstCard, allCards);
              } else {
                // 如果找不到卡片，创建一个虚拟的PetCard对象
                const virtualCard: PetCard = {
                  id: firstCardId,
                  name: `Card ${firstCardId}`,
                  viewId: firstCardId,
                  quality: 0,
                  hp: 0,
                  speed: 0,
                  attack: 0,
                  defend: 0,
                  sAttack: 0,
                  sDefend: 0,
                  desc: '',
                  limitRaceId: [],
                  level: 0,
                  levelUpId: 0,
                  synthesisType: 0,
                  limitExtAppend: null,
                  originCardId: 0,
                };

                imageUrl = getPetCardImageUrl(virtualCard, allCards);
              }
            } else {
              // 当idList为空时，使用默认图片
              imageUrl = 'https://aola.100bt.com/h5/petcard/icon/type0_0.png';
            }

            return <ItemCard item={{ ...suit, id: suit.id }} index={index} imageUrl={imageUrl} />;
          }}
          renderDetailDialog={() =>
            loadingSuitDetail ? (
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
            ) : suitDetail ? (
              <div style={{ padding: '16px' }}>
                <Title level={4} style={{ marginBottom: 16 }}>
                  {suitDetail.name}
                </Title>

                {/* 显示套装包含的装备ID列表 */}
                {suitDetail.idList && suitDetail.idList.length > 0 && (
                  <>
                    <Text strong>包含装备ID:</Text>
                    <div style={{ marginTop: 8, marginBottom: 16 }}>
                      {suitDetail.idList.map((id) => (
                        <Tag key={id} style={{ margin: '4px' }}>
                          {id}
                        </Tag>
                      ))}
                    </div>
                  </>
                )}

                {/* 显示套装效果描述 */}
                {suitDetail.dec && suitDetail.dec.length > 0 && (
                  <>
                    <Text strong>套装效果:</Text>
                    <div style={{ marginTop: 8, marginBottom: 16 }}>
                      {suitDetail.dec.map((desc, index) => (
                        <div key={index} style={{ margin: '4px 0' }}>
                          <Tag>{index}</Tag> {desc}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* 显示简单描述 */}
                {suitDetail.simpleDec && suitDetail.simpleDec.length > 0 && (
                  <>
                    <Text strong>简单描述:</Text>
                    <div style={{ marginTop: 8, marginBottom: 16 }}>
                      {suitDetail.simpleDec.map((desc, index) => (
                        <div key={index} style={{ margin: '4px 0' }}>
                          <Tag>{index}</Tag> {desc}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* 显示新提示数组0 */}
                {suitDetail.newTipsArr0 && suitDetail.newTipsArr0.length > 0 && (
                  <>
                    <Text strong>新提示数组0:</Text>
                    <div style={{ marginTop: 8, marginBottom: 16 }}>
                      {suitDetail.newTipsArr0.map((tip, index) => (
                        <div key={index} style={{ margin: '4px 0' }}>
                          <Tag>{index}</Tag> {tip}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* 显示新提示数组1 */}
                {suitDetail.newTipsArr1 && suitDetail.newTipsArr1.length > 0 && (
                  <>
                    <Text strong>新提示数组1:</Text>
                    <div style={{ marginTop: 8, marginBottom: 16 }}>
                      {suitDetail.newTipsArr1.map((tip, index) => (
                        <div key={index} style={{ margin: '4px 0' }}>
                          <Tag>{index}</Tag> {tip}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : null
          }
          getSearchableFields={(suit) => [suit.name, suit.id.toString()]}
          noLayout
          loadingText={t('loading_data')}
          errorText={t('load_error')}
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
              ns="petCard"
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

export default PetCardPage;
