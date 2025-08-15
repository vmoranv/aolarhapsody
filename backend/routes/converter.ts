import express, { Request, Response, Router } from 'express';
import { decryptBase64ToJson, encryptJsonToBase64 } from '../dataparse/converter';

const router: Router = express.Router();

// 加密路由：将JSON转换为Base64
router.post('/encrypt', (req: Request, res: Response) => {
  try {
    const jsonData = req.body;
    if (!jsonData || Object.keys(jsonData).length === 0) {
      return res.status(400).json({ error: '请求体中需要有效的JSON数据' });
    }
    const base64String = encryptJsonToBase64(jsonData);
    res.status(200).json({ base64: base64String });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: '发生未知错误' });
    }
  }
});

// 解密路由：将Base64转换为JSON
router.post('/decrypt', (req: Request, res: Response) => {
  try {
    const { base64 } = req.body;
    if (!base64 || typeof base64 !== 'string') {
      return res.status(400).json({ error: '请求体中需要有效的base64字符串' });
    }
    const jsonData = decryptBase64ToJson(base64);
    res.status(200).json(jsonData);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: '发生未知错误' });
    }
  }
});

export default router;
