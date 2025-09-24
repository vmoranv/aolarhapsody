import express from 'express';
import { getRecommendNameConfig } from '../dataparse/recommendname';

const router = express.Router();

router.get('/recommendname', async (_req, res) => {
  try {
    const { pre, pos } = await getRecommendNameConfig();

    if (pre.length === 0 || pos.length === 0) {
      return res.status(500).json({ error: '推荐名称数据不可用，请稍后再试' });
    }

    const randomPre = pre[Math.floor(Math.random() * pre.length)];
    const randomPos = pos[Math.floor(Math.random() * pos.length)];
    const recommendName = `${randomPre}${randomPos}`;

    res.json({ recommendName });
  } catch (error) {
    console.error('获取推荐名称时出错:', error);
    res.status(500).json({ error: '获取推荐名称时发生内部服务器错误' });
  }
});

export default router;
