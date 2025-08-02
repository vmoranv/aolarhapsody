import { Request, Response, Router } from 'express';
import { getAllHeadFrames, getHeadFrameById } from '../dataparse/headframe';

const router = Router();

// =================================
// 头像框API
// =================================

/**
 * @route GET /headframes
 * @description 获取所有头像框数据
 * @returns {object} 200 - 成功获取头像框列表
 */
router.get('/headframes', (req: Request, res: Response) => {
  const frames = getAllHeadFrames();
  res.json({
    success: true,
    data: frames,
    count: frames.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route GET /headframes/:id
 * @description 通过ID获取单个头像框的详细信息
 * @param {string} id.path.required - 头像框的唯一ID
 * @returns {object} 200 - 成功获取头像框信息
 * @returns {object} 404 - 未找到指定ID的头像框
 */
router.get('/headframes/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const frame = getHeadFrameById(id);

  if (frame) {
    res.json({
      success: true,
      data: frame,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的头像框`,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
