import { Router, Request, Response } from 'express';
import { getAllPetTalks, getPetTalksByRaceId } from '../dataparse/pettalk';

const router = Router();

/**
 * @route GET /pettalks
 * @description 获取所有亚比的语音。
 * @returns {object} 200 - 成功获取亚比语音列表。
 */
router.get('/pettalks', (req: Request, res: Response) => {
  const talks = getAllPetTalks();
  res.json({
    success: true,
    data: talks,
    count: talks.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route GET /pettalks/:id
 * @description 通过种族ID获取单个亚比的语音。
 * @param {number} id - 亚比的种族ID。
 * @returns {object} 200 - 成功获取亚比语音。
 * @returns {object} 404 - 未找到指定种族ID的亚比语音。
 */
router.get('/pettalks/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const talk = getPetTalksByRaceId(id);
  if (talk) {
    res.json({
      success: true,
      data: talk,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Pet talks not found for this race ID',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;