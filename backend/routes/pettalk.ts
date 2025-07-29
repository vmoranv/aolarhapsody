import { Router, Request, Response } from 'express';
import { getAllPetTalks, getPetTalksByRaceId } from '../dataparse/pettalk';

const router = Router();

// Route to get all pet talks
router.get('/pettalks', (req: Request, res: Response) => {
  const talks = getAllPetTalks();
  res.json({
    success: true,
    data: talks,
    count: talks.length,
    timestamp: new Date().toISOString(),
  });
});

// Route to get a single pet's talks by race ID
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