import { HKBuff, HKData } from '../types/hk';
import { URL_CONFIG } from '../types/urlconfig';
import { fetchAndParseJSON } from './gamedataparser';

const hkDataCache: Record<string, HKData> = {};
const hkBuffCache: Record<string, HKBuff> = {};

/**
 * 初始化魂卡和魂卡Buff数据模块
 */
export async function initHkModule(): Promise<boolean> {
  try {
    const response = (await fetchAndParseJSON(URL_CONFIG.hk)) as {
      data: Record<string, (string | number)[]>;
      buff: Record<string, (string | number | string[])[]>;
    };

    if (!response || !response.data || !response.buff) {
      console.error('魂卡数据为空或格式不正确');
      return false;
    }

    // 解析魂卡
    Object.values(response.data).forEach((item) => {
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
    Object.entries(response.buff).forEach(([key, item]) => {
      if (Array.isArray(item) && item.length >= 6) {
        try {
          const buff: HKBuff = {
            id: Number(item[0]),
            name: String(item[1]),
            decs: Array.isArray(item[2]) ? (item[2] as string[]) : [],
            costs: Array.isArray(item[3])
              ? (item[3] as unknown as number[])
              : typeof item[3] === 'number'
                ? [item[3]]
                : [],
            fontColor: String(item[4]),
            color: Number(item[5]),
            buffNames: Array.isArray(item[6]) ? (item[6] as string[]) : [],
            values: Array.isArray(item[7]) ? (item[7] as string[]) : [],
          };

          // 处理较短的数组格式
          if (item.length < 8) {
            // 对于较短的格式，使用默认值填充缺失的字段
            buff.buffNames = [];
            buff.values = [];
          }

          hkBuffCache[buff.id] = buff;
        } catch (parseError) {
          console.error(`解析Buff ${key} 时出错:`, item, parseError);
        }
      } else {
        console.warn(`Buff ${key} 格式不正确:`, item);
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
