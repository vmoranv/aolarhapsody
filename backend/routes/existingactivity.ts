import express, { Request, Response } from 'express';
import { getExistingActivities } from '../dataparse/existingactivity';

const router = express.Router();

/**
 * @route GET /existing-activities
 * @description 获取所有现存活动数据
 * @returns {object} 200 - 现存活动数据
 * @returns {object} 500 - 服务器错误
 */
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
