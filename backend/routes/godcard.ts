import { Request, Response, Router } from 'express';
import {
  getAllGodCards,
  getAllGodCardSuits,
  getGodCardById,
  getGodCardSuitById,
} from '../dataparse/godcard';

const router = Router();

// =================================
// 神兵API
// =================================

/**
 * @route GET /godcards
 * @description 获取所有神兵的简化列表
 * @returns {object} 200 - 成功获取神兵列表
 */
router.get('/godcards', (req: Request, res: Response) => {
  const cards = getAllGodCards();
  const simplifiedCards = cards.map((card) => ({
    id: card.cardId,
    name: card.name,
  }));
  res.json({
    success: true,
    data: simplifiedCards,
    count: simplifiedCards.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route GET /godcards/:id
 * @description 通过ID获取单个神兵的详细信息
 * @param {string} id.path.required - 神兵的唯一ID
 * @returns {object} 200 - 成功获取神兵信息
 * @returns {object} 404 - 未找到指定ID的神兵
 */
router.get('/godcards/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const card = getGodCardById(id);

  if (card) {
    res.json({
      success: true,
      data: card,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的神兵`,
      timestamp: new Date().toISOString(),
    });
  }
});

// =================================
// 神兵套装API
// =================================

/**
 * @route GET /godcardsuits
 * @description 获取所有神兵套装的简化列表
 * @returns {object} 200 - 成功获取神兵套装列表
 */
router.get('/godcardsuits', (req: Request, res: Response) => {
  const suits = getAllGodCardSuits();
  const simplifiedSuits = suits.map((suit) => ({
    id: suit.id,
    name: suit.name,
  }));
  res.json({
    success: true,
    data: simplifiedSuits,
    count: simplifiedSuits.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route GET /godcardsuits/:id
 * @description 通过ID获取单个神兵套装的详细信息
 * @param {string} id.path.required - 神兵套装的唯一ID
 * @returns {object} 200 - 成功获取神兵套装信息
 * @returns {object} 404 - 未找到指定ID的神兵套装
 */
router.get('/godcardsuits/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const suit = getGodCardSuitById(id);

  if (suit) {
    res.json({
      success: true,
      data: suit,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的神兵套装`,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
