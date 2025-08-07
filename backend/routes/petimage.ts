import axios from 'axios';
import { Request, Response, Router } from 'express';
import { getPetImageUrl } from '../dataparse/petimage';

const router = Router();

router.get('/petimage/:type/:id', async (req: Request, res: Response) => {
  const { id, type } = req.params;

  if (!id || !type) {
    return res.status(400).send('ID and type are required');
  }

  const imageUrl = getPetImageUrl(id, type);

  if (!imageUrl) {
    return res.status(404).send('Image URL not found');
  }

  try {
    const response = await axios.get(imageUrl, {
      responseType: 'stream',
    });
    res.setHeader('Content-Type', response.headers['content-type']);
    response.data.pipe(res);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Error fetching image');
  }
});

export default router;
