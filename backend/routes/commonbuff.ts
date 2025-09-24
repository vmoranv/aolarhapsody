import express, { Request, Response } from 'express';
import { getCommonBuffs } from '../dataparse/commonbuff';

const router = express.Router();

router.get('/commonbuffs', async (req: Request, res: Response) => {
  try {
    const buffs = await getCommonBuffs();
    const simplifiedBuffs = Object.values(buffs).map((buff) => ({
      id: buff.id,
      name: buff.tips,
    }));
    res.json(simplifiedBuffs);
  } catch (err) {
    console.error('获取通用 Buff 数据时出错:', err);
    res.status(500).json({ error: '获取通用 Buff 数据时出错' });
  }
});

router.get('/commonbuffs/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const buffs = await getCommonBuffs();
    if (buffs[id]) {
      res.json(buffs[id]);
    } else {
      res.status(404).json({ error: '未找到指定的 Buff' });
    }
  } catch (err) {
    console.error('获取通用 Buff 数据时出错:', err);
    res.status(500).json({ error: '获取通用 Buff 数据时出错' });
  }
});

export default router;
