import { fetchAndParseJSON } from './game-data-parser';
import { PetIcon, HeadIcon } from '../types/icondata';

const petIconCache: Record<string, PetIcon> = {};
const headIconCache: Record<string, HeadIcon> = {};

/**
 * 初始化图标数据模块
 */
export async function initIconModule(): Promise<boolean> {
  try {
    const petIconUrl = 'https://aola.100bt.com/h5/data/peticondata.json';
    const headIconUrl = 'https://aola.100bt.com/h5/data/headicondata.json';
    console.log('开始获取宠物图标和头像数据JSON文件...');

    const [petIconResponse, headIconResponse] = await Promise.all([
      fetchAndParseJSON(petIconUrl) as Promise<Record<string, number>>,
      fetchAndParseJSON(headIconUrl) as Promise<{ data: Record<string, (string | number)[]> }>,
    ]);

    if (petIconResponse) {
      Object.entries(petIconResponse).forEach(([key, value]) => {
        petIconCache[key] = {
          viewId: Number(key),
          iconType: Number(value),
        };
      });
      console.log(`成功解析并缓存了 ${Object.keys(petIconCache).length} 个宠物图标`);
    } else {
      console.error('宠物图标数据为空或格式不正确');
    }

    if (headIconResponse && headIconResponse.data) {
      Object.values(headIconResponse.data).forEach(item => {
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
      console.log(`成功解析并缓存了 ${Object.keys(headIconCache).length} 个头像`);
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
 * 获取所有宠物图标
 */
export function getAllPetIcons(): PetIcon[] {
  return Object.values(petIconCache);
}

/**
 * 根据ID获取单个宠物图标
 */
export function getPetIconById(id: string): PetIcon | null {
  return petIconCache[id] || null;
}

/**
 * 获取所有头像
 */
export function getAllHeadIcons(): HeadIcon[] {
  return Object.values(headIconCache);
}

/**
 * 根据ID获取单个头像
 */
export function getHeadIconById(id: string): HeadIcon | null {
  return headIconCache[id] || null;
}