import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { intro, outro, select, spinner } from '@clack/prompts';
import { execa } from 'execa';
import cac from 'cac';

const cli = cac('ar-turbo');

async function getPackages(rootDir: string) {
  const packageJsonPath = join(rootDir, 'package.json');
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
  const workspaces = packageJson.workspaces || [];

  const packages = [];
  for (const workspace of workspaces) {
    // This is a simplified glob, for real world use a glob library
    if (workspace.endsWith('/*')) {
      const dir = join(rootDir, workspace.slice(0, -2));
      const subdirs = await fs.readdir(dir, { withFileTypes: true });
      for (const subdir of subdirs) {
        if (subdir.isDirectory()) {
          const pkgJsonPath = join(dir, subdir.name, 'package.json');
          try {
            const pkgJson = JSON.parse(await fs.readFile(pkgJsonPath, 'utf-8'));
            packages.push({ name: pkgJson.name, path: join(dir, subdir.name) });
          } catch {
            // ignore folders without package.json
          }
        }
      }
    }
  }
  return packages;
}

cli
  .command('[script]', 'Run a script in one or more packages')
  .action(async (script) => {
    intro(`turbo-run: ${script}`);

    const rootDir = process.cwd();
    const allPackages = await getPackages(rootDir);

    const targetPackage = await select({
      message: `Select a package to run '${script}' script`,
      options: allPackages.map(p => ({ value: p.name, label: p.name })),
    });

    if (targetPackage) {
      const s = spinner();
      s.start(`Running '${script}' in ${targetPackage}...`);

      try {
        await execa('pnpm', ['--filter', targetPackage, script], { stdio: 'inherit' });
        s.stop(`Successfully ran '${script}' in ${targetPackage}.`);
      } catch (e: unknown) {
        s.stop(`Failed to run '${script}' in ${targetPackage}.`);
        if (e instanceof Error) {
          console.error(e.message);
        } else {
          console.error(e);
        }
      }
    }

    outro('Done.');
  });

cli.help();
cli.parse();
