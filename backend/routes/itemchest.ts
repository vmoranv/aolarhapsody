import express, { Request, Response } from 'express';
import { getItemChestConfig } from '../dataparse/itemchest';

const router = express.Router();

router.get('/itemchest', async (req: Request, res: Response) => {
  try {
    const config = await getItemChestConfig();
    res.json(config);
  } catch (err) {
    console.error('获取宝箱配置数据时出错:', err);
    res.status(500).json({ error: '获取宝箱配置数据时出错' });
  }
});

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
