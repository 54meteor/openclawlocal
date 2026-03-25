#!/usr/bin/env node
/**
 * 跨平台构建入口脚本
 * 根据操作系统选择合适的构建策略
 */

import { execSync } from 'node:child_process';
import { platform } from 'node:process';

const isWindows = platform === 'win32';

console.log(`🔧 检测到平台：${isWindows ? 'Windows' : 'Unix-like'}`);

try {
  if (isWindows) {
    console.log('📦 使用 Windows 兼容构建模式...');
    // Windows 环境下跳过 bash 脚本，直接执行核心构建步骤
    execSync('pnpm build:windows', { stdio: 'inherit' });
  } else {
    console.log('📦 使用标准构建模式...');
    // Unix-like 环境下执行完整构建
    execSync('tsdown && pnpm build:plugin-sdk:dts && node --import tsx scripts/write-plugin-sdk-entry-dts.ts && node --import tsx scripts/canvas-a2ui-copy.ts && node --import tsx scripts/copy-hook-metadata.ts && node --import tsx scripts/copy-export-html-templates.ts && node --import tsx scripts/write-build-info.ts && node --import tsx scripts/write-cli-compat.ts', { stdio: 'inherit' });
  }
  
  console.log('✅ 构建成功完成！');
} catch (error) {
  console.error('❌ 构建失败:', error.message);
  process.exit(1);
}
