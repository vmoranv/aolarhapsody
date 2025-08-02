import {
  Clothes,
  ClothesAffectBody,
  ClothesPart,
  ClothesSuit,
  DoublePoseClothes,
} from '../types/clothes';
import { URL_CONFIG } from '../types/urlconfig';
import { fetchAndParseJSON } from './gamedataparser';

const clothesCache: Record<string, Clothes> = {};
const clothesSuitCache: Record<string, ClothesSuit> = {};
const clothesAffectBodyCache: Record<string, ClothesAffectBody> = {};
const clothesPartCache: Record<string, ClothesPart> = {};
const exclusiveClothesCache: number[] = [];
const doublePoseClothesCache: Record<string, DoublePoseClothes> = {};

/**
 * 初始化服装数据模块
 */
export async function initClothesModule(): Promise<boolean> {
  try {
    const [clothesResponse, clothesPartResponse] = await Promise.all([
      fetchAndParseJSON(URL_CONFIG.clothesData) as Promise<{
        data: Record<string, (string | number | boolean)[]>;
        suit: Record<string, (string | number | number[])[]>;
        CLOTHES_AFFECT_BODY: Record<string, (string | number)[]>;
        EXCLUSIVE_CLOTHES: number[];
        doublePosConf: Record<string, (string | number | number[])[]>;
      }>,
      fetchAndParseJSON(URL_CONFIG.clothesPart) as Promise<{
        data: Record<string, string[]>;
      }>,
    ]);

    if (clothesResponse) {
      // 解析服装
      if (clothesResponse.data) {
        Object.entries(clothesResponse.data).forEach(([key, value]) => {
          if (Array.isArray(value) && value.length >= 12) {
            clothesCache[key] = {
              id: Number(value[0]),
              name: String(value[1]),
              vip: Boolean(value[2]),
              sale: Number(value[3]),
              trade: Boolean(value[4]),
              maxQuantity: Number(value[5]),
              price: Number(value[6]),
              rmb: Number(value[7]),
              type: Number(value[8]),
              recallRmb: Number(value[9]),
              classify: Number(value[10]),
              val: Number(value[11]),
            };
          }
        });
      }

      // 解析套装
      if (clothesResponse.suit) {
        Object.entries(clothesResponse.suit).forEach(([key, value]) => {
          if (Array.isArray(value) && value.length >= 3) {
            clothesSuitCache[key] = {
              id: Number(value[0]),
              name: String(value[1]),
              clothesList: value[2] as number[],
            };
          }
        });
      }

      // 解析身体部位影响
      if (clothesResponse.CLOTHES_AFFECT_BODY) {
        Object.entries(clothesResponse.CLOTHES_AFFECT_BODY).forEach(([key, value]) => {
          if (Array.isArray(value) && value.length >= 2) {
            clothesAffectBodyCache[key] = {
              clothesId: Number(value[0]),
              bodyPartType: Number(value[1]),
            };
          }
        });
      }

      // 解析专属服装
      if (Array.isArray(clothesResponse.EXCLUSIVE_CLOTHES)) {
        clothesResponse.EXCLUSIVE_CLOTHES.forEach((clothesId) => {
          if (typeof clothesId === 'number') {
            exclusiveClothesCache.push(clothesId);
          }
        });
      }

      // 解析双人姿势
      if (clothesResponse.doublePosConf) {
        Object.entries(clothesResponse.doublePosConf).forEach(([key, value]) => {
          if (Array.isArray(value) && value.length >= 4) {
            doublePoseClothesCache[key] = {
              id: Number(value[0]),
              originSuitIds: value[1] as number[],
              name: String(value[2]),
              xingbi: Number(value[3]),
            };
          }
        });
      }
    } else {
      console.error('服装数据为空或格式不正确');
    }

    if (clothesPartResponse) {
      if (clothesPartResponse.data) {
        Object.entries(clothesPartResponse.data).forEach(([key, value]) => {
          if (Array.isArray(value) && value.length >= 1) {
            clothesPartCache[key] = {
              id: Number(key),
              description: String(value[0]),
            };
          }
        });
      }
    } else {
      console.error('服装部件数据为空或格式不正确');
    }

    return true;
  } catch (error) {
    console.error('解析服装数据时出错:', error);
    return false;
  }
}

/**
 * 获取所有已缓存服装的简要列表
 * @returns {{ id: number; name: string }[]} 包含服装ID和名称的对象数组
 */
export function getAllClothes(): { id: number; name: string }[] {
  return Object.values(clothesCache).map((clothes) => ({
    id: clothes.id,
    name: clothes.name,
  }));
}

/**
 * 根据ID获取单件服装的完整信息
 * @param {string} id - 服装的ID
 * @returns {Clothes | null} 对应的服装对象，如果未找到则返回null
 */
export function getClothesById(id: string): Clothes | null {
  return clothesCache[id] || null;
}

/**
 * 获取所有已缓存服装套装的简要列表
 * @returns {{ id: number; name: string }[]} 包含套装ID和名称的对象数组
 */
export function getAllClothesSuits(): { id: number; name: string }[] {
  return Object.values(clothesSuitCache).map((suit) => ({
    id: suit.id,
    name: suit.name,
  }));
}

/**
 * 根据ID获取单个服装套装的完整信息
 * @param {string} id - 套装的ID
 * @returns {ClothesSuit | null} 对应的套装对象，如果未找到则返回null
 */
export function getClothesSuitById(id: string): ClothesSuit | null {
  return clothesSuitCache[id] || null;
}

/**
 * 获取所有已缓存的服装对身体部位的影响数据
 * @returns {ClothesAffectBody[]} 身体部位影响对象数组
 */
export function getAllClothesAffectBody(): ClothesAffectBody[] {
  return Object.values(clothesAffectBodyCache);
}

/**
 * 获取所有已缓存的服装部件
 * @returns {ClothesPart[]} 服装部件对象数组
 */
export function getAllClothesParts(): ClothesPart[] {
  return Object.values(clothesPartCache);
}

/**
 * 根据ID获取单个服装部件
 * @param {string} id - 部件的ID
 * @returns {ClothesPart | null} 对应的部件对象，如果未找到则返回null
 */
export function getClothesPartById(id: string): ClothesPart | null {
  return clothesPartCache[id] || null;
}

/**
 * 获取所有已缓存的专属服装ID
 * @returns {number[]} 专属服装ID数组
 */
export function getAllExclusiveClothes(): number[] {
  return exclusiveClothesCache;
}

/**
 * 获取所有已缓存的双人姿势配置
 * @returns {{ id: number; name: string }[]} 双人姿势配置对象数组
 */
export function getAllDoublePoseClothes(): { id: number; name: string }[] {
  return Object.values(doublePoseClothesCache).map((pose) => ({
    id: pose.id,
    name: pose.name,
  }));
}

/**
 * 根据ID获取单个双人姿势配置
 * @param {string} id - 双人姿势的ID
 * @returns {DoublePoseClothes | null} 对应的双人姿势配置对象，如果未找到则返回null
 */
export function getDoublePoseClothesById(id: string): DoublePoseClothes | null {
  return doublePoseClothesCache[id] || null;
}
