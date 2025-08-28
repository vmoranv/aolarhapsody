# 目录说明

目录使用 Monorepo 管理，项目结构如下：

```bash
.
├── backend/                    # 后端服务
│   ├── dataparse/              # 数据解析模块
│   ├── routes/                 # API路由
│   ├── types/                  # TypeScript类型定义
│   ├── scripts/                # 后端构建脚本
│   └── ...
├── frontend/                   # 前端应用
│   ├── public/                 # 静态资源文件
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
│   │   └── ...
│   ├── src-tauri/              # Tauri桌面应用配置
│   └── ...
├── scripts/                    # 内部 CLI 工具和脚本
│   ├── ash/                    # 辅助脚本集合 (ash)
│   ├── turbo-run/              # 交互式脚本运行器 (ar-turbo)
│   ├── deploy/                 # 部署相关脚本和配置
│   └── ...
├── docs/                       # 项目文档
├── .github/                    # GitHub相关配置
└── ...
```

## backend（后端服务）

后端服务基于 Node.js 和 Express 构建，主要负责数据解析和 API 提供。

- **dataparse/**：包含各种游戏数据的解析器，每个文件负责解析特定类型的数据
- **routes/**：定义 RESTful API 路由，将数据解析结果通过 HTTP 接口提供
- **types/**：TypeScript 类型定义，确保前后端数据交互的一致性
- **scripts/**：后端构建和开发相关脚本

## frontend（前端应用）

前端应用基于 React 和 Vite 构建，提供用户界面和交互体验。

- **public/**：存放静态资源文件，如图标、图片等
- **src/**：前端源代码目录
  - **components/**：公共组件，可复用的 UI 组件
  - **contexts/**：React 上下文，用于全局状态管理
  - **hooks/**：自定义 Hooks，封装可复用的逻辑
  - **locales/**：国际化资源，包含各种语言的翻译文件
  - **router/**：路由配置，定义应用的路由结构
  - **store/**：状态管理，使用 Zustand 管理应用状态
  - **theme/**：主题配置，包含颜色、样式等主题相关设置
  - **types/**：TypeScript 类型定义，确保类型安全
  - **utils/**：工具函数，包含各种通用工具方法
  - **views/**：页面组件，构成应用各个页面的主要内容
- **src-tauri/**：Tauri桌面应用配置，用于构建桌面版本
  - **capabilities/**：Tauri应用权限配置
  - **icons/**：应用图标资源，包含各种尺寸和平台的图标文件
  - **src/**：Rust源代码目录
    - **main.rs**：Tauri应用入口文件
    - **lib.rs**：Tauri应用库文件，包含应用的主要逻辑
  - **tauri.conf.json**：Tauri应用配置文件，定义应用的基本信息、窗口设置、打包配置等
  - **Cargo.toml**：Rust项目配置文件，定义项目依赖和元数据
  - **build.rs**：Rust构建脚本

## scripts（内部工具）

包含项目开发和部署所需的内部工具。

- **ash/**：辅助脚本集合，提供各种便捷命令
- **turbo-run/**：交互式脚本运行器，简化命令执行
- **deploy/**：部署相关脚本和配置文件

## 其他重要文件和目录

- **docs/**：项目文档，包含使用说明、开发指南等
- **.github/**：GitHub Actions 和其他 GitHub 相关配置
- **.vscode/**：VSCode 编辑器配置，包括推荐插件、调试配置等
- **pnpm-workspace.yaml**：pnpm 工作区配置文件，定义了项目中的各个包
- **turbo.json**：TurboRepo 构建工具配置文件，用于优化构建过程
