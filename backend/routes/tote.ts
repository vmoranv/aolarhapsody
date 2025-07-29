import express, { Request, Response } from 'express';
import { getToteData, getToteDataById, getToteEntryById, getToteValueById } from '../dataparse/tote';

const router = express.Router();

/**
 * @route GET /totes
 * @description 获取所有魂器数据。返回一个包含所有魂器数据（data, entry, value）的对象。
 * @returns {object} 200 - 成功获取魂器数据。
 * @returns {object} 404 - 未找到魂器数据。
 */
router.get('/totes', (req: Request, res: Response) => {
  const allTotes = getToteData();
  if (allTotes) {
    res.json({
      success: true,
      data: allTotes,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Tote data not found',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * @route GET /totes/data/:id
 * @description 根据ID获取单个魂器数据项。
 * @param {number} id - 魂器数据项的唯一ID。
 * @returns {object} 200 - 成功获取魂器数据项。
 * @returns {object} 404 - 未找到指定ID的魂器数据项。
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

/**
 * @route GET /totes/entry/:id
 * @description 根据ID获取单个魂器词条。
 * @param {number} id - 魂器词条的唯一ID。
 * @returns {object} 200 - 成功获取魂器词条。
 * @returns {object} 404 - 未找到指定ID的魂器词条。
 */
router.get('/totes/entry/:id', (req: Request, res: Response) => {
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

/**
 * @route GET /totes/value/:id
 * @description 根据ID获取单个魂器数值。
 * @param {number} id - 魂器数值的唯一ID。
 * @returns {object} 200 - 成功获取魂器数值。
 * @returns {object} 404 - 未找到指定ID的魂器数值。
 */
router.get('/totes/value/:id', (req: Request, res: Response) => {
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