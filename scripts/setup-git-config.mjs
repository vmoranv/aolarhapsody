#!/usr/bin/env node

import { execSync } from 'child_process';

/**
 * Git用户配置设置脚本
 * 用于检查和设置Git的用户名和邮箱配置
 */

console.log('检查当前Git用户配置...\n');

try {
  // 尝试获取当前用户名和邮箱
  const currentName = execSync('git config user.name', { encoding: 'utf8' }).trim();
  const currentEmail = execSync('git config user.email', { encoding: 'utf8' }).trim();
  
  console.log(`当前用户名: ${currentName}`);
  console.log(`当前邮箱: ${currentEmail}\n`);
  
  // 询问是否需要修改
  console.log('如果需要修改，请手动运行以下命令:');
  console.log('  全局配置:');
  console.log('    git config --global user.name "你的名字"');
  console.log('    git config --global user.email "你的邮箱@example.com"');
  console.log('');
  console.log('  项目配置:');
  console.log('    git config user.name "你的名字"');
  console.log('    git config user.email "你的邮箱@example.com"');
} catch (error) {
  console.log('未找到Git配置或Git未安装\n');
  console.log('请运行以下命令设置Git用户信息:');
  console.log('  全局配置:');
  console.log('    git config --global user.name "你的名字"');
  console.log('    git config --global user.email "你的邮箱@example.com"');
}

console.log('\n配置说明:');
console.log('- 全局配置适用于所有Git仓库');
console.log('- 项目配置仅适用于当前项目，会覆盖全局配置');
console.log('- 邮箱设置建议与GitHub等平台保持一致，以便正确关联贡献');