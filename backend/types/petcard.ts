/**
 * 表示装备卡
 */
export interface PetCard {
  /** 卡片ID */
  cardId: number;
  /** 名称 */
  name: string;
  /** 是否为VIP */
  vip: boolean;
  /** 是否出售 */
  sale: boolean;
  /** 是否可交易 */
  trade: boolean;
  /** 价格 */
  price: number;
  /** 人民币价格 */
  rmb: number;
  /** 类型 */
  type: number;
  /** 颜色 */
  color: number;
  /** 生命值 */
  hp: number;
  /** 速度 */
  speed: number;
  /** 攻击力 */
  attack: number;
  /** 防御力 */
  defend: number;
  /** 特殊攻击力 */
  sAttack: number;
  /** 特殊防御力 */
  sDefend: number;
  /** 描述 */
  desc: string;
  /** 限制的种族ID */
  limitRaceId: number[];
  /** 视图ID */
  viewId: number;
  /** 等级 */
  level: number;
  /** 升级ID */
  levelUpId: number;
  /** 套装ID，似乎是一个像 "0,5" 这样的字符串 */
  suitIds: string;
  /** 限制扩展附加 */
  limitExtAppend: string;
  /** 原始卡片ID */
  originCardId: number;
}

/**
 * 表示装备卡套装
 */
export interface PetCardSuit {
  /** 套装ID */
  id: number;
  /** 套装名称 */
  name: string;
  /** 组成套装的装备卡ID列表 */
  idList: number[];
  /** 描述 */
  dec: string[];
  /** 宠物ID列表 */
  petIds: number[];
  /** 简单描述 */
  simpleDec: string[];
  /** 新提示数组0 */
  newTipsArr0: string[];
  /** 新提示数组1 */
  newTipsArr1: string[];
}