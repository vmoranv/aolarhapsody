import { Router, Request, Response } from 'express';
import {
  getAllGalaxyFleetMarks,
  getGalaxyFleetMarkById,
} from '../dataparse/galaxyfleetmark';

const router = Router();

// =================================
// 舰队头衔API
// =================================
router.get('/galaxyfleetmarks', (req: Request, res: Response) => {
  const marks = getAllGalaxyFleetMarks();
  res.json({
    success: true,
    data: marks,
    count: marks.length,
    timestamp: new Date().toISOString(),
  });
});

router.get('/galaxyfleetmarks/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const mark = getGalaxyFleetMarkById(id);

  if (mark) {
    res.json({
      success: true,
      data: mark,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的银河舰队徽章`,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;