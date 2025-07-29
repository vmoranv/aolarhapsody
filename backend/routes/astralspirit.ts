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
router.get('/astral-spirits', (req: Request, res: Response) => {
  const spirits = getAllAstralSpirits();
  res.json({
    success: true,
    data: spirits,
    count: spirits.length,
    timestamp: new Date().toISOString(),
  });
});

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

router.get('/astral-spirit-suits', (req: Request, res: Response) => {
  const suits = getAllAstralSpiritSuits();
  res.json({
    success: true,
    data: suits,
    count: suits.length,
    timestamp: new Date().toISOString(),
  });
});

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