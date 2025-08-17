import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import { CopilotKitCSSProperties,CopilotSidebar } from '@copilotkit/react-ui';
import { App as AntApp, ConfigProvider, theme } from 'antd';
import { useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { NotificationProvider } from '../contexts/NotificationContext';
import { useTheme } from '../hooks/useTheme';
import Router from '../router';
import { useSettingStore } from '../store/setting';
import PerformanceMonitor from './PerformanceMonitor';

const MainContent = () => {
  const { theme: currentTheme, setTheme, colors } = useTheme()!;
  const { performanceMonitoring, kimiMode, toggleKimiMode, togglePerformanceMonitoring } =
    useSettingStore();

  useEffect(() => {
    const appleTouchIcon = document.getElementById('apple-touch-icon') as HTMLLinkElement;
    const icon32x32 = document.getElementById('icon-32x32') as HTMLLinkElement;
    const icon16x16 = document.getElementById('icon-16x16') as HTMLLinkElement;
    const manifest = document.getElementById('manifest') as HTMLLinkElement;

    if (kimiMode) {
      appleTouchIcon.href = '/favicon_maodie/apple-touch-icon.png';
      icon32x32.href = '/favicon_maodie/favicon-32x32.png';
      icon16x16.href = '/favicon_maodie/favicon-16x16.png';
      manifest.href = '/favicon_maodie/site.webmanifest';
    } else {
      appleTouchIcon.href = '/favicon_yinhe/apple-touch-icon.png';
      icon32x32.href = '/favicon_yinhe/favicon-32x32.png';
      icon16x16.href = '/favicon_yinhe/favicon-16x16.png';
      manifest.href = '/favicon_yinhe/site.webmanifest';
    }
  }, [kimiMode]);

  const antdTheme = {
    algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: colors.primary,
      borderRadius: 8,
      colorBgContainer: colors.surface,
      colorBgElevated: colors.elevated,
      colorBgLayout: colors.background,
      colorBgBase: colors.background,
      colorText: colors.text,
      colorTextSecondary: colors.textSecondary,
      colorTextTertiary: colors.textTertiary,
      colorBorder: colors.border,
      colorBorderSecondary: colors.borderSecondary,
      colorFill: colors.fill,
      colorFillSecondary: colors.fillSecondary,
      colorFillTertiary: colors.fillTertiary,
      colorFillQuaternary: colors.fillQuaternary,
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
        colorBgContainer: colors.surface,
        colorText: colors.text,
        colorTextSecondary: colors.textSecondary,
        colorIcon: colors.text,
        colorIconHover: colors.primary,
        subMenuItemBorderRadius: 8,
        itemMarginBlock: 4,
        itemMarginInline: 8,
        itemPaddingInline: 12,
      },
      Input: {
        colorBgContainer: colors.elevated,
        colorBorder: colors.border,
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

  const copilotKitStyle: CopilotKitCSSProperties = {
    '--copilot-kit-primary-color': colors.primary,
    '--copilot-kit-contrast-color': '#FFFFFF',
    '--copilot-kit-background-color': colors.surface,
    '--copilot-kit-secondary-color': colors.elevated,
    '--copilot-kit-secondary-contrast-color': colors.text,
    '--copilot-kit-separator-color': colors.border,
    '--copilot-kit-muted-color': colors.textDisabled,
  };

  useCopilotReadable({
    description: 'The current theme of the application.',
    value: currentTheme,
  });

  useCopilotReadable({
    description: 'Whether Kimi (cat) mode is enabled.',
    value: kimiMode,
  });

  useCopilotReadable({
    description: 'Whether performance monitoring is enabled.',
    value: performanceMonitoring,
  });

  useCopilotAction({
    name: 'setTheme',
    description: 'Set the theme of the application.',
    parameters: [
      {
        name: 'theme',
        type: 'string',
        description: 'The theme to set. Can be "light" or "dark".',
        enum: ['light', 'dark'],
        required: true,
      },
    ],
    handler: ({ theme }: { theme: 'light' | 'dark' }) => {
      setTheme(theme);
    },
  });

  useCopilotAction({
    name: 'toggleKimiMode',
    description: 'Toggle Kimi (cat) mode.',
    handler: () => {
      toggleKimiMode();
    },
  });

  useCopilotAction({
    name: 'togglePerformanceMonitoring',
    description: 'Toggle performance monitoring.',
    handler: () => {
      togglePerformanceMonitoring();
    },
  });

  return (
    <>
      <ConfigProvider theme={antdTheme}>
        <AntApp>
          <NotificationProvider>
            <HashRouter>
              <Router />
              {performanceMonitoring && <PerformanceMonitor />}
            </HashRouter>
          </NotificationProvider>
        </AntApp>
      </ConfigProvider>
      <div style={copilotKitStyle}>
        <CopilotSidebar className={currentTheme} aria-label="Copilot" />
      </div>
    </>
  );
};

export default MainContent;
