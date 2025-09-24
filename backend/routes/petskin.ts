import express from 'express';
import { getPetSkinById,getPetSkins } from '../dataparse/petskin';

const router = express.Router();

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
