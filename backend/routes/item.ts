import { Request, Response, Router } from 'express';
import { getAllItems, getItemById, getPetItemIds } from '../dataparse/item';

const router = Router();

// =================================
// 道具API
// =================================

/**
 * @route GET /items
 * @description 获取所有道具的简化列表
 * @returns {object} 200 - 成功获取道具列表
 */
router.get('/items', (req: Request, res: Response) => {
  const items = getAllItems();
  const simplifiedItems = items.map((item) => ({
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

/**
 * @route GET /items/:id
 * @description 通过ID获取单个道具的详细信息
 * @param {string} id.path.required - 道具的唯一ID
 * @returns {object} 200 - 成功获取道具信息
 * @returns {object} 404 - 未找到指定ID的道具
 */
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

/**
 * @route GET /petitems
 * @description 获取所有与亚比相关的道具ID列表
 * @returns {object} 200 - 成功获取亚比道具ID列表
 */
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
