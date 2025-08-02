import { PetCard, PetCardSuit } from '../types/petcard';
import { URL_CONFIG } from '../types/url-config';
import { fetchAndParseJSON } from './game-data-parser';

const cachedPetCards: Record<string, PetCard> = {};
const cachedPetCardSuits: Record<string, PetCardSuit> = {};

/**
 * 解析数字数组
 * @param {string | number[]} input - 输入的字符串或数字数组
 * @returns {number[]} 解析后的数字数组
 */
function parseNumberArray(input: string | number[]): number[] {
  if (typeof input === 'string') {
    return input.split(',').map(Number);
  }
  return input;
}

/**
 * 初始化装备数据模块
 * @returns {Promise<boolean>} 如果初始化成功，则返回true，否则返回false
 */
export async function initPetCardModule(): Promise<boolean> {
  try {
    const responseData = (await fetchAndParseJSON(URL_CONFIG.petCard)) as {
      data: Record<string, (string | number | boolean | number[])[]>;
      suit: Record<string, (string | number | boolean | number[])[]>;
    };

    if (!responseData || !responseData.data || !responseData.suit) {
      console.error('装备数据为空或格式不正确');
      return false;
    }

    // 解析装备卡
    Object.values(responseData.data).forEach((item) => {
      if (item.length >= 23) {
        const card: PetCard = {
          cardId: item[0] as number,
          name: item[1] as string,
          vip: item[2] as boolean,
          sale: item[3] as boolean,
          trade: item[4] as boolean,
          price: item[5] as number,
          rmb: item[6] as number,
          type: item[7] as number,
          color: item[8] as number,
          hp: item[9] as number,
          speed: item[10] as number,
          attack: item[11] as number,
          defend: item[12] as number,
          sAttack: item[13] as number,
          sDefend: item[14] as number,
          desc: item[15] as string,
          limitRaceId: parseNumberArray(item[16] as string),
          viewId: item[17] as number,
          level: item[18] as number,
          levelUpId: item[19] as number,
          suitIds: item[20] as string,
          limitExtAppend: item[21] as string,
          originCardId: item[22] as number,
        };
        cachedPetCards[card.cardId] = card;
      }
    });

    // 解析装备卡套装
    Object.values(responseData.suit).forEach((item) => {
      if (item.length >= 8) {
        const suit: PetCardSuit = {
          id: item[0] as number,
          name: item[1] as string,
          idList: item[2] as number[],
          dec: item[3] as unknown as string[],
          petIds: item[4] as number[],
          simpleDec: item[5] as unknown as string[],
          newTipsArr0: item[6] as unknown as string[],
          newTipsArr1: item[7] as unknown as string[],
        };
        cachedPetCardSuits[suit.id] = suit;
      }
    });

    return true;
  } catch (error) {
    console.error('解析装备数据时出错:', error);
    return false;
  }
}

/**
 * 获取所有装备卡
 * @returns {PetCard[]} 所有装备卡的数组
 */
export function getAllPetCards(): PetCard[] {
  return Object.values(cachedPetCards);
}

/**
 * 根据ID获取装备卡
 * @param {number} id - 装备卡ID
 * @returns {PetCard | undefined} 找到的装备卡，否则为undefined
 */
export function getPetCardById(id: number): PetCard | undefined {
  return cachedPetCards[id];
}

/**
 * 获取所有装备卡套装
 * @returns {PetCardSuit[]} 所有装备卡套装的数组
 */
export function getAllPetCardSuits(): PetCardSuit[] {
  return Object.values(cachedPetCardSuits);
}

/**
 * 根据ID获取装备卡套装
 * @param {number} id - 装备卡套装ID
 * @returns {PetCardSuit | undefined} 找到的装备卡套装，否则为undefined
 */
export function getPetCardSuitById(id: number): PetCardSuit | undefined {
  return cachedPetCardSuits[id];
}
