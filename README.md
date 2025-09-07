# Aolarhapsody Monorepo

> Aolarhapsody 项目的官方 monorepo，包含前端、后端和内部工具链。

[English](./README.en.md) | 简体中文

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/pnpm-v10.13.1-orange" alt="pnpm version">
  <img src="https://img.shields.io/badge/TypeScript-^5.0.0-blue" alt="TypeScript version">
  <img src="https://img.shields.io/badge/React-^18.0.0-cyan" alt="React version">
  <img src="https://img.shields.io/badge/Node.js-^20.0.0-green" alt="Node.js version">
</p>

## 📖 项目简介

本项目是一个基于 pnpm workspace 的 monorepo，用于管理 Aolarhapsody 的所有代码。它整合了现代化的前端和后端技术，并配备了一套强大的、受 `vben` 启发的内部脚本工具，以确保代码质量和开发效率。

## ✨ 技术栈

- **前端**: `React`, `TypeScript`, `Vite`
- **后端**: `Express`
- **桌面应用**: `Tauri`
- **包管理器**: `pnpm`
- **代码质量**: `ESLint`, `Prettier`, `Stylelint`, `Commitlint`, `Cspell`
- **Git Hooks**: `lefthook`
- **内部工具**: 使用 `cac`, `@clack/prompts`, `unbuild` 构建的自定义 CLI 工具。

## 📂 项目结构

```
.
├── backend/         # 后端服务
├── frontend/        # 前端应用
│   └── src-tauri/   # Tauri 桌面应用源码
├── scripts/         # 内部 CLI 工具和脚本
│   ├── ash/         # 辅助脚本集合 (ash)
│   ├── turbo-run/   # 交互式脚本运行器 (ar-turbo)
│   └── deploy/      # 部署相关脚本和配置
├── package.json
└── pnpm-workspace.yaml
```

## 🚀 快速开始

1.  **克隆项目**

    ```bash
    git clone https://github.com/vmoranv/aolarhapsody.git
    cd aolarhapsody
    ```

2.  **安装依赖**

    > 本项目强制使用 pnpm 作为包管理器。

    ```bash
    pnpm install
    ```

3.  **启动开发环境**

    ```bash
    # 启动所有服务的开发模式
    pnpm dev

    # 或单独启动前端
    pnpm dev:front

    # 或单独启动后端
    pnpm dev:backend
    ```

## 🛠️ 可用脚本

### 开发和构建

- `pnpm dev`: 启动所有包的开发模式。
- `pnpm build`: 构建所有包。
- `pnpm check`: 运行所有的代码检查（linting, cspell）。
- `pnpm format`: 格式化所有代码。
- `pnpm clean`: 清理所有构建产物和 `node_modules`。

### Tauri 桌面应用构建

- `pnpm build:tauri`: 构建当前平台的 Tauri 桌面应用。
- `pnpm build:tauri:multi`: 根据当前系统自动选择适合的平台进行构建。
- `pnpm build:tauri:all`: 尝试构建所有4种平台（Apple Silicon macOS、Intel macOS、Windows、Linux）。

## 部署

### 使用 Docker 部署后端服务

本项目支持使用 Docker 对后端服务进行容器化部署。

1.  **构建 Docker 镜像**

    使用以下命令来构建后端服务的 Docker 镜像。该命令会利用 `backend/Dockerfile` 文件。

    ```bash
    pnpm build:docker:backend
    ```

    构建成功后，你可以使用 `docker images` 查看名为 `aolarhapsody-backend` 的镜像。

2.  **运行 Docker 容器**

    使用以下命令来启动容器：

    ```bash
    docker run -d -p 3000:3000 --name aolarhapsody-backend-container aolarhapsody-backend
    ```

    - `-d`: 在后台运行容器。
    - `-p 3000:3000`: 将主机的 3000 端口映射到容器的 3000 端口。
    - `--name`: 为容器指定一个名称。

    服务启动后，可以通过 `http://localhost:3000` 访问。

## 📄 许可证

本项目采用 [LICENSE](./LICENSE) 许可证。
