# Vercel 部署

这是一个 Vercel 部署页面。

## 部署配置

项目在 `frontend/vercel.json` 中已经包含了部署配置：

```json
{
  "rewrites": [
    {
      "source": "/proxy/:path*",
      "destination": "https://your-backend-domain.com/:path*"
    }
  ]
}
```

这个配置将 `/proxy` 路径的请求代理到 `https://your-backend-domain.com`，用于访问游戏数据接口。

## 部署步骤

1. 访问 [Vercel 官网](https://vercel.com) 并登录您的账户

2. 在 Vercel 仪表板中，点击 "New Project" 按钮

3. 导入您的项目仓库：
   - 如果您已经将代码推送到 GitHub/GitLab/Bitbucket，可以选择从 Git 仓库导入
   - 或者直接上传项目文件

4. 配置项目：
   - 项目名称会自动填充，您可以根据需要修改
   - 确保框架预设选择为 "Vite"
   - 构建命令应为 `pnpm build:front` 或 `tsc -b && vite build`
   - 输出目录应为 `dist`
   - 根目录应设置为 `frontend`

5. 环境变量配置：
   - 在 Vercel 项目设置中找到 "Environment Variables" 部分
   - 添加以下环境变量（根据需要）：
     - `VITE_API_URL` - 如果您部署了自己的后端服务，设置为您的后端URL
     - `VITE_COPILOT_PUBLIC_API_KEY` - 如果您想启用 Copilot Kit 功能，需要在 [CopilotKit Cloud](https://cloud.copilotkit.ai) 注册并获取 API 密钥
     - `VITE_COPILOT_LICENSE_KEY` - 如果您有 Copilot Kit 的许可证密钥，也可以添加

6. 点击 "Deploy" 开始部署

## 构建脚本说明

项目提供了多种构建脚本以满足不同需求：

- `pnpm build` - 构建整个项目（包括前端和后端）
- `pnpm build:front` - 仅构建前端应用
- `pnpm build:backend` - 仅构建后端服务
- `pnpm build:docker:backend` - 构建后端 Docker 镜像

在 Vercel 部署中，通常只需要构建前端应用，因此构建命令应设置为 `pnpm build:front`。该命令会执行以下操作：

1. 使用 TypeScript 编译器编译前端代码
2. 使用 Vite 构建生产版本
3. 生成优化后的静态文件，准备部署

## 注意事项

- 项目使用 pnpm 作为包管理器，Vercel 会自动检测并使用
- 项目包含两个入口文件：`index.html`（主应用）和 `landing.html`（着陆页）
- 默认情况下，Vercel 会部署 `index.html` 对应的应用程序
- 如果需要自定义域名，请在 Vercel 项目设置中配置 Domains 选项
- Copilot Kit 功能是可选的，如果不设置相关密钥，应用仍然可以正常运行，只是 AI 助手功能将不可用

## 自定义后端配置

如果您部署了自己的后端服务，需要在 Vercel 环境变量中设置：

```
VITE_API_URL=https://your-backend-url.com
```

这样前端应用就会连接到您自定义的后端服务。

## Copilot Kit 配置

项目集成了 Copilot Kit，提供 AI 助手功能。要启用此功能，您需要：

1. 访问 [CopilotKit Cloud](https://cloud.copilotkit.ai) 并注册账户
2. 创建一个新的项目并获取 API 密钥
3. 在 Vercel 环境变量中添加：
   ```
   VITE_COPILOT_PUBLIC_API_KEY=your_copilot_api_key_here
   ```
4. （可选）如果您有许可证密钥，也可以添加：
   ```
   VITE_COPILOT_LICENSE_KEY=your_license_key_here
   ```

如果未设置这些密钥，AI 助手功能将不会工作，但不会影响应用程序的其他功能。
