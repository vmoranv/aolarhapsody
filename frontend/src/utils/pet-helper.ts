import type { Skill } from '../../../backend/types/pmdatalist';
import { URL_CONFIG } from '../types/url';
import { fetchData, fetchDataItem } from './api';

/**
 * 定义亚比图片的URL集合
 */
export interface PetImages {
  bigImage: string;
  smallImage: string;
  eggImage: string;
}

/**
 * 亚比简要信息
 */
export interface PetListItem {
  id: string | number;
  name: string;
}

/**
 * 获取亚比图片URL
 * @param id 亚比ID
 * @param type 图片类型 ('small', 'big', 'egg')
 * @returns 图片的URL
 */
export function getPetImageUrl(
  id: string | number,
  type: 'small' | 'big' | 'egg' = 'small'
): string {
  if (!id) {
    console.error('getPetImageUrl: ID不能为空');
    return '';
  }

  try {
    // 处理特殊ID格式
    const processedId = id.toString().replace('_0', '');
    const numId = Number(processedId);

    // 检查ID是否在有效范围内
    if (numId < 1 || numId > 9999) {
      console.warn(`ID ${processedId} 超出有效范围 (1-9999)`);
    }

    switch (type) {
      case 'big':
        // 大图URL
        if (numId >= 4399) {
          // 4399及以上使用新格式
          return `${URL_CONFIG.petIconPrefix}/newlarge/type1/peticon${numId}/peticon${numId}_1.png`;
        } else if (numId > 3923) {
          // 3924-4398使用e目录
          return `${URL_CONFIG.petIconPrefix}/big/e/peticon${numId}.png`;
        } else {
          // 1-3923使用普通目录
          return `${URL_CONFIG.petIconPrefix}/big/peticon${numId}.png`;
        }

      case 'small':
        // 小图URL
        if (numId >= 4399) {
          // 4399及以上使用新格式
          return `${URL_CONFIG.petIconPrefix}/newlarge/type1/peticon${numId}/peticon${numId}_0.png`;
        } else {
          // 1-4398使用普通格式
          return `${URL_CONFIG.petIconPrefix}/small/peticon${numId}.png`;
        }

      case 'egg':
        // 蛋图URL
        return `${URL_CONFIG.petEggPrefix}/egg${numId}.png`;

      default:
        return `${URL_CONFIG.petIconPrefix}/small/peticon${numId}.png`;
    }
  } catch (error) {
    console.error('getPetImageUrl出错:', error);
    return '';
  }
}

/**
 * 获取所有类型的亚比图片URL
 * @param id 亚比ID
 * @returns 包含所有类型图片URL的对象
 */
export function getPetImageUrls(id: string | number): PetImages {
  return {
    bigImage: getPetImageUrl(id, 'big'),
    smallImage: getPetImageUrl(id, 'small'),
    eggImage: getPetImageUrl(id, 'egg'),
  };
}

/**
 * 获取亚比简要列表
 * @returns 返回所有亚比的简要列表
 */
export async function fetchPetList(): Promise<PetListItem[]> {
  return fetchData<PetListItem>('pets');
}

/**
 * 根据ID获取单个亚比的原始数据
 * @param id 亚比ID
 * @returns 返回单个亚比的原始数据数组
 */
export async function fetchPetRawDataById(id: string | number): Promise<(string | number)[]> {
  return fetchDataItem<(string | number)[]>(`pet`, id.toString());
}

/**
 * 根据ID获取技能数据
 * @param id 技能ID
 * @returns 返回技能的详细数据
 */
export async function fetchSkillById(id: number): Promise<Skill> {
  return fetchDataItem<Skill>('skill', id.toString());
}
