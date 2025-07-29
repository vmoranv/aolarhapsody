import { fetchAndParseJSON } from './game-data-parser';
import { PetCard2 } from '../types/petcard2';

const cachedPetCard2s: Record<string, PetCard2> = {};

/**
 * 初始化特性晶石数据模块
 */
export async function initPetCard2Module(): Promise<boolean> {
  try {
    const url = 'https://aola.100bt.com/h5/data/petcard2data.json';
    console.log('开始获取特性晶石数据JSON文件...');
    const responseData = await fetchAndParseJSON(url) as {
      data: Record<string, (string | number | boolean | number[])[]>;
    };

    if (!responseData || !responseData.data) {
      console.error('特性晶石数据为空或格式不正确');
      return false;
    }

    Object.values(responseData.data).forEach(item => {
      if (item.length >= 13) {
        const raceListStr = item[11] as string;
        const raceList = raceListStr ? raceListStr.split(',').map(Number) : [];

        const card: PetCard2 = {
          cardId: item[0] as number,
          name: item[1] as string,
          trade: item[2] as boolean,
          vip: item[3] as number,
          isLimitedTime: item[4] as boolean,
          price: item[5] as number,
          rmb: item[6] as number,
          level: item[7] as number,
          applyId: item[8] as number,
          baseExp: item[9] as number,
          levelExpArea: item[10] as number[],
          raceList: raceList,
          viewId: item[12] as number,
        };
        cachedPetCard2s[card.cardId] = card;
      }
    });

    console.log(`成功解析并缓存了 ${Object.keys(cachedPetCard2s).length} 个特性晶石`);
    return true;
  } catch (error) {
    console.error('解析特性晶石数据时出错:', error);
    return false;
  }
}

/**
 * 获取所有已缓存的特性晶石
 * @returns {PetCard2[]} 特性晶石对象数组
 */
export function getAllPetCard2s(): PetCard2[] {
  return Object.values(cachedPetCard2s);
}

/**
 * 根据ID获取特定的特性晶石
 * @param {number} id - 特性晶石的ID
 * @returns {PetCard2 | undefined} 对应的特性晶石对象，如果未找到则返回undefined
 */
export function getPetCard2ById(id: number): PetCard2 | undefined {
  return cachedPetCard2s[id];
}