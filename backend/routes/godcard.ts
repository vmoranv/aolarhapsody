import { Router, Request, Response } from 'express';
import {
  getAllGodCards,
  getGodCardById,
  getAllGodCardSuits,
  getGodCardSuitById,
} from '../dataparse/godcard';

const router = Router();

// =================================
// 神兵API
// =================================
router.get('/godcards', (req: Request, res: Response) => {
  const cards = getAllGodCards();
  const simplifiedCards = cards.map(card => ({
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
router.get('/godcardsuits', (req: Request, res: Response) => {
  const suits = getAllGodCardSuits();
  res.json({
    success: true,
    data: suits,
    count: suits.length,
    timestamp: new Date().toISOString(),
  });
});

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