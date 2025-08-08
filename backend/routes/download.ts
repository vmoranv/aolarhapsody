import axios from 'axios';
import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/download/audio/:petId/:petName', async (req: Request, res: Response) => {
  const { petId, petName } = req.params;
  const audioUrl = `http://aola.100bt.com/play/music/petsound/petsound${petId}.mp3`;

  try {
    const response = await axios({
      method: 'get',
      url: audioUrl,
      responseType: 'stream',
    });

    // Decode the pet name from the URL parameter
    const decodedPetName = decodeURIComponent(petName);

    // Set the Content-Disposition header to force download.
    // The filename is encoded in UTF-8 to support non-ASCII characters.
    res.setHeader(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${encodeURIComponent(decodedPetName + '_语音.mp3')}`
    );
    res.setHeader('Content-Type', 'audio/mpeg');

    response.data.pipe(res);
  } catch (error) {
    console.error('代理下载音频失败:', error);
    res.status(500).send('无法获取音频文件');
  }
});

export default router;
