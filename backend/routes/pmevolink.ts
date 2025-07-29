import { Router, Request, Response } from 'express';
import {
  getAllSpEvoLinks,
  getSpEvoLinkByBeforeId,
} from '../dataparse/pmevolink';

const router = Router();

// =================================
// 特殊进化API
// =================================

/**
 * @route GET /spevo
 * @description 获取所有特殊进化链接。
 * @returns {object} 200 - 成功获取特殊进化链接列表。
 */
router.get('/spevo', (req: Request, res: Response) => {
  const links = getAllSpEvoLinks();
  res.json({
    success: true,
    data: links,
    count: links.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route GET /spevo/:id
 * @description 通过前置ID获取单个特殊进化链接。
 * @param {string} id - 进化前的亚比ID。
 * @returns {object} 200 - 成功获取特殊进化链接信息。
 * @returns {object} 404 - 未找到指定前置ID的特殊进化链接。
 */
router.get('/spevo/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const link = getSpEvoLinkByBeforeId(id);

  if (link) {
    res.json({
      success: true,
      data: link,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到前置ID为 ${id} 的特殊进化链接`,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;