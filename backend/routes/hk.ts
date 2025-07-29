import { Router, Request, Response } from 'express';
import {
  getAllHkData,
  getHkDataById,
  getAllHkBuffs,
  getHkBuffById,
} from '../dataparse/hk';

const router = Router();

// =================================
// 魂卡API
// =================================
router.get('/hkdata', (req: Request, res: Response) => {
  const data = getAllHkData();
  const simplifiedData = data.map(item => ({
    id: item.id,
    name: item.name,
  }));
  res.json({
    success: true,
    data: simplifiedData,
    count: simplifiedData.length,
    timestamp: new Date().toISOString(),
  });
});

router.get('/hkdata/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const item = getHkDataById(id);

  if (item) {
    res.json({
      success: true,
      data: item,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的魂卡`,
      timestamp: new Date().toISOString(),
    });
  }
});

// =================================
// 魂卡Buff API
// =================================
router.get('/hkbuffs', (req: Request, res: Response) => {
  const buffs = getAllHkBuffs();
  res.json({
    success: true,
    data: buffs,
    count: buffs.length,
    timestamp: new Date().toISOString(),
  });
});

router.get('/hkbuffs/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const buff = getHkBuffById(id);

  if (buff) {
    res.json({
      success: true,
      data: buff,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的魂卡Buff`,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;