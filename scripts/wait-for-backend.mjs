import waitOn from 'wait-on';
import { exec } from 'child_process';

const backendUrl = 'http://localhost:3000';

const opts = {
  resources: [backendUrl],
  delay: 1000, // initial delay in ms, default 0
  interval: 100, // poll interval in ms, default 250ms
  timeout: 30000, // timeout in ms, default Infinity
  tcpTimeout: 1000, // tcp timeout in ms, default 300ms
  window: 1000, // stabilization time in ms, default 750ms
};

async function waitForBackend() {
  try {
    await waitOn(opts);
    console.log(`Backend is ready at ${backendUrl}. Starting frontend...`);
    const frontend = exec('pnpm dev:front');

    frontend.stdout.on('data', (data) => {
      console.log(`[frontend] ${data}`);
    });

    frontend.stderr.on('data', (data) => {
      console.error(`[frontend] stderr: ${data}`);
    });

    frontend.on('close', (code) => {
      console.log(`[frontend] exited with code ${code}`);
    });
  } catch (err) {
    console.error('Error waiting for backend:', err);
    process.exit(1);
  }
}

waitForBackend();