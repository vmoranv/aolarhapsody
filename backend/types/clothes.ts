/**
 * 表示服装
 */
export interface Clothes {
  /** 服装ID */
  id: number;
  /** 服装名称 */
  name: string;
  /** 是否为VIP服装 */
  vip: boolean;
  /** 售卖状态 */
  sale: number;
  /** 是否可交易 */
  trade: boolean;
  /** 最大数量 */
  maxQuantity: number;
  /** 价格 */
  price: number;
  /** 人民币价格 */
  rmb: number;
  /** 类型 */
  type: number;
  /** 回收价格 */
  recallRmb: number;
  /** 分类 */
  classify: number;
  /** 值 */
  val: number;
}

/**
 * 表示服装套装
 */
export interface ClothesSuit {
  /** 套装ID */
  id: number;
  /** 套装名称 */
  name: string;
  /** 套装包含的服装ID列表 */
  clothesList: number[];
}

/**
 * 表示影响身体部位的服装
 */
export interface ClothesAffectBody {
  /** 服装ID */
  clothesId: number;
  /** 身体部位类型 */
  bodyPartType: number;
}

/**
 * 表示服装部位
 */
export interface ClothesPart {
  /** 部位ID */
  id: number;
  /** 描述 */
  description: string;
}

/**
 * 表示专属服装
 */
export interface ExclusiveClothes {
  /** 服装ID */
  clothesId: number;
}

/**
 * 表示双人姿势配置
 */
export interface DoublePoseClothes {
  /** 姿势ID */
  id: number;
  /** 触发姿势的套装ID数组 */
  originSuitIds: number[];
  /** 姿势名称 */
  name: string;
  /** 解锁所需星币 */
  xingbi: number;
}

/**
 * 定义 clothesdata.json 文件中已知的顶级子类
 */
export const CLOTHES_SUBCLASSES = [
  'data',
  'suit',
  'CLOTHES_AFFECT_BODY',
  'EXCLUSIVE_CLOTHES',
  'doublePosConf',
];
