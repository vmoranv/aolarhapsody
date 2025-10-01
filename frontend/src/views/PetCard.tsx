import { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import { useQuery } from '@tanstack/react-query';
import { Col, Divider, Row, Spin, Switch, Tag, Typography } from 'antd';
import { motion } from 'framer-motion';
import { Crown, Shield, Zap } from 'lucide-react';
import DataView from '../components/DataView';
import ItemCard from '../components/ItemCard';
import Layout from '../components/Layout';
import { useSearchStore } from '../store/search';
import type { PetCard, PetCardSuit } from '../types/petCard.ts';
import { fetchData, fetchDataItem } from '../utils/api';
import { getPetCardImageUrl } from '../utils/image-helper';

/**
 * 解析描述文本，处理换行符和用 # 包围的强调关键字。
 * 例如："这是第一行<br>这是第二行，#关键字#会被强调。"
 * 会被解析成两个段落，并且"关键字"会被高亮显示。
 * @param text - 需要解析的原始字符串
 * @returns 解析后的 React JSX 元素数组，如果输入为空则返回 null
 */
const parseDescription = (text: string) => {
  if (!text) {
    return null;
  }

  // 分割文本为段落
  const paragraphs = text.split('<br>');

  return paragraphs
    .map((paragraph, pIndex) => {
      if (!paragraph.trim()) {
        return null;
      }

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

/**
 * 宠物卡片页面组件。
 * 该组件提供了两种视图模式：单个卡片视图和套装视图。
 * 用户可以在此页面浏览、搜索和查看宠物卡片及其套装的详细信息。
 * 主要功能包括：
 * - 切换卡片/套装视图
 * - 展示卡片/套装列表
 * - 点击查看卡片/套装的详细信息，包括属性、效果和包含的装备
 * - 对于套装效果，支持在新旧技能组描述之间切换
 */
const PetCardPage = () => {
  const { t } = useTranslation('petCard');
  const { setSearchValue, setFilterType } = useSearchStore();

  // 视图模式：'cards' 表示卡片视图，'suits' 表示套装视图
  const [viewMode, setViewMode] = useState<'cards' | 'suits'>('cards');

  // 当前选中的卡片详细信息
  const [detail, setDetail] = useState<PetCard | null>(null);

  // 卡片详情加载状态
  const [loadingDetail, setLoadingDetail] = useState(false);

  // 当前选中的套装详细信息
  const [suitDetail, setSuitDetail] = useState<PetCardSuit | null>(null);

  // 套装详情加载状态
  const [loadingSuitDetail, setLoadingSuitDetail] = useState(false);

  // 套装技能组显示模式：true表示新技能组，false表示旧技能组
  const [isNewSkillGroup, setIsNewSkillGroup] = useState(false);

  useCopilotReadable({
    description: '当前宠物卡片页面视图模式',
    value: `当前正在查看${viewMode === 'cards' ? '宠物卡片' : '套装'}`,
  });

  useCopilotAction({
    name: 'searchPetCards',
    description: '在宠物卡片或套装中搜索',
    parameters: [
      {
        name: 'query',
        type: 'string',
        description: '要搜索的关键词',
      },
    ],
    handler: async ({ query }) => {
      setSearchValue(query);
    },
  });

  useCopilotAction({
    name: 'filterPetCards',
    description: '筛选宠物卡片或套装',
    parameters: [
      {
        name: 'filterType',
        type: 'string',
        description: '筛选类型',
        enum: ['all', 'super', 'normal'],
      },
    ],
    handler: async ({ filterType }) => {
      setFilterType(filterType);
    },
  });

  useCopilotAction({
    name: 'togglePetCardView',
    description: '切换宠物卡片或套装视图',
    parameters: [
      {
        name: 'view',
        type: 'string',
        description: '要切换到的视图',
        enum: ['cards', 'suits'],
      },
    ],
    handler: async ({ view }) => {
      setViewMode(view);
    },
  });

  useCopilotAction({
    name: 'showPetCardDetails',
    description: '显示特定宠物卡片或套装的详细信息',
    parameters: [
      {
        name: 'name',
        type: 'string',
        description: '要显示详细信息的宠物卡片或套装名称',
        required: true,
      },
    ],
    handler: async ({ name }) => {
      // 在实际应用中，这会查找并显示特定宠物卡片或套装的详细信息
      // 临时使用name变量以避免TypeScript警告
      console.warn(`Searching for Pet Card or Suit with name: ${name}`);
    },
  });

  /**
   * 处理卡片点击事件：获取并显示卡片的详细信息
   * @param card - 被点击的卡片对象
   */
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

  /**
   * 处理套装点击事件：获取并显示套装的详细信息，包括包含的装备和技能效果
   * @param suit - 被点击的套装对象
   */
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

  // 使用 React Query 获取所有宠物卡片数据，提供缓存和错误处理
  const { data: allCards = [] } = useQuery<PetCard[]>({
    queryKey: ['pet-cards-all'],
    queryFn: () => fetchData<PetCard>('petcards'),
  });

  // 过滤卡片数据：排除包含'LV'的卡片且ID不大于100000
  // 这通常是为了过滤掉高等级卡片，专注于基础卡片显示
  const filteredCards = useMemo(
    () => allCards.filter((card) => !card.name.includes('LV') && card.id <= 100000),
    [allCards]
  );

  // 视图切换器组件：提供卡片视图和套装视图之间的切换功能
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
                // 如果找不到卡片，创建一个虚拟的PetCard对象用于显示占位图片
                // 这通常发生在数据不完整或卡片信息缺失的情况下
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
                          // 查找卡片的实际信息用于显示装备图片
                          const card = allCards.find((card) => card.id === id);
                          let imageUrl: string | undefined = undefined;

                          if (card) {
                            imageUrl = getPetCardImageUrl(card, allCards);
                          } else {
                            // 如果找不到卡片，创建一个虚拟的PetCard对象作为占位符
                            // 这种情况通常表示套装数据与卡片数据不同步
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
                          // 检查旧技能组数据是否存在非空描述
                          const hasOldSkills =
                            suitDetail.dec && suitDetail.dec.some((desc) => desc !== '');
                          // 检查新技能组数据是否存在非空提示
                          const hasNewSkills =
                            suitDetail.newTipsArr0 &&
                            suitDetail.newTipsArr0.some((tip) => tip !== '');
                          // 仅当同时存在新旧技能组数据时才允许切换
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
                        (desc: string, index: number) => (
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
