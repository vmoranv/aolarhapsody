import { Request, Response, Router } from 'express';
import { getAllPetCard2s, getPetCard2ById } from '../dataparse/petcard2';

const router = Router();

/**
 * @route GET /petcard2s
 * @description 获取所有特性晶石的简化列表
 * @returns {object} 200 - 成功获取特性晶石列表
 */
router.get('/petcard2s', (req: Request, res: Response) => {
  const cards = getAllPetCard2s();
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
 * @route GET /petcard2s/:id
 * @description 通过ID获取单个特性晶石的详细信息
 * @param {number} id - 特性晶石的唯一ID
 * @returns {object} 200 - 成功获取特性晶石信息
 * @returns {object} 404 - 未找到指定ID的特性晶石
 */
router.get('/petcard2s/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const card = getPetCard2ById(id);
  if (card) {
    res.json({
      success: true,
      data: card,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Pet card 2 not found',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
