import cac from 'cac';
import { run } from './run.js';

/**
 * @description 创建 CLI 工具
 */
const cli = cac('ar-turbo');

cli
  .command('[script]', 'Run a script in one or more packages')
  .allowUnknownOptions()
  .action(async (script: string | undefined) => {
    if (!script) {
      console.error('Please provide a script to run.');
      cli.outputHelp();
      process.exit(1);
    }
    await run({ script });
  });

cli.help();
cli.parse();
