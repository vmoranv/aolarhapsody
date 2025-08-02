import { CrystalKey } from '../types/crystalkey';
import { URL_CONFIG } from '../types/urlconfig';
import { fetchAndParseJSON } from './gamedataparser';

const crystalKeyCache: Record<string, CrystalKey> = {};

/**
 * 初始化晶钥数据模块
 */
export async function initCrystalKeyModule(): Promise<boolean> {
  try {
    const response = (await fetchAndParseJSON(URL_CONFIG.crystalKey)) as {
      data: Record<string, (string | number)[]>;
    };

    if (!response || !response.data) {
      console.error('晶钥数据为空或格式不正确');
      return false;
    }

    // 解析晶钥
    Object.values(response.data).forEach((item) => {
      if (Array.isArray(item) && item.length >= 3) {
        const key: CrystalKey = {
          id: Number(item[0]),
          name: String(item[1]),
          description: String(item[2]),
        };
        crystalKeyCache[key.id] = key;
      }
    });

    return true;
  } catch (error) {
    console.error('解析晶钥数据时出错:', error);
    return false;
  }
}

/**
 * 获取所有已缓存的晶钥
 * @returns {CrystalKey[]} 晶钥对象数组
 */
export function getAllCrystalKeys(): CrystalKey[] {
  return Object.values(crystalKeyCache);
}

/**
 * 根据ID获取单个晶钥
 * @param {string} id - 晶钥的ID
 * @returns {CrystalKey | null} 对应的晶钥对象，如果未找到则返回null
 */
export function getCrystalKeyById(id: string): CrystalKey | null {
  return crystalKeyCache[id] || null;
}
