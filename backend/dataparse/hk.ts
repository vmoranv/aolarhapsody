import { fetchAndParseJSON } from './game-data-parser';
import { HKData, HKBuff } from '../types/hk';

const hkDataCache: Record<string, HKData> = {};
const hkBuffCache: Record<string, HKBuff> = {};

/**
 * 初始化魂卡和魂卡Buff数据模块
 */
export async function initHkModule(): Promise<boolean> {
  try {
    const url = 'https://aola.100bt.com/h5/data/hkdata.json';
    const response = await fetchAndParseJSON(url) as {
      data: Record<string, (string | number)[]>;
      buff: Record<string, (string | number | string[])[]>;
    };

    if (!response || !response.data || !response.buff) {
      console.error('魂卡数据为空或格式不正确');
      return false;
    }

    // 解析魂卡
    Object.values(response.data).forEach(item => {
      if (Array.isArray(item) && item.length >= 5) {
        const hk: HKData = {
          id: Number(item[0]),
          name: String(item[1]),
          color: Number(item[2]),
          wordBar: String(item[3]),
          produceType: Number(item[4]),
        };
        hkDataCache[hk.id] = hk;
      }
    });

    // 解析魂卡Buff
    Object.values(response.buff).forEach(item => {
      if (Array.isArray(item) && item.length >= 8) {
        const buff: HKBuff = {
          id: Number(item[0]),
          name: String(item[1]),
          decs: item[2] as string[],
          costs: item[3] as unknown as number[],
          fontColor: String(item[4]),
          color: Number(item[5]),
          buffNames: item[6] as string[],
          values: item[7] as string[],
        };
        hkBuffCache[buff.id] = buff;
      }
    });

    return true;
  } catch (error) {
    console.error('解析魂卡数据时出错:', error);
    return false;
  }
}

/**
 * 获取所有已缓存的魂卡
 * @returns {HKData[]} 魂卡对象数组
 */
export function getAllHkData(): HKData[] {
  return Object.values(hkDataCache);
}

/**
 * 根据ID获取单个魂卡
 * @param {string} id - 魂卡的ID
 * @returns {HKData | null} 对应的魂卡对象，如果未找到则返回null
 */
export function getHkDataById(id: string): HKData | null {
  return hkDataCache[id] || null;
}

/**
 * 获取所有已缓存的魂卡Buff
 * @returns {HKBuff[]} 魂卡Buff对象数组
 */
export function getAllHkBuffs(): HKBuff[] {
  return Object.values(hkBuffCache);
}

/**
 * 根据ID获取单个魂卡Buff
 * @param {string} id - 魂卡Buff的ID
 * @returns {HKBuff | null} 对应的魂卡Buff对象，如果未找到则返回null
 */
export function getHkBuffById(id: string): HKBuff | null {
  return hkBuffCache[id] || null;
}