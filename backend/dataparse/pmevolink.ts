import { fetchAndParseJSON } from './game-data-parser';
import { SpEvo } from '../types/pmevolink';

const spEvoCache: Record<string, SpEvo> = {};

/**
 * 初始化特殊进化数据模块
 */
export async function initSpEvoModule(): Promise<boolean> {
  try {
    const url = 'https://aola.100bt.com/h5/data/pmevolinkdata.json';
    const response = await fetchAndParseJSON(url) as {
      data: Record<string, string[]>;
    };

    if (!response || !response.data) {
      console.error('特殊进化数据为空或格式不正确');
      return false;
    }

    // 解析特殊进化
    Object.values(response.data).forEach(item => {
      if (Array.isArray(item) && item.length >= 3) {
        const evo: SpEvo = {
          beforeRaceId: Number(item[0]),
          afterRaceId: Number(item[1]),
          evoType: Number(item[2]),
        };
        spEvoCache[evo.beforeRaceId] = evo;
      }
    });

    return true;
  } catch (error) {
    console.error('解析特殊进化数据时出错:', error);
    return false;
  }
}

/**
 * 获取所有已缓存的特殊进化链接
 * @returns {SpEvo[]} 特殊进化链接对象数组
 */
export function getAllSpEvoLinks(): SpEvo[] {
  return Object.values(spEvoCache);
}

/**
 * 根据进化前的亚比ID获取单个特殊进化链接
 * @param {string} id - 进化前亚比的ID
 * @returns {SpEvo | null} 对应的特殊进化链接对象，如果未找到则返回null
 */
export function getSpEvoLinkByBeforeId(id: string): SpEvo | null {
  return spEvoCache[id] || null;
}