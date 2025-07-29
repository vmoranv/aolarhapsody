import { Router, Request, Response } from 'express';
import {
  getAllSummonerSkills,
  getSummonerSkillById,
} from '../dataparse/summoner';

const router = Router();

// =================================
// 召唤师技能API
// =================================
router.get('/summonerskills', (req: Request, res: Response) => {
  const skills = getAllSummonerSkills();
  const simplifiedSkills = skills.map(item => ({
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