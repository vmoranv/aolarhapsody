// 导入必要的模块
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import cron from 'node-cron';
import { initializers, refreshUserPetsData, reloadData } from './dataparse/index';
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

// 为所有路由启用CORS，从环境变量中读取允许的多个前端域名
const frontendUrls = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(',').map((url) => url.trim())
  : [];

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
        return callback(new Error('Not allowed by CORS'));
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

// 添加JSON解析错误处理中间件 - 放在所有路由之后
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    console.error('JSON解析错误:', err.message);
    console.error('请求体原始内容:', req.body);
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

  // 执行宠物数据结构迁移（如果有需要）
  try {
    const { migratePetDataToNewStructure } = await import('./dataparse/petexchange');
    await migratePetDataToNewStructure();
  } catch (error) {
    console.error('宠物数据结构迁移失败:', error);
  }

  const listenWithRetry = (portToTry: number) => {
    const server = app.listen(portToTry, async () => {
      console.warn(`Backend is ready at http://localhost:${portToTry}`);

      // 首先，在服务器启动时加载一次数据
      await reloadData();

      // 然后，安排每日刷新任务
      cron.schedule(
        '0 4 * * *',
        async () => {
          console.warn('执行每日数据刷新任务...');
          try {
            // 刷新基础游戏数据
            await reloadData();

            // 刷新所有用户宠物信息（分批处理，每批10个用户，间隔1秒）
            console.warn('开始刷新用户宠物信息...');
            await refreshUserPetsData(10, 1000);

            console.warn('每日数据刷新任务完成');
          } catch (error) {
            console.error('每日数据刷新任务执行失败:', error);
          }
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
