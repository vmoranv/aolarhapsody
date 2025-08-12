import { useQuery } from '@tanstack/react-query';
import {
  Badge,
  Button,
  Card,
  Col,
  Empty,
  Input,
  Row,
  Select,
  Space,
  Statistic,
  Tag,
  Typography,
} from 'antd';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  Database,
  Filter,
  Link,
  Monitor,
  RefreshCw,
  RotateCcw,
  Search,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorDisplay from '../components/ErrorDisplay';

console.warn('VITE_API_URL in production:', import.meta.env.VITE_API_URL);
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNotificationContext } from '../hooks/useNotificationContext';
import { useTheme } from '../hooks/useTheme';

const { Option } = Select;

const { Title, Paragraph } = Typography;

// 子类监控数据类型
type SubclassMonitorData = {
  name: string;
  url: string;
  subclassCount: number;
  subclasses: string[];
  hasChange: boolean;
  newSubclasses: string[];
};

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
  timestamp: string;
}

// 预定义的监控目标列表
const MONITOR_TARGETS = [
  'hk',
  'tote',
  'astralSpirit',
  'chatFrame',
  'clothesData',
  'crystalKey',
  'galaxyFleetMark',
  'godCard',
  'headFrame',
  'petIcon',
  'headIcon',
  'inscription',
  'item',
  'miracle',
  'petCard',
  'petCard2',
  'petDictionary',
  'petStone',
  'petTalk',
  'petTerritoryFight',
  'pmDataList',
  'pmEvoLink',
  'summoner',
  'task',
  'title',
];

