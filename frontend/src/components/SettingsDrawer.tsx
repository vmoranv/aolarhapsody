import { Drawer, List, Select, Switch, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingStore } from '../store/setting';

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  currentPageStatus: 'release' | 'dev';
}

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

  useEffect(() => {
    const descriptions = t('kimiModeDescription', { returnObjects: true }) as string[];
    const randomIndex = Math.floor(Math.random() * descriptions.length);
    setKimiDescription(descriptions[randomIndex]);
  }, [t]);

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

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
