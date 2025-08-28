# 构建

::: tip 提示

项目使用 [Vite](https://vitejs.dev/) 作为构建工具，支持快速构建和打包。

:::

## 构建命令

项目提供了多种构建脚本以满足不同需求：

```bash
# 构建整个项目（包括前端和后端）
pnpm build

# 仅构建前端应用
pnpm build:front

# 仅构建后端服务
pnpm build:backend

# 构建后端 Docker 镜像
pnpm build:docker:backend
```

## 构建配置

### 前端构建配置

前端构建配置位于 `frontend/vite.config.ts`：

```ts
// frontend/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['antd', '@ant-design/icons'],
        },
      },
    },
  },
});
```

### 后端构建配置

后端使用 TypeScript 编译器进行构建，配置位于 `backend/tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["./**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

## 构建产物

构建完成后，产物将生成在以下目录：

- **前端**: `frontend/dist/`
- **后端**: `backend/dist/`

### 前端构建产物结构

```
frontend/dist/
├── assets/              # 静态资源
│   ├── index-*.js       # 主应用 JavaScript 文件
│   ├── index-*.css      # 主应用 CSS 文件
│   └── favicon.ico      # 网站图标
├── index.html           # 主页面
├── landing.html         # 着陆页
└── _app.config.js       # 动态配置文件
```

### 后端构建产物结构

```
backend/dist/
├── dataparse/           # 数据解析模块
├── routes/              # 路由模块
├── types/               # 类型定义
├── index.js             # 应用入口文件
└── package.json         # 后端依赖配置
```

## 环境区分

项目支持多种构建环境：

### 开发环境构建

```bash
# 开发模式运行
pnpm dev

# 仅运行前端开发服务
pnpm dev:front

# 仅运行后端开发服务
pnpm dev:backend
```

### 生产环境构建

```bash
# 生产环境构建
pnpm build

# 构建后预览
pnpm preview

# 仅预览前端
pnpm preview:front

# 仅预览后端
pnpm preview:backend
```

## 构建优化

### 代码分割

项目通过 Vite 的代码分割功能优化加载性能：

```ts
// frontend/vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        // 将大型依赖库单独打包
        vendor: ['react', 'react-dom'],
        antd: ['antd'],
        utils: ['lodash', 'axios'],
      },
    },
  },
},
```

### 资源压缩

项目支持多种资源压缩方式：

```bash
# 在 .env.production 中配置
VITE_COMPRESS=gzip  # 支持 none, brotli, gzip
```

### 静态资源处理

项目会自动处理和优化静态资源：

```ts
// frontend/vite.config.ts
build: {
  assetsDir: 'assets',
  rollupOptions: {
    output: {
      assetFileNames: (assetInfo) => {
        let extType = assetInfo.name.split('.').at(1);
        if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
          extType = 'img';
        }
        return `assets/${extType}/[name]-[hash][extname]`;
      },
    },
  },
},
```

## 构建分析

项目支持构建产物分析：

```bash
# 构建并分析
pnpm build:analyze
```

该命令将生成构建报告，帮助分析包大小和优化点。

## Docker 构建

项目支持 Docker 镜像构建：

```bash
# 构建后端 Docker 镜像
pnpm build:docker:backend
```

Dockerfile 位于 `backend/Dockerfile`：

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm build:backend

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

## 部署

构建完成后，可以通过以下方式部署：

### 静态部署（前端）

将 `frontend/dist/` 目录下的所有文件部署到静态服务器或 CDN。

### Node.js 部署（后端）

```bash
# 安装生产依赖
pnpm install --prod

# 启动服务
node dist/index.js
```

### Docker 部署（后端）

```bash
# 构建镜像
docker build -t your-backend-image -f backend/Dockerfile .

# 运行容器
docker run -d -p 3000:3000 --name your-backend-container your-backend-image
```
