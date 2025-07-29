import { fetchAndParseJSON } from './game-data-parser';
import { CrystalKey } from '../types/crystalkey';

const crystalKeyCache: Record<string, CrystalKey> = {};

/**
 * 初始化晶钥数据模块
 */
export async function initCrystalKeyModule(): Promise<boolean> {
  try {
    const url = 'https://aola.100bt.com/h5/data/crystalkeydata.json';
    console.log('开始获取晶钥数据JSON文件...');
    const response = await fetchAndParseJSON(url) as {
      data: Record<string, (string | number)[]>;
    };

    if (!response || !response.data) {
      console.error('晶钥数据为空或格式不正确');
      return false;
    }

    // 解析晶钥
    Object.values(response.data).forEach(item => {
      if (Array.isArray(item) && item.length >= 3) {
        const key: CrystalKey = {
          id: Number(item[0]),
          name: String(item[1]),
          description: String(item[2]),
        };
        crystalKeyCache[key.id] = key;
      }
    });

    console.log(`成功解析并缓存了 ${Object.keys(crystalKeyCache).length} 个晶钥`);
    return true;
  } catch (error) {
    console.error('解析晶钥数据时出错:', error);
    return false;
  }
}

/**
 * 获取所有晶钥
 */
export function getAllCrystalKeys(): CrystalKey[] {
  return Object.values(crystalKeyCache);
}

/**
 * 根据ID获取单个晶钥
 */
export function getCrystalKeyById(id: string): CrystalKey | null {
  return crystalKeyCache[id] || null;
}