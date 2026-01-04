# Coding Standards

To ensure code quality and team collaboration efficiency, Aolarhapsody has established the following coding standards.

## Code Standards

### TypeScript/JavaScript Standards

1. Use TypeScript for development to ensure type safety
2. Follow ESLint rules to maintain consistent code style
3. Use Prettier for code formatting
4. Function and variable naming uses camelCase
5. Class and component naming uses PascalCase
6. Constants use UPPER_CASE with underscores
7. Use import/export reasonably, avoid circular dependencies
8. Prefer const over let, avoid using var
9. Pay attention to this binding when using arrow functions

### CSS Standards

1. Use Tailwind CSS for style development
2. Follow BEM naming conventions when writing custom CSS in special cases
3. Mobile-first responsive design
4. Write CSS properties in recommended order (positioning, box model, typography, visual, others)
5. Avoid using !important unless absolutely necessary
6. Use CSS variables for theme and reusable style management

### React Standards

1. Functional components are preferred over class components
2. Use Hooks reasonably
3. Component splitting should be reasonable, maintaining single responsibility
4. Use TypeScript to define component Props and State
5. Component names must use PascalCase
6. Props interfaces should end with Props, like ButtonProps
7. Use React.memo to optimize pure components
8. Custom Hooks should start with use, like useUserData
9. Avoid writing complex logic in JSX, extract to functions or variables

## Tool Configuration Standards

### ESLint Configuration

ESLint is a code standards and error checking tool used to identify and report syntax errors in TypeScript code.

#### Common Commands

```bash
# Check all files
pnpm eslint .

# Auto-fix fixable issues
pnpm eslint . --fix
```

#### Configuration Files

- ESLint configuration file: `eslint.config.mjs` or `.eslintrc.js`
- Core configuration located in project internal configuration directory
- Recommended to use `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin`

#### Resolving Prettier and ESLint Conflicts

Use `eslint-plugin-prettier` and `eslint-config-prettier` to resolve conflicts:

```bash
npm install -D eslint-plugin-prettier eslint-config-prettier
```

Add to `.eslintrc.js`:

```javascript
{
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:prettier/recommended"  // Add prettier plugin
  ],
  "plugins": ["prettier"]
}
```

### Stylelint Configuration

Stylelint is used to check the style of CSS within the project. Combined with editor auto-fix, it can effectively unify the CSS style within the project.

#### Common Commands

```bash
# Check style files
pnpm stylelint "**/*.{vue,css,less,scss}"

# Auto-fix
pnpm stylelint "**/*.{vue,css,less,scss}" --fix
```

#### Configuration Files

- Stylelint configuration file: `stylelint.config.mjs` or `.stylelintrc.js`
- Recommended configuration: `stylelint-config-standard`, `stylelint-config-recess-order`

### Prettier Configuration

Prettier can be used to unify project code style, unified indentation, single/double quotes, trailing commas, etc.

#### Common Commands

```bash
# Format all files
pnpm prettier .

# Check format (without modifying files)
pnpm prettier --check .
```

#### Configuration Files

- Prettier configuration file: `.prettierrc` or `.prettier.mjs`
- Recommended configuration: use 2-space indentation, single quotes, trailing commas, etc.

### Commitlint Configuration

Commitlint is used to check git commit message specifications.

#### Installation

```bash
npm install -D @commitlint/config-conventional @commitlint/cli
```

#### Configuration File

Create `commitlint.config.js` in the project root:

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
```

### Cspell Configuration

Cspell is a tool used to check spelling errors, which can check spelling errors in code and avoid bugs caused by spelling errors.

#### Common Commands

```bash
# Check spelling errors
pnpm cspell lint "**/*.ts" "**/README.md" ".changeset/*.md" --no-progress
```

#### Configuration Files

- Configuration file: `cspell.json`
- Can add project-specific vocabulary

### Publint Configuration

Publint is a tool used to check npm package specifications, which can check whether the package version number complies with specifications and whether it complies with standard ESM specification packages, etc.

#### Common Commands

```bash
# Check package specifications
pnpm publint
```

## Git Hook Management

### Lefthook Configuration

Lefthook is used to manage Git hooks, automatically running code checks and formatting before commits.

#### Configuration File

The project defines corresponding hooks in `lefthook.yml`:

```yaml
pre-commit:
  parallel: true
  jobs:
    - name: lint-js
      run: pnpm prettier --cache --ignore-unknown --write {staged_files}
      glob: '*.{js,jsx,ts,tsx}'
    - name: lint-style
      run: pnpm stylelint --fix {staged_files}
      glob: '*.{css,less,scss}'
    - name: lint-md
      run: pnpm prettier --write {staged_files}
      glob: '*.md'

commit-msg:
  commands:
    - name: commitlint
      run: pnpm commitlint --edit {1}

post-merge:
  commands:
    - name: install
      run: pnpm install
```

#### Disabling Lefthook

**Temporary disable**:

```bash
git commit -m "feat: add home page" --no-verify
```

**Permanent disable**:
Delete the `lefthook.yml` file.

### Husky Alternative

If using Husky instead of Lefthook, the configuration is similar:

#### Installation and Initialization

```bash
# Install husky
pnpm add -D husky

# Initialize
pnpm exec husky install

# Add pre-commit hook
pnpm exec husky add .husky/pre-commit "pnpm lint-staged"

