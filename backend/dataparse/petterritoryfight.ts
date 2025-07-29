import { fetchAndParseData } from './game-data-parser';
import { PetTerritoryFight, PetTerritoryFetter } from '../types/petterritoryfight';

/**
 * 原始亚比领域战数据负载接口。
 */
interface RawPetTerritoryFightPayload {
  data: Record<string, (string | number)[]>;
  fetter: Record<string, (string | number | string[])[]>;
}

const cachedFights: Record<number, PetTerritoryFight> = {};
const cachedFetters: Record<number, PetTerritoryFetter> = {};

/**
 * 初始化领域数据模块。
 * @returns {Promise<boolean>} 如果初始化成功，则返回true，否则返回false。
 */
export async function initPetTerritoryFightModule(): Promise<boolean> {
  try {
    const url = 'https://aola.100bt.com/h5/data/petterritoryfightdata.json';
    console.log('开始获取领域数据JSON文件...');
    const rawData = await fetchAndParseData<RawPetTerritoryFightPayload>(url);

    if (!rawData || typeof rawData !== 'object' || !rawData.data) {
      console.error('领域数据为空或格式不正确');
      return false;
    }

    // 解析领域数据
    for (const key in rawData.data) {
      const item = rawData.data[key];
      const id = parseInt(item[0] as string, 10);
      cachedFights[id] = {
        id: id,
        name: item[1] as string,
        characterDes: item[2] as string,
        allAreaPowerDes: item[3] as string | undefined,
        mainAreaPowerDes: item[4] as string | undefined,
        territoryDetailDes: item[5] as string | undefined,
        territorySimpleDes: item[6] as string | undefined,
      };
    }

    // 解析羁绊数据
    if (rawData.fetter) {
      for (const key in rawData.fetter) {
        const item = rawData.fetter[key];
        const id = parseInt(item[0] as string, 10);
        cachedFetters[id] = {
          id: id,
          name: item[1] as string,
          conditions: item[2] as string[],
        };
      }
    }
    
    console.log(`成功解析并缓存了 ${Object.keys(cachedFights).length} 个领域和 ${Object.keys(cachedFetters).length} 个羁绊`);
    return true;
  } catch (error) {
    console.error('解析领域数据时出错:', error);
    return false;
  }
}

/**
 * 获取所有亚比领域战（简化版）。
 * @returns {{id: number, name: string}[]} 所有亚比领域战的简化信息数组。
 */
export function getAllPetTerritoryFights() {
  return Object.values(cachedFights).map(p => ({ id: p.id, name: p.name }));
}

/**
 * 根据ID获取亚比领域战。
 * @param {number} id - 领域ID。
 * @returns {PetTerritoryFight | undefined} 找到的亚比领域战，否则为undefined。
 */
export function getPetTerritoryFightById(id: number): PetTerritoryFight | undefined {
  return cachedFights[id];
}

/**
 * 根据ID获取亚比领域羁绊。
 * @param {number} id - 羁绊ID。
 * @returns {PetTerritoryFetter | undefined} 找到的亚比领域羁绊，否则为undefined。
 */
export function getPetTerritoryFetterById(id: number): PetTerritoryFetter | undefined {
  return cachedFetters[id];
}