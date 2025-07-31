// 导入必要的模块
import express, { Express, Request, Response } from 'express';
import cors from 'cors';

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
      // 从键名中提取模块名用于日志记录
      const friendlyName = moduleName.replace('init', '').replace('Module', '');
      console.error(`${friendlyName} 数据模块初始化失败！`);
      process.exit(1);
    }
  }

  const server = app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
  });

  // 优雅地关闭服务器
  process.on('SIGINT', () => {
    console.log('收到 SIGINT 信号，正在关闭服务器...');
    server.close(() => {
      console.log('服务器已关闭。');
      process.exit(0);
    });
  });
}

startServer();
