import { fetchAndParseData } from './game-data-parser';
import { PetTerritoryFight, PetTerritoryFetter } from '../types/petterritoryfight';

interface RawPetTerritoryFightPayload {
  data: Record<string, (string | number)[]>;
  fetter: Record<string, (string | number | string[])[]>;
}

const cachedFights: Record<number, PetTerritoryFight> = {};
const cachedFetters: Record<number, PetTerritoryFetter> = {};

/**
 * 初始化领域数据模块
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

    // 解析 data
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

    // 解析 fetter
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

export function getAllPetTerritoryFights() {
  return Object.values(cachedFights).map(p => ({ id: p.id, name: p.name }));
}

export function getPetTerritoryFightById(id: number): PetTerritoryFight | undefined {
  return cachedFights[id];
}

export function getPetTerritoryFetterById(id: number): PetTerritoryFetter | undefined {
  return cachedFetters[id];
}