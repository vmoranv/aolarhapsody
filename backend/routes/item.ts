import { Router, Request, Response } from 'express';
import {
  getAllItems,
  getItemById,
  getPetItemIds,
} from '../dataparse/item';

const router = Router();

// =================================
// 道具API
// =================================
router.get('/items', (req: Request, res: Response) => {
  const items = getAllItems();
  const simplifiedItems = items.map(item => ({
    id: item.id,
    name: item.name,
  }));
  res.json({
    success: true,
    data: simplifiedItems,
    count: simplifiedItems.length,
    timestamp: new Date().toISOString(),
  });
});

router.get('/items/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const item = getItemById(id);

  if (item) {
    res.json({
      success: true,
      data: item,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的道具`,
      timestamp: new Date().toISOString(),
    });
  }
});

router.get('/petitems', (req: Request, res: Response) => {
  const ids = getPetItemIds();
  res.json({
    success: true,
    data: ids,
    count: ids.length,
    timestamp: new Date().toISOString(),
  });
});

export default router;