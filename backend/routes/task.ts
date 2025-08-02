import express, { Request, Response } from 'express';
import {
  getAllAreaConfigs,
  getAllBitTitles,
  getAllDefines,
  getAllNpcNames,
  getAllStarters,
  getAllSubTitles,
  getOrderInArea,
  getTaskDefineById,
  getTaskStarterById,
} from '../dataparse/task';

const router = express.Router();

// =================================
// 剧情定义 (Defines)
// =================================

/**
 * @route GET /tasks/defines
 * @description 获取所有剧情定义
 * @returns {object} 200 - 成功获取剧情定义列表
 */
router.get('/tasks/defines', (req: Request, res: Response) => {
  const defines = getAllDefines();
  res.json({
    success: true,
    data: defines,
    count: defines.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route GET /tasks/defines/:id
 * @description 通过ID获取剧情定义
 * @param {number} id - 剧情定义的唯一ID
 * @returns {object} 200 - 成功获取剧情定义
 * @returns {object} 404 - 未找到指定ID的剧情定义
 */
router.get('/tasks/defines/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const taskDefine = getTaskDefineById(id);

  if (taskDefine) {
    res.json({
      success: true,
      data: taskDefine,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Task define not found',
      timestamp: new Date().toISOString(),
    });
  }
});

// =================================
// 开始剧情 (Starters)
// =================================

/**
 * @route GET /tasks/starters
 * @description 获取所有开始剧情
 * @returns {object} 200 - 成功获取开始剧情列表
 */
router.get('/tasks/starters', (req: Request, res: Response) => {
  const starters = getAllStarters();
  const simplifiedStarters = starters.map((s) => ({
    taskid: s.taskId,
    taskname: s.taskName,
  }));
  res.json({
    success: true,
    data: simplifiedStarters,
    count: simplifiedStarters.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route GET /tasks/starters/:id
 * @description 通过ID获取剧情触发器
 * @param {number} id - 剧情触发器的唯一ID
 * @returns {object} 200 - 成功获取剧情触发器
 * @returns {object} 404 - 未找到指定ID的剧情触发器
 */
router.get('/tasks/starters/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const taskStarter = getTaskStarterById(id);

  if (taskStarter) {
    res.json({
      success: true,
      data: taskStarter,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Task starter not found',
      timestamp: new Date().toISOString(),
    });
  }
});

// =================================
// 其他剧情模块
// =================================

/**
 * @route GET /tasks/big-titles
 * @description 获取所有剧情大标题
 * @returns {object} 200 - 成功获取列表
 */
router.get('/tasks/big-titles', (req: Request, res: Response) => {
  const data = getAllBitTitles();
  res.json({ success: true, data, count: data.length, timestamp: new Date().toISOString() });
});

/**
 * @route GET /tasks/sub-titles
 * @description 获取所有剧情子标题
 * @returns {object} 200 - 成功获取列表
 */
router.get('/tasks/sub-titles', (req: Request, res: Response) => {
  const data = getAllSubTitles();
  res.json({ success: true, data, count: data.length, timestamp: new Date().toISOString() });
});

/**
 * @route GET /tasks/area-configs
 * @description 获取所有剧情区域配置
 * @returns {object} 200 - 成功获取列表
 */
router.get('/tasks/area-configs', (req: Request, res: Response) => {
  const data = getAllAreaConfigs();
  res.json({ success: true, data, count: data.length, timestamp: new Date().toISOString() });
});

/**
 * @route GET /tasks/order-in-area
 * @description 获取区域内的剧情顺序
 * @returns {object} 200 - 成功获取
 */
router.get('/tasks/order-in-area', (req: Request, res: Response) => {
  res.json({ success: true, data: getOrderInArea(), timestamp: new Date().toISOString() });
});

/**
 * @route GET /tasks/npc-names
 * @description 获取所有NPC名称
 * @returns {object} 200 - 成功获取
 */
router.get('/tasks/npc-names', (req: Request, res: Response) => {
  res.json({ success: true, data: getAllNpcNames(), timestamp: new Date().toISOString() });
});

export default router;
