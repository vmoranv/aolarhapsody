import { SummonerSkillDataConfig } from '../types/summoner';
import { URL_CONFIG } from '../types/urlconfig';
import { fetchAndParseJSON } from './gamedataparser';

const summonerSkillCache: Record<string, SummonerSkillDataConfig> = {};

/**
 * 初始化召唤师技能数据模块
 */
export async function initSummonerModule(): Promise<boolean> {
  try {
    const response = (await fetchAndParseJSON(URL_CONFIG.summoner)) as {
      data: Record<string, (string | number)[]>;
    };

    if (!response || !response.data) {
      console.error('召唤师技能数据为空或格式不正确');
      return false;
    }

    // 解析召唤师技能
    Object.values(response.data).forEach((item) => {
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

    return true;
  } catch (error) {
    console.error('解析召唤师技能数据时出错:', error);
    return false;
  }
}

/**
 * 获取所有已缓存的召唤师技能
 * @returns {SummonerSkillDataConfig[]} 召唤师技能对象数组
 */
export function getAllSummonerSkills(): SummonerSkillDataConfig[] {
  return Object.values(summonerSkillCache);
}

/**
 * 根据ID获取单个召唤师技能
 * @param {string} id - 召唤师技能的ID
 * @returns {SummonerSkillDataConfig | null} 对应的召唤师技能对象，如果未找到则返回null
 */
export function getSummonerSkillById(id: string): SummonerSkillDataConfig | null {
  return summonerSkillCache[id] || null;
}
