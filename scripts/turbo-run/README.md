# @aolarhapsody/turbo-run

> 一个用于在 pnpm 工作空间中交互式运行脚本的 CLI 工具。

[English](./README.en.md) | 简体中文

## ✨ 特性

- 交互式界面，方便选择目标包。
- 自动检测 pnpm 工作空间中的所有包。
- 简化在 monorepo 中运行脚本的流程。

## 📦 安装

该工具是 aolarhapsody monorepo 的一部分，无需单独安装。

## 🚀 使用

该工具旨在 aolarhapsody monorepo 内部使用。它提供了一个交互式提示，用于选择包并在其中运行脚本。

你可以通过在根目录 `package.json` 中定义的命令来使用它：

```bash
# 示例命令，实际命令可能有所不同
pnpm ar-turbo build
```

运行后，将展示一个包列表。选择一个包后，`build` 脚本将在该特定包的上下文中执行。
