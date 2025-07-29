import { fetchAndParseJSON } from './game-data-parser';
import { EvolutionStone, SkillStone } from '../types/petstone';

const cachedEvolutionStones: Record<string, EvolutionStone> = {};
const cachedSkillStones: Record<string, SkillStone> = {};

/**
 * 初始化进化石和技能石数据模块
 */
export async function initPetStoneModule(): Promise<boolean> {
  try {
    const url = 'https://aola.100bt.com/h5/data/petstonedata.json';
    console.log('开始获取进化石和技能石数据JSON文件...');
    const responseData = await fetchAndParseJSON(url) as {
      evoData: Record<string, (string | number)[]>;
      skillData: Record<string, (string | number)[]>;
    };

    if (!responseData || !responseData.evoData || !responseData.skillData) {
      console.error('进化石和技能石数据为空或格式不正确');
      return false;
    }

    // Parse EvolutionStones
    Object.values(responseData.evoData).forEach(item => {
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
    Object.values(responseData.skillData).forEach(item => {
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

    console.log(`成功解析并缓存了 ${Object.keys(cachedEvolutionStones).length} 个进化石和 ${Object.keys(cachedSkillStones).length} 个技能石`);
    return true;
  } catch (error) {
    console.error('解析进化石和技能石数据时出错:', error);
    return false;
  }
}

export function getAllEvolutionStones(): EvolutionStone[] {
  return Object.values(cachedEvolutionStones);
}

export function getEvolutionStoneById(id: number): EvolutionStone | undefined {
  return cachedEvolutionStones[id];
}

export function getAllSkillStones(): SkillStone[] {
  return Object.values(cachedSkillStones);
}

export function getSkillStoneById(id: number): SkillStone | undefined {
  return cachedSkillStones[id];
}