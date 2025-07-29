import express, { Request, Response } from 'express';
import { getTaskData, getTaskDefineById, getTaskStarterById } from '../dataparse/task';

const router = express.Router();

/**
 * @route GET /tasks
 * @description 获取所有任务数据。返回所有任务相关的数据集合。
 * @returns {object} 200 - 成功获取任务数据。
 * @returns {object} 404 - 未找到任务数据。
 */
router.get('/tasks', (req: Request, res: Response) => {
  const allTasks = getTaskData();
  if (allTasks) {
    res.json({
      success: true,
      data: allTasks,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Task data not found',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * @route GET /tasks/defines/:id
 * @description 通过ID获取任务定义。
 * @param {number} id - 任务定义的唯一ID。
 * @returns {object} 200 - 成功获取任务定义。
 * @returns {object} 404 - 未找到指定ID的任务定义。
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

/**
 * @route GET /tasks/starters/:id
 * @description 通过ID获取任务触发器。
 * @param {number} id - 任务触发器的唯一ID。
 * @returns {object} 200 - 成功获取任务触发器。
 * @returns {object} 404 - 未找到指定ID的任务触发器。
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

export default router;