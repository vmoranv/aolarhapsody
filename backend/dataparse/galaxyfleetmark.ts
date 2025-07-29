import { fetchAndParseJSON } from './game-data-parser';
import { GalaxyFleetMark } from '../types/galaxyfleetmark';

const galaxyFleetMarkCache: Record<string, GalaxyFleetMark> = {};

/**
 * 初始化银河舰队徽章数据模块
 */
export async function initGalaxyFleetMarkModule(): Promise<boolean> {
  try {
    const url = 'https://aola.100bt.com/h5/data/galaxygleetmarkdata.json';
    const response = await fetchAndParseJSON(url) as {
      data: Record<string, (string | number)[]>;
    };

    if (!response || !response.data) {
      console.error('银河舰队徽章数据为空或格式不正确');
      return false;
    }

    // 解析徽章
    Object.values(response.data).forEach(item => {
      if (Array.isArray(item) && item.length >= 8) {
        const mark: GalaxyFleetMark = {
          id: Number(item[0]),
          name: String(item[1]),
          type: Number(item[2]),
          price: Number(item[3]),
          rmb: Number(item[4]),
          level: Number(item[5]),
          desc: String(item[6]),
          startDate: String(item[7]),
        };
        galaxyFleetMarkCache[mark.id] = mark;
      }
    });

    return true;
  } catch (error) {
    console.error('解析银河舰队徽章数据时出错:', error);
    return false;
  }
}

/**
 * 获取所有已缓存的银河舰队徽章的简要列表
 * @returns {{ id: number; name: string }[]} 包含徽章ID和名称的对象数组
 */
export function getAllGalaxyFleetMarks(): { id: number; name: string }[] {
  return Object.values(galaxyFleetMarkCache).map(mark => ({
    id: mark.id,
    name: mark.name,
  }));
}

/**
 * 根据ID获取单个银河舰队徽章的完整信息
 * @param {string} id - 徽章的ID
 * @returns {GalaxyFleetMark | null} 对应的徽章对象，如果未找到则返回null
 */
export function getGalaxyFleetMarkById(id: string): GalaxyFleetMark | null {
  return galaxyFleetMarkCache[id] || null;
}