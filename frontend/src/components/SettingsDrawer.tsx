import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Drawer, List, Select, Switch, Tag, Typography } from 'antd';
import { useSettingStore } from '../store/setting';

/**
 * SettingsDrawer 组件的 props 接口定义
 *
 * 该组件用于显示应用的各种设置选项
 * 以抽屉形式从右侧滑入，提供良好的用户体验
 *
 * @interface SettingsDrawerProps
 * @property {boolean} open - 抽屉是否可见
 * @property {() => void} onClose - 关闭抽屉的回调函数
 * @property {'release' | 'dev'} currentPageStatus - 当前页面状态，用于显示环境标签
 */
interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  currentPageStatus: 'release' | 'dev';
}

/**
 * 设置抽屉组件
 *
 * 提供应用的各种设置选项，包括：
 * 1. Beta模式切换
 * 2. 性能监控开关
 * 3. Kimi模式切换
 * 4. 语言选择
 *
 * 每个设置项包含：
 * - 标题（可能包含状态标签）
 * - 描述文本
 * - 操作控件（开关或选择器）
 *
 * @param {SettingsDrawerProps} props - 组件 props
 * @returns {React.ReactElement} 设置抽屉组件
 */
const SettingsDrawer: React.FC<SettingsDrawerProps> = ({ open, onClose, currentPageStatus }) => {
  const { t, i18n } = useTranslation('common');
  const {
    betaMode,
    setBetaMode,
    performanceMonitoring,
    setPerformanceMonitoring,
    kimiMode,
    setKimiMode,
  } = useSettingStore();
  const [kimiDescription, setKimiDescription] = useState('');

  /**
   * 随机选择一个Kimi模式描述文本
   *
   * 从预定义的描述数组中随机选择一个，
   * 增加用户界面的趣味性
   */
  useEffect(() => {
    const descriptions = t('kimiModeDescription', { returnObjects: true }) as string[];
    const randomIndex = Math.floor(Math.random() * descriptions.length);
    setKimiDescription(descriptions[randomIndex]);
  }, [t]);

  /**
   * 处理语言变更事件
   *
   * 当用户选择新的语言时调用
   * 更新i18n实例的语言设置
   *
   * @param {string} value - 选中的语言代码
   */
  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  /**
   * 设置项数据定义
   *
   * 包含所有可配置的设置项
   * 每个项定义了标题、描述和操作控件
   */
  const data = [
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>{t('betaMode')}</span>
          {betaMode && (
            <Tag color={currentPageStatus === 'dev' ? 'volcano' : 'green'}>
              {currentPageStatus.toUpperCase()}
            </Tag>
          )}
        </div>
      ),
      description: t('betaModeDescription'),
      action: (
        <Switch
          checked={betaMode}
          onChange={setBetaMode}
          style={{ backgroundColor: betaMode ? '#7e57c2' : '' }}
        />
      ),
    },
    {
      title: t('performanceMonitoring'),
      description: t('performanceMonitoringDescription'),
      action: (
        <Switch
          checked={performanceMonitoring}
          onChange={setPerformanceMonitoring}
          style={{ backgroundColor: performanceMonitoring ? '#7e57c2' : '' }}
        />
      ),
    },
    {
      title: t('kimiMode'),
      description: kimiDescription,
      action: (
        <Switch
          checked={kimiMode}
          onChange={setKimiMode}
          style={{ backgroundColor: kimiMode ? '#7e57c2' : '' }}
        />
      ),
    },
    {
      title: t('language'),
      description: t('languageDescription'),
      action: (
        <Select defaultValue={i18n.language} onChange={handleLanguageChange}>
          <Select.Option value="en">English</Select.Option>
          <Select.Option value="zh">中文</Select.Option>
        </Select>
      ),
    },
  ];

  return (
    <Drawer title={t('settings')} placement="right" onClose={onClose} open={open}>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item actions={[item.action]}>
            <List.Item.Meta
              title={<Typography.Text>{item.title}</Typography.Text>}
              description={<Typography.Text type="secondary">{item.description}</Typography.Text>}
            />
          </List.Item>
        )}
      />
    </Drawer>
  );
};

export default SettingsDrawer;
