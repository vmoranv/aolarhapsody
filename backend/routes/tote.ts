import express, { Request, Response } from 'express';
import {
  getAllToteData,
  getAllToteEntries,
  getAllToteValues,
  getToteDataById,
  getToteEntryById,
  getToteValueById,
} from '../dataparse/tote';

const router = express.Router();

// =================================
// 魂器数据 (Tote Data)
// =================================

/**
 * @route GET /totes/data
 * @description 获取所有魂器核心数据列表（仅ID和名称）
 * @returns {object} 200 - 成功获取魂器数据列表
 */
router.get('/totes/data', (req: Request, res: Response) => {
  const allData = getAllToteData();
  const simplifiedData = allData.map(d => ({ id: d.id, name: d.name }));
  res.json({
    success: true,
    data: simplifiedData,
    count: simplifiedData.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route GET /totes/data/:id
 * @description 根据ID获取单个魂器数据项
 * @param {number} id - 魂器数据项的唯一ID
 * @returns {object} 200 - 成功获取魂器数据项
 * @returns {object} 404 - 未找到指定ID的魂器数据项
 */
router.get('/totes/data/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const toteData = getToteDataById(id);

  if (toteData) {
    res.json({
      success: true,
      data: toteData,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Tote data item not found',
      timestamp: new Date().toISOString(),
    });
  }
});

// =================================
// 魂器词条 (Tote Entries)
// =================================

/**
 * @route GET /totes/entries
 * @description 获取所有魂器词条列表
 * @returns {object} 200 - 成功获取魂器词条列表
 */
router.get('/totes/entries', (req: Request, res: Response) => {
  const allEntries = getAllToteEntries();
  const simplifiedEntries = allEntries.map(e => ({ id: e.id, name: e.name }));
  res.json({
    success: true,
    data: simplifiedEntries,
    count: simplifiedEntries.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route GET /totes/entries/:id
 * @description 根据ID获取单个魂器词条
 * @param {number} id - 魂器词条的唯一ID
 * @returns {object} 200 - 成功获取魂器词条
 * @returns {object} 404 - 未找到指定ID的魂器词条
 */
router.get('/totes/entries/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const toteEntry = getToteEntryById(id);

  if (toteEntry) {
    res.json({
      success: true,
      data: toteEntry,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Tote entry not found',
      timestamp: new Date().toISOString(),
    });
  }
});

// =================================
// 魂器数值 (Tote Values)
// =================================

/**
 * @route GET /totes/values
 * @description 获取所有魂器数值列表（仅ID和名称）
 * @returns {object} 200 - 成功获取魂器数值列表
 */
router.get('/totes/values', (req: Request, res: Response) => {
  const allValues = getAllToteValues();
  const simplifiedValues = allValues.map(v => ({ id: v.id, name: v.name }));
  res.json({
    success: true,
    data: simplifiedValues,
    count: simplifiedValues.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route GET /totes/values/:id
 * @description 根据ID获取单个魂器数值
 * @param {number} id - 魂器数值的唯一ID
 * @returns {object} 200 - 成功获取魂器数值
 * @returns {object} 404 - 未找到指定ID的魂器数值
 */
router.get('/totes/values/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const toteValue = getToteValueById(id);

  if (toteValue) {
    res.json({
      success: true,
      data: toteValue,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Tote value not found',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;