# Add commit-msg hook
pnpm exec husky add .husky/commit-msg "pnpm commitlint --edit \$1"
```

#### Lint-staged Configuration

Add to `package.json`:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,less,scss}": ["stylelint --fix", "prettier --write"],
    "*.md": ["prettier --write"]
  }
}
```

## Git Commit Standards

### Commit Format

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### Type Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation update
- `style`: Code format adjustment (changes that do not affect code operation)
- `refactor`: Refactoring (code changes that are neither new features nor bug fixes)
- `perf`: Performance optimization
- `test`: Add tests
- `chore`: Build process or auxiliary tool changes
- `revert`: Rollback commit
- `workflow`: Workflow improvements
- `ci`: Continuous integration
- `types`: Type modifications

### Scope Range

Scope is used to explain the range affected by commit, which can be:

- `frontend`: Frontend related
- `backend`: Backend related
- `docs`: Documentation related
- `scripts`: Scripts related
- `config`: Configuration related
- `deps`: Dependencies related
- `ui`: UI component related
- `api`: API interface related

### Commit Message Examples

```bash
# New feature
feat(auth): add user login functionality

# Bug fix
fix(api): resolve user data parsing error

# Documentation update
docs(readme): update installation instructions

# Performance optimization
perf(components): optimize image loading with lazy loading

# Refactoring
refactor(utils): simplify date formatting functions
```

### Disabling Commit Specification Check

**Temporary disable**:

```bash
git commit -m "feat: add home page" --no-verify
```

**Permanent disable**:
Comment out the following code in `.husky/commit-msg`:

```bash
# pnpm exec commitlint --edit "$1"
```

## Code Review Standards

1. All code must be reviewed by at least one other developer
2. PR descriptions should clearly explain the content and purpose of changes
3. Follow team-agreed code style
4. Ensure tests pass
5. Focus on code readability and maintainability

## Testing Standards

1. New features need corresponding unit tests
2. Regression tests need to be added after fixing bugs
3. Test code should maintain the same quality standards as business code
4. Use Jest for unit testing
5. Use React Testing Library for component testing

## Documentation Standards

1. New features need corresponding documentation
2. API interfaces need detailed interface documentation
3. Important design decisions should be documented
4. Documentation should be updated synchronously with code

## Project Structure Standards

1. Follow established directory structure
2. File naming should be clear and descriptive
3. Component and module splitting should be reasonable
4. Avoid circular dependencies

## Performance Optimization Standards

1. Image resources need compression
2. Use lazy loading reasonably
3. Avoid unnecessary re-renders
4. Use caching strategies reasonably
5. Use React.memo and useMemo to optimize component performance
6. Code splitting and dynamic imports to reduce initial loading time
7. Use Web Workers to handle computation-intensive tasks
8. Optimize package size, remove unused dependencies

## Engineering Best Practices

### Code Quality Assurance

1. **Automated Checks**: Ensure code quality before commits through Git Hooks
2. **Continuous Integration**: Integrate code checks in CI/CD processes
3. **Code Coverage**: Maintain reasonable test coverage
4. **Performance Monitoring**: Regularly conduct performance testing and monitoring

### Team Collaboration

1. **Code Review**: All code must be reviewed by at least one other developer
2. **Documentation Synchronization**: Update related documentation when code changes
3. **Knowledge Sharing**: Regular technical sharing and best practice exchanges
4. **Tool Unification**: Team members use unified development tools and configurations

### Project Maintenance

1. **Dependency Management**: Regularly update dependencies, fix security vulnerabilities
2. **Code Refactoring**: Regularly clean up technical debt
3. **Version Management**: Follow semantic version control specifications
4. **Backup Strategy**: Ensure secure backup of code and data

## Development Environment Configuration

### Required VSCode Plugins

To ensure development efficiency and code quality, the following VSCode plugins are recommended:

1. **ESLint** - Script code checking
2. **Prettier** - Code formatting
3. **Stylelint** - CSS formatting
4. **TypeScript Importer** - Auto import TypeScript modules
5. **Auto Rename Tag** - Auto rename paired HTML/XML tags
6. **Bracket Pair Colorizer** - Bracket pair colorization
7. **GitLens** - Enhanced Git functionality
8. **Code Spell Checker** - Word spell checking

### Project Initialization Checklist

When setting up new projects or new environments, please check the following items:

1. [ ] Install all required dependencies
2. [ ] Configure ESLint and Prettier
3. [ ] Set up Git Hooks (Lefthook/Husky)
4. [ ] Configure Commitlint
5. [ ] Install VSCode plugins
6. [ ] Configure workspace settings
7. [ ] Run tests to ensure environment is normal
8. [ ] Check if code formatting works properly

## Troubleshooting

### Common Issues

1. **ESLint and Prettier conflicts**
   - Ensure `eslint-config-prettier` is installed
   - Check configuration file loading order

2. **Git Hooks not working**
   - Check if there are execution permissions
   - Confirm Git version compatibility
   - Reinitialize Git Hooks

3. **Commitlint validation failure**
   - Check if commit message format complies with specifications
   - Confirm configuration file path is correct

4. **Stylelint errors**
   - Check if CSS syntax is correct
   - Confirm syntax parser settings in configuration file

## Summary

Following these standards helps improve code quality, team collaboration efficiency, and project maintainability. The formulation and execution of standards is a continuous improvement process. Teams should regularly review and update these standards based on actual project conditions and member feedback.

Remember: **Standards are for improving efficiency, not restricting creativity**. In special cases, flexible adjustments can be made according to actual needs, but team consensus and documentation are required.
