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
          { text: '项目介绍', link: '/guide/introduction' },
          { text: '项目架构', link: '/architecture/overview' },
          { text: '项目部署', link: '/deployment/vercel' },
          { text: 'my封包', link: '/packets/list' },
          { text: '数值计算', link: '/calculation/damage' },
          { text: '社区支持', link: '/community/contributing' },
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
          { text: 'Guide', link: '/en/guide/introduction' },
          { text: 'Architecture', link: '/en/architecture/overview' },
          { text: 'Deployment', link: '/en/deployment/vercel' },
          { text: 'Packets', link: '/en/packets/list' },
          { text: 'Calculation', link: '/en/calculation/damage' },
          { text: 'Community', link: '/en/community/contributing' },
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
          text: '项目介绍',
          items: [{ text: '简介', link: '/guide/introduction' }],
        },
        {
          text: '项目架构',
          items: [{ text: '概述', link: '/architecture/overview' }],
        },
        {
          text: '项目部署',
          items: [{ text: 'Vercel 部署', link: '/deployment/vercel' }],
        },
        {
          text: 'my封包',
          items: [{ text: '封包列表', link: '/packets/list' }],
        },
        {
          text: '数值计算',
          items: [{ text: '伤害计算', link: '/calculation/damage' }],
        },
        {
          text: '社区支持',
          items: [{ text: '贡献指南', link: '/community/contributing' }],
        },
      ],
      '/en/': [
        {
          text: 'Guide',
          items: [{ text: 'Introduction', link: '/en/guide/introduction' }],
        },
        {
          text: 'Architecture',
          items: [{ text: 'Overview', link: '/en/architecture/overview' }],
        },
        {
          text: 'Deployment',
          items: [{ text: 'Vercel Deployment', link: '/en/deployment/vercel' }],
        },
        {
          text: 'Packets',
          items: [{ text: 'Packet List', link: '/en/packets/list' }],
        },
        {
          text: 'Calculation',
          items: [{ text: 'Damage Calculation', link: '/en/calculation/damage' }],
        },
        {
          text: 'Community',
          items: [{ text: 'Contributing', link: '/en/community/contributing' }],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/vmoranv/aolarhapsody' }],
  },
});