const fetchSubclassData = async (name: string): Promise<SubclassMonitorData> => {
  const baseUrl = import.meta.env.VITE_API_URL || '';
  const response = await fetch(`${baseUrl}/api/monitor/${name}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result: ApiResponse<SubclassMonitorData> = await response.json();

  if (result.success && result.data) {
    return result.data;
  } else {
    throw new Error(result.error || '获取监控数据失败');
  }
};

const Home = () => {
  const { t } = useTranslation('home');
  const [searchValue, setSearchValue] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'changed' | 'stable'>('all');
  const [selectedTarget, setSelectedTarget] = useState<string>('hk');
  const { colors } = useTheme()!;
  const notifications = useNotificationContext();

  // 获取所有监控目标的数据
  const monitorQueries = useQuery({
    queryKey: ['monitor-all'],
    queryFn: async () => {
      const results = await Promise.allSettled(
        MONITOR_TARGETS.map((target) => fetchSubclassData(target))
      );

      return results.map((result, index) => ({
        name: MONITOR_TARGETS[index],
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason : null,
      }));
    },
  });

  // 获取单个目标的详细数据
  const { data: selectedData, isLoading: isLoadingSelected } = useQuery({
    queryKey: ['monitor', selectedTarget],
    queryFn: () => fetchSubclassData(selectedTarget),
    enabled: !!selectedTarget,
  });

  const { data: monitorData = [], isLoading, error } = monitorQueries;

  // Handle error states only - 移除初始加载成功通知
  React.useEffect(() => {
    if (error) {
      notifications.error(
        t('dataLoadFailed'),
        `${t('dataLoadFailed')}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }, [error, notifications]);

  // 筛选和搜索逻辑
  const filteredData = useMemo(() => {
    let filtered = monitorData.filter((item) => item.data);

    // 按变化状态筛选
    if (filterType === 'changed') {
      filtered = filtered.filter((item) => item.data?.hasChange);
    } else if (filterType === 'stable') {
      filtered = filtered.filter((item) => !item.data?.hasChange);
    }

    // 按名称搜索
    if (searchValue.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.data?.url.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    return filtered;
  }, [monitorData, searchValue, filterType]);

  // 统计数据
  const validData = monitorData.filter((item) => item.data);
  const changedData = validData.filter((item) => item.data?.hasChange);
  const stableData = validData.filter((item) => !item.data?.hasChange);
  const totalSubclasses = validData.reduce((sum, item) => sum + (item.data?.subclassCount || 0), 0);

  // 重置搜索和筛选
  const handleReset = () => {
    setSearchValue('');
    setFilterType('all');
  };

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner text={t('loadingSubclassData')} />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorDisplay
          error={error instanceof Error ? error.message : String(error)}
          onRetry={() => monitorQueries.refetch()}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 页面标题 */}
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
            {t('subclassMonitoringDashboard')}
          </Title>
          <Paragraph style={{ fontSize: '16px', color: colors.textSecondary, marginTop: 8 }}>
            {t('subclassMonitoringDashboardDescription')}
          </Paragraph>
        </motion.div>

        {/* 统计卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ borderRadius: 12 }}>
                <Statistic
                  title={t('monitoringTargets')}
                  value={validData.length}
                  prefix={<Monitor size={20} color={colors.primary} />}
                  valueStyle={{ color: colors.primary }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ borderRadius: 12 }}>
                <Statistic
                  title={t('hasChange')}
                  value={changedData.length}
                  prefix={<AlertTriangle size={20} color="#faad14" />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ borderRadius: 12 }}>
                <Statistic
                  title={t('stableState')}
                  value={stableData.length}
                  prefix={<Activity size={20} color="#52c41a" />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ borderRadius: 12 }}>
                <Statistic
                  title={t('totalSubclasses')}
                  value={totalSubclasses}
                  prefix={<Database size={20} color="#722ed1" />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
          </Row>
        </motion.div>

        {/* 搜索和筛选 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: colors.surface,
            padding: '20px',
            borderRadius: '12px',
            boxShadow: `0 2px 8px ${colors.shadow}`,
            marginBottom: '24px',
            border: `1px solid ${colors.borderSecondary}`,
          }}
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <Space size="middle" style={{ flex: 1, minWidth: '300px' }}>
                <Input
                  placeholder={t('searchMonitoringTarget')}
                  prefix={<Search size={16} color={colors.textSecondary} />}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  style={{
                    borderRadius: 8,
                    minWidth: '200px',
                  }}
                  allowClear
                />

                <Select
                  value={filterType}
                  onChange={setFilterType}
                  style={{ minWidth: '120px' }}
                  suffixIcon={<Filter size={16} color={colors.textSecondary} />}
                >
                  <Option value="all">{t('allStates')}</Option>
                  <Option value="changed">{t('hasChange')}</Option>
                  <Option value="stable">{t('stableState')}</Option>
                </Select>

                <Button
                  icon={<RotateCcw size={16} />}
                  onClick={handleReset}
                  style={{ borderRadius: 8 }}
                >
                  {t('reset')}
                </Button>

                <Button
                  icon={<RefreshCw size={16} />}
                  onClick={async () => {
                    try {
                      const result = await monitorQueries.refetch();
                      if (result.data) {
                        const successCount = result.data.filter((item) => item.data).length;
                        notifications.success(
                          t('dataRefreshSuccess'),
                          `${t('dataRefreshSuccess')}！(${successCount}/${MONITOR_TARGETS.length})`
                        );
                      }
                    } catch {
                      notifications.error(
                        t('dataRefreshFailed'),
                        `${t('dataRefreshFailed')}，请重试`
                      );
                    }
                  }}
                  loading={monitorQueries.isFetching}
                  style={{ borderRadius: 8 }}
                >
                  {t('refresh')}
                </Button>
              </Space>

              <div
                style={{
                  color: colors.textSecondary,
                  fontSize: '14px',
                  whiteSpace: 'nowrap',
                }}
              >
                {t('show')}{' '}
                <span style={{ color: colors.primary, fontWeight: 600 }}>
                  {filteredData.length}
                </span>{' '}
                / {validData.length} {t('targets')}
              </div>
            </div>
          </Space>
        </motion.div>

        {/* 监控目标网格 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Title level={3} style={{ marginBottom: 24, color: colors.text }}>
            {t('monitoringTargetList')}
          </Title>

          {filteredData.length > 0 ? (
            <Row gutter={[16, 16]}>
              {filteredData.map((item, index) => (
                <Col xs={24} sm={12} md={8} lg={6} key={item.name}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card
                      hoverable
                      style={{
                        borderRadius: 12,
                        border: item.data?.hasChange
                          ? `2px solid #faad14`
                          : `1px solid ${colors.borderSecondary}`,
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelectedTarget(item.name)}
                      styles={{ body: { padding: '16px' } }}
                    >
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Title level={5} style={{ margin: 0, color: colors.text }}>
                            {t(item.name)}
                          </Title>
                          <Badge
                            status={item.data?.hasChange ? 'warning' : 'success'}
                            text={item.data?.hasChange ? t('hasChange') : t('stableState')}
                          />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Link size={14} color={colors.textSecondary} />
                          <span
                            style={{
                              fontSize: '12px',
                              color: colors.textSecondary,
                              wordBreak: 'break-all',
                            }}
                          >
                            {item.data?.url}
                          </span>
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Statistic
                            title={t('subclassCount')}
                            value={item.data?.subclassCount || 0}
                            valueStyle={{ fontSize: '18px', color: colors.primary }}
                          />
                          {item.data?.hasChange && item.data.newSubclasses.length > 0 && (
                            <Tag color="orange" style={{ fontSize: '10px' }}>
                              +{item.data.newSubclasses.length} {t('new')}
                            </Tag>
                          )}
                        </div>

                        {item.data?.subclasses && item.data.subclasses.length > 0 && (
                          <div>
                            <div
                              style={{
                                fontSize: '12px',
                                color: colors.textSecondary,
                                marginBottom: 4,
                              }}
                            >
                              {t('subclassList')}:
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                              {item.data.subclasses.slice(0, 3).map((subclass) => (
                                <Tag
                                  key={subclass}
                                  color={
                                    item.data?.newSubclasses.includes(subclass) ? 'orange' : 'blue'
                                  }
                                  style={{ fontSize: '11px', padding: '2px 6px' }}
                                >
                                  {subclass}
                                </Tag>
                              ))}
                              {item.data.subclasses.length > 3 && (
                                <Tag
                                  color="default"
                                  style={{ fontSize: '11px', padding: '2px 6px' }}
                                >
                                  +{item.data.subclasses.length - 3}
                                </Tag>
                              )}
                            </div>
                          </div>
                        )}
                      </Space>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span style={{ color: colors.textSecondary }}>
                    {searchValue || filterType !== 'all'
                      ? '没有找到匹配的监控目标'
                      : '暂无监控数据'}
                  </span>
                }
                style={{
                  padding: '60px 20px',
                  background: colors.surface,
                  borderRadius: 12,
                  border: `1px solid ${colors.borderSecondary}`,
                }}
              />
            </motion.div>
          )}
        </motion.div>

        {/* 选中目标的详细信息 */}
        {selectedData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Monitor size={20} color={colors.primary} />
                  <span>详细信息: {selectedTarget}</span>
                  <Badge
                    status={selectedData.hasChange ? 'warning' : 'success'}
                    text={selectedData.hasChange ? '检测到变化' : '状态稳定'}
                  />
                </div>
              }
              style={{ borderRadius: 12 }}
              loading={isLoadingSelected}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div>
                      <Title level={5} style={{ margin: 0, color: colors.text }}>
                        基本信息
                      </Title>
                      <div style={{ marginTop: 8 }}>
                        <p>
                          <strong>数据源URL:</strong>{' '}
                          <a
                            href={selectedData.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ wordBreak: 'break-all' }}
                          >
                            {selectedData.url}
                          </a>
                        </p>
                        <p>
                          <strong>子类总数:</strong> {selectedData.subclassCount}
                        </p>
                        <p>
                          <strong>状态:</strong> {selectedData.hasChange ? '有变化' : '稳定'}
                        </p>
                      </div>
                    </div>
                  </Space>
                </Col>
                <Col xs={24} md={12}>
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div>
                      <Title level={5} style={{ margin: 0, color: colors.text }}>
                        所有子类
                      </Title>
                      <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {selectedData.subclasses.map((subclass) => (
                          <Tag
                            key={subclass}
                            color={
                              selectedData.newSubclasses.includes(subclass) ? 'orange' : 'blue'
                            }
                          >
                            {subclass}
                            {selectedData.newSubclasses.includes(subclass) && ' (新增)'}
                          </Tag>
                        ))}
                      </div>
                    </div>
                    {selectedData.newSubclasses.length > 0 && (
                      <div>
                        <Title level={5} style={{ margin: 0, color: '#faad14' }}>
                          新增子类
                        </Title>
                        <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {selectedData.newSubclasses.map((subclass) => (
                            <Tag key={subclass} color="orange">
                              {subclass}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    )}
                  </Space>
                </Col>
              </Row>
            </Card>
          </motion.div>
        )}
      </Space>
    </Layout>
  );
};

export default Home;
