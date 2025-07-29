import { fetchAndParseJSON } from './game-data-parser';
import { PetCard, PetCardSuit } from '../types/petcard';

const cachedPetCards: Record<string, PetCard> = {};
const cachedPetCardSuits: Record<string, PetCardSuit> = {};

function parseNumberArray(input: string | number[]): number[] {
  if (typeof input === 'string') {
    return input.split(',').map(Number);
  }
  return input;
}

/**
 * 初始化装备数据模块
 */
export async function initPetCardModule(): Promise<boolean> {
  try {
    const url = 'https://aola.100bt.com/h5/data/petcarddata.json';
    console.log('开始获取装备数据JSON文件...');
    const responseData = await fetchAndParseJSON(url) as {
      data: Record<string, (string | number | boolean | number[])[]>;
      suit: Record<string, (string | number | boolean | number[])[]>;
    };

    if (!responseData || !responseData.data || !responseData.suit) {
      console.error('装备数据为空或格式不正确');
      return false;
    }

    // Parse PetCards
    Object.values(responseData.data).forEach(item => {
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

    // Parse PetCardSuits
    Object.values(responseData.suit).forEach(item => {
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

    console.log(`成功解析并缓存了 ${Object.keys(cachedPetCards).length} 个装备和 ${Object.keys(cachedPetCardSuits).length} 个装备套装`);
    return true;
  } catch (error) {
    console.error('解析装备数据时出错:', error);
    return false;
  }
}

export function getAllPetCards(): PetCard[] {
  return Object.values(cachedPetCards);
}

export function getPetCardById(id: number): PetCard | undefined {
  return cachedPetCards[id];
}

export function getAllPetCardSuits(): PetCardSuit[] {
  return Object.values(cachedPetCardSuits);
}

export function getPetCardSuitById(id: number): PetCardSuit | undefined {
  return cachedPetCardSuits[id];
}