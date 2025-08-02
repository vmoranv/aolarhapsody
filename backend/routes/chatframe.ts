import { Request, Response, Router } from 'express';
import { getAllChatFrames, getChatFrameById } from '../dataparse/chatframe';

const router = Router();

// =================================
// 聊天头像框API
// =================================

/**
 * @route GET /chatframes
 * @description 获取所有聊天框（简化版）
 * @returns {object} 200 - 包含所有聊天框的简化信息的数组
 */
router.get('/chatframes', (req: Request, res: Response) => {
  const frames = getAllChatFrames();
  const simplifiedFrames = frames.map((frame) => ({
    id: frame.id,
    name: frame.name,
  }));
  res.json({
    success: true,
    data: simplifiedFrames,
    count: simplifiedFrames.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route GET /chatframes/:id
 * @description 根据ID获取单个聊天框
 * @param {string} id - 聊天框ID
 * @returns {object} 200 - 聊天框对象
 * @returns {object} 404 - 如果未找到聊天框
 */
router.get('/chatframes/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const frame = getChatFrameById(id);

  if (frame) {
    res.json({
      success: true,
      data: frame,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的聊天框`,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
