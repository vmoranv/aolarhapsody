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

/**
 * @route GET /miracle/awake
 * @description 获取所有奇迹觉醒数据。
 * @returns {object} 200 - 成功获取奇迹觉醒数据。
 */
router.get('/miracle/awake', (req: Request, res: Response) => {
  const data = getAllAwakeData();
  res.json({
    success: true,
    data: data,
    count: data.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route GET /miracle/petinfo
 * @description 获取所有奇迹亚比信息数据。
 * @returns {object} 200 - 成功获取奇迹亚比信息。
 */
router.get('/miracle/petinfo', (req: Request, res: Response) => {
  const data = getAllPetInfoData();
  res.json({
    success: true,
    data: data,
    count: data.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route GET /miracle/break
 * @description 获取所有奇迹突破数据。
 * @returns {object} 200 - 成功获取奇迹突破数据。
 */
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