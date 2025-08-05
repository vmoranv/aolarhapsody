import express, { Request, Response } from 'express';
import { getExistingActivities } from '../dataparse/existingactivity';

const router = express.Router();

router.get('/existing-activities', async (req: Request, res: Response) => {
  try {
    const activities = await getExistingActivities();
    res.json(activities);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
});

export default router;
