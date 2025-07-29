import { Router, Request, Response } from 'express';
import {
  getAllGalaxyFleetMarks,
  getGalaxyFleetMarkById,
} from '../dataparse/galaxyfleetmark';

const router = Router();

// =================================
// 舰队头衔API
// =================================

/**
 * @route GET /galaxyfleetmarks
 * @description 获取所有银河舰队徽章。
 * @returns {object} 200 - 成功获取银河舰队徽章列表。
 */
router.get('/galaxyfleetmarks', (req: Request, res: Response) => {
  const marks = getAllGalaxyFleetMarks();
  res.json({
    success: true,
    data: marks,
    count: marks.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route GET /galaxyfleetmarks/:id
 * @description 通过ID获取单个银河舰队徽章的详细信息。
 * @param {string} id.path.required - 银河舰队徽章的唯一ID。
 * @returns {object} 200 - 成功获取银河舰队徽章信息。
 * @returns {object} 404 - 未找到指定ID的银河舰队徽章。
 */
router.get('/galaxyfleetmarks/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const mark = getGalaxyFleetMarkById(id);

  if (mark) {
    res.json({
      success: true,
      data: mark,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的银河舰队徽章`,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;