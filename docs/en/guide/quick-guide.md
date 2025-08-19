# Quick Start

Welcome to Aolarhapsody! This is a monorepo project based on pnpm workspace, integrating modern frontend and backend technology stacks.

## Project Overview

Aolarhapsody is a feature-rich full-stack project that includes the following main components:

- **Frontend**: Modern user interface built with React, TypeScript, and Vite
- **Backend**: RESTful API service built with Node.js, Express, and TypeScript
- **Internal Tools**: Including code checking, formatting, and deployment scripts

## Environment Preparation

Before getting started, make sure your development environment meets the following requirements:

- **Node.js**: v20 or higher
- **pnpm**: v10.13.1 or higher (this project enforces the use of pnpm as the package manager)
- **Docker**: (Optional) for containerized deployment

## Installation Steps

### 1. Clone the Project

```bash
git clone <repository-url> aolarhapsody-monorepo
cd aolarhapsody-monorepo
```

### 2. Install Dependencies

```bash
pnpm install
```

> Note: This project enforces the use of pnpm as the package manager. Using npm or yarn may cause dependency issues.

## Development Mode

### Start All Services

```bash
pnpm dev
```

This will start both frontend and backend services:

- Frontend will run on `http://localhost:5173`
- Backend will run on `http://localhost:3000`

### Start Services Separately

If you only want to start specific services, you can use the following commands:

```bash
# Start frontend only
pnpm dev:front

# Start backend only
pnpm dev:backend
```

## Building the Project

To build the project for production, run:

```bash
pnpm build
```

This will build all the code for both frontend and backend.

You can also build individual parts separately:

```bash
# Build frontend only
pnpm build:front

# Build backend only
pnpm build:backend
```

## Deployment

### Docker Deployment (Recommended)

This project supports containerized deployment using Docker. You can either pull pre-built images from DockerHub or build your own.

#### Option 1: Using Pre-built DockerHub Image (Recommended)

Pull and run the backend service from DockerHub:

```bash
docker run -d -p 3000:3000 --name aolarhapsody-backend vmoranv/aolarhapsody-backend
```

#### Option 2: Build Your Own Docker Image

If you need to customize the build, you can use the following command:

```bash
pnpm build:docker:backend
```

Then run the container:

```bash
docker run -d -p 3000:3000 --name aolarhapsody-backend-container aolarhapsody-backend
```

After the service starts, you can access the backend API via `http://localhost:3000`.

## Project Structure

```
.
├── backend/         # Backend services
├── frontend/        # Frontend application
├── scripts/         # Internal CLI tools and scripts
├── docs/            # Project documentation
└── package.json     # Project configuration file
```

## Common Commands

| Command            | Description                                |
| ------------------ | ------------------------------------------ |
| `pnpm dev`         | Start development mode for all services    |
| `pnpm dev:front`   | Start frontend development service         |
| `pnpm dev:backend` | Start backend development service          |
| `pnpm build`       | Build all packages                         |
| `pnpm check`       | Run all code checks                        |
| `pnpm format`      | Format all code                            |
| `pnpm clean`       | Clean all build artifacts and node_modules |

## Accessing the Application

- Frontend interface: `http://localhost:5173`
- Backend API: `http://localhost:3000`

## Troubleshooting

1. **Port Conflicts**: If ports 3000 or 5173 are already in use, the backend service will automatically try to use the next available port.

2. **Dependency Installation Issues**: Make sure to use pnpm to install dependencies, do not use npm or yarn.

3. **Build Failures**: Try cleaning the project and reinstalling dependencies:
   ```bash
   pnpm clean
   pnpm install
   ```

Now you understand how to set up and run the Aolarhapsody project, and you can start developing your features!
