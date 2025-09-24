import express, { Request, Response } from 'express';
import { getCommonBuffs } from '../dataparse/commonbuff';

const router = express.Router();

/**
 * @description 获取所有通用 Buff 的简化列表
 * @route GET /commonbuffs
 * @returns {Array<{id: number, name: string}>} - 简化后的 Buff 列表
 */
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

/**
 * @description 根据 ID 获取指定的通用 Buff 的详细信息
 * @route GET /commonbuffs/:id
 * @param {string} id - Buff 的 ID
 * @returns {object} - Buff 的详细信息
 */
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
