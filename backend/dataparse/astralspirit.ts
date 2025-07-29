import { fetchAndParseJSON } from './game-data-parser';
import { AstralSpirit, AstralSpiritSuit } from '../types/astralspirit';

const astralSpiritCache: Record<string, AstralSpirit> = {};
const astralSpiritSuitCache: Record<string, AstralSpiritSuit> = {};

/**
 * 初始化星灵数据模块
 */
export async function initAstralSpiritDataModule(): Promise<boolean> {
  try {
    const url = 'https://aola.100bt.com/h5/data/astralspiritdata.json';
    const response = await fetchAndParseJSON(url) as {
      data: Record<string, (string | number | boolean)[]>,
      suit: Record<string, (string | number | number[])[]>
    };

    if (!response) {
      console.error('星灵数据为空或格式不正确');
      return false;
    }

    // 解析星灵
    if (response.data) {
      Object.entries(response.data).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length >= 25) {
          astralSpiritCache[key] = {
            id: Number(value[0]),
            name: String(value[1]),
            subtype: Number(value[2]),
            price: Number(value[3]),
            rmb: Number(value[4]),
            dailyQuantity: Number(value[5]),
            sale: Boolean(value[6]),
            vip: Boolean(value[7]),
            trade: Boolean(value[8]),
            maxQuantity: Number(value[9]),
            hp: Number(value[10]),
            attack: Number(value[11]),
            defend: Number(value[12]),
            sAttack: Number(value[13]),
            sDefend: Number(value[14]),
            speed: Number(value[15]),
            hpInc: Number(value[16]),
            attackInc: Number(value[17]),
            defendInc: Number(value[18]),
            sAttackInc: Number(value[19]),
            sDefendInc: Number(value[20]),
            speedInc: Number(value[21]),
            suitId: Number(value[22]),
            strengthType: Number(value[23]),
            limitDate: String(value[24]),
          };
        }
      });
    }

    // 解析套装
    if (response.suit) {
      Object.entries(response.suit).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length >= 6) {
          astralSpiritSuitCache[key] = {
            id: Number(value[0]),
            name: String(value[1]),
            surIds: value[2] as number[],
            activeNeed: Number(value[3]),
            suitEffectDes: String(value[4]),
            oneShenhuaSuitEffectDes: String(value[5]),
            threeShenHuaSuitEffectDes: String(value[6]),
          };
        }
      });
    }

    return true;
  } catch (error) {
    console.error('解析星灵数据时出错:', error);
    return false;
  }
}

/**
 * 获取所有已缓存星灵的简要列表
 * @returns {{ id: number; name: string }[]} 包含星灵ID和名称的对象数组
 */
export function getAllAstralSpirits(): { id: number; name: string }[] {
  return Object.values(astralSpiritCache).map(spirit => ({
    id: spirit.id,
    name: spirit.name,
  }));
}

/**
 * 根据ID获取单个星灵的完整信息
 * @param {string} id - 星灵的ID
 * @returns {AstralSpirit | null} 对应的星灵对象，如果未找到则返回null
 */
export function getAstralSpiritById(id: string): AstralSpirit | null {
  return astralSpiritCache[id] || null;
}

/**
 * 获取所有已缓存星灵套装的简要列表
 * @returns {{ id: number; name: string }[]} 包含套装ID和名称的对象数组
 */
export function getAllAstralSpiritSuits(): { id: number; name: string }[] {
  return Object.values(astralSpiritSuitCache).map(suit => ({
    id: suit.id,
    name: suit.name,
  }));
}

/**
 * 根据ID获取单个星灵套装的完整信息
 * @param {string} id - 套装的ID
 * @returns {AstralSpiritSuit | null} 对应的套装对象，如果未找到则返回null
 */
export function getAstralSpiritSuitById(id: string): AstralSpiritSuit | null {
  return astralSpiritSuitCache[id] || null;
}