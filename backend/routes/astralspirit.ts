import { Router, Request, Response } from 'express';
import {
  getAllAstralSpirits,
  getAstralSpiritById,
  getAllAstralSpiritSuits,
  getAstralSpiritSuitById
} from '../dataparse/astralspirit';

const router = Router();

// =================================
// 星灵API
// =================================

/**
 * @route GET /astral-spirits
 * @description 获取所有星灵
 * @returns {object} 200 - 包含所有星灵的数组
 */
router.get('/astral-spirits', (req: Request, res: Response) => {
  const spirits = getAllAstralSpirits();
  res.json({
    success: true,
    data: spirits,
    count: spirits.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route GET /astral-spirit/:id
 * @description 根据ID获取单个星灵
 * @param {string} id - 星灵ID
 * @returns {object} 200 - 星灵对象
 * @returns {object} 404 - 如果未找到星灵
 */
router.get('/astral-spirit/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const spirit = getAstralSpiritById(id);

  if (spirit) {
    res.json({
      success: true,
      data: spirit,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的星灵`,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * @route GET /astral-spirit-suits
 * @description 获取所有星灵套装
 * @returns {object} 200 - 包含所有星灵套装的数组
 */
router.get('/astral-spirit-suits', (req: Request, res: Response) => {
  const suits = getAllAstralSpiritSuits();
  res.json({
    success: true,
    data: suits,
    count: suits.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route GET /astral-spirit-suit/:id
 * @description 根据ID获取单个星灵套装
 * @param {string} id - 星灵套装ID
 * @returns {object} 200 - 星灵套装对象
 * @returns {object} 404 - 如果未找到星灵套装
 */
router.get('/astral-spirit-suit/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const suit = getAstralSpiritSuitById(id);

  if (suit) {
    res.json({
      success: true,
      data: suit,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的星灵套装`,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;