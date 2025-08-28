# Docker Deployment

This project supports deploying the backend service using Docker, which makes the deployment process simpler and more consistent.

## Docker Image Building

The project provides a script to build the backend Docker image, which can be built using the following command:

```bash
pnpm build:docker:backend
```

This command will perform the following operations:

1. Build the backend service Docker image using `backend/Dockerfile`
2. Tag the image as `aolarhapsody-backend`

You can also build directly using the Docker command:

```bash
docker build -t aolarhapsody-backend -f backend/Dockerfile .
```

## Running Docker Container

After building, you can run the container using the following command:

```bash
docker run -d -p 3000:3000 --name aolarhapsody-backend-container aolarhapsody-backend
```

This will start a container, mapping port 3000 of the host to port 3000 of the container.

## Docker Compose Deployment

The project root directory provides a `docker-compose.yml` file, which can be deployed with one command using Docker Compose:

```bash
docker-compose up -d
```

This will start the backend service container, also exposing port 3000 to the host.

## Environment Variables Configuration

In Docker deployment, you can configure environment variables in the following ways to avoid exposing sensitive information:

1. Pass through the `-e` parameter when running the container:

   ```bash
   docker run -d -p 3000:3000 \
     -e NODE_ENV=production \
     --name aolarhapsody-backend-container aolarhapsody-backend
   ```

2. Use an env file (recommended for sensitive data):
   ```bash
   docker run -d -p 3000:3000 \
     --env-file .env.production \
     --name aolarhapsody-backend-container aolarhapsody-backend
   ```

> 💡 **Security Tip**: Never hardcode sensitive information like API keys, database credentials or private URLs in Dockerfiles or directly in commands. Always use environment variables or secure secret management solutions.

## Notes

1. Make sure the Docker service is running
2. If port 3000 is occupied, please modify the port mapping parameters
3. In production environments, it is recommended to use nginx or other reverse proxy servers to manage traffic
