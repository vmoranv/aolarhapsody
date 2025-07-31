import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { intro, outro, select, spinner, isCancel, cancel } from '@clack/prompts';
import { execa } from 'execa';

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

interface RunOptions {
  script: string;
}

export async function run(options: RunOptions) {
  const { script } = options;
  intro(`turbo-run: ${script}`);

  const rootDir = process.cwd();
  const allPackages = await getPackages(rootDir);

  const targetPackage = await select({
    message: `Select a package to run '${script}' script`,
    options: allPackages,
  });

  if (isCancel(targetPackage)) {
    cancel('👋 Has cancelled');
    process.exit(0);
  }

  if (targetPackage) {
    const s = spinner();
    s.start(`Running '${script}' in ${targetPackage}...`);

    try {
      const targetPackageData = allPackages.find((p) => p.value === targetPackage);
      if (!targetPackageData) {
        throw new Error(`Could not find package data for ${targetPackage}`);
      }

      const subprocess = execa('pnpm', ['exec', 'ts-node', 'index.ts'], {
        stdio: 'inherit',
        cwd: targetPackageData.path,
      });

      s.stop(`Successfully started '${script}' in ${targetPackage}.`);

      // Handle process exit
      const cleanup = () => {
        if (subprocess.pid) {
          subprocess.kill('SIGINT');
        }
      };

      process.on('SIGINT', cleanup);
      process.on('exit', cleanup);

      await subprocess;
    } catch (e: unknown) {
      s.stop(`Failed to run '${script}' in ${targetPackage}.`);
      if (e instanceof Error) {
        // Ignore cancellation errors
        if (!/was killed with SIGINT/.test(e.message)) {
          console.error(e.message);
          process.exit(1);
        }
      } else {
        console.error(e);
        process.exit(1);
      }
    }
  }

  outro('Done. The script is running in the background.');
}
