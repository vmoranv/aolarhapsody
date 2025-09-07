#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 根据当前操作系统确定可构建的目标
const platform = os.platform();
const arch = os.arch();

// 检查是否在 CI 环境中
const isCI = process.env.CI || process.env.GITHUB_ACTIONS;

let targets = [];

if (isCI) {
  // 在 CI 环境中构建所有平台
  targets = [
    'aarch64-apple-darwin',
    'x86_64-apple-darwin',
    'x86_64-pc-windows-msvc',
    'x86_64-unknown-linux-gnu'
  ];
} else if (platform === 'darwin') {
  // macOS 可以构建 macOS 目标
  targets = [
    'aarch64-apple-darwin',
    'x86_64-apple-darwin'
  ];
} else if (platform === 'linux') {
  // Linux 可以构建 Linux 目标
  targets = [
    'x86_64-unknown-linux-gnu'
  ];
} else if (platform === 'win32') {
  // Windows 可以构建 Windows 目标
  targets = [
    'x86_64-pc-windows-msvc'
  ];
}

console.log('开始多平台 Tauri 构建...');
console.log(`当前平台: ${platform} ${arch}`);
console.log(`将构建目标: ${targets.join(', ')}`);

for (const target of targets) {
  console.log(`\n正在构建目标: ${target}`);
  try {
    execSync(`cd frontend && pnpm tauri build --target ${target}`, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    console.log(`✅ ${target} 构建成功`);
  } catch (error) {
    console.error(`❌ ${target} 构建失败:`, error.message);
    // 继续构建其他平台，而不是立即退出
    continue;
  }
}

console.log('\n🎉 构建完成！');