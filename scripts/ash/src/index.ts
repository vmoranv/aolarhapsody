/**
 * @file `ash` 命令行工具的入口文件。
 * @description
 * 该文件使用 `cac` 库来初始化一个命令行界面 (CLI) 应用程序。
 * 它的主要职责是：
 * 1. 创建 CLI 实例。
 * 2. 从其他模块导入并注册所有可用的命令 (如 `lint`, `publint`)。
 * 3. 配置 CLI 的基本信息，如用法、帮助文档和版本号。
 * 4. 解析命令行参数并执行相应的命令。
 * 5. 提供全局的错误处理机制。
 * @module scripts/ash
 */

import { cac } from 'cac';
import { version } from '../package.json';
import { defineLintCommand } from './lint';
import { definePubLintCommand } from './publint';

/**
 * 异步主函数，用于设置和运行 CLI 工具。
 * @async
 * @function main
 * @returns {Promise<void>}
 */
async function main(): Promise<void> {
  try {
    // 初始化一个名为 'ash' 的 CLI 应用程序
    const cli = cac('ash');

    // 从其他模块注册具体的命令
    defineLintCommand(cli);
    definePubLintCommand(cli);

    // 监听并处理未知的命令
    cli.on('command:*', ([cmd]) => {
      console.error(`错误：无效的命令 "${cmd}"`);
      process.exit(1);
    });

    // 配置 CLI 的用法、帮助信息和版本号
    cli.usage('ash <command> [options]');
    cli.help();
    cli.version(version);

    // 解析命令行参数并执行匹配的命令
    cli.parse();
  } catch (error) {
    console.error('发生了一个意外错误:');
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

// 执行主函数并捕获任何顶层错误
main().catch((error) => {
  console.error('启动 CLI 失败:');
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }
  process.exit(1);
});
