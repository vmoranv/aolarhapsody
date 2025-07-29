import { Router, Request, Response } from 'express';
import {
  getAllClothes,
  getClothesById,
  getAllClothesSuits,
  getClothesSuitById,
  getAllClothesAffectBody,
  getAllClothesParts,
  getClothesPartById,
} from '../dataparse/clothes';

const router = Router();

// =================================
// 服装API
// =================================

/**
 * @route GET /clothes
 * @description 获取所有服装。
 * @returns {object} 200 - 包含所有服装的数组。
 */
router.get('/clothes', (req: Request, res: Response) => {
  const clothes = getAllClothes();
  res.json({
    success: true,
    data: clothes,
    count: clothes.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route GET /clothes/parts
 * @description 获取所有服装部件。
 * @returns {object} 200 - 包含所有服装部件的数组。
 */
router.get('/clothes/parts', (req: Request, res: Response) => {
  const parts = getAllClothesParts();
  res.json({
    success: true,
    data: parts,
    count: parts.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route GET /clothes/parts/:id
 * @description 根据ID获取单个服装部件。
 * @param {string} id - 服装部件ID。
 * @returns {object} 200 - 服装部件对象。
 * @returns {object} 404 - 如果未找到服装部件。
 */
router.get('/clothes/parts/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const part = getClothesPartById(id);

  if (part) {
    res.json({
      success: true,
      data: part,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的服装部件`,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * @route GET /clothes/:id
 * @description 根据ID获取单件服装。
 * @param {string} id - 服装ID。
 * @returns {object} 200 - 服装对象。
 * @returns {object} 404 - 如果未找到服装。
 */
router.get('/clothes/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const clothes = getClothesById(id);

  if (clothes) {
    res.json({
      success: true,
      data: clothes,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的服装`,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * @route GET /clothes-suits
 * @description 获取所有服装套装。
 * @returns {object} 200 - 包含所有服装套装的数组。
 */
router.get('/clothes-suits', (req: Request, res: Response) => {
  const suits = getAllClothesSuits();
  res.json({
    success: true,
    data: suits,
    count: suits.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route GET /clothes-suit/:id
 * @description 根据ID获取单个服装套装。
 * @param {string} id - 服装套装ID。
 * @returns {object} 200 - 服装套装对象。
 * @returns {object} 404 - 如果未找到服装套装。
 */
router.get('/clothes-suit/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const suit = getClothesSuitById(id);

  if (suit) {
    res.json({
      success: true,
      data: suit,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的服装套装`,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * @route GET /clothes-affect-body
 * @description 获取所有影响身体的服装。
 * @returns {object} 200 - 包含所有影响身体的服装的数组。
 */
router.get('/clothes-affect-body', (req: Request, res: Response) => {
    const affectBody = getAllClothesAffectBody();
    res.json({
        success: true,
        data: affectBody,
        count: affectBody.length,
        timestamp: new Date().toISOString(),
    });
});

export default router;