/**
 * @description 宠物卡片2 接口
 * @property {number} id - ID
 * @property {string} name - 名称
 * @property {boolean} trade - 是否可交易
 * @property {number} vip - VIP 等级
 * @property {boolean} isLimitedTime - 是否限时
 * @property {number} price - 价格
 * @property {number} rmb - 人民币价格
 * @property {number} level - 等级
 * @property {number} applyId - 应用 ID
 * @property {number} baseExp - 基础经验
 * @property {number[]} levelExpArea - 等级经验区间
 * @property {number[]} raceList - 种族列表
 * @property {number} viewId - 视图 ID
 */
export interface PetCard2 {
  id: number;
  name: string;
  trade: boolean;
  vip: number;
  isLimitedTime: boolean;
  price: number;
  rmb: number;
  level: number;
  applyId: number;
  baseExp: number;
  levelExpArea: number[];
  raceList: number[];
  viewId: number;
}

/**
 * @description 宠物卡片2详情 接口
 * @property {number} cardId - 卡片 ID
 * @property {string} name - 名称
 * @property {boolean} trade - 是否可交易
 * @property {number} vip - VIP 等级
 * @property {boolean} isLimitedTime - 是否限时
 * @property {number} price - 价格
 * @property {number} rmb - 人民币价格
 * @property {number} level - 等级
 * @property {number} applyId - 应用 ID
 * @property {number} baseExp - 基础经验
 * @property {number[] | null} levelExpArea - 等级经验区间
 * @property {number[]} raceList - 种族列表
 * @property {number} viewId - 视图 ID
 */
export interface PetCard2Detail {
  cardId: number;
  name: string;
  trade: boolean;
  vip: number;
  isLimitedTime: boolean;
  price: number;
  rmb: number;
  level: number;
  applyId: number;
  baseExp: number;
  levelExpArea: number[] | null;
  raceList: number[];
  viewId: number;
}

/**
 * @description 宠物卡片2描述 接口
 * @property {number} level - 等级
 * @property {string} description - 描述
 */
export interface PetCard2Description {
  level: number;
  description: string;
}

/**
 * @description 宠物卡片2描述响应 接口
 * @property {number} cardId - 卡片 ID
 * @property {PetCard2Description[]} descriptions - 描述列表
 */
export interface PetCard2DescriptionsResponse {
  cardId: number;
  descriptions: PetCard2Description[];
}
