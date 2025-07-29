import { Router, Request, Response } from 'express';
import {
  getAllAwakeData,
  getAllPetInfoData,
  getAllBreakData,
} from '../dataparse/miracle';

const router = Router();

// =================================
// 奇迹API
// =================================
router.get('/miracle/awake', (req: Request, res: Response) => {
  const data = getAllAwakeData();
  res.json({
    success: true,
    data: data,
    count: data.length,
    timestamp: new Date().toISOString(),
  });
});

router.get('/miracle/petinfo', (req: Request, res: Response) => {
  const data = getAllPetInfoData();
  res.json({
    success: true,
    data: data,
    count: data.length,
    timestamp: new Date().toISOString(),
  });
});

router.get('/miracle/break', (req: Request, res: Response) => {
  const data = getAllBreakData();
  res.json({
    success: true,
    data: data,
    count: data.length,
    timestamp: new Date().toISOString(),
  });
});

export default router;