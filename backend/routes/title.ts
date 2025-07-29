import express, { Request, Response } from 'express';
import { getTitleData, getTitleById, getTitleConfig } from '../dataparse/title';

const router = express.Router();

router.get('/titles', (req: Request, res: Response) => {
  const allTitles = getTitleData();
  if (allTitles) {
    res.json({
      success: true,
      data: allTitles.data,
      count: allTitles.data.length,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Title data not found',
      timestamp: new Date().toISOString(),
    });
  }
});

router.get('/titles/config', (req: Request, res: Response) => {
  const config = getTitleConfig();
  if (config) {
    res.json({
      success: true,
      data: config,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Title config not found',
      timestamp: new Date().toISOString(),
    });
  }
});

router.get('/titles/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const title = getTitleById(id);

  if (title) {
    res.json({
      success: true,
      data: title,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Title not found',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;