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

# Build Tauri desktop app (current platform)
pnpm build:tauri

# Build Tauri desktop app (multi-platform, automatically selected based on current system)
pnpm build:tauri:multi

# Build Tauri desktop app (all 4 platforms: Apple Silicon macOS, Intel macOS, Windows, Linux)
pnpm build:tauri:all
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

### Code Splitting Configuration

The project's code splitting is configured in `frontend/vite.config.ts`:

```ts
// frontend/vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        // Package large dependency libraries separately
        vendor: ['react', 'react-dom'],
        antd: ['antd'],
        utils: ['lodash', 'axios'],
      },
    },
  },
},
```

### Resource Compression

The project supports multiple resource compression methods:

```bash
# Configure in .env.production
VITE_COMPRESS=gzip  # Supports none, brotli, gzip
```

### Static Resource Processing

The project automatically processes and optimizes static resources:

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

## Build Analysis

The project supports build artifact analysis, which generates a visual representation of the bundle size and composition:

```bash
# Build and analyze
pnpm build:analyze
```

This command will generate a report in the `dist` folder (e.g., `report.html`) that helps analyze the size of the bundled files, identify large dependencies, and optimize further.

You can open the generated report in a browser to visualize the composition of the build output and identify optimization opportunities.

## Tauri Desktop App Build

The project supports building cross-platform desktop applications using Tauri:

### Tauri Build Commands

```bash
# Build Tauri desktop app (current platform)
pnpm build:tauri

# Build Tauri desktop app (multi-platform, automatically selected based on current system)
pnpm build:tauri:multi

# Build Tauri desktop app (all 4 platforms: Apple Silicon macOS, Intel macOS, Windows, Linux)
pnpm build:tauri:all
```

### Platform Support

- **Apple Silicon macOS**: `aarch64-apple-darwin`
- **Intel macOS**: `x86_64-apple-darwin`
- **Windows**: `x86_64-pc-windows-msvc`
- **Linux**: `x86_64-unknown-linux-gnu`

### Build Artifacts

Tauri build artifacts are located in the `frontend/src-tauri/target/{platform}/release/bundle/` directory:

- **macOS**: `.app` application package and `.dmg` installer
- **Windows**: `.msi` installer
- **Linux**: Multiple formats including `.deb`, `.AppImage`, etc.

### Notes

- In local macOS environment, Windows and Linux builds may fail due to missing cross-compilation toolchains
- In GitHub Actions CI/CD environment, all 4 platforms should build successfully
- When using the `build:tauri:all` command, the script will attempt to build all platforms and continue execution even if some platforms fail to build

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

After building, the output can be deployed in the following ways:

### Static Deployment (Frontend)

All files under the `dist/frontend` directory can be deployed to any static hosting service such as:

- **Vercel**
- **Netlify**
- **AWS S3**
- **Cloudflare Pages**
- **GitHub Pages**

Example using Vercel CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel dist/frontend
```

### Node.js Deployment (Backend)

To deploy the backend on a Node.js server:

```bash
# Navigate to the backend directory
cd backend

# Install production dependencies
pnpm install --prod

# Start the service
node dist/index.js
```

It is recommended to use a process manager like `pm2` for production:

```bash
# Install pm2 globally
npm install -g pm2

# Start with pm2
pm2 start dist/index.js --name "my-backend"
```

### Docker Deployment (Backend)

To deploy using Docker:

```bash
# Build the Docker image
docker build -t your-backend-image -f backend/Dockerfile .

# Run the Docker container
docker run -d -p 3000:3000 --name your-backend-container your-backend-image
```

For Docker Compose:

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    ports:
      - '3000:3000'
    restart: unless-stopped
```

Then run:

```bash
docker-compose up -d
```

### CI/CD Integration

You can integrate the build and deployment process with CI/CD tools like:

- **GitHub Actions**
- **GitLab CI**
- **CircleCI**

Example GitHub Actions workflow:

```yaml
name: Build and Deploy

on:
  push:
    branches:
      - main

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 20

      - name: Install dependencies
        run: npm install -g pnpm && pnpm install

      - name: Build project
        run: pnpm build

      - name: Deploy to Vercel
        run: vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```
