import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { intro, outro, select, spinner } from '@clack/prompts';
import { execa } from 'execa';
import cac from 'cac';

const cli = cac('ar-turbo');

async function getPackages(rootDir: string) {
  const workspaceYamlPath = join(rootDir, 'pnpm-workspace.yaml');
  const packages = [];

  try {
    const workspaceYamlContent = await fs.readFile(workspaceYamlPath, 'utf-8');
    const lines = workspaceYamlContent.split('\n');
    let inPackagesSection = false;
    const packageGlobs = [];

    for (const line of lines) {
      if (line.trim() === 'packages:') {
        inPackagesSection = true;
        continue;
      }
      if (inPackagesSection) {
        if (line.trim().startsWith('-')) {
          packageGlobs.push(line.trim().substring(1).trim().replace(/'/g, ''));
        } else if (line.trim() !== '' && !line.startsWith('  ')) {
          break;
        }
      }
    }

    for (const glob of packageGlobs) {
      if (glob.endsWith('/*')) {
        const dir = join(rootDir, glob.slice(0, -2));
        const subdirs = await fs.readdir(dir, { withFileTypes: true });
        for (const subdir of subdirs) {
          if (subdir.isDirectory()) {
            const pkgJsonPath = join(dir, subdir.name, 'package.json');
            try {
              const pkgJson = JSON.parse(await fs.readFile(pkgJsonPath, 'utf-8'));
              packages.push({
                name: pkgJson.name,
                path: join(dir, subdir.name),
                value: pkgJson.name,
                label: pkgJson.name,
              });
            } catch {
              // ignore
            }
          }
        }
      } else {
        const pkgJsonPath = join(rootDir, glob, 'package.json');
        try {
          const pkgJson = JSON.parse(await fs.readFile(pkgJsonPath, 'utf-8'));
          packages.push({
            name: pkgJson.name,
            path: join(rootDir, glob),
            value: pkgJson.name,
            label: pkgJson.name,
          });
        } catch {
          // ignore
        }
      }
    }
  } catch (error) {
    console.error('Error reading or parsing pnpm-workspace.yaml:', error);
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
      options: allPackages,
    });

    if (targetPackage) {
      const s = spinner();
      s.start(`Running '${script}' in ${targetPackage}...`);

      const subprocess = execa('pnpm', ['--filter', targetPackage, script], {
        stdio: 'inherit',
        killSignal: 'SIGTERM'
      });

      // Handle Ctrl+C gracefully
      const handleExit = async () => {
        s.stop('Received interrupt signal. Terminating subprocess...');
        try {
          subprocess.kill('SIGTERM');
          // Give the process 2 seconds to terminate gracefully
          setTimeout(() => {
            if (!subprocess.killed) {
              subprocess.kill('SIGKILL');
            }
          }, 2000);
        } catch (e) {
          console.error(e);
        }
        process.exit(0);
      };

      process.on('SIGINT', handleExit);
      process.on('SIGTERM', handleExit);

      // Windows specific handling
      if (process.platform === 'win32') {
        process.on('SIGBREAK', handleExit);
      }

      try {
        await subprocess;
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
