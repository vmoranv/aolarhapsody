import express, { Request, Response } from 'express';
import { getAllPosters, getPosterById } from '../dataparse/poster';
import { SimplifiedPoster } from '../types/poster';

const router = express.Router();

/**
 * @route GET /posters
 * @description 获取所有海报数据
 * @returns {object} 200 - 成功获取海报数据列表
 */
router.get('/posters', (req: Request, res: Response) => {
  const allPosters = getAllPosters();
  const simplifiedData: SimplifiedPoster[] = allPosters.map((p) => ({
    id: p.id,
    name: p.name,
    labelName: p.labelName,
  }));
  res.json({
    code: 200,
    message: 'success',
    data: simplifiedData,
    count: simplifiedData.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route GET /posters/:id
 * @description 根据ID获取单个海报数据
 * @param {number} id - 海报的唯一ID
 * @returns {object} 200 - 成功获取海报数据
 * @returns {object} 404 - 未找到指定ID的海报
 */
router.get('/posters/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const poster = getPosterById(id);

  if (poster) {
    res.json({
      code: 200,
      message: 'success',
      data: poster,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      code: 404,
      message: 'Poster not found',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
