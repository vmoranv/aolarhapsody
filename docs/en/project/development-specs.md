# Development Specifications

Aolarhapsody project follows unified development specifications to ensure code quality and team collaboration efficiency.

## Environment Setup

### Environment Requirements

- **Node.js**: Recommended to use Node.js 20+ version
- **Package Manager**: Use pnpm as the package management tool
- **IDE**: Recommended to use VS Code and install related plugins

### Required VSCode Plugins

To ensure development efficiency, the following plugins are recommended:

1. **ESLint** - Code checking
2. **Prettier** - Code formatting
3. **Stylelint** - CSS style checking
4. **TypeScript Importer** - Auto import modules
5. **Auto Rename Tag** - Auto rename tags
6. **GitLens** - Enhanced Git functionality

### Project Initialization

```bash
# Clone project
git clone <repository-url>

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Development Workflow

### Branch Management Strategy

- **main**: Main branch, stable version
- **develop**: Development branch, integrate latest features
- **feature/\***: Feature branches, develop new features
- **hotfix/\***: Hotfix branches, emergency fixes

### Development Environment Configuration

#### Environment Variables

The project supports multi-environment configuration:

- `.env.development` - Development environment
- `.env.production` - Production environment
- `.env.test` - Test environment

#### Environment Variable Example

```bash
# Development environment
VITE_API_BASE_URL=http://localhost:3000
VITE_DEVTOOLS=true
```

### Development Server

#### Start Development Environment

```bash
# Start frontend development server
pnpm dev

# Start backend development server
pnpm dev:backend

# Start both frontend and backend
pnpm dev:all
```

#### Development Tool Configuration

The project has built-in development tool support:

- **Vue DevTools**: Can be enabled in development environment
- **Hot Reload**: Automatic refresh after code modification
- **Error Prompts**: Detailed error information and stack traces

## Code Specifications

### TypeScript Specifications

- Use TypeScript strict mode
- Clear type definitions, avoid using any
- Use generics reasonably to improve code reusability
- Interface naming uses PascalCase, interface properties use camelCase
- Prefer interface over type (unless special circumstances)

### React Specifications

- Component naming uses PascalCase
- Component file names should match component names
- Prefer functional components and Hooks
- Reasonably split components to maintain single responsibility
- Use TypeScript to define component Props and State
- Custom Hooks should start with use

### CSS Specifications

- Use Tailwind CSS utility classes
- Avoid inline styles
- Use CSS Modules appropriately to prevent style conflicts
- Use breakpoint classes for responsive design
- Write CSS properties in recommended order (positioning, box model, typography, visual, others)

### Code Formatting

The project uses unified code formatting tools:

- **ESLint**: Code checking and error fixing
- **Prettier**: Code formatting
- **Stylelint**: CSS style checking

## Project Structure Specifications

### Directory Structure

```
aolarhapsody/
├── frontend/           # Frontend application
│   ├── src/
│   │   ├── components/  # Common components
│   │   ├── views/       # Page components
│   │   ├── hooks/       # Custom Hooks
│   │   ├── utils/       # Utility functions
│   │   └── types/       # Type definitions
│   └── public/          # Static resources
├── backend/            # Backend service
│   ├── routes/         # API routes
│   ├── types/          # Type definitions
│   └── dataparse/      # Data parsing
├── docs/               # Project documentation
└── scripts/            # Build scripts
```

### File Naming Specifications

- **Component files**: PascalCase, e.g., `UserCard.tsx`
- **Utility files**: camelCase, e.g., `formatDate.ts`
- **Configuration files**: kebab-case, e.g., `tailwind.config.js`
- **Constant files**: UPPER_CASE, e.g., `API_CONSTANTS.ts`

### Import/Export Specifications

```typescript
// Recommended import order
// 1. Node.js built-in modules
import fs from 'fs';
import path from 'path';

// 2. Third-party libraries
import React from 'react';
import axios from 'axios';

