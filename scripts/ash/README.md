# @aolarhapsody/scripts-helper

> aolarhapsody monorepo 的辅助脚本集合。

[English](./README.en.md) | 简体中文

## ✨ 特性

- 提供一组命令行工具来简化常见的开发任务。
- 模块化设计，易于扩展新命令。

## 📦 安装

该工具是 aolarhapsody monorepo 的一部分，无需单独安装。

## 🚀 使用

主命令是 `ash`。这些命令旨在通过根 `package.json` 中的 `pnpm` 脚本使用。

### Commands

-   `ash lint`: 对仓库中的所有文件进行代码风格检查。
    -   `--format`: 在检查前使用 Prettier 格式化文件。
-   `ash publint`: 检查 `package.json` 文件是否符合发布标准。
