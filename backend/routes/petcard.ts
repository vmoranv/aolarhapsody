import { Request, Response, Router } from 'express';
import {
  getAllPetCards,
  getAllPetCardSuits,
  getPetCardById,
  getPetCardSuitById,
} from '../dataparse/petcard';

const router = Router();

/**
 * @route GET /petcards
 * @description 获取所有装备卡（简化版）
 * @returns {object} 200 - 包含所有装备卡的简化信息的数组
 */
router.get('/petcards', (req: Request, res: Response) => {
  const cards = getAllPetCards();
  const simplifiedCards = cards.map((card) => ({
    cardId: card.cardId,
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
 * @route GET /petcards/:id
 * @description 根据ID获取单个装备卡
 * @param {number} id - 装备卡ID
 * @returns {object} 200 - 装备卡对象
 * @returns {object} 404 - 如果未找到装备卡
 */
router.get('/petcards/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const card = getPetCardById(id);
  if (card) {
    res.json({
      success: true,
      data: card,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Pet card not found',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * @route GET /petcardsuits
 * @description 获取所有装备卡套装（简化版）
 * @returns {object} 200 - 包含所有装备卡套装的简化信息的数组
 */
router.get('/petcardsuits', (req: Request, res: Response) => {
  const suits = getAllPetCardSuits();
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
 * @route GET /petcardsuits/:id
 * @description 根据ID获取单个装备卡套装
 * @param {number} id - 装备卡套装ID
 * @returns {object} 200 - 装备卡套装对象
 * @returns {object} 404 - 如果未找到装备卡套装
 */
router.get('/petcardsuits/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const suit = getPetCardSuitById(id);
  if (suit) {
    res.json({
      success: true,
      data: suit,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Pet card suit not found',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
