/**
 * @description 图腾的接口
 * @interface Tote
 * @property {number} id - 图腾 ID
 * @property {string} name - 图腾名称
 * @property {number} type - 图腾类型
 * @property {number} quality - 品质
 * @property {number} price - 价格
 * @property {number} rmb - 人民币价格
 * @property {number} level - 等级
 * @property {string} desc - 描述
 * @property {string} category - 分类
 * @property {number} rarity - 稀有度
 */
export interface Tote {
  id: number;
  name: string;
  type: number;
  quality: number;
  price: number;
  rmb: number;
  level: number;
  desc: string;
  category: string;
  rarity: number;
}

/**
 * @description 图腾详情的接口
 * @interface ToteDetail
 * @property {number} id - 图腾 ID
 * @property {string} name - 图腾名称
 * @property {number} color - 颜色
 * @property {number} type - 类型
 * @property {string} baseValue - 基础值
 * @property {string} effectValue - 效果值
 * @property {string} advantageValue - 优势值
 * @property {string} tujianDes - 图鉴描述
 */
export interface ToteDetail {
  id: number;
  name: string;
  color: number;
  type: number;
  baseValue: string;
  effectValue: string;
  advantageValue: string;
  tujianDes: string;
}

/**
 * @description 图腾词条的接口
 * @interface ToteEntry
 * @property {number} id - 词条 ID
 * @property {string} name - 词条名称
 * @property {string} des - 词条描述
 */
export interface ToteEntry {
  id: number;
  name: string;
  des: string;
}
