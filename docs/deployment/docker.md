# Docker 部署

本项目支持使用 Docker 部署后端服务,这使得部署过程更加简单和一致.

## Docker 镜像构建

项目提供了构建后端 Docker 镜像的脚本,可以使用以下命令构建：

```bash
pnpm build:docker:backend
```

该命令会执行以下操作：

1. 使用 `backend/Dockerfile` 构建后端服务的 Docker 镜像
2. 将镜像标记为 `aolarhapsody-backend`

您也可以直接使用 Docker 命令构建：

```bash
docker build -t aolarhapsody-backend -f backend/Dockerfile .
```

## 运行 Docker 容器

构建完成后,可以使用以下命令运行容器：

```bash
docker run -d -p 3000:3000 --name aolarhapsody-backend-container aolarhapsody-backend
```

这将启动一个容器,将主机的 3000 端口映射到容器的 3000 端口.

## Docker Compose 部署

项目根目录下提供了 `docker-compose.yml` 文件,可以使用 Docker Compose 一键部署：

```bash
docker-compose up -d
```

这将启动后端服务容器,同样将 3000 端口暴露给主机.

## 环境变量配置

在 Docker 部署中,您可以通过以下方式配置环境变量：

1. 在运行容器时通过 `-e` 参数传递：

   ```bash
   docker run -d -p 3000:3000 \
     -e NODE_ENV=production \
     --name aolarhapsody-backend-container aolarhapsody-backend
   ```

2. 使用 env 文件：
   ```bash
   docker run -d -p 3000:3000 \
     --env-file .env.production \
     --name aolarhapsody-backend-container aolarhapsody-backend
   ```

## 注意事项

1. 确保 Docker 服务正在运行
2. 如果端口 3000 已被占用,请修改端口映射参数
3. 在生产环境中,建议使用 nginx 或其他反向代理服务器来管理流量
