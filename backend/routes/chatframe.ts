import { Router, Request, Response } from 'express';
import {
  getAllChatFrames,
  getChatFrameById,
} from '../dataparse/chatframe';

const router = Router();

// =================================
// 聊天头像框API
// =================================
router.get('/chatframes', (req: Request, res: Response) => {
  const frames = getAllChatFrames();
  const simplifiedFrames = frames.map(frame => ({
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