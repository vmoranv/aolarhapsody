import express, { Request, Response } from 'express';
import { getSanctuaryEffects } from '../dataparse/sanctuaryeffects';

const router = express.Router();

router.get('/sanctuaryeffects', async (req: Request, res: Response) => {
  try {
    const effects = await getSanctuaryEffects();
    res.json(effects);
  } catch (err) {
    console.error('获取圣域效果数据时出错:', err);
    res.status(500).json({ error: '获取圣域效果数据时出错' });
  }
});

export default router;
