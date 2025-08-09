import { PetDictionaryDataItem } from '../types/petdictionary';
import { URL_CONFIG } from '../types/urlconfig';
import { fetchAndParseJSON } from './gamedataparser';
import { getPetFullDataById, getPetTypeData } from './pmdatalist';

const cachedPetDictionaryData: Record<string, PetDictionaryDataItem> = {};

/**
 * 初始化亚比图鉴数据模块
 */
export async function initPetDictionaryModule(): Promise<boolean> {
  try {
    const [responseData, petTypeData] = await Promise.all([
      fetchAndParseJSON(URL_CONFIG.petDictionary) as Promise<{
        data: Record<string, string[]>;
      }>,
      getPetTypeData(),
    ]);

    if (!responseData || !responseData.data) {
      console.error('亚比图鉴数据为空或格式不正确');
      return false;
    }

    const getType = (
      era: keyof typeof petTypeData,
      id: string
    ): { systemName: string; displayName: string } => {
      const eraData = petTypeData[era];
      return {
        systemName: eraData.idToSystemNameMap[id] || id,
        displayName: eraData.idToDisplayNameMap[id] || id,
      };
    };

    for (const item of Object.values(responseData.data)) {
      if (item.length >= 22) {
        const dictItem: PetDictionaryDataItem = {
          petID: parseInt(item[0], 10),
          petName: item[1],
          petWeight: item[2],
          petHeight: item[3],
          defAttribute: item[4],
          attAttribute: item[5],
          evolutionLevel: item[6],
          isNew: item[7],
          isRare: item[8],
          loc: item[9],
          getWay: item[10],
          petFavourite: item[11],
          petIntro: item[12],
          locations: item[13],
          securable: item[14],
          isHotPet: item[15],
          isKingPet: item[16],
          canComment: item[17],
          isPetSkin: item[18],
          skinRaceId: item[19],
          taskId: item[21],
        };

        const fullData = getPetFullDataById(dictItem.petID.toString());
        if (fullData) {
          const fullDataItem = fullData.rawData;
          if (fullDataItem.length > 75 && fullDataItem[75]) {
            const eraData = getType('gq', String(fullDataItem[75]));
            dictItem.petEra = { eraName: 'gq', ...eraData };
          } else if (fullDataItem.length > 60 && fullDataItem[60]) {
            const eraData = getType('xinghui', String(fullDataItem[60]));
            dictItem.petEra = { eraName: 'xinghui', ...eraData };
          } else if (fullDataItem.length > 48 && fullDataItem[48]) {
            const eraData = getType('degenerator', String(fullDataItem[48]));
            dictItem.petEra = { eraName: 'degenerator', ...eraData };
          } else if (fullDataItem.length > 45 && fullDataItem[45]) {
            const eraData = getType('legend', String(fullDataItem[45]));
            dictItem.petEra = { eraName: 'legend', ...eraData };
          }
        }
        cachedPetDictionaryData[dictItem.petID] = dictItem;
      }
    }

    return true;
  } catch (error) {
    console.error('解析亚比图鉴数据时出错:', error);
    return false;
  }
}

/**
 * 获取所有已缓存的亚比图鉴数据
 * @returns {PetDictionaryDataItem[]} 亚比图鉴条目对象数组
 */
export function getAllPetDictionaryData(): PetDictionaryDataItem[] {
  return Object.values(cachedPetDictionaryData);
}

/**
 * 根据宠物ID获取特定的亚比图鉴数据
 * @param {number} id - 宠物的ID
 * @returns {PetDictionaryDataItem | undefined} 对应的亚比图鉴条目对象，如果未找到则返回undefined
 */
export function getPetDictionaryDataById(id: number): PetDictionaryDataItem | undefined {
  return cachedPetDictionaryData[id];
}
