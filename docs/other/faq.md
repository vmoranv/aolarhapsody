# 常见问题 (FAQ)

## 开发相关问题

### 如何启动开发环境？

确保已安装 Node.js (v20+) 和 pnpm (v10.13.1+)，然后运行：

```bash
pnpm install
pnpm dev
```

### 如何构建项目？

```bash
# 构建整个项目
pnpm build

# 仅构建前端
pnpm build:front

# 仅构建后端
pnpm build:backend
```

### 如何运行测试？

```bash
# 运行所有测试
pnpm test

# 运行单元测试
pnpm test:unit

# 运行端到端测试
pnpm test:e2e
```

## 部署相关问题

### 如何部署到 Vercel？

1. 将项目推送到 GitHub
2. 在 Vercel 上导入项目
3. 设置环境变量
4. 部署完成

### 如何使用 Docker 部署后端？

```bash
# 构建 Docker 镜像
pnpm build:docker:backend

# 运行容器
docker run -d -p 3000:3000 --name aolarhapsody-backend aolarhapsody-backend
```

### 环境变量如何配置？

在项目根目录创建 `.env` 文件：

```properties
VITE_COPILOT_PUBLIC_API_KEY=your_api_key
VITE_COPILOT_LICENSE_KEY=your_license_key
```

## 技术问题

### 为什么数据没有更新？

1. 检查网络连接
2. 清除浏览器缓存
3. 检查后端服务是否正常运行
4. 查看控制台错误信息

### 如何添加新的数据解析模块？

1. 在 `backend/dataparse` 目录下创建解析模块
2. 在 `backend/routes` 目录下创建对应路由
3. 在前端创建数据展示页面
4. 更新相关类型定义

### 如何自定义主题？

1. 修改 `frontend/src/theme` 目录下的主题配置
2. 更新 Tailwind CSS 配置文件
3. 重启开发服务器查看效果

## 贡献相关

### 如何贡献代码？

1. Fork 项目仓库
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 发起 Pull Request

### 如何报告 Bug？

1. 在 GitHub Issues 中搜索是否已存在相同问题
2. 如果不存在，创建新的 Issue
3. 详细描述问题现象和复现步骤
4. 提供相关环境信息

## 许可证问题

### 项目使用什么许可证？

本项目使用 GNU Affero General Public License v3.0 许可证，详情请查看 LICENSE 文件。

### 可以用于商业项目吗？

GNU Affero General Public License v3.0 是一个自由软件许可证，允许在商业项目中使用、修改和分发代码，但需要遵守 AGPLv3 的条款。具体要求请查看 LICENSE 文件。

如有其他问题，请在 GitHub Issues 中提问或通过项目提供的联系方式与我们联系。
