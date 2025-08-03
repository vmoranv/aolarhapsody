import { ConfigProvider, theme } from 'antd';
import { HashRouter } from 'react-router-dom';
import PerformanceMonitor from './components/PerformanceMonitor';
import { NotificationProvider } from './contexts/NotificationContext';
import { useTheme } from './hooks/useTheme';
import Router from './router';

const App = () => {
  const { theme: currentTheme, colors } = useTheme()!;

  const antdTheme = {
    algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: colors.primary,
      borderRadius: 8,
      // 全局背景色
      colorBgContainer: colors.surface,
      colorBgElevated: colors.elevated,
      colorBgLayout: colors.background,
      colorBgBase: colors.background,
      // 文字颜色
      colorText: colors.text,
      colorTextSecondary: colors.textSecondary,
      colorTextTertiary: colors.textTertiary,
      // 边框颜色
      colorBorder: colors.border,
      colorBorderSecondary: colors.borderSecondary,
      // 填充色
      colorFill: colors.fill,
      colorFillSecondary: colors.fillSecondary,
      colorFillTertiary: colors.fillTertiary,
      colorFillQuaternary: colors.fillQuaternary,
      // 状态色
      colorSuccess: colors.success,
      colorWarning: colors.warning,
      colorError: colors.error,
      colorInfo: colors.info,
    },
    components: {
      Layout: {
        bodyBg: colors.background,
        headerBg: colors.surface,
        siderBg: colors.surface,
        triggerBg: colors.elevated,
        triggerColor: colors.text,
      },
      Card: {
        borderRadiusLG: 12,
        colorBgContainer: colors.surface,
        colorBorderSecondary: colors.borderSecondary,
      },
      Button: {
        borderRadius: 8,
        colorBgContainer: colors.elevated,
      },
      Menu: {
        itemBg: colors.surface,
        subMenuItemBg: colors.surface,
        itemSelectedBg: colors.primary + '20', // 20% opacity
        itemHoverBg: colors.fillSecondary,
        itemColor: colors.text,
        itemSelectedColor: colors.primary,
        // 添加更多菜单颜色配置
        colorBgContainer: colors.surface,
        colorText: colors.text,
        colorTextSecondary: colors.textSecondary,
        colorIcon: colors.text,
        colorIconHover: colors.primary,
        // 子菜单相关
        subMenuItemBorderRadius: 8,
        itemMarginBlock: 4,
        itemMarginInline: 8,
        itemPaddingInline: 12,
      },
      Input: {
        colorBgContainer: colors.elevated,
        colorBorder: colors.border,
      },
      Select: {
        colorBgContainer: colors.elevated,
        colorBgElevated: colors.elevated,
      },
      Dropdown: {
        colorBgElevated: colors.elevated,
      },
      Pagination: {
        colorBgContainer: colors.elevated,
      },
      Statistic: {
        colorTextHeading: colors.text,
      },
      Typography: {
        colorText: colors.text,
        colorTextHeading: colors.text,
        colorTextSecondary: colors.textSecondary,
      },
      Empty: {
        colorTextDisabled: colors.textDisabled,
      },
      Tag: {
        colorBgContainer: colors.fillSecondary,
      },
      Tooltip: {
        colorBgSpotlight: colors.elevated,
      },
    },
  };

  return (
    <ConfigProvider theme={antdTheme}>
      <NotificationProvider>
        <HashRouter>
          <Router />
          <PerformanceMonitor />
        </HashRouter>
      </NotificationProvider>
    </ConfigProvider>
  );
};

export default App;
