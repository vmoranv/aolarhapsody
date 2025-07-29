import { fetchAndParseJSON } from './game-data-parser';
import { PetTalk } from '../types/pettalk';

const cachedPetTalks: Record<string, PetTalk> = {};

/**
 * 初始化亚比语音数据模块
 */
export async function initPetTalkModule(): Promise<boolean> {
  try {
    const url = 'https://aola.100bt.com/h5/data/pettalkdata.json';
    console.log('开始获取亚比语音数据JSON文件...');
    const responseData = await fetchAndParseJSON(url) as Record<string, (string | number)[]>;

    if (!responseData) {
      console.error('亚比语音数据为空或格式不正确');
      return false;
    }

    Object.values(responseData).forEach(item => {
      if (item.length >= 2) {
        const raceId = item[0] as number;
        const talk = item[1] as string;

        if (cachedPetTalks[raceId]) {
          // If raceId already exists, push the new talk
          cachedPetTalks[raceId].talks.push(talk);
        } else {
          // Otherwise, create a new entry
          cachedPetTalks[raceId] = {
            raceId: raceId,
            talks: [talk],
          };
        }
      }
    });

    console.log(`成功解析并缓存了 ${Object.keys(cachedPetTalks).length} 个亚比的语音`);
    return true;
  } catch (error) {
    console.error('解析亚比语音数据时出错:', error);
    return false;
  }
}

/**
 * 获取所有已缓存的亚比语音
 * @returns {PetTalk[]} 亚比语音对象数组
 */
export function getAllPetTalks(): PetTalk[] {
  return Object.values(cachedPetTalks);
}

/**
 * 根据种族ID获取特定的亚比语音
 * @param {number} id - 亚比的种族ID
 * @returns {PetTalk | undefined} 对应的亚比语音对象，如果未找到则返回undefined
 */
export function getPetTalksByRaceId(id: number): PetTalk | undefined {
  return cachedPetTalks[id];
}