// 导入必要的模块
import cors from 'cors';
import express, { Express, Request, Response } from 'express';
// 导入模块
import { initializers } from './dataparse';
import allRoutes from './routes';
import * as allTypes from './types';

// 导出所有类型
export { allTypes };

// 创建Express应用
const app: Express = express();
const port = 3000;

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
  for (const moduleName in initializers) {
    const initFunction = initializers[moduleName as keyof typeof initializers];
    const success = await initFunction();
    if (!success) {
      process.exit(1);
    }
  }

  const server = app.listen(port, () => {});

  // 优雅地关闭服务器
  process.on('SIGINT', () => {
    server.close(() => {
      process.exit(0);
    });
  });
}

startServer();
