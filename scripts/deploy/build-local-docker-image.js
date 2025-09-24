#!/usr/bin/env node
/**
 * @file 本地 Docker 镜像构建脚本
 * @description 该脚本用于在本地环境中方便地构建和启动项目所需的 Docker 容器。
 * 它会自动确定项目根目录，并执行 `docker-compose up --build -d` 命令。
 *
 * @module scripts/deploy/build-local-docker-image
 * @requires child_process
 * @requires os
 * @requires path
 * @requires url
 */

import { exec } from 'child_process';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * 获取当前 ES 模块的文件路径和目录路径。
 * @constant {string} __filename - 当前文件的绝对路径。
 * @constant {string} __dirname - 当前文件所在目录的绝对路径。
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 项目的根目录路径。
 * @constant {string} projectRoot
 */
const projectRoot = path.join(__dirname, '..', '..');

console.log(`🚀 Starting Docker build on ${os.platform()} platform...`);
console.log(`📁 Project root: ${projectRoot}`);

/**
 * 要执行的 docker-compose 命令。
 * `--build` 标志确保在启动前重新构建镜像。
 * `-d` 标志使容器在后台（分离模式）运行。
 * @constant {string} command
 */
const command = 'docker-compose up --build -d';
console.log(`🔧 Executing: ${command}`);

/**
 * 执行 docker-compose 命令并处理其输出。
 * @param {string} command - 要执行的命令。
 * @param {object} options - `exec` 函数的选项，此处用于指定工作目录。
 * @param {Function} callback - 命令执行完成后的回调函数。
 *   @param {Error | null} error - 如果命令执行失败，则为 Error 对象。
 *   @param {string} stdout - 命令的标准输出。
 *   @param {string} stderr - 命令的标准错误输出。
 */
exec(command, { cwd: projectRoot }, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error('❌ Stack:', error.stack);
    }
    process.exit(1);
  }

  if (stdout) {
    console.log(stdout);
  }

  if (stderr) {
    console.error('⚠️  Warnings/Errors:');
    console.error(stderr);
  }

  console.log('✅ Docker containers built and started successfully.');
  console.log('🌐 Frontend: http://localhost:61444');
  console.log('🔧 Backend: http://localhost:3000');
});
