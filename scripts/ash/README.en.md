# @aolarhapsody/scripts-helper

> A collection of helper scripts for the aolarhapsody monorepo, inspired by `vben`'s `vsh`.

[简体中文](./README.md) | English

## ✨ Features

- Provides a set of command-line tools to simplify common development tasks.
- Modular design, easy to extend with new commands.

## 📦 Installation

This tool is part of the aolarhapsody monorepo and does not require separate installation.

## 🚀 Usage

The main command is `ash`. These commands are intended to be used via `pnpm` scripts in the root `package.json`.

### Commands

-   `ash lint`: Lints all files in the repository.
    -   `--format`: Formats files with Prettier before linting.
-   `ash publint`: Checks `package.json` files for publishing standards.
