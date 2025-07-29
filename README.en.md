# Aolarhapsody Monorepo

> The official monorepo for the Aolarhapsody project, containing the frontend, backend, and internal toolchain.

[简体中文](./README.md) | English

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/pnpm-v10.13.1-orange" alt="pnpm version">
  <img src="https://img.shields.io/badge/TypeScript-^5.0.0-blue" alt="TypeScript version">
  <img src="https://img.shields.io/badge/React-^18.0.0-cyan" alt="React version">
  <img src="https://img.shields.io/badge/Node.js-^20.0.0-green" alt="Node.js version">
</p>

## 📖 Introduction

This project is a monorepo based on pnpm workspaces to manage all the code for Aolarhapsody. It integrates modern frontend and backend technologies and is equipped with a powerful set of internal script tools inspired by `vben` to ensure code quality and development efficiency.

## ✨ Tech Stack

-   **Frontend**: `React`, `TypeScript`, `Vite`
-   **Backend**: `Node.js`, `TypeScript`, `Express` (or a similar framework)
-   **Package Manager**: `pnpm`
-   **Code Quality**: `ESLint`, `Prettier`, `Stylelint`, `Commitlint`, `Cspell`
-   **Git Hooks**: `lefthook`
-   **Internal Tools**: Custom CLI tools built with `cac`, `@clack/prompts`, and `unbuild`.

## 📂 Project Structure

```
.
├── backend/         # Backend service
├── frontend/        # Frontend application
├── scripts/         # Internal CLI tools and scripts
│   ├── ash/         # Helper script collection (ash)
│   ├── turbo-run/   # Interactive script runner (ar-turbo)
│   └── deploy/      # Deployment-related scripts and configurations
├── package.json
└── pnpm-workspace.yaml
```

## 🚀 Quick Start

1.  **Clone the project**
    ```bash
    git clone <repository-url> aolarhapsody-monorepo
    cd aolarhapsody-monorepo
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

-   `pnpm dev`: Starts the development mode for all packages.
-   `pnpm build`: Builds all packages.
-   `pnpm check`: Runs all code checks (linting, cspell).
-   `pnpm format`: Formats all code.
-   `pnpm clean`: Cleans all build artifacts and `node_modules`.

## 📄 License

This project is licensed under the [MIT](./LICENSE) License.
