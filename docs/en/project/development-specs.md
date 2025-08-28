# Development Specifications

Aolarhapsody follows unified development specifications to ensure code quality and team collaboration efficiency.

## Code Specifications

### TypeScript Specifications

- Use TypeScript strict mode
- Clearly define types, avoid using any
- Use generics appropriately to improve code reusability
- Interface naming uses PascalCase, interface properties use camelCase

### React Specifications

- Component naming uses PascalCase
- Component file names should match component names
- Prefer functional components and Hooks
- Reasonably split components to maintain single responsibility

### CSS Specifications

- Use Tailwind CSS utility classes
- Avoid inline styles
- Use CSS Modules appropriately to prevent style conflicts
- Use breakpoint classes for responsive design

## Project Structure Specifications

### File Naming

- Component files: PascalCase, e.g., `UserCard.tsx`
- Utility files: camelCase, e.g., `formatDate.ts`
- Configuration files: kebab-case, e.g., `tailwind.config.js`

### Directory Structure

- Divide by functionality
- Avoid overly deep nesting levels
- Place related files in the same directory

## Git Commit Specifications

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Commit Types

- feat: New feature
- fix: Bug fix
- docs: Documentation update
- style: Code formatting adjustments
- refactor: Code refactoring
- test: Test-related
- chore: Build process or auxiliary tool changes

### Branch Management

- main: Main branch, stable version
- develop: Development branch
- feature/\*: Feature branches
- hotfix/\*: Hotfix branches

## Testing Specifications

### Unit Testing

- Key business logic needs unit test coverage
- Use Jest as the testing framework
- Test files are in the same directory as source files, named `*.test.ts`

### End-to-End Testing

- Key user flows need end-to-end testing
- Use Cypress for testing

## Documentation Specifications

### Code Comments

- Exported functions, classes, and interfaces need comments
- Add inline comments for complex logic
- Use TSDoc format

### Markdown Documentation

- Use unified document templates
- Keep code examples consistent in format
- Clear document structure with well-defined hierarchy

## Performance Optimization Specifications

### Frontend Performance

- Use appropriate formats and sizes for image resources
- Use code splitting appropriately
- Avoid unnecessary re-renders
- Use React.memo to optimize component performance

### Network Performance

- Set HTTP caching appropriately
- Reduce the number of HTTP requests
- Use CDN to accelerate static resources

Following these specifications helps improve code quality, reduce maintenance costs, and enhance team collaboration efficiency.
