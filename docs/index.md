---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
sidebar: false

hero:
  name: AolaRhapsody
  text: 开源奥拉解析站
  tagline: 基于 React 和 Node.js 的全栈项目，提供现代化的奥拉星数据分析工具
  image:
    src: /yinhe.jpg
    alt: AolaRhapsody
  actions:
    - theme: brand
      text: 快速开始 ->
      link: /guide/quick-guide
    - theme: alt
      text: 在 GitHub 查看
      link: https://github.com/vmoranv/aolarhapsody
    - theme: alt
      text: 在线预览
      link: https://aolarhapsody.com

features:
  - icon: 🚀
    title: 全栈单体仓库
    details: Monorepository，使用 pnpm workspaces 管理，便于统一开发、构建和部署。
    link: /architecture/overview
    linkText: 架构文档
  - icon: 💡
    title: 现代化技术栈
    details: 采用 React, Vite, TypeScript, Zustand 等现代前端技术，以及 Node.js/Express 后端，提供高效的开发体验。
    link: /guide/introduction/tech-stack
    linkText: 技术栈
  - icon: 🧩
    title: 高度可扩展
    details: 模块化结构高内聚低耦合，可扩展性良好。
    link: /guide/project/modular-design
    linkText: 模块设计
  - icon: ☁️
    title: 多种部署方式
    details: 支持 Vercel、Docker、Tauri 等多种部署方案，适应不同场景需求。
    link: /deployment/vercel
    linkText: 部署文档
  - icon: 🎨
    title: 现代化 UI
    details: 使用 Ant Design 和 Tailwind CSS 构建美观、响应式的用户界面。
    link: /
    linkText: 在线预览
  - icon: 🤖
    title: AI 助手集成
    details: 集成 CopilotKit，提供智能交互式数据分析助手。
    link: /
    linkText: 功能预览
---
