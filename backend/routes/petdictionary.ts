import { Router, Request, Response } from 'express';
import { getAllPetDictionaryData, getPetDictionaryDataById } from '../dataparse/petdictionary';

const router = Router();

// Route to get all pet dictionary items (simplified)
router.get('/petdictionary', (req: Request, res: Response) => {
  const items = getAllPetDictionaryData();
  const simplifiedItems = items.map(item => ({
    petID: item.petID,
    petName: item.petName,
  }));
  res.json({
    success: true,
    data: simplifiedItems,
    count: simplifiedItems.length,
    timestamp: new Date().toISOString(),
  });
});

// Route to get a single pet dictionary item by ID
router.get('/petdictionary/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const item = getPetDictionaryDataById(id);
  if (item) {
    res.json({
      success: true,
      data: item,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Pet dictionary item not found',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;