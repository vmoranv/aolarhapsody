import { fetchAndParseJSON } from './game-data-parser';
import { Inscription } from '../types/inscription';

const inscriptionCache: Record<string, Inscription> = {};

/**
 * 初始化铭文数据模块
 */
export async function initInscriptionModule(): Promise<boolean> {
  try {
    const url = 'https://aola.100bt.com/h5/data/inscriptiondata.json';
    console.log('开始获取铭文数据JSON文件...');
    const response = await fetchAndParseJSON(url) as {
      data: Record<string, (string | number)[]>;
    };

    if (!response || !response.data) {
      console.error('铭文数据为空或格式不正确');
      return false;
    }

    // 解析铭文
    Object.values(response.data).forEach(item => {
      if (Array.isArray(item) && item.length >= 9) {
        const inscription: Inscription = {
          id: Number(item[0]),
          name: String(item[1]),
          price: Number(item[2]),
          rmb: Number(item[3]),
          inscriptionType: Number(item[4]),
          level: Number(item[5]),
          preLevelId: Number(item[6]),
          nextLevelId: Number(item[7]),
          desc: String(item[8]),
        };
        inscriptionCache[inscription.id] = inscription;
      }
    });

    console.log(`成功解析并缓存了 ${Object.keys(inscriptionCache).length} 个铭文`);
    return true;
  } catch (error) {
    console.error('解析铭文数据时出错:', error);
    return false;
  }
}

/**
 * 获取所有已缓存的铭文。
 * @returns {Inscription[]} 铭文对象数组。
 */
export function getAllInscriptions(): Inscription[] {
  return Object.values(inscriptionCache);
}

/**
 * 根据ID获取单个铭文。
 * @param {string} id - 铭文的ID。
 * @returns {Inscription | null} 对应的铭文对象，如果未找到则返回null。
 */
export function getInscriptionById(id: string): Inscription | null {
  return inscriptionCache[id] || null;
}