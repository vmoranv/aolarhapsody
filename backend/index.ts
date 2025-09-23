// 导入必要的模块
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import cron from 'node-cron';
import { fetchAndCacheBadWords } from './dataparse/badwordcheck';
import { initializers, reloadData } from './dataparse/index';
import { initializeMonitors } from './dataparse/subclasschecker';
import badWordCheckRoutes from './routes/badwordcheck';
import allRoutes from './routes';
import * as allTypes from './types';

// 导出所有类型
export { allTypes };

// 配置dotenv
dotenv.config();

// 创建Express应用
const app: Express = express();
const port = process.env.PORT || 3000;

// 为所有路由启用CORS，从环境变量中读取允许的多个前端域名
const frontendUrls = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(',').map((url) => url.trim())
  : [];

// 启动时输出CORS配置信息

// 如果没有配置允许的域名，添加一个默认的开发域名
if (frontendUrls.length === 0) {
  frontendUrls.push('http://localhost:3000', 'http://localhost:5173');
}

app.use(
  cors({
    origin: function (origin, callback) {
      // 允许没有 origin 的请求（比如移动端app、Postman等）
      if (!origin) {
        return callback(null, true);
      }

      // 检查请求的 origin 是否在允许的列表中
      if (frontendUrls.indexOf(origin) !== -1) {
        return callback(null, true);
      } else {
        return callback(
          new Error(
            `CORS: Origin ${origin} nt allowed. Allowed origins: ${frontendUrls.join(', ')}`
          )
        );
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
// 解析JSON请求体
app.use(
  express.json({
    strict: false, // 设置为false以允许更宽松的解析
    limit: '10mb',
  })
);

// 根路由端点
app.get('/', (req: Request, res: Response) => {
  res.send('你好，世界！');
});

// 统一使用路由
allRoutes.forEach((route) => {
  app.use('/api', route);
});
app.use('/api', badWordCheckRoutes);

// 添加JSON解析错误处理中间件 - 放在所有路由之后
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({
      error: 'Invalid JSON format',
      details: err.message,
    });
  }
  next();
});

// =================================
// 服务器启动
// =================================
async function startServer() {
  // 遍历 initializers 对象中的所有初始化函数
  await initializeMonitors();
  const initPromises = initializers.map((init) => init());
  await Promise.all(initPromises);
  await fetchAndCacheBadWords();

  const listenWithRetry = (portToTry: number) => {
    const server = app.listen(portToTry, async () => {
      // 首先，在服务器启动时加载一次数据
      await reloadData();

      // 然后，安排每日刷新任务
      cron.schedule(
        '0 4 * * *',
        async () => {
          try {
            // 刷新基础游戏数据
            await reloadData();
          } catch (error) {
            // 添加注释说明空代码块的用途，或者添加实际错误处理
            console.error('定时任务执行失败:', error);
          }
        },
        {
          timezone: 'Asia/Shanghai',
        }
      );
    });

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        setTimeout(() => {
          server.close();
          listenWithRetry(portToTry + 1);
        }, 100); // 短暂延迟后重试
      } else {
        // 添加实际的错误处理逻辑
        console.error('服务器启动错误:', err);
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
