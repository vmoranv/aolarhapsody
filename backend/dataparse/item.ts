import { fetchAndParseJSON } from './game-data-parser';
import { Item } from '../types/item';

const itemCache: Record<string, Item> = {};
let petItemIds: number[] = [];

/**
 * 初始化道具数据模块
 */
export async function initItemModule(): Promise<boolean> {
  try {
    const url = 'https://aola.100bt.com/h5/data/itemdata.json';
    console.log('开始获取道具数据JSON文件...');
    const response = await fetchAndParseJSON(url) as {
      data: Record<string, (string | number | boolean)[]>;
      petitem: number[][];
    };

    if (!response || !response.data || !response.petitem) {
      console.error('道具数据为空或格式不正确');
      return false;
    }

    // 解析道具
    Object.values(response.data).forEach(itemData => {
      if (Array.isArray(itemData) && itemData.length >= 11) {
        const item: Item = {
          id: Number(itemData[0]),
          name: String(itemData[1]),
          type: Number(itemData[2]),
          price: Number(itemData[3]),
          rmb: Number(itemData[4]),
          dailyQuantity: Number(itemData[5]),
          stackable: Boolean(itemData[6]),
          sellable: Boolean(itemData[7]),
          tradeable: Boolean(itemData[8]),
          maxQuantity: Number(itemData[9]),
          des: String(itemData[10]),
        };
        itemCache[item.id] = item;
      }
    });

    // 解析宠物相关道具ID
    if (response.petitem.length > 0 && Array.isArray(response.petitem[0])) {
        petItemIds = response.petitem[0];
    }


    console.log(`成功解析并缓存了 ${Object.keys(itemCache).length} 个道具和 ${petItemIds.length} 个宠物相关道具ID`);
    return true;
  } catch (error) {
    console.error('解析道具数据时出错:', error);
    return false;
  }
}

/**
 * 获取所有已缓存的道具。
 * @returns {Item[]} 道具对象数组。
 */
export function getAllItems(): Item[] {
  return Object.values(itemCache);
}

/**
 * 根据ID获取单个道具。
 * @param {string} id - 道具的ID。
 * @returns {Item | null} 对应的道具对象，如果未找到则返回null。
 */
export function getItemById(id: string): Item | null {
  return itemCache[id] || null;
}

/**
 * 获取所有与宠物相关的道具ID。
 * @returns {number[]} 宠物相关道具ID的数组。
 */
export function getPetItemIds(): number[] {
  return petItemIds;
}