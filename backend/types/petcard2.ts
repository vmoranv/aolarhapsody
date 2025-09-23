/**
 * 表示特性晶石
 */
export interface PetCard2 {
  /** 晶石ID */
  cardId: number;
  /** 名称 */
  name: string;
  /** 是否可交易 */
  trade: boolean;
  /** VIP等级 */
  vip: number;
  /** 是否限时 */
  isLimitedTime: boolean;
  /** 价格 */
  price: number;
  /** 人民币价格 */
  rmb: number;
  /** 等级 */
  level: number;
  /** 应用ID */
  applyId: number;
  /** 基础经验 */
  baseExp: number;
  /** 等级经验区间 */
  levelExpArea: number[];
  /** 种族列表 */
  raceList: number[];
  /** 视图ID */
  viewId: number;
  /** 描述信息 */
  description?: string;
}
/**
 * 定义 petcard2data.json 文件中已知的顶级子类
 */
export const PETCARD2_SUBCLASSES = ['data'];
