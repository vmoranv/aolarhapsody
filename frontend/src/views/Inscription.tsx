// 导入React及相关库
import { useState } from 'react'; // React hook
import { Trans, useTranslation } from 'react-i18next'; // 国际化库
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core'; // CopilotKit
import { Col, Divider, Row, Spin, Typography } from 'antd'; // Ant Design 组件
import { motion } from 'framer-motion'; // 动画库
import { Scroll } from 'lucide-react'; // 图标库
// 导入自定义组件和类型
import DataView from '../components/DataView'; // 数据展示视图组件
import ItemCard from '../components/ItemCard'; // 项目卡片组件
import Layout from '../components/Layout'; // 布局组件
import { useSearchStore } from '../store/search';
import type { Inscription } from '../types/inscription'; // 铭文类型定义
// 导入工具函数
import { fetchDataItem } from '../utils/api'; // API数据获取函数
import { getInscriptionImageUrl } from '../utils/image-helper'; // 图片URL获取辅助函数

// 从Typography中解构出常用组件
const { Title, Paragraph, Text } = Typography;

/**
 * @description 铭文页面组件。
 * 该组件负责展示一个包含各种铭文信息的页面。
 * 用户可以查看铭文列表，点击卡片查看铭文的详细信息，并进行搜索和筛选。
 * @returns {React.ReactElement} - 渲染的铭文页面组件。
 */
const InscriptionPage = () => {
  // 使用useTranslation hook获取国际化函数t
  const { t } = useTranslation('inscription');
  // 定义状态，用于存储当前选中的铭文的详细信息
  const [detail, setDetail] = useState<Inscription | null>(null);
  // 定义状态，用于控制加载铭文详情时的加载动画
  const [loadingDetail, setLoadingDetail] = useState(false);
  const { setSearchValue, setFilterType } = useSearchStore();

  /**
   * @description 处理铭文卡片点击事件。
   * 当用户点击一个铭文卡片时，此函数会异步获取该铭文的详细数据并更新状态。
   * @param {Inscription} inscription - 被点击的铭文对象。
   */
  const handleCardClick = async (inscription: Inscription) => {
    setLoadingDetail(true); // 开始加载，显示加载动画
    try {
      // 调用API获取铭文的详细数据
      const data = await fetchDataItem<Inscription>('inscriptions', inscription.id.toString());
      setDetail(data); // 更新状态，存储获取到的详情
    } catch (error) {
      // 如果获取失败，在控制台打印错误信息
      console.error('Failed to fetch inscription detail', error);
    } finally {
      setLoadingDetail(false); // 加载结束，隐藏加载动画
    }
  };

  // 添加 CopilotKit 操作
  useCopilotReadable({
    description: '当前铭文页面筛选状态',
    value: '铭文页面支持筛选和搜索功能',
  });

  useCopilotAction({
    name: 'searchInscriptions',
    description: '搜索铭文',
    parameters: [
      {
        name: 'query',
        type: 'string',
        description: '搜索关键词',
      },
    ],
    handler: async ({ query }) => {
      setSearchValue(query);
    },
  });

  useCopilotAction({
    name: 'filterInscriptions',
    description: '筛选铭文',
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
    name: 'showInscriptionDetails',
    description: '显示特定铭文的详细信息',
    parameters: [
      {
        name: 'name',
        type: 'string',
        description: '要显示详细信息的铭文名称',
        required: true,
      },
    ],
    handler: async ({ name }) => {
      // 在实际应用中，这会查找并显示特定铭文的详细信息
      // 临时使用name变量以避免TypeScript警告
      console.warn(`Searching for Inscription with name: ${name}`);
    },
  });

  // 定义筛选选项，用于DataView组件的过滤器
  const filterOptions = [
    { value: 'all', label: t('filter_all') }, // 全部
    { value: 'super', label: t('filter_super') }, // 超级
    { value: 'normal', label: t('filter_normal') }, // 普通
  ];

  return (
    <Layout>
      {/* 页面标题和副标题，使用framer-motion实现入场动画 */}
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
      {/* 使用DataView组件来展示和管理铭文数据 */}
      <DataView<Inscription>
        queryKey={['inscriptions-view']} // React Query的查询键
        dataUrl="inscriptions" // 数据获取的API端点
        onCardClick={handleCardClick} // 卡片点击事件的回调
        // 自定义卡片渲染逻辑
        renderCard={(inscription, index) => (
          <ItemCard
            item={inscription}
            index={index}
            imageUrl={getInscriptionImageUrl(inscription.id)}
            icon={<Scroll size={48} color="white" />} // 卡片图标
          />
        )}
        // 自定义详情弹窗的渲染逻辑
        renderDetailDialog={() =>
          loadingDetail ? (
            // 如果正在加载，显示加载动画
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
            // 如果加载完成且有数据，显示铭文详情
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
                  {/* 展示铭文的各种属性 */}
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
        // 定义可用于搜索的字段
        getSearchableFields={(inscription) => [
          inscription.name,
          inscription.id.toString(),
          inscription.desc,
        ]}
        // 根据铭文等级定义卡片品质（用于视觉区分）
        getQuality={(inscription) => inscription.level}
        noLayout // 不使用DataView的默认布局
        // 国际化文本配置
        loadingText={t('loading_data')}
        errorText={t('load_failed')}
        paginationTotalText={(start, end, total) =>
          t('pagination_total', { rangeStart: start, rangeEnd: end, total })
        }
        noResultsText={t('no_results')}
        noDataText={t('no_data')}
        searchPlaceholder={t('search_placeholder')}
        filterOptions={filterOptions} // 筛选选项
        resetText={t('reset')}
        // “显示中”文本的渲染，使用Trans组件处理带格式的翻译
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
