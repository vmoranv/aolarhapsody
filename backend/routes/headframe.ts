import { Router, Request, Response } from 'express';
import {
  getAllHeadFrames,
  getHeadFrameById,
} from '../headframe';

const router = Router();

// =================================
// 头像框API
// =================================
router.get('/headframes', (req: Request, res: Response) => {
  const frames = getAllHeadFrames();
  res.json({
    success: true,
    data: frames,
    count: frames.length,
    timestamp: new Date().toISOString(),
  });
});

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