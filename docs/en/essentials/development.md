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
# Start all services (recommended)
pnpm dev
```

## Development Workflow

### Directory Structure

The project follows a monorepo structure:

```
.
├── backend/          # Backend services
├── frontend/         # Frontend application
├── docs/             # Documentation
├── scripts/          # Internal tools and scripts
```

### Code Quality

The project uses the following tools to ensure code quality:

- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **Stylelint**: CSS/SCSS linting
- **Commitlint**: Git commit message linting

### Development Commands

```bash
# Run code linting
pnpm lint

# Run code formatting
pnpm format

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

## Frontend Development

### Technology Stack

- **React**: UI library
- **TypeScript**: Type checking
- **Vite**: Build tool
- **Tailwind CSS**: Styling framework
- **Ant Design**: UI component library

### Component Development

Components should follow these principles:

1. **Single Responsibility**: Each component should have a single responsibility
2. **Reusability**: Components should be designed for reusability
3. **Accessibility**: Components should follow accessibility guidelines
4. **Performance**: Components should be optimized for performance

## Backend Development

### Technology Stack

- **Node.js**: Runtime environment
- **Express**: Web framework
- **TypeScript**: Type checking

### API Development

APIs should follow RESTful principles:

1. **Resource-based**: APIs should be organized around resources
2. **Stateless**: Each request should contain all necessary information
3. **Uniform interface**: Consistent API design
4. **Cacheable**: Responses should indicate cacheability

## Debugging

### Frontend Debugging

- Use browser developer tools
- Enable React DevTools
- Use console.log for debugging

### Backend Debugging

- Use Node.js inspector
- Check server logs
- Use debugging tools like Postman for API testing

## Common Issues

### Dependency Issues

If you encounter dependency issues:

```bash
# Clean node_modules and reinstall
pnpm clean
pnpm install
```

### Port Conflicts

If ports are occupied:

```bash
# Change port in .env file
VITE_PORT=3001
```

By following these guidelines, you can efficiently develop and contribute to the Aolarhapsody project.
