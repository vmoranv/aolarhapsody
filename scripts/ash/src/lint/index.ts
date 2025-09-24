import type { CAC } from 'cac';
import { execa } from 'execa';

/**
 * @description 定义 lint 命令
 * @param {CAC} cli - CAC 实例
 */
export function defineLintCommand(cli: CAC) {
  cli
    .command('lint', 'Lint all files')
    .option('--format', 'Format files with Prettier')
    .action(async (options: { format?: boolean }) => {
      const { format } = options;
      try {
        if (format) {
          await execa('eslint', ['**/*.{js,mjs,cjs,ts,tsx,vue}', '--fix'], { stdio: 'inherit' });
        } else {
          await execa('eslint', ['**/*.{js,mjs,cjs,ts,tsx,vue}'], {
            stdio: 'inherit',
          });
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(`Error during linting: ${error.message}`);
        } else {
          console.error('An unknown error occurred during linting.');
        }
        process.exit(1);
      }
    });
}
