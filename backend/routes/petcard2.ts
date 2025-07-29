import { Router, Request, Response } from 'express';
import { getAllPetCard2s, getPetCard2ById } from '../dataparse/petcard2';

const router = Router();

// Route to get all pet card 2s (simplified)
router.get('/petcard2s', (req: Request, res: Response) => {
  const cards = getAllPetCard2s();
  const simplifiedCards = cards.map(card => ({
    cardId: card.cardId,
    name: card.name,
  }));
  res.json({
    success: true,
    data: simplifiedCards,
    count: simplifiedCards.length,
    timestamp: new Date().toISOString(),
  });
});

// Route to get a single pet card 2 by ID
router.get('/petcard2s/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const card = getPetCard2ById(id);
  if (card) {
    res.json({
      success: true,
      data: card,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Pet card 2 not found',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;