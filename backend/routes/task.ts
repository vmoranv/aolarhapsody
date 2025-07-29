import express, { Request, Response } from 'express';
import { getTaskData, getTaskDefineById, getTaskStarterById } from '../dataparse/task';

const router = express.Router();

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