import { Router, Request, Response } from 'express';
import {
  getAllCrystalKeys,
  getCrystalKeyById,
} from '../dataparse/crystalkey';

const router = Router();

// =================================
// 晶钥API
// =================================
router.get('/crystalkeys', (req: Request, res: Response) => {
  const keys = getAllCrystalKeys();
  const simplifiedKeys = keys.map(key => ({
    id: key.id,
    name: key.name,
  }));
  res.json({
    success: true,
    data: simplifiedKeys,
    count: simplifiedKeys.length,
    timestamp: new Date().toISOString(),
  });
});

router.get('/crystalkeys/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const key = getCrystalKeyById(id);

  if (key) {
    res.json({
      success: true,
      data: key,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的晶钥`,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;