import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

/**
 * @file ESLint "flat" configuration for the entire project.
 * @description This configuration file sets up ESLint for linting TypeScript and TSX files
 * in both the frontend and backend directories. It uses the modern "flat" config format.
 *
 * It integrates several plugins:
 * - `@eslint/js`: Core JavaScript rules.
 * - `typescript-eslint`: For TypeScript-specific linting.
 * - `eslint-plugin-react-hooks`: Enforces React Hooks best practices.
 * - `eslint-plugin-react-refresh`: Supports Vite's Fast Refresh feature.
 * - `eslint-plugin-simple-import-sort`: Automatically sorts imports and exports.
 *
 * @see https://eslint.org/docs/latest/use/configure/configuration-files-new
 */
export default tseslint.config([
  // 1. Global ignores
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/*.d.ts'],
  },
  // 2. Main configuration for TypeScript/TSX files
  {
    files: ['frontend/**/*.{ts,tsx}', 'backend/**/*.ts'],
    // Extends recommended configurations from plugins
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-refresh': reactRefresh,
      'simple-import-sort': simpleImportSort,
    },
    // Custom rule settings
    rules: {
      // Warns if a file that exports only components has a non-component export
      'react-refresh/only-export-components': 'warn',
      // Allows the use of `any` type, useful for gradual typing
      '@typescript-eslint/no-explicit-any': 'off',
      // Allows common types like `Function` or `{}`
      '@typescript-eslint/ban-types': 'off',
      // Allows non-null assertions (`!`)
      '@typescript-eslint/no-non-null-assertion': 'off',
      // Disabled for flexibility, but can be enabled for stricter hook usage
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'off',
      // Disallows `console.log` and `console.debug`, but allows `warn` and `error`
      'no-console': ['error', { allow: ['warn', 'error'] }],
      // Configures the import sorting rule with custom groups
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            [
              // Packages `react` related packages come first.
              '^react',
              // Other packages.
              '^@?\\w',
              // Absolute imports and other imports.
              '^@(/.*|$)',
              // Project-specific absolute imports.
              '^@/assets$',
              '^@/components$',
              '^@/config$',
              '^@/hooks$',
              '^@/plugins$',
              '^@/routers$',
              '^@/store$',
              '^@/styles$',
              '^@/utils$',
              // Parent imports.
              '^\\.\\.(?!/?$)',
              '^\\.\\./?$',
              // Other relative imports.
              '^\\./(?=.*/)(?!/?$)',
              '^\\.(?!/?$)',
              '^\\./?$',
              // Style imports.
              '^.+\\.?(css|less|scss)$',
              // Side effect imports.
              '^\\u0000',
            ],
          ],
        },
      ],
      // Enforces sorting of exports
      'simple-import-sort/exports': 'error',
      // Disabled because simple-import-sort handles it
      'import/order': 'off',
    },
  },
]);