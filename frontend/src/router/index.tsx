import { useRoutes } from 'react-router-dom';
import { constantRoutes } from './routes';

// 创建一个可以被 React 应用程序使用的路由实例
const Router = () => {
  return useRoutes(constantRoutes);
};

export default Router;
