import { Router, Request, Response } from 'express';
import {
  getAllEvolutionStones,
  getEvolutionStoneById,
  getAllSkillStones,
  getSkillStoneById,
} from '../dataparse/petstone';

const router = Router();

// Route to get all evolution stones (simplified)
router.get('/evolutionstones', (req: Request, res: Response) => {
  const stones = getAllEvolutionStones();
  const simplifiedStones = stones.map(stone => ({
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

// Route to get a single evolution stone by ID
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

// Route to get all skill stones (simplified)
router.get('/skillstones', (req: Request, res: Response) => {
  const stones = getAllSkillStones();
  const simplifiedStones = stones.map(stone => ({
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

// Route to get a single skill stone by ID
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