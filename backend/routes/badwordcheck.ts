import { Request, Response, Router } from 'express';
import { checkBadWords } from '../dataparse/badwordcheck';

const router = Router();

/**
 * @route POST /badwordcheck
 * @description 检查文本是否包含敏感词
 * @returns {object} 200 - 成功检查文本
 */
router.post('/badwordcheck', (req: Request, res: Response) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({
      success: false,
      message: '缺少 "text" 字段',
      timestamp: new Date().toISOString(),
    });
  }

  const isIllegal = checkBadWords(text);

  res.json({
    success: true,
    data: {
      isIllegal,
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
