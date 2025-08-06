import { Drawer, List, Switch, Tag, Typography } from 'antd';
import { useSettingStore } from '../store/setting';

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  currentPageStatus: 'release' | 'dev';
}

const SettingsDrawer: React.FC<SettingsDrawerProps> = ({ open, onClose, currentPageStatus }) => {
  const { betaMode, setBetaMode, performanceMonitoring, setPerformanceMonitoring } =
    useSettingStore();

  const data = [
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>开启测试版</span>
          {betaMode && (
            <Tag color={currentPageStatus === 'dev' ? 'volcano' : 'green'}>
              {currentPageStatus.toUpperCase()}
            </Tag>
          )}
        </div>
      ),
      description: '预览开发中的页面和功能',
      action: (
        <Switch
          checked={betaMode}
          onChange={setBetaMode}
          style={{ backgroundColor: betaMode ? '#7e57c2' : '' }}
        />
      ),
    },
    {
      title: '启用性能监测',
      description: '显示性能监测组件',
      action: (
        <Switch
          checked={performanceMonitoring}
          onChange={setPerformanceMonitoring}
          style={{ backgroundColor: performanceMonitoring ? '#7e57c2' : '' }}
        />
      ),
    },
  ];

  return (
    <Drawer title="设置" placement="right" onClose={onClose} open={open}>
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
