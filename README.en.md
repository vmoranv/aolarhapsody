# Aolarhapsody Monorepo

> The official monorepo for the Aolarhapsody project, containing the frontend, backend, and internal toolchain.

[简体中文](./README.md) | English

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/pnpm-v10.13.1-orange" alt="pnpm version">
  <img src="https://img.shields.io/badge/TypeScript-^5.0.0-blue" alt="TypeScript version">
  <img src="https://img.shields.io/badge/React-^18.0.0-cyan" alt="React version">
  <img src="https://img.shields.io/badge/Node.js-^20.0.0-green" alt="Node.js version">
  <a href="https://deepwiki.com/vmoranv/aolarhapsody"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki"></a>
</p>

## 📖 Introduction

This project is a monorepo based on pnpm workspaces to manage all the code for Aolarhapsody. It integrates modern frontend and backend technologies and is equipped with a powerful set of internal script tools inspired by `vben` to ensure code quality and development efficiency.

## ✨ Tech Stack

- **Frontend**: `React`, `TypeScript`, `Vite`
- **Backend**: `Node.js`, `TypeScript`, `Express` (or a similar framework)
- **Desktop App**: `Tauri`
- **Package Manager**: `pnpm`
- **Code Quality**: `ESLint`, `Prettier`, `Stylelint`, `Commitlint`, `Cspell`
- **Git Hooks**: `lefthook`
- **Internal Tools**: Custom CLI tools built with `cac`, `@clack/prompts`, and `unbuild`.

## 📂 Project Structure

```
.
├── backend/         # Backend service
├── frontend/        # Frontend application
│   └── src-tauri/   # Tauri desktop app source code
├── scripts/         # Internal CLI tools and scripts
│   ├── ash/         # Helper script collection (ash)
│   ├── turbo-run/   # Interactive script runner (ar-turbo)
│   └── deploy/      # Deployment-related scripts and configurations
├── package.json
└── pnpm-workspace.yaml
```

## 📚 API Documentation

The backend API documentation can be accessed at the following addresses:

- [https://apifox.614447.xyz](https://apifox.614447.xyz)
- [https://aolarhapsody.apifox.cn](https://aolarhapsody.apifox.cn)

## 🚀 Quick Start

1.  **Clone the project**

    ```bash
    git clone https://github.com/vmoranv/aolarhapsody.git
    cd aolarhapsody
    ```

2.  **Install dependencies**

    > This project enforces the use of pnpm as the package manager.

    ```bash
    pnpm install
    ```

3.  **Start the development environment**

    ```bash
    # Start development mode for all services
    pnpm dev

    # Or start the frontend separately
    pnpm dev:front

    # Or start the backend separately
    pnpm dev:backend
    ```

## 🛠️ Available Scripts

### Development and Build

- `pnpm dev`: Starts the development mode for all packages.
- `pnpm build`: Builds all packages.
- `pnpm check`: Runs all code checks (linting, cspell).
- `pnpm format`: Formats all code.
- `pnpm clean`: Cleans all build artifacts and `node_modules`.

### Tauri Desktop App Build

- `pnpm build:tauri`: Builds the Tauri desktop app for the current platform.
- `pnpm build:tauri:multi`: Automatically selects suitable platforms based on the current system for building.
- `pnpm build:tauri:all`: Attempts to build all 4 platforms (Apple Silicon macOS, Intel macOS, Windows, Linux).

## Deployment

### Deploying the Backend Service with Docker

This project supports containerizing the backend service using Docker.

1.  **Build the Docker Image**

    Use the following command to build the Docker image for the backend service. This command utilizes the `backend/Dockerfile`.

    ```bash
    pnpm build:docker:backend
    ```

    After a successful build, you can use `docker images` to see the image named `aolarhapsody-backend`.

2.  **Run the Docker Container**

    Use the following command to start the container:

    ```bash
    docker run -d -p 3000:3000 --name aolarhapsody-backend-container aolarhapsody-backend
    ```

    - `-d`: Run the container in detached mode.
    - `-p 3000:3000`: Map port 3000 of the host to port 3000 of the container.
    - `--name`: Assign a name to the container.

    Once the service is running, it can be accessed at `http://localhost:3000`.

## 📄 License

This project is licensed under the [MIT](./LICENSE) License.
