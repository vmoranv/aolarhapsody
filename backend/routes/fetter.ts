import express, { Request, Response } from 'express';
import { getFetters } from '../dataparse/fetter';

const router = express.Router();

router.get('/fetters', async (req: Request, res: Response) => {
  try {
    const fetters = await getFetters();
    const simplifiedFetters = fetters.map((fetter) => ({
      id: fetter.id,
      name: fetter.name,
    }));
    res.json(simplifiedFetters);
  } catch (err) {
    console.error('获取羁绊数据时出错:', err);
    res.status(500).json({ error: '获取羁绊数据时出错' });
  }
});

router.get('/fetters/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const fetters = await getFetters();
    const fetter = fetters.find((f) => f.id === parseInt(id, 10));
    if (fetter) {
      res.json(fetter);
    } else {
      res.status(404).json({ error: '未找到指定的羁绊' });
    }
  } catch (err) {
    console.error('获取羁绊数据时出错:', err);
    res.status(500).json({ error: '获取羁绊数据时出错' });
  }
});

export default router;
