import { Router, Request, Response } from 'express';
import {
  getAllInscriptions,
  getInscriptionById,
} from '../dataparse/inscription';

const router = Router();

// =================================
// 铭文API
// =================================
router.get('/inscriptions', (req: Request, res: Response) => {
  const inscriptions = getAllInscriptions();
  const simplifiedInscriptions = inscriptions.map(item => ({
    id: item.id,
    name: item.name,
  }));
  res.json({
    success: true,
    data: simplifiedInscriptions,
    count: simplifiedInscriptions.length,
    timestamp: new Date().toISOString(),
  });
});

router.get('/inscriptions/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const inscription = getInscriptionById(id);

  if (inscription) {
    res.json({
      success: true,
      data: inscription,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的铭文`,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;