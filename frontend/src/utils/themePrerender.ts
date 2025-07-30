import { darkTheme, lightTheme, type ThemeColors } from '../theme/colors';

// 主题预渲染缓存
class ThemePrerender {
  private static instance: ThemePrerender;
  private prerenderedStyles = new Map<string, string>();
  private virtualDOM = new Map<string, DocumentFragment>();

  static getInstance(): ThemePrerender {
    if (!ThemePrerender.instance) {
      ThemePrerender.instance = new ThemePrerender();
    }
    return ThemePrerender.instance;
  }

  constructor() {
    this.precomputeThemeStyles();
  }

  // 预计算所有主题样式
  private precomputeThemeStyles() {
    const themes = { light: lightTheme, dark: darkTheme };

    Object.entries(themes).forEach(([themeName, themeColors]) => {
      // 预计算 CSS 变量字符串
      const cssVariables = Object.entries(themeColors)
        .map(([key, value]) => `--theme-${key}: ${value}`)
        .join('; ');

      this.prerenderedStyles.set(themeName, cssVariables);

      // 预计算关键样式
      this.precomputeCriticalStyles(themeName, themeColors);
    });

    console.log('🎨 主题样式预计算完成');
  }

  // 预计算关键样式（避免运行时计算）
  private precomputeCriticalStyles(themeName: string, colors: ThemeColors) {
    const criticalStyles = {
      body: `background: ${colors.background}; color: ${colors.text};`,
      card: `background: ${colors.surface}; border-color: ${colors.border};`,
      input: `background: ${colors.elevated}; border-color: ${colors.border}; color: ${colors.text};`,
      button: `background: ${colors.elevated}; border-color: ${colors.border}; color: ${colors.text};`,
    };

    this.prerenderedStyles.set(`${themeName}-critical`, JSON.stringify(criticalStyles));
  }

  // 获取预渲染的样式
  getPrerenderedStyle(theme: string): string {
    return this.prerenderedStyles.get(theme) || '';
  }

  // 获取关键样式
  getCriticalStyles(theme: string): any {
    const styles = this.prerenderedStyles.get(`${theme}-critical`);
    return styles ? JSON.parse(styles) : {};
  }

  // 预渲染虚拟 DOM 片段
  prerenderVirtualDOM(theme: string) {
    if (this.virtualDOM.has(theme)) {
      return this.virtualDOM.get(theme)!;
    }

    const fragment = document.createDocumentFragment();
    const colors = theme === 'dark' ? darkTheme : lightTheme;

    // 创建样式节点
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      :root { ${this.getPrerenderedStyle(theme)} }
      body { background: ${colors.background}; color: ${colors.text}; }
    `;

    fragment.appendChild(styleElement);
    this.virtualDOM.set(theme, fragment);

    return fragment;
  }

  // 快速应用预渲染样式 - 优化版本
  applyPrerenderedTheme(theme: string) {
    const startTime = performance.now();

    // 使用预计算的样式
    const cssVariables = this.getPrerenderedStyle(theme);

    // 使用更高效的批量更新方式
    this.fastBatchUpdate(theme, cssVariables, startTime);
  }

  // 零DOM操作的超高效更新方法
  private fastBatchUpdate(theme: string, _cssVariables: string, startTime: number) {
    // 使用同步更新，避免异步延迟
    const { documentElement: root, body } = document;

    // 缓存当前样式状态，避免重复计算
    const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';

    // 如果主题没有变化，直接返回
    if (currentTheme === theme) {
      console.log(`⚡ 主题未变化，跳过更新: ${(performance.now() - startTime).toFixed(2)}ms`);
      return;
    }

    // 预先计算所有需要的值
    const themeColors = theme === 'dark' ? darkTheme : lightTheme;

    // 使用 CSSStyleSheet.insertRule 进行批量样式更新（如果支持）
    if (document.adoptedStyleSheets !== undefined) {
      this.updateWithConstructableStylesheets(theme, themeColors, startTime);
    } else {
      // 回退到传统方法，但优化DOM操作
      this.updateWithTraditionalMethod(theme, themeColors, root, body, startTime);
    }
  }

  // 使用 Constructable Stylesheets 的现代方法
  private updateWithConstructableStylesheets(
    theme: string,
    themeColors: ThemeColors,
    startTime: number
  ) {
    try {
      // 创建或更新样式表
      let themeStyleSheet = (window as any).__themeStyleSheet;
      if (!themeStyleSheet) {
        themeStyleSheet = new CSSStyleSheet();
        (window as any).__themeStyleSheet = themeStyleSheet;
        document.adoptedStyleSheets = [...document.adoptedStyleSheets, themeStyleSheet];
      }

      // 清空并重新添加规则
      themeStyleSheet.replaceSync(`
        :root {
          ${Object.entries(themeColors)
            .map(([key, value]) => `--theme-${key}: ${value}`)
            .join(';\n          ')}
        }
        body {
          background: ${themeColors.background};
          color: ${themeColors.text};
        }
      `);

      // 更新 body 类名
      document.body.className =
        document.body.className.replace(/\b(light|dark)-theme\b/g, '').trim() + ` ${theme}-theme`;

      const duration = performance.now() - startTime;
      console.log(`⚡ 现代样式表更新完成: ${duration.toFixed(2)}ms`);
    } catch (error) {
      console.warn('现代样式表更新失败，回退到传统方法:', error);
      this.updateWithTraditionalMethod(
        theme,
        themeColors,
        document.documentElement,
        document.body,
        startTime
      );
    }
  }

  // 优化的传统方法
  private updateWithTraditionalMethod(
    theme: string,
    themeColors: ThemeColors,
    root: HTMLElement,
    body: HTMLElement,
    startTime: number
  ) {
    // 使用 requestAnimationFrame 确保在下一帧开始时更新
    requestAnimationFrame(() => {
      // 批量设置样式属性，减少重排次数
      const styleUpdates = Object.entries(themeColors);

      // 暂时禁用过渡效果，避免动画干扰
      root.style.transition = 'none';

      // 批量更新 CSS 变量
      styleUpdates.forEach(([key, value]) => {
        root.style.setProperty(`--theme-${key}`, value);
      });

      // 更新 body 类名
      body.className =
        body.className.replace(/\b(light|dark)-theme\b/g, '').trim() + ` ${theme}-theme`;

      // 强制重排，然后恢复过渡
      this.forceReflow(root);
      root.style.transition = '';

      const duration = performance.now() - startTime;
      console.log(`⚡ 传统方法更新完成: ${duration.toFixed(2)}ms`);
    });
  }

  // 预热方法 - 在应用启动时调用
  warmup() {
    console.log('🔥 开始主题系统预热...');

    // 预渲染两个主题的虚拟 DOM
    this.prerenderVirtualDOM('light');
    this.prerenderVirtualDOM('dark');

    // 预计算一些常用的样式组合
    const themes = ['light', 'dark'];
    themes.forEach((theme) => {
      this.getPrerenderedStyle(theme);
      this.getCriticalStyles(theme);
    });

    console.log('✅ 主题系统预热完成');
  }

  private forceReflow(element: HTMLElement) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    element.offsetHeight;
  }
}

export const themePrerender = ThemePrerender.getInstance();
