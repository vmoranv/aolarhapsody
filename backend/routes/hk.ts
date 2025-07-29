import { Router, Request, Response } from 'express';
import {
  getAllHkData,
  getHkDataById,
  getAllHkBuffs,
  getHkBuffById,
} from '../dataparse/hk';

const router = Router();

// =================================
// 魂卡API
// =================================

/**
 * @route GET /hkdata
 * @description 获取所有魂卡的简化列表。
 * @returns {object} 200 - 成功获取魂卡列表。
 */
router.get('/hkdata', (req: Request, res: Response) => {
  const data = getAllHkData();
  const simplifiedData = data.map(item => ({
    id: item.id,
    name: item.name,
  }));
  res.json({
    success: true,
    data: simplifiedData,
    count: simplifiedData.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route GET /hkdata/:id
 * @description 通过ID获取单个魂卡的详细信息。
 * @param {string} id.path.required - 魂卡的唯一ID。
 * @returns {object} 200 - 成功获取魂卡信息。
 * @returns {object} 404 - 未找到指定ID的魂卡。
 */
router.get('/hkdata/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const item = getHkDataById(id);

  if (item) {
    res.json({
      success: true,
      data: item,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的魂卡`,
      timestamp: new Date().toISOString(),
    });
  }
});

// =================================
// 魂卡Buff API
// =================================

/**
 * @route GET /hkbuffs
 * @description 获取所有魂卡Buff。
 * @returns {object} 200 - 成功获取魂卡Buff列表。
 */
router.get('/hkbuffs', (req: Request, res: Response) => {
  const buffs = getAllHkBuffs();
  res.json({
    success: true,
    data: buffs,
    count: buffs.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route GET /hkbuffs/:id
 * @description 通过ID获取单个魂卡Buff的详细信息。
 * @param {string} id.path.required - 魂卡Buff的唯一ID。
 * @returns {object} 200 - 成功获取魂卡Buff信息。
 * @returns {object} 404 - 未找到指定ID的魂卡Buff。
 */
router.get('/hkbuffs/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const buff = getHkBuffById(id);

  if (buff) {
    res.json({
      success: true,
      data: buff,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的魂卡Buff`,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;