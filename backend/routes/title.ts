import express, { Request, Response } from 'express';
import { getTitleById, getTitleConfig, getTitleData } from '../dataparse/title';

const router = express.Router();

/**
 * @route GET /titles
 * @description 获取所有称号返回一个包含所有称号数据的列表
 * @returns {object} 200 - 成功获取称号列表
 * @returns {object} 404 - 未找到称号数据
 */
router.get('/titles', (req: Request, res: Response) => {
  const allTitles = getTitleData();
  if (allTitles) {
    const simplifiedTitles = allTitles.data.map((title) => ({
      id: title.titleId,
      name: title.titleName,
    }));
    res.json({
      success: true,
      data: simplifiedTitles,
      count: simplifiedTitles.length,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Title data not found',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * @route GET /titles/config
 * @description 获取称号配置返回称号系统的配置信息
 * @returns {object} 200 - 成功获取称号配置
 * @returns {object} 404 - 未找到称号配置
 */
router.get('/titles/config', (req: Request, res: Response) => {
  const config = getTitleConfig();
  if (config) {
    res.json({
      success: true,
      data: config,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Title config not found',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * @route GET /titles/:id
 * @description 根据ID获取单个称号
 * @param {number} id - 称号的唯一ID
 * @returns {object} 200 - 成功获取称号数据
 * @returns {object} 404 - 未找到指定ID的称号
 */
router.get('/titles/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const title = getTitleById(id);

  if (title) {
    res.json({
      success: true,
      data: title,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Title not found',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
