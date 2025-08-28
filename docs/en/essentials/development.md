# Development

::: tip Tip

The project uses pnpm workspace to manage the monorepo, and unified commands are used for development.

:::

## Environment Preparation

Before starting development, please ensure the following tools are installed:

- **Node.js**: v20 or higher
- **pnpm**: v10.13.1 or higher
- **Git**: Version control tool
- **VS Code**: Recommended editor (optional)

## Project Startup

### Install Dependencies

```bash
# Install project dependencies
pnpm install
```

### Start Development Services

```bash
# Start all services
pnpm dev

# Start frontend development service only
pnpm dev:front

# Start backend development service only
pnpm dev:backend
```

## Common Commands

The project provides rich commands to assist development:

```json
{
  "scripts": {
    // Build project
    "build": "pnpm --filter @aolarhapsody/turbo-run build && cross-env NODE_OPTIONS=--max-old-space-size=8192 ar-turbo build",
    // Build all packages
    "build:all": "pnpm --parallel --filter \"./**\" build",
    // Build frontend
    "build:front": "pnpm --filter frontend build",
    // Build backend
    "build:backend": "pnpm --filter backend build",
    // Build Docker image
    "build:docker": "bash ./scripts/deploy/build-local-docker-image.sh",
    // Build backend Docker image
    "build:docker:backend": "docker build -t aolarhapsody-backend -f backend/Dockerfile .",
    // Build Tauri desktop application
    "build:tauri": "pnpm --filter frontend exec tauri build",
    // Preview build results
    "preview": "pnpm build:all && pnpm --parallel --filter \"./**\" preview",
    // Preview frontend
    "preview:front": "pnpm --filter frontend build && pnpm --filter frontend preview",
    // Preview backend
    "preview:backend": "pnpm --filter backend build && pnpm --filter backend preview",
    // Code checking
    "check": "ash lint && pnpm lint:cspell",
    // Clean project
    "clean": "node ./scripts/clean.mjs",
    // Commit code
    "commit": "czg",
    // Start development services
    "dev": "concurrently -k \"pnpm:dev:backend\" \"node scripts/wait-for-backend.mjs\"",
    // Start frontend development service
    "dev:front": "pnpm --filter frontend dev",
    // Start backend development service
    "dev:backend": "pnpm --filter backend dev",
    // Format code
    "format": "ash lint --format",
    // Code checking
    "lint": "ash lint",
    // Spell checking
    "lint:cspell": "cspell lint \"**/*.ts\" \"**/README.md\" \".changeset/*.md\" --no-progress",
    // Package specification checking
    "lint:publint": "ash publint",
    // Install Git Hooks
    "postinstall": "lefthook install",
    // Restrict to pnpm only
    "preinstall": "npx only-allow pnpm",
    // Reinstall dependencies
    "reinstall": "pnpm clean --del-lock && pnpm install"
  }
}
```

## Development Workflow

### Create New Features

1. Create a feature branch:

```bash
git checkout -b feature/new-feature
```

2. Develop feature code

3. Run tests to ensure functionality works properly:

```bash
pnpm dev
```

4. Commit code:

```bash
git add .
git commit -m "feat: add new feature"
```

### Code Standards

The project uses the following tools to ensure code quality:

- **ESLint**: JavaScript/TypeScript code checking
- **Prettier**: Code formatting
- **Stylelint**: CSS code checking
- **Commitlint**: Git commit message checking

### Code Formatting

```bash
# Format all code
pnpm format
```

### Code Checking

```bash
# Run all checks
pnpm check

# Run spell checking
pnpm lint:cspell

# Run package specification checking
pnpm lint:publint
```

## Debugging

### Frontend Debugging

The frontend uses Vite development server, which supports hot updates and source mapping, allowing direct debugging in the browser.

### Backend Debugging

The backend supports Node.js debugging, which can be started in debug mode as follows:

```bash
# Start backend with inspect mode
node --inspect backend/dist/index.js
```

Then access `chrome://inspect` in Chrome browser for debugging.

## Troubleshooting

### Dependency Issues

If you encounter dependency-related issues, try reinstalling dependencies:

```bash
# Clean and reinstall dependencies
pnpm reinstall
```

### Build Failures

If build fails, try cleaning the project and rebuilding:

```bash
# Clean project
pnpm clean

# Reinstall dependencies
pnpm install

# Rebuild
pnpm build
```

By following these guidelines, you can efficiently develop and contribute to the Aolarhapsody project.
