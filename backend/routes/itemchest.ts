import express, { Request, Response } from 'express';
import { getItemChestConfig } from '../dataparse/itemchest';

const router = express.Router();

/**
 * @route GET /itemchest
 * @description 获取简化的礼品套装和宝箱配置列表
 * @returns {object} 200 - 礼品套装和宝箱配置列表
 * @returns {object} 500 - 服务器错误
 */
router.get('/itemchest', async (req: Request, res: Response) => {
  try {
    const { giftSultConfig, chestConfig } = await getItemChestConfig();
    const simplifiedGiftSult = Object.entries(giftSultConfig).map(([id, config]) => ({
      id,
      name: config.name,
    }));
    const simplifiedChest = Object.entries(chestConfig).map(([id, config]) => ({
      id,
      name: config.name,
    }));
    res.json({
      giftSultConfig: simplifiedGiftSult,
      chestConfig: simplifiedChest,
    });
  } catch (err) {
    console.error('获取宝箱配置数据时出错:', err);
    res.status(500).json({ error: '获取宝箱配置数据时出错' });
  }
});

/**
 * @route GET /itemchest/gift/:id
 * @description 获取指定 ID 的礼品套装配置
 * @param {string} req.params.id - 礼品套装 ID
 * @returns {object} 200 - 礼品套装配置
 * @returns {object} 404 - 未找到配置
 * @returns {object} 500 - 服务器错误
 */
router.get('/itemchest/gift/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { giftSultConfig } = await getItemChestConfig();
    if (giftSultConfig[id]) {
      res.json(giftSultConfig[id]);
    } else {
      res.status(404).json({ error: '未找到指定的礼品套装配置' });
    }
  } catch (err) {
    console.error('获取礼品套装配置数据时出错:', err);
    res.status(500).json({ error: '获取礼品套装配置数据时出错' });
  }
});

/**
 * @route GET /itemchest/chest/:id
 * @description 获取指定 ID 的宝箱配置
 * @param {string} req.params.id - 宝箱 ID
 * @returns {object} 200 - 宝箱配置
 * @returns {object} 404 - 未找到配置
 * @returns {object} 500 - 服务器错误
 */
router.get('/itemchest/chest/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { chestConfig } = await getItemChestConfig();
    if (chestConfig[id]) {
      res.json(chestConfig[id]);
    } else {
      res.status(404).json({ error: '未找到指定的宝箱配置' });
    }
  } catch (err) {
    console.error('获取宝箱配置数据时出错:', err);
    res.status(500).json({ error: '获取宝箱配置数据时出错' });
  }
});

export default router;
