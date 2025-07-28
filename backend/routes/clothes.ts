import { Router, Request, Response } from 'express';
import {
  getAllClothes,
  getClothesById,
  getAllClothesSuits,
  getClothesSuitById,
  getAllClothesAffectBody,
  getAllClothesParts,
  getClothesPartById,
} from '../clothes';

const router = Router();

// =================================
// 服装API
// =================================
router.get('/clothes', (req: Request, res: Response) => {
  const clothes = getAllClothes();
  res.json({
    success: true,
    data: clothes,
    count: clothes.length,
    timestamp: new Date().toISOString(),
  });
});

router.get('/clothes/parts', (req: Request, res: Response) => {
  const parts = getAllClothesParts();
  res.json({
    success: true,
    data: parts,
    count: parts.length,
    timestamp: new Date().toISOString(),
  });
});

router.get('/clothes/parts/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const part = getClothesPartById(id);

  if (part) {
    res.json({
      success: true,
      data: part,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的服装部件`,
      timestamp: new Date().toISOString(),
    });
  }
});

router.get('/clothes/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const clothes = getClothesById(id);

  if (clothes) {
    res.json({
      success: true,
      data: clothes,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的服装`,
      timestamp: new Date().toISOString(),
    });
  }
});

router.get('/clothes-suits', (req: Request, res: Response) => {
  const suits = getAllClothesSuits();
  res.json({
    success: true,
    data: suits,
    count: suits.length,
    timestamp: new Date().toISOString(),
  });
});

router.get('/clothes-suit/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const suit = getClothesSuitById(id);

  if (suit) {
    res.json({
      success: true,
      data: suit,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的服装套装`,
      timestamp: new Date().toISOString(),
    });
  }
});

router.get('/clothes-affect-body', (req: Request, res: Response) => {
    const affectBody = getAllClothesAffectBody();
    res.json({
        success: true,
        data: affectBody,
        count: affectBody.length,
        timestamp: new Date().toISOString(),
    });
});

export default router;