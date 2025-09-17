# 开发

::: tip 提示

项目使用 pnpm workspace 管理 monorepo，通过统一的命令进行开发。

:::

## 环境准备

在开始开发前，请确保安装了以下工具：

- **Node.js**: v20 或更高版本
- **pnpm**: v10.13.1 或更高版本
- **Git**: 版本管理工具
- **VS Code**: 推荐的编辑器（可选）

## 环境变量配置

项目使用环境变量来配置各种设置，特别是后端的CORS配置。

### 后端环境变量

在 `backend/.env` 文件中配置以下变量：

```env
# 后端服务端口
PORT=3000

# 允许访问的前端域名（多个域名用逗号分隔）
FRONTEND_URLS=https://aolarhapsody.614447.xyz,http://localhost:3000,http://localhost:5173
```

#### 环境变量说明

- **PORT**: 后端服务监听的端口号，默认为 3000
- **FRONTEND_URLS**: **必需配置**，指定允许访问后端API的前端域名列表。多个域名用逗号分隔，不支持通配符。

#### 配置示例

```env
# 生产环境配置
FRONTEND_URLS=https://aolarhapsody.614447.xyz

# 开发环境配置（支持本地开发）
FRONTEND_URLS=http://localhost:3000,http://localhost:5173,https://aolarhapsody.614447.xyz

# 多个前端应用配置
FRONTEND_URLS=https://app1.example.com,https://app2.example.com,http://localhost:3000
```

::: warning 注意

- `FRONTEND_URLS` 是必需的环境变量，如果未配置，将没有任何前端域名能够访问后端API
- 域名必须包含协议（http:// 或 https://）
- 不支持通配符域名（如 \*.example.com）
- 配置修改后需要重启后端服务才能生效
  :::

### 环境变量文件

项目提供了环境变量示例文件：

- `backend/.env`: 实际使用的环境变量配置（不要提交到版本控制）
- `backend/.env.example`: 环境变量示例文件（可以作为配置参考）

首次设置项目时，请复制 `.env.example` 为 `.env` 并根据实际需求修改配置：

```bash
# 复制环境变量示例文件
cp backend/.env.example backend/.env

# 编辑环境变量配置
vim backend/.env
```

## 项目启动

### 安装依赖

```bash
# 安装项目依赖
pnpm install
```

### 启动开发服务

```bash
# 启动所有服务
pnpm dev

# 仅启动前端开发服务
pnpm dev:front

# 仅启动后端开发服务
pnpm dev:backend
```

## 常用命令

项目提供了丰富的命令来辅助开发：

```json
{
  "scripts": {
    // 构建项目
    "build": "pnpm --filter @aolarhapsody/turbo-run build && cross-env NODE_OPTIONS=--max-old-space-size=8192 ar-turbo build",
    // 构建所有包
    "build:all": "pnpm --parallel --filter \"./**\" build",
    // 构建前端
    "build:front": "pnpm --filter frontend build",
    // 构建后端
    "build:backend": "pnpm --filter backend build",
    // 构建 Docker 镜像
    "build:docker": "bash ./scripts/deploy/build-local-docker-image.sh",
    // 构建后端 Docker 镜像
    "build:docker:backend": "docker build -t aolarhapsody-backend -f backend/Dockerfile .",
    // 构建 Tauri 桌面应用
    "build:tauri": "pnpm --filter frontend exec tauri build",
    // 预览构建结果
    "preview": "pnpm build:all && pnpm --parallel --filter \"./**\" preview",
    // 预览前端
    "preview:front": "pnpm --filter frontend build && pnpm --filter frontend preview",
    // 预览后端
    "preview:backend": "pnpm --filter backend build && pnpm --filter backend preview",
    // 代码检查
    "check": "ash lint && pnpm lint:cspell",
    // 清理项目
    "clean": "node ./scripts/clean.mjs",
    // 提交代码
    "commit": "czg",
    // 启动开发服务
    "dev": "concurrently -k \"pnpm:dev:backend\" \"node scripts/wait-for-backend.mjs\"",
    // 启动前端开发服务
    "dev:front": "pnpm --filter frontend dev",
    // 启动后端开发服务
    "dev:backend": "pnpm --filter backend dev",
    // 格式化代码
    "format": "ash lint --format",
    // 代码检查
    "lint": "ash lint",
    // 拼写检查
    "lint:cspell": "cspell lint \"**/*.ts\" \"**/README.md\" \".changeset/*.md\" --no-progress",
    // 包规范检查
    "lint:publint": "ash publint",
    // 安装 Git Hooks
    "postinstall": "lefthook install",
    // 限制只使用 pnpm
    "preinstall": "npx only-allow pnpm",
    // 重新安装依赖
    "reinstall": "pnpm clean --del-lock && pnpm install"
  }
}
```

## 开发流程

### 创建新功能

1. 创建功能分支：

```bash
git checkout -b feature/new-feature
```

2. 开发功能代码

3. 运行测试确保功能正常：

```bash
pnpm dev
```

4. 提交代码：

```bash
git add .
git commit -m "feat: add new feature"
```

### 代码规范

项目使用以下工具保证代码质量：

- **ESLint**: JavaScript/TypeScript 代码检查
- **Prettier**: 代码格式化
- **Stylelint**: CSS 代码检查
- **Commitlint**: Git 提交信息检查

### 代码格式化

```bash
# 格式化所有代码
pnpm format
```

### 代码检查

```bash
# 运行所有检查
pnpm check

# 运行拼写检查
pnpm lint:cspell

# 运行包规范检查
pnpm lint:publint
```

## 调试

### 前端调试

前端使用 Vite 开发服务器，支持热更新和源码映射，可以直接在浏览器中调试。

### 后端调试

后端支持 Node.js 调试，可以通过以下方式启动调试模式：

```bash
# 使用 inspect 模式启动后端
node --inspect backend/dist/index.js
```

然后在 Chrome 浏览器中访问 `chrome://inspect` 进行调试。

## 问题解决

### 依赖问题

如果遇到依赖相关问题，可以尝试重新安装依赖：

```bash
# 清理并重新安装依赖
pnpm reinstall
```

### 构建失败

如果构建失败，可以尝试清理项目后重新构建：

```bash
# 清理项目
pnpm clean

# 重新安装依赖
pnpm install

# 重新构建
pnpm build
```
