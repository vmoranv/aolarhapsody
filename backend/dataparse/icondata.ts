import { HeadIcon, PetIcon } from '../types/icondata';
import { URL_CONFIG } from '../types/url-config';
import { fetchAndParseJSON } from './game-data-parser';

const petIconCache: Record<string, PetIcon> = {};
const headIconCache: Record<string, HeadIcon> = {};

/**
 * 初始化图标数据模块
 */
export async function initIconModule(): Promise<boolean> {
  try {
    const [petIconResponse, headIconResponse] = await Promise.all([
      fetchAndParseJSON(URL_CONFIG.petIcon) as Promise<Record<string, number>>,
      fetchAndParseJSON(URL_CONFIG.headIcon) as Promise<{
        data: Record<string, (string | number)[]>;
      }>,
    ]);

    if (petIconResponse) {
      Object.entries(petIconResponse).forEach(([key, value]) => {
        petIconCache[key] = {
          viewId: Number(key),
          iconType: Number(value),
        };
      });
    } else {
      console.error('宠物图标数据为空或格式不正确');
    }

    if (headIconResponse && headIconResponse.data) {
      Object.values(headIconResponse.data).forEach((item) => {
        if (Array.isArray(item) && item.length >= 8) {
          const headIcon: HeadIcon = {
            id: Number(item[0]),
            name: String(item[1]),
            type: Number(item[2]),
            price: Number(item[3]),
            rmb: Number(item[4]),
            level: Number(item[5]),
            desc: String(item[6]),
            startDate: String(item[7]),
          };
          headIconCache[headIcon.id] = headIcon;
        }
      });
    } else {
      console.error('头像数据为空或格式不正确');
    }

    return true;
  } catch (error) {
    console.error('解析图标数据时出错:', error);
    return false;
  }
}

/**
 * 获取所有已缓存的宠物图标
 * @returns {PetIcon[]} 宠物图标对象数组
 */
export function getAllPetIcons(): PetIcon[] {
  return Object.values(petIconCache);
}

/**
 * 根据ID获取单个宠物图标
 * @param {string} id - 宠物图标的ID (viewId)
 * @returns {PetIcon | null} 对应的宠物图标对象，如果未找到则返回null
 */
export function getPetIconById(id: string): PetIcon | null {
  return petIconCache[id] || null;
}

/**
 * 获取所有已缓存的头像图标
 * @returns {HeadIcon[]} 头像图标对象数组
 */
export function getAllHeadIcons(): HeadIcon[] {
  return Object.values(headIconCache);
}

/**
 * 根据ID获取单个头像图标
 * @param {string} id - 头像图标的ID
 * @returns {HeadIcon | null} 对应的头像图标对象，如果未找到则返回null
 */
export function getHeadIconById(id: string): HeadIcon | null {
  return headIconCache[id] || null;
}
