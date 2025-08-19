# 项目架构

::: info 本文档介绍了 Aolarhapsody 的项目架构设计

- 基于 pnpm workspaces 的 monorepo 架构
- 前后端分离设计模式
- 容器化部署支持
  :::

Aolarhapsody 是一个基于 [pnpm workspace](https://pnpm.io/workspaces) 的 monorepo 项目，采用现代化的全栈技术架构，实现了前后端分离的设计模式。

## 整体架构

项目采用典型的前后端分离架构，基于 pnpm workspaces 实现 monorepo 管理模式，整体架构如下：

```
┌─────────────────────────────────────────────────────────────┐
│                    Aolarhapsody Monorepo                    │
├─────────────────────────────────────────────────────────────┤
│                      Frontend (React)                       │
├─────────────────────────────────────────────────────────────┤
│                      Backend (Node.js)                      │
├─────────────────────────────────────────────────────────────┤
│                    数据源 (游戏数据文件)                     │
└─────────────────────────────────────────────────────────────┘
```

## 技术栈

### 前端技术栈

- **核心框架**: [React 18+](https://reactjs.org/)
- **语言**: [TypeScript 5+](https://www.typescriptlang.org/)
- **构建工具**: [Vite](https://vitejs.dev/)
- **状态管理**: [Zustand](https://github.com/pmndrs/zustand)
- **UI 组件库**: [Ant Design](https://ant.design/)
- **路由管理**: [React Router v6+](https://reactrouter.com/)
- **样式处理**: [Tailwind CSS](https://tailwindcss.com/)
- **国际化**: [i18next](https://www.i18next.com/)
- **HTTP 客户端**: [Axios](https://axios-http.com/)
- **数据获取**: [React Query](https://tanstack.com/query/latest)

### 后端技术栈

- **运行环境**: [Node.js 20+](https://nodejs.org/)
- **语言**: [TypeScript 5+](https://www.typescriptlang.org/)
- **Web 框架**: [Express 5+](https://expressjs.com/)
- **数据解析**: [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js)
- **CORS 支持**: [cors](https://github.com/expressjs/cors)
- **环境配置**: [dotenv](https://github.com/motdotla/dotenv)

### 开发工具链

- **包管理器**: [pnpm 10.13.1+](https://pnpm.io/)
- **代码检查**: [ESLint](https://eslint.org/), [Stylelint](https://stylelint.io/)
- **代码格式化**: [Prettier](https://prettier.io/)
- **拼写检查**: [CSpell](https://cspell.org/)
- **提交规范**: [Commitlint](https://commitlint.js.org/)
- **Git Hooks**: [Lefthook](https://github.com/evilmartians/lefthook)
- **文档工具**: [VitePress](https://vitepress.dev/)
- **内部工具**: ash, turbo-run

## 目录结构

目录使用 Monorepo 管理，项目结构如下：

```bash
.
├── backend/                    # 后端服务
│   ├── dataparse/              # 数据解析模块
│   │   ├── astralspirit.ts     # 星神解析器
│   │   ├── chatframe.ts        # 聊天框解析器
│   │   ├── clothes.ts          # 服装解析器
│   │   └── ...                 # 其他数据解析器
│   ├── routes/                 # API路由
│   ├── types/                  # TypeScript类型定义
│   ├── index.ts                # 后端入口文件
│   ├── package.json            # 后端依赖配置
│   └── tsconfig.json           # TypeScript配置
├── frontend/                   # 前端应用
│   ├── src/                    # 前端源码
│   │   ├── components/         # 公共组件
│   │   ├── contexts/           # React上下文
│   │   ├── hooks/              # 自定义Hooks
│   │   ├── locales/            # 国际化资源
│   │   ├── router/             # 路由配置
│   │   ├── store/              # 状态管理
│   │   ├── theme/              # 主题配置
│   │   ├── types/              # TypeScript类型定义
│   │   ├── utils/              # 工具函数
│   │   ├── views/              # 页面组件
│   │   ├── App.tsx             # 根组件
│   │   ├── main.tsx            # 前端入口文件
│   │   └── ...
│   ├── index.html              # HTML模板
│   ├── package.json            # 前端依赖配置
│   └── vite.config.ts          # Vite配置
├── scripts/                    # 内部 CLI 工具和脚本
│   ├── ash/                    # 辅助脚本集合 (ash)
│   ├── turbo-run/              # 交互式脚本运行器 (ar-turbo)
│   ├── deploy/                 # 部署相关脚本和配置
│   └── ...
├── docs/                       # 项目文档
├── README.md                   # 项目说明文档
├── package.json                # 项目依赖配置
└── pnpm-workspace.yaml         # pnpm工作区配置
```

## 模块划分

### 1. 前端模块 (frontend/)

前端模块是用户直接交互的界面，负责数据展示和用户操作。

主要功能包括：

- 数据可视化展示
- 用户交互处理
- 主题切换支持
- 国际化支持
- 响应式设计

目录结构：

```
frontend/
├── src/
│   ├── components/     # 公共组件
│   ├── views/          # 页面视图
│   ├── hooks/          # 自定义 Hooks
│   ├── store/          # 状态管理
│   ├── utils/          # 工具函数
│   ├── router/         # 路由配置
│   ├── theme/          # 主题配置
│   └── locales/        # 国际化资源
├── public/             # 静态资源
└── package.json        # 前端依赖配置
```

### 2. 后端模块 (backend/)

后端模块负责数据处理和 API 服务提供，是整个应用的数据中枢。

主要功能包括：

- 游戏数据解析
- RESTful API 提供
- 数据处理和转换
- 跨域支持

目录结构：

```
backend/
├── dataparse/          # 数据解析模块
├── routes/             # API 路由
├── types/              # TypeScript 类型定义
├── index.ts            # 应用入口
├── Dockerfile          # Docker 配置
└── package.json        # 后端依赖配置
```

### 3. 脚本工具模块 (scripts/)

脚本工具模块包含项目开发和部署所需的各类工具。

目录结构：

```
scripts/
├── ash/                # 辅助脚本工具
├── turbo-run/          # 交互式脚本运行器
├── deploy/             # 部署相关脚本
└── clean.mjs           # 清理脚本
```

## 数据流设计

### 前后端交互

前端通过 HTTP 请求与后端进行通信，采用 RESTful API 设计规范：

```
┌──────────┐      HTTP      ┌──────────┐
│ Frontend │ ────────────→ │ Backend  │
│ (React)  │ ←──────────── │ (Node.js)│
└──────────┘   JSON Data   └──────────┘
```

### 数据处理流程

1. 原始游戏数据文件（XML 格式）
2. 后端数据解析模块处理
3. 转换为结构化数据存储在内存中
4. 通过 RESTful API 提供给前端
5. 前端接收数据并进行展示

## 部署架构

### 开发环境

在开发环境中，前后端可以独立运行：

```
┌─────────────────┐    ┌─────────────────┐
│  Frontend Dev   │    │  Backend Dev    │
│    Server       │    │    Server       │
│   (Vite 5173)   │    │  (Express 3000) │
└─────────────────┘    └─────────────────┘
```

### 生产环境

在生产环境中，采用 Docker 容器化部署：

```
┌──────────────────────────────────────────────┐
│              负载均衡器/反向代理              │
│              (Nginx/Cloudflare)              │
├──────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────────────┐  │
│  │  Frontend   │    │      Backend        │  │
│  │   (Static   │    │   (Dockerized)      │  │
│  │    Files)   │    │ vmoranv/aolar-      │  │
│  │             │    │      backend        │  │
│  └─────────────┘    └─────────────────────┘  │
└──────────────────────────────────────────────┘
```

## 架构优势

1. **模块化设计**: 前后端分离，职责明确，便于独立开发和维护
2. **Monorepo 管理**: 使用 pnpm workspaces 统一管理依赖和版本
3. **TypeScript 全栈**: 前后端均使用 TypeScript，提供完整的类型安全
4. **容器化部署**: 支持 Docker 部署，便于扩展和运维
5. **开发效率**: 集成丰富的开发工具链，提升开发体验
6. **国际化支持**: 内置多语言支持，便于全球化部署

## 扩展性考虑

项目架构设计时充分考虑了扩展性：

1. **微服务准备**: 当业务复杂度增加时，可以将后端模块拆分为独立的微服务
2. **多端支持**: 前端架构支持扩展到移动端或其他平台
3. **插件化设计**: 数据解析模块采用插件化设计，便于添加新的数据类型支持
