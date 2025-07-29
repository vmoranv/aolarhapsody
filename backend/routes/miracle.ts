import { Router, Request, Response } from 'express';
import {
  getAllAwakeData,
  getAllPetInfoData,
  getAllBreakData,
} from '../dataparse/miracle';

const router = Router();

// =================================
// 神迹API
// =================================

/**
 * @route GET /miracle/awake
 * @description 获取所有神迹觉醒数据
 * @returns {object} 200 - 成功获取神迹觉醒数据
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
 * @description 获取所有神迹亚比信息数据
 * @returns {object} 200 - 成功获取神迹亚比信息
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
 * @description 获取所有神迹突破数据
 * @returns {object} 200 - 成功获取神迹突破数据
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