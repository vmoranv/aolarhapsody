import { useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import { CopilotKitCSSProperties, CopilotSidebar } from '@copilotkit/react-ui';
import { App as AntApp, ConfigProvider, theme } from 'antd';
import { NotificationProvider } from '../contexts/NotificationContext';
import { useTheme } from '../hooks/useTheme';
import Router from '../router';
import { useSettingStore } from '../store/setting';
import PerformanceMonitor from './PerformanceMonitor';

/**
 * @description 主内容组件，是整个应用的根组件。
 * 它负责：
 * 1. 提供Ant Design的主题配置（亮色/暗色）。
 * 2. 集成CopilotKit，提供AI助手功能。
 * 3. 根据设置动态切换网站的favicon。
 * 4. 提供全局通知功能。
 * 5. 包含应用的路由。
 * 6. 可选地显示性能监控组件。
 * @returns {React.ReactElement} - 渲染的主内容组件
 */
const MainContent = () => {
  // 从自定义hook useTheme中获取当前主题、设置主题的函数以及颜色配置
  const { theme: currentTheme, setTheme, colors } = useTheme()!;
  // 从Zustand store useSettingStore中获取性能监控状态、Kimi模式状态以及切换它们的函数
  const { performanceMonitoring, kimiMode, toggleKimiMode, togglePerformanceMonitoring } =
    useSettingStore();

  // 使用useEffect来处理副作用，这里是根据kimiMode动态更改网站的favicon
  useEffect(() => {
    // 获取DOM中的favicon链接元素
    const appleTouchIcon = document.getElementById('apple-touch-icon') as HTMLLinkElement;
    const icon32x32 = document.getElementById('icon-32x32') as HTMLLinkElement;
    const icon16x16 = document.getElementById('icon-16x16') as HTMLLinkElement;
    const manifest = document.getElementById('manifest') as HTMLLinkElement;

    // 根据kimiMode的值，切换不同的favicon图标集
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
  }, [kimiMode]); // 这个effect依赖于kimiMode，当kimiMode改变时会重新运行

  // Ant Design的主题配置对象
  const antdTheme = {
    // 根据当前主题（'dark'或'light'）选择Ant Design的主题算法
    algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    // 自定义token，用于覆盖Ant Design的默认样式
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
    // 针对特定组件的样式覆盖
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
        itemSelectedBg: colors.primary + '20', // 主题色20%透明度
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

  // CopilotKit的样式配置对象，使其与应用主题保持一致
  const copilotKitStyle: CopilotKitCSSProperties = {
    '--copilot-kit-primary-color': colors.primary,
    '--copilot-kit-contrast-color': '#FFFFFF',
    '--copilot-kit-background-color': colors.surface,
    '--copilot-kit-secondary-color': colors.elevated,
    '--copilot-kit-secondary-contrast-color': colors.text,
    '--copilot-kit-separator-color': colors.border,
    '--copilot-kit-muted-color': colors.textDisabled,
  };

  // 使用useCopilotReadable使Copilot能够读取应用的当前主题
  useCopilotReadable({
    description: 'The current theme of the application.',
    value: currentTheme,
  });

  // 使用useCopilotReadable使Copilot能够读取Kimi模式的状态
  useCopilotReadable({
    description: 'Whether Kimi (cat) mode is enabled.',
    value: kimiMode,
  });

  // 使用useCopilotReadable使Copilot能够读取性能监控的状态
  useCopilotReadable({
    description: 'Whether performance monitoring is enabled.',
    value: performanceMonitoring,
  });

  // 使用useCopilotAction定义一个Copilot可以执行的动作：设置主题
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

  // 使用useCopilotAction定义一个Copilot可以执行的动作：切换Kimi模式
  useCopilotAction({
    name: 'toggleKimiMode',
    description: 'Toggle Kimi (cat) mode.',
    handler: () => {
      toggleKimiMode();
    },
  });

  // 使用useCopilotAction定义一个Copilot可以执行的动作：切换性能监控
  useCopilotAction({
    name: 'togglePerformanceMonitoring',
    description: 'Toggle performance monitoring.',
    handler: () => {
      togglePerformanceMonitoring();
    },
  });

  // 渲染组件
  return (
    <>
      {/* 使用Ant Design的ConfigProvider来应用自定义主题 */}
      <ConfigProvider theme={antdTheme}>
        {/* AntApp组件用于全局的message, notification等 */}
        <AntApp>
          {/* 通知提供者 */}
          <NotificationProvider>
            {/* 使用HashRouter作为路由容器 */}
            <HashRouter>
              {/* 渲染路由 */}
              <Router />
              {/* 如果性能监控开启，则渲染性能监控组件 */}
              {performanceMonitoring && <PerformanceMonitor />}
            </HashRouter>
          </NotificationProvider>
        </AntApp>
      </ConfigProvider>
      {/* CopilotKit的侧边栏，应用自定义样式 */}
      <div style={copilotKitStyle}>
        <CopilotSidebar className={currentTheme} aria-label="Copilot" />
      </div>
    </>
  );
};

export default MainContent;
