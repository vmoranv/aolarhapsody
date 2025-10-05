# Tauri 桌面应用构建

本项目支持使用 Tauri 构建桌面应用程序,可以为多个平台(Windows、macOS、Linux)构建应用.

## 构建准备

在构建 Tauri 应用之前,需要安装 Tauri CLI 依赖：

```bash
pnpm install
```

确保已经安装了 Tauri 的系统依赖,具体请参考 [Tauri 官方文档](https://tauri.app/v1/guides/getting-started/prerequisites/).

## 构建命令

项目提供了专门的构建脚本用于构建 Tauri 桌面应用：

```bash
pnpm build:tauri
```

该命令会执行以下操作：

1. 使用 `pnpm --filter frontend exec tauri build` 命令构建 Tauri 应用
2. 根据当前操作系统自动构建对应平台的应用程序

您也可以直接使用 Tauri CLI 进行构建：

```bash
cd frontend
pnpm tauri build
```

## 多平台构建

### Windows

在 Windows 系统上,构建命令会自动创建 `.msi` 和 `.exe` 安装包.

### macOS

在 macOS 系统上,构建命令会自动创建 `.app` 应用包和 `.dmg` 安装镜像.

### Linux

在 Linux 系统上,构建命令会自动创建 `.AppImage` 和 `.deb` 安装包.

## 自定义构建配置

Tauri 的构建配置位于 `frontend/src-tauri/tauri.conf.json` 文件中,您可以根据需要修改以下配置：

1. 应用标识符(identifier)
2. 应用版本(version)
3. 应用名称(productName)
4. 窗口配置(窗口大小、标题等)
5. 打包选项(bundle)

## 注意事项

1. 首次构建可能需要较长时间,因为需要下载和编译 Rust 依赖
2. 构建过程中需要网络连接以下载依赖项
3. 某些平台可能需要特定的构建环境或依赖
4. 构建产物将位于 `frontend/src-tauri/target/release/bundle/` 目录下
