import { Router, Request, Response } from 'express';
import {
  getAllInscriptions,
  getInscriptionById,
} from '../dataparse/inscription';

const router = Router();

// =================================
// 铭文API
// =================================

/**
 * @route GET /inscriptions
 * @description 获取所有铭文（简化版）。
 * @returns {object} 200 - 包含所有铭文的简化信息的数组。
 */
router.get('/inscriptions', (req: Request, res: Response) => {
  const inscriptions = getAllInscriptions();
  const simplifiedInscriptions = inscriptions.map(item => ({
    id: item.id,
    name: item.name,
  }));
  res.json({
    success: true,
    data: simplifiedInscriptions,
    count: simplifiedInscriptions.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route GET /inscriptions/:id
 * @description 根据ID获取单个铭文。
 * @param {string} id - 铭文ID。
 * @returns {object} 200 - 铭文对象。
 * @returns {object} 404 - 如果未找到铭文。
 */
router.get('/inscriptions/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const inscription = getInscriptionById(id);

  if (inscription) {
    res.json({
      success: true,
      data: inscription,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的铭文`,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;