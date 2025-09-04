// 导入必要的模块
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import cron from 'node-cron';
import { initializers, reloadData } from './dataparse/index';
import { initializeMonitors } from './dataparse/subclasschecker';
import allRoutes from './routes';
import * as allTypes from './types';

// 导出所有类型
export { allTypes };

// 配置dotenv
dotenv.config();

// 创建Express应用
const app: Express = express();
const port = process.env.PORT || 3000;

// 为所有路由启用CORS
app.use(cors());
// 解析JSON请求体
app.use(express.json());

// 根路由端点
app.get('/', (req: Request, res: Response) => {
  res.send('你好，世界！');
});

// 统一使用路由
allRoutes.forEach((route) => {
  app.use('/api', route);
});

// =================================
// 服务器启动
// =================================
async function startServer() {
  // 遍历 initializers 对象中的所有初始化函数
  await initializeMonitors();
  const initPromises = initializers.map((init) => init());
  await Promise.all(initPromises);

  const listenWithRetry = (portToTry: number) => {
    const server = app.listen(portToTry, async () => {
      console.warn(`Backend is ready at http://localhost:${portToTry}`);

      // 首先，在服务器启动时加载一次数据
      await reloadData();

      // 然后，安排每日刷新任务
      cron.schedule(
        '0 4 * * *',
        () => {
          console.warn('执行每日数据刷新任务...');
          reloadData();
        },
        {
          timezone: 'Asia/Shanghai',
        }
      );
    });

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`Port ${portToTry} is in use, trying ${portToTry + 1}...`);
        setTimeout(() => {
          server.close();
          listenWithRetry(portToTry + 1);
        }, 100); // 短暂延迟后重试
      } else {
        console.error('Server error:', err);
      }
    });

    // 优雅地关闭服务器
    process.on('SIGINT', () => {
      server.close(() => {
        process.exit(0);
      });
    });
  };

  listenWithRetry(Number(port));
}

startServer();
