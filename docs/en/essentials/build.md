# Build

::: tip Tip

The project uses [Vite](https://vitejs.dev/) as the build tool, supporting fast building and packaging.

:::

## Build Commands

The project provides multiple build scripts to meet different needs:

```bash
# Build the entire project (including frontend and backend)
pnpm build

# Build only the frontend application
pnpm build:front

# Build only the backend service
pnpm build:backend

# Build backend Docker image
pnpm build:docker:backend
```

## Build Configuration

### Frontend Build Configuration

Frontend build configuration is located at `frontend/vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    outDir: '../dist/frontend',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
```

### Backend Build Configuration

Backend build configuration is located at `backend/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "../dist/backend",
    "rootDir": ".",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

## Build Process

### Frontend Build Process

1. TypeScript compilation
2. React component compilation
3. Asset optimization (images, fonts, etc.)
4. Bundle generation
5. Output to `dist/frontend`

### Backend Build Process

1. TypeScript compilation
2. Copy static assets
3. Output to `dist/backend`

## Optimization

### Code Splitting

The project uses Vite's built-in code splitting:

```ts
// Dynamic import for code splitting
const MyComponent = lazy(() => import('./MyComponent'));
```

### Tree Shaking

Unused code is automatically removed during the build process.

### Minification

Code is minified to reduce bundle size:

- JavaScript minification using esbuild
- CSS minification
- HTML minification

## Environment-specific Builds

### Development Build

```bash
pnpm dev
```

Development builds are optimized for fast rebuilds and debugging.

### Production Build

```bash
pnpm build
```

Production builds are optimized for performance and file size.

## Deployment

After building, the output can be deployed in multiple ways:

1. **Vercel Deployment**: Using the Vercel platform
2. **Docker Deployment**: Using Docker containers
3. **Static File Deployment**: Deploying build output as static files

For detailed deployment instructions, please refer to the [Deployment Guide](../../deployment/vercel.md).
