import { Router, Request, Response } from 'express';
import {
  getAllPetCards,
  getPetCardById,
  getAllPetCardSuits,
  getPetCardSuitById,
} from '../dataparse/petcard';

const router = Router();

// Route to get all pet cards (simplified)
router.get('/petcards', (req: Request, res: Response) => {
  const cards = getAllPetCards();
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

// Route to get a single pet card by ID
router.get('/petcards/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const card = getPetCardById(id);
  if (card) {
    res.json({
      success: true,
      data: card,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Pet card not found',
      timestamp: new Date().toISOString(),
    });
  }
});

// Route to get all pet card suits
router.get('/petcardsuits', (req: Request, res: Response) => {
  const suits = getAllPetCardSuits();
  res.json({
    success: true,
    data: suits,
    count: suits.length,
    timestamp: new Date().toISOString(),
  });
});

// Route to get a single pet card suit by ID
router.get('/petcardsuits/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const suit = getPetCardSuitById(id);
  if (suit) {
    res.json({
      success: true,
      data: suit,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Pet card suit not found',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;