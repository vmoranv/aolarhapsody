import express, { Request, Response } from 'express';
import { getBuffs } from '../dataparse/buff';

const router = express.Router();

router.get('/abbbuffs', async (req: Request, res: Response) => {
  try {
    const buffs = await getBuffs();
    res.json(buffs);
  } catch (error) {
    res.status(500).json({ error: '获取 BUFF 数据时出错', details: error });
  }
});

export default router;
