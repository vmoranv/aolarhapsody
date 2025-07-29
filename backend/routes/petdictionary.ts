import { Router, Request, Response } from 'express';
import { getAllPetDictionaryData, getPetDictionaryDataById } from '../dataparse/petdictionary';

const router = Router();

/**
 * @route GET /petdictionary
 * @description 获取所有亚比图鉴条目的简化列表
 * @returns {object} 200 - 成功获取亚比图鉴列表
 */
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

/**
 * @route GET /petdictionary/:id
 * @description 通过ID获取单个亚比图鉴条目的详细信息
 * @param {number} id - 亚比的唯一ID
 * @returns {object} 200 - 成功获取亚比图鉴信息
 * @returns {object} 404 - 未找到指定ID的亚比图鉴条目
 */
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