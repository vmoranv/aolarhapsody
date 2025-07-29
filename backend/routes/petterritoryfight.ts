import express, { Request, Response } from 'express';
import { getAllPetTerritoryFights, getPetTerritoryFightById } from '../dataparse/petterritoryfight';

const router = express.Router();

/**
 * @route GET /petterritoryfights
 * @description 获取所有领域战斗数据。
 * @returns {object} 200 - 成功获取领域战斗数据。
 */
router.get('/petterritoryfights', (req: Request, res: Response) => {
  const allPetTerritoryFights = getAllPetTerritoryFights();
  res.json({
    success: true,
    data: allPetTerritoryFights,
    count: allPetTerritoryFights.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route GET /petterritoryfights/:id
 * @description 通过ID获取单个领域战斗数据。
 * @param {number} id - 领域战斗的唯一ID。
 * @returns {object} 200 - 成功获取领域战斗数据。
 * @returns {object} 404 - 未找到指定ID的领域战斗数据。
 */
router.get('/petterritoryfights/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const petTerritoryFight = getPetTerritoryFightById(id);

  if (petTerritoryFight) {
    res.json({
      success: true,
      data: petTerritoryFight,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Pet territory fight not found',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;