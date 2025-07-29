import { fetchAndParseJSON } from './game-data-parser';
import { MiraclePetAwakeData, MiraclePetInfo, MiraclePetBreakData } from '../types/miracle';

const awakeDataCache: Record<string, MiraclePetAwakeData> = {};
const petInfoDataCache: Record<string, MiraclePetInfo> = {};
const breakDataCache: Record<string, MiraclePetBreakData> = {};

/**
 * 初始化奇迹数据模块
 */
export async function initMiracleModule(): Promise<boolean> {
  try {
    const url = 'https://aola.100bt.com/h5/data/miracledata.json';
    console.log('开始获取奇迹数据JSON文件...');
    const response = await fetchAndParseJSON(url) as {
      awakeData: Record<string, (string | number)[]>;
      petInfoData: Record<string, (string | number)[]>;
      breakData: Record<string, (string | number)[]>;
    };

    if (!response || !response.awakeData || !response.petInfoData || !response.breakData) {
      console.error('奇迹数据为空或格式不正确');
      return false;
    }

    // 解析觉醒数据
    Object.values(response.awakeData).forEach(item => {
      if (Array.isArray(item) && item.length >= 4) {
        const data: MiraclePetAwakeData = {
          miraclePetRaceId: Number(item[0]),
          awakeSeries: String(item[1]),
          awakeMaterialId: Number(item[2]),
          needNum: Number(item[3]),
        };
        awakeDataCache[data.miraclePetRaceId] = data;
      }
    });

    // 解析宠物信息数据
    Object.values(response.petInfoData).forEach(item => {
      if (Array.isArray(item) && item.length >= 4) {
        const data: MiraclePetInfo = {
          raceId: Number(item[0]),
          baseAbilityConf: String(item[1]),
          passiveSkillIds: String(item[2]),
          breakLevel: Number(item[3]),
        };
        petInfoDataCache[data.raceId] = data;
      }
    });

    // 解析突破数据
    Object.values(response.breakData).forEach(item => {
      if (Array.isArray(item) && item.length >= 5) {
        const data: MiraclePetBreakData = {
          raceId: Number(item[0]),
          materialId: Number(item[1]),
          materialAddAbilityConf: String(item[2]),
          breakSeriers: String(item[3]),
          encouragePhaseConf: String(item[4]),
        };
        breakDataCache[data.raceId] = data;
      }
    });

    console.log(`成功解析并缓存了 ${Object.keys(awakeDataCache).length} 条觉醒数据, ${Object.keys(petInfoDataCache).length} 条宠物信息数据, 和 ${Object.keys(breakDataCache).length} 条突破数据`);
    return true;
  } catch (error) {
    console.error('解析奇迹数据时出错:', error);
    return false;
  }
}

/**
 * 获取所有奇迹觉醒数据
 */
export function getAllAwakeData(): MiraclePetAwakeData[] {
  return Object.values(awakeDataCache);
}

/**
 * 获取所有奇迹宠物信息数据
 */
export function getAllPetInfoData(): MiraclePetInfo[] {
  return Object.values(petInfoDataCache);
}

/**
 * 获取所有奇迹突破数据
 */
export function getAllBreakData(): MiraclePetBreakData[] {
  return Object.values(breakDataCache);
}