import { Router, Request, Response } from 'express';
import {
  getAllPetIcons,
  getPetIconById,
  getAllHeadIcons,
  getHeadIconById,
} from '../icondata';

const router = Router();

// =================================
// 图标API
// =================================
router.get('/peticons', (req: Request, res: Response) => {
  const icons = getAllPetIcons();
  res.json({
    success: true,
    data: icons,
    count: icons.length,
    timestamp: new Date().toISOString(),
  });
});

router.get('/peticons/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const icon = getPetIconById(id);

  if (icon) {
    res.json({
      success: true,
      data: icon,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的宠物图标`,
      timestamp: new Date().toISOString(),
    });
  }
});

router.get('/headicons', (req: Request, res: Response) => {
  const icons = getAllHeadIcons();
  res.json({
    success: true,
    data: icons,
    count: icons.length,
    timestamp: new Date().toISOString(),
  });
});

router.get('/headicons/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const icon = getHeadIconById(id);

  if (icon) {
    res.json({
      success: true,
      data: icon,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的头像`,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;