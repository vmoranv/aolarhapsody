import express, { Request, Response } from 'express';
import { getToteData, getToteDataById, getToteEntryById, getToteValueById } from '../dataparse/tote';

const router = express.Router();

router.get('/totes', (req: Request, res: Response) => {
  const allTotes = getToteData();
  if (allTotes) {
    res.json({
      success: true,
      data: allTotes,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Tote data not found',
      timestamp: new Date().toISOString(),
    });
  }
});

router.get('/totes/data/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const toteData = getToteDataById(id);

  if (toteData) {
    res.json({
      success: true,
      data: toteData,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Tote data item not found',
      timestamp: new Date().toISOString(),
    });
  }
});

router.get('/totes/entry/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const toteEntry = getToteEntryById(id);

  if (toteEntry) {
    res.json({
      success: true,
      data: toteEntry,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Tote entry not found',
      timestamp: new Date().toISOString(),
    });
  }
});

router.get('/totes/value/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const toteValue = getToteValueById(id);

  if (toteValue) {
    res.json({
      success: true,
      data: toteValue,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Tote value not found',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;