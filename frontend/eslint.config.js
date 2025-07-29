import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';

/**
 * ESLint configuration for the frontend.
 */
export default tseslint.config([
  // Ignore the 'dist' directory
  globalIgnores(['dist']),
  {
    // Apply to all TypeScript and TSX files
    files: ['**/*.{ts,tsx}'],
    // Extend recommended configurations
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    // Language options
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
]);
