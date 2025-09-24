import type { CAC } from 'cac';
import { execa } from 'execa';

/**
 * @description 定义 publint 命令
 * @param {CAC} cli - CAC 实例
 */
export function definePubLintCommand(cli: CAC) {
  cli.command('publint', 'Check package public files').action(async () => {
    try {
      await execa('pnpm', ['lint:publint'], { stdio: 'inherit' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error during publint: ${error.message}`);
      } else {
        console.error('An unknown error occurred during publint.');
      }
      process.exit(1);
    }
  });
}
