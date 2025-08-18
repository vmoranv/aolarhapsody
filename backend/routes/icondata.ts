import { Request, Response, Router } from 'express';
import {
  getAllHeadIcons,
  getAllPetIcons,
  getHeadIconById,
  getPetIconById,
} from '../dataparse/icondata';

const router = Router();

// =================================
// 图标API
// =================================

/**
 * @route GET /peticons
 * @description 获取所有亚比图标
 * @returns {object} 200 - 包含所有亚比图标的数组
 */
router.get('/peticons', (req: Request, res: Response) => {
  const icons = getAllPetIcons();
  res.json({
    success: true,
    data: icons,
    count: icons.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route GET /peticons/:id
 * @description 根据ID获取单个亚比图标
 * @param {string} id - 亚比图标ID
 * @returns {object} 200 - 亚比图标对象
 * @returns {object} 404 - 如果未找到亚比图标
 */
router.get('/peticons/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const icon = getPetIconById(id);

  if (icon) {
    res.json({
      success: true,
      data: icon,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的亚比图标`,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * @route GET /headicons
 * @description 获取所有头像图标的简化列表
 * @returns {object} 200 - 包含所有头像图标的简化信息的数组
 */
router.get('/headicons', (req: Request, res: Response) => {
  const icons = getAllHeadIcons();
  const simplifiedIcons = icons.map((icon) => ({
    id: icon.id,
    name: icon.name,
  }));
  res.json({
    success: true,
    data: simplifiedIcons,
    count: simplifiedIcons.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route GET /headicons/:id
 * @description 根据ID获取单个头像图标
 * @param {string} id - 头像图标ID
 * @returns {object} 200 - 头像图标对象
 * @returns {object} 404 - 如果未找到头像图标
 */
router.get('/headicons/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const icon = getHeadIconById(id);

  if (icon) {
    res.json({
      success: true,
      data: icon,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的头像`,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
