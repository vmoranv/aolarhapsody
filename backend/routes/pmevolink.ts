import { Router, Request, Response } from 'express';
import {
  getAllSpEvoLinks,
  getSpEvoLinkByBeforeId,
} from '../dataparse/pmevolink';

const router = Router();

// =================================
// 特殊进化API
// =================================
router.get('/spevo', (req: Request, res: Response) => {
  const links = getAllSpEvoLinks();
  res.json({
    success: true,
    data: links,
    count: links.length,
    timestamp: new Date().toISOString(),
  });
});

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