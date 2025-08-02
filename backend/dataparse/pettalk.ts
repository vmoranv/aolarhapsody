import { PetTalk } from '../types/pettalk';
import { URL_CONFIG } from '../types/url-config';
import { fetchAndParseJSON } from './game-data-parser';

const cachedPetTalks: Record<number, string> = {};

/**
 * 初始化亚比语音数据模块
 */
export async function initPetTalkModule(): Promise<boolean> {
  try {
    const responseData = (await fetchAndParseJSON(URL_CONFIG.petTalk)) as Record<string, string>;

    if (!responseData) {
      console.error('亚比语音数据为空或格式不正确');
      return false;
    }

    Object.entries(responseData).forEach(([id, talk]) => {
      const raceId = parseInt(id, 10);
      if (!isNaN(raceId)) {
        cachedPetTalks[raceId] = talk;
      }
    });

    return true;
  } catch (error) {
    console.error('解析亚比语音数据时出错:', error);
    return false;
  }
}

/**
 * 获取所有已缓存的亚比语音的简化列表
 * @returns {{id: number, name: string}[]} 亚比语音对象数组
 */
export function getAllPetTalks(): { id: number; name: string }[] {
  return Object.entries(cachedPetTalks).map(([id, talk]) => ({
    id: parseInt(id, 10),
    name: talk,
  }));
}

/**
 * 根据种族ID获取特定的亚比语音
 * @param {number} id - 亚比的种族ID
 * @returns {PetTalk | undefined} 对应的亚比语音对象，如果未找到则返回undefined
 */
export function getPetTalksByRaceId(id: number): PetTalk | undefined {
  const talk = cachedPetTalks[id];
  if (talk) {
    return { raceId: id, talk: talk };
  }
  return undefined;
}
