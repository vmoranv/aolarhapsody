import { Request, Response, Router } from 'express';
import {
  getAllEvolutionStones,
  getAllSkillStones,
  getEvolutionStoneById,
  getSkillStoneById,
} from '../dataparse/petstone';

const router = Router();

/**
 * @route GET /evolutionstones
 * @description 获取所有进化石（简化版）
 * @returns {object} 200 - 包含所有进化石的简化信息的数组
 */
router.get('/evolutionstones', (req: Request, res: Response) => {
  const stones = getAllEvolutionStones();
  const simplifiedStones = stones.map((stone) => ({
    id: stone.id,
    evoRaceId: stone.evoRaceId,
    evoToRaceId: stone.evoToRaceId,
  }));
  res.json({
    success: true,
    data: simplifiedStones,
    count: simplifiedStones.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route GET /evolutionstones/:id
 * @description 根据ID获取单个进化石
 * @param {number} id - 进化石ID
 * @returns {object} 200 - 进化石对象
 * @returns {object} 404 - 如果未找到进化石
 */
router.get('/evolutionstones/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const stone = getEvolutionStoneById(id);
  if (stone) {
    res.json({
      success: true,
      data: stone,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Evolution stone not found',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * @route GET /skillstones
 * @description 获取所有技能石（简化版）
 * @returns {object} 200 - 包含所有技能石的简化信息的数组
 */
router.get('/skillstones', (req: Request, res: Response) => {
  const stones = getAllSkillStones();
  const simplifiedStones = stones.map((stone) => ({
    id: stone.id,
    raceId: stone.raceId,
    skillId: stone.skillId,
  }));
  res.json({
    success: true,
    data: simplifiedStones,
    count: simplifiedStones.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route GET /skillstones/:id
 * @description 根据ID获取单个技能石
 * @param {number} id - 技能石ID
 * @returns {object} 200 - 技能石对象
 * @returns {object} 404 - 如果未找到技能石
 */
router.get('/skillstones/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const stone = getSkillStoneById(id);
  if (stone) {
    res.json({
      success: true,
      data: stone,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Skill stone not found',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
