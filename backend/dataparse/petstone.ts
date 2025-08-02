import { EvolutionStone, SkillStone } from '../types/petstone';
import { URL_CONFIG } from '../types/urlconfig';
import { fetchAndParseJSON } from './gamedataparser';

const cachedEvolutionStones: Record<string, EvolutionStone> = {};
const cachedSkillStones: Record<string, SkillStone> = {};

/**
 * 初始化进化石和技能石数据模块
 */
export async function initPetStoneModule(): Promise<boolean> {
  try {
    const responseData = (await fetchAndParseJSON(URL_CONFIG.petStone)) as {
      evoData: Record<string, (string | number)[]>;
      skillData: Record<string, (string | number)[]>;
    };

    if (!responseData || !responseData.evoData || !responseData.skillData) {
      console.error('进化石和技能石数据为空或格式不正确');
      return false;
    }

    // Parse EvolutionStones
    Object.values(responseData.evoData).forEach((item) => {
      if (item.length >= 4) {
        const stone: EvolutionStone = {
          id: item[0] as number,
          evoRaceId: item[1] as number,
          evoToRaceId: item[2] as number,
          levelLimit: item[3] as number,
        };
        cachedEvolutionStones[stone.id] = stone;
      }
    });

    // Parse SkillStones
    Object.values(responseData.skillData).forEach((item) => {
      if (item.length >= 4) {
        const stone: SkillStone = {
          id: item[0] as number,
          raceId: item[1] as number,
          skillId: item[2] as number,
          levelLimit: item[3] as number,
        };
        cachedSkillStones[stone.id] = stone;
      }
    });

    return true;
  } catch (error) {
    console.error('解析进化石和技能石数据时出错:', error);
    return false;
  }
}

/**
 * 获取所有已缓存的进化石
 * @returns {EvolutionStone[]} 进化石对象数组
 */
export function getAllEvolutionStones(): EvolutionStone[] {
  return Object.values(cachedEvolutionStones);
}

/**
 * 根据ID获取特定的进化石
 * @param {number} id - 进化石的ID
 * @returns {EvolutionStone | undefined} 对应的进化石对象，如果未找到则返回undefined
 */
export function getEvolutionStoneById(id: number): EvolutionStone | undefined {
  return cachedEvolutionStones[id];
}

/**
 * 获取所有已缓存的技能石
 * @returns {SkillStone[]} 技能石对象数组
 */
export function getAllSkillStones(): SkillStone[] {
  return Object.values(cachedSkillStones);
}

/**
 * 根据ID获取特定的技能石
 * @param {number} id - 技能石的ID
 * @returns {SkillStone | undefined} 对应的技能石对象，如果未找到则返回undefined
 */
export function getSkillStoneById(id: number): SkillStone | undefined {
  return cachedSkillStones[id];
}
