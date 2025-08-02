import { Request, Response, Router } from 'express';
import { getAllCrystalKeys, getCrystalKeyById } from '../dataparse/crystalkey';

const router = Router();

// =================================
// 晶钥API
// =================================

/**
 * @route GET /crystalkeys
 * @description 获取所有晶钥的简化列表
 * @returns {object} 200 - 成功获取晶钥列表
 */
router.get('/crystalkeys', (req: Request, res: Response) => {
  const keys = getAllCrystalKeys();
  const simplifiedKeys = keys.map((key) => ({
    id: key.id,
    name: key.name,
  }));
  res.json({
    success: true,
    data: simplifiedKeys,
    count: simplifiedKeys.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route GET /crystalkeys/:id
 * @description 通过ID获取单个晶钥的详细信息
 * @param {string} id.path.required - 晶钥的唯一ID
 * @returns {object} 200 - 成功获取晶钥信息
 * @returns {object} 404 - 未找到指定ID的晶钥
 */
router.get('/crystalkeys/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const key = getCrystalKeyById(id);

  if (key) {
    res.json({
      success: true,
      data: key,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的晶钥`,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
