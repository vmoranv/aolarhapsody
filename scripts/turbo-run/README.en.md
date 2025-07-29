# @aolarhapsody/turbo-run

> An interactive CLI tool for running scripts in a pnpm workspace, inspired by `vben`.

[简体中文](./README.md) | English

## ✨ Features

- Interactive interface for easy selection of target packages.
- Automatically detects all packages in the pnpm workspace.
- Simplifies the process of running scripts in a monorepo.

## 📦 Installation

This tool is part of the aolarhapsody monorepo and does not require separate installation.

## 🚀 Usage

This tool is intended for internal use within the aolarhapsody monorepo. It provides an interactive prompt to select a package and run a script within it.

You can use it through the command defined in the root `package.json`:

```bash
# Example command, the actual command may differ
pnpm ar-turbo build
```

After running, a list of packages will be displayed. Once a package is selected, the `build` script will be executed in the context of that specific package.
