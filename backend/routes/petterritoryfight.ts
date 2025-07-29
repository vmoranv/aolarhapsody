import express, { Request, Response } from 'express';
import { getAllPetTerritoryFights, getPetTerritoryFightById } from '../dataparse/petterritoryfight';

const router = express.Router();

router.get('/petterritoryfights', (req: Request, res: Response) => {
  const allPetTerritoryFights = getAllPetTerritoryFights();
  res.json({
    success: true,
    data: allPetTerritoryFights,
    count: allPetTerritoryFights.length,
    timestamp: new Date().toISOString(),
  });
});

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