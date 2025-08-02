import { GodCard, GodCardSuit } from '../types/godcard';
import { URL_CONFIG } from '../types/url-config';
import { fetchAndParseJSON } from './game-data-parser';

const godCardCache: Record<string, GodCard> = {};
const godCardSuitCache: Record<string, GodCardSuit> = {};

/**
 * 初始化神兵和神兵套装数据模块
 */
export async function initGodCardModule(): Promise<boolean> {
  try {
    const response = (await fetchAndParseJSON(URL_CONFIG.godCard)) as {
      data: Record<string, (string | number | number[] | null)[]>;
      suit: Record<string, (string | number | number[])[]>;
    };

    if (!response || !response.data || !response.suit) {
      console.error('神兵数据为空或格式不正确');
      return false;
    }

    // 解析神兵
    Object.values(response.data).forEach((item) => {
      if (Array.isArray(item) && item.length >= 17) {
        const card: GodCard = {
          cardId: Number(item[0]),
          name: String(item[1]),
          quality: Number(item[2]),
          hp: Number(item[3]),
          speed: Number(item[4]),
          attack: Number(item[5]),
          defend: Number(item[6]),
          sAttack: Number(item[7]),
          sDefend: Number(item[8]),
          desc: String(item[9]),
          limitRaceId: item[10] as number[],
          viewId: Number(item[11]),
          level: Number(item[12]),
          levelUpId: Number(item[13]),
          synthesisType: Number(item[14]),
          limitExtAppend: item[15] as null,
          originCardId: Number(item[16]),
        };
        godCardCache[card.cardId] = card;
      }
    });

    // 解析神兵套装
    Object.values(response.suit).forEach((item) => {
      if (Array.isArray(item) && item.length >= 5) {
        let suitName = String(item[2]);
        const godCardidList = item[3] as number[];

        // 如果套装名称为空，使用第一件装备的名称生成套装名称
        if ((!suitName || suitName.trim() === '') && godCardidList && godCardidList.length > 0) {
          const firstCardId = godCardidList[0];
          const firstCard = godCardCache[firstCardId];
          if (firstCard && firstCard.name) {
            // 提取装备名称中的基础名称和品质等级
            const qualityMatch = firstCard.name.match(/^(.+?)(传说|史诗|王者)/);
            if (qualityMatch) {
              const baseName = qualityMatch[1];
              const quality = qualityMatch[2];
              suitName = `${baseName}${quality}套装`;
            } else {
              suitName = `${firstCard.name}套装`;
            }
          }
        }

        const suit: GodCardSuit = {
          id: Number(item[0]),
          suitType: Number(item[1]),
          name: suitName,
          godCardidList: godCardidList,
          dec: String(item[4]),
        };
        godCardSuitCache[suit.id] = suit;
      }
    });

    return true;
  } catch (error) {
    console.error('解析神兵数据时出错:', error);
    return false;
  }
}

/**
 * 获取所有已缓存的神兵
 * @returns {GodCard[]} 神兵对象数组
 */
export function getAllGodCards(): GodCard[] {
  return Object.values(godCardCache);
}

/**
 * 根据ID获取单个神兵
 * @param {string} id - 神兵的ID
 * @returns {GodCard | null} 对应的神兵对象，如果未找到则返回null
 */
export function getGodCardById(id: string): GodCard | null {
  return godCardCache[id] || null;
}

/**
 * 获取所有已缓存的神兵套装
 * @returns {GodCardSuit[]} 神兵套装对象数组
 */
export function getAllGodCardSuits(): GodCardSuit[] {
  return Object.values(godCardSuitCache);
}

/**
 * 根据ID获取单个神兵套装
 * @param {string} id - 神兵套装的ID
 * @returns {GodCardSuit | null} 对应的神兵套装对象，如果未找到则返回null
 */
export function getGodCardSuitById(id: string): GodCardSuit | null {
  return godCardSuitCache[id] || null;
}
