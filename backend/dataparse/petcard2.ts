import { PetCard2 } from '../types/petcard2';
import { URL_CONFIG } from '../types/urlconfig';
import { fetchAndParseJSON, fetchJavaScriptFile } from './gamedataparser';

const cachedPetCard2s: Record<string, PetCard2> = {};
const cachedDescriptions: Record<string, string> = {};

/**
 * 初始化特性晶石数据模块
 */
export async function initPetCard2Module(): Promise<boolean> {
  try {
    const responseData = (await fetchAndParseJSON(URL_CONFIG.petCard2)) as {
      data: Record<string, (string | number | boolean | number[])[]>;
    };

    if (!responseData || !responseData.data) {
      console.error('特性晶石数据为空或格式不正确');
      return false;
    }

    Object.values(responseData.data).forEach((item) => {
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

    // 获取描述数据
    await fetchAndCachePetCard2Descriptions();

    // 将描述数据合并到特性晶石数据中
    Object.values(cachedPetCard2s).forEach((card) => {
      const descriptionKey = `${card.cardId}_${card.level}`;
      if (cachedDescriptions[descriptionKey]) {
        card.description = cachedDescriptions[descriptionKey];
      }
    });

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

/**
 * 从main.js中获取并缓存特性晶石描述数据
 * @returns {Promise<boolean>} 如果成功获取并缓存数据则返回true，否则返回false
 */
export async function fetchAndCachePetCard2Descriptions(): Promise<boolean> {
  if (Object.keys(cachedDescriptions).length > 0) {
    return true; // 已经缓存过数据
  }

  try {
    const jsContent = await fetchJavaScriptFile(URL_CONFIG.gameMainJs);

    // 使用正则表达式直接匹配对象赋值
    const regex = new RegExp('PetCard2Descriptions\\.description\\s*=\\s*(\\{[\\s\\S]*?\\});', 'g');
    const match = regex.exec(jsContent);

    if (match && match[1]) {
      let dataString = match[1];
      // 移除注释
      dataString = dataString.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
      // 解析JSON对象
      const descriptionsData = JSON.parse(dataString) as Record<string, string>;

      if (descriptionsData && typeof descriptionsData === 'object') {
        Object.assign(cachedDescriptions, descriptionsData);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('获取特性晶石描述数据时出错:', error);
    return false;
  }
}

/**
 * 根据特性晶石ID获取所有等级的描述
 * @param {number} cardId - 特性晶石的ID
 * @returns {Array<{level: number, description: string}>} 包含等级和描述的对象数组
 */
export function getPetCard2DescriptionsById(
  cardId: number
): Array<{ level: number; description: string }> {
  const descriptions: Array<{ level: number; description: string }> = [];

  // 遍历所有缓存的描述，找到匹配的cardId
  Object.entries(cachedDescriptions).forEach(([key, description]) => {
    const [id, level] = key.split('_');
    if (parseInt(id) === cardId) {
      descriptions.push({
        level: parseInt(level),
        description: description,
      });
    }
  });

  // 按等级排序
  descriptions.sort((a, b) => a.level - b.level);

  return descriptions;
}
