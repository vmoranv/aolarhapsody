# CLI 工具

Aolarhapsody 提供了多个内置的 CLI 工具，以提高开发效率和简化常见任务。

## ash（辅助脚本集合）

`ash` 是一个辅助脚本集合，提供各种便捷命令。

### 安装

```bash
pnpm install -g @aolarhapsody/ash
```

或者直接使用：

```bash
pnpm ash <command>
```

### 常用命令

- `ash help` - 显示帮助信息
- `ash version` - 显示版本信息
- `ash clean` - 清理构建产物和缓存

## turbo-run（交互式脚本运行器）

`turbo-run` 是一个交互式脚本运行器，可以帮助你快速执行 package.json 中定义的脚本。

### 安装

```bash
pnpm install -g @aolarhapsody/turbo-run
```

或者直接使用：

```bash
pnpm turbo-run
```

### 使用方法

运行命令后，将显示一个交互式界面，列出所有可用的脚本，你可以通过方向键选择并执行。

## 部署脚本

在 [scripts/deploy/](https://github.com/vmoranv/aolarhapsody/tree/main/scripts/deploy) 目录中包含了一些部署相关的脚本：

- `build-local-docker-image.sh` - 本地构建 Docker 镜像
- `Dockerfile` - Docker 镜像构建文件
- `nginx.conf` - Nginx 配置文件

### 构建 Docker 镜像

```bash
cd scripts/deploy
./build-local-docker-image.sh
```

## 自定义脚本

你也可以在项目根目录的 `package.json` 中找到更多可用的脚本命令：

```bash
# 开发模式
pnpm dev

# 构建项目
pnpm build

# 代码检查
pnpm check

# 代码格式化
pnpm format

# 清理构建产物
pnpm clean
```

这些 CLI 工具和脚本大大简化了开发、构建和部署流程，提高了开发效率。
