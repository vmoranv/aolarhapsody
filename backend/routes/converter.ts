/**
 * @file Express 路由，用于 JSON 和 Base64 字符串之间的相互转换。
 * @description 提供两个 API 端点：
 * - `POST /encrypt`: 将请求体中的 JSON 数据加密为 Base64 字符串。
 * - `POST /decrypt`: 将请求体中的 Base64 字符串解密为 JSON 对象。
 *
 * @module routes/converter
 * @requires express
 * @requires ../dataparse/converter
 */
import express, { Request, Response, Router } from 'express';
import { decryptBase64ToJson, encryptJsonToBase64 } from '../dataparse/converter';

const router: Router = express.Router();

/**
 * @route POST /encrypt
 * @description 接收一个 JSON 对象，并将其转换为经过 zlib 压缩和 Base64 编码的字符串。
 * @param {Request} req - Express 请求对象，请求体应包含要加密的 JSON 数据。
 * @param {Response} res - Express 响应对象。
 * @returns {Response} 成功时返回包含 Base64 字符串的 JSON 对象，失败时返回错误信息。
 */
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

/**
 * @route POST /decrypt
 * @description 接收一个经过 zlib 压缩和 Base64 编码的字符串，并将其解码还原为 JSON 对象。
 * @param {Request} req - Express 请求对象，请求体应包含一个名为 `base64` 的字符串。
 * @param {Response} res - Express 响应对象。
 * @returns {Response} 成功时返回解码后的 JSON 对象，失败时返回错误信息。
 */
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
