import express from 'express';
import { getPetSkinById, getPetSkins } from '../dataparse/petskin';

const router = express.Router();

/**
 * @description 获取所有宠物皮肤的简化列表
 * @route GET /petskins
 * @returns {Array<{id: number, name: string}>} - 简化后的皮肤列表
 */
router.get('/petskins', (_req, res) => {
  try {
    const skins = getPetSkins();
    const simplifiedSkins = skins.map((skin) => ({
      id: skin.id,
      name: skin.name,
    }));
    res.json(simplifiedSkins);
  } catch (error) {
    console.error('获取宠物皮肤列表时出错:', error);
    res.status(500).json({ error: '获取宠物皮肤列表时发生内部服务器错误' });
  }
});

/**
 * @description 根据 ID 获取指定的宠物皮肤的详细信息
 * @route GET /petskins/:id
 * @param {string} id - 皮肤的 ID
 * @returns {object} - 皮肤的详细信息
 */
router.get('/petskins/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: '无效的皮肤ID' });
    }

    const skin = getPetSkinById(id);
    if (skin) {
      res.json(skin);
    } else {
      res.status(404).json({ error: '未找到指定的宠物皮肤' });
    }
  } catch (error) {
    console.error('获取单个宠物皮肤时出错:', error);
    res.status(500).json({ error: '获取单个宠物皮肤时发生内部服务器错误' });
  }
});

export default router;
