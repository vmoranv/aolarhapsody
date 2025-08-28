# 快速开始

欢迎使用 Aolarhapsody！这是一个基于 pnpm workspace 的 monorepo 项目，整合了现代化的前端和后端技术栈。

## 项目概述

Aolarhapsody 是一个功能丰富的全栈项目，包含以下主要组件：

- **前端**: 基于 React、TypeScript 和 Vite 构建的现代化用户界面
- **后端**: 使用 Node.js、Express 和 TypeScript 构建的 RESTful API 服务
- **内部工具**: 包括代码检查、格式化和部署脚本等辅助工具

## 环境准备

在开始之前，请确保您的开发环境满足以下要求：

- **Node.js**: v20 或更高版本
- **pnpm**: v10.13.1 或更高版本（本项目强制使用 pnpm 作为包管理器）
- **Docker**: （可选）用于容器化部署

## 安装步骤

### 1. 克隆项目

```bash
git clone https://github.com/vmoranv/aolarhapsody.git
cd aolarhapsody
```

### 2. 安装依赖

```bash
pnpm install
```

> 注意：本项目强制使用 pnpm 作为包管理器，使用 npm 或 yarn 可能导致依赖问题。

## 开发模式

### 启动所有服务

```bash
pnpm dev
```

这将同时启动前端和后端服务：

- 前端将在 `http://localhost:5173` 上运行
- 后端将在 `http://localhost:3000` 上运行

### 单独启动服务

如果您只想启动特定的服务，可以使用以下命令：

```bash
# 仅启动前端
pnpm dev:front

# 仅启动后端
pnpm dev:backend
```

## 构建项目

要为生产环境构建项目，运行：

```bash
pnpm build
```

这将构建前端和后端的所有代码。

您也可以单独构建各个部分：

```bash
# 仅构建前端
pnpm build:front

# 仅构建后端
pnpm build:backend
```

## 部署

### Docker 部署（推荐）

本项目支持使用 Docker 进行容器化部署，您可以选择从 DockerHub 拉取预构建的镜像或者自己构建。

#### 选项1：使用 DockerHub 预构建镜像（推荐）

从 DockerHub 拉取并运行后端服务：

```bash
docker run -d -p 3000:3000 --name aolarhapsody-backend vmoranv/aolarhapsody-backend
```

#### 选项2：自己构建 Docker 镜像

如果您需要自定义构建镜像，可以使用以下命令：

```bash
pnpm build:docker:backend
```

然后运行容器：

```bash
docker run -d -p 3000:3000 --name aolarhapsody-backend-container aolarhapsody-backend
```

服务启动后，您可以通过 `http://localhost:3000` 访问后端 API。

## 项目结构

```
.
├── backend/         # 后端服务
├── frontend/        # 前端应用
├── scripts/         # 内部 CLI 工具和脚本
├── docs/            # 项目文档
└── package.json     # 项目配置文件
```

## 常用命令

| 命令               | 描述                            |
| ------------------ | ------------------------------- |
| `pnpm dev`         | 启动所有服务的开发模式          |
| `pnpm dev:front`   | 启动前端开发服务                |
| `pnpm dev:backend` | 启动后端开发服务                |
| `pnpm build`       | 构建所有包                      |
| `pnpm check`       | 运行所有的代码检查              |
| `pnpm format`      | 格式化所有代码                  |
| `pnpm clean`       | 清理所有构建产物和 node_modules |

## 访问应用

- 前端界面: `http://localhost:5173`
- 后端 API: `http://localhost:3000`

## 故障排除

1. **端口冲突**: 如果 3000 或 5173 端口已被占用，后端服务会自动尝试使用下一个可用端口。

2. **依赖安装问题**: 确保使用 pnpm 安装依赖，不要使用 npm 或 yarn。

3. **构建失败**: 尝试清理项目并重新安装依赖：
   ```bash
   pnpm clean
   pnpm install
   ```

现在您已经了解了如何设置和运行 Aolarhapsody 项目，可以开始开发您的功能了！
