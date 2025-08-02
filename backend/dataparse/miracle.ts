import { MiraclePetAwakeData, MiraclePetBreakData, MiraclePetInfo } from '../types/miracle';
import { URL_CONFIG } from '../types/url-config';
import { fetchAndParseJSON } from './game-data-parser';

const awakeDataCache: Record<string, MiraclePetAwakeData> = {};
const petInfoDataCache: Record<string, MiraclePetInfo> = {};
const breakDataCache: Record<string, MiraclePetBreakData> = {};

/**
 * 初始化神迹数据模块
 */
export async function initMiracleModule(): Promise<boolean> {
  try {
    const response = (await fetchAndParseJSON(URL_CONFIG.miracle)) as {
      awakeData: Record<string, (string | number)[]>;
      petInfoData: Record<string, (string | number)[]>;
      breakData: Record<string, (string | number)[]>;
    };

    if (!response || !response.awakeData || !response.petInfoData || !response.breakData) {
      console.error('神迹数据为空或格式不正确');
      return false;
    }

    // 解析觉醒数据
    Object.values(response.awakeData).forEach((item) => {
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
    Object.values(response.petInfoData).forEach((item) => {
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
    Object.values(response.breakData).forEach((item) => {
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

    return true;
  } catch (error) {
    console.error('解析神迹数据时出错:', error);
    return false;
  }
}

/**
 * 获取所有已缓存的神迹觉醒数据
 * @returns {MiraclePetAwakeData[]} 神迹觉醒数据对象数组
 */
export function getAllAwakeData(): MiraclePetAwakeData[] {
  return Object.values(awakeDataCache);
}

/**
 * 获取所有已缓存的神迹宠物信息数据
 * @returns {MiraclePetInfo[]} 神迹宠物信息对象数组
 */
export function getAllPetInfoData(): MiraclePetInfo[] {
  return Object.values(petInfoDataCache);
}

/**
 * 获取所有已缓存的神迹突破数据
 * @returns {MiraclePetBreakData[]} 神迹突破数据对象数组
 */
export function getAllBreakData(): MiraclePetBreakData[] {
  return Object.values(breakDataCache);
}
