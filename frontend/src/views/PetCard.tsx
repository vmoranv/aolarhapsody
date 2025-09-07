import { useQuery } from '@tanstack/react-query';
import { Col, Divider, Row, Spin, Switch, Tag, Typography } from 'antd';
import { motion } from 'framer-motion';
import { Crown, Shield,Zap } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import DataView from '../components/DataView';
import ItemCard from '../components/ItemCard';
import Layout from '../components/Layout';
import type { PetCard, PetCardSuit } from '../types/petCard';
import { fetchData, fetchDataItem } from '../utils/api';
import { getPetCardImageUrl } from '../utils/image-helper';

// 解析描述文本，处理换行符和强调关键字
const parseDescription = (text: string) => {
  if (!text) return null;

  // 分割文本为段落
  const paragraphs = text.split('<br>');

  return paragraphs
    .map((paragraph, pIndex) => {
      if (!paragraph.trim()) return null;

      // 使用正则表达式匹配并替换强调关键字
      const elements = [];
      let lastIndex = 0;
      const regex = /#([^#]+)#/g;
      let match;

      while ((match = regex.exec(paragraph)) !== null) {
        // 添加匹配前的普通文本
        if (match.index > lastIndex) {
          elements.push(
            <span key={`text-${lastIndex}`}>{paragraph.substring(lastIndex, match.index)}</span>
          );
        }

        // 添加强调关键字
        elements.push(
          <span key={`emphasis-${match.index}`} style={{ color: '#1890ff', fontWeight: 'bold' }}>
            {match[1]}
          </span>
        );

        lastIndex = match.index + match[0].length;
      }

      // 添加剩余的普通文本
      if (lastIndex < paragraph.length) {
        elements.push(<span key={`text-${lastIndex}`}>{paragraph.substring(lastIndex)}</span>);
      }

      return (
        <div key={pIndex} style={{ marginBottom: pIndex < paragraphs.length - 1 ? '8px' : '0' }}>
          {elements}
        </div>
      );
    })
    .filter(Boolean); // 过滤掉空值
};

const { Title, Paragraph, Text } = Typography;

const PetCardPage = () => {
  const { t } = useTranslation('petCard');
  const [viewMode, setViewMode] = useState<'cards' | 'suits'>('cards');
  const [detail, setDetail] = useState<PetCard | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [suitDetail, setSuitDetail] = useState<PetCardSuit | null>(null);
  const [loadingSuitDetail, setLoadingSuitDetail] = useState(false);
  const [isNewSkillGroup, setIsNewSkillGroup] = useState(false);

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

      // 根据数据情况设置Switch状态
      const hasOldSkills = data.dec && data.dec.some((desc: string) => desc !== '');
      const hasNewSkills = data.newTipsArr0 && data.newTipsArr0.some((tip: string) => tip !== '');

      // 如果只有新技能组数据，默认显示新技能组
      // 如果只有旧技能组数据，默认显示旧技能组
      // 如果同时有新旧技能组数据，默认显示旧技能组
      if (!hasOldSkills && hasNewSkills) {
        setIsNewSkillGroup(true);
      } else {
        setIsNewSkillGroup(false);
      }
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
          renderDetailDialog={() => {
            if (loadingSuitDetail) {
              return (
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
              );
            }

            if (suitDetail) {
              return (
                <div style={{ padding: '16px' }}>
                  {/* 显示套装包含的装备图片列表 */}
                  {suitDetail.idList && suitDetail.idList.length > 0 && (
                    <>
                      <Text strong>{t('included_equipment')}</Text>
                      <div
                        style={{
                          marginTop: 8,
                          marginBottom: 16,
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '12px',
                        }}
                      >
                        {suitDetail.idList.map((id) => {
                          // 查找卡片的实际信息
                          const card = allCards.find((card) => card.id === id);
                          let imageUrl: string | undefined = undefined;

                          if (card) {
                            imageUrl = getPetCardImageUrl(card, allCards);
                          } else {
                            // 如果找不到卡片，创建一个虚拟的PetCard对象
                            const virtualCard: PetCard = {
                              id: id,
                              name: `Card ${id}`,
                              viewId: id,
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

                          return (
                            <div
                              key={id}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                margin: '4px',
                              }}
                            >
                              <img
                                src={imageUrl}
                                alt={t('equipment_alt', { id })}
                                style={{
                                  width: 80,
                                  height: 80,
                                  objectFit: 'contain',
                                  borderRadius: 4,
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {/* 显示套装效果描述 - 根据Switch状态选择dec或newTipsArr0 */}
                  <Text strong>{t('suit_effects')}</Text>
                  <div style={{ marginTop: 8, marginBottom: 16, position: 'relative' }}>
                    {/* 始终显示Switch，但根据数据情况决定是否禁用 - 放在右上角 */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ marginRight: 8 }}>
                        {isNewSkillGroup ? t('new_skill_group') : t('old_skill_group')}
                      </Text>
                      <Switch
                        checked={isNewSkillGroup}
                        onChange={(checked) => {
                          // 只有同时有新旧技能组数据时才允许切换
                          const hasOldSkills =
                            suitDetail.dec && suitDetail.dec.some((desc) => desc !== '');
                          const hasNewSkills =
                            suitDetail.newTipsArr0 &&
                            suitDetail.newTipsArr0.some((tip) => tip !== '');
                          if (hasOldSkills && hasNewSkills) {
                            setIsNewSkillGroup(checked);
                          }
                        }}
                        checkedChildren={<Zap size={14} style={{ marginTop: '4px' }} />}
                        unCheckedChildren={<Shield size={14} style={{ marginTop: '4px' }} />}
                        disabled={
                          !(
                            suitDetail.dec &&
                            suitDetail.dec.some((desc: string) => desc !== '') &&
                            suitDetail.newTipsArr0 &&
                            suitDetail.newTipsArr0.some((tip: string) => tip !== '')
                          )
                        }
                      />
                    </div>

                    <div style={{ paddingRight: 180 }}>
                      {' '}
                      {/* 为右上角的Switch留出空间 */}
                      {(isNewSkillGroup ? suitDetail.newTipsArr0 || [] : suitDetail.dec || []).map(
                        (desc, index) => (
                          <div key={index} style={{ margin: '4px 0' }}>
                            {desc && <Tag>{index + 1}/4</Tag>} {parseDescription(desc)}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          }}
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
