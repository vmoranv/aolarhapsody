import { fetchAndParseJSON } from './game-data-parser';
import { SummonerSkillDataConfig } from '../types/summoner';

const summonerSkillCache: Record<string, SummonerSkillDataConfig> = {};

/**
 * 初始化召唤师技能数据模块
 */
export async function initSummonerModule(): Promise<boolean> {
  try {
    const url = 'https://aola.100bt.com/h5/data/summonerconfig.json';
    console.log('开始获取召唤师技能数据JSON文件...');
    const response = await fetchAndParseJSON(url) as {
      data: Record<string, (string | number)[]>;
    };

    if (!response || !response.data) {
      console.error('召唤师技能数据为空或格式不正确');
      return false;
    }

    // 解析召唤师技能
    Object.values(response.data).forEach(item => {
      if (Array.isArray(item) && item.length >= 4) {
        const skill: SummonerSkillDataConfig = {
          id: Number(item[0]),
          name: String(item[1]),
          desc: String(item[2]),
          cost: Number(item[3]),
        };
        summonerSkillCache[skill.id] = skill;
      }
    });

    console.log(`成功解析并缓存了 ${Object.keys(summonerSkillCache).length} 个召唤师技能`);
    return true;
  } catch (error) {
    console.error('解析召唤师技能数据时出错:', error);
    return false;
  }
}

/**
 * 获取所有召唤师技能
 */
export function getAllSummonerSkills(): SummonerSkillDataConfig[] {
  return Object.values(summonerSkillCache);
}

/**
 * 根据ID获取单个召唤师技能
 */
export function getSummonerSkillById(id: string): SummonerSkillDataConfig | null {
  return summonerSkillCache[id] || null;
}