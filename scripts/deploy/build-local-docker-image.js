#!/usr/bin/env node

import { exec } from 'child_process';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..', '..');

console.log(`🚀 Starting Docker build on ${os.platform()} platform...`);
console.log(`📁 Project root: ${projectRoot}`);

// Run docker-compose directly
const command = 'docker-compose up --build -d';
console.log(`🔧 Executing: ${command}`);

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
