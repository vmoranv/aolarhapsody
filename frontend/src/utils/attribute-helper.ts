/**
 * 表示一个处理过的属性，包含ID和名称
 */
export type ProcessedAttribute = { id: number; name: string };

/**
 * 判断是否是超系
 * 使用ID>22作为判断标准
 *
 * @param {number} id - 系别ID
 * @returns {boolean} 是否为超系
 */
export function isSuperAttribute(id: number): boolean {
  return id > 22;
}

/**
 * 克制关系映射
 * 将游戏中的文本表示转换为数值倍率
 */
export const damageMapping: { [key: string]: number } = {
  '': 1, // 一般
  '1/2': 0.5, // 微弱
  '-1': -1, // 无效
  '2': 2, // 克制
  '3': 3, // 绝对克制
};

/**
 * 解析克制关系字符串为数值
 *
 * @param {string} relation - 克制关系字符串
 * @returns {number} 克制关系对应的数值倍率
 */
export function parseRelation(relation: string): number {
  if (!relation || relation === '') {
    return 1;
  }
  const value = damageMapping[relation];
  return value !== undefined ? value : 1;
}

/**
 * 克制关系描述
 * 用于UI展示的克制关系文本说明
 */
export const damageDescription: { [key: string]: string } = {
  immune: '无效',
  weak: '微弱',
  strong: '克制',
  super: '绝对克制',
};

/**
 * 克制关系颜色
 * 用于UI中不同克制关系的颜色显示
 */
export const damageColors: { [key: string]: string } = {
  immune: '#9e9e9e',
  weak: '#8bc34a',
  strong: '#ff9800',
  super: '#f44336',
};

import { URL_CONFIG } from '../types/url';

/**
 * 获取系别图标URL
 * 根据系别ID生成对应的图标URL
 *
 * @param {number|string} id - 系别ID或特殊标识
 * @returns {string} 系别图标URL
 */
export function getAttributeIconUrl(id: number | string): string {
  const { petAttributePrefix } = URL_CONFIG;
  // 特殊处理切换按钮的图标
  if (id === 'super-tab') {
    return `${petAttributePrefix}/attribute999.png`;
  }
  if (id === 'origin-tab') {
    return `${petAttributePrefix}/attribute1000.png`;
  }

  // 特殊处理统一的原系和超系图标
  if (id === 999) {
    // 超系统一图标
    return `${petAttributePrefix}/attribute999.png`;
  }
  if (id === 1000) {
    // 原系统一图标
    return `${petAttributePrefix}/attribute1000.png`;
  }

  // 原有的系别图标逻辑
  if (typeof id === 'number' && isSuperAttribute(id)) {
    return `${petAttributePrefix}/oldattribute${id}.png`;
  }
  return `${petAttributePrefix}/attribute${id}.png`;
}

/**
 * 获取时代/体系图标URL
 * @param eraName 时代/体系名称 ('gq', 'xinghui', etc.)
 * @param typeId 系统类型的数字ID
 * @returns 时代/体系图标的URL，如果不支持则返回空字符串
 */
export function getEraIconUrl(
  eraName: 'gq' | 'xinghui' | 'legend' | 'degenerator',
  typeId: number
): string {
  const { guangqiIconPrefix, xinghuiIconPrefix } = URL_CONFIG;
  const index = 0; // 硬编码为0

  switch (eraName) {
    case 'gq':
      return `${guangqiIconPrefix}/icon_${typeId}_${index}.png`;
    case 'xinghui':
      return `${xinghuiIconPrefix}/icon_${typeId}_${index}.png`;
    default:
      return ''; // legend 和 degenerator 没有特定图标
  }
}