// 3. Project internal modules
import { UserCard } from '@/components/UserCard';
import { formatDate } from '@/utils/date';

// 4. Relative path imports
import './styles.css';
```

## Git Commit Specifications

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Commit Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation update
- **style**: Code format adjustment (changes that do not affect code operation)
- **refactor**: Refactoring (code changes that are neither new features nor bug fixes)
- **perf**: Performance optimization
- **test**: Test related
- **chore**: Build process or auxiliary tool changes
- **revert**: Rollback commit
- **workflow**: Workflow improvements
- **ci**: Continuous integration

### Commit Examples

```bash
feat(auth): add user login functionality
fix(api): resolve data parsing error
docs(readme): update installation instructions
perf(components): optimize image loading
```

### Git Hooks

The project uses Git Hooks to ensure code quality:

- **pre-commit**: Run code checks and formatting before commit
- **commit-msg**: Check commit message format
- **post-merge**: Automatically install dependencies after merge

## Testing Specifications

### Unit Testing

- Key business logic needs unit test coverage
- Use Jest as the testing framework
- Test files are in the same directory as source files, named `*.test.ts`
- Test coverage should be maintained above 80%

### Test Example

```typescript
// utils/date.test.ts
import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2023-01-01');
    expect(formatDate(date)).toBe('2023-01-01');
  });
});
```

### End-to-End Testing

- Key user flows need end-to-end testing
- Use Cypress for testing
- Test files are placed in the `tests/e2e/` directory

## Build and Deployment

### Build Commands

```bash
# Development environment build
pnpm build:dev

# Production environment build
pnpm build

# Build documentation
pnpm build:docs
```

### Build Configuration

The project uses Turbo for build optimization:

- **Parallel Build**: Multiple packages build in parallel
- **Incremental Build**: Only build changed parts
- **Cache Mechanism**: Reuse build results

### Static Resources

Public static resources are placed in the `public/static` directory:

```bash
public/
├── static/
│   ├── images/
│   ├── icons/
│   └── fonts/
```

Reference path: `/static/xxx.png`

## Documentation Specifications

### Code Comments

- Exported functions, classes, and interfaces need comments
- Complex logic needs inline comments
- Use TSDoc format

```typescript
/**
 * Format date
 * @param date - Date to format
 * @param format - Format pattern
 * @returns Formatted date string
 */
export function formatDate(date: Date, format = 'YYYY-MM-DD'): string {
  // Implementation logic
}
```

### Markdown Documentation

- Use unified document templates
- Keep code examples in documents format consistent
- Clear document structure with well-defined hierarchy
- Use relative paths to reference other documents

## Performance Optimization Specifications

### Frontend Performance

- Use appropriate formats and sizes for image resources
- Use code splitting appropriately
- Avoid unnecessary re-renders
- Use React.memo to optimize component performance
- Use lazy loading to reduce initial loading time

### Network Performance

- Set HTTP caching appropriately
- Reduce the number of HTTP requests
- Use CDN to accelerate static resources
- Enable Gzip compression

### Code Optimization

- Use Tree Shaking to remove unused code
- Optimize package size, remove unnecessary dependencies
- Use Web Workers to handle computation-intensive tasks

## Troubleshooting

### Common Issues

1. **Dependency Installation Failure**

   ```bash
   # Clear cache and reinstall
   pnpm reinstall
   ```

2. **Development Server Startup Failure**
   - Check if port is occupied
   - Confirm environment variable configuration is correct
   - View error logs to locate problems

3. **Build Failure**
   - Check TypeScript type errors
   - Confirm all dependencies are installed
   - View build logs for detailed information

### Development Tools

The project provides rich development tools:

- **Code Checking**: ESLint, Stylelint
- **Formatting**: Prettier
- **Testing**: Jest, Cypress
- **Building**: Turbo, Vite
- **Documentation**: VitePress

Following these specifications helps improve code quality, reduce maintenance costs, and enhance team collaboration efficiency.
