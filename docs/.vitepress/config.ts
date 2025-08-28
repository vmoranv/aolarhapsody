import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'ARDocs',
  description: 'A Doc Site For Aolarhapsody',
  head: [
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['link', { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' }],
    ['meta', { name: 'msapplication-TileColor', content: '#da532c' }],
    ['meta', { name: 'theme-color', content: '#ffffff' }],
  ],
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: [
          { text: '首页', link: '/' },
          { text: '基础', link: '/guide/quick-guide' },
          { text: '项目架构', link: '/guide/project/architecture' },
          { text: '项目部署', link: '/deployment/vercel' },
          { text: '社区支持', link: '/community/community' },
          { text: '奥拉', link: '/aola/packets' },
        ],
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Guide', link: '/en/guide/quick-guide' },
          { text: 'Architecture', link: '/en/guide/project/architecture' },
          { text: 'Deployment', link: '/en/deployment/vercel' },
          { text: 'Community', link: '/en/community/community' },
          { text: 'Aola', link: '/en/aola/packets' },
        ],
      },
    },
  },
  themeConfig: {
    logo: '/favicon.ico',
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                },
              },
            },
          },
          en: {
            translations: {
              button: {
                buttonText: 'Search',
                buttonAriaLabel: 'Search',
              },
              modal: {
                noResultsText: 'No results found',
                resetButtonTitle: 'Reset search',
                footer: {
                  selectText: 'to select',
                  navigateText: 'to navigate',
                },
              },
            },
          },
        },
      },
    },
    // https://vitepress.dev/reference/default-theme-config
    sidebar: {
      '/': [
        {
          text: '入门',
          items: [
            { text: '快速开始', link: '/guide/quick-guide' },
            { text: '项目特色', link: '/guide/features' },
          ],
        },
        {
          text: '基础',
          items: [
            { text: '开发', link: '/essentials/development' },
            { text: '构建', link: '/essentials/build' },
            { text: '配置', link: '/essentials/settings' },
            { text: '权限管理', link: '/essentials/access' },
            { text: '国际化', link: '/essentials/locale' },
            { text: '主题', link: '/essentials/theme' },
            { text: 'CLI 工具', link: '/essentials/cli' },
            { text: '组件介绍', link: '/essentials/components' },
          ],
        },
        {
          text: '项目架构',
          items: [
            { text: '概述', link: '/project/architecture' },
            { text: '目录结构', link: '/project/directory-structure' },
            { text: '模块设计', link: '/project/modular-design' },
            { text: '开发规范', link: '/project/development-specs' },
          ],
        },
        {
          text: '项目部署',
          items: [
            { text: 'Vercel 部署', link: '/deployment/vercel' },
            { text: 'Docker 部署', link: '/deployment/docker' },
            { text: 'Tauri 桌面应用', link: '/deployment/tauri' },
          ],
        },
        {
          text: '社区支持',
          items: [
            { text: '社区支持', link: '/community/community' },
            { text: '技术支持', link: '/community/technical-support' },
          ],
        },
        {
          text: '奥拉',
          items: [
            { text: '封包解析', link: '/aola/packets' },
            { text: '伤害计算', link: '/aola/damage' },
          ],
        },
        {
          text: '其他',
          items: [
            { text: '常见问题', link: '/other/faq' },
            { text: '贡献指南', link: '/other/contribution' },
            { text: '赞助', link: '/community/sponsor' },
          ],
        },
      ],
      '/en/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Quick Start', link: '/en/guide/quick-guide' },
            { text: 'Features', link: '/en/guide/features' },
          ],
        },
        {
          text: 'Basics',
          items: [
            { text: 'Development', link: '/en/essentials/development' },
            { text: 'Build', link: '/en/essentials/build' },
            { text: 'Configuration', link: '/en/essentials/settings' },
            { text: 'Access Control', link: '/en/essentials/access' },
            { text: 'Internationalization', link: '/en/essentials/locale' },
            { text: 'Theming', link: '/en/essentials/theme' },
            { text: 'CLI Tools', link: '/en/essentials/cli' },
            { text: 'Components', link: '/en/essentials/components' },
          ],
        },
        {
          text: 'Architecture',
          items: [
            { text: 'Overview', link: '/en/project/architecture' },
            { text: 'Directory Structure', link: '/en/project/directory-structure' },
            { text: 'Modular Design', link: '/en/project/modular-design' },
            { text: 'Development Specifications', link: '/en/project/development-specs' },
          ],
        },
        {
          text: 'Deployment',
          items: [
            { text: 'Vercel Deployment', link: '/en/deployment/vercel' },
            { text: 'Docker Deployment', link: '/en/deployment/docker' },
            { text: 'Tauri Desktop App', link: '/en/deployment/tauri' },
          ],
        },
        {
          text: 'Community',
          items: [
            { text: 'Community Support', link: '/en/community/community' },
            { text: 'Technical Support', link: '/en/community/technical-support' },
          ],
        },
        {
          text: 'Aola',
          items: [
            { text: 'Packet Parsing', link: '/en/aola/packets' },
            { text: 'Damage Calculation', link: '/en/aola/damage' },
          ],
        },
        {
          text: 'Others',
          items: [
            { text: 'FAQ', link: '/en/other/faq' },
            { text: 'Contribution', link: '/en/other/contribution' },
            { text: 'Sponsorship', link: '/en/community/sponsor' },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/vmoranv/aolarhapsody' }],
  },
});
