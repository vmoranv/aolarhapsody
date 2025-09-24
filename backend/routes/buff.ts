import express, { Request, Response } from 'express';
import { getBuffs } from '../dataparse/buff';

const router = express.Router();

/**
 * @description 获取所有 BUFF 数据
 * @route GET /abbbuffs
 * @returns {object} - BUFF 数据
 */
router.get('/abbbuffs', async (req: Request, res: Response) => {
  try {
    const buffs = await getBuffs();
    res.json(buffs);
  } catch (error) {
    res.status(500).json({ error: '获取 BUFF 数据时出错', details: error });
  }
});

export default router;
