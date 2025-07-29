import { fetchAndParseJSON } from './game-data-parser';
import { PetDictionaryDataItem } from '../types/petdictionary';

const cachedPetDictionaryData: Record<string, PetDictionaryDataItem> = {};

/**
 * 初始化亚比图鉴数据模块
 */
export async function initPetDictionaryModule(): Promise<boolean> {
  try {
    const url = 'https://aola.100bt.com/h5/data/petdictionarydata.json';
    console.log('开始获取亚比图鉴数据JSON文件...');
    const responseData = await fetchAndParseJSON(url) as {
      data: Record<string, string[]>;
    };

    if (!responseData || !responseData.data) {
      console.error('亚比图鉴数据为空或格式不正确');
      return false;
    }

    Object.values(responseData.data).forEach(item => {
      if (item.length >= 22) { // Based on the markdown file structure
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
          // Index 20 is an unknown field and is ignored
          taskId: item[21],
        };
        cachedPetDictionaryData[dictItem.petID] = dictItem;
      }
    });

    console.log(`成功解析并缓存了 ${Object.keys(cachedPetDictionaryData).length} 个亚比图鉴条目`);
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