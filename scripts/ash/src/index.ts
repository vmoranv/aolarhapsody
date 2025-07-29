import { cac } from 'cac';
import { version } from '../package.json';
import { defineLintCommand } from './lint';
import { definePubLintCommand } from './publint';

async function main(): Promise<void> {
  try {
    const cli = cac('ash');

    // Register commands
    defineLintCommand(cli);
    definePubLintCommand(cli);

    // Handle invalid commands
    cli.on('command:*', ([cmd]) => {
      console.error(`Invalid command: ${cmd}`);
      process.exit(1);
    });

    // Set up CLI
    cli.usage('ash <command> [options]');
    cli.help();
    cli.version(version);

    // Parse arguments
    cli.parse();
  } catch (error) {
    console.error('An unexpected error occurred:');
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Failed to start CLI:');
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }
  process.exit(1);
});
