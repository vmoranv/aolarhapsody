import waitOn from 'wait-on';
import { spawn } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';

// Load backend .env file
dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') });

const port = process.env.PORT || 3000;
const backendUrl = `http://localhost:${port}`;

console.log(`Backend URL: ${backendUrl}`);

// 忽略代理设置，防止本地连接被代理拦截
process.env.no_proxy = 'localhost,127.0.0.1';

const opts = {
  resources: [backendUrl],
  delay: 1000, // initial delay in ms, default 0
  interval: 100, // poll interval in ms, default 250ms
  timeout: 120000, // timeout in ms, default Infinity (增加到2分钟)
  tcpTimeout: 1000, // tcp timeout in ms, default 300ms
  window: 1000, // stabilization time in ms, default 750ms
  verbose: false, // 关闭详细日志以减少刷屏
  log: false // 关闭日志以减少刷屏
};

async function waitForBackend() {
  console.log(`Waiting for backend at ${backendUrl}...`);
  
  try {
    await waitOn(opts);
    console.log(`Backend is ready at ${backendUrl}. Starting frontend...`);
    
    // 直接启动前端开发服务器
    const frontend = spawn('pnpm', ['--filter', 'frontend', 'dev'], {
      stdio: 'inherit',
      shell: true
    });

    frontend.on('close', (code) => {
      console.log(`[frontend] exited with code ${code}`);
      process.exit(code);
    });
    
    frontend.on('error', (err) => {
      console.error('[frontend] error:', err);
      process.exit(1);
    });
  } catch (err) {
    console.error('Error waiting for backend:', err);
    process.exit(1);
  }
}

waitForBackend();