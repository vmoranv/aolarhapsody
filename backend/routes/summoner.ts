import { Request, Response, Router } from 'express';
import { getAllSummonerSkills, getSummonerSkillById } from '../dataparse/summoner';

const router = Router();

// =================================
// 召唤师技能API
// =================================

/**
 * @route GET /summonerskills
 * @description 获取所有召唤师技能的简化列表
 * @returns {object} 200 - 成功获取召唤师技能列表
 */
router.get('/summonerskills', (req: Request, res: Response) => {
  const skills = getAllSummonerSkills();
  const simplifiedSkills = skills.map((item) => ({
    id: item.id,
    name: item.name,
  }));
  res.json({
    success: true,
    data: simplifiedSkills,
    count: simplifiedSkills.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route GET /summonerskills/:id
 * @description 通过ID获取单个召唤师技能的详细信息
 * @param {string} id - 召唤师技能的唯一ID
 * @returns {object} 200 - 成功获取召唤师技能信息
 * @returns {object} 404 - 未找到指定ID的召唤师技能
 */
router.get('/summonerskills/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const skill = getSummonerSkillById(id);

  if (skill) {
    res.json({
      success: true,
      data: skill,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的召唤师技能`,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
