# 目录说明

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

## 各模块详细介绍

### backend（后端服务）

后端服务基于 Node.js 和 Express 构建，主要负责数据解析和 API 提供。

- **dataparse/**：包含各种游戏数据的解析器，每个文件负责解析特定类型的数据
- **routes/**：定义 RESTful API 路由，将数据解析结果通过 HTTP 接口提供
- **types/**：TypeScript 类型定义，确保前后端数据交互的一致性

### frontend（前端应用）

前端应用基于 React 和 Vite 构建，提供用户界面和交互体验。

- **components/**：可复用的 UI 组件
- **contexts/**：React Context，用于全局状态管理
- **hooks/**：自定义 React Hooks
- **locales/**：国际化资源文件
- **router/**：路由配置
- **store/**：使用 Zustand 的状态管理
- **theme/**：主题配置，包括颜色、暗色主题等
- **views/**：页面级组件
- **utils/**：工具函数

### scripts（内部工具）

包含项目开发和部署所需的内部工具。

- **ash/**：辅助脚本集合，提供各种便捷命令
- **turbo-run/**：交互式脚本运行器，简化命令执行
- **deploy/**：部署相关脚本和配置文件

这种目录结构设计使得项目模块清晰、易于维护和扩展。
