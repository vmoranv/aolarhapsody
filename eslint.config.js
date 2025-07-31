import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

/**
 * ESLint configuration for the project.
 */
export default tseslint.config([
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/*.d.ts'],
  },
  {
    // Apply to all TypeScript and TSX files
    files: ['frontend/**/*.{ts,tsx}'],
    // Extend recommended configurations
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
    ],
    // Language options
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-refresh': reactRefresh,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'react-refresh/only-export-components': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            [
              '^@?\\w',
              '^@(/.*|$)',
              `^@/assets$`,
              `^@/components$`,
              `^@/config$`,
              `^@/hooks$`,
              `^@/plugins$`,
              `^@/routers$`,
              `^@/store$`,
              `^@/styles$`,
              `^@/utils$`,
              '^\\.\\.(?!/?$)',
              '^\\.\\./?$',
              '^\\./(?=.*/)(?!/?$)',
              '^\\.(?!/?$)',
              '^\\./?$',
              '^.+\\.?(css|less|scss)$',
              '^\\u0000',
            ],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      'import/order': 'off',
    },
  },
]